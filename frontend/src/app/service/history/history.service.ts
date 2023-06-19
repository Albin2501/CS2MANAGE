import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

import { base } from '../../util/config';
import { HistoryEntryDTO } from 'src/app/dto/historyEntryDTO';


@Injectable({
  providedIn: 'root'
})
export class HistoryService {
  historyBase = base + '/history';

  constructor(private http: HttpClient) { }

  get(): Observable<HistoryEntryDTO> {
    return this.http.get<HistoryEntryDTO>(this.historyBase + '/get');
  }

  delete(id: number): Observable<void> {
    const options = id ? { params: new HttpParams().set('id', id) } : {};
    return this.http.delete<void>(this.historyBase + '/delete', options);
  }

  deleteAll(): Observable<void> {
    return this.http.delete<void>(this.historyBase + '/deleteAll');
  }
}
