import { Component, Input } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.css']
})
export class ErrorPageComponent {

  @Input() title: string;
  @Input() message: string;
  @Input() status: number;


  constructor() { }

  onClose() {
    if (this.status === 0 ) {
      window.location.href = environment.dataServerURL + '/cas/login';
    }

  }

}
