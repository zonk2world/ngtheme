import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MainDashboardComponent} from './main-dashboard/main-dashboard.component';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import { AuthGuard, AuthGuardForHome } from './services/auth.guard';

const routes: Routes = [
  { path: 'home', component: MainDashboardComponent, canActivate: [AuthGuardForHome] },
  { path: 'login', component: LoginComponent, canActivate: [AuthGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
