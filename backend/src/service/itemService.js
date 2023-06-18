const historyService = require('./historyService');
const itemMapper = require('../mapper/itemMapper');
const historyType = require('../util/historyEntry');
const itemDatabase = require('../persistence/itemDatabase');
const cache = require('../persistence/cache');

const binarySearch = require('../util/binarySearch');

// ------------------------------- EXPORTED FUNCTIONS -------------------------------

async function getAllItems() {
    if (!cache.upToDate() || cache.dirty()) {
        // if cache is not up-to-date / dirty (inconsistent with itemDatabase) then get new SCM and SP prices
        const allItems = itemDatabase.get().items;
        let toBeCached = [];
        let priceSCM;
        let priceSP;
        let itemSP;
        let priceSPEverything = await getPriceSPEverything();

        // calculated price are median_price (SCM) and suggested_price (SP)
        for (let i = 0; i < allItems.length; i++) {
            priceSCM = (await getPriceSCM(allItems[i].name)).median_price;
            itemSP = binarySearch.searchItemSP(allItems[i].name, priceSPEverything);
            priceSP = itemSP.suggested_price;
            linkSCM = "https://steamcommunity.com/market/listings/730/" + allItems[i].name;
            linkSP = itemSP.market_page + "&sort=price&order=asc";

            toBeCached.push(itemMapper.itemToItemDTO(allItems[i], priceSCM ? +priceSCM.split('€')[0].replace(',', '.') : priceSCM, priceSP, linkSCM, linkSP));
        }

        cache.set(toBeCached);
    }

    return cache.get();
}

async function postItem(itemDTO) {
    const image = await getImage(itemDTO.name);
    const item = itemMapper.itemDTOToItem(itemDTO, image);

    itemDatabase.set(item);
    cache.setDirty();
    historyService.postHistoryEntry(item, historyType.type.CREATE_ITEM);
}

function deleteItem(id) {
    const item = itemDatabase.remove(id);

    cache.setDirty();
    if (item) historyService.postHistoryEntry(item, historyType.type.DELETE_ITEM);
}

function deleteAllItems() {
    itemDatabase.removeAll();

    cache.setDirty();
    historyService.postHistoryEntry(null, historyType.type.DELETE_ALLITEMS);
}

module.exports = { getAllItems, postItem, deleteItem, deleteAllItems };

// ------------------------------- HELPER FUNCTIONS -------------------------------

const jsdom = require("jsdom");

const steamImageURI = 'https://steamcommunity.com/market/listings/730/';
const steamSCMURI = 'https://steamcommunity.com/market/priceoverview/?appid=730&currency=3&market_hash_name=';
const skinportURI = 'https://api.skinport.com/v1/items';

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