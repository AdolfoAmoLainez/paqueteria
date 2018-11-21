import { HttpClient} from "@angular/common/http";
import { Paquet } from "./paquet.model";
import { PaquetsService } from "./paquets.service";
import { Injectable } from "@angular/core";

@Injectable()
export class DatabaseService {

    dataServerURL: string = "http://localhost:3000";

    constructor(private http: HttpClient,
                private paquetsService: PaquetsService){}

    getPaquetsPerSignar(){
        return this.http.get(this.dataServerURL + "/paquets?signatura=empty").subscribe(
            (data) => {
                //console.log(data);
                //const lights: Light[] = <Light[]>data;
                let paquets: Paquet[]= [];

                for(let elem in data){
                    paquets.push(new Paquet(
                        data[elem].id,
                        data[elem].data_arribada,
                        data[elem].remitent,
                        data[elem].procedencia,
                        data[elem].quantitat,
                        data[elem].mitja_arribada,
                        data[elem].referencia,
                        data[elem].destinatari,
                        data[elem].departament,
                        data[elem].data_lliutament,
                        data[elem].dipositari,
                        data[elem].signatura,
                        data[elem].qrcode
                    ))
                }
                this.paquetsService.setPaquets(paquets);
            }
        );

    }

    addPaquet(paquet: Paquet){
        console.log(paquet);
        return this.http.post(this.dataServerURL+'/paquets',paquet).subscribe(
            (data)=>{
                const paquet: Paquet = <Paquet>data;
                this.paquetsService.addPaquet(paquet);
                /*this.messagesService.sendMessage(
                    'Luz añadida correctamente!',
                    'success'
                    );*/
            }
        )
    }

    getPaquetQr(index:number, qrcode:number){
        return this.http.get(this.dataServerURL + "/paquets?id="+index+"&qrcode="+qrcode);
    }

    updatePaquet(paquet: Paquet){
        return (this.http.patch(this.dataServerURL+'/paquets/'+paquet.id,paquet).subscribe(
            (data)=>{
                const paquet: Paquet = <Paquet>data;
                this.paquetsService.updatePaquet(paquet);
                /*this.messagesService.sendMessage(
                    'Luz modificada correctamente!',
                    'success'
                    );*/
                
            }
        ));
    }

    updateSignedPaquet(paquet: Paquet){
        return (this.http.patch(this.dataServerURL+'/paquets/'+paquet.id,paquet).subscribe(
            (data)=>{
                const paquet: Paquet = <Paquet>data;
                this.paquetsService.updatePaquet(paquet);
                /*this.messagesService.sendMessage(
                    'Luz modificada correctamente!',
                    'success'
                    );*/
                    this.paquetsService.startedSignPaquet.next(paquet);
            }
        ));
    }

    
}