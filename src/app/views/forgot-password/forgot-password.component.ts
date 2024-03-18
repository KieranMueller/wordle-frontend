import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent {
  forgotPasswordRequest = {
    username: '',
    email: '',
  };

  constructor(private router: Router, private http: HttpClient) {}

  submit() {
    this.http
      .post('http://localhost:8080/forgot-password', this.forgotPasswordRequest)
      .subscribe({
        next: (res) => {
          console.log(res);
        },
        error: (e) => {
          console.log(e);
        },
      });
  }
}
