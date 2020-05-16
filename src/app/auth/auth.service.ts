import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { DatabaseService } from '../shared/database.service';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

    loginIncorrect = new Subject<any>();
    userRol = 2; // Usuari normal

    constructor(private http: HttpClient,
                private router: Router,
                private dbService: DatabaseService) { }

    loginUser(username) {

        return this.http.get<any>(environment.dataServerURL + '/users/getUserData/' + username)
            .subscribe(
                (data: any) => {

                  if (data.length > 0) {

                    const dataLogin = data[0];
                    localStorage.setItem('currentUser', JSON.stringify(dataLogin));

                    this.dbService.setTablename(dataLogin.tablename);
                    this.dbService.getUserRol(dataLogin.username).subscribe(
                        (dataRol: any) => {

                          this.userRol = +dataRol[0].rol_id;
                          this.router.navigate(['/llista']);
                        }
                        );
                  } else {

                      this.router.navigate(['/login']);
                  }
                });

    }

    isAuthenticated() {
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));

      return this.http.get(environment.dataServerURL + '/users/getUserData/' + currentUser.username);
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
        window.location.href = environment.dataServerURL + '/selfapi/logout';
    }

    getUserRol() {
      return this.userRol;
    }
}
