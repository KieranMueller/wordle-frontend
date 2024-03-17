import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  user = {
    username: '',
    password: '',
  };

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  login() {
    this.http.post('http://localhost:8080/login', this.user).subscribe({
      next: (res) => {
        if (res) {
          this.authService.login();
          this.router.navigateByUrl('/home');
        }
      },
    });
  }
}
