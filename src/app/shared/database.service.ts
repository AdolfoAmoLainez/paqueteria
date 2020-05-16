import { HttpClient } from '@angular/common/http';
import { Paquet } from './paquet.model';
import { PaquetsService } from './paquets.service';
import { Injectable } from '@angular/core';
import { MessagesService } from '../messages/messages.service';

import {environment} from 'src/environments/environment';
import { UsersService } from './users.service';
import { User } from './user.model';
import { map } from 'rxjs/operators';


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
        return this.http.post(environment.dataServerURL + '/paquets/getCountPaquetsPerSignar', obj);
    }

    getPaquetsPerSignar(page: number, itemsPerpage: number, searchText?: string) {
        this.testTablename();

        const obj = {
                  tablename: this.tablename,
                  searchText,
                  page,
                  itemsPerpage
                };
        return this.http.post<{paquets: Paquet[]}>(environment.dataServerURL + '/paquets/getPaquetsPerSignar', obj)
        .pipe(
          map(
            paqs => {
              paqs.paquets.forEach(element => {
                element.id = +element.id;

              });
              return paqs;
            }
          )
        )
        .subscribe(
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
        return this.http.post(environment.dataServerURL + '/paquets/getCountPaquetsSignats', obj);
    }



    getPaquetsSignats(page: number, itemsPerpage: number, searchText?: string) {
        this.testTablename();


        const obj = {
                  tablename: this.tablename,
                  searchText,
                  page,
                  itemsPerpage
                };

        return this.http.post<{paquets: Paquet[]}>(environment.dataServerURL + '/paquets/getPaquetsSignats', obj)
        .pipe(
          map(
            paqs => {
              paqs.paquets.forEach(element => {
                element.id = +element.id;

              });
              return paqs;
            }
          )
        )
        .subscribe(
                  (res) => {

                    this.paquetsService.setPaquets(res.paquets);

                  }
                );

    }

    addPaquet(paquet: Paquet) {

        this.testTablename();
        const obj = {
          tablename: this.tablename,
          paquet

        };
        return this.http.post(environment.dataServerURL + '/paquets/add', obj).subscribe(
          (data: Paquet) => {
              this.paquetsService.addPaquet(data);
              this.messagesService.sendMessage(
                  'Paquet afegit correctament!',
                  'success'
                  );
              data.ubicacioemail = data.ubicacioemail.replace('\\', '');
              this.enviaMail(data);
          }
      );
    }

    getPaquetQr(index: number, qrcode: number, tablename: string) {
        return this.http.get<Paquet[]>(environment.dataServerURL + '/paquets/getPaquetQr/' + tablename + '/' + index + '/' + qrcode);
    }

    getPaquet(index: number) {
        this.testTablename();
        return this.http.get(environment.dataServerURL + '/api/crud/' + this.tablename + '/' + index);
    }

    updatePaquet(paquet: Paquet) {
        this.testTablename();
        const obj = {
          tablename: this.tablename,
          paquet

        };
        return this.http.put<Paquet>(environment.dataServerURL + '/paquets/updatePaquet', obj).subscribe(
            (paquete) => {
                this.paquetsService.updatePaquet(paquete);
                this.messagesService.sendMessage(
                    'Paquet modificat correctament!',
                    'success'
                    );
            },
            (error: any) => {
                console.log(error);
                this.messagesService.sendMessage(
                  'No s\'ha pogut modificar el paquet!',
                  'danger'
                  );
            }
        );
    }

    deletePaquet(index: number) {
        this.testTablename();
        return (this.http.delete(environment.dataServerURL + '/paquets/del/' + this.tablename + '/' + index).subscribe(
            () => {
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
        const obj = {
          tablename: this.tablename,
          paquet
        };
        return (this.http.put(environment.dataServerURL + '/paquets/updatePaquet', obj)).subscribe(
            () => {
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
        paquet.qrcode = 0;
        const obj = {
          tablename: this.tablename,
          paquet
        };
        return this.http.post(environment.dataServerURL + '/paquets/signaPaquetQr', obj).subscribe(
            () => {
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
        const obj = {
          tablename: this.tablename,
          paquet

        };
        return this.http.put<Paquet>(environment.dataServerURL + '/paquets/updatePaquet', obj).subscribe(
            (paquete) => {
              paquete.id = +paquete.id;
              this.paquetsService.updatePaquet(paquete);
              this.messagesService.sendMessage(
                  'Codi bidi generat correctament!',
                  'success'
                  );
              this.paquetsService.startedSignPaquet.next(paquet.id);
            }
        );
    }

    enviaMail(paquet: Paquet) {
        this.testEmailData();
        // paquet.ubicacioemail = this.ubicacioEmail;
        paquet.gestoremail = this.gestorEmail;
        if (paquet.email !== '') {
            return (this.http.post(environment.dataServerURL + '/paquets/enviaMail', paquet)).subscribe(
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
          return (this.http.post(environment.dataServerURL + '/paquets/enviaMailRemitent', paquet)).subscribe(
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
      return this.http.get<User[]>(environment.dataServerURL + '/users/getAll')
      .subscribe(
        (users) => {
          this.usersService.setUsers(users);
        }
        );
    }

    addUser(user: User) {
      return this.http.get(environment.dataServerURL + '/paquets/creataula/' + user.tablename).subscribe(
        () => {

          this.http.post(environment.dataServerURL + '/users/add', user).subscribe(
            (dbuser: any) => {

                this.messagesService.sendMessage(
                    'Usuari afegit correctament!',
                    'success'
                    );
                this.usersService.addUser(dbuser);
            }
          );
        }
      );
  }

  updateUser(user: User) {
    this.testTablename();
    return (this.http.put<User>(environment.dataServerURL + '/users/update', user).subscribe(
        (data) => {
            // const user: User = <User> data.json[0];
            this.usersService.updateUser(data);
            this.messagesService.sendMessage(
                'Usuari modificat correctament!',
                'success'
                );
        },
        (error: any) => {
            console.log(error);
            this.messagesService.sendMessage(
              'No s\'ha pogut modificar l\'usuari!',
              'danger'
              );
        }
    ));
  }

  deleteUser(user: User) {

    return this.http.get(environment.dataServerURL + '/paquets/delTaula/' + user.tablename).subscribe(
      () => {
        this.http.get(environment.dataServerURL + '/users/del/' + user.id).subscribe(
          () => {
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
    return this.http.get(environment.dataServerURL + '/users/getUserRol/' + username);
  }

}
