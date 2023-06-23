const historyService = require('./historyService');
const itemMapper = require('../mapper/itemMapper');
const historyType = require('../util/historyEntry');
const itemDatabase = require('../persistence/itemDatabase');
const cache = require('../persistence/cache');

// ------------------------------- EXPORTED FUNCTIONS -------------------------------

/**
 * Retrieves all items from itemDatabase.json and caches them with SCM/SP prices.
 * Items are being filtered according to the given query parameters.
 * If cache is not up-to-date or dirty (inconsistent) then new SCM/SP prices will be retrieved.
 * @param  {Object} query   Given query parameters
 * @return {Object}         Cache containing metadata and items
 */
async function getAllItems(query) {
    if (!cache.upToDate() || cache.dirty()) {
        console.log('Cache is not up-to-date. New API-requests will be made.');

        const toBeCached = await getToBeCachedItems();
        cache.set(toBeCached);
    }

    query = query ? query : {};
    const order = query.order ? query.order : '';
    const sort = query.sort ? query.sort : '';
    const name = query.name ? query.name : '';
    let s1 = order == 'desc' ? -1 : 1;
    let s2 = order == 'desc' ? 1 : -1;

    const toBeFilteredCache = cache.get();
    let items = toBeFilteredCache.items;

    items = items.filter(item => item.name.includes(name));
    if (sort == 'date' || sort == 'name') items = items.sort((a, b) => { return a[sort] < b[sort] ? s2 : s1 });
    else items = items.sort((a, b) => { return s1 * a[sort] + s2 * b[sort] });
    toBeFilteredCache.items = items;

    return toBeFilteredCache;
}

/**
 * Sends mapped object from frontend to the persistence layer so it can be saved. Before it gets persisted,
 * the image of the item will be fetched from steam to assure that the item exists. Only if the image exists,
 * the item will be persisted.
 * @param  {Object} itemDTO Object send from frontend
 */
async function postItem(itemDTO) {
    const noImage = 'https://community.cloudflare.steamstatic.com/economy/image//360fx360f';
    const image = await getImage(itemDTO.name);

    if (image == noImage) {
        console.log(`Item '${itemDTO.name}' does not exists.`);
        return;
    }

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

async function getToBeCachedItems() {
    const allItems = itemDatabase.get().items;
    let toBeCached = [];
    let possiblePriceSCM, priceSCM, possibleItemSP, priceSP;
    let priceSPEverything = await getPriceSPEverything();

    // calculated price are median_price (SCM) and suggested_price (SP)
    for (let i = 0; i < allItems.length; i++) {
        possiblePriceSCM = await getPriceSCM(allItems[i].name);

        filteredArray = priceSPEverything.filter(item => allItems[i].name.localeCompare(item.market_hash_name) == 0);
        possibleItemSP = filteredArray.length > 0 ? filteredArray[0] : null;

        if (possiblePriceSCM && possiblePriceSCM.success) {
            priceSCM = possiblePriceSCM.median_price ? getNumberFromSCMString(possiblePriceSCM.median_price) : getNumberFromSCMString(possiblePriceSCM.lowest_price);
            linkSCM = 'https://steamcommunity.com/market/listings/730/' + allItems[i].name;
        } else {
            console.log(`The item ${allItems[i].name} could not be fetched from SCM.`);
            priceSCM = null;
            linkSCM = null;
        }

        if (possibleItemSP) {
            priceSP = possibleItemSP.suggested_price;
            linkSP = possibleItemSP.market_page + getQueryParams(allItems[i].name);
        } else {
            console.log(`The item ${allItems[i].name} could not be fetched from SP.`);
            priceSP = null;
            linkSP = null;
        }

        toBeCached.push(itemMapper.itemToItemDTO(allItems[i], priceSCM, priceSP, linkSCM, linkSP));
    }
    return toBeCached;
}

async function getPriceSCM(name) {
    try {
        return await (await fetch(encodeURI(steamSCMURI + name))).json(); // TODO
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

function getNumberFromSCMString(value) {
    return +(value.replace(' ', '').replace(',', '.').replaceAll('-', '0').replace('€', ''));
}

function getQueryParams(name) {
    let query = '&sort=price&order=asc';
    let weapon = false;
    let conditions = {
        1: '(Battle-Scarred)',
        2: '(Factory New)',
        3: '(Field-Tested)',
        4: '(Minimal Wear)',
        5: '(Well-Worn)'
    };

    for (let i = 1; i <= Object.keys(conditions).length; i++) {
        if (name.endsWith(conditions[i])) {
            query += '&exterior=' + i;
            weapon = true;
        }
    }

    if (weapon) {
        if (name.includes('StatTrak™')) query += '&stattrak=1';
        else query += '&stattrak=0';
        if (name.includes('Souvenir')) query += '&souvenir=1';
        else query += '&souvenir=0';
    }

    return query;
}
