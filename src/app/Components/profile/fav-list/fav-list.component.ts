import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Recipe } from 'src/app/Models/Recipe';
import { User } from 'src/app/Models/User';
import { favoritedBy } from 'src/app/Models/favoritedBy';
import { RecipeService } from 'src/app/Services/recipe.service';

@Component({
  selector: 'app-fav-list',
  templateUrl: './fav-list.component.html',
  styleUrls: ['./fav-list.component.css']
})
export class FavListComponent implements OnInit {

  @Input() userId!: number;
  @Input() profileUserId!: number;
  //PIPES

  recipes: any;
  constructor(private recipeService: RecipeService, private router: Router) {

  }

  ngOnInit(): void {
    this.userId = this.profileUserId;
    this.loadFavRecipes()
  }


  // Load favorite recipes for the user
  async loadFavRecipes(): Promise<void> {
    try {
      const res = await this.recipeService.getFavRecipesByUserId(this.profileUserId).toPromise();
      this.recipes = res;
      this.convertImg(this.recipes);
    } catch (error) {
    }
  }

  // Convert the image data of each recipe to base64 format
  convertImg(recipes: Recipe[]) {
    recipes.forEach(element => {
      element.img = this.convertDataToBase64(element.img);
    });
  }


  // Call the recipeService to add or remove a recipe from favorites for the current user
  addOrRemoveToFavourite(recipeId: number) {
    this.recipeService.addOrRemoveFavRecipe(recipeId, this.userId)
      .subscribe(
        () => {
          this.loadFavRecipes();
        }
      );
  }

  // Check if the current user has favorited the recipe
  isFavorited(favoritedBy: favoritedBy[], userId: number): boolean {
    return favoritedBy.some((favorite) => favorite.userId === userId);
  }

  // Navigate to the recipe details page
  gotoRecipe(recipeId: number) {
    this.router.navigate(['/v'], { queryParams: { recipe: recipeId } })
  }

  // Convert the base64 image data to a Blob object
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


}
