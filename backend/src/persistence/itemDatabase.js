const fs = require('fs');
const filePath = './src/persistence/file/itemDatabase.json';

// ------------------------------- EXPORTED FUNCTIONS -------------------------------

function get() {
    // if database.json does not exist yet, create it
    if (!fs.existsSync(filePath)) createFile();

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

module.exports = { get, set };

// ------------------------------- HELPER FUNCTIONS -------------------------------

function createFile() {
    fs.writeFileSync(filePath, "[]", (err) => {
        if (err) console.log(err);
    });
}

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
