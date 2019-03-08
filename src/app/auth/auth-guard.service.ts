import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Injectable } from '@angular/core';

import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(public authService: AuthService,
              private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const logged = this.authService.isAuthenticated();
    if (logged) return true;
    else{
      this.router.navigate(['login']);
      return false;
    }
    //return this.authService.isAuthenticated();
  }
}
