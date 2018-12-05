import { HttpClient } from "@angular/common/http";
import { Paquet } from "./paquet.model";
import { PaquetsService } from "./paquets.service";
import { Injectable } from "@angular/core";
import { AppConstants } from "../app.params";
import { MessagesService } from "../messages/messages.service";

@Injectable()
export class DatabaseService {

    appConstants = new AppConstants();
    //dataServerURL: string = "http://bitacola.uab.cat:3000";

    constructor(private http: HttpClient,
        private paquetsService: PaquetsService,
        private messagesService: MessagesService) { }

    getPaquetsPerSignar() {
        return this.http.get(this.appConstants.dataServerURL + "/paquets?signatura=empty&_sort=data_arribada&_order=desc",
                                { observe: 'response' }).subscribe(
                (res) => {
                    //console.log(res);
                    /*let link = res.headers.get('Link');
                    if (link) {
                        this.paquetsService.setPagination(link);
                    }

                    let totalCount = res.headers.get('X-Total-Count');
                    if (totalCount) {
                        this.paquetsService.setTotalPaquets(parseInt(totalCount));
                    }*/
                    //const lights: Light[] = <Light[]>data;
                    let paquets: Paquet[] = [];

                    for (let elem in res.body) {
                        paquets.push(new Paquet(
                            res.body[elem].id,
                            res.body[elem].data_arribada,
                            res.body[elem].remitent,
                            res.body[elem].procedencia,
                            res.body[elem].quantitat,
                            res.body[elem].mitja_arribada,
                            res.body[elem].referencia,
                            res.body[elem].destinatari,
                            res.body[elem].departament,
                            res.body[elem].data_lliurament,
                            res.body[elem].dipositari,
                            res.body[elem].signatura,
                            res.body[elem].qrcode,
                            res.body[elem].email
                        ))
                    }
                    this.paquetsService.setPaquets(paquets);
                }
            );

    }

    buscaPaquets(patro: string) {
        return this.http.get(this.appConstants.dataServerURL + "/paquets?destinatari_like=" + patro ,
            { observe: 'response' }).subscribe(
                (res) => {

                    let link = res.headers.get('Link');
                    if (link) {
                        this.paquetsService.setPagination(link);
                    }

                    let totalCount = res.headers.get('X-Total-Count');
                    if (totalCount) {
                        this.paquetsService.setTotalPaquets(parseInt(totalCount));
                    }
                    //const lights: Light[] = <Light[]>data;
                    let paquets: Paquet[] = [];

                    for (let elem in res.body) {
                        paquets.push(new Paquet(
                            res.body[elem].id,
                            res.body[elem].data_arribada,
                            res.body[elem].remitent,
                            res.body[elem].procedencia,
                            res.body[elem].quantitat,
                            res.body[elem].mitja_arribada,
                            res.body[elem].referencia,
                            res.body[elem].destinatari,
                            res.body[elem].departament,
                            res.body[elem].data_lliurament,
                            res.body[elem].dipositari,
                            res.body[elem].signatura,
                            res.body[elem].qrcode,
                            res.body[elem].email
                        ))
                    }
                    this.paquetsService.setPaquets(paquets);
                }
            );
    }

    getPaquetsSignats() {
        return this.http.get(this.appConstants.dataServerURL + "/paquets?signatura_like=^data&_sort=data_arribada&_order=desc",
                                { observe: 'response' }).subscribe(
                (res) => {

                    //console.log(res);
                   /* let link = res.headers.get('Link');
                    if (link) {
                        this.paquetsService.setPagination(link);
                    }

                    let totalCount = res.headers.get('X-Total-Count');
                    if (totalCount) {
                        this.paquetsService.setTotalPaquets(parseInt(totalCount));
                    }*/
                    //const lights: Light[] = <Light[]>data;
                    let paquets: Paquet[] = [];

                    for (let elem in res.body) {
                        paquets.push(new Paquet(
                            res.body[elem].id,
                            res.body[elem].data_arribada,
                            res.body[elem].remitent,
                            res.body[elem].procedencia,
                            res.body[elem].quantitat,
                            res.body[elem].mitja_arribada,
                            res.body[elem].referencia,
                            res.body[elem].destinatari,
                            res.body[elem].departament,
                            res.body[elem].data_lliurament,
                            res.body[elem].dipositari,
                            res.body[elem].signatura,
                            res.body[elem].qrcode,
                            res.body[elem].email
                        ))
                    }
                    this.paquetsService.setPaquets(paquets);
                }
            );

    }



    addPaquet(paquet: Paquet) {
        //console.log(paquet);
        return this.http.post(this.appConstants.dataServerURL + '/paquets', paquet).subscribe(
            (data) => {
                const paquet: Paquet = <Paquet>data;
                this.paquetsService.addPaquet(paquet);
                this.messagesService.sendMessage(
                    'Paquet afegit correctament!',
                    'success'
                    );
            }
        )
    }

    getPaquetQr(index: number, qrcode: number) {
        return this.http.get(this.appConstants.dataServerURL + "/paquetqr?id=" + index + "&qrcode=" + qrcode);
    }

    getPaquet(index: number) {
        return this.http.get(this.appConstants.dataServerURL + "/paquets?id=" + index);
    }

    updatePaquet(paquet: Paquet) {
        return (this.http.patch(this.appConstants.dataServerURL + '/paquets/' + paquet.id, paquet).subscribe(
            (data) => {
                const paquet: Paquet = <Paquet>data;
                this.paquetsService.updatePaquet(paquet);
                this.messagesService.sendMessage(
                    'Paquet modificat correctament!',
                    'success'
                    );
            }
        ));
    }

    deletePaquet(index: number) {
        return (this.http.delete(this.appConstants.dataServerURL + '/paquets/' + index).subscribe(
            (data) => {
                this.paquetsService.deletePaquet(index);
                this.messagesService.sendMessage(
                    'Paquet esborrat correctament!',
                    'success'
                    );
            }
        ));
    }

    
    signaPaquet(paquet: Paquet) {
        paquet.data_lliurament = Date.now();
        return (this.http.patch(this.appConstants.dataServerURL + '/paquets/' + paquet.id, paquet)).subscribe(
            (data) => {
                this.paquetsService.paquetSignatCorrectament.next(paquet.id);
                this.messagesService.sendMessage(
                    'Paquet signat correctament!',
                    'success'
                    );
            }
        );
    }

    updateQrPaquet(paquet: Paquet) {
        return (this.http.patch(this.appConstants.dataServerURL + '/paquets/' + paquet.id, paquet).subscribe(
            (data) => {
                const paquet: Paquet = <Paquet>data;
                this.paquetsService.updatePaquet(paquet);
                this.messagesService.sendMessage(
                    'Codi bidi generat correctament!',
                    'success'
                    );
                this.paquetsService.startedSignPaquet.next(paquet.id);
            }
        ));
    }

    enviaMail(paquet: Paquet) {
        return (this.http.post(this.appConstants.dataServerURL + '/enviaMail', paquet)).subscribe(
            (data:any) => {
                if(data.SendMail === 'ok'){
                    this.messagesService.sendMessage(
                        'Mail enviat correctament!',
                        'success'
                        );
                }else{
                    this.messagesService.sendMessage(
                        "No s'ha pogut enviar el correu-e!",
                        'danger'
                        );
                }
            }
        );
    }


}