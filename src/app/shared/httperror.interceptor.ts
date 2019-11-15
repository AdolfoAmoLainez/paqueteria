import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { ErrorPageComponent } from './error-page/error-page.component';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  errorModalRef: BsModalRef;

    constructor(private authService: AuthService, private router: Router, private modalService: BsModalService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      return next.handle(request).pipe(
        catchError((error: HttpErrorResponse) => {

          if (error.status === 401) {
            const initialState = {
              message: 'Usuari no Autoritzat',
              title: 'ERROR: ' + 'Usuari no autoritzat o bé la sessió ha expirat.',
              status: error.status
            };
            this.errorModalRef = this.modalService.show(ErrorPageComponent, {initialState});

            setTimeout(() => {
              this.authService.logout();
            }, 4000);

          } else {
            const initialState = {
              message: error.message,
              title: 'ERROR: ' + error.status,
              status: error.status
            };
            this.errorModalRef = this.modalService.show(ErrorPageComponent, {initialState});
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
