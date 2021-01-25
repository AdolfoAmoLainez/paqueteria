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

        const obj = {
          searchText
        };
        return this.http.post(environment.dataServerURL + '/paquets/getCountPaquetsPerSignar', obj);
    }

    getPaquetsPerSignar(page: number, itemsPerpage: number, searchText?: string) {

        const obj = {
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
                if (element.emailremitent === null) {
                  element.emailremitent = '';
                }
                if (element.email === null) {
                  element.email = '';
                }
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

        const obj = {
          searchText
        };
        return this.http.post(environment.dataServerURL + '/paquets/getCountPaquetsSignats', obj);
    }



    getPaquetsSignats(page: number, itemsPerpage: number, searchText?: string) {

        const obj = {
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
                if (element.emailremitent === null) {
                  element.emailremitent = '';
                }
                if (element.email === null) {
                  element.email = '';
                }
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

        const obj = {
          paquet

        };
        return this.http.post(environment.dataServerURL + '/paquets/add', obj).subscribe(
          (data: Paquet) => {
              data.id = +data.id;
              this.paquetsService.addPaquet(data);
              this.messagesService.sendMessage(
                  'Paquet afegit correctament!',
                  'bg-success text-light'
                  );
              data.ubicacioemail = data.ubicacioemail.replace('\\', '');
              this.enviaMail(data);
          }
      );
    }

    getPaquetQr(index: number, qrcode: number, tablename: string) {
        return this.http.get<Paquet[]>(environment.dataServerURL + '/paquets/getPaquetQr/' + tablename + '/' + index + '/' + qrcode);
    }

    updatePaquet(paquet: Paquet) {
        const obj = {
          paquet

        };
        return this.http.put<Paquet>(environment.dataServerURL + '/paquets/updatePaquet', obj).subscribe(
            (paquete) => {
                this.paquetsService.updatePaquet(paquete);
                this.messagesService.sendMessage(
                    'Paquet modificat correctament!',
                    'bg-success text-light'
                    );
            },
            (error: any) => {
                console.log(error);
                this.messagesService.sendMessage(
                  'No s\'ha pogut modificar el paquet!',
                  'bg-danger text-light'
                  );
            }
        );
    }

    deletePaquet(index: number) {

        return (this.http.delete(environment.dataServerURL + '/paquets/del/' + index).subscribe(
            () => {
                this.paquetsService.deletePaquet(index);
                this.messagesService.sendMessage(
                    'Paquet esborrat correctament!',
                    'bg-success text-light'
                    );
            }
        ));
    }

    signaPaquet(paquet: Paquet) {

        const obj = {
          id: paquet.id,
          dipositari: paquet.dipositari,
          signatura: paquet.signatura
        };

        return (this.http.put(environment.dataServerURL + '/paquets/signaPaquet', obj)).subscribe(
            () => {
                this.paquetsService.paquetSignatCorrectament.next(paquet.id);
                this.messagesService.sendMessage(
                    'Paquet signat correctament!',
                    'bg-success text-light'
                    );
                this.enviaMailRemitent(paquet);
            }
        );
    }

    signaPaquetQr(paquet: Paquet, tablename: string) {

      const obj = {
        tablename: tablename,
        id: paquet.id,
        dipositari: paquet.dipositari,
        signatura: paquet.signatura
      };

      return this.http.post(environment.dataServerURL + '/paquets/signaPaquetQr', obj).subscribe(
          () => {
              this.paquetsService.paquetSignatCorrectament.next(paquet.id);
              this.messagesService.sendMessage(
                  'Paquet signat correctament!',
                  'bg-success text-light'
                  );
              this.enviaMailRemitent(paquet);
          }
      );
    }

    updateQrPaquet(paquet: Paquet) {
        const obj = {
          paquet

        };
        return this.http.put<Paquet>(environment.dataServerURL + '/paquets/updatePaquet', obj).subscribe(
            (paquete) => {
              paquete.id = +paquete.id;
              this.paquetsService.updatePaquet(paquete);
              this.messagesService.sendMessage(
                  'Codi bidi generat correctament!',
                  'bg-success text-light'
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
                            'bg-success text-light'
                            );
                    } else {
                        this.messagesService.sendMessage(
                            'No s\'ha pogut enviar el correu-e!',
                            'bg-danger text-light'
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
                          'bg-success text-light'
                          );
                  } else {
                      this.messagesService.sendMessage(
                          'No s\'ha pogut enviar el correu-e!',
                          'bg-danger text-light'
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
                    'bg-success text-light'
                    );
                this.usersService.addUser(dbuser);
            }
          );
        }
      );
  }

  updateUser(user: User) {
    //this.testTablename();
    return (this.http.put<User>(environment.dataServerURL + '/users/update', user).subscribe(
        (data) => {
            // const user: User = <User> data.json[0];
            this.usersService.updateUser(data);
            this.messagesService.sendMessage(
                'Usuari modificat correctament!',
                'bg-success text-light'
                );
        },
        (error: any) => {
            console.log(error);
            this.messagesService.sendMessage(
              'No s\'ha pogut modificar l\'usuari!',
              'bg-danger text-light'
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
                  'bg-success text-light'
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
