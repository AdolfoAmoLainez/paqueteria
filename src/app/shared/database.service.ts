import { HttpClient } from "@angular/common/http";
import { Paquet } from "./paquet.model";
import { PaquetsService } from "./paquets.service";
import { Injectable } from "@angular/core";
import { MessagesService } from "../messages/messages.service";

import {environment} from 'src/environments/environment'
import { UsersService } from "./users.service";
import { User } from "./user.model";


@Injectable()
export class DatabaseService {

    private tablename: string="";
    private ubicacioEmail: string="";
    private gestorEmail: string="";

    constructor(private http: HttpClient,
        private paquetsService: PaquetsService,
        private messagesService: MessagesService,
        private usersService: UsersService) {
         }


    setTablename (tablename:string) {
        this.tablename = tablename;
    }

    testTablename () {
        if (this.tablename === ''){
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            this.tablename = currentUser.tablename;
        }
    }

    testEmailData() {
        if (this.ubicacioEmail === '') {
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            this.ubicacioEmail = currentUser.ubicacioemail;
        }
        if (this.gestorEmail === ''){
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            this.gestorEmail = currentUser.gestoremail;
        }
    }

    tractaResposta(res: any) {
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
                res.body.json[elem].email,
                res.body.json[elem].emailremitent
            ));
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
        return this.http.post(environment.dataServerURL + "/api/custom", sql);
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
              return this.http.post(environment.dataServerURL + "/api/custom", sql, { observe: 'response' }).subscribe(
                (res:any) => {
                    this.tractaResposta(res);

                }
                );
        }else{

            return this.http.get(environment.dataServerURL + "/api/crud/"+this.tablename+"?_limit="+limit+"&signatura=empty&_order[data_arribada]=DESC",
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
        return this.http.post(environment.dataServerURL + "/api/custom", sql);
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
              return this.http.post(environment.dataServerURL + '/api/custom', sql, { observe: 'response' }).subscribe(
                (res:any) => {
                    this.tractaResposta(res);

                }
                );
        } else {

            return this.http.get(environment.dataServerURL + "/api/crud/"+this.tablename+"?_limit="+limit+"&signatura[LIKE]=data%&_order[data_lliurament]=DESC",
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
        return this.http.post(environment.dataServerURL + '/api/crud/' + this.tablename, paquet).subscribe(
            (data: any) => {
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
        // this.testTablename();
        // return this.http.get(this.appConstants.dataServerURL + "/api/crud/"+this.tablename+"?id=" + index + "&qrcode=" + qrcode);
        return this.http.post(environment.dataServerURL + '/selfapi/paquetqr/get', {'tablename': tablename, 'id': index, 'qrcode': qrcode});
    }

    getPaquet(index: number) {
        this.testTablename();
        return this.http.get(environment.dataServerURL + '/api/crud/' + this.tablename + '/' + index);
    }

    updatePaquet(paquet: Paquet) {
        this.testTablename();
        return (this.http.put(environment.dataServerURL + '/api/crud/' + this.tablename + '/' + paquet.id, paquet).subscribe(
            (data: any) => {
                const paquet: Paquet = <Paquet>data.json[0];
                this.paquetsService.updatePaquet(paquet);
                this.messagesService.sendMessage(
                    'Paquet modificat correctament!',
                    'success'
                    );
            },
            (error: any) => {
                console.log(error);
            }
        ));
    }

    deletePaquet(index: number) {
        this.testTablename();
        return (this.http.delete(environment.dataServerURL + '/api/crud/' + this.tablename + '/' + index).subscribe(
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
        return (this.http.put(environment.dataServerURL + '/api/crud/' + this.tablename + '/' + paquet.id, paquet)).subscribe(
            (data) => {
                this.paquetsService.paquetSignatCorrectament.next(paquet.id);
                this.messagesService.sendMessage(
                    'Paquet signat correctament!',
                    'success'
                    );
                this.enviaMailRemitent(paquet);
            }
        );
    }

    signaPaquetQr(paquet: Paquet, tablename: string) {
        paquet.data_lliurament = Date.now().toString();
        return (this.http.post(environment.dataServerURL + '/selfapi/paquetqr/signar', {
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
                this.enviaMailRemitent(paquet);
            }
        );
    }

    updateQrPaquet(paquet: Paquet) {
        this.testTablename();
        return (this.http.put(environment.dataServerURL + '/api/crud/'+this.tablename+'/' + paquet.id, paquet).subscribe(
            (data: any) => {
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
            return (this.http.post(environment.dataServerURL + '/selfapi/enviaMail', paquet)).subscribe(
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

    enviaMailRemitent(paquet: Paquet) {
      this.testEmailData();
      paquet.ubicacioemail = this.ubicacioEmail;
      paquet.gestoremail = this.gestorEmail;
      if (paquet.emailremitent !== '') {
          return (this.http.post(environment.dataServerURL + '/selfapi/enviaMailRemitent', paquet)).subscribe(
              (data: any) => {
                  if (data.SendMail === 'ok') {
                      this.messagesService.sendMessage(
                          'Mail enviat correctament!',
                          'success'
                          );
                  } else {
                      this.messagesService.sendMessage(
                          'No s\'ha pogut enviar el correu-e!',
                          'danger'
                          );
                  }
              }
          );
      }
  }

    getUsers() {
      return this.http.get(environment.dataServerURL + '/api/crud/usuaris',
      { observe: 'response' }).subscribe(
        (res: any) => {
          this.usersService.setUsers(res.body.json);
        }
        );
    }

    addUser(user: User) {
      return this.http.post(environment.dataServerURL + '/selfapi/creataula', user).subscribe(
        (data: any) => {
          //console.log(data);
          this.http.post(environment.dataServerURL + '/api/crud/usuaris', user).subscribe(
            (dbuser: any) => {
              //console.log(dbuser);
                this.messagesService.sendMessage(
                    'Usuari afegit correctament!',
                    'success'
                    );
                    this.usersService.addUser(dbuser.json[0]);
            }
          );
        }
      );
  }

  updateUser(user: User) {
    this.testTablename();
    return (this.http.put(environment.dataServerURL + '/api/crud/usuaris/' + user.id, user).subscribe(
        (data:any) => {
            const user: User = <User>data.json[0];
            this.usersService.updateUser(user);
            this.messagesService.sendMessage(
                'Usuari modificat correctament!',
                'success'
                );
        },
        (error:any) => {
            console.log(error);
        }
    ));
  }

  deleteUser(user: User) {

    return this.http.post(environment.dataServerURL + '/selfapi/deltaula', user).subscribe(
      (data: any) => {
        this.http.delete(environment.dataServerURL + '/api/crud/usuaris/' + user.id).subscribe(
          (data2) => {
              this.usersService.deleteUser(user.id);
              this.messagesService.sendMessage(
                  'Usuari esborrat correctament!',
                  'success'
                  );
          }
        );
      }
    );
  }

  getUserRol(username: string) {
    return this.http.get(environment.dataServerURL + '/api/crud/usuaris?niu[LIKE]=%' + username + '%&_fields=rol_id');
  }

}
