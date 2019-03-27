import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import { Injectable } from '@angular/core';

import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class AdminGuard implements CanActivate {

  constructor(public authService: AuthService,
              private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>|boolean {

    return this.authService.isAuthenticated()
    .pipe( map(
      (auth: any) => {
        if (auth && auth.username) {
          if (this.authService.userRol === environment.ADMIN) {
            return true;
          } else {
            this.router.navigate(['llista']);
            return false;
          }
        } else {
          window.location.href = environment.dataServerURL + '/selfapi/logout';
          return false;
        }
      }
    ));
  }
/*
    const logged = this.authService.isAuthenticated();
    if (logged && this.authService.userRol === environment.ADMIN) {
      return true;
    } else {
      this.router.navigate(['llista']);
      return false;
    }
  }*/
}
