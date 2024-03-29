import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './views/login/login.component';
import { CreateAccountComponent } from './views/create-account/create-account.component';
import { HomeComponent } from './views/home/home.component';
import { ForgotPasswordComponent } from './views/forgot-password/forgot-password.component';
import { SentEmailComponent } from './views/sent-email/sent-email.component';
import { ResetPasswordComponent } from './views/reset-password/reset-password.component';
import { CanActivate } from './guard/auth.guard';
import { CreateAccountEmailConfirmationComponent } from './views/create-account-email-confirmation/create-account-email-confirmation.component';
import { PlayComponent } from './views/play/play.component';
import { NotFoundComponent } from './views/not-found/not-found.component';
import { GameBoardComponent } from './components/game-board/game-board.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  { path: 'login', component: LoginComponent },
  { path: 'login/:username/:emailUuid', component: LoginComponent },
  { path: 'create-account', component: CreateAccountComponent },
  { path: 'created', component: CreateAccountEmailConfirmationComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password-confirmation', component: SentEmailComponent },
  { path: 'set-password/:passwordUUID', component: ResetPasswordComponent },
  { path: 'home', component: HomeComponent, canActivate: [CanActivate] },
  { path: 'play', component: PlayComponent },
  {
    path: 'play/:uuidLink',
    component: PlayComponent,
  },
  { path: 'not-found', component: NotFoundComponent },
  { path: '**', redirectTo: '/not-found' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
