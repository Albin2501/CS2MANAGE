type type = 'INFO' | 'CREATE_ITEM' | 'DELETE_ITEM' | 'DELETE_ALLITEMS' | 'EDIT_PROFILE';

export interface HistoryEntryDTO {
    id: number;
    date: string;
    contents: string,
    type: type
}
