import axios, { AxiosRequestConfig } from 'axios';
import cheerio from 'cheerio';
import open from 'open';
import { addAvailableBestBuyItemsToCart } from './best-buy';
import { newEggItemInStockDomCheck, newEggLinks } from './new-egg';

const checkItem = async (url: string, checkDom: ($: any) => boolean, axiosConfig: AxiosRequestConfig | undefined) => {
    const date = new Date();
    console.log(`[${date.toLocaleTimeString('en-US')} ${date.toLocaleDateString('en-US')}] Checking item ${url}`);
    try {
        const resp = await axios.get(url, axiosConfig);
        if (resp.status === 200) {
            if (checkDom(cheerio.load(resp.data))) {
                console.log(`item in stock: ${url}`);
                open(url);
            }
        } else {
            console.log(resp);
        }
    } catch (e) {
        console.error(e);
    }
};

const loop = async (index: number, links: string[], checkDom: ($: any) => boolean, axiosConfig: AxiosRequestConfig | undefined = undefined) => {
    await checkItem(links[index], checkDom, axiosConfig);
    const nextIndex = index + 1 >= links.length ? 0 : index + 1;
    setTimeout(() => loop(nextIndex, links, checkDom, axiosConfig), 10_000);
};

loop(0, newEggLinks, newEggItemInStockDomCheck);

addAvailableBestBuyItemsToCart();
setInterval(addAvailableBestBuyItemsToCart, 10_000);

