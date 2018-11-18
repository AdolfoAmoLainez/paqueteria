import { Component, OnInit, OnDestroy, Input, ElementRef, AfterViewInit, ViewChild, } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { PaquetsService } from '../shared/paquets.service';
import { Paquet } from '../arribades-list/paquet.model';

import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/pairwise';
import 'rxjs/add/operator/switchMap';


@Component({
  selector: 'app-paquet',
  templateUrl: './paquet.component.html',
  styleUrls: ['./paquet.component.css']
})
export class PaquetComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('canvas') public canvas: ElementRef;
  @Input() public width = 400;
  @Input() public height = 300;

  private cx: CanvasRenderingContext2D;

  paquetForm: FormGroup;
  formVisible: boolean = false;
  formEditable: boolean = false;
  signMode: boolean = false;
  editMode: boolean = false;
  addMode: boolean = false;
  paquetEditingIndex: number;
  signaturaPaquet:string = '';

  editSubscription: Subscription;
  signSubscription: Subscription;

  constructor(private paquetsService: PaquetsService) { }

  public ngAfterViewInit() {
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    this.cx = canvasEl.getContext('2d');

    canvasEl.width = this.width;
    canvasEl.height = this.height;

    this.cx.lineWidth = 3;
    this.cx.lineCap = 'round';
    this.cx.strokeStyle = '#000';

    this.captureEvents(canvasEl);
  }

  ngOnDestroy() {
    this.editSubscription.unsubscribe();
  }

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
      'dipositari' : new FormControl(null)
    });

    this.editSubscription = this.paquetsService.startedEditPaquet.subscribe(
      (paquet: Paquet) => {
        //console.log(paquet);
        this.paquetForm.patchValue({
          'data_arribada': new Date(paquet.data_arribada),
          'remitent': paquet.remitent,
          'procedencia': paquet.procedencia,
          'quantitat': paquet.quantitat,
          'mitja_arribada': paquet.mitja_arribada,
          'referencia': paquet.referencia,
          'destinatari': paquet.destinatari,
          'departament': paquet.departament
        });
        this.formVisible = true;
        this.editMode = true;
        this.signMode = false;
        this.formEditable = true;
        this.paquetEditingIndex = paquet.id;
        this.signaturaPaquet = paquet.signatura;
      }
    );

    this.signSubscription = this.paquetsService.startedSignPaquet.subscribe(
      (paquet: Paquet) => {
        //console.log(paquet);
        this.onClear();
        this.paquetForm.patchValue({
          'data_arribada': new Date(paquet.data_arribada),
          'remitent': paquet.remitent,
          'procedencia': paquet.procedencia,
          'quantitat': paquet.quantitat,
          'mitja_arribada': paquet.mitja_arribada,
          'referencia': paquet.referencia,
          'destinatari': paquet.destinatari,
          'departament': paquet.departament,
          'dipositari' : paquet.dipositari
        });
        this.formVisible = true;
        this.editMode = false;
        this.signMode = true;
        this.formEditable = false;
        this.paquetEditingIndex = paquet.id;
        this.signaturaPaquet = paquet.signatura;

      }
    );
  }

  onShowForm() {
    this.formVisible = true;
    this.addMode = true;
    this.signMode = false;
    this.editMode = false;
    this.formEditable = true;
  }

  onHideForm() {
    this.formVisible = false;
    this.addMode = true;
    this.signMode = false;
    this.editMode = false;
    this.signaturaPaquet='';
    this.onClear();
  }

  onClear() {
    this.paquetForm.reset()
    this.editMode = false;
    this.signaturaPaquet='';
    this.cx.clearRect(0, 0, this.width, this.height);
  }

  onSignar() {
    this.paquetsService.signaPaquet(this.paquetEditingIndex,
      this.paquetForm.get('dipositari').value,
      this.canvas.nativeElement.toDataURL());
  }

  onPaquetAction() {
    if (this.editMode) {
      this.paquetsService.updatePaquet(new Paquet(
        this.paquetEditingIndex,
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
        ""));
    } else {
      this.paquetsService.addPaquet(new Paquet(
        this.paquetEditingIndex,
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
        ""));
    }
  }

  private captureEvents(canvasEl: HTMLCanvasElement) {
    /**
     * Gestionamos movimiento de ratón
     */
    Observable
      .fromEvent(canvasEl, 'mousedown')
      .switchMap((e) => {
        return Observable
          .fromEvent(canvasEl, 'mousemove')
          .takeUntil(Observable.fromEvent(canvasEl, 'mouseup'))
          .pairwise()
      })
      .subscribe((res: [MouseEvent, MouseEvent]) => {
        const rect = canvasEl.getBoundingClientRect();

        const prevPos = {
          x: res[0].clientX - rect.left,
          y: res[0].clientY - rect.top
        };

        const currentPos = {
          x: res[1].clientX - rect.left,
          y: res[1].clientY - rect.top
        };

        this.drawOnCanvas(prevPos, currentPos);
      });

    /**
     * Gestionamos movimiento en pantallas
     * táctiles
     */
    Observable
      .fromEvent(canvasEl, 'touchstart')
      .switchMap((e) => {
        return Observable
          .fromEvent(canvasEl, 'touchmove')
          .takeUntil(Observable.fromEvent(canvasEl, 'touchend'))
          .pairwise()
      })
      .subscribe((res: [TouchEvent, TouchEvent]) => {

        res[0].preventDefault();
        res[1].preventDefault();

        const rect = canvasEl.getBoundingClientRect();

        const prevPos = {
          x: res[0].changedTouches[0].clientX - rect.left,
          y: res[0].changedTouches[0].clientY - rect.top
        };

        const currentPos = {
          x: res[1].changedTouches[0].clientX - rect.left,
          y: res[1].changedTouches[0].clientY - rect.top
        };

        this.drawOnCanvas(prevPos, currentPos);
      });
  }

  private drawOnCanvas(prevPos: { x: number, y: number }, currentPos: { x: number, y: number }) {
    if (!this.cx) { return; }

    this.cx.beginPath();

    if (prevPos) {
      this.cx.moveTo(prevPos.x, prevPos.y); // from
      this.cx.lineTo(currentPos.x, currentPos.y);
      this.cx.stroke();
    }
  }


}