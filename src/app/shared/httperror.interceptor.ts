import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ErrorPageComponent } from './error-page/error-page.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(private modalService: NgbModal) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      return next.handle(request).pipe(
        catchError((error: HttpErrorResponse) => {
          const initialState = {
            message: error.message,
            title: 'ERROR: ' + error.status,
            status: error.status
          };
          const errorModalRef = this.modalService.open(ErrorPageComponent);
          return throwError(error);
        })
      );
    }
}
