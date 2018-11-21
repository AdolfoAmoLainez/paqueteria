import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { AppComponent } from './app.component';
import { CanvasComponent } from './signature/canvas.component';
import { ArribadesListComponent } from './arribades-list/arribades-list.component';
import { PaquetComponent } from './paquet/paquet.component';
import { LoginComponent } from './auth/login/login.component';

import { PaquetsService } from './shared/paquets.service';
import { DatabaseService } from './shared/database.service';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CollapseModule } from 'ngx-bootstrap';
import {QRCodeModule} from 'angularx-qrcode';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorInterceptor } from './shared/httperror.interceptor';
import { JwtInterceptor } from './shared/jwt.interceptor';
import { AlertModule } from 'ngx-bootstrap/alert';
import { AuthService } from './auth/auth.service';
import { AppRoutingModule } from './app-routing.module';



@NgModule({
  declarations: [
    AppComponent,
    CanvasComponent,
    ArribadesListComponent,
    PaquetComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    BsDatepickerModule.forRoot(),
    CollapseModule.forRoot(),
    AlertModule.forRoot(),
    QRCodeModule,
    HttpClientModule,
    AppRoutingModule

  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    PaquetsService,DatabaseService,AuthService,AppRoutingModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
