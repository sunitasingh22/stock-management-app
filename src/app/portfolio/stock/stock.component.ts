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

  // Variables for selling stock
  sellStockId: number | null = null;
  sellStockSymbol: string = '';
  sellStockName: string = '';
  sellQuantity: number = 0;

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
        this.portfolios = data.filter(portfolio => portfolio.quantity > 0);
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

      const stock = this.stocks.find(s => s.symbol === stockData.symbol);
      if (stockData) {
        this.portfolioService.addStock(this.userId, stockData.id, { // Pass the stockId
          symbol: stockData.symbol,
          name: stockData.name,
          quantity: stockData.quantity
        }).subscribe(() => {
          this.fetchAllStocksfromPortfolio(); // Refresh the portfolio
        });
      }
    }
  }

  /* removeStockData(stockId: number): void {
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
   }*/

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


  // Method to open the sell modal
  openSellModal(stockId: number, stockName: string, stockSymbol: string): void {
    this.sellStockId = stockId; // ID of the stock being sold
    this.sellStockSymbol = stockSymbol; // Symbol of the stock
    this.sellStockName = stockName; // Name of the stock
    this.sellQuantity = 0; // Initialize the quantity to 0
    const modal = document.getElementById("sellStockModal");
    if (modal) {
      modal.style.display = "block"; // Show the modal
    }
  }

  closeSellModal(): void {
    const modal = document.getElementById("sellStockModal");
    if (modal != null) {
      modal.style.display = "none"; // Hide the modal
    }
  }

  sellStock(): void {
    if (this.userId !== null && this.sellStockId !== null) {

      const quantityToSell = this.sellQuantity;
      const portfolio = this.portfolios.find(p => p.stock.id === this.sellStockId);




      if (portfolio && quantityToSell > 0 && quantityToSell <= portfolio.quantity) {
        // Show a confirmation alert
        const userConfirmed = confirm(`Are you sure you want to sell ${this.sellQuantity} units of ${portfolio.stock.name} (${portfolio.stock.symbol})?`);

        if (!userConfirmed) {
          return; // Exit if the user cancels the action
        }

        this.portfolioService.removeStockData(this.userId, this.sellStockId, this.sellQuantity).subscribe({
          next: () => {
            console.log('Stock sold successfully');
            this.fetchAllStocksfromPortfolio();
            this.closeSellModal();
          },
          error: (error) => {
            console.error('Error selling stock', error);
          }
        });
      } else {
        alert('Quantity must be greater than 0 and less than or equal to the current quantity.');
      }
    }
  }

  getCurrentStockQuantity(stockId: number): number {
    const portfolio = this.portfolios.find(p => p.stock.id === stockId);
    return portfolio ? portfolio.quantity : 0;
  }


}
