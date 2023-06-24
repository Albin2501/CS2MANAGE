const fs = require('fs');
const filePath = './src/persistence/file/itemDatabase.json';

const binarySearch = require('../util/binarySearch');

// ------------------------------- EXPORTED FUNCTIONS -------------------------------

function get() {
    // if itemDatabase.json does not exist yet, create it
    if (!fs.existsSync(filePath)) writeToFile({ id: 0, items: [] });

    return readFromFile();
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

function remove(id) {
    const itemDatabase = get();
    let item;

    for (let i = 0; i < itemDatabase.items.length; i++) {
        if (id == itemDatabase.items[i].id) {
            item = itemDatabase.items.splice(i, 1)[0];
            writeToFile(itemDatabase);
        }
    }

    return item;
}

function removeAll(id) {
    writeToFile({ id: 0, items: [] });
}

module.exports = { get, set, remove, removeAll };

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
