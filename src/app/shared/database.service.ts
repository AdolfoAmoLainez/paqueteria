import { HttpClient } from "@angular/common/http";
import { Paquet } from "./paquet.model";
import { PaquetsService } from "./paquets.service";
import { Injectable } from "@angular/core";

@Injectable()
export class DatabaseService {

    dataServerURL: string = "http://localhost:3000";

    constructor(private http: HttpClient,
        private paquetsService: PaquetsService) { }

    getPaquetsPerSignar(page: number) {
        return this.http.get(this.dataServerURL + "/paquets?signatura=empty&_page=" + page +
                                "&_limit=3&_sort=data_arribada&_order=desc",
                                { observe: 'response' }).subscribe(
                (res) => {
                    console.log(res);
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
                            res.body[elem].data_lliutament,
                            res.body[elem].dipositari,
                            res.body[elem].signatura,
                            res.body[elem].qrcode
                        ))
                    }
                    this.paquetsService.setPaquets(paquets);
                }
            );

    }

    buscaPaquets(patro: string) {
        return this.http.get(this.dataServerURL + "/paquets?destinatari_like=" + patro ,
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
                            res.body[elem].data_lliutament,
                            res.body[elem].dipositari,
                            res.body[elem].signatura,
                            res.body[elem].qrcode
                        ))
                    }
                    this.paquetsService.setPaquets(paquets);
                }
            );
    }

    getPaquetsSignats(page: number) {
        return this.http.get(this.dataServerURL + "/paquets?signatura_like=^data&_page=" + page +
                                "&_limit=3&_sort=data_arribada&_order=desc",
                                { observe: 'response' }).subscribe(
                (res) => {

                    console.log(res);
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
                            res.body[elem].data_lliutament,
                            res.body[elem].dipositari,
                            res.body[elem].signatura,
                            res.body[elem].qrcode
                        ))
                    }
                    this.paquetsService.setPaquets(paquets);
                }
            );

    }



    addPaquet(paquet: Paquet) {
        //console.log(paquet);
        return this.http.post(this.dataServerURL + '/paquets', paquet).subscribe(
            (data) => {
                const paquet: Paquet = <Paquet>data;
                this.paquetsService.addPaquet(paquet);
                /*this.messagesService.sendMessage(
                    'Luz añadida correctamente!',
                    'success'
                    );*/
            }
        )
    }

    getPaquetQr(index: number, qrcode: number) {
        return this.http.get(this.dataServerURL + "/paquets?id=" + index + "&qrcode=" + qrcode);
    }

    updatePaquet(paquet: Paquet) {
        return (this.http.patch(this.dataServerURL + '/paquets/' + paquet.id, paquet).subscribe(
            (data) => {
                const paquet: Paquet = <Paquet>data;
                this.paquetsService.updatePaquet(paquet);
                /*this.messagesService.sendMessage(
                    'Luz modificada correctamente!',
                    'success'
                    );*/

            }
        ));
    }

    updateSignedPaquet(paquet: Paquet) {
        return (this.http.patch(this.dataServerURL + '/paquets/' + paquet.id, paquet).subscribe(
            (data) => {
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