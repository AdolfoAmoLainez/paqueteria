import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AuthService} from "../auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthService) { }
  loginForm: FormGroup;

  ngOnInit() {
    this.loginForm = new FormGroup({
      "niu": new FormControl(null),
      "passwd": new FormControl(null)
    })
  }

  onLogin(){
    this.authService.loginUser(
      this.loginForm.get("niu").value,
      this.loginForm.get("passwd").value,  
    )
  }


}
