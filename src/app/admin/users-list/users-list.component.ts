import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/shared/user.model';
import { Subscription } from 'rxjs';
import { UsersService } from 'src/app/shared/users.service';
import { DatabaseService } from 'src/app/shared/database.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {
  users: User [] = [];
/*
  users: User [] = [
    {
      id: 1,
      niu: "2040206",
      displayname: "user1",
      rol_id: 1,
      tablename: "table1",
      ldapuri: "uri1",
      uidbasedn: "basedn1",
      ubicacioemail: "user1@uab.cat",
      gestoremail: "gestor1@uab.cat"
    },
    {
      id: 1,
      niu: "2040206",
      displayname: "user2",
      rol_id: 1,
      tablename: "table2",
      ldapuri: "uri1",
      uidbasedn: "basedn2",
      ubicacioemail: "user2@uab.cat",
      gestoremail: "gestor2@uab.cat"
    },
    {
      id: 1,
      niu: "2040206",
      displayname: "user3",
      rol_id: 1,
      tablename: "table3",
      ldapuri: "uri3",
      uidbasedn: "basedn3",
      ubicacioemail: "user3@uab.cat",
      gestoremail: "gestor3@uab.cat"
    },
  ];*/

  changedUsersSubscription: Subscription;
  userAddedSubscription: Subscription;

  constructor(private usersService: UsersService,
              private databaseService: DatabaseService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.changedUsersSubscription = this.usersService.changedUsers.subscribe(
      (users: User[]) => {
        this.users = users;
      }
    );

    this.userAddedSubscription = this.usersService.userAdded.subscribe(
      (user: User) => {
        this.users.unshift(user);
      }
    );

    this.databaseService.getUsers();
  }

  onEditClick(index: number) {

    this.router.navigate(['edit',index],{relativeTo: this.route});

  }

  onNouUsuari(){
    this.router.navigate(['add',0],{relativeTo: this.route});
  }

}
