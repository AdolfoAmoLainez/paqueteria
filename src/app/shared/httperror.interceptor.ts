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
          const initialState = {
            message: error.message,
            title: 'ERROR: ' + error.status,
            status: error.status
          };
          this.errorModalRef = this.modalService.show(ErrorPageComponent, {initialState});
          return throwError(error);
        })
      );
    }
}
