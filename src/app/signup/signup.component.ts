import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SignupService } from '../signup.service';
import { NgIf } from '@angular/common';
import { Router, RouteReuseStrategy } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {

  signupForm: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private registerService: SignupService, private router: Router) {
    this.signupForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.signupForm.valid) {
      this.registerService.userRegisterCall(this.signupForm.value).subscribe({
        next: () => {
          // On successful signup, navigate to login page with success message
          this.router.navigate(['/portfolio/login'], { queryParams: { registered: 'true' } });
        },
        error: (err) => {
          // On error, display the error message on the signup page
          this.errorMessage = err.error.message || 'Signup failed. Please try again.';
        }
      });
    }
  }
}
