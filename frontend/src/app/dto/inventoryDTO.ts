import { ItemCreateDTO } from './itemCreateDTO';

export interface InventoryDTO {
    steamId: string,
    items: ItemCreateDTO[]
}