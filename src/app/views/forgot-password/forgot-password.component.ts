import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { backendBaseUrl } from 'environment-variables';

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
      .post(`${backendBaseUrl}/forgot-password`, this.forgotPasswordRequest)
      .subscribe({
        next: (res) => {
          this.router.navigateByUrl('/login');
        },
        error: (e) => {
        },
      });
  }
}
