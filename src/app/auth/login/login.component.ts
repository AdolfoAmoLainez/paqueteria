import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AuthService} from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(public authService: AuthService) { }

  loginForm: FormGroup;
  loginErrorSubscription: Subscription;
  errorMsg: string;

  ngOnInit() {

    this.authService.getUserData();

  }

  onLogin() {
   /* this.authService.loginUser(
      this.loginForm.get("niu").value,
      this.loginForm.get("passwd").value,
    )*/
  }
}
