import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import { Injectable } from '@angular/core';

import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class AdminGuard implements CanActivate {

  constructor(public authService: AuthService,
              private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const logged = this.authService.isAuthenticated();
    if (logged && this.authService.userRol === environment.ADMIN) {
      return true;
    } else {
      this.router.navigate(['llista']);
      return false;
    }
  }
}
