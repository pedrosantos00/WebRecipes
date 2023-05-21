import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Recipe } from 'src/app/Models/Recipe';
import { RecipeService } from 'src/app/Services/recipe.service';

@Component({
  selector: 'app-pendent-recipes',
  templateUrl: './pendent-recipes.component.html',
  styleUrls: ['./pendent-recipes.component.css']
})
export class PendentRecipesComponent implements OnInit{

  recipes: any;
  constructor(private recipeService: RecipeService, private router : Router){

  }


  ngOnInit(): void {
    this.loadRecipes();
 }



 async loadRecipes(): Promise<void> {
   try {
     const res = await this.recipeService.getRecipeToAproove().toPromise();
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

gotoRecipe(recipeId: number){
  console.log(recipeId)
  this.router.navigate(['/v'] , { queryParams: { recipe : recipeId } })
}


}
