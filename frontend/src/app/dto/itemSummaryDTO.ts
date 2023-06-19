import { ItemDetailDTO } from './itemDetailDTO';

export interface ItemSummaryDTO {
    amount: number,
    date: Date,
    dirty: boolean,
    totalPrice: number,
    totalProfitSCM: number,
    totalProfitSP: number,
    items: ItemDetailDTO[]
}
