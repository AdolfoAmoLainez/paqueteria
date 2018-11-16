import { Component, OnInit } from '@angular/core';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';

import {Paquet} from './paquet.model';
import { PaquetsService } from '../shared/paquets.service';

library.add(fas);

@Component({
  selector: 'app-arribades-list',
  templateUrl: './arribades-list.component.html',
  styleUrls: ['./arribades-list.component.css']
})
export class ArribadesListComponent implements OnInit {

  paquets: Paquet[] = [
    new Paquet(
      Date.now(),
      "Adolfo Amo",
      "Sid Comunicacio",
      1,
      "Missatger",
      "",
      "Trini Expósito",
      "Slipi CC",
      0,
      "",
      ""
    ),
    new Paquet(
      Date.now(),
      "Adolfo Amo2",
      "Sid Comunicacio",
      1,
      "Missatger",
      "",
      "Trini Expósito2",
      "Slipi CC",
      0,
      "",
      ""
    ),
  ]

  constructor(private paquetsService: PaquetsService) { }

  ngOnInit() {
  }

  onEditPaquet(index:number){
    console.log(index);
    this.paquetsService.startedEditPaquet.next(this.paquets[index]);
  }

}
