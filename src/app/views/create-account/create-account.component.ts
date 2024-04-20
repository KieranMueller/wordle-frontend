import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { backendBaseUrl } from 'environment-variables';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css'],
})
export class CreateAccountComponent {
  user = {
    firstName: '',
    lastName: '',
    phone: '',
    username: '',
    email: '',
    password: '',
  };

  constructor(private router: Router, private http: HttpClient) {}

  create() {
    this.http.post(`${backendBaseUrl}/create`, this.user).subscribe({
      next: (res) => {
        this.router.navigateByUrl('/login');
      },
      error: (e) => {
        alert(e.error.message);
      },
    });
  }
}
