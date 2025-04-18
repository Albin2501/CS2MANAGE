import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { backendBase } from '../../util/config';
import { ProfileSummaryDTO } from 'src/app/dto/profileSummaryDTO';
import { ProfileDTO } from 'src/app/dto/profileDTO';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  profileBase = backendBase + '/profile';

  constructor(private http: HttpClient) { }

  get(): Observable<ProfileDTO[]> {
    return this.http.get<ProfileDTO[]>(this.profileBase + '/get');
  }

  getItems(): Observable<ProfileSummaryDTO> {
    return this.http.get<ProfileSummaryDTO>(this.profileBase + '/getitems');
  }

  edit(profileDTO: ProfileDTO): Observable<void> {
    return this.http.patch<void>(this.profileBase + '/edit', profileDTO);
  }
}
