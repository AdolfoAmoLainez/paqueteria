import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { AppComponent } from './app.component';
import { CanvasComponent } from './signature/canvas.component';
import { ArribadesListComponent } from './arribades-list/arribades-list.component';
import { LoginComponent } from './auth/login/login.component';

import { PaquetsService } from './shared/paquets.service';
import { DatabaseService } from './shared/database.service';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CollapseModule, ModalModule } from 'ngx-bootstrap';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { AlertModule } from 'ngx-bootstrap/alert';



import {QRCodeModule} from 'angularx-qrcode';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorInterceptor } from './shared/httperror.interceptor';
import { JwtInterceptor } from './shared/jwt.interceptor';
import { AuthService } from './auth/auth.service';
import { AppRoutingModule } from './app-routing.module';
import { PaquetEditAddComponent } from './paquet/paquet-editadd/paquet-editadd.component';
import { PaquetViewsignatComponent } from './paquet/paquet-viewsignat/paquet-viewsignat.component';
import { PaquetSignarComponent } from './paquet/paquet-signar/paquet-signar.component';
import { PaquetSignarmovilComponent } from './paquet/paquet-signarmovil/paquet-signarmovil.component';
import { AuthGuard } from './auth/auth-guard.service';

import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
defineLocale('es', esLocale); 

import { registerLocaleData} from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { MessagesComponent } from './messages/messages.component';
import { MessagesService } from './messages/messages.service';
import { ErrorPageComponent } from './shared/error-page/error-page.component';

registerLocaleData(localeEs,'es');


@NgModule({
  declarations: [
    AppComponent,
    CanvasComponent,
    ArribadesListComponent,
    LoginComponent,
    PaquetEditAddComponent,
    PaquetViewsignatComponent,
    PaquetSignarComponent,
    PaquetSignarmovilComponent,
    MessagesComponent,
    ErrorPageComponent
  ],
  imports: [
    BrowserModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    BsDatepickerModule.forRoot(),
    CollapseModule.forRoot(),
    AlertModule.forRoot(),
    ModalModule.forRoot(),
    PaginationModule.forRoot(),
    QRCodeModule,
    HttpClientModule,
    AppRoutingModule

  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: LOCALE_ID, useValue: 'es' },
    PaquetsService, DatabaseService,AuthService,AppRoutingModule,AuthGuard,MessagesService],
  bootstrap: [AppComponent]
})
export class AppModule { }
