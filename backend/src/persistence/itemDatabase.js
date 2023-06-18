const fs = require('fs');
const filePath = './src/persistence/file/itemDatabase.json';

// ------------------------------- EXPORTED FUNCTIONS -------------------------------

function get() {
    // if database.json does not exist yet, create it
    if (!fs.existsSync(filePath)) writeToFile([]);

    return readFromFile();
}

function set(item) {
    const itemDatabase = get();

    for (let i = 0; i < itemDatabase.length; i++) {
        if (item.id == itemDatabase[i].id) throw error("ID of item must be unique.");
    }

    itemDatabase.push(item);
    writeToFile(itemDatabase);
}

function remove(id) {
    const itemDatabase = get();

    for (let i = 0; i < itemDatabase.length; i++) {
        if (id == itemDatabase[i].id) {
            console.log(id);
            console.log(i);
            itemDatabase.splice(i, 1);
            writeToFile(itemDatabase);
        }
    }
}

function removeAll(id) {
    writeToFile([]);
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
