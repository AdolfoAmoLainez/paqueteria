import { HttpClient } from "@angular/common/http";
import { Paquet } from "./paquet.model";
import { PaquetsService } from "./paquets.service";
import { Injectable } from "@angular/core";
import { AppConstants } from "../app.params";
import { MessagesService } from "../messages/messages.service";

@Injectable()
export class DatabaseService {

    appConstants = new AppConstants();
    private tablename: string="";

    constructor(private http: HttpClient,
        private paquetsService: PaquetsService,
        private messagesService: MessagesService) {
         }


    setTablename (tablename:string){
        this.tablename = tablename;
    }

    testTablename (){
        if (this.tablename==""){
            let currentUser = JSON.parse(localStorage.getItem('currentUser'));
            this.tablename = currentUser.tablename;
        }
    }

    getPaquetsPerSignar() {
        this.testTablename();
        return this.http.get(this.appConstants.dataServerURL + "/api/crud/"+this.tablename+"?signatura=empty&_order[data_arribada]=DESC",
                                { observe: 'response' }).subscribe(
                (res:any) => {
                    //console.log(res.body.json);
                    let paquets: Paquet[] = [];

                    for (let elem in res.body.json) {
                        //console.log(elem);
                        paquets.push(new Paquet(
                            res.body.json[elem].id,
                            res.body.json[elem].data_arribada,
                            res.body.json[elem].remitent,
                            res.body.json[elem].procedencia,
                            res.body.json[elem].quantitat,
                            res.body.json[elem].mitja_arribada,
                            res.body.json[elem].referencia,
                            res.body.json[elem].destinatari,
                            res.body.json[elem].departament,
                            res.body.json[elem].data_lliurament,
                            res.body.json[elem].dipositari,
                            res.body.json[elem].signatura,
                            res.body.json[elem].qrcode,
                            res.body.json[elem].email
                        ))
                    }
                    //console.log(paquets);
                    this.paquetsService.setPaquets(paquets);
                }
            );

    }

    buscaPaquets(patro: string) {
        this.testTablename();
        return this.http.get(this.appConstants.dataServerURL + "/api/crud/paquets?destinatari[LIKE]=" + patro ,
            { observe: 'response' }).subscribe(
                (res:any) => {

                    let link = res.headers.get('Link');
                    if (link) {
                        this.paquetsService.setPagination(link);
                    }

                    let totalCount = res.headers.get('X-Total-Count');
                    if (totalCount) {
                        this.paquetsService.setTotalPaquets(parseInt(totalCount));
                    }

                    let paquets: Paquet[] = [];

                    for (let elem in res.body.json) {
                        paquets.push(new Paquet(
                            res.body.json[elem].id,
                            res.body.json[elem].data_arribada,
                            res.body.json[elem].remitent,
                            res.body.json[elem].procedencia,
                            res.body.json[elem].quantitat,
                            res.body.json[elem].mitja_arribada,
                            res.body.json[elem].referencia,
                            res.body.json[elem].destinatari,
                            res.body.json[elem].departament,
                            res.body.json[elem].data_lliurament,
                            res.body.json[elem].dipositari,
                            res.body.json[elem].signatura,
                            res.body.json[elem].qrcode,
                            res.body.json[elem].email
                        ))
                    }
                    this.paquetsService.setPaquets(paquets);
                }
            );
    }

    getPaquetsSignats() {
        this.testTablename();
        return this.http.get(this.appConstants.dataServerURL + "/api/crud/"+this.tablename+"?signatura[LIKE]=data%&_order[data_arribada]=DESC",
                                { observe: 'response' }).subscribe(
                (res:any) => {

                    let paquets: Paquet[] = [];

                    for (let elem in res.body.json) {
                        paquets.push(new Paquet(
                            res.body.json[elem].id,
                            res.body.json[elem].data_arribada,
                            res.body.json[elem].remitent,
                            res.body.json[elem].procedencia,
                            res.body.json[elem].quantitat,
                            res.body.json[elem].mitja_arribada,
                            res.body.json[elem].referencia,
                            res.body.json[elem].destinatari,
                            res.body.json[elem].departament,
                            res.body.json[elem].data_lliurament,
                            res.body.json[elem].dipositari,
                            res.body.json[elem].signatura,
                            res.body.json[elem].qrcode,
                            res.body.json[elem].email
                        ))
                    }
                    this.paquetsService.setPaquets(paquets);
                }
            );

    }



    addPaquet(paquet: Paquet) {
        //console.log(paquet);
        this.testTablename();
        return this.http.post(this.appConstants.dataServerURL + '/api/crud/'+this.tablename, paquet).subscribe(
            (data:any) => {
                const paquet: Paquet = <Paquet>data.json[0];
                this.paquetsService.addPaquet(paquet);
                this.messagesService.sendMessage(
                    'Paquet afegit correctament!',
                    'success'
                    );
                    this.enviaMail(paquet);
            }
        )
    }

    getPaquetQr(index: number, qrcode: number) {
        this.testTablename();
        //return this.http.get(this.appConstants.dataServerURL + "/api/crud/"+this.tablename+"?id=" + index + "&qrcode=" + qrcode);
        return this.http.post(this.appConstants.dataServerURL + "/paquetqr/get",{"tablename": this.tablename,"id": index, "qrcode":qrcode});
    }

    getPaquet(index: number) {
        this.testTablename();
        return this.http.get(this.appConstants.dataServerURL + "/api/crud/"+this.tablename+"/" + index);
    }

    updatePaquet(paquet: Paquet) {
        this.testTablename();
        return (this.http.put(this.appConstants.dataServerURL + '/api/crud/'+this.tablename+'/' + paquet.id, paquet).subscribe(
            (data:any) => {
                const paquet: Paquet = <Paquet>data.json[0];
                this.paquetsService.updatePaquet(paquet);
                this.messagesService.sendMessage(
                    'Paquet modificat correctament!',
                    'success'
                    );
            },
            (error:any) => {
                console.log(error);
            }
        ));
    }

    deletePaquet(index: number) {
        this.testTablename();
        return (this.http.delete(this.appConstants.dataServerURL + '/api/crud/'+this.tablename+'/' + index).subscribe(
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
        this.testTablename();
        paquet.data_lliurament = Date.now().toString();
        return (this.http.put(this.appConstants.dataServerURL + '/api/crud/'+this.tablename+'/' + paquet.id, paquet)).subscribe(
            (data) => {
                this.paquetsService.paquetSignatCorrectament.next(paquet.id);
                this.messagesService.sendMessage(
                    'Paquet signat correctament!',
                    'success'
                    );
            }
        );
    }

    signaPaquetQr(paquet: Paquet) {
        this.testTablename();
        paquet.data_lliurament = Date.now().toString();
        return (this.http.post(this.appConstants.dataServerURL + '/paquetqr/signar', {
            'tablename': this.tablename,
            'id': paquet.id,
            'dipositari': paquet.dipositari,
            'signatura': paquet.signatura
        })).subscribe(
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
        this.testTablename();
        return (this.http.put(this.appConstants.dataServerURL + '/api/crud/'+this.tablename+'/' + paquet.id, paquet).subscribe(
            (data:any) => {
                const paquet: Paquet = <Paquet>data.json[0];
                this.paquetsService.updatePaquet(paquet);
                this.messagesService.sendMessage(
                    'Codi bidi generat correctament!',
                    'success'
                    );
                    //console.log(paquet);
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