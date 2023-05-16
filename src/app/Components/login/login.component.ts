import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {  Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from 'src/app/Services/auth.service';
import { UserStoreService } from 'src/app/Services/user-store.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

type : string ="password"
istText : boolean = false;
eyeIcon : string = "fa-eye-slash"
loginForm!: FormGroup;

public resetPasswordEmail!: string;
public isValidEmail!: boolean;


constructor( private fb:FormBuilder,
  private auth : AuthService,
  private router : Router ,
  private user : UserStoreService,
  private alert: NgToastService
   )
{

}

ngOnInit(): void
{
  this.loginForm = this.fb.group({
    email: ['', Validators.required],
    password: ['',Validators.required]
  })
}
  hideShowPass()
  {
    this.istText = !this.istText;
    this.istText ? this.eyeIcon = "fa-eye" : this.eyeIcon ="fa-eye-slash";
    this.istText ? this.type = "text" : this.type ="password";

  }

  onLogin()
  {
    if(this.loginForm.valid)
      {

        this.auth.login(this.loginForm.value)
        .subscribe({
            next: (res) =>{
            this.loginForm.reset();
            this.auth.storeToken(res.acessToken);
            this.auth.storeRefreshToken(res.refreshToken);
            const tokenPayload = this.auth.decodedToken();
            this.user.setFullName(tokenPayload.unique_name);
            this.user.setRole(tokenPayload.role);
            this.user.setId(tokenPayload.id)
            this.alert.success({detail:"SUCCESS",summary:res.message, duration:5000});
            this.router.navigate(['']);

          },
            error:(err)=>{
              this.alert.error({detail:"ERROR",summary:err?.message, duration:5000});
            }
          })
      }
    else
      {
        this.validateAllFormFields(this.loginForm);
        this.alert.error({detail:"ERROR",summary:"Fill all the required data", duration:5000});
      }
  }

  private validateAllFormFields(formGroup:FormGroup)
  {
    Object.keys(formGroup.controls).forEach(f =>{
      const control = formGroup.get(f);
      if(control instanceof FormControl)
      {
        control.markAsDirty({onlySelf:true});
      }
      else if(control instanceof FormGroup)
      {
        this.validateAllFormFields(control);
      }
    })
  }

}





