// ------------------------------- EXPORTED FUNCTIONS -------------------------------

function itemToItemDTO(item, priceSCM, priceSP, linkSCM, linkSP) {
    const itemDTO = {
        id: item.id,
        name: item.name,
        image: item.image,
        linkSCM: linkSCM,
        linkSP: linkSP,
        date: item.date,
        price: item.price,
        priceSCM: priceSCM,
        priceSP: priceSP,
        amount: item.amount,
        totalPrice: item.totalPrice,
        totalProfitSCM: priceSCM ? +((((priceSCM / 1.15 - 0.01) - item.price) * item.amount).toFixed(2)) : priceSCM,
        totalProfitSP: priceSP ? (priceSP >= 1000 ? +((((priceSP * 0.94) - item.price) * item.amount).toFixed(2)) : +((((priceSP * 0.88) - item.price) * item.amount).toFixed(2))) : priceSP,
        profileId: item.profileId
    };

    return itemDTO;
}

function itemDTOToItem(itemDTO, image) {
    const item = {
        id: null,
        name: itemDTO.name,
        image: image,
        date: itemDTO.date,
        price: itemDTO.price,
        amount: itemDTO.amount,
        totalPrice: itemDTO.price * itemDTO.amount,
        profileId: itemDTO.profileId
    };

    return item;
}

module.exports = { itemDTOToItem, itemToItemDTO };