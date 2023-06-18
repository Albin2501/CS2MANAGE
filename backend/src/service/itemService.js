const itemDatabase = require('../persistence/itemDatabase');
const cache = require('../persistence/cache');

const itemMapper = require('../mapper/itemMapper');
const binarySearch = require('../util/binarySearch');

// ------------------------------- EXPORTED FUNCTIONS -------------------------------

async function getAllItems() {
    if (!cache.upToDate() || cache.dirty()) {
        // if cache is not up-to-date / dirty (inconsistent with itemDatabase) then get new SCM and SP prices
        const allItems = itemDatabase.get();
        let toBeCached = [];
        let priceSCM;
        let priceSP;
        let priceSPEverything = await getPriceSPEverything();

        // calculated price are median_price (SCM) and suggested_price (SP)
        for (let i = 0; i < allItems.length; i++) {
            priceSCM = (await getPriceSCM(allItems[i].name)).median_price;
            priceSP = binarySearch.search(allItems[i].name, priceSPEverything).suggested_price;

            toBeCached.push(itemMapper.itemToItemDTO(allItems[i], priceSCM ? +priceSCM.split('€')[0].replace(',', '.') : priceSCM, priceSP));
        }

        cache.set(toBeCached);
    }

    return cache.get();
}

async function postItem(itemDTO) {
    const id = generateID();
    const image = await getImage(itemDTO.name);

    itemDatabase.set(itemMapper.itemDTOToItem(itemDTO, id, image));
    cache.setDirty();
}

module.exports = { getAllItems, postItem };

// ------------------------------- HELPER FUNCTIONS -------------------------------

const jsdom = require("jsdom");

const steamImageURI = 'https://steamcommunity.com/market/listings/730/';
const steamSCMURI = 'https://steamcommunity.com/market/priceoverview/?appid=730&currency=3&market_hash_name=';
const skinportURI = 'https://api.skinport.com/v1/items';

function generateID() {
    return Math.trunc(Math.random() * Math.pow(2, 20));
}

async function getPriceSCM(name) {
    try {
        return await (await fetch(steamSCMURI + name)).json();
    } catch (err) {
        console.log(err);
    }
    return null;
}

async function getPriceSPEverything() {
    try {
        return await (await fetch(skinportURI)).json();
    } catch (err) {
        console.log(err);
    }
    return null;
}

async function getImage(name) {
    try {
        const document = (await jsdom.JSDOM.fromURL(steamImageURI + name)).window.document;
        let image;

        document.querySelectorAll('link[rel=image_src]').forEach(link => {
            image = link.href;
        });

        return image;
    } catch (err) {
        console.log(err);
    }
    return null;
}