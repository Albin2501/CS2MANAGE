import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

import { backendBase } from '../../util/config';
import { ItemSummaryDTO } from 'src/app/dto/itemSummaryDTO';
import { ItemDTO } from 'src/app/dto/itemDTO';

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  itemBase = backendBase + '/item';

  constructor(private http: HttpClient, private route: ActivatedRoute) { }

  get(): Observable<ItemSummaryDTO> {
    const sortString = 'sort';
    const orderString = 'order';
    const nameString = 'name';
    let sort = 'date';
    let order = 'desc';
    let name = '';

    this.route.queryParams.subscribe(params => {
      sort = params[sortString] ? params[sortString] : sort;
      order = params[orderString] ? params[orderString] : order;
      name = params[nameString] ? params[nameString] : name;
    });

    const options = { params: new HttpParams().set(sortString, sort).set(orderString, order).set(nameString, name) };
    return this.http.get<ItemSummaryDTO>(this.itemBase + '/get', options);
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
