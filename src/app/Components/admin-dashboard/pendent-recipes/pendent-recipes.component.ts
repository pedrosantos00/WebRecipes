import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Recipe } from 'src/app/Models/Recipe';
import { RecipeService } from 'src/app/Services/recipe.service';

@Component({
  selector: 'app-pendent-recipes',
  templateUrl: './pendent-recipes.component.html',
  styleUrls: ['./pendent-recipes.component.css']
})
export class PendentRecipesComponent implements OnInit {

  recipes: any;
  constructor(private recipeService: RecipeService, private router: Router) {
  }

  ngOnInit(): void {
    this.loadRecipes();
  }


  // get pending recipes
  async loadRecipes(): Promise<void> {
    try {
      // Get pendent recipes from the service
      const res = await this.recipeService.getRecipeToApprove().toPromise();
      this.recipes = res;
      // Convert image data to base64
      this.convertImg(this.recipes);
    } catch (error) {
    }
  }

  // Convert image data to base64
  convertImg(recipes: Recipe[]) {
    recipes.forEach(element => {
      element.img = this.convertDataToBase64(element.img);
    });
  }


  // Convert base64 data to blob URL
  convertDataToBase64(base64Data: string): string {
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'image/jpeg' });
    const urlCreator = window.URL || window.webkitURL;
    return urlCreator.createObjectURL(blob);
  }

  // Nav to recipe page
  gotoRecipe(recipeId: number) {
    this.router.navigate(['/v'], { queryParams: { recipe: recipeId } })
  }


}
