import { Component } from '@angular/core';

import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.css']
})
export class ErrorPageComponent {

  title: string;
  message: string;


  constructor(public bsModalRef: BsModalRef) { }


}
