import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Liveprice } from './liveprice';

@Injectable({
  providedIn: 'root'
})
export class LivepriceService {

  constructor(private _httpClient: HttpClient) { }

  private liveDataUrl = "http://localhost:8082/price";

  fetchLivePrice(symbol: string): Observable<any> {
    return this._httpClient.get<any>(`${this.liveDataUrl}/${symbol}`);
  }

}
