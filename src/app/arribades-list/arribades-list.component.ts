import { Component, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';

import { Paquet } from '../shared/paquet.model';
import { PaquetsService } from '../shared/paquets.service';
import { Subscription } from 'rxjs';
import { DatabaseService } from '../shared/database.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { isUndefined } from 'util';

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

  deleteModalMsg: string ="Vols esborrar el paquet?";
  deleteModalRef: BsModalRef;
  deletePaquetIndex:number = 0;

  mailModalMsg: string ="Vols reenviar l'avís del paquet per correu-e?";
  mailModalRef: BsModalRef;
  mailPaquetIndex:number = 0;


  constructor(private paquetsService: PaquetsService,
              private databaseService: DatabaseService,
              private router: Router,
              private route: ActivatedRoute,
              private authService: AuthService,
              private modalService: BsModalService,) { }

  ngOnDestroy() {
    this.changePaquetsSubscription.unsubscribe();
    //this.changeTotalPaquetsSubscription.unsubscribe();
    this.signSubscription.unsubscribe();
    this.paquetSignatSubscription.unsubscribe();
  }

  ngOnInit() {
    //this.databaseService.getPaquetsPerSignar();
    this.vistaSeguent="Signats";
    this.vistaActual="per Signar";
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if(isUndefined(currentUser.vistaActual)){
      this.vistaSeguent="Signats";
      this.vistaActual="per Signar";
      currentUser.vistaActual = this.vistaActual;
      currentUser.vistaSeguent=this.vistaSeguent;
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      //console.log(currentUser);
    }else{
      this.vistaSeguent=currentUser.vistaSeguent;
      this.vistaActual=currentUser.vistaActual;
    }



    this.changePaquetsSubscription = this.paquetsService.changedPaquets.subscribe(
      (paquets: Paquet[]) => {
        this.paquets = paquets;
      }
    );


    this.signSubscription = this.paquetsService.startedSignPaquet.subscribe(
      (paquetId:number)=>{
        //this.onEntregarPaquet(paquetId,'nomesqr');
        this.onViewClick(paquetId);
      }
    )

    this.paquetSignatSubscription = this.paquetsService.paquetSignatCorrectament.subscribe(
      (paquetId:number)=>{
        this.reloadLlista();
      }
    )

    this.reloadLlista();
  }

  onEditPaquet(index: number) {
    this.signMode = false;
    this.editMode = true;
    this.paquetsService.startedEditPaquet.next(this.paquets[index]);

  }

  onEditClick(index: number) {

    this.router.navigate(['edit',index],{relativeTo: this.route});

  }

  onEntregarPaquet(index: number, mode: string) {
    this.signMode = true;
    this.editMode = false;
   
    //this.router.navigate(['entrega',index],{relativeTo: this.route});
    this.router.navigate(['entrega',index,mode]);
  }

  onViewClick(index: number) {

    //this.router.navigate(['view',index],{relativeTo: this.route});
    this.router.navigate(['view',index]);

  }

  onDeleteClick(index:number,template: TemplateRef<any>){
    this.deleteModalRef = this.modalService.show(template, {class: 'modal-sm'});
    this.deletePaquetIndex = index;
  }

  confirmDelete(): void {
    this.databaseService.deletePaquet(this.deletePaquetIndex);
    this.deleteModalRef.hide();
    this.deletePaquetIndex=0;
  }
 
  declineDelete(): void {
    this.deleteModalRef.hide();
    this.deletePaquetIndex=0;
  }

  onEnviarMail(index:number,template: TemplateRef<any>){
    this.mailModalRef = this.modalService.show(template, {class: 'modal-sm'});
    this.mailPaquetIndex = index;
  }

  confirmMailSend(): void {
    const paquet = this.paquetsService.getPaquet(this.mailPaquetIndex);
    this.databaseService.enviaMail(paquet);
    this.mailModalRef.hide();
    this.mailPaquetIndex=0;
  }
 
  declineMailSend(): void {
    this.mailModalRef.hide();
    this.mailPaquetIndex=0;
  }

  onGenerarQr(index: number) {
    this.signMode = true;
    this.editMode = false;
    this.paquets[index].qrcode=Math.floor(Math.random() * 1000) + 1;
    this.databaseService.updateQrPaquet(this.paquets[index]);


  }

  reloadLlista(){
    //console.log("reloadLLista");
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
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    currentUser.vistaActual = this.vistaActual;
    currentUser.vistaSeguent=this.vistaSeguent;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));

  }

  onNouPaquet(){
    this.router.navigate(['add',0],{relativeTo: this.route});
  }

  onLogout(){
    this.authService.logout();
  }

}
