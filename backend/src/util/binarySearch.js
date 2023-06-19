// ------------------------------- EXPORTED FUNCTIONS -------------------------------

function searchItemSP(name, result) {
    if (result && result.errors) return null;
    let m = 0;
    let n = result.length - 1;

    while (m <= n) {
        let k = (n + m) >> 1;
        let cmp = name.localeCompare(result[k].market_hash_name);

        if (cmp > 0) {
            m = k + 1;
        } else if (cmp < 0) {
            n = k - 1;
        } else {
            return result[k];
        }
    }

    return null;
}

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

module.exports = { searchItemSP, searchId };

// ------------------------------- HELPER FUNCTIONS -------------------------------

function compareNumbers(a, b) {
    if (a < b) return -1;
    else if (a > b) return 1;
    return 0;
}
