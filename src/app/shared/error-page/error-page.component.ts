import { Component } from '@angular/core';

import { BsModalRef } from 'ngx-bootstrap/modal';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.css']
})
export class ErrorPageComponent {

  title: string;
  message: string;
  status: number;


  constructor(public bsModalRef: BsModalRef) { }

  onClose() {
    this.bsModalRef.hide();
    if (this.status === 0 ) {
      window.location.href = environment.dataServerURL + '/loginapi/login';
    }

  }

}
