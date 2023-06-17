import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TestService {
  baseURI = 'http://localhost:2501';

  constructor(private http: HttpClient) { }

  test(): Observable<Number[]> {
    return this.http.get<Number[]>(this.baseURI + '/test');
  }
}
