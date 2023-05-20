import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../Services/auth.service';
import { NgToastService } from 'ng-angular-popup';
import { UserStoreService } from '../Services/user-store.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  role = '';

  constructor(
    private auth: AuthService,
    private router: Router,
    private toast: NgToastService,
    private tokenInfo: UserStoreService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {

    const expectedRole = route.data['expectedRole'];
    const roleFromToken = this.auth.getRoleFromToken();

    if (roleFromToken) {
      this.role = roleFromToken;
      return this.checkRole(expectedRole);
    }

    this.tokenInfo.getRole().subscribe(val => {
      this.role = val;
      return this.checkRole(expectedRole);
    });

    return false;
  }

  checkRole(expectedRole: string[] | string): boolean {
    if (Array.isArray(expectedRole)) {
      if (expectedRole.includes(this.role)) {
        return true;
      }
    } else if (this.role === expectedRole) {
      return true;
    }
    this.router.navigate(['']);
    return false;
  }
}
