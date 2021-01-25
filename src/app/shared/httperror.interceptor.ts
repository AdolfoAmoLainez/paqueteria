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

            const modalRef = this.modalService.open(ErrorPageComponent);
            modalRef.componentInstance.message = 'Usuari no Autoritzat';
            modalRef.componentInstance.title = 'ERROR: ' + 'Usuari no autoritzat o bé la sessió ha expirat.';
            modalRef.componentInstance.status = error.status;

            setTimeout(() => {
              this.authService.logout();
            }, 4000);

          } else {

            const modalRef = this.modalService.open(ErrorPageComponent);
            modalRef.componentInstance.message = error.message;
            modalRef.componentInstance.title = 'ERROR: ' + error.status;
            modalRef.componentInstance.status = error.status;
          }
          return throwError(error);
        })
      );

    }
}
