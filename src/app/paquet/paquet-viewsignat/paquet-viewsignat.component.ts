import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { PaquetsService } from 'src/app/shared/paquets.service';
import { Paquet } from 'src/app/shared/paquet.model';

import {environment} from 'src/environments/environment';

@Component({
  selector: 'app-paquet-viewsignat',
  templateUrl: './paquet-viewsignat.component.html',
  styleUrls: ['./paquet-viewsignat.component.css']
})
export class PaquetViewsignatComponent implements OnInit {

  paquetForm: FormGroup;
  formVisible = false;
  qrCodePaquet = ''; // Variable que contindrà la url amb el codi QR
  paquetEditing: Paquet;
  tablename = ''; // Guardem la taula de la BBDD de paquets de l'usuari que l'està veient

  constructor(private route: ActivatedRoute,
              private paquetsService: PaquetsService,
              private router: Router) { }

  ngOnInit() {

    if (this.tablename === '') {
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      this.tablename = currentUser.tablename;
  }

    this.paquetForm = new FormGroup({
      data_arribada: new FormControl(null),
      remitent: new FormControl(null),
      procedencia: new FormControl(null),
      quantitat: new FormControl(null),
      mitja_arribada: new FormControl(null),
      referencia: new FormControl(null),
      destinatari: new FormControl(null),
      departament: new FormControl(null),
      dipositari: new FormControl(null),
      signatura: new FormControl(null),
      data_lliurament: new FormControl(null)
    });

    this.route.params.subscribe(
      (params: Params) => {

        this.paquetEditing = this.paquetsService.getPaquet(
          params.id
        );

        if (this.paquetEditing.qrcode !== undefined && this.paquetEditing.qrcode) {
          this.qrCodePaquet = environment.signUrlServer +
                              this.paquetEditing.id + '/' +
                              this.paquetEditing.qrcode + '/' +
                              this.tablename;
        } else {
          this.qrCodePaquet = '';
        }

        console.log(this.paquetEditing);

        this.paquetForm.patchValue({
          data_arribada: this.paquetEditing.data_arribada,
          remitent: this.paquetEditing.remitent,
          procedencia: this.paquetEditing.procedencia,
          quantitat: this.paquetEditing.quantitat,
          mitja_arribada: this.paquetEditing.mitja_arribada,
          referencia: this.paquetEditing.referencia,
          destinatari: this.paquetEditing.destinatari,
          departament: this.paquetEditing.departament,
          dipositari: this.paquetEditing.dipositari,
          signatura: this.paquetEditing.signatura,
          data_lliurament: this.paquetEditing.data_lliurament

        });
        this.formVisible = true;
       // console.log(this.paquetEditing);
      }
    );
  }

  onHideForm() {
    this.formVisible = false;
    this.router.navigate(['llista']);
  }
/*
  onAnar(){
    this.router.navigate(
      ['signarmovil/'+this.paquetEditing.id+'/'+this.paquetEditing.qrcode]
    );
  }
  */
}
