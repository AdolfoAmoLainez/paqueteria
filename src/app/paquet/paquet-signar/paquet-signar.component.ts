import { Component, OnInit, ViewChild, ElementRef, Input, AfterViewInit, OnDestroy } from '@angular/core';

import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/pairwise';
import 'rxjs/add/operator/switchMap';
import { Observable, Subscription } from 'rxjs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { PaquetsService } from 'src/app/shared/paquets.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Paquet } from 'src/app/shared/paquet.model';
import { DatabaseService } from 'src/app/shared/database.service';

@Component({
  selector: 'app-paquet-signar',
  templateUrl: './paquet-signar.component.html',
  styleUrls: ['./paquet-signar.component.css']
})
export class PaquetSignarComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('canvas') public canvas: ElementRef;
  @Input() public width = 400;
  @Input() public height = 300;
  private cx: CanvasRenderingContext2D;

  paquetForm: FormGroup;
  paquetEditing: Paquet;
  qrCodePaquet: string = ''//Variable que contindrà la url amb el codi QR
  signUrlServer = 'http://localhost:3000/paquetqr/';
  paquetSignatCorrectament: boolean = false;
  formVisible:boolean = false;

  paquetSignatSubscription: Subscription;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private paquetsService: PaquetsService,
              private databaseService: DatabaseService) { }

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

  ngOnDestroy(){
    this.paquetSignatSubscription.unsubscribe();
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
      'dipositari': new FormControl(null)
    });

    this.paquetSignatSubscription = this.paquetsService.paquetSignatCorrectament.subscribe(
      (paquetId:number)=>{
        this.paquetSignatCorrectament=true;
        this.formVisible=false;
      }
    )
    
    this.route.params.subscribe(
      (params: Params) => {

        this.paquetEditing = this.paquetsService.getPaquet(
          params['id']
        );

        if(this.paquetEditing.signatura!="empty"){
          this.paquetSignatCorrectament=true;
        }else{
          this.paquetSignatCorrectament=false;
          if (this.paquetEditing.qrcode != undefined && this.paquetEditing.qrcode != 0) {
            this.qrCodePaquet = this.signUrlServer + this.paquetEditing.id + "/" + this.paquetEditing.qrcode
          } else {
            this.qrCodePaquet = '';
          }

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
  
          this.formVisible=true;
        }


      }
    )
  }

  onHideForm(){
    this.formVisible=false;
    this.router.navigate(['llista']);
  }

  onSignar() {
    this.paquetEditing.dipositari = this.paquetForm.get('dipositari').value;
    this.paquetEditing.signatura = this.canvas.nativeElement.toDataURL();
    this.databaseService.signaPaquet(this.paquetEditing);
    //window.location.reload();
    this.onHideForm();
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
