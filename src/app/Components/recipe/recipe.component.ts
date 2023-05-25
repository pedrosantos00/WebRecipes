import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Recipe } from 'src/app/Models/Recipe';
import { User } from 'src/app/Models/User';
import { Comment } from 'src/app/Models/Comment';
import { AuthService } from 'src/app/Services/auth.service';
import { RecipeService } from 'src/app/Services/recipe.service';
import { UserStoreService } from 'src/app/Services/user-store.service';
import { UserService } from 'src/app/Services/user.service';
import { NgToastService } from 'ng-angular-popup';


@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.css']
})
export class RecipeComponent implements OnInit {
  recipe = new Recipe();
  imgRecipe!: string;
  recipeId: number = 0;
  isLoggedIn?: boolean;
  editFlag!: boolean;
  comment = new Comment();
  userId: number = 0;
  user = new User();
  ratingStars: HTMLElement[] = [];
  selectedFile!: any;
  constructor(private route: ActivatedRoute, private recipeService: RecipeService, private router: Router, private auth: AuthService, private userService: UserService, private tokenService: UserStoreService, private alert: NgToastService) {
  }


  ngOnInit(): void {

    this.userId = this.getUser();

    // get user data
    if (this.userId != null || this.userId != undefined) {
      this.userService.getUser(this.userId)
        .subscribe(val => {
          this.user = val;
        })
    }

    // Retrieve the recipe ID from the query/link parameters
    this.route.queryParams.subscribe(params => {
      this.recipeId = +params['recipe'];
    });

    this.getRecipe();

    // Check if the user is logged in
    this.isLoggedIn = this.auth.isLoggedIn();

    // Get the rating stars elements
    this.ratingStars = Array.from(document.querySelectorAll('.fa')) as HTMLElement[];
  }



  // Get the recipe data
  getRecipe() {
    this.recipeService.getRecipe(this.recipeId)
      .subscribe(val => {
        this.recipe = val;
        this.convertImg(this.recipe);
      });
  }

  // Retrieve the user ID from the tokenService
  getUser() {
    let id = 0;
    this.tokenService.getId()
      .subscribe(val => {
        let idFromToken = this.auth.getIdFromToken();
        id = val || idFromToken
      })
    return id;
  }


  // Convert the recipe image to base64 format for display
  convertImg(recipe: Recipe) {
    this.imgRecipe = this.convertDataToBase64(recipe.img);
  }

  // Navigate to the dashboard
  goToDashBoard() {
    this.router.navigate([''],)
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


  // Add the comment to the recipe
  sendCommentary() {
    this.comment.userId = this.userId

    // Get the value of the textarea
    const textarea = document.getElementById('comment') as HTMLTextAreaElement;
    const commentText: string = textarea.value;
    this.comment.text = commentText;
    this.comment.userId = this.comment.userId;

    if (this.comment.text != null || this.comment.text != undefined || this.comment.text != '') {
      this.recipeService.addComment(this.comment, this.recipeId)
        .subscribe(
          (res) => {
            this.getRecipe();
            this.alert.success({ detail: "SUCCESS", summary: res?.message, duration: 5000 });
          },
          error => {
            this.alert.error({ detail: "ERROR", summary: error?.message, duration: 5000 });
          }
        );
    }
  }


  // Delete the recipe
  deleteRecipe() {
    if (confirm("Are you sure you want to delete?")) {
      this.recipeService.deleteRecipe(this.recipeId)
        .subscribe(
          (res) => {
            this.router.navigate(['']);
            this.alert.success({ detail: "SUCCESS", summary: res?.message, duration: 5000 });
          },
          error => {
            this.alert.error({ detail: "ERROR", summary: error?.message, duration: 5000 });
          }
        );
    };
  }


  // Handle the mouse over event for rating stars
  handleMouseOver(index: number) {
    const stars = document.querySelectorAll('.rating-stars i');
    stars.forEach((star, i) => {
      if (i < index) {
        star.classList.add('fa-star');
        star.classList.remove('fa-star-o');
      } else {
        star.classList.add('fa-star-o');
        star.classList.remove('fa-star');
      }
    });
  }

  // Handle the mouse out event for rating stars
  handleMouseOut() {
    this.ratingStars.forEach(star => {
      star.classList.remove('fa-star');
      star.classList.add('fa-star-o');
    });
  }

  // Add a rating to the recipe
  rate(id: number) {
    this.recipeService.addRate(this.recipeId, id, this.userId)
      .subscribe(
        () => {
          this.alert.success({ detail: "SUCCESS", summary: "Rated successfully.", duration: 5000 });

        },
        error => {
          this.alert.error({ detail: "ERROR", summary: error?.message, duration: 5000 });
        }
      );
  }

  // Toggle the editFlag to enable/disable template editing
  editTemplate() {
    this.editFlag = !this.editFlag;
  }

  // Delete a tag from the recipe
  deleteTag(index: number) {
    this.recipe.tags.splice(index, 1);
  }

  // Add a new tag to the recipe
  addNewTag() {
    this.recipe.tags.push({ tagName: '' });
  }

  // Delete an ingredient from the recipe
  deleteIngredient(index: number) {
    this.recipe.ingredients.splice(index, 1);
  }

  // Add a new ingredient to the recipe
  addNewIngredient() {
    this.recipe.ingredients.push({ name: '', quantity: '', quantityType: '' });
  }

  // Delete a step from the recipe
  deleteStep(index: number) {
    this.recipe.steps.splice(index, 1);
    for (let i = index; i < this.recipe.steps.length; i++) {
      this.recipe.steps[i].stepId = i + 1;
    }
  }

  // Add a new step to the recipe
  addNewStep() {
    const newStepId = this.recipe.steps.length + 1;
    this.recipe.steps.push({ stepId: newStepId, stepDescription: '' });
  }

  // Update the recipe with the changes
  saveChanges() {
    if (this.selectedFile != null || this.selectedFile != undefined || this.selectedFile != '') {
      this.recipe.img = this.selectedFile;
    }
    else {
      this.recipe.img = null;
    }
    this.recipeService.updateRecipe(this.recipe)
      .subscribe(
        (res) => {
          this.getRecipe();
          this.editTemplate();
          this.alert.success({ detail: "SUCCESS", summary: res?.message, duration: 5000 });
        },
        error => {
          this.alert.error({ detail: "ERROR", summary: error?.message, duration: 5000 });
        }
      );
  }

  // Delete a comment from the recipe
  deleteComment(index: number) {
    this.recipe.comments.splice(index, 1);
  }

  // Handle the file selection event
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    const reader: FileReader = new FileReader();

    reader.onload = () => {
      const base64String: string | ArrayBuffer | null = reader.result as string | ArrayBuffer;
      if (base64String) {
        this.selectedFile = base64String.toString().split(',')[1]; // Extract the base64 string from the data URL
      }
    };

    reader.readAsDataURL(file);
  }
}

