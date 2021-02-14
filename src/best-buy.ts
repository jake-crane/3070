import axios, { AxiosRequestConfig } from 'axios';
import cheerio from 'cheerio';
import { playNotificationSound } from './play-notification-sound';

export const addAvailableBestBuyItemsToCart = async () => {
    const date = new Date();
    console.log(`Checking bestbuy items ${date.toLocaleTimeString('en-US')} ${date.toLocaleDateString('en-US')}`);
    try {
        const resp = await axios.get(
            'https://www.bestbuy.com/site/searchpage.jsp?_dyncharset=UTF-8&id=pcat17071&iht=y&keys=keys&ks=960&list=n&qp=category_facet%3DGPUs%20%2F%20Video%20Graphics%20Cards~abcat0507002&sc=Global&st=3070%20rtx&type=page&usc=All%20Categories'
        );
        if (resp.status === 200) {
            const $ = cheerio.load(resp.data);
            const instockItems = $('.sku-item')
                .toArray()
                .filter(node => $(node).find('.add-to-cart-button:not(.btn-disabled)').length);
            if (instockItems.length > 0) {
                console.log('bestbuy item found');
                instockItems.forEach((item) => open(`https://api.bestbuy.com/click/-/${$(item).attr('data-sku-id')}/cart`));
                playNotificationSound();
            }
        } else {
            console.log(resp);
        }
    } catch (e) {
        console.error(e);
    }
}