import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './views/login/login.component';
import { CreateAccountComponent } from './views/create-account/create-account.component';
import { HomeComponent } from './views/home/home.component';
import { ForgotPasswordComponent } from './views/forgot-password/forgot-password.component';
import { SentEmailComponent } from './views/sent-email/sent-email.component';
import { ResetPasswordComponent } from './views/reset-password/reset-password.component';
import { CanActivate } from './guard/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  { path: 'login', component: LoginComponent },
  { path: 'create-account', component: CreateAccountComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password-confirmation', component: SentEmailComponent },
  { path: 'set-password', component: ResetPasswordComponent },
  { path: 'home', component: HomeComponent, canActivate: [CanActivate] },
  { path: '**', redirectTo: '/login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
