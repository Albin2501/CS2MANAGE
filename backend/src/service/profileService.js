const historyService = require('./historyService');
const itemService = require('./itemService');
const profileMapper = require('../mapper/profileMapper');
const historyType = require('../util/historyEntry');
const profileDatabase = require('../persistence/profileDatabase');

// ------------------------------- EXPORTED FUNCTIONS -------------------------------

async function getAllItemsOfProfiles() {
    const allItems = await itemService.getAllItems();
    const profiles = profileDatabase.get();
    let profileId;
    let currentItem;

    for (let i = 0; i < profiles.length; i++) {
        profiles[i].amount = 0;
        profiles[i].totalPrice = 0;
        profiles[i].totalProfitSCM = 0;
        profiles[i].totalProfitSP = 0;
        profiles[i].items = [];
    }

    for (let i = 0; i < allItems.items.length; i++) {
        currentItem = allItems.items[i];
        profileId = currentItem.profileId - 1;

        profiles[profileId].amount += currentItem.amount;
        profiles[profileId].totalPrice += currentItem.totalPrice;
        profiles[profileId].totalProfitSCM += currentItem.totalProfitSCM;
        profiles[profileId].totalProfitSP += currentItem.totalProfitSP;
        profiles[profileId].items.push(currentItem);
    }

    for (let i = 0; i < profiles.length; i++) {
        profiles[i].amount = +(profiles[i].amount.toFixed(2));
        profiles[i].totalPrice = +(profiles[i].totalPrice.toFixed(2));
        profiles[i].totalProfitSCM = +(profiles[i].totalProfitSCM.toFixed(2));
        profiles[i].totalProfitSP = +(profiles[i].totalProfitSP.toFixed(2));
    }

    return profiles;
}

function editProfile(profileDTO) {
    const oldProfile = profileDatabase.getProfile(profileDTO.id);
    const newProfile = profileDatabase.edit(profileMapper.profileDTOToProfile(profileDTO));
    const profileChange = JSON.stringify(oldProfile) != JSON.stringify(newProfile);

    if (profileChange) historyService.postHistoryEntry({ oldProfile: oldProfile, newProfile: newProfile }, historyType.type.EDIT_PROFILE);
}

module.exports = { getAllItemsOfProfiles, editProfile };
