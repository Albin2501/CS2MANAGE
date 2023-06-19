import { ItemDetailDTO } from './itemDetailDTO';

export interface ProfileSummaryDTO {
    id: number;
    name: string,
    description: string,
    amount: number,
    totalPrice: number,
    totalProfitSCM: number,
    totalProfitSP: number,
    items: ItemDetailDTO[]
}
