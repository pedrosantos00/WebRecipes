import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Recipe } from '../Models/Recipe';
import { User } from '../Models/User';
import { Comment } from '../Models/Comment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  private baseUrl: string = "https://localhost:7145/Recipe";
  constructor(private http: HttpClient, private router: Router) { }


  //create a recipe
  createRecipe(recipeObj: any, id: number) {
    return this.http.post<any>(`${this.baseUrl}/create?userId=${id}`, recipeObj)
  }

  //update a existing recipe
  updateRecipe(recipe: Recipe) {
    return this.http.put<any>(`${this.baseUrl}/update`, recipe);
  }

  // get recipes / recipe by ID
  getRecipe(id?: number): Observable<Recipe> {
    if (id == null || id == undefined) {
      return this.http.get<Recipe>(`${this.baseUrl}`);
    } else {
      return this.http.get<Recipe>(`${this.baseUrl}/${id}`);
    }
  }

  //get recipes by user Id
  getRecipesByUserId(userId: number): Observable<Recipe> {
    return this.http.get<Recipe>(`${this.baseUrl}/user/${userId}`);
  }

   //get recipes by Fav user Id
  getFavRecipesByUserId(userId: number): Observable<Recipe> {
    return this.http.get<Recipe>(`${this.baseUrl}/fav/user/${userId}`);
  }

  // get recipes waiting to approve
  getRecipeToApprove(): Observable<Recipe> {
    return this.http.get<Recipe>(`${this.baseUrl}/approve`);
  }

  // get recipes waiting to approve
  addComment(comment: Comment, id: number) {
    return this.http.post<any>(`${this.baseUrl}/c/${id}`, comment);
  }

  // add a user to the fav recipe list
  addOrRemoveFavRecipe(recipeId: number, userId: number) {
    return this.http.put<any>(`${this.baseUrl}/fav/${userId}/${recipeId}`, {});
  }

  // add/update rate
  addRate(recipeId: number, rate: number, userId: number) {
    return this.http.post<any>(`${this.baseUrl}/r/${recipeId}/${rate}/${userId}`, {});
  }

  // delete recipe
  deleteRecipe(recipeId: number) {
    return this.http.delete<any>(`${this.baseUrl}/del/${recipeId}`);
  }



}
