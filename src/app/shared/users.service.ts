import { Injectable } from "@angular/core";
import { User } from "./user.model";
import { Subject } from "rxjs";

@Injectable()
export class UsersService {
  users: User[] = [];

  changedUsers = new Subject<User[]>();
  userAdded = new Subject<User>();

  setUsers(users: User[]) {
    this.users = users;
    this.changedUsers.next(this.users.slice());
  }

  getUsers() {
    this.users.slice();
  }

  addUser(user: User) {

    this.users.unshift(user);
    this.userAdded.next(user);

}

getUser(indexUser:number): User {
  const index = this.users.findIndex((element) => {
      return element.id === indexUser;
  });
  return this.users[index];
}

updateUser(user: User) {
  const index = this.users.findIndex((element) => {
      return element.id === user.id;
  });

  this.users[index] = user;

  this.changedUsers.next(this.users.slice());
}

deleteUser(indexUser: number){
  const index = this.users.findIndex((element) => {
      return element.id === indexUser;
  });
  this.users.splice(index, 1);
  this.changedUsers.next(this.users.slice());
}

}
