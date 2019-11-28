import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PaquetsService } from 'src/app/shared/paquets.service';
import { Paquet } from 'src/app/shared/paquet.model';
import { DatabaseService } from 'src/app/shared/database.service';

import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { esLocale } from 'ngx-bootstrap/locale';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { AuthService } from 'src/app/auth/auth.service';


@Component({
  selector: 'app-paquet-editadd',
  templateUrl: './paquet-editadd.component.html',
  styleUrls: ['./paquet-editadd.component.css']
})
export class PaquetEditAddComponent implements OnInit {
  formVisible = false;
  paquetForm: FormGroup;

  paquetEditing: Paquet;
  editMode = false;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private paquetsService: PaquetsService,
              private databaseService: DatabaseService,
              private localeService: BsLocaleService,
              private authService: AuthService) {

      defineLocale('es', esLocale);
      this.localeService.use('es');

  }

  ngOnInit() {

    // this.localeService.use('es');
    this.paquetForm = new FormGroup({
      data_arribada: new FormControl(null, Validators.required),
      remitent: new FormControl(null, Validators.required),
      procedencia: new FormControl(null),
      quantitat: new FormControl(null, [Validators.required, Validators.min(1)]),
      mitja_arribada: new FormControl(null),
      referencia: new FormControl(null),
      destinatari: new FormControl(null, Validators.required),
      departament: new FormControl(null, Validators.required),
      email: new FormControl(null, Validators.email),
      emailremitent: new FormControl(null, Validators.email),
      ubicacioemail: new FormControl(null, Validators.required)
      // 'dipositari': new FormControl(null,Validators.required)
    });

    // console.log(this.route.snapshot.params);

    this.route.params.subscribe(
      (params: Params) => {

        switch (params.mode) {
          case 'edit':
            this.paquetEditing = this.paquetsService.getPaquet(
              +this.route.snapshot.params.id
            );

            if (!this.paquetEditing) {
              this.onHideForm();
            } else {

              this.formVisible = true;
              this.editMode = true;
              let data: string = this.paquetEditing.data_arribada.toLocaleString();
              // console.log(data);
              if (data.indexOf('.000Z') !== -1) {
                data = new Date(this.paquetEditing.data_arribada).toLocaleString();
                const dataDate = new Date(this.paquetEditing.data_arribada);
                data = dataDate.getDate + '/' + (dataDate.getMonth() + 1) + '/' + dataDate.getFullYear() + ' ' +
                     dataDate.getHours() + ':' + dataDate.getMinutes();
              } else {
                data = this.paquetEditing.data_arribada.toLocaleString();
              }
              // console.log("add date: "+ data);

              this.paquetForm.patchValue({
                // 'data_arribada': this.paquetEditing.data_arribada,
                data_arribada: data,
                remitent: this.paquetEditing.remitent,
                procedencia: this.paquetEditing.procedencia,
                quantitat: this.paquetEditing.quantitat,
                mitja_arribada: this.paquetEditing.mitja_arribada,
                referencia: this.paquetEditing.referencia,
                destinatari: this.paquetEditing.destinatari,
                departament: this.paquetEditing.departament,
                email: this.paquetEditing.email,
                emailremitent: this.paquetEditing.emailremitent,
                ubicacioemail: this.paquetEditing.ubicacioemail.replace('\\', '')
              });

            }
            break;
          case 'add':
            this.formVisible = true;
            this.editMode = false;
            const ahora = new Date().toLocaleString('es-ES');
            const ubicacioemail = this.authService.getLocalUser().ubicacioemail.replace('\\', '');

            this.paquetForm.reset({
              data_arribada: ahora,
              ubicacioemail
            });
            break;
        }
      }
    );
  }

  onClear() {
    const ahora = new Date().toLocaleString('es-ES');
    const ubicacioemail = this.authService.getLocalUser().ubicacioemail;

    this.paquetForm.reset({
      data_arribada: ahora,
      ubicacioemail
    });
  }

  onHideForm() {
    this.formVisible = false;
    this.onClear();
    this.router.navigate(['llista']);
  }

  onPaquetAction() {
    if (this.editMode) {
      let data: string = this.paquetForm.get('data_arribada').value.toLocaleString();
      // console.log(data);
      if (data.indexOf('.000Z') !== -1) {
        data = new Date(this.paquetForm.get('data_arribada').value).toLocaleString();
        const dataDate = new Date(this.paquetForm.get('data_arribada').value);
        data = dataDate.getDate + '/' + (dataDate.getMonth() + 1) + '/' + dataDate.getFullYear() + ' ' +
             dataDate.getHours() + ':' + dataDate.getMinutes();
      } else {
        data = this.paquetForm.get('data_arribada').value.toLocaleString();
      }
      // console.log("Edit date: "+data);
      this.databaseService.updatePaquet(new Paquet(
        this.paquetEditing.id,
        data,
        this.paquetForm.get('remitent').value,
        this.paquetForm.get('procedencia').value,
        this.paquetForm.get('quantitat').value,
        this.paquetForm.get('mitja_arribada').value,
        this.paquetForm.get('referencia').value,
        this.paquetForm.get('destinatari').value,
        this.paquetForm.get('departament').value,
        '',
        '',
        'empty',
        0,
        this.paquetForm.get('email').value,
        this.paquetForm.get('emailremitent').value,
        this.paquetForm.value.ubicacioemail.replace('\\', ''))
        );
        // console.log(this.paquetForm.get('data_arribada').value);
    } else {
      let data: string = this.paquetForm.get('data_arribada').value.toLocaleString();
      // console.log(data);
      if (data.indexOf('.000Z') !== -1) {
        data = new Date(this.paquetForm.get('data_arribada').value).toLocaleString();
        const dataDate = new Date(this.paquetForm.get('data_arribada').value);
        data = dataDate.getDate + '/' + (dataDate.getMonth() + 1) + '/' + dataDate.getFullYear() + ' ' +
             dataDate.getHours() + ':' + dataDate.getMinutes();
      } else {
        data = this.paquetForm.get('data_arribada').value.toLocaleString();
      }
      // console.log("add date: "+ data);

      this.databaseService.addPaquet(new Paquet(
        0,
        // this.paquetForm.get('data_arribada').value,
        data,
        this.paquetForm.get('remitent').value,
        this.paquetForm.get('procedencia').value,
        this.paquetForm.get('quantitat').value,
        this.paquetForm.get('mitja_arribada').value,
        this.paquetForm.get('referencia').value,
        this.paquetForm.get('destinatari').value,
        this.paquetForm.get('departament').value,
        '',
        '',
        'empty',
        0,
        this.paquetForm.get('email').value,
        this.paquetForm.get('emailremitent').value,
        this.paquetForm.value.ubicacioemail.replace('\\', '')
        ));

      this.onHideForm();
    }
  }

}
