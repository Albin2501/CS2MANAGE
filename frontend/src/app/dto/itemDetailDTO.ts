export interface ItemDetailDTO {
    id: number,
    name: string,
    image: string,
    linkSCM: string,
    linkSP: string,
    date: Date,
    price: number,
    priceSCM: number,
    priceSP: number,
    amount: number,
    totalPrice: number,
    totalProfitSCM: number,
    totalProfitSP: number,
    profileId: number
}
