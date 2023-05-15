import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { AuthService } from 'src/app/Services/auth.service';
import { UserStoreService } from 'src/app/Services/user-store.service';
import { UserService } from 'src/app/Services/user.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit{

  //PIPES
  filteredValue = '';

  //CHECK MAX USERS
  numUsers: number = 0;

  public selectedOption!: string;
  public users: any = [];
  public fullName : string = "";
  public role : string = "";
  public companyId : number = 0;
  public deletedUserId? : number;
  public elements = document.querySelectorAll<HTMLAnchorElement>('.nav-link');
  public lastActiveEvent = document.querySelectorAll<HTMLAnchorElement>('.nav-link');


  constructor(private router : Router ,private auth : AuthService , private api: UserService, private tokenInfo : UserStoreService, private alert: NgToastService){
    this.elements = document.querySelectorAll<HTMLAnchorElement>('.nav-link');
  }

  ngOnInit(): void
  {

    this.tokenInfo.getFullName()
    .subscribe(val =>{
      let FullnameFromToken = this.auth.getFullNameFromToken();
      this.fullName = val || FullnameFromToken
    })

    this.tokenInfo.getRole()
    .subscribe(val =>{
      let roleFromToken = this.auth.getRoleFromToken();
      this.role = val || roleFromToken
    })

    this.api.getUser()
    .subscribe(res =>{
      this.users = res;
    });

  }



  deleteUser(userId : number){
    this.api.remove(userId).subscribe();
    this.alert.info({detail:"User",summary:"User Deleted!", duration:5000});
    this.deletedUserId = userId;
    this.api.getUser();
    // window.location.reload();
  }

  editUser(UserId: number){
    this.router.navigate(['/admin/edit'] , { queryParams: { UserId: UserId } })
  }


}
