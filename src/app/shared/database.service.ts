import { HttpClient } from '@angular/common/http';
import { Paquet } from './paquet.model';
import { PaquetsService } from './paquets.service';
import { Injectable } from '@angular/core';
import { MessagesService } from '../messages/messages.service';

import {environment} from 'src/environments/environment';
import { UsersService } from './users.service';
import { User } from './user.model';


@Injectable()
export class DatabaseService {

    private tablename = '';
    private ubicacioEmail = '';
    private gestorEmail = '';

    constructor(private http: HttpClient,
                private paquetsService: PaquetsService,
                private messagesService: MessagesService,
                private usersService: UsersService) {
         }


    setTablename(tablename: string) {
        this.tablename = tablename;
    }

    testTablename() {
        if (this.tablename === '') {
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            this.tablename = currentUser.tablename;
        }
    }

    testEmailData() {
        if (this.ubicacioEmail === '') {
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            this.ubicacioEmail = currentUser.ubicacioemail;
        }
        if (this.gestorEmail === '') {
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            this.gestorEmail = currentUser.gestoremail;
        }
    }



    getCountPaquetsPerSignar(searchText?: string) {
        this.testTablename();

        const obj = {
          tablename: this.tablename,
          searchText
        };
        return this.http.post(environment.dataServerURL + '/selfapi/getCountPaquetsPerSignar', obj);
    }

    getPaquetsPerSignar(page: number, itemsPerpage: number, searchText?: string) {
        this.testTablename();

        const obj = {
                  tablename: this.tablename,
                  searchText,
                  page,
                  itemsPerpage
                };
        return this.http.post<{paquets: Paquet[]}>(environment.dataServerURL + '/selfapi/getPaquetsPerSignar', obj).subscribe(
                  (res) => {
                    // this.tractaResposta(res);

                  this.paquetsService.setPaquets(res.paquets);

                }
                );

    }


    getCountPaquetsSignats(searchText?: string) {
        this.testTablename();

        const obj = {
          tablename: this.tablename,
          searchText
        };
        return this.http.post(environment.dataServerURL + '/selfapi/getCountPaquetsSignats', obj);
    }



    getPaquetsSignats(page: number, itemsPerpage: number, searchText?: string) {
        this.testTablename();


        const obj = {
                  tablename: this.tablename,
                  searchText,
                  page,
                  itemsPerpage
                };

        return this.http.post<{paquets: Paquet[]}>(environment.dataServerURL + '/selfapi/getPaquetsSignats', obj).subscribe(
                  (res) => {

                    this.paquetsService.setPaquets(res.paquets);

                  }
                );

    }

    addPaquet(paquet: Paquet) {

        this.testTablename();
        return this.http.post(environment.dataServerURL + '/api/crud/' + this.tablename, paquet).subscribe(
            (data: any) => {
                const paquet = data.json[0] as Paquet;
                this.paquetsService.addPaquet(paquet);
                this.messagesService.sendMessage(
                    'Paquet afegit correctament!',
                    'success'
                    );
                this.enviaMail(paquet);
            }
        );
    }

    getPaquetQr(index: number, qrcode: number, tablename: string) {
        // this.testTablename();
        // return this.http.get(this.appConstants.dataServerURL + "/api/crud/"+this.tablename+"?id=" + index + "&qrcode=" + qrcode);
        return this.http.post(environment.dataServerURL + '/selfapi/paquetqr/get', {tablename, id: index, qrcode});
    }

    getPaquet(index: number) {
        this.testTablename();
        return this.http.get(environment.dataServerURL + '/api/crud/' + this.tablename + '/' + index);
    }

    updatePaquet(paquet: Paquet) {
        this.testTablename();
        return (this.http.put(environment.dataServerURL + '/api/crud/' + this.tablename + '/' + paquet.id, paquet).subscribe(
            (data: any) => {
                const paquet: Paquet = data.json[0] as Paquet;
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
            tablename,
            id: paquet.id,
            dipositari: paquet.dipositari,
            signatura: paquet.signatura
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
        return (this.http.put(environment.dataServerURL + '/api/crud/' + this.tablename + '/' + paquet.id, paquet).subscribe(
            (data: any) => {
                const paquet: Paquet = <Paquet> data.json[0];
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
        this.testEmailData();
        // paquet.ubicacioemail = this.ubicacioEmail;
        paquet.gestoremail = this.gestorEmail;
        if (paquet.email !== '') {
            return (this.http.post(environment.dataServerURL + '/selfapi/enviaMail', paquet)).subscribe(
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

    enviaMailRemitent(paquet: Paquet) {
      this.testEmailData();
      // paquet.ubicacioemail = this.ubicacioEmail;
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

          this.http.post(environment.dataServerURL + '/api/crud/usuaris', user).subscribe(
            (dbuser: any) => {

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
        (data: any) => {
            const user: User = <User> data.json[0];
            this.usersService.updateUser(user);
            this.messagesService.sendMessage(
                'Usuari modificat correctament!',
                'success'
                );
        },
        (error: any) => {
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
