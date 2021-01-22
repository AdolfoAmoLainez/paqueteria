import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ErrorPageComponent } from './error-page/error-page.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private modalService: NgbModal,
              private authService: AuthService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      return next.handle(request).pipe(
        catchError((error: HttpErrorResponse) => {

          if (error.status === 401) {
            const initialState = {
              message: 'Usuari no Autoritzat',
              title: 'ERROR: ' + 'Usuari no autoritzat o bé la sessió ha expirat.',
              status: error.status
            };
            this.modalService.open(ErrorPageComponent);

            setTimeout(() => {
              this.authService.logout();
            }, 4000);

          } else {
            const initialState = {
              message: error.message,
              title: 'ERROR: ' + error.status,
              status: error.status
            };
            this.modalService.open(ErrorPageComponent);
          }
          return throwError(error);
        })
      );
      /*
        return next.handle(request).pipe(catchError(err => {
            if (err.status === 401) {
                // auto logout if 401 response returned from api
                this.authService.logout();
                this.authService.loginIncorrect.next();
                //this.router.navigate(['/login']);

            }else{
                //console.log(err);
                this.router.navigate(['/http-error/'+err.message]);
            }
            const error = err.error.message || err.statusText;
            return throwError(error);
        }))*/
    }
}
