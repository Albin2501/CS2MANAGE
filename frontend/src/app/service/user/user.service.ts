import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

import { backendBase } from '../../util/config';
import { UserDTO } from 'src/app/dto/userDTO';
import { InventoryDTO } from 'src/app/dto/inventoryDTO';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  itemBase = backendBase + '/user';

  constructor(private http: HttpClient, private route: ActivatedRoute) { }

  get(): Observable<UserDTO> {
    return this.http.get<UserDTO>(this.itemBase + '/get');
  }

  getSteamItems(group: boolean): Observable<InventoryDTO> {
    const options = { params: new HttpParams().set('group', group) };
    return this.http.get<InventoryDTO>(this.itemBase + '/getSteamItems', options);
  }

  edit(userDTO: UserDTO): Observable<void> {
    return this.http.patch<void>(this.itemBase + '/edit', userDTO);
  }
}
