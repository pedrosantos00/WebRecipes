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

  private baseUrl: string = "recipewebsiteaps.azurewebsites.net/User";
  private userPayload: any;

  constructor(private http: HttpClient, private router: Router)
  {
    // Decode the token when AuthService is instantiated
    this.userPayload = this.decodedToken();
  }

   // REGISTER ON THE PAGE WITH FULL NAME + EMAIL + PASSWORD
  signUp(userObj : User)
  {
    return this.http.post<any>(`${this.baseUrl}/register`,userObj)
  }



  // LOGIN ON THE PAGE WITH EMAIL + PASSWORD
  login(userObj : User)
  {
    return this.http.post<any>(`${this.baseUrl}/login`,userObj)
  }

  // Check if a token exists in the local storage
  isLoggedIn(): boolean
  {
    return !!localStorage.getItem('token');
  }

  // Clear the local storage
  signOut(){
    localStorage.clear();
  }

  // Decode the JWT token using the JwtHelperService
  decodedToken()
  {
    const jwtHelper = new JwtHelperService();
    const token = this.getToken()!;
    return jwtHelper.decodeToken(token);
  }

  // Store the access token in the local storage
  storeToken(tokenValue : string)
  {
    localStorage.setItem('token',tokenValue);
  }

  // Store the refresh token in the local storage
  storeRefreshToken(tokenValue : string)
  {
    localStorage.setItem('refreshToken',tokenValue);
  }

  // get the refresh token from the local storage
  getRefreshToken()
  {
    return localStorage.getItem('refreshToken');
  }

  // get the access token from the local storage
  getToken()
  {
    return localStorage.getItem('token');
  }

  // renew the token using the refresh token
  renewToken(tokenApi : token){
    return this.http.post<any>(`${this.baseUrl}/refresh`,tokenApi)
  }

  // get the user ID from the decoded token
  getIdFromToken(){
    if(this.userPayload){
      return this.userPayload.id;
    }
  }

  // get the full name from the decoded token
  getFullNameFromToken(){
    if(this.userPayload){
      return this.userPayload.unique_name;
    }
  }

  // get the role from the decoded token
  getRoleFromToken(){
    if(this.userPayload){
      return this.userPayload.role;
    }
  }


}
