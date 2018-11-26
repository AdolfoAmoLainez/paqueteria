import { Subject } from "rxjs";
import { Paquet } from "./paquet.model";
import { Injectable } from "@angular/core";

@Injectable()
export class PaquetsService {
    paquets: Paquet[] = [];
    pagination={
        'first':'',
        'prev':'',
        'next':'',
        'last':''
    }

    totalPaquets: number;
    paginaActual:number;
    /*
        new Paquet(
            1,
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
            "",
            1245
        ),
        new Paquet(
            2,
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
            "",
            0
        ),
    ]*/

    startedEditPaquet = new Subject<Paquet>();
    startedSignPaquet = new Subject<number>();
    changedPaquets = new Subject<Paquet[]>();
    changedPagination = new Subject<any>();
    changedTotalPaquets = new Subject<any>();
    paquetSignatCorrectament = new Subject<number>();



    setTotalPaquets(total: number){
        this.totalPaquets = total;
        this.changedTotalPaquets.next(total);
    }

   /*<http://localhost:3000/paquets?signatura=empty&_page=1&_limit=3>; rel="first", 
    <http://localhost:3000/paquets?signatura=empty&_page=1&_limit=3>; rel="prev", 
    <http://localhost:3000/paquets?signatura=empty&_page=3&_limit=3>; rel="next", 
    <http://localhost:3000/paquets?signatura=empty&_page=3&_limit=3>; rel="last"*/

    setPagination(paginationLinks:string){

        const links = paginationLinks.split(",");

        for (let link of links){

            let url = link.split(";")[0].substring(1);
            url = url.substr(0,url.length-1);

            let pos = link.split(";")[1].split("=")[1].substr(1);
            pos=pos.substr(0,pos.length-1);

            this.pagination[pos]=url;
        }

        this.changedPagination.next(this.pagination);

    }

    setPaquets(paquets: Paquet[]){
        this.paquets = paquets;
        this.changedPaquets.next(this.paquets.slice());
    }

    getPaquets() {
        return this.paquets.slice();
    }

    getPaquet(indexPaquet:number):Paquet{
        const index = this.paquets.findIndex((element) => {
            return element.id == indexPaquet;
        });
        //console.log(this.paquets);
        return this.paquets[index];
    }

    addPaquet(paquet: Paquet) {
        /*const maxId=Math.max.apply(Math, this.paquets.map(
            function(paquet){ return paquet.id})
            )+1;
        paquet.id=maxId;*/
        this.paquets.push(paquet);
        this.changedPaquets.next(this.paquets.slice());

    }

    signaPaquet(indexPaquet:number, dipositari:string, signatura:string){
        const index = this.paquets.findIndex((element) => {
            return element.id == indexPaquet;
        });

        console.log(index + "  " + signatura);
        this.paquets[index].signatura = signatura;
        this.paquets[index].dipositari = dipositari;
        this.changedPaquets.next(this.paquets.slice());
    }

    updatePaquet(paquet:Paquet){
        const index = this.paquets.findIndex((element) => {
            return element.id == paquet.id;
        });

        this.paquets[index]=paquet;

        this.changedPaquets.next(this.paquets.slice());
    }

    generaQrPaquet(){

    }
}