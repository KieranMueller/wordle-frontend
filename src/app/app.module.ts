import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './views/login/login.component';
import { ForgotPasswordComponent } from './views/forgot-password/forgot-password.component';
import { CreateAccountComponent } from './views/create-account/create-account.component';
import { HomeComponent } from './views/home/home.component';
import { PlayComponent } from './views/play/play.component';
import { SocialMediaBlockComponent } from './components/social-media-block/social-media-block.component';
import { SentEmailComponent } from './views/sent-email/sent-email.component';
import { FormsModule } from '@angular/forms';
import { ResetPasswordComponent } from './views/reset-password/reset-password.component';
import { CreateAccountEmailConfirmationComponent } from './views/create-account-email-confirmation/create-account-email-confirmation.component';
import { TopBarComponent } from './components/top-bar/top-bar.component';
import { GameBoardComponent } from './components/game-board/game-board.component';
import { MiddleBarComponent } from './components/middle-bar/middle-bar.component';
import { CreateWordleComponent } from './components/create-wordle/create-wordle.component';
import { HelpModalComponent } from './overlays/help-modal/help-modal.component';
import { CreateWordleOptionsModalComponent } from './overlays/create-wordle-options-modal/create-wordle-options-modal.component';
import { ClipboardModule } from 'ngx-clipboard';
import { GameBoardOptionsBarComponent } from './components/game-board-options-bar/game-board-options-bar.component';
import { PlaySettingsComponent } from './overlays/play-settings/play-settings.component';
import { BrowserModule } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NotFoundComponent } from './views/not-found/not-found.component';
import { HowToPlayModalComponent } from './overlays/how-to-play-modal/how-to-play-modal.component';
import { GameSettingsService } from './service/game-settings.service';
import { WinModalComponent } from './overlays/win-modal/win-modal.component';
import { LoseModalComponent } from './overlays/lose-modal/lose-modal.component';
import { WordleService } from './service/wordle.service';
import { TestingComponent } from './components/testing/testing.component'

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ForgotPasswordComponent,
    CreateAccountComponent,
    HomeComponent,
    PlayComponent,
    SocialMediaBlockComponent,
    SentEmailComponent,
    ResetPasswordComponent,
    CreateAccountEmailConfirmationComponent,
    TopBarComponent,
    GameBoardComponent,
    MiddleBarComponent,
    CreateWordleComponent,
    HelpModalComponent,
    CreateWordleOptionsModalComponent,
    GameBoardOptionsBarComponent,
    PlaySettingsComponent,
    NotFoundComponent,
    HowToPlayModalComponent,
    WinModalComponent,
    LoseModalComponent,
    TestingComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ClipboardModule,
    MatProgressSpinnerModule,
    BrowserAnimationsModule,
  ],
  providers: [
    Window,
    provideAnimationsAsync(),
    GameSettingsService,
    WordleService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
