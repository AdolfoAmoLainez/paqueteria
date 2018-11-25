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
  changeTotalPaquetsSubscription: Subscription;

  paquets: Paquet[] = [];
  totalPaquets:number;
  vistaSeguent:string;
  vistaActual:string;

  constructor(private paquetsService: PaquetsService,
              private databaseService: DatabaseService) { }

  ngOnDestroy() {
    this.changePaquetsSubscription.unsubscribe();
    this.changeTotalPaquetsSubscription.unsubscribe();
  }

  ngOnInit() {
    this.databaseService.getPaquetsPerSignar(1);
    this.vistaSeguent="Signats";
    this.vistaActual="per Signar";

    this.changePaquetsSubscription = this.paquetsService.changedPaquets.subscribe(
      (paquets: Paquet[]) => {
        this.paquets = paquets;
      }
    );

    this.changeTotalPaquetsSubscription = this.paquetsService.changedTotalPaquets.subscribe(
      (total)=>{
        this.totalPaquets = total;
      }
    )
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

  pageChanged(event){
    switch (this.vistaSeguent){
      case "per Signar": 
        this.databaseService.getPaquetsPerSignar(event.page);
          break;
      case "Signats":
        this.databaseService.getPaquetsSignats(event.page);
          break;
    }
  }

  onSearch(valor:string){
    console.log(valor)
  }

  onChangeView(){
    if (this.vistaSeguent == "per Signar"){
      this.databaseService.getPaquetsPerSignar(1);
      this.vistaActual = this.vistaSeguent;
      this.vistaSeguent="Signats";
    }else{
      this.databaseService.getPaquetsSignats(1);
      this.vistaActual = this.vistaSeguent;
      this.vistaSeguent="per Signar";
    }
  }

}
