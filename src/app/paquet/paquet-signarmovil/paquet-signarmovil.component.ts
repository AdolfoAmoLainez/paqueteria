import { Component, OnInit, ViewChild, ElementRef, Input, AfterViewInit } from '@angular/core';
import { DatabaseService } from 'src/app/shared/database.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Paquet } from 'src/app/shared/paquet.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/pairwise';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-paquet-signarmovil',
  templateUrl: './paquet-signarmovil.component.html',
  styleUrls: ['./paquet-signarmovil.component.css']
})
export class PaquetSignarmovilComponent implements OnInit, AfterViewInit {

  @ViewChild('canvas') public canvas: ElementRef;
  @ViewChild('canvasBlanc') public canvasBlanc: ElementRef; // per verificar senseSignar
  @Input() public width = 400;
  @Input() public height = 300;

  private cx: CanvasRenderingContext2D;

  paquetSignatCorrectament: boolean = false;
  paquetForm: FormGroup;
  paquetEditing: Paquet;
  formVisible:boolean = true;

  constructor( private databaseService: DatabaseService,
    private route: ActivatedRoute,
    private router: Router) { }

    public ngAfterViewInit() {
      const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
      const canvasBlancEl: HTMLCanvasElement = this.canvasBlanc.nativeElement;
      this.cx = canvasEl.getContext('2d');
  
      canvasEl.width = this.width;
      canvasEl.height = this.height;
      canvasBlancEl.width = this.width;
      canvasBlancEl.height = this.height;
  
      this.cx.lineWidth = 3;
      this.cx.lineCap = 'round';
      this.cx.strokeStyle = '#000';
  
      this.captureEvents(canvasEl);
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
      'dipositari': new FormControl(null,Validators.required)
    });
    

    if (this.route.snapshot.params['id'] != undefined &&
    this.route.snapshot.params['id'] != null &&
    this.route.snapshot.params['qrcode'] != undefined &&
    this.route.snapshot.params['qrcode'] != null) {

    this.databaseService.getPaquetQr(this.route.snapshot.params['id'], this.route.snapshot.params['qrcode'])
      .subscribe(
        (data: any) => {
          console.log(data);
          if (data.length == 0) {
            this.paquetSignatCorrectament = true;
          } else {
            for (let elem in data) {
              this.paquetEditing = new Paquet(
                data[elem].id,
                data[elem].data_arribada,
                data[elem].remitent,
                data[elem].procedencia,
                data[elem].quantitat,
                data[elem].mitja_arribada,
                data[elem].referencia,
                data[elem].destinatari,
                data[elem].departament,
                data[elem].data_lliutament,
                data[elem].dipositari,
                data[elem].signatura,
                0,
                data[elem].email
              )
            }
          }

          this.paquetForm.patchValue({
            'data_arribada':this.paquetEditing.data_arribada,
            'remitent': this.paquetEditing.remitent,
            'procedencia': this.paquetEditing.procedencia,
            'quantitat': this.paquetEditing.quantitat,
            'mitja_arribada': this.paquetEditing.mitja_arribada,
            'referencia': this.paquetEditing.referencia,
            'destinatari': this.paquetEditing.destinatari,
            'departament': this.paquetEditing.departament,
            'dipositari': this.paquetEditing.dipositari
          });


        }
      );
  }

  }

  onSignar() {
    this.paquetEditing.dipositari = this.paquetForm.get('dipositari').value;
    this.paquetEditing.signatura = this.canvas.nativeElement.toDataURL();
    this.databaseService.signaPaquet(this.paquetEditing);
    window.location.reload();
  }

  onClear() {
    this.paquetForm.patchValue({
      'dipositari': ''
    })

    this.cx.clearRect(0, 0, this.width, this.height);
  }

  onHideForm() {
    this.paquetSignatCorrectament = false;
    this.formVisible=false;
    this.onClear();
    this.router.navigate(['llista']);
  }

    //Tenim un canvas hidden amb les mateixes propietats
  //Mirem si el contingut és igual, llavors no hi ha cap signatura dibuixada
  senseSignar():boolean{
    if(this.canvas.nativeElement.toDataURL() == this.canvasBlanc.nativeElement.toDataURL())
      return true;
    else 
      return false;
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
