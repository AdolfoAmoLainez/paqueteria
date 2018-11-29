import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PaquetsService } from 'src/app/shared/paquets.service';
import { Paquet } from 'src/app/shared/paquet.model';
import { DatabaseService } from 'src/app/shared/database.service';

@Component({
  selector: 'app-paquet-editadd',
  templateUrl: './paquet-editadd.component.html',
  styleUrls: ['./paquet-editadd.component.css']
})
export class PaquetEditAddComponent implements OnInit {
  formVisible: boolean = false;
  paquetForm: FormGroup;

  paquetEditing: Paquet;
  editMode: boolean = false;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private paquetsService: PaquetsService,
    private databaseService: DatabaseService) {

  }

  ngOnInit() {

    this.paquetForm = new FormGroup({
      'data_arribada': new FormControl(null,Validators.required),
      'remitent': new FormControl(null,Validators.required),
      'procedencia': new FormControl(null),
      'quantitat': new FormControl(null,[Validators.required, Validators.min(1)]),
      'mitja_arribada': new FormControl(null),
      'referencia': new FormControl(null),
      'destinatari': new FormControl(null,Validators.required),
      'departament': new FormControl(null,Validators.required)
      //'dipositari': new FormControl(null,Validators.required)
    });

    //console.log(this.route.snapshot.params);

    this.route.params.subscribe(
      (params: Params) => {

        switch (params['mode']) {
          case 'edit':
            this.paquetEditing = this.paquetsService.getPaquet(
              this.route.snapshot.params['id']
            );
            this.formVisible = true;
            this.editMode = true;

            this.paquetForm.patchValue({
              'data_arribada': new Date(this.paquetEditing.data_arribada),
              'remitent': this.paquetEditing.remitent,
              'procedencia': this.paquetEditing.procedencia,
              'quantitat': this.paquetEditing.quantitat,
              'mitja_arribada': this.paquetEditing.mitja_arribada,
              'referencia': this.paquetEditing.referencia,
              'destinatari': this.paquetEditing.destinatari,
              'departament': this.paquetEditing.departament
            });


            break;
          case 'add':
            this.formVisible = true;
            this.paquetForm.reset();
            break;
        }


      }
    )

  }

  onClear() {
    this.paquetForm.reset()
  }

  onHideForm() {
    this.formVisible = false;
    this.onClear();
    this.router.navigate(['llista']);
  }

  onPaquetAction() {
    if (this.editMode) {
      this.databaseService.updatePaquet(new Paquet(
        this.paquetEditing.id,
        this.paquetForm.get('data_arribada').value,
        this.paquetForm.get('remitent').value,
        this.paquetForm.get('procedencia').value,
        this.paquetForm.get('quantitat').value,
        this.paquetForm.get('mitja_arribada').value,
        this.paquetForm.get('referencia').value,
        this.paquetForm.get('destinatari').value,
        this.paquetForm.get('departament').value,
        0,
        "",
        "empty",
        0));
    } else {
      this.databaseService.addPaquet(new Paquet(
        0,
        this.paquetForm.get('data_arribada').value,
        this.paquetForm.get('remitent').value,
        this.paquetForm.get('procedencia').value,
        this.paquetForm.get('quantitat').value,
        this.paquetForm.get('mitja_arribada').value,
        this.paquetForm.get('referencia').value,
        this.paquetForm.get('destinatari').value,
        this.paquetForm.get('departament').value,
        0,
        "",
        "empty",
        0));
    }
  }

}
