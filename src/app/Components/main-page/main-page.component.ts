import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/Models/User';
import { AuthService } from 'src/app/Services/auth.service';
import { UserStoreService } from 'src/app/Services/user-store.service';
import { UserService } from 'src/app/Services/user.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {

  mainRoute?: boolean;
  isLoggedIn?: boolean;
  recipeFlag?: boolean;
  userId: number = 0;
  user = new User() ;

  constructor(private router: Router, private auth: AuthService, private userService : UserService, public tokenService : UserStoreService) {

  }

  ngOnInit(): void {
    this.mainRoute = this.checkMainRoute();
    this.isLoggedIn = this.auth.isLoggedIn();

    this.userId = this.getUser();

    this.userService.getUser(this.userId)
    .subscribe(val => {
      this.user = val ;
    })


  }

  getUser(){
    let id = 0;
     this.tokenService.getId()
    .subscribe(val => {
      let idFromToken = this.auth.getIdFromToken();
      id = val || idFromToken
    })
    return id;
  }

  checkMainRoute(): boolean {
    return this.router.url == "/" ? true : false;
  }

  toggleCreateRecipe() {
    this.recipeFlag = !this.recipeFlag;

  }

  createRecipe() {
    this.toggleCreateRecipe();
  }
}
