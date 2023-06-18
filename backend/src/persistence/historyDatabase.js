const fs = require('fs');
const filePath = './src/persistence/file/historyDatabase.json';

const binarySearch = require('../util/binarySearch');

// ------------------------------- EXPORTED FUNCTIONS -------------------------------

function get() {
    // if historyDatabase.json does not exist yet, create it
    if (!fs.existsSync(filePath)) writeToFile({ id: 0, history: [] });

    return readFromFile();
}

function set(historyEntry) {
    const historyDatabase = get();
    historyEntry.id = historyDatabase.id;

    // if id already exists, throw error
    if (binarySearch.searchId(historyEntry.id, historyDatabase.history)) throw new Error("Id of historyEntry must be unique.");

    historyDatabase.history.push(historyEntry);
    historyDatabase.id++;
    writeToFile(historyDatabase);
}

function remove(id) {
    const historyDatabase = get();

    for (let i = 0; i < historyDatabase.history.length; i++) {
        if (id == historyDatabase.history[i].id) {
            historyDatabase.history.splice(i, 1);
            writeToFile(historyDatabase);
        }
    }
}

function removeAll(id) {
    writeToFile({ id: 0, history: [] });
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
