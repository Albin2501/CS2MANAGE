const historyService = require('./historyService');
const itemMapper = require('../mapper/itemMapper');
const historyType = require('../util/historyEntry');
const itemDatabase = require('../persistence/itemDatabase');
const cache = require('../persistence/cache');

// TODO: profileId of items seems to be a string sometimes?

// ------------------------------- EXPORTED FUNCTIONS -------------------------------

/**
 * Retrieves all items from itemDatabase.json and caches them with SCM/SP prices.
 * Items are being filtered according to the given query parameters.
 * If cache is not up-to-date or dirty (inconsistent) then new SCM/SP prices will be retrieved.
 * @param  {Object} query   Given query parameters
 * @return {Object}         Cache containing metadata and items
 */
async function getAllItems(query) {
    if (!cache.upToDate() || cache.dirty() || query.cacheDirty == 'true') {
        console.log('Cache is not up-to-date. New API-requests will be made.');

        const result = await getToBeCachedItems();
        cache.set(result.items, result.failedItems);
    }

    // check if any items failed and a refetch is required (SCM only)
    if (cache.eligibleRefetch()) {
        console.log('Caching of some items failed. New API-requests will be made.');

        const result = await getToBeRefetchedCachedItems();
        cache.set(result.items, result.failedItems);
    }

    let returnedCache = cache.get();

    // check if any query parameter are set, otherwise return default
    if (query && (query.order || query.sort || query.name)) {
        const order = query.order ? query.order : '';
        const sort = query.sort ? query.sort : '';
        const name = query.name ? query.name.trim().toLowerCase() : '';
        let s1 = order == 'desc' ? -1 : 1;
        let s2 = order == 'desc' ? 1 : -1;

        let items = returnedCache.items;

        items = items.filter(item => item.name.toLowerCase().includes(name)); // this filters unfit items
        if (sort == 'date' || sort == 'name') items = items.sort((a, b) => { return a[sort] < b[sort] ? s2 : s1 });
        else items = items.sort((a, b) => { return s1 * a[sort] + s2 * b[sort] });
        // because the item list could be reduced, the calculations need to be redone
        const calculate = cache.calculate(items);

        returnedCache.amount = calculate.amount;
        returnedCache.totalPrice = calculate.totalPrice;
        returnedCache.totalProfitSCM = calculate.totalProfitSCM;
        returnedCache.totalProfitSP = calculate.totalProfitSP;
        returnedCache.items = items;
    }

    returnedCache.failedItems = returnedCache.failedItems.length;

    // default: date, descending
    return returnedCache;
}

/**
 * Retrieves all items from itemDatabase.json.
 * Items are being filtered according to the given query parameters.
 * @param  {Object} query   Given query parameters
 * @return {Object}         persisted and filtered items
 */
function getAllOverviewItems(query) {
    let items = itemDatabase.getOverview();

    if (query && (query.order || query.sort || query.name)) {
        const order = query.order ? query.order : '';
        const sort = query.sort ? query.sort : '';
        const name = query.name ? query.name.trim().toLowerCase() : '';
        let s1 = order == 'desc' ? -1 : 1;
        let s2 = order == 'desc' ? 1 : -1;

        items = items.filter(item => item.name.toLowerCase().includes(name)); // this filters unfit items
        if (sort == 'date' || sort == 'name') items = items.sort((a, b) => { return a[sort] < b[sort] ? s2 : s1 });
        else items = items.sort((a, b) => { return s1 * a[sort] + s2 * b[sort] });
    }

    items.map(item => {
        item.price = +(item.price.toFixed(2));
        item.amount = +(item.amount.toFixed(2));
        item.totalPrice = +(item.totalPrice.toFixed(2));
    });

    // default: date, descending
    return items;
}

/**
 * Sends mapped object from frontend to the persistence layer so it can be saved. Before it gets persisted,
 * the image of the item will be fetched from steam to assure that the item exists.
 * It does not garantee that the given condition of a skin exists. Only if the image exists,
 * the item will be persisted.
 * If the items are sent in a list, it is expected that the items exists as well as that the
 * image was already retrieved.
 * @param  {Object} itemDTO (List of) object(s) sent from frontend (with steamId when sent as list)
 */
async function postItem(itemDTO) {
    if (Array.isArray(itemDTO.items)) {
        let errorArray = [];
        for (let i = 0; i < itemDTO.items.length; i++) {
            if (!itemDTO.items[i].image) errorArray.push(`'${itemDTO.items[i].name}'`);
        }

        if (errorArray.length > 0) {
            const multiples = errorArray.length > 1;
            throw Error(`Item${multiples ? 's' : ''} ${errorArray.join(', ')} ${multiples ? 'do not' : 'does not'} exist.`);
        }

        const items = itemMapper.itemDTOListToItemList(itemDTO.items);

        itemDatabase.setList(items);
        cache.setDirty();
        historyService.postHistoryEntry(itemDTO.steamId, historyType.type.ADD_INVENTORY);
    } else {
        const noImageCloudFare = 'https://community.cloudflare.steamstatic.com/economy/image//360fx360f';
        const noImageAkamai = 'https://community.akamai.steamstatic.com/economy/image//360fx360f';
        const image = await getImage(itemDTO.name);

        if (!image || image == noImageCloudFare || image == noImageAkamai) throw Error(`Item '${itemDTO.name}' does not exists.`);

        const item = itemMapper.itemDTOToItem(itemDTO, image);

        itemDatabase.set(item);
        cache.setDirty();
        historyService.postHistoryEntry(item, historyType.type.CREATE_ITEM);
    }
}

function edit(itemEditDTO) {
    const newItem = itemMapper.itemEditDTOToItem(itemEditDTO);
    const oldItem = itemDatabase.edit(newItem);

    cache.setDirty();
    historyService.postHistoryEntry({ newItem: newItem, oldItem: oldItem }, historyType.type.EDIT_ITEM);
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

module.exports = { getAllItems, getAllOverviewItems, postItem, edit, deleteItem, deleteAllItems };

// ------------------------------- HELPER FUNCTIONS -------------------------------

const jsdom = require("jsdom");

const steamImageURI = 'https://steamcommunity.com/market/listings/730/';
const steamSCMURI = 'https://steamcommunity.com/market/priceoverview/?appid=730&currency=3&market_hash_name=';
const skinportURI = 'https://api.skinport.com/v1/items';

async function getToBeCachedItems() {
    const allItems = itemDatabase.get().items;
    const decisionSPConstant = 2; // chosen at random
    let toBeCached = [];
    let failedItems = [];
    let possiblePriceSCM, priceSCM, possibleItemSP, priceSP, linkSCM, linkSP;
    let priceSPEverything = await getPriceSPEverything();
    let decisionSP;
    let failedSCM;

    // calculated price are median_price (SCM) and suggested_price (sometimes min_price) (SP)
    for (let i = 0; i < allItems.length; i++) {
        possiblePriceSCM = await getPriceSCM(allItems[i].name);
        failedSCM = false;

        filteredArray = priceSPEverything.filter(item => allItems[i].name.localeCompare(item.market_hash_name) == 0);
        possibleItemSP = filteredArray.length > 0 ? filteredArray[0] : null;

        if (possiblePriceSCM && possiblePriceSCM.success && (possiblePriceSCM.median_price || possiblePriceSCM.lowest_price)) {
            priceSCM = possiblePriceSCM.median_price ? getNumberFromSCMString(possiblePriceSCM.median_price) : getNumberFromSCMString(possiblePriceSCM.lowest_price);
            linkSCM = steamImageURI + allItems[i].name;
        } else {
            failedSCM = true;
            priceSCM = null;
            linkSCM = null;
        }

        if (possibleItemSP) {
            // some items will have inaccurate suggested prices, therefore the minimal price will be taken in those occasions
            decisionSP = possibleItemSP.min_price * decisionSPConstant > possibleItemSP.suggested_price;
            priceSP = decisionSP ? possibleItemSP.suggested_price : possibleItemSP.min_price;
            linkSP = possibleItemSP.market_page + getQueryParams(allItems[i].name);
        } else {
            console.log(`The item ${allItems[i].name} could not be fetched from SP.`);
            priceSP = null;
            linkSP = null;
        }

        if (failedSCM) failedItems.push(itemMapper.itemToItemDTO(allItems[i], priceSCM, priceSP, linkSCM, linkSP));
        toBeCached.push(itemMapper.itemToItemDTO(allItems[i], priceSCM, priceSP, linkSCM, linkSP));
    }

    return { items: toBeCached, failedItems: failedItems };
}

async function getToBeRefetchedCachedItems() {
    const currentCache = cache.get();
    let toBeCached = currentCache.items;
    let failedItems = currentCache.failedItems;
    let failedItemsNew = [];
    let possiblePriceSCM, priceSCM, linkSCM;
    let itemDTO;
    let dup;

    for (let i = 0; i < failedItems.length; i++) {
        possiblePriceSCM = await getPriceSCM(failedItems[i].name);

        if (possiblePriceSCM && possiblePriceSCM.success && (possiblePriceSCM.median_price || possiblePriceSCM.lowest_price)) {
            priceSCM = possiblePriceSCM.median_price ? getNumberFromSCMString(possiblePriceSCM.median_price) : getNumberFromSCMString(possiblePriceSCM.lowest_price);
            linkSCM = steamImageURI + failedItems[i].name;
            itemDTO = itemMapper.itemToItemDTO(failedItems[i], priceSCM, failedItems[i].priceSP, linkSCM, failedItems[i].linkSP);
            dup = false;

            // check for duplicate
            for (let j = 0; j < toBeCached.length; j++) {
                if (toBeCached[j].id == failedItems[i].id) {
                    toBeCached[j] = itemDTO;
                    dup = true;
                }
            }

            if (!dup) toBeCached.push(itemDTO);
        } else {
            priceSCM = null;
            linkSCM = null;
            failedItemsNew.push(itemMapper.itemToItemDTO(failedItems[i], priceSCM, failedItems[i].priceSP, linkSCM, failedItems[i].linkSP));
        }
    }

    return { items: toBeCached, failedItems: failedItemsNew };
}

async function getPriceSCM(name) {
    try {
        return await (await fetch(encodeURI(steamSCMURI + name))).json();
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
    return [];
}

async function getImage(name) {
    try {
        const document = (await jsdom.JSDOM.fromURL(encodeURI(steamImageURI + name))).window.document;
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
