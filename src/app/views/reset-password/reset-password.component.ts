import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  Router,
} from '@angular/router';
import { prodBaseUrl } from 'environment-variables'

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent {
  newPasswordRequest = {
    resetPasswordUuid: '',
    password: '',
  };
  confirmPassword = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  submit() {
    if (this.newPasswordRequest.password !== this.confirmPassword) {
      alert("passwords don't match");
      return;
    }
    this.newPasswordRequest.resetPasswordUuid =
      this.route.snapshot.params['passwordUUID'];
    this.http
      .post(
        `${prodBaseUrl}/create-new-password`,
        this.newPasswordRequest
      )
      .subscribe({
        next: (res) => {
          console.log(res);
          this.router.navigateByUrl('/login');
        },
        error: (e) => {
          alert(e.error.message);
          console.log(e);
        },
      });
  }
}
