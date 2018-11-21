import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

@Injectable()
export class AuthService {
    token: string;

    dataServerURL:string = "http://localhost:3000/auth/login";

    constructor(private http:HttpClient,
                private router: Router){}

    loginUser(username:string, password:string){
        console.log("pepe3");
        return this.http.post<any>(this.dataServerURL, { username, password })
        .subscribe(
            (data:any)=>{
                if (data && data.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(data));
                    this.token=data.token;
                    this.router.navigate(['/llista']);
                }
            } );
        /*.pipe(map(user => {
            // login successful if there's a jwt token in the response 
            console.log("pepe2");
            if (user && user.token) {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('currentUser', JSON.stringify(user));
                this.token=user.token;
            }

            return user;
        }));*/
    }

    isAuthenticated(){
        return this.token!=null;
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        this.token=null;
    }
}