// ------------------------------- EXPORTED FUNCTIONS -------------------------------

function searchId(id, result) {
    let m = 0;
    let n = result.length - 1;

    while (m <= n) {
        let k = (n + m) >> 1;
        let cmp = compareNumbers(id, result[k].id);

        if (cmp > 0) {
            m = k + 1;
        } else if (cmp < 0) {
            n = k - 1;
        } else {
            return true;
        }
    }
    return false;
}

function searchIdIndex(id, result) {
    let m = 0;
    let n = result.length - 1;

    while (m <= n) {
        let k = (n + m) >> 1;
        let cmp = compareNumbers(id, result[k].id);

        if (cmp > 0) {
            m = k + 1;
        } else if (cmp < 0) {
            n = k - 1;
        } else {
            return k;
        }
    }
    return -1;
}

module.exports = { searchId, searchIdIndex };

// ------------------------------- HELPER FUNCTIONS -------------------------------

function compareNumbers(a, b) {
    if (a < b) return 1;
    else if (a > b) return -1;
    return 0;
}
