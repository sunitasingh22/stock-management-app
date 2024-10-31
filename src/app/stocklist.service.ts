import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface StockList {
  symbol: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class StocklistService {

  private apiUrl = 'http://localhost:8081/stocks/all';

  constructor(private _httpClient: HttpClient) { }

  getStockList(): Observable<StockList[]> {
    return this._httpClient.get<StockList[]>(this.apiUrl);
  }

}
