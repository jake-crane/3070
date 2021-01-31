import axios from "axios";
import cheerio from "cheerio";
import open from "open";
import { setInterval } from "timers";

const openAvailableBestBuyItems = async () => {
    const date = new Date();
    console.log(`Checking bestbuy items ${date.toLocaleTimeString("en-US")} ${date.toLocaleDateString("en-US")}`);
    try {
        const resp = await axios.get(
            "https://www.bestbuy.com/site/searchpage.jsp?_dyncharset=UTF-8&id=pcat17071&iht=y&keys=keys&ks=960&list=n&qp=category_facet%3DGPUs%20%2F%20Video%20Graphics%20Cards~abcat0507002&sc=Global&st=3070%20rtx&type=page&usc=All%20Categories"
        );
        const $ = cheerio.load(resp.data);
        const instockItems = $(".sku-item")
            .toArray()
            .filter(node => $(node).find(".add-to-cart-button:not(.btn-disabled)").length);
        instockItems.forEach((item) => open(`https://www.bestbuy.com${$(item).find("a").attr("href")}`));
    } catch (e) {
        console.error(e);
    }
}

const openAvailableNewEggItems = async () => {
    const date = new Date();
    console.log(`Checking newegg items ${date.toLocaleTimeString("en-US")} ${date.toLocaleDateString("en-US")}`);
    try {
        const resp = await axios.get("https://www.newegg.com/p/pl?d=rtx+3070&N=100006662&LeftPriceRange=0+720");
        const $ = cheerio.load(resp.data);
        const instockItems = $(".item-cell")
            .toArray()
            .filter(node => $(node).find(".btn-primary").length);
        instockItems.forEach((item) => open(`${$(item).find("a").attr("href")}`));
    } catch (e) {
        console.error(e);
    }
}

openAvailableBestBuyItems();
setInterval(openAvailableBestBuyItems, 120_000);

openAvailableNewEggItems();
setInterval(openAvailableNewEggItems, 120_000);
