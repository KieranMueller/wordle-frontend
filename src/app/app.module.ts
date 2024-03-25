import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './views/login/login.component';
import { ForgotPasswordComponent } from './views/forgot-password/forgot-password.component';
import { CreateAccountComponent } from './views/create-account/create-account.component';
import { HomeComponent } from './views/home/home.component';
import { AiPromptComponent } from './views/ai-prompt/ai-prompt.component';
import { PlaySettingsComponent } from './views/play-settings/play-settings.component';
import { PlayComponent } from './views/play/play.component';
import { WordleListComponent } from './views/wordle-list/wordle-list.component';
import { FindUserComponent } from './views/find-user/find-user.component';
import { ProfileComponent } from './views/profile/profile.component';
import { SocialMediaBlockComponent } from './components/social-media-block/social-media-block.component';
import { EndGameModalComponent } from './overlays/end-game-modal/end-game-modal.component';
import { ShareWordleModalComponent } from './overlays/share-wordle-modal/share-wordle-modal.component';
import { SentEmailComponent } from './views/sent-email/sent-email.component';
import { FormsModule } from '@angular/forms';
import { ResetPasswordComponent } from './views/reset-password/reset-password.component';
import { CreateAccountEmailConfirmationComponent } from './views/create-account-email-confirmation/create-account-email-confirmation.component';
import { TopBarComponent } from './components/top-bar/top-bar.component';
import { GameBoardComponent } from './components/game-board/game-board.component';
import { MiddleBarComponent } from './components/middle-bar/middle-bar.component';
import { CreateWordleComponent } from './components/create-wordle/create-wordle.component';
import { HelpModalComponent } from './overlays/help-modal/help-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ForgotPasswordComponent,
    CreateAccountComponent,
    HomeComponent,
    AiPromptComponent,
    PlaySettingsComponent,
    PlayComponent,
    WordleListComponent,
    FindUserComponent,
    ProfileComponent,
    SocialMediaBlockComponent,
    EndGameModalComponent,
    ShareWordleModalComponent,
    SentEmailComponent,
    ResetPasswordComponent,
    CreateAccountEmailConfirmationComponent,
    TopBarComponent,
    GameBoardComponent,
    MiddleBarComponent,
    CreateWordleComponent,
    HelpModalComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule, HttpClientModule],
  providers: [Window],
  bootstrap: [AppComponent],
})
export class AppModule {}
