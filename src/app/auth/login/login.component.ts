import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AuthService} from '../auth.service';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(public authService: AuthService,
              private activatedRoute: ActivatedRoute,
              private router: Router) { }

  loginForm: FormGroup;
  loginErrorSubscription: Subscription;
  errorMsg: string;

  ngOnInit() {

    this.activatedRoute.data.subscribe(
      (data) => {
        if (!data.ticket) {
          this.authService.loginUser();
        } else {
          this.router.navigate(['/llista']);
        }
      }
    );

    //this.authService.loginUser();

    /*this.loginForm = new FormGroup({
      "niu": new FormControl(null),
      "passwd": new FormControl(null)
    });
    this.loginErrorSubscription = this.authService.loginIncorrect.subscribe(
      (error)=>{
        this.errorMsg="Usuari o password incorrectes!";
        console.log(this.errorMsg);
      }
    )*/
  }

  onLogin() {
   /* this.authService.loginUser(
      this.loginForm.get("niu").value,
      this.loginForm.get("passwd").value,
    )*/
  }
}
