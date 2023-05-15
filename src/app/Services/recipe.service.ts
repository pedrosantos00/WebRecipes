import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Recipe } from '../Models/Recipe';
import { User } from '../Models/User';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  private baseUrl: string = "https://localhost:7145/Recipe";
  constructor(private http: HttpClient, private router: Router) { }


  createRecipe(recipeObj : Recipe, id : number )
  {
    return this.http.post<any>(`${this.baseUrl}/create?userId=${id}`,recipeObj)
  }
}
