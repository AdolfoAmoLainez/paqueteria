import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { AppConstants } from "../app.params";

@Injectable()
export class AuthService {
    token: string;
    loginIncorrect = new Subject<any>();
    appConstants = new AppConstants();


    constructor(private http: HttpClient,
        private router: Router) { }

    loginUser(username: string, password: string) {

        return this.http.post<any>(this.appConstants.loginURL, { username, password })
            .subscribe(
                (data: any) => {
                    if (data && data.token) {
                        // store user details and jwt token in local storage to keep user logged in between page refreshes
                        localStorage.setItem('currentUser', JSON.stringify(data));
                        this.token = data.token;
                        this.router.navigate(['/llista']);
                    }
                });

    }

    isAuthenticated() {
        
        if (this.token == null || this.token == undefined){
            return false;
        }
        return this.token != null;
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        this.token = null;
        this.router.navigate(['login']);
    }
}