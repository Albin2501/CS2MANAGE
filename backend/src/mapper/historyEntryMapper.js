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

    if (type == historyEntry.type.INFO) {
        responseString = 'TODO';
    } else if (type == historyEntry.type.CREATE_ITEM) {
        responseString = `Item '${item.name}' (${item.price}€ / ${item.amount}) has been added.`;
    } else if (type == historyEntry.type.EDIT_ITEM) {
        const newPrice = item.newItem.price != item.oldItem.price;
        const newAmount = item.newItem.amount != item.oldItem.amount;
        const newProfileId = item.newItem.profileId != item.oldItem.profileId;

        responseString = `'${item.oldItem.name}'`;
        if (newPrice || newAmount) responseString += ' changed from ' + `(${item.oldItem.price}€ / ${item.oldItem.amount}) to (${item.newItem.price}€ / ${item.newItem.amount})`;
        if ((newPrice || newAmount) && newProfileId) responseString += ' and ';
        if ((newPrice || newAmount) && !newProfileId) responseString += '.';
        if (newProfileId) responseString += ' is now under a different profile.';

        return responseString;
    } else if (type == historyEntry.type.DELETE_ITEM) {
        responseString = `Item '${item.name}' (${item.price}€ / ${item.amount}) has been deleted.`;
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
    } else if (type == historyEntry.type.ADD_INVENTORY) {
        responseString = `Invetory of steam user '${item}' has been added.`;
    }

    return responseString;
}
