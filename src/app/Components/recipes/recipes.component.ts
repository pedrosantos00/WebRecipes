import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { Recipe } from 'src/app/Models/Recipe';
import { favoritedBy } from 'src/app/Models/favoritedBy';
import { AuthService } from 'src/app/Services/auth.service';
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
  isLoggedIn!: boolean;
  recipes: any;
  newRecipes : any;
  startIndex : number = 0;
  itemCount : number =5;
  noMoreRecipes : boolean = false;
  recipesLoad : boolean = false;
  constructor(private recipeService: RecipeService, private router: Router, private alert: NgToastService, private auth: AuthService) {

  }

  ngOnInit(): void {
    // using this ( recipes-component) for the mainpage and for the profile personal recipes page, this algorithm is to check if is on the
    // mainpage or profile page to display the correct data

    this.recipesLoader();

    // check if its loggedin
    this.isLoggedIn = this.auth.isLoggedIn();
  }

  recipesLoader() {
     // FOR MAINPAGE
     if (this.profileUserId == 0 || this.profileUserId == undefined || this.profileUserId == null) {
      this.loadRecipes();
    }
    // FOR PROFILE PAGE
    else {
      this.userId = this.profileUserId
      this.loadPersonalRecipes(this.profileUserId);
    }
  }

  // get personal recipes
  async loadPersonalRecipes(profileUserId: number): Promise<void> {
    this.recipesLoad = true;
    try {
      const res = await this.recipeService.getRecipesByUserId(profileUserId, this.startIndex,this.itemCount).toPromise();
      if(this.recipes == null) {
        this.recipes = res;
       this.convertImg(this.recipes);
      }
      else{
        //Add more recipes to the list
        this.newRecipes = res ;
        // Remove Load more button
        if(this.newRecipes == 0) {
          this.noMoreRecipes = true;
        }
        this.convertImg(this.newRecipes);
        this.recipes = this.recipes.concat(this.newRecipes);
        this.newRecipes = null;
      }
      this.startIndex += this.itemCount;
      }
      catch (error) {
      }
      this.recipesLoad = false;
  }


  // get all recipes
  async loadRecipes(): Promise<void> {
    this.recipesLoad = true;
    try {
      const res = await this.recipeService.getRecipe(this.startIndex,this.itemCount).toPromise();
      if(this.recipes == null) {
        this.recipes = res;
       this.convertImg(this.recipes);
      }
      else{
        //Add more recipes to the list
        this.newRecipes = res ;
        console.log(this.newRecipes)
        // Remove Load more button
        if(this.newRecipes == 0) {
          this.noMoreRecipes = true;
        }
        this.convertImg(this.newRecipes);
        this.recipes = this.recipes.concat(this.newRecipes);
        this.newRecipes = null;
      }
      this.startIndex += this.itemCount;
      }
      catch (error) {
      }
      this.recipesLoad = false;
  }

  // convert recipe img
  convertImg(recipes: Recipe[]) {
    recipes.forEach(element => {
      element.img = this.convertDataToBase64(element.img);
    });
  }

  // Add or Remove images to fav list
  addOrRemoveToFavourite(recipeId: number) {

    this.recipeService.addOrRemoveFavRecipe(recipeId, this.userId)
      .subscribe(
        () => {
          const recipeIndex = this.recipes.findIndex((recipe: { id: number; }) => recipe.id === recipeId);

          this.recipeService.getRecipe(0,0,recipeId).subscribe(
            updatedRecipe => {
              // Convert the updated recipe's image
              this.convertImg([updatedRecipe]);

              // Update the recipe in the recipes array
              this.recipes[recipeIndex] = updatedRecipe;
            },
            error => {
              // Handle error if unable to fetch the updated recipe
            }
          );

        },
        error => {

        }
      );
  }


  // Check if the recipe is favorited by the user
  isFavorited(favoritedBy: favoritedBy[], userId: number): boolean {
    return favoritedBy.some((favorite) => favorite.userId === userId);
  }

  // Navigate to the recipe page
  gotoRecipe(recipeId: number) {
    this.router.navigate(['/v'], { queryParams: { recipe: recipeId } })
  }

  // Convert base64 image data
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
