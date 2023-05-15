import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http"
import { Router } from '@angular/router';
import { User } from '../Models/User';
import { JwtHelperService } from '@auth0/angular-jwt';
import { token } from '../Models/token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl: string = "https://localhost:7145/User/";
  private userPayload: any;

  constructor(private http: HttpClient, private router: Router)
  {
    this.userPayload = this.decodedToken();
  }

   // REGISTO NA PAGINA COM DADOS FULL NAME + EMAIL + PASSWORD
  signUp(userObj : User)
  {
    return this.http.post<any>(`${this.baseUrl}register`,userObj)
  }



  // LOGIN NA PAGINA COM DADOS EMAIL + PASSWORD
  login(userObj : User)
  {
    return this.http.post<any>(`${this.baseUrl}login`,userObj)
  }

  isLoggedIn(): boolean
  {
    return !!localStorage.getItem('token');
  }

  signOut(){
    localStorage.clear();
    this.router.navigate(['']);
  }

  // JWT TOKEN Methods
  decodedToken()
  {
    const jwtHelper = new JwtHelperService();
    const token = this.getToken()!;
    console.log(jwtHelper.decodeToken(token));
    return jwtHelper.decodeToken(token);
  }

  storeToken(tokenValue : string)
  {
    localStorage.setItem('token',tokenValue);
  }

  storeRefreshToken(tokenValue : string)
  {
    localStorage.setItem('refreshToken',tokenValue);
  }

  getRefreshToken()
  {
    return localStorage.getItem('refreshToken');
  }

  getToken()
  {
    return localStorage.getItem('token');
  }

  renewToken(tokenApi : token){
    return this.http.post<any>(`${this.baseUrl}refresh`,tokenApi)
  }

  getIdFromToken(){
    if(this.userPayload){
      return this.userPayload.id;
    }
  }

  getFullNameFromToken(){
    if(this.userPayload){
      return this.userPayload.unique_name;
    }
  }

  getRoleFromToken(){
    if(this.userPayload){
      return this.userPayload.role;
    }
  }


}
