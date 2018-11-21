import { Component, OnInit, OnDestroy } from '@angular/core';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';

import { Paquet } from '../shared/paquet.model';
import { PaquetsService } from '../shared/paquets.service';
import { Subscription } from 'rxjs';
import { DatabaseService } from '../shared/database.service';

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

  constructor(private paquetsService: PaquetsService,
              private databaseService: DatabaseService) { }

  ngOnDestroy() {
    this.changePaquetsSubscription.unsubscribe();
  }

  ngOnInit() {
    this.databaseService.getPaquetsPerSignar();

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
    this.paquets[index].qrcode=Math.floor(Math.random() * 1000) + 1;
    this.databaseService.updateSignedPaquet(this.paquets[index]);


  }

}
