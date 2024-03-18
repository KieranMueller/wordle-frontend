import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  user = {
    username: '',
    password: '',
    emailUuid: '',
  };

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    if (this.route.snapshot.params['emailUuid']) {
      this.user.emailUuid = this.route.snapshot.params['emailUuid'];
      this.user.username = this.route.snapshot.params['username'];
    }
  }

  login() {
    this.authService.login(this.user);
  }
}
