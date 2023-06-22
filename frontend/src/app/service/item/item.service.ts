import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

import { backendBase } from '../../util/config';
import { ItemSummaryDTO } from 'src/app/dto/itemSummaryDTO';
import { ItemDTO } from 'src/app/dto/itemDTO';

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  itemBase = backendBase + '/item';

  constructor(private http: HttpClient) { }

  get(): Observable<ItemSummaryDTO> {
    return this.http.get<ItemSummaryDTO>(this.itemBase + '/get');
  }

  post(itemDTO: ItemDTO): Observable<void> {
    return this.http.post<void>(this.itemBase + '/post', itemDTO);
  }

  delete(id: number): Observable<void> {
    const options = id ? { params: new HttpParams().set('id', id) } : {};
    return this.http.delete<void>(this.itemBase + '/delete', options);
  }

  deleteAll(): Observable<void> {
    return this.http.delete<void>(this.itemBase + '/deleteAll');
  }
}
