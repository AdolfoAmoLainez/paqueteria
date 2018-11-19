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

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CollapseModule } from 'ngx-bootstrap';
import {QRCodeModule} from 'angularx-qrcode';


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
    QRCodeModule

  ],
  providers: [PaquetsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
