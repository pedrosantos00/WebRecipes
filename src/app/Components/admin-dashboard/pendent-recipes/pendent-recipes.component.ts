import { Component, OnInit } from '@angular/core';
import { RecipeService } from 'src/app/Services/recipe.service';

@Component({
  selector: 'app-pendent-recipes',
  templateUrl: './pendent-recipes.component.html',
  styleUrls: ['./pendent-recipes.component.css']
})
export class PendentRecipesComponent implements OnInit{

  Recipes: any;
  constructor(private recipeService: RecipeService){

  }


ngOnInit(): void {
       this.recipeService.getRecipe()
       .subscribe(res =>{
         this.Recipes = res;
       });


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
