import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignupService {

  private signupUrl = 'http://localhost:8081/users/adduser';

  constructor(private _httpClient: HttpClient) { }

  userRegisterCall(userData: any): Observable<any> {
    return this._httpClient.post(this.signupUrl, userData);
  }
}
