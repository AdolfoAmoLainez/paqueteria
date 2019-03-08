import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { DatabaseService } from "../shared/database.service";
import { isUndefined } from "util";
import { environment } from "src/environments/environment";

@Injectable()
export class AuthService {
    token: string;
    loginIncorrect = new Subject<any>();
    userRol = 2; // Usuari normal

    constructor(private http: HttpClient,
        private router: Router,
        private dbService: DatabaseService) { }

    loginUser(username: string, password: string) {

        return this.http.post<any>(environment.loginURL, { username, password })
            .subscribe(
                (data: any) => {
                    if (data && data.token) {
                        // store user details and jwt token in local storage to keep user logged in between page refreshes
                        localStorage.setItem('currentUser', JSON.stringify(data));
                        //console.log(data);
                        this.token = data.token;
                        this.dbService.setTablename(data.tablename);
                        this.router.navigate(['/llista']);
                        this.dbService.getUserRol(data.username).subscribe(
                          (data: any) => {
                            console.dir(data);
                            this.userRol = data.json[0].rol_id;
                          }
                        );
                    }
                });

    }

    isAuthenticated() {

        if (this.token == null || this.token == undefined){
            let currentUser = JSON.parse(localStorage.getItem('currentUser'));
            if (currentUser && currentUser.token) {
                this.token = currentUser.token;

            }else{
                return false;
            }
        }
        return this.token != null;
    }

    getLocalUser(){
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if(isUndefined(currentUser.vistaActual)){
            this.logout();
            return undefined;
        }else{
            return currentUser;
          }
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        this.token = null;
        this.dbService.setTablename("");
        this.router.navigate(['login']);
    }

    getUserRol(){
      return this.userRol;
    }
}
