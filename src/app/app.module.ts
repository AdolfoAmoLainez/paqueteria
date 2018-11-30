import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { AppComponent } from './app.component';
import { CanvasComponent } from './signature/canvas.component';
import { ArribadesListComponent } from './arribades-list/arribades-list.component';
import { LoginComponent } from './auth/login/login.component';

import { PaquetsService } from './shared/paquets.service';
import { DatabaseService } from './shared/database.service';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CollapseModule } from 'ngx-bootstrap';
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



@NgModule({
  declarations: [
    AppComponent,
    CanvasComponent,
    ArribadesListComponent,
    LoginComponent,
    PaquetEditAddComponent,
    PaquetViewsignatComponent,
    PaquetSignarComponent,
    PaquetSignarmovilComponent
  ],
  imports: [
    BrowserModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    BsDatepickerModule.forRoot(),
    CollapseModule.forRoot(),
    AlertModule.forRoot(),
    PaginationModule.forRoot(),
    QRCodeModule,
    HttpClientModule,
    AppRoutingModule

  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    PaquetsService, DatabaseService,AuthService,AppRoutingModule,AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
