import { CommonModule, NgIf } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { StocklistService } from '../../stocklist.service';

@Component({
  selector: 'app-add-stock-modal',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, CommonModule],
  templateUrl: './add-stock-modal.component.html',
  styleUrl: './add-stock-modal.component.css'
})
export class AddStockModalComponent implements OnInit {

  @Output() stockAdded = new EventEmitter<any>();
  addStockForm: FormGroup;
  // stocks: StockList[] = [];
  stocks: { symbol: string; name: string }[] = [];



  constructor(private fb: FormBuilder, private stockListService: StocklistService) {
    this.addStockForm = this.fb.group({
      symbol: ['', Validators.required],
      name: ['', Validators.required],
      quantity: [0, [Validators.required, Validators.min(1), Validators.max(200)]]
    });
  }
  ngOnInit(): void {
    this.loadStocks();
  }

  loadStocks(): void {
    this.stockListService.getStockList().subscribe({
      next: (data) => {
        this.stocks = data.map(stock => ({
          symbol: stock.symbol,
          name: stock.name
        }));
      },
      error: (error) => {
        console.error('Error fetching stock list:', error);
        // Handle error, maybe show a notification to the user
      }
    });
  }

  /* loadStocks(): void {
     // Replace with your service call to fetch stock data
     this.stocks = [
       { symbol: 'AAPL', name: 'Apple Inc.' },
       { symbol: 'GOOGL', name: 'Alphabet Inc.' },
       { symbol: 'MSFT', name: 'Microsoft Corporation' }
     ];
   }*/

  hasError(controlName: string, errorName: string): boolean {
    const control = this.addStockForm.get(controlName);
    return control ? control.hasError(errorName) && control.touched : false;
  }

  onSubmit() {
    if (this.addStockForm.valid) {
      this.stockAdded.emit(this.addStockForm.value); // Emit the stock data
      this.addStockForm.reset();
      this.closeModal(); // Close the modal after submitting
    }
  }

  closeModal() {
    // Logic to close the modal if needed
    const modalElement = document.getElementById('addStockModal');
    if (modalElement) {
      modalElement.classList.remove('show');
      modalElement.style.display = 'none';
    }
  }

  onSymbolChange(): void {
    const selectedSymbol = this.addStockForm.get('symbol')?.value;
    const selectedStock = this.stocks.find(stock => stock.symbol === selectedSymbol);

    if (selectedStock) {
      // Populate the name field with the selected stock name
      this.addStockForm.get('name')?.setValue(selectedStock.name);
    } else {
      // Reset the name field if no stock is selected
      this.addStockForm.get('name')?.setValue('');
    }
  }

}
