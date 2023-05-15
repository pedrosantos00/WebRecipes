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
    const myToken = this.auth.getToken();

    if(myToken){
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
    let tokenApiModel = new token();
    tokenApiModel.acessToken = this.auth.getToken()!;
    tokenApiModel.refreshToken = this.auth.getRefreshToken()!;
    return this.auth.renewToken(tokenApiModel)
    .pipe(
      switchMap((data:token) =>{
        this.auth.storeRefreshToken(data.refreshToken);
        this.auth.storeToken(data.acessToken);
        req = req.clone({
          setHeaders : {Authorization:`Bearer ${data.acessToken}`}
      })
      return next.handle(req);

    }),
    catchError((err) =>{
      return throwError(()=>{
        this.alert.warning({detail:"Warning", summary:"Token is expired,Login again"});
        this.router.navigate(['login']);
      })
    })
    )
  }
}
