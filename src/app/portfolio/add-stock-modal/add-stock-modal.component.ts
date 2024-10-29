import { NgIf } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-stock-modal',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './add-stock-modal.component.html',
  styleUrl: './add-stock-modal.component.css'
})
export class AddStockModalComponent {

  @Output() stockAdded = new EventEmitter<any>();
  addStockForm: FormGroup;



  constructor(private fb: FormBuilder) {
    this.addStockForm = this.fb.group({
      symbol: ['', Validators.required],
      name: ['', Validators.required],
      quantity: [0, [Validators.required, Validators.min(1)]]
    });
  }

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



}
