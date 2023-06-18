const historyEntryMapper = require('../mapper/historyEntryMapper');
const historyDatabase = require('../persistence/historyDatabase');

// ------------------------------- EXPORTED FUNCTIONS -------------------------------

function getHistory() {
    return historyDatabase.get().history;
}

function postHistoryEntry(item, type) {
    historyDatabase.set(historyEntryMapper.dataToHistoryEntry(item, type));
}

function deleteHistoryEntry(id) {
    historyDatabase.remove(id);
}

function deleteHistory() {
    historyDatabase.removeAll();
}

module.exports = { getHistory, postHistoryEntry, deleteHistoryEntry, deleteHistory };
