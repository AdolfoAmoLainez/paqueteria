import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Injectable } from '@angular/core';

import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(public authService: AuthService,
              private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>|boolean {

    return this.authService.isAuthenticated();
/*       .pipe(
        take(1),
         map(
        (auth) => {
          if (auth && auth[0].username) {
            return true;
          } else {
            window.location.href = environment.dataServerURL + '/login';
            return false;
          }
        }
      )); */

  }
}
