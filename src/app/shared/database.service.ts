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
    private ubicacioEmail: string="";
    private gestorEmail: string="";

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

    testEmailData(){
        if (this.ubicacioEmail==""){
            let currentUser = JSON.parse(localStorage.getItem('currentUser'));
            this.ubicacioEmail = currentUser.ubicacioemail;
        }
        if (this.gestorEmail==""){
            let currentUser = JSON.parse(localStorage.getItem('currentUser'));
            this.gestorEmail = currentUser.gestoremail;
        }
    }

    tractaResposta(res:any){
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
    

    getCountPaquetsPerSignar(searchText?: string){
        this.testTablename();

        let sql = {};
        if (searchText!=undefined && searchText!=""){
            sql = {
                "query":"SELECT count(*) as totalpaquets FROM paquets WHERE (data_arribada LIKE '%"+searchText+"%' or " +
                                                     "remitent LIKE '%"+searchText+"%' or "+
                                                     "procedencia LIKE '%"+searchText+"%' or "+
                                                     "mitja_arribada LIKE '%"+searchText+"%' or "+
                                                     "referencia LIKE '%"+searchText+"%' or "+
                                                     "destinatari LIKE '%"+searchText+"%' or "+
                                                     "departament LIKE '%"+searchText+"%' or "+
                                                     "data_lliurament LIKE '%"+searchText+"%' or "+
                                                     "dipositari LIKE '%"+searchText+"%' "+
                                                     ") AND signatura='empty';"
              }; 
              
        }else{
            sql = {"query":"SELECT count(*) as totalpaquets FROM "+this.tablename+" WHERE signatura='empty'"};
        }
        return this.http.post(this.appConstants.dataServerURL + "/api/custom", sql);
    }

    getPaquetsPerSignar(page:number, itemsPerpage:number, searchText?: string) {
        this.testTablename();

        let limit=""+page+","+itemsPerpage;

        if (searchText!=undefined && searchText!=""){
            let sql = {
                "query":"SELECT * FROM "+this.tablename+" WHERE (data_arribada LIKE '%"+searchText+"%' or " +
                                                     "remitent LIKE '%"+searchText+"%' or "+
                                                     "procedencia LIKE '%"+searchText+"%' or "+
                                                     "mitja_arribada LIKE '%"+searchText+"%' or "+
                                                     "referencia LIKE '%"+searchText+"%' or "+
                                                     "destinatari LIKE '%"+searchText+"%' or "+
                                                     "departament LIKE '%"+searchText+"%' or "+
                                                     "data_lliurament LIKE '%"+searchText+"%' or "+
                                                     "dipositari LIKE '%"+searchText+"%' "+
                                                     ") AND signatura='empty' "+
                                                     "ORDER BY data_arribada DESC;"
              }; 
              return this.http.post(this.appConstants.dataServerURL + "/api/custom", sql, { observe: 'response' }).subscribe(
                (res:any) => {
                    this.tractaResposta(res);

                }
                );
        }else{

            return this.http.get(this.appConstants.dataServerURL + "/api/crud/"+this.tablename+"?_limit="+limit+"&signatura=empty&_order[data_arribada]=DESC",
                                { observe: 'response' }).subscribe(
                (res:any) => {
                    this.tractaResposta(res);
                }
            );
        }
    }


    getCountPaquetsSignats(searchText?: string){
        this.testTablename();
        let sql ={};
        if (searchText!=undefined && searchText!=""){
            sql = {
                "query":"SELECT count(*) as totalpaquets FROM paquets WHERE (data_arribada LIKE '%"+searchText+"%' or " +
                                                     "remitent LIKE '%"+searchText+"%' or "+
                                                     "procedencia LIKE '%"+searchText+"%' or "+
                                                     "mitja_arribada LIKE '%"+searchText+"%' or "+
                                                     "referencia LIKE '%"+searchText+"%' or "+
                                                     "destinatari LIKE '%"+searchText+"%' or "+
                                                     "departament LIKE '%"+searchText+"%' or "+
                                                     "data_lliurament LIKE '%"+searchText+"%' or "+
                                                     "dipositari LIKE '%"+searchText+"%' "+
                                                     ") AND NOT signatura='empty';"
              }; 

        }else{
            sql = {"query":"SELECT count(*) as totalpaquets FROM "+this.tablename+" WHERE NOT signatura='empty'"};
        }
        return this.http.post(this.appConstants.dataServerURL + "/api/custom", sql);        
    }



    getPaquetsSignats(page:number, itemsPerpage:number, searchText?: string) {
        this.testTablename();
        let limit=""+page+","+itemsPerpage;

        if (searchText!=undefined && searchText!=""){
            let sql = {
                "query":"SELECT * FROM "+this.tablename+" WHERE (data_arribada LIKE '%"+searchText+"%' or " +
                                                     "remitent LIKE '%"+searchText+"%' or "+
                                                     "procedencia LIKE '%"+searchText+"%' or "+
                                                     "mitja_arribada LIKE '%"+searchText+"%' or "+
                                                     "referencia LIKE '%"+searchText+"%' or "+
                                                     "destinatari LIKE '%"+searchText+"%' or "+
                                                     "departament LIKE '%"+searchText+"%' or "+
                                                     "data_lliurament LIKE '%"+searchText+"%' or "+
                                                     "dipositari LIKE '%"+searchText+"%' "+
                                                     ") AND signatura NOT LIKE 'empty' "+
                                                     "ORDER BY data_lliurament DESC;"
              }; 
              return this.http.post(this.appConstants.dataServerURL + "/api/custom", sql, { observe: 'response' }).subscribe(
                (res:any) => {
                    this.tractaResposta(res);

                }
                );
        }else{

            return this.http.get(this.appConstants.dataServerURL + "/api/crud/"+this.tablename+"?_limit="+limit+"&signatura[LIKE]=data%&_order[data_lliurament]=DESC",
                                    { observe: 'response' }).subscribe(
                    (res:any) => {
                        this.tractaResposta(res);

                    }
                );
                
        }

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

    getPaquetQr(index: number, qrcode: number, tablename: string) {
        //this.testTablename();
        //return this.http.get(this.appConstants.dataServerURL + "/api/crud/"+this.tablename+"?id=" + index + "&qrcode=" + qrcode);
        return this.http.post(this.appConstants.dataServerURL + "/paquetqr/get",{"tablename": tablename,"id": index, "qrcode":qrcode});
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

    signaPaquetQr(paquet: Paquet, tablename:string) {
        paquet.data_lliurament = Date.now().toString();
        return (this.http.post(this.appConstants.dataServerURL + '/paquetqr/signar', {
            'tablename': tablename,
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
        this.testEmailData();
        paquet.ubicacioemail = this.ubicacioEmail;
        paquet.gestoremail = this.gestorEmail;
        if (paquet.email!=""){
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


}