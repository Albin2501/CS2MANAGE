const userMapper = require('../mapper/userMapper');
const userDatabase = require('../persistence/userDatabase');

// TODO: Check what happens, when inventory is set to private

// ------------------------------- EXPORTED FUNCTIONS -------------------------------

function getUserInfo() {
    return userDatabase.get();
}

/**
 * Retrieves all items from the specified steam inventory.
 * @param   {boolean} group     if 0 then items with identical names do not get grouped, else they do
 * @returns {Object}            Cache containing metadata and items
 */
async function getSteamItems(group) {
    const allItems = await getSteamInvetory();

    console.log(allItems);

    // if too many calls were made, throw error
    if (!allItems) throw new Error('Steam inventory can not be retrieved. Try again later.');

    const allAssets = allItems.assets;
    const allDescriptions = allItems.descriptions;
    const filteredItems = [];
    let item, dups, classId, reps, amount;

    const existingAssets = new Map();

    // checks for duplicates
    for (let i = 0; i < allAssets.length; i++) {
        classId = allAssets[i].classid;
        if (existingAssets.has(classId)) existingAssets.set(classId, existingAssets.get(classId) + 1);
        else existingAssets.set(classId, 1);
    }

    for (let i = 0; i < allDescriptions.length; i++) {
        if (allDescriptions[i].marketable) {
            dups = existingAssets.get(allDescriptions[i].classid);
            reps = group ? 1 : dups;
            amount = group ? dups : 1;

            for (let j = 0; j < reps; j++) {
                item = {
                    name: allDescriptions[i].market_hash_name,
                    image: imageBaseURI + allDescriptions[i].icon_url,
                    amount: amount
                };
                filteredItems.push(item);
            }
        }
    }

    return filteredItems;
}

function editUserInfo(userInfoDTO) {
    const steamId = userInfoDTO.steamId.toString();
    if (!(steamId.length == 17 && steamId.startsWith('76561198')))
        throw new Error('Format of SteamId is incorrect. Make sure that your inventory is public. Try again later.');

    return userDatabase.edit(userMapper.userInfoDTOToUserInfo(userInfoDTO));
}

module.exports = { getUserInfo, getSteamItems, editUserInfo };

// ------------------------------- HELPER FUNCTIONS -------------------------------

const steamInventoryURI = `https://steamcommunity.com/inventory/steamId/730/2`;
const imageBaseURI = 'https://community.cloudflare.steamstatic.com/economy/image/';

async function getSteamInvetory() {
    const steamId = userDatabase.get().steamId.toString();
    try {
        return await (await fetch(encodeURI(steamInventoryURI.replace('steamId', steamId)))).json();
    } catch (err) {
        console.log(err);
    }
    return null;
}