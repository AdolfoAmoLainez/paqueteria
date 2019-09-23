import {
  Component, Input, ElementRef, AfterViewInit, ViewChild
} from '@angular/core';
import { fromEvent} from 'rxjs';

import { switchMap, takeUntil, pairwise } from 'rxjs/operators';
// import 'rxjs/add/observable/fromEvent';
/* import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/pairwise';
import 'rxjs/add/operator/switchMap'; */

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styles: ['canvas { border: 1px solid #000; }']
})
export class CanvasComponent implements AfterViewInit {

  @ViewChild('canvas', {static: false}) public canvas: ElementRef;

  @Input() public width = 400;
  @Input() public height = 400;



  imagen: string;

  private cx: CanvasRenderingContext2D;



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

  logCanvas() {
    this.imagen = this.canvas.nativeElement.toDataURL();
  }

  onHideForm() {}

  onSignar() {}

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
