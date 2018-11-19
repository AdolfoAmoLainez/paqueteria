import { Component, OnInit, OnDestroy } from '@angular/core';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';

import { Paquet } from '../shared/paquet.model';
import { PaquetsService } from '../shared/paquets.service';
import { Subscription } from 'rxjs';

library.add(fas);

@Component({
  selector: 'app-arribades-list',
  templateUrl: './arribades-list.component.html',
  styleUrls: ['./arribades-list.component.css']
})
export class ArribadesListComponent implements OnInit, OnDestroy {

  editMode: boolean = true;
  signMode: boolean = false;

  changePaquetsSubscription: Subscription;

  paquets: Paquet[] = [];

  constructor(private paquetsService: PaquetsService) { }

  ngOnDestroy() {
    this.changePaquetsSubscription.unsubscribe();
  }

  ngOnInit() {
    this.paquets = this.paquetsService.getPaquets();

    this.changePaquetsSubscription = this.paquetsService.changedPaquets.subscribe(
      (paquets: Paquet[]) => {
        this.paquets = paquets
      }
    );
  }

  onEditPaquet(index: number) {
    this.signMode = false;
    this.editMode = true;
    this.paquetsService.startedEditPaquet.next(this.paquets[index]);

  }

  onEntregarPaquet(index: number) {
    this.signMode = true;
    this.editMode = false;
    this.paquetsService.startedSignPaquet.next(this.paquets[index]);

  }

  onGenerarQr(index: number) {
    this.signMode = true;
    this.editMode = false;
    this.paquets[index].qrcode=Math.floor(Math.random() * 1000) + 1  
    this.paquetsService.startedSignPaquet.next(this.paquets[index]);

  }

}
