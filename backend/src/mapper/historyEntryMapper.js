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
    let responseString = 'Something went wrong ...';

    if (type == historyEntry.type.CREATE_ITEM) {
        responseString = `The item ${item.name} (Price: ${item.price}, Amount: ${item.amount}) has been added.`;
    } else if (type == historyEntry.type.INFO) {
        responseString = 'TODO'
    } else if (type == historyEntry.type.DELETE_ITEM) {
        responseString = `The item ${item.name} (Price: ${item.price}, Amount: ${item.amount}) has been deleted.`;
    } else if (type == historyEntry.type.DELETE_ALLITEMS) {
        responseString = 'Every item has been deleted.';
    } else if (type == historyEntry.type.EDIT_PROFILE) {
        const newName = item.oldProfile.name != item.newProfile.name;
        const newDescription = item.oldProfile.description != item.newProfile.description;

        if (newName) {
            const text1 = newName ? `'${item.oldProfile.name}'` + ' was renamed to ' + `'${item.newProfile.name}'` : '';
            const text2 = (newName && newDescription) ? ' and ' : '.';
            const text3 = newDescription ? 'its description changed.' : '';

            responseString = text1 + text2 + text3;
        } else if (newDescription) {
            responseString = `The description of '${item.oldProfile.name}' changed.`;
        }
    }

    return responseString;
}
