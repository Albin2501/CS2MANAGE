const fs = require('fs');
const filePath = './src/persistence/file/itemDatabase.json';

const binarySearch = require('../util/binarySearch');

// ------------------------------- EXPORTED FUNCTIONS -------------------------------

function get() {
    // if itemDatabase.json does not exist yet, create it
    if (!fs.existsSync(filePath)) writeToFile({ id: 0, items: [] });

    return readFromFile();
}

function getOverview() {
    // if itemDatabase.json does not exist yet, create it
    if (!fs.existsSync(filePath)) writeToFile({ id: 0, items: [] });

    return readFromFile().items;
}

function set(item) {
    const itemDatabase = get();
    item.id = itemDatabase.id;

    // if id already exists, throw error
    if (binarySearch.searchId(item.id, itemDatabase.items)) throw new Error('Id of item must be unique.');

    itemDatabase.items.unshift(item);
    itemDatabase.id++;
    writeToFile(itemDatabase);
}

function edit(item) {
    const itemDatabase = get();
    const index = binarySearch.searchIdIndex(item.id, itemDatabase.items);

    // if id does not exists, throw error
    if (index == -1) throw new Error('Id of item does not exist.');

    let editedItem = itemDatabase.items[index];

    itemDatabase.items[index].date = item.date;
    itemDatabase.items[index].price = item.price;
    itemDatabase.items[index].amount = item.amount;
    itemDatabase.items[index].totalPrice = item.totalPrice;
    itemDatabase.items[index].profileId = item.profileId;

    writeToFile(itemDatabase);

    return editedItem;
}

function remove(id) {
    const itemDatabase = get();
    const index = binarySearch.searchIdIndex(id, itemDatabase.items);
    let item;

    // if id does not exists, throw error
    if (index == -1) throw new Error('Id of item does not exist.');

    item = itemDatabase.items.splice(index, 1)[0];
    writeToFile(itemDatabase);

    return item;
}

function removeAll(id) {
    writeToFile({ id: 0, items: [] });
}

module.exports = { get, getOverview, set, edit, remove, removeAll };

// ------------------------------- HELPER FUNCTIONS -------------------------------

function readFromFile() {
    return JSON.parse(fs.readFileSync(filePath, 'utf8', (err, data) => {
        if (err) console.log(err);
        return data;
    }))
}

function writeToFile(itemDatabase) {
    fs.writeFileSync(filePath, JSON.stringify(itemDatabase), (err) => {
        if (err) console.log(err);
    });
}
