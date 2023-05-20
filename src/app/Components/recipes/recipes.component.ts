import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Recipe } from 'src/app/Models/Recipe';
import { User } from 'src/app/Models/User';
import { favoritedBy } from 'src/app/Models/favoritedBy';
import { RecipeService } from 'src/app/Services/recipe.service';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css']
})
export class RecipesComponent implements OnInit {

  @Input() userId!: number;
 @Input() profileUserId!: number;
 //PIPES
 @Input() filteredValue!: '';

  recipes: any;
  constructor(private recipeService: RecipeService, private router: Router){

  }

    ngOnInit(): void {
      if(this.profileUserId == 0 || this.profileUserId == undefined || this.profileUserId == null) {
        this.loadRecipes();
      }
      else {
        this.userId = this.profileUserId
        this.loadPersonalRecipes(this.profileUserId);
      }

    }

    async loadPersonalRecipes(profileUserId : number): Promise<void> {
      try {
        console.log(profileUserId)
        const res = await this.recipeService.getRecipesByUserId(profileUserId).toPromise();
        console.log(res)
        this.recipes = res;
        this.convertImg(this.recipes);
      } catch (error) {
        console.error('Error loading recipes:', error);
      }
    }



    async loadRecipes(): Promise<void> {
      try {
        const res = await this.recipeService.getRecipe().toPromise();
        console.log(res)
        this.recipes = res;
        this.convertImg(this.recipes);
      } catch (error) {
        console.error('Error loading recipes:', error);
      }
    }

    convertImg(recipes : Recipe[]) {
      recipes.forEach(element => {
        console.log(element)
      element.img = this.convertDataToBase64(element.img);
     });
    }


    addOrRemoveToFavourite(recipeId : number){

      this.recipeService.addOrRemoveFavRecipe(recipeId,this.userId)
      .subscribe(
        () => {
           this.loadRecipes();
        },
        error => {

        }
      );
      console.log(recipeId);
    }

    isFavorited(favoritedBy: favoritedBy[], userId: number): boolean {
      return favoritedBy.some((favorite) => favorite.userId === userId);
    }

    gotoRecipe(recipeId: number){
      console.log(recipeId)
      this.router.navigate(['/v'] , { queryParams: { recipe : recipeId } })
    }

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
