import {
  Component,
  OnInit,
  OnDestroy,
  TemplateRef,
} from '@angular/core';
import {
  faSearch,
  faTimesCircle,
  faCog,
  faEye,
  faEdit,
  faEnvelope,
  faHandHolding,
  faQrcode,
  faTrashAlt,
  faPowerOff,
} from '@fortawesome/free-solid-svg-icons';
import {
  state,
  trigger,
  style,
  transition,
  animate,
  keyframes,
} from '@angular/animations';

import { Paquet } from '../shared/paquet.model';
import { PaquetsService } from '../shared/paquets.service';
import { Subscription } from 'rxjs';
import { DatabaseService } from '../shared/database.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-arribades-list',
  templateUrl: './arribades-list.component.html',
  styleUrls: ['./arribades-list.component.css'],
  animations: [
    trigger('paquetAddAnimation', [
      state(
        'in',
        style({
          opacity: 1,
          transform: 'translateX(0)',
        })
      ),
      transition('void => *', [
        animate(
          1000,
          keyframes([
            style({
              transform: 'translateX(-100px)',
              opacity: 0,
              offset: 0,
            }),
            style({
              transform: 'translateX(-50px)',
              opacity: 0.5,
              offset: 0.3,
            }),
            style({
              transform: 'translateX(-20px)',
              opacity: 1,
              offset: 0.8,
            }),
            style({
              transform: 'translateX(-0px)',
              opacity: 1,
              offset: 1,
            }),
          ])
        ),
      ]),

      transition('* => void', [
        animate(
          500,
          style({
            transform: 'translateX(100px)',
            opacity: 0,
          })
        ),
      ]),
    ]),
  ],
})
export class ArribadesListComponent implements OnInit, OnDestroy {
  // Icones
  faSearch = faSearch;
  faTimesCircle = faTimesCircle;
  faCog = faCog;
  faEye = faEye;
  faEdit = faEdit;
  faEnvelope = faEnvelope;
  faHandHolding = faHandHolding;
  faQrcode = faQrcode;
  faTrashAlt = faTrashAlt;
  faPowerOff = faPowerOff;

  editMode = true;
  signMode = false;
  allowViewPaquet = false; // Permet veure els botons de veure i editar

  changePaquetsSubscription: Subscription;
  signSubscription: Subscription;
  paquetSignatSubscription: Subscription;
  paquetAddedSubscription: Subscription;

  paquets: Paquet[] = [];
  totalPaquets: number;
  paginaActual = 1;
  itemsPerPage = 5;
  maxSizePagination = 10;

  searchString = '';
  searching = false;
  // Variables per controlar els paquets que veiem a la llista
  // "per Signar" o "Signats"
  vistaSeguent: string;
  vistaActual: string;
  isLoading = true;

  deleteModalMsg = 'Vols esborrar el paquet?';
  deleteModalRef: BsModalRef;
  deletePaquetIndex = 0;

  mailModalMsg = 'Vols reenviar l\'avís del paquet per correu-e?';
  mailModalRef: BsModalRef;
  mailPaquetIndex = 0;

  constructor(
    private paquetsService: PaquetsService,
    private databaseService: DatabaseService,
    private router: Router,
    private route: ActivatedRoute,
    public authService: AuthService,
    private modalService: BsModalService
  ) {}

  ngOnDestroy() {
    this.changePaquetsSubscription.unsubscribe();
    this.signSubscription.unsubscribe();
    this.paquetSignatSubscription.unsubscribe();
  }

  ngOnInit() {
    this.vistaSeguent = 'Signats';
    this.vistaActual = 'per Signar';
    this.paginaActual = 1;
    this.searchString = '';
    this.searching = false;
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (currentUser.vistaActual === undefined ) {
      this.vistaSeguent = 'Signats';
      this.vistaActual = 'per Signar';
      currentUser.vistaActual = this.vistaActual;
      currentUser.vistaSeguent = this.vistaSeguent;
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      this.vistaSeguent = currentUser.vistaSeguent;
      this.vistaActual = currentUser.vistaActual;
    }

    this.changePaquetsSubscription = this.paquetsService.changedPaquets.subscribe(
      (paquets: Paquet[]) => {
        this.paquets = paquets;
        this.isLoading = false;
      }
    );

    this.paquetAddedSubscription = this.paquetsService.paquetAdded.subscribe(
      (paquets: Paquet) => {
        this.paquets.unshift(paquets);
      }
    );

    this.signSubscription = this.paquetsService.startedSignPaquet.subscribe(
      (paquetId: number) => {
        this.onViewClick(paquetId);
      }
    );

    this.paquetSignatSubscription = this.paquetsService.paquetSignatCorrectament.subscribe(
      (paquetId: number) => {
        this.reloadLlista();
      }
    );

    this.reloadLlista();
  }

  onEditPaquet(index: number) {
    this.signMode = false;
    this.editMode = true;
    this.paquetsService.startedEditPaquet.next(this.paquets[index]);
  }

  onEditClick(index: number) {
    this.router.navigate(['edit', index], { relativeTo: this.route });
  }

  onEntregarPaquet(index: number, mode: string) {
    this.signMode = true;
    this.editMode = false;

    this.router.navigate(['entrega', index, mode]);
  }

  onViewClick(index: number) {
    this.router.navigate(['view', index]);
  }

  onDeleteClick(index: number, template: TemplateRef<any>) {
    this.deleteModalRef = this.modalService.show(template, {
      class: 'modal-sm',
    });
    this.deletePaquetIndex = index;
  }

  confirmDelete(): void {
    this.databaseService.deletePaquet(this.deletePaquetIndex);
    this.deleteModalRef.hide();
    this.deletePaquetIndex = 0;
  }

  declineDelete(): void {
    this.deleteModalRef.hide();
    this.deletePaquetIndex = 0;
  }

  onEnviarMail(index: number, template: TemplateRef<any>) {
    this.mailModalRef = this.modalService.show(template, { class: 'modal-sm' });
    this.mailPaquetIndex = index;
  }

  confirmMailSend(): void {
    const paquet = this.paquetsService.getPaquet(this.mailPaquetIndex);
    this.databaseService.enviaMail(paquet);
    this.mailModalRef.hide();
    this.mailPaquetIndex = 0;
  }

  declineMailSend(): void {
    this.mailModalRef.hide();
    this.mailPaquetIndex = 0;
  }

  onGenerarQr(index: number) {
    this.signMode = true;
    this.editMode = false;
    this.paquets[index].qrcode = Math.floor(Math.random() * 1000) + 1;
    this.databaseService.updateQrPaquet(this.paquets[index]);
  }

  reloadLlista() {
    switch (this.vistaActual) {
      case 'per Signar':
        this.databaseService
          .getCountPaquetsPerSignar(this.searchString)
          .subscribe((result: any) => {
            this.totalPaquets = result[0].totalpaquets;
            this.databaseService.getPaquetsPerSignar(
              (this.paginaActual - 1) * this.itemsPerPage,
              this.itemsPerPage,
              this.searchString
            );
            this.allowViewPaquet = false;
            this.isLoading = true;
          });

        break;
      case 'Signats':
        this.databaseService
          .getCountPaquetsSignats(this.searchString)
          .subscribe((result: any) => {
            this.totalPaquets = result[0].totalpaquets;
            this.databaseService.getPaquetsSignats(
              (this.paginaActual - 1) * this.itemsPerPage,
              this.itemsPerPage,
              this.searchString
            );
            this.allowViewPaquet = true;
            this.isLoading = true;
          });

        break;
    }
  }

  onSearch(valor: string) {
    console.log(valor);
  }

  onChangeView() {
    if (this.vistaSeguent === 'per Signar') {
      this.databaseService
        .getCountPaquetsPerSignar(this.searchString)
        .subscribe((result: any) => {
          this.totalPaquets = result[0].totalpaquets;
          this.paginaActual = 1;
          this.databaseService.getPaquetsPerSignar(
            (this.paginaActual - 1) * this.itemsPerPage,
            this.itemsPerPage,
            this.searchString
          );
          this.vistaActual = this.vistaSeguent;
          this.vistaSeguent = 'Signats';
          this.allowViewPaquet = false;
          this.isLoading = true;
        });
    } else {
      this.databaseService
        .getCountPaquetsSignats(this.searchString)
        .subscribe((result: any) => {
          this.totalPaquets = result[0].totalpaquets;
          this.paginaActual = 1;
          this.databaseService.getPaquetsSignats(
            (this.paginaActual - 1) * this.itemsPerPage,
            this.itemsPerPage,
            this.searchString
          );
          this.vistaActual = this.vistaSeguent;
          this.vistaSeguent = 'per Signar';
          this.allowViewPaquet = true;
          this.isLoading = true;
        });
    }
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    currentUser.vistaActual = this.vistaActual;
    currentUser.vistaSeguent = this.vistaSeguent;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
  }

  onNouPaquet() {
    this.router.navigate(['add', 0], { relativeTo: this.route });
  }

  onLogout() {
    this.authService.logout();
  }

  pageChanged(event: any): void {
    this.paginaActual = event.page;
    this.reloadLlista();
  }

  onBuscar() {
    this.searching = true;
    this.reloadLlista();
  }

  onBuscarKey(event) {
    if (event.key === 'Enter') {
      this.searching = true;
      this.reloadLlista();
    }
    if (this.searchString === '') {
      this.searching = false;
      this.reloadLlista();
    }
  }

  onCancelBuscar() {
    this.searchString = '';
    this.searching = false;
    this.reloadLlista();
  }

  isAdmin() {
    if (this.authService.userRol === 1) {
      return true;
    }
    return false;
  }

  onAdminClick() {
    this.router.navigate(['/admin']);
  }
}
