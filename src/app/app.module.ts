import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { AppComponent } from './app.component';
import { CanvasComponent } from './signature/canvas.component';
import { ArribadesListComponent } from './arribades-list/arribades-list.component';
import { PaquetComponent } from './paquet/paquet.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { PaquetsService } from './shared/paquets.service';

@NgModule({
  declarations: [
    AppComponent,
    CanvasComponent,
    ArribadesListComponent,
    PaquetComponent
  ],
  imports: [
    BrowserModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    BsDatepickerModule.forRoot()

  ],
  providers: [PaquetsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
