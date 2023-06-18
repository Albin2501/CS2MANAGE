const fs = require('fs');
const filePath = './src/persistence/file/profileDatabase.json';

const binarySearch = require('../util/binarySearch');

// ------------------------------- EXPORTED FUNCTIONS -------------------------------

function get() {
    // if profileDatabase.json does not exist yet, create it
    if (!fs.existsSync(filePath)) {
        const array = new Array(5);

        for (let i = 0; i < array.length; i++) {
            array[i] = {
                id: i + 1,
                name: 'Profile ' + (i + 1),
                description: 'Description of this profile.'
            }
        }

        writeToFile(array);
    }

    return readFromFile();
}

function getProfile(id) {
    const profileDatabase = get();
    return profileDatabase[id];
}

function edit(profile) {
    const profileDatabase = get();

    // if id doesn not exist, throw error
    if (!binarySearch.searchId(profile.id, profileDatabase)) throw new Error(`Id of profile does not exist (${profile.id}).`);

    profileDatabase[profile.id].name = profile.name;
    profileDatabase[profile.id].description = profile.description;

    writeToFile(profileDatabase);
    return profileDatabase[profile.id];
}

module.exports = { get, getProfile, edit };

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
