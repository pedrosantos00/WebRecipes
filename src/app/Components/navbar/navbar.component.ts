import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { User } from 'src/app/Models/User';
import { AuthService } from 'src/app/Services/auth.service';
import { UserStoreService } from 'src/app/Services/user-store.service';
import { UserService } from 'src/app/Services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  isLoggedIn?: boolean;
  role?: string;
  userId?: number;
  userImage?: string;

  constructor(private router : Router, private auth: AuthService, private alert: NgToastService, private tokenService: UserStoreService, private userService: UserService) {

  }

  ngOnInit(): void {
    this.isLoggedIn = this.auth.isLoggedIn();
    this.role = this.getRole();
    this.userId = this.getUser();
    if (this.isLoggedIn) {
      this.userImage = this.getUserImage(this.userId);
    }
  }

  // get user Id from token without apis
  getUser() {
    let id = 0;
    this.tokenService.getId()
      .subscribe(val => {
        let idFromToken = this.auth.getIdFromToken();
        id = val || idFromToken

      })


    return id;
  }

  // get role from token without apis
  getRole() {
    let role;
    this.tokenService.getRole()
      .subscribe(val => {
        let roleFromToken = this.auth.getRoleFromToken()
        role = val || roleFromToken
      })
    return role;
  }

  // clear local storage
  logout() {
    this.auth.signOut();
    this.isLoggedIn = false;
    window.location.reload();
  }

  // get user img
  getUserImage(id: number): any {
    this.userService.getUserImage(id)
      .then((imageData: string) => {
        this.userImage = imageData;
      })
      .catch(error => {
        this.userImage = 'https://w7.pngwing.com/pngs/831/88/png-transparent-user-profile-computer-icons-user-interface-mystique-miscellaneous-user-interface-design-smile-thumbnail.png';
      });
  }


}
