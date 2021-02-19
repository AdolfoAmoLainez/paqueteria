import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PaquetsService } from 'src/app/shared/paquets.service';
import { Paquet } from 'src/app/shared/paquet.model';
import { DatabaseService } from 'src/app/shared/database.service';

import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

import { AuthService } from 'src/app/auth/auth.service';
import { MyDateService } from 'src/app/shared/my-date.service';


@Component({
  selector: 'app-paquet-editadd',
  templateUrl: './paquet-editadd.component.html',
  styleUrls: ['./paquet-editadd.component.css']
})
export class PaquetEditAddComponent implements OnInit {
  
  // Icons
  faCalendarAlt = faCalendarAlt;

  formVisible = false;
  paquetForm: FormGroup;

  paquetEditing: Paquet;
  editMode = false;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private paquetsService: PaquetsService,
              private databaseService: DatabaseService,
               private authService: AuthService,
              private myDateAdapter: MyDateService) {  }

  ngOnInit() {

    // this.localeService.use('es');
    this.paquetForm = new FormGroup({
      data_arribada: new FormControl(null, Validators.required),
      hora_arribada: new FormControl(null, Validators.required),
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
              //let data: string = this.paquetEditing.data_arribada.toLocaleString();

              const data = new Date(this.paquetEditing.data_arribada);
              const hora = data.getHours();
              const minutes = data.getMinutes();

              this.paquetForm.patchValue({
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

              this.paquetForm.get('data_arribada').setValue(this.myDateAdapter.fromModel(data.getFullYear() + "-" + 
                                                            (data.getMonth() + 1) + "-" +
                                                            data.getDate()));
              this.paquetForm.get('hora_arribada').setValue(('0' + hora).slice(-2) + ':' + ('0' + minutes).slice(-2));


            }
            break;
          case 'add':
            this.formVisible = true;
            this.editMode = false;
            const ahora = new Date();
            const dataAct = ahora.getFullYear() + "-" + 
                            (ahora.getMonth() + 1) + "-" +
                            ahora.getDate()

            const ubicacioemail = this.authService.getLocalUser().ubicacioemail.replace('\\', '');

            const horaActInt = ahora.getHours();
            const minActInt = ahora.getMinutes();
            let horaActStr = '';
            let minActStr = '';

            if (horaActInt < 10 ) {
              horaActStr = '0' + horaActInt;
            } else {
              horaActStr = '' + horaActInt;
            }

            if (minActInt < 10 ) {
              minActStr = '0' + minActInt;
            } else {
              minActStr = '' + minActInt;
            }

            this.paquetForm.reset({
              ubicacioemail
            });

            this.paquetForm.get('data_arribada').setValue(this.myDateAdapter.fromModel(dataAct));
            this.paquetForm.get('hora_arribada').setValue(horaActStr + ':' + minActStr);

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
    //this.router.navigate(['llista']);
    window.history.back();

  }

  onPaquetAction() {
    if (this.editMode) {
      let data: string = this.myDateAdapter.toModel(this.paquetForm.get('data_arribada').value);
      data = data + ' ' + this.paquetForm.get('hora_arribada').value + ':00';

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

    } else {
      let data: string = this.myDateAdapter.toModel(this.paquetForm.get('data_arribada').value);

      data = data + ' ' + this.paquetForm.get('hora_arribada').value + ':00';

      this.databaseService.addPaquet(new Paquet(
        0,
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

  onDateSelected( event){
    console.log(event);
    
  }
  
}
