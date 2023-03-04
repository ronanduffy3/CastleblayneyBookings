import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})

export class AdminGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user.role === 'admin') {
      return true;
    } else {
      this.router.navigate(['unauthorized']);
      return false;
    }
  }

}