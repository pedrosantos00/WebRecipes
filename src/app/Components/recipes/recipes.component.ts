import { Component, Input, OnInit } from '@angular/core';
import { Recipe } from 'src/app/Models/Recipe';
import { User } from 'src/app/Models/User';
import { RecipeService } from 'src/app/Services/recipe.service';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css']
})
export class RecipesComponent implements OnInit {

  @Input() userId!: number;

 //PIPES
 @Input() filteredValue!: '';

  recipes: any;
  constructor(private recipeService: RecipeService){

  }

    ngOnInit(): void {
       this.loadRecipes();
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
      console.log(recipeId);
      this.recipeService.addOrRemoveFavRecipe(recipeId,this.userId)
      .subscribe(
        () => {

        },
        error => {
        }
      );
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
