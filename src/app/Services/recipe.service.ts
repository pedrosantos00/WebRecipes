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
  private comUrl: string = "https://localhost:7145/Comment";
  constructor(private http: HttpClient, private router: Router) { }


  createRecipe(recipeObj : any , id : number )
  {
    return this.http.post<any>(`${this.baseUrl}/create?userId=${id}`,recipeObj)
  }

  updateRecipe(recipe : Recipe) {
    return this.http.put<any>(`${this.baseUrl}/update`, recipe);
  }

  getRecipe(id?: number): Observable<Recipe> {
    if (id == null || id == undefined) {
      return this.http.get<Recipe>(`${this.baseUrl}`);
    } else {
      return this.http.get<Recipe>(`${this.baseUrl}/${id}`);
    }
  }

  getRecipesByUserId(userId: number): Observable<Recipe> {
      return this.http.get<Recipe>(`${this.baseUrl}/user/${userId}`);
  }

  getFavRecipesByUserId(userId: number): Observable<Recipe> {
    return this.http.get<Recipe>(`${this.baseUrl}/fav/user/${userId}`);
}

  getRecipeToAproove(): Observable<Recipe> {
      return this.http.get<Recipe>(`${this.baseUrl}/Aproove`);
  }

  addComment(comment : Comment , id : number){
    return this.http.post<Recipe>(`${this.baseUrl}/c/${id}`, comment);
  }

  addOrRemoveFavRecipe(recipeId : number , userId : number )
  {
    return this.http.put<any>(`${this.baseUrl}/fav/${userId}/${recipeId}` , {});
  }

  addRate(recipeId : number , rate : number) {
    return this.http.post<any>(`${this.baseUrl}/r/${recipeId}/${rate}` , {});
  }

  deleteRecipe(recipeId : number){
    return this.http.delete<any>(`${this.baseUrl}/del/${recipeId}`);
  }



}
