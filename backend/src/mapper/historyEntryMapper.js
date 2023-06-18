const historyEntry = require('../util/historyEntry');

// ------------------------------- EXPORTED FUNCTIONS -------------------------------

function dataToHistoryEntry(item, type) {
    const historyEntry = {
        id: -1,
        date: new Date(),
        contents: createContentsFromItem(item, type),
        type: type
    }

    return historyEntry;
}

module.exports = { dataToHistoryEntry };

// ------------------------------- HELPER FUNCTIONS -------------------------------

function createContentsFromItem(item, type) {
    let responseString;

    if (type == historyEntry.type.CREATE) {
        responseString = `The item ${item.name} (Price: ${item.price}, Amount: ${item.amount}) has been added.`;
    } else if (type == historyEntry.type.INFO) {
        responseString = 'TODO'
    } else if (type == historyEntry.type.DELETE) {
        responseString = `The item ${item.name} (Price: ${item.price}, Amount: ${item.amount}) has been deleted.`;
    } else if (type == historyEntry.type.DELETEALL) {
        responseString = 'Every item has been deleted.';
    } else {
        responseString = 'Something went wrong ...';
    }

    return responseString;
}
