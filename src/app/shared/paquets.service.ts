import { Subject } from 'rxjs';
import { Paquet } from './paquet.model';
import { Injectable } from '@angular/core';

@Injectable()
export class PaquetsService {
    paquets: Paquet[] = [];
    pagination = {
        first: '',
        prev: '',
        next: '',
        last: ''
    };

    totalPaquets: number;
    paginaActual: number;

    startedEditPaquet = new Subject<Paquet>();
    startedSignPaquet = new Subject<number>();
    changedPaquets = new Subject<Paquet[]>();
    changedPagination = new Subject<any>();
    changedTotalPaquets = new Subject<any>();
    paquetSignatCorrectament = new Subject<number>();
    paquetAdded = new Subject<Paquet>();



    setTotalPaquets(total: number) {
        this.totalPaquets = total;
        this.changedTotalPaquets.next(total);
    }

    setPagination(paginationLinks: string) {

        const links = paginationLinks.split(',');

        for (const link of links) {

            let url = link.split(';')[0].substring(1);
            url = url.substr(0, url.length - 1);

            let pos = link.split(';')[1].split('=')[1].substr(1);
            pos = pos.substr(0, pos.length - 1);

            this.pagination[pos] = url;
        }

        this.changedPagination.next(this.pagination);

    }

    setPaquets(paquets: Paquet[]) {
        this.paquets = paquets;
        this.changedPaquets.next(this.paquets.slice());
    }

    getPaquets() {
        return this.paquets.slice();
    }

    getPaquet(indexPaquet: number): Paquet {

      const index = this.paquets.findIndex((element) => {
          return element.id === indexPaquet;
        });

      return this.paquets[index];
    }

    deletePaquet(indexPaquet: number) {
        const index = this.paquets.findIndex((element) => {
            return element.id === indexPaquet;
        });
        this.paquets.splice(index, 1);
        this.changedPaquets.next(this.paquets.slice());
    }

    addPaquet(paquet: Paquet) {

        this.paquets.unshift(paquet);
        this.paquetAdded.next(paquet);

    }

    signaPaquet(indexPaquet: number, dipositari: string, signatura: string) {
        const index = this.paquets.findIndex((element) => {
            return element.id === indexPaquet;
        });

        this.paquets[index].signatura = signatura;
        this.paquets[index].dipositari = dipositari;
        this.changedPaquets.next(this.paquets.slice());
    }

    updatePaquet(paquet: Paquet) {
        const index = this.paquets.findIndex((element) => {
            return element.id === paquet.id;
        });

        this.paquets[index] = paquet;

        this.changedPaquets.next(this.paquets.slice());
    }

    generaQrPaquet() {

    }
}
