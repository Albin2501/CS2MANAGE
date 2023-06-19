import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

import { base } from '../../util/config';
import { ProfileSummaryDTO } from 'src/app/dto/profileSummaryDTO';
import { ProfileDTO } from 'src/app/dto/profileDTO';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  profileBase = base + '/profile';

  constructor(private http: HttpClient) { }

  get(): Observable<ProfileSummaryDTO> {
    return this.http.get<ProfileSummaryDTO>(this.profileBase + '/get');
  }

  edit(profileDTO: ProfileDTO): Observable<void> {
    return this.http.patch<void>(this.profileBase + '/edit', profileDTO);
  }
}
