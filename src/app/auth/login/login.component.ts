import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AuthService} from "../auth.service";
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthService) { }
  loginForm: FormGroup;
  loginErrorSubscription: Subscription;
  errorMsg:string;

  ngOnInit() {
    this.loginForm = new FormGroup({
      "niu": new FormControl(null),
      "passwd": new FormControl(null)
    });
    this.loginErrorSubscription = this.authService.loginIncorrect.subscribe(
      (error)=>{
        this.errorMsg="Usuari o password incorrectes!";
        console.log(this.errorMsg);
      }
    )
  }

  onLogin(){
    this.authService.loginUser(
      this.loginForm.get("niu").value,
      this.loginForm.get("passwd").value,  
    )
  }
}
