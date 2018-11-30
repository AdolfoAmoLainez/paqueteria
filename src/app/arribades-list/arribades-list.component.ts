import { Component, OnInit, OnDestroy } from '@angular/core';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';

import { Paquet } from '../shared/paquet.model';
import { PaquetsService } from '../shared/paquets.service';
import { Subscription } from 'rxjs';
import { DatabaseService } from '../shared/database.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth/auth.service';

library.add(fas);

@Component({
  selector: 'app-arribades-list',
  templateUrl: './arribades-list.component.html',
  styleUrls: ['./arribades-list.component.css']
})
export class ArribadesListComponent implements OnInit, OnDestroy {

  editMode: boolean = true;
  signMode: boolean = false;
  allowViewPaquet: boolean = false; //Permet veure els botons de veure i editar

  changePaquetsSubscription: Subscription;
  //changeTotalPaquetsSubscription: Subscription;
  signSubscription: Subscription;
  paquetSignatSubscription: Subscription;

  paquets: Paquet[] = [];
  totalPaquets:number;
  paginaActual:number = 1;
  //Variables per controlar els paquets que veiem a la llista
  //"per Signar" o "Signats"
  vistaSeguent:string;
  vistaActual:string;

  constructor(private paquetsService: PaquetsService,
              private databaseService: DatabaseService,
              private router: Router,
              private route: ActivatedRoute,
              private authService: AuthService) { }

  ngOnDestroy() {
    this.changePaquetsSubscription.unsubscribe();
    //this.changeTotalPaquetsSubscription.unsubscribe();
    this.signSubscription.unsubscribe();
    this.paquetSignatSubscription.unsubscribe();
  }

  ngOnInit() {
    this.databaseService.getPaquetsPerSignar();
    this.vistaSeguent="Signats";
    this.vistaActual="per Signar";

    this.changePaquetsSubscription = this.paquetsService.changedPaquets.subscribe(
      (paquets: Paquet[]) => {
        this.paquets = paquets;
      }
    );


    this.signSubscription = this.paquetsService.startedSignPaquet.subscribe(
      (paquetId:number)=>{
        this.onEntregarPaquet(paquetId);
      }
    )

    this.paquetSignatSubscription = this.paquetsService.paquetSignatCorrectament.subscribe(
      (paquetId:number)=>{
        this.reloadLlista();
      }
    )
  }

  onEditPaquet(index: number) {
    this.signMode = false;
    this.editMode = true;
    this.paquetsService.startedEditPaquet.next(this.paquets[index]);

  }

  onEditClick(index: number) {

    this.router.navigate(['edit',index],{relativeTo: this.route});

  }

  onEntregarPaquet(index: number) {
    this.signMode = true;
    this.editMode = false;
    //this.paquetsService.startedSignPaquet.next(this.paquets[index]);
    this.router.navigate(['entrega',index],{relativeTo: this.route});
  }

  onViewClick(index: number) {

    this.router.navigate(['view',index],{relativeTo: this.route});

  }

  onGenerarQr(index: number) {
    this.signMode = true;
    this.editMode = false;
    this.paquets[index].qrcode=Math.floor(Math.random() * 1000) + 1;
    this.databaseService.updateQrPaquet(this.paquets[index]);


  }

  reloadLlista(){
    console.log("reloadLLista");
    //this.paginaActual=1;
    switch (this.vistaActual){
      case "per Signar": 
        this.databaseService.getPaquetsPerSignar();
        this.allowViewPaquet=false;

          break;
      case "Signats":
        this.databaseService.getPaquetsSignats();
        this.allowViewPaquet=true;
          break;
    } 
  }



  onSearch(valor:string){
    console.log(valor)
  }

  onChangeView(){
    if (this.vistaSeguent == "per Signar"){
      this.databaseService.getPaquetsPerSignar();
      this.vistaActual = this.vistaSeguent;
      this.vistaSeguent="Signats";
      this.allowViewPaquet=false;
    }else{
      this.databaseService.getPaquetsSignats();
      this.vistaActual = this.vistaSeguent;
      this.vistaSeguent="per Signar";
      this.allowViewPaquet=true;
    }
  }

  onNouPaquet(){
    this.router.navigate(['add',0],{relativeTo: this.route});
  }

  onLogout(){
    this.authService.logout();
  }

}
