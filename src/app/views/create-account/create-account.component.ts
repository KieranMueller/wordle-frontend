import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

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
    this.http.post('http://localhost:8080/create', this.user).subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (e) => {
        console.log(e);
      },
    });
  }
}
