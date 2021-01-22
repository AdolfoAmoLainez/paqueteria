import { Component, OnInit, ViewChild, ElementRef, Input, AfterViewInit, OnDestroy } from '@angular/core';

// import 'rxjs/add/observable/fromEvent';
import { switchMap, takeUntil, pairwise } from 'rxjs/operators';
// import 'rxjs/add/operator/takeUntil';
// import 'rxjs/add/operator/pairwise';
// import 'rxjs/add/operator/switchMap';
import { Subscription, fromEvent } from 'rxjs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { PaquetsService } from 'src/app/shared/paquets.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Paquet } from 'src/app/shared/paquet.model';
import { DatabaseService } from 'src/app/shared/database.service';
import {environment} from 'src/environments/environment';
import { MyDateService } from 'src/app/shared/my-date.service';

@Component({
  selector: 'app-paquet-signar',
  templateUrl: './paquet-signar.component.html',
  styleUrls: ['./paquet-signar.component.css']
})
export class PaquetSignarComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('canvas') public canvas: ElementRef;
  @ViewChild('canvasBlanc') public canvasBlanc: ElementRef;
  @Input() public width = 300;
  @Input() public height = 300;
  private cx: CanvasRenderingContext2D;

  paquetForm: FormGroup;
  paquetEditing: Paquet;
  qrCodePaquet = ''; // Variable que contindrà la url amb el codi QR

  paquetSignatCorrectament = false;
  formVisible = false;

  paquetSignatSubscription: Subscription;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private paquetsService: PaquetsService,
              private databaseService: DatabaseService,
              private myDateAdapter: MyDateService) { }

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

  ngOnDestroy() {
    this.paquetSignatSubscription.unsubscribe();
  }

  ngOnInit() {

    this.paquetForm = new FormGroup({
      dipositari: new FormControl(null, Validators.required)
    });

    this.paquetSignatSubscription = this.paquetsService.paquetSignatCorrectament.subscribe(
      (paquetId: number) => {
        this.paquetSignatCorrectament = true;
        this.formVisible = false;
      }
    );

    this.route.params.subscribe(
      (params: Params) => {

        this.paquetEditing = this.paquetsService.getPaquet(
          +params.id
        );

        if (this.paquetEditing.signatura !== 'empty') {
          this.paquetSignatCorrectament = true;
        } else {
          this.paquetSignatCorrectament = false;
          if (this.paquetEditing.qrcode !== undefined && this.paquetEditing.qrcode !== 0 && params.mode !== 'nomessignar') {
            this.qrCodePaquet = environment.signUrlServer + this.paquetEditing.id + '/' + this.paquetEditing.qrcode;
          } else {
            this.qrCodePaquet = '';
          }

          this.formVisible = true;
        }
      }
    );
  }

  onHideForm() {
    this.formVisible = false;
    this.router.navigate(['llista']);
  }

  onSignar() {
    this.paquetEditing.dipositari = this.paquetForm.get('dipositari').value;
    this.paquetEditing.signatura = this.canvas.nativeElement.toDataURL();
    this.databaseService.signaPaquet(this.paquetEditing);
    this.onHideForm();
  }

  onAnar() {
    this.router.navigate(
      ['signarmovil/' + this.paquetEditing.id + '/' + this.paquetEditing.qrcode]
    );
  }

  // Tenim un canvas hidden amb les mateixes propietats
  // Mirem si el contingut és igual, llavors no hi ha cap signatura dibuixada
  senseSignar(): boolean {
    if (this.canvas.nativeElement.toDataURL() === this.canvasBlanc.nativeElement.toDataURL()) {
      return true;
    } else {
      return false;
    }
  }

  private captureEvents(canvasEl: HTMLCanvasElement) {
    /**
     * Gestionamos movimiento de ratón
     */
    fromEvent(canvasEl, 'mousedown').pipe(
      switchMap((e) => {
        return fromEvent(canvasEl, 'mousemove').pipe(
          takeUntil(fromEvent(canvasEl, 'mouseup'))).pipe(
          pairwise());
      }))
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
    fromEvent(canvasEl, 'touchstart').pipe(
      switchMap((e) => {
        return fromEvent(canvasEl, 'touchmove').pipe(
          takeUntil(fromEvent(canvasEl, 'touchend'))).pipe(
          pairwise());
      }))
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
