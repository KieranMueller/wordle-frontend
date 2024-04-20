import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { backendBaseUrl } from 'environment-variables';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loggedIn = new BehaviorSubject(true);

  constructor(private http: HttpClient, private router: Router) {}

  login(user: any) {
    this.http.post(`${backendBaseUrl}/login`, user).subscribe({
      next: (res) => {
        this.loggedIn.next(true);
        this.router.navigateByUrl('/home');
      },
      error: (e) => {
      },
      complete: () => {
      },
    });
  }

  logout() {
    this.loggedIn.next(false);
    this.router.navigateByUrl('/login');
  }

  getLoggedIn() {
    return true;
    // return this.loggedIn.value;
  }
}
