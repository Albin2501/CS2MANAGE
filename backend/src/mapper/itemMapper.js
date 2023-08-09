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
        date: new Date(),
        price: +(itemDTO.price).toFixed(2),
        amount: +(itemDTO.amount).toFixed(2),
        totalPrice: +(itemDTO.price * itemDTO.amount).toFixed(2),
        profileId: itemDTO.profileId
    };

    return item;
}

function itemDTOListToItemList(itemDTOList) {
    const items = [];
    let item;

    for (let i = 0; i < itemDTOList.length; i++) {
        item = itemDTOToItem(itemDTOList[i], itemDTOList[i].image);
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