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

function itemDTOToItem(itemDTO, image, date) {
    const item = {
        id: null,
        name: itemDTO.name,
        image: image,
        date: date ? date : new Date(),
        price: +(itemDTO.price).toFixed(2),
        amount: +(itemDTO.amount).toFixed(2),
        totalPrice: +(itemDTO.price * itemDTO.amount).toFixed(2),
        profileId: itemDTO.profileId
    };

    return item;
}

function itemDTOListToItemList(itemDTOList) {
    const items = [];
    const date = new Date();
    let item;

    // Since new Date() will be the same for many items (because ones PC might be fast enough),
    // ordering those values by date will result to many issues.
    // Therefore, an artifical time creating delay is required.
    // This will not slow down the loop, it can only be observed in the persisted creation date!
    for (let i = 0; i < itemDTOList.length; i++) {
        item = itemDTOToItem(itemDTOList[i], itemDTOList[i].image, new Date(date.setMilliseconds(date.getMilliseconds() + i)));
        items.push(item);
    }

    return items;
}

function itemEditDTOToItem(itemEditDTO) {
    const item = {
        id: itemEditDTO.id,
        price: +(itemEditDTO.price).toFixed(2),
        amount: +(itemEditDTO.amount).toFixed(2),
        totalPrice: +(itemEditDTO.price * itemEditDTO.amount).toFixed(2),
        profileId: itemEditDTO.profileId
    };

    return item;
}

module.exports = { itemDTOToItem, itemToItemDTO, itemDTOListToItemList, itemEditDTOToItem };