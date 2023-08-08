const fs = require('fs');
const filePath = './src/persistence/file/userDatabase.json';

// ------------------------------- EXPORTED FUNCTIONS -------------------------------

function get() {
    // if userDatabase.json does not exist yet, create it
    if (!fs.existsSync(filePath)) writeToFile({ name: '', steamId: '' });

    return readFromFile();
}

function edit(userInfo) {
    const userDatabase = get();

    let editedInfo = JSON.parse(JSON.stringify(userDatabase));

    // if nothing changed, throw error
    if (userDatabase.name == userInfo.name &&
        userDatabase.steamId == userInfo.steamId)
        throw new Error('Different values required for edit of user information.');

    userDatabase.name = userInfo.name;
    userDatabase.steamId = userInfo.steamId;

    writeToFile(userDatabase);

    return editedInfo;
}

module.exports = { get, edit };

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
