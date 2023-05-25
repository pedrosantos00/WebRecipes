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
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {

    // get the expected role from the route data
    const expectedRole = route.data['expectedRole'];
     // Get the role from the token stored in the AuthService
    const roleFromToken = this.auth.getRoleFromToken();

    if (roleFromToken) {
      // If the role is available from the token, set the 'role' property and check the role
      this.role = roleFromToken;
      return this.checkRole(expectedRole);
    }

    this.tokenInfo.getRole().subscribe(val => {
      // If the role is not available from the token, get it from the UserStoreService and check the role
      this.role = val;
      return this.checkRole(expectedRole);
    });

    return false;
  }

  checkRole(expectedRole: string[] | string): boolean {
    // Check if the expected role matches the user's role
    if (Array.isArray(expectedRole)) {
      if (expectedRole.includes(this.role)) {
        // If the expected role is an array, check if the user's role is included in the expected roles
        return true;
      }
    } else if (this.role === expectedRole) {
      // If the expected role is a string, check if the user's role matches the expected role
      return true;
    }
    // If the role doesn't match the expected role, navigate to the default route and return false
    this.router.navigate(['']);
    return false;
  }
}
