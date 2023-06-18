const fs = require('fs');
const filePath = './src/persistence/file/cache.json';

// ------------------------------- EXPORTED FUNCTIONS -------------------------------

function get() {
    // if cache.json does not exist yet, create it
    if (!fs.existsSync(filePath)) createFile();

    return JSON.parse(fs.readFileSync(filePath, 'utf8', (err, data) => {
        if (err) console.log(err);
        return data;
    }));
}

function set(items) {
    let amount = 0;
    let totalPrice = 0;
    let totalProfitSCM = 0;
    let totalProfitSP = 0;

    for (let i = 0; i < items.length; i++) {
        amount += items[i].amount;
        totalPrice += items[i].totalPrice;
        totalProfitSCM += items[i].totalProfitSCM;
        totalProfitSP += items[i].totalProfitSP;
    }

    amount = +(amount.toFixed(2));
    totalPrice = +(totalPrice.toFixed(2));
    totalProfitSCM = +(totalProfitSCM.toFixed(2));
    totalProfitSP = +(totalProfitSP.toFixed(2));

    const cache = {
        amount: amount,
        date: new Date(),
        dirty: false,
        totalPrice: totalPrice,
        totalProfitSCM: totalProfitSCM,
        totalProfitSP: totalProfitSP,
        items: items
    };

    writeToFile(cache);
}

function upToDate() {
    const cache = get();
    let nowMinusOneHour = new Date();
    nowMinusOneHour.setHours(nowMinusOneHour.getHours() - 1);
    return nowMinusOneHour < cache.date;
}

function dirty() {
    const cache = get();
    return cache.dirty;
}

function setDirty() {
    const cache = get();
    cache.dirty = true;
    writeToFile(cache);
}

module.exports = { get, set, upToDate, dirty, setDirty };

// ------------------------------- HELPER FUNCTIONS -------------------------------

function createFile() {
    const fileTemplate = {
        amount: 0,
        date: new Date(0),
        dirty: false,
        totalPrice: 0,
        totalProfitSCM: 0,
        totalProfitSP: 0,
        items: []
    };

    fs.writeFileSync(filePath, JSON.stringify(fileTemplate), (err) => {
        if (err) console.log(err);
    });
}

function writeToFile(cache) {
    fs.writeFileSync(filePath, JSON.stringify(cache), (err) => {
        if (err) console.log(err);
    });
}
