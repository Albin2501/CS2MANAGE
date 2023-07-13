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
    let sort, order, name;

    this.route.queryParams.subscribe(params => {
      sort = params['sort'];
      order = params['order'];
      name = params['name'];
    });

    if (!(sort || order || name)) return this.http.get<ItemSummaryDTO>(this.itemBase + '/get');

    sort = sort ? sort : 'date';
    order = order ? order : 'desc';
    name = name ? name : '';

    const options = { params: new HttpParams().set('sort', sort).set('order', order).set('name', name) };
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
