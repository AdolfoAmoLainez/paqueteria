import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { PaquetsService } from 'src/app/shared/paquets.service';

@Component({
  selector: 'app-paquet-viewsignat',
  templateUrl: './paquet-viewsignat.component.html',
  styleUrls: ['./paquet-viewsignat.component.css']
})
export class PaquetViewsignatComponent implements OnInit {

  paquetForm: FormGroup;
  formVisible:boolean=false;

  constructor(private route: ActivatedRoute,
    private paquetsService: PaquetsService) { }

  ngOnInit() {

    this.paquetForm = new FormGroup({
      'data_arribada': new FormControl(null),
      'remitent': new FormControl(null),
      'procedencia': new FormControl(null),
      'quantitat': new FormControl(null),
      'mitja_arribada': new FormControl(null),
      'referencia': new FormControl(null),
      'destinatari': new FormControl(null),
      'departament': new FormControl(null),
      'dipositari': new FormControl(null),
      'signatura': new FormControl(null)
    });

    this.route.params.subscribe(
      (params: Params) => {

        let paquetEditing = this.paquetsService.getPaquet(
          params['id']
        );

        this.paquetForm.patchValue({
          'data_arribada': new Date(paquetEditing.data_arribada),
          'remitent': paquetEditing.remitent,
          'procedencia': paquetEditing.procedencia,
          'quantitat': paquetEditing.quantitat,
          'mitja_arribada': paquetEditing.mitja_arribada,
          'referencia': paquetEditing.referencia,
          'destinatari': paquetEditing.destinatari,
          'departament': paquetEditing.departament,
          'dipositari':paquetEditing.dipositari,
          'signatura':paquetEditing.signatura
        });
        this.formVisible=true;
      }
    )
  }

  onHideForm(){
    this.formVisible=false;
  }
}
