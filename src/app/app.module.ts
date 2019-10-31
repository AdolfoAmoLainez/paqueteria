import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CanvasComponent } from './signature/canvas.component';
import { ArribadesListComponent } from './arribades-list/arribades-list.component';
import { LoginComponent } from './auth/login/login.component';
import { PaquetEditAddComponent } from './paquet/paquet-editadd/paquet-editadd.component';
import { PaquetViewsignatComponent } from './paquet/paquet-viewsignat/paquet-viewsignat.component';
import { PaquetSignarComponent } from './paquet/paquet-signar/paquet-signar.component';
import { PaquetSignarmovilComponent } from './paquet/paquet-signarmovil/paquet-signarmovil.component';
import { MessagesComponent } from './messages/messages.component';
import { ErrorPageComponent } from './shared/error-page/error-page.component';
import { UsersListComponent } from './admin/users-list/users-list.component';
import { UserEditaddComponent } from './admin/user-editadd/user-editadd.component';
import { AppRoutingModule } from './app-routing.module';
import { ErrorInterceptor } from './shared/httperror.interceptor';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CollapseModule, ModalModule } from 'ngx-bootstrap';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { AlertModule } from 'ngx-bootstrap/alert';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import {QRCodeModule} from 'angularx-qrcode';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';

import localeEs from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
import { fas, faQrcode } from '@fortawesome/free-solid-svg-icons';

registerLocaleData(localeEs, 'es');

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
    ErrorPageComponent,
    UsersListComponent,
    UserEditaddComponent
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
    TooltipModule.forRoot(),
    QRCodeModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    //    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: LOCALE_ID, useValue: 'es' }, ],
  bootstrap: [AppComponent]
})
export class AppModule {

  constructor(iconLibrary: FaIconLibrary) {
    iconLibrary.addIconPacks(fas);
    iconLibrary.addIcons(faQrcode);
  }

 }
