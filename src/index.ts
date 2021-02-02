import axios from "axios";
import cheerio from "cheerio";
import open from "open";
import { setInterval } from "timers";

const addAvailableBestBuyItemsToCart = async () => {
    const date = new Date();
    console.log(`Checking bestbuy items ${date.toLocaleTimeString("en-US")} ${date.toLocaleDateString("en-US")}`);
    try {
        const resp = await axios.get(
            "https://www.bestbuy.com/site/searchpage.jsp?_dyncharset=UTF-8&id=pcat17071&iht=y&keys=keys&ks=960&list=n&qp=category_facet%3DGPUs%20%2F%20Video%20Graphics%20Cards~abcat0507002&sc=Global&st=3070%20rtx&type=page&usc=All%20Categories"
        );
        if (resp.status === 200) {
            const $ = cheerio.load(resp.data);
            const instockItems = $(".sku-item")
                .toArray()
                .filter(node => $(node).find(".add-to-cart-button:not(.btn-disabled)").length);
            if (instockItems.length > 0) {
                console.log('bestbuy item found');
                instockItems.forEach((item) => open(`https://api.bestbuy.com/click/-/${$(item).attr('data-sku-id')}/cart`));
            }
        } else {
            console.log(resp);
        }
    } catch (e) {
        console.error(e);
    }
}

const addAvailableNewEggItemsToCart = async () => {
    const date = new Date();
    console.log(`Checking newegg items ${date.toLocaleTimeString("en-US")} ${date.toLocaleDateString("en-US")}`);
    try {
        const resp = await axios.get("https://www.newegg.com/p/pl?d=rtx+3070&N=100006662&LeftPriceRange=0+720");
        if (resp.status === 200) {
            const $ = cheerio.load(resp.data);
            const instockItems = $(".item-cell")
                .toArray()
                .filter(node => $(node).find(".btn-primary").length);
            if (instockItems.length > 0) {
                console.log('newegg item found');
                instockItems.forEach((item) => {
                    const id = $(item).find('.item-features li:nth-last-child(2)').text().split(': ')[1];
                    open(`https://secure.newegg.com/Shopping/AddtoCart.aspx?Submit=ADD&ItemList=${id}`);
                });
            }
        } else {
            console.log(resp);
        }
    } catch (e) {
        console.error(e);
    }
}

addAvailableBestBuyItemsToCart();
setInterval(addAvailableBestBuyItemsToCart, 10_000);

addAvailableNewEggItemsToCart();
setInterval(addAvailableNewEggItemsToCart, 10_000);
