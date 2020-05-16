import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { DatabaseService } from '../shared/database.service';
import { environment } from 'src/environments/environment';
import { User } from '../shared/user.model';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

    loginIncorrect = new Subject<any>();
    userRol = 2; // Usuari normal
    isLogged = false;

    constructor(private http: HttpClient,
                private router: Router,
                private dbService: DatabaseService) { }

    loginUser() {

      window.location.href = environment.dataServerURL + '/cas/login';
/*       this.http.get<User[]>
      (environment.dataServerURL + '/cas/login').subscribe(
        (data) => {
          console.log(data);
          if (data.length > 0) {
            this.isLogged = true;

            const dataLogin = data[0];
            localStorage.setItem('currentUser', JSON.stringify(dataLogin));

            this.dbService.setTablename(dataLogin.tablename);
            this.dbService.getUserRol(dataLogin.niu).subscribe(
                (dataRol: any) => {

                  this.userRol = +dataRol[0].rol_id;
                  this.router.navigate(['/llista']);
                }
                );
          } else {

              //this.router.navigate(['/login']);
          }
        },
        (err) => {
          console.log(err);

         /*  window.location.href = environment.dataServerURL + '/cas/login';
        }
      ); */

    }

    isAuthenticated() {
/*       const currentUser = JSON.parse(localStorage.getItem('currentUser'));

      return this.http.get(environment.dataServerURL + '/users/getUserData/' + currentUser.niu); */
      return this.isLogged;
    }

    getLocalUser() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser.vistaActual === undefined) {
            this.logout();
            return undefined;
        } else {
            return currentUser;
          }
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        this.dbService.setTablename('');
        this.userRol = 2;
        this.isLogged = false;
        window.location.href = environment.dataServerURL + '/cas/logout';
    }

    getUserRol() {
      return this.userRol;
    }

    getUserData() {
      this.http.get<User[]>
      (environment.dataServerURL + '/users/getUserData').subscribe(
        (data) => {
          console.log(data);
          if (data.length > 0) {
            this.isLogged = true;

            const dataLogin = data[0];
            localStorage.setItem('currentUser', JSON.stringify(dataLogin));

            this.dbService.setTablename(dataLogin.tablename);
            this.dbService.getUserRol(dataLogin.niu).subscribe(
                (dataRol: any) => {

                  this.userRol = +dataRol[0].rol_id;
                  this.router.navigate(['/llista']);
                }
                );
          } else {

              //this.router.navigate(['/login']);
          }
        }
      );
    }
}
