import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { User } from 'src/app/shared/user.model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DatabaseService } from 'src/app/shared/database.service';
import { UsersService } from 'src/app/shared/users.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-user-editadd',
  templateUrl: './user-editadd.component.html',
  styleUrls: ['./user-editadd.component.css']
})
export class UserEditaddComponent implements OnInit {

  editMode = false;
  userForm: FormGroup;
  userEditing: User;
  formVisible = false;

  rols = environment.rols;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private usersService: UsersService,
              private databaseService: DatabaseService) { }

  ngOnInit() {
    this.userForm = new FormGroup({
      'niu' : new FormControl (null, Validators.required),
      'displayname' : new FormControl (null, Validators.required),
      'tablename' : new FormControl (null, Validators.required),
      'rol_id' : new FormControl (null, Validators.required),
      'uidbasedn' : new FormControl (null, Validators.required),
      'ldapuri' : new FormControl (null, Validators.required),
      'ubicacioemail' : new FormControl (null, Validators.required),
      'gestoremail' : new FormControl (null, Validators.required)
    });

    this.route.params.subscribe(
      (params: Params) => {
        switch (params['mode']) {
          case 'edit':
            this.userEditing = this.usersService.getUser(
              +this.route.snapshot.params['id']
            );
            if (!this.userEditing) {
              this.onHideForm();
            } else {
              this.formVisible = true;
              this.editMode = true;
              this.userForm.patchValue({
                'niu' : this.userEditing.niu,
                'displayname' : this.userEditing.displayname,
                'tablename' : this.userEditing.tablename,
                'rol_id' : this.userEditing.rol_id,
                'uidbasedn' : this.userEditing.uidbasedn,
                'ldapuri' : this.userEditing.ldapuri,
                'ubicacioemail' : this.userEditing.ubicacioemail,
                'gestoremail' : this.userEditing.gestoremail
              });
            }
            break;
        case 'add':
          this.formVisible = true;
          this.editMode = false;
          this.userForm.reset();
           break;
        }
      });


  }

  onClear() {
    this.userForm.reset();
  }

  onHideForm() {
    this.formVisible = false;
    this.onClear();
    this.router.navigate(['admin']);
  }

  onUserAction() {
    if (this.editMode) {

      const id = this.userEditing.id;
      this.userEditing = this.userForm.value;
      this.userEditing.id = id;
      this.databaseService.updateUser(this.userEditing);

    } else {
      this.databaseService.addUser(this.userForm.value);
      this.onHideForm();
    }
  }

}
