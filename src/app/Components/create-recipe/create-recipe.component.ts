import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';
import { Ingredient } from 'src/app/Models/Ingredient';
import { Recipe } from 'src/app/Models/Recipe';
import { Step } from 'src/app/Models/Step';
import { Tag } from 'src/app/Models/Tag';
import { User } from 'src/app/Models/User';
import { AuthService } from 'src/app/Services/auth.service';
import { RecipeService } from 'src/app/Services/recipe.service';
import { UserStoreService } from 'src/app/Services/user-store.service';
import { UserService } from 'src/app/Services/user.service';

@Component({
  selector: 'app-create-recipe',
  templateUrl: './create-recipe.component.html',
  styleUrls: ['./create-recipe.component.css']
})
export class CreateRecipeComponent implements OnInit {
  recipeForm: FormGroup;
  ingredients: FormArray;
  steps: FormArray;
  userId: number = 0;
  selectedFile!: any;


  constructor(private fb: FormBuilder, private recipeService : RecipeService,private tokenHelper : UserStoreService, private auth : AuthService, private alert: NgToastService) {
    this.recipeForm = this.fb.group({
      title: ['', Validators.required],
      estimatedTime: [''],
      difficulty: [''],
      description: ['', Validators.required],
      mealsPerRecipe: [''],
      img: [''],
      tags: [''],
      ingredients: this.fb.array([this.createIngredient()]),
      steps: this.fb.array([this.createStep()])

    });
    this.ingredients = this.recipeForm.get('ingredients') as FormArray;
    this.steps = this.recipeForm.get('steps') as FormArray;
  }

  ngOnInit(): void {

    this.userId = this.getUser();
  }


  getUser(){
    let id = 0;
     this.tokenHelper.getId()
    .subscribe(val => {
      let idFromToken = this.auth.getIdFromToken();
      id = val || idFromToken
    })
    return id;
  }

  createIngredient(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      quantity: ['', Validators.required],
      quantityType: ['', Validators.required]
    });
  }

  createStep(): FormGroup {
    return this.fb.group({
      stepDescription: ['', Validators.required]
    });
  }

  addIngredient(): void {
    this.ingredients.push(this.createIngredient());
  }

  addStep(): void {
    this.steps.push(this.createStep());
  }

  onFileSelected(event: any): void {
    this.selectedFile = (event.target as HTMLInputElement).files?.[0];
      const reader = new FileReader();
      reader.onload = () => {
      };
      reader.readAsDataURL(this.selectedFile);
  }


  get tagsControl(): AbstractControl | null {
    return this.recipeForm.get('tags');
  }

  get tagsArray(): Tag[] {
  const tagsValue = this.tagsControl?.value;
  return tagsValue
    ? tagsValue.split(',').map((tag: string) => ({ id: 0, tagName: tag.trim() }))
    : [];
}


  onSubmit(): void {
    const recipe = this.recipeForm.value;
    recipe.tags = this.tagsArray;
    recipe.picture = this.selectedFile;
    this.recipeService.createRecipe(recipe,this.userId).subscribe(
    (response) => {
      this.alert.success({detail:"SUCCESS",summary:response?.message, duration:5000});
      // Handle success
    },
    (error) => {
      this.alert.error({detail:"ERROR",summary:error?.message, duration:5000});
      // Handle error
    }
  );
  }
}
