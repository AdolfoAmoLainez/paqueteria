import { Subject } from "rxjs";
import { Paquet } from "../arribades-list/paquet.model";

export class PaquetsService {
    paquets: Paquet[] = [
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
            ""
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
            ""
        ),
    ]

    startedEditPaquet = new Subject<Paquet>();
    startedSignPaquet = new Subject<Paquet>();
    changedPaquets = new Subject<Paquet[]>();

    getPaquets() {
        return this.paquets.slice();
    }

    addPaquet(paquet: Paquet) {
        const maxId=Math.max.apply(Math, this.paquets.map(
            function(paquet){ return paquet.id})
            )+1;
        paquet.id=maxId;
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
}