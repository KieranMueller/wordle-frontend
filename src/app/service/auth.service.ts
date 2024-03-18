import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loggedIn = new BehaviorSubject(false);

  constructor(private http: HttpClient, private router: Router) {}

  login(user: any) {
    this.http.post('http://localhost:8080/login', user).subscribe({
      next: (res) => {
        this.loggedIn.next(true);
        this.router.navigateByUrl('/home');
      },
      error: (e) => {
        console.log(e);
      },
      complete: () => {
        console.log(this.getLoggedIn());
      },
    });
  }

  logout() {
    this.loggedIn.next(false);
    this.router.navigateByUrl('/login');
  }

  getLoggedIn() {
    return this.loggedIn.value;
  }
}
