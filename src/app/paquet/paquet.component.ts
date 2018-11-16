import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { PaquetsService } from '../shared/paquets.service';
import { Paquet } from '../arribades-list/paquet.model';

@Component({
  selector: 'app-paquet',
  templateUrl: './paquet.component.html',
  styleUrls: ['./paquet.component.css']
})
export class PaquetComponent implements OnInit, OnDestroy {

  paquetForm: FormGroup;
  editMode:boolean = false;
  formVisible:boolean = true;

  editSubscription: Subscription;

  constructor(private paquetsService: PaquetsService) { }

  ngOnDestroy(){
    this.editSubscription.unsubscribe();
  }

  ngOnInit() {

    this.paquetForm = new FormGroup({
      'data_arribada':new FormControl(null),
      'remitent':new FormControl(null),
      'procedencia':new FormControl(null),
      'quantitat':new FormControl(null),
      'mitja_arribada':new FormControl(null),
      'referencia':new FormControl(null),
      'destinatari':new FormControl(null),
      'departament':new FormControl(null)
    });

    this.editSubscription = this.paquetsService.startedEditPaquet.subscribe(
      (paquet:Paquet)=>{
        console.log(paquet);
        this.paquetForm.patchValue({
          'data_arribada':new Date(paquet.data_arribada),
          'remitent': paquet.remitent,
          'procedencia':paquet.procedencia,
          'quantitat':paquet.quantitat,
          'mitja_arribada':paquet.mitja_arribada,
          'referencia':paquet.referencia,
          'destinatari':paquet.destinatari,
          'departament':paquet.departament
        });
        this.formVisible=true;
        this.editMode = true;
      }
    );
  }

  onShowForm(){
    this.formVisible = true;
  }

  onHideForm(){
    this.formVisible = false;
  }

}
