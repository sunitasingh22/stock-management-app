import { Routes } from '@angular/router';
import { StockComponent } from './portfolio/stock/stock.component';
import { LoginComponent } from './portfolio/login/login.component';
import { SignupComponent } from './signup/signup.component';

export const routes: Routes = [
    { path: "signup", component: SignupComponent },
    { path: "portfolio/login", component: LoginComponent },
    { path: "portfolio/home", component: StockComponent },
    { path: "portfolio", redirectTo: "portfolio/home", pathMatch: "full" },
    { path: "", redirectTo: "portfolio/login", pathMatch: "full" }

];
