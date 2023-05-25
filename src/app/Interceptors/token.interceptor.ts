import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, retryWhen, switchMap, throwError } from 'rxjs';
import { AuthService } from '../Services/auth.service';
import { Router } from '@angular/router';
import { token } from '../Models/token';
import { NgToastService } from 'ng-angular-popup';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private auth : AuthService , private router : Router, private alert : NgToastService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Get the token from the AuthService
    const myToken = this.auth.getToken();

    if(myToken){
      // If the token exists, add it to the request headers
      request = request.clone({
        setHeaders : {Authorization:`Bearer ${myToken}`}
      })
    }
    return next.handle(request).pipe(

      catchError((err:any)=> {
        if(err instanceof HttpErrorResponse){
            if(err.status === 401){
               return  this.handleUnAuthError(request,next);
            }
        }
        return throwError(() => new Error(err?.error.message));
      })
    );
  }
  handleUnAuthError(req: HttpRequest<any> , next : HttpHandler){
    // Create a tokenApiModel with the stored access token and refresh token
    let tokenApiModel = new token();
    tokenApiModel.accessToken = this.auth.getToken()!;
    tokenApiModel.refreshToken = this.auth.getRefreshToken()!;
    // Renew the token using the AuthService
    return this.auth.renewToken(tokenApiModel)
    .pipe(
      switchMap((data:token) =>{
         // Store the new refresh token and access token
        this.auth.storeRefreshToken(data.refreshToken);
        this.auth.storeToken(data.accessToken);
        req = req.clone({
          // Handle the request with the updated token
          setHeaders : {Authorization:`Bearer ${data.accessToken}`}
      })
      return next.handle(req);

    }),
    catchError((err) =>{
      // If an error occurs during token renewal, navigate to the default route
      return throwError(()=>{
        this.alert.warning({detail:"Warning", summary:"Token is expired,Login again"});
        this.router.navigate(['']);
      })
    })
    )
  }
}
