import { Component, OnInit } from '@angular/core';
import { PortfolioService } from '../portfolio.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PortfolioModule } from '../portfolio.module';
import { Router, RouterLink } from '@angular/router';
import { Liveprice } from '../liveprice';
import { LivepriceService } from '../liveprice.service';
import { Portfolio } from '../portfolio';
import { forkJoin } from 'rxjs';
import { InsertStockRequest } from '../insert-stock-request';
import { AddStockModalComponent } from '../add-stock-modal/add-stock-modal.component';

@Component({
  selector: 'app-stock',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, PortfolioModule, RouterLink, AddStockModalComponent],
  templateUrl: './stock.component.html',
  styleUrl: './stock.component.css'
})
export class StockComponent implements OnInit {

  userId: number | null = null;

  constructor(private portfolioService: PortfolioService, private livePriceService: LivepriceService, private router: Router) { }

  portfolios: Portfolio[] = [];
  newStock: InsertStockRequest = { symbol: '', name: '', quantity: 0 };
  stocks: any[] = [];

  ngOnInit(): void {
    const storedUserId = localStorage.getItem("userId");
    this.userId = storedUserId ? Number(storedUserId) : null;

    if (this.userId !== null) {
      this.fetchAllStocksfromPortfolio();
    }
  }

  fetchAllStocksfromPortfolio() {
    if (this.userId !== null) {
      this.portfolioService.fetchAllStocksByUserId(this.userId).subscribe((data) => {
        console.log("Fetched data:", data);
        this.portfolios = data;
        this.fetchLivePrices();
      });
    }

  }

  fetchLivePrices(): void {
    const livePriceObservables = this.portfolios.map(portfolio =>
      this.livePriceService.fetchLivePrice(portfolio.stock.symbol)
    );

    forkJoin(livePriceObservables).subscribe((livePrices: any[]) => {
      this.portfolios = this.portfolios.map((portfolio, index) => ({
        ...portfolio,
        livePrice: livePrices[index].price,
        totalValue: portfolio.quantity * livePrices[index].price
      }));
      console.log("Portfolios with live prices merged:", this.portfolios);
    });
  }

  addStockData(stockData: any) {
    if (this.userId !== null) {
      console.log('Stock data received from modal:', stockData);
      this.portfolioService.addStock(this.userId, stockData).subscribe(() => {
        this.fetchAllStocksfromPortfolio(); // Refresh the portfolio
      });
    }
  }

  removeStockData(stockId: number): void {
    if (this.userId !== null) {
      this.portfolioService.removeStockData(this.userId, stockId).subscribe({
        next: () => {
          console.log('Stock removed successfully');
          //  this.stocks = this.stocks.filter(stock => stock.id !== stockId); // Remove from UI
          this.fetchAllStocksfromPortfolio(); // Refresh the portfolio
        },
        error: (error) => {
          console.error('Error removing stock', error);
        }
      });
    }
  }

  getGrandTotal(): number {
    return this.portfolios
      .map(portfolio => portfolio.totalValue || 0)
      .reduce((acc, value) => acc + value, 0);
  }

  openStockModal() {
    const modal = document.getElementById("addStockModal");
    if (modal != null) {
      modal.style.display = "block";
    }
  }

  closeStockModal() {
    const modal = document.getElementById("addStockModal");
    if (modal != null) {
      modal.style.display = "none";
    }
  }

  logout() {
    localStorage.removeItem('userId');
    this.router.navigate(['/portfolio/login']);
  }


}
