import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Portfolio } from './portfolio';
import { InsertStockRequest } from './insert-stock-request';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {

  constructor(private _httpClient: HttpClient) { }

  private portfolioUrl = "http://localhost:8081/portfolio";

  private stockUrl = "http://localhost:8081/stocks";

  fetchAllStocksByUserId(userId: number): Observable<Portfolio[]> {
    return this._httpClient.get<Portfolio[]>(`${this.portfolioUrl}/${userId}`);
  }

  // Add stock to portfolio
  addStock(userId: number, stock: InsertStockRequest): Observable<void> {
    return this._httpClient.post<void>(`${this.stockUrl}/${userId}`, stock);
  }

  // Remove stock from portfolio by stock ID

  removeStockData(userId: number, stockId: number): Observable<string> {
    return this._httpClient.delete(`${this.stockUrl}/${userId}/${stockId}`, { responseType: 'text' });
  }

}
