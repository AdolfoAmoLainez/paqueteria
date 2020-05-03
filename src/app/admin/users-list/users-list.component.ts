import { Component, OnInit, TemplateRef } from '@angular/core';
import { User } from 'src/app/shared/user.model';
import { Subscription } from 'rxjs';
import { UsersService } from 'src/app/shared/users.service';
import { DatabaseService } from 'src/app/shared/database.service';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { AuthService } from 'src/app/auth/auth.service';
import {
  faEdit,
  faTrashAlt,
  faPowerOff,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {
  // Icones
  faPowerOff = faPowerOff;
  faEdit = faEdit;
  faTrashAlt = faTrashAlt;

  users: User [] = [];

  changedUsersSubscription: Subscription;
  userAddedSubscription: Subscription;

  deleteModalMsg = 'Vols esborrar l\'usuari i la seva BBDD?';
  deleteModalRef: BsModalRef;
  deleteUser: User;

  constructor(private usersService: UsersService,
              private databaseService: DatabaseService,
              private router: Router,
              private route: ActivatedRoute,
              private modalService: BsModalService,
              public authService: AuthService) { }

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

    this.router.navigate(['edit', index], {relativeTo: this.route});

  }

  onNouUsuari() {
    this.router.navigate(['add', 0], {relativeTo: this.route});
  }

  onDeleteClick(user: User, template: TemplateRef<any>) {
    this.deleteModalRef = this.modalService.show(template, {class: 'modal-sm'});
    this.deleteUser = user;
  }

  confirmDelete(): void {
    this.databaseService.deleteUser(this.deleteUser);
    this.deleteModalRef.hide();
    this.deleteUser = undefined;
  }

  declineDelete(): void {
    this.deleteModalRef.hide();
    this.deleteUser = undefined;
  }

  onTornarClick() {
    this.router.navigate(['/llista']);
  }

  onLogout() {
    this.authService.logout();
  }
}
