import { NgModule , Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainPageComponent } from './Components/main-page/main-page.component';
import { LoginComponent } from './Components/login/login.component';
import { SignupComponent } from './Components/signup/signup.component';
import { ProfileComponent } from './Components/profile/profile.component';
import { AdminDashboardComponent } from './Components/admin-dashboard/admin-dashboard.component';
import { EditUserComponent } from './Components/admin-dashboard/edit-user/edit-user.component';
import { AuthGuard } from './Guards/auth.guard';


const routes: Routes = [

  {path :'' , component: MainPageComponent},
  {path: 'login' , component: LoginComponent},
  {path: 'signup' , component: SignupComponent},


  {path:'', component: MainPageComponent , children :[
    {path:'profile', component: ProfileComponent ,canActivate:[AuthGuard],data: { expectedRole: ['Admin', 'User'] }},
    {path: 'admin' , component: AdminDashboardComponent,canActivate:[AuthGuard],data: { expectedRole: 'Admin' }},
    {path:'admin/edit', component: EditUserComponent,canActivate:[AuthGuard], data: { expectedRole: 'Admin' }}
  ]},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
