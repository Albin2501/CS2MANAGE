// ------------------------------- EXPORTED FUNCTIONS -------------------------------

function search(name, result) {
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
    return -1;
}

module.exports = { search };
