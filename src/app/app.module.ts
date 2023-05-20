import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainPageComponent } from './Components/main-page/main-page.component';
import { NavbarComponent } from './Components/navbar/navbar.component';
import { LoginComponent } from './Components/login/login.component';
import { TokenInterceptor } from './Interceptors/token.interceptor';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { SignupComponent } from './Components/signup/signup.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgToastModule } from 'ng-angular-popup';
import { ProfileComponent } from './Components/profile/profile.component';
import { AdminDashboardComponent } from './Components/admin-dashboard/admin-dashboard.component';
import { EditUserComponent } from './Components/admin-dashboard/edit-user/edit-user.component';
import { FilterUserPipe } from './Pipes/filter-user.pipe';
import { CreateRecipeComponent } from './Components/create-recipe/create-recipe.component';
import { RecipesComponent } from './Components/recipes/recipes.component';
import { PendentRecipesComponent } from './Components/admin-dashboard/pendent-recipes/pendent-recipes.component';
import { FilterRecipePipe } from './Pipes/filter-recipe.pipe';
import { RecipeComponent } from './Components/recipe/recipe.component';
import { FavListComponent } from './Components/profile/fav-list/fav-list.component';

@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    NavbarComponent,
    LoginComponent,
    SignupComponent,
    ProfileComponent,
    ProfileComponent,
    AdminDashboardComponent,
    EditUserComponent,
    FilterUserPipe,
    CreateRecipeComponent,
    RecipesComponent,
    PendentRecipesComponent,
    FilterRecipePipe,
    RecipeComponent,
    FavListComponent


  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgToastModule,

  ],

   providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
