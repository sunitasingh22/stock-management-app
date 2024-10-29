import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private UserUrl = 'http://localhost:8081/users';

  constructor(private _httpClient: HttpClient) { }



  login(username: string, password: string): Observable<any> {
    const payload = { username, password };
    return this._httpClient.post(`${this.UserUrl}/login`, payload, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      responseType: 'json'
    });
  }

  // Signup method
  signup(username: string, email: string, password: string): Observable<any> {
    const payload = { username, email, password };
    return this._httpClient.post(`${this.UserUrl}/adduser`, payload, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }


}
