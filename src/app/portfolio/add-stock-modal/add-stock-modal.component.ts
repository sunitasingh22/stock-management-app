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
  stocks: { id: number, symbol: string; name: string }[] = [];



  constructor(private fb: FormBuilder, private stockListService: StocklistService) {
    this.addStockForm = this.fb.group({
      symbol: [null, Validators.required],
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
          id: stock.id,
          symbol: stock.symbol,
          name: stock.name
        }));
        console.log("inside loadstocks in modal window:::" + this.stocks);
      },
      error: (error) => {
        console.error('Error fetching stock list:', error);
        // Handle error, maybe show a notification to the user
      }
    });
  }

  hasError(controlName: string, errorName: string): boolean {
    const control = this.addStockForm.get(controlName);
    return control ? control.hasError(errorName) && control.touched : false;
  }

  onSubmit() {
    if (this.addStockForm.valid) {

      const selectedStock = this.addStockForm.get('symbol')?.value; // Get the selected stock object
      const quantity = this.addStockForm.get('quantity')?.value;

      this.stockAdded.emit({
        id: selectedStock.id,
        symbol: selectedStock.symbol,
        name: selectedStock.name,
        quantity: quantity
      });

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
    const selectedStock = this.addStockForm.get('symbol')?.value; // Get the entire stock object

    if (selectedStock) {
      this.addStockForm.get('name')?.setValue(selectedStock.name);
    } else {
      this.addStockForm.get('name')?.setValue(''); // Clear name if no stock is selected
    }
  }

}
