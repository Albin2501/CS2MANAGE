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

function set(items, failedItems) {
    const caluclate = calculate(items);

    const cache = {
        amount: caluclate.amount,
        date: new Date(),
        dirty: false,
        totalPrice: caluclate.totalPrice,
        totalProfitSCM: caluclate.totalProfitSCM,
        totalProfitSP: caluclate.totalProfitSP,
        failedItems: failedItems,
        items: items
    };

    writeToFile(cache);
}

function calculate(items) {
    const calculate = {
        amount: 0,
        totalPrice: 0,
        totalProfitSCM: 0,
        totalProfitSP: 0
    };

    for (let i = 0; i < items.length; i++) {
        calculate.amount += items[i].amount;
        calculate.totalPrice += items[i].totalPrice;
        calculate.totalProfitSCM += items[i].totalProfitSCM;
        calculate.totalProfitSP += items[i].totalProfitSP;
    }

    calculate.amount = +(calculate.amount.toFixed(2));
    calculate.totalPrice = +(calculate.totalPrice.toFixed(2));
    calculate.totalProfitSCM = +(calculate.totalProfitSCM.toFixed(2));
    calculate.totalProfitSP = +(calculate.totalProfitSP.toFixed(2));

    return calculate;
}

function upToDate() {
    const cache = get();
    let nowMinusOneHour = new Date();
    nowMinusOneHour.setHours(nowMinusOneHour.getHours() - 1);

    return nowMinusOneHour < new Date(cache.date);
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

function eligibleRefetch() {
    const cache = get();
    let nowMinusOneMinute = new Date();
    nowMinusOneMinute.setMinutes(nowMinusOneMinute.getMinutes() - 1);

    return cache.failedItems.length > 0 && nowMinusOneMinute > new Date(cache.date);
}

module.exports = { get, set, calculate, upToDate, dirty, setDirty, eligibleRefetch };

// ------------------------------- HELPER FUNCTIONS -------------------------------

function createFile() {
    const fileTemplate = {
        amount: 0,
        date: new Date(0),
        dirty: false,
        totalPrice: 0,
        totalProfitSCM: 0,
        totalProfitSP: 0,
        failedItems: [],
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
