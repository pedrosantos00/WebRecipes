import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Recipe } from '../Models/Recipe';
import { User } from '../Models/User';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  private baseUrl: string = "https://localhost:7145/Recipe";
  constructor(private http: HttpClient, private router: Router) { }


  createRecipe(recipeObj : any , id : number )
  {
    return this.http.post<any>(`${this.baseUrl}/create?userId=${id}`,recipeObj)
  }


  getRecipe(id?: number): Observable<any> {
    if (id == null || id == undefined) {
      return this.http.get<any>(`${this.baseUrl}`);
    } else {
      return this.http.get<any>(`${this.baseUrl}/${id}`);
    }
  }

  addOrRemoveFavRecipe(recipeId : number , userId : number )
  {
    return this.http.put<any>(`${this.baseUrl}/fav/${userId}/${recipeId}` , {});
  }




}
