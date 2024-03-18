import { inject } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';

export const CanActivate = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (authService.getLoggedIn()) return true;
  else {
    router.navigateByUrl('/login');
    return false;
  }
};
