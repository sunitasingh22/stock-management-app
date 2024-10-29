import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserService } from '../../user.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private fb: FormBuilder, private userService: UserService, private router: Router, private activeRoute: ActivatedRoute) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.activeRoute.queryParams.subscribe(params => {
      if (params['registered'] === 'true') {
        this.successMessage = 'User created successfully. Please log in.';
      }
    })
  }



  onSubmit(): void {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;

      this.userService.login(username, password).subscribe({
        next: (response: { message: string; userId: string }) => {
          console.log('Login successful:', response);  // Log the response

          if (response.userId) {
            localStorage.setItem('userId', response.userId); // Store userId in local storage
            this.router.navigate(['/portfolio/home']);  // Redirect after login
          } else {
            console.error('User ID is undefined in response');
            this.errorMessage = 'User ID not found in response';
          }
        },
        error: (err) => {
          console.error('Login failed:', err);
          this.errorMessage = 'Invalid credentials';
        }
      });
    }
  }


  register() {
    this.router.navigate(['/signup']);
  }

}