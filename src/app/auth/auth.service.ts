import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { DatabaseService } from '../shared/database.service';
import { isUndefined } from 'util';
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

        return this.http.post<any>(environment.dataServerURL + '/selfapi/getUserData', {username})
            .subscribe(
                (dataLogin: any) => {
                    if (dataLogin && dataLogin.username) {

                        localStorage.setItem('currentUser', JSON.stringify(dataLogin));

                        this.dbService.setTablename(dataLogin.tablename);
                        this.router.navigate(['/llista']);
                        this.dbService.getUserRol(dataLogin.username).subscribe(
                          (dataRol: any) => {
                            this.userRol = dataRol.json[0].rol_id;
                          }
                        );
                    } else {
                      //window.location.href = environment.dataServerURL + '/selfapi/login';
                       this.router.navigate(['/login']);
                    }
                });

    }

    isAuthenticated() {
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));

      const obj = {
        username: currentUser.username
      };
      return this.http.post(environment.dataServerURL + '/selfapi/getUserData', obj);
    }

    getLocalUser() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (isUndefined(currentUser.vistaActual)) {
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
