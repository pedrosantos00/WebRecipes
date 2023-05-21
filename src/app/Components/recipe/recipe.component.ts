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


@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.css']
})
export class RecipeComponent implements OnInit {
  recipe = new Recipe() ;
  imgRecipe! : string;
  recipeId: number = 0 ;
  isLoggedIn?: boolean;
  editFlag!: boolean;
  comment = new Comment() ;
  userId: number = 0;
  user = new User() ;
  ratingStars: HTMLElement[] = [];
  selectedFile!: any;
  constructor(private route: ActivatedRoute, private recipeService : RecipeService , private router : Router, private auth : AuthService, private userService : UserService ,private tokenService: UserStoreService) {
  }


  ngOnInit(): void
  {

    this.userId = this.getUser();


    this.userService.getUser(this.userId)
    .subscribe(val => {
      this.user = val ;
    })


  this.route.queryParams.subscribe(params => {
    this.recipeId = +params['recipe'];
  });

  this.getRecipe();

  this.isLoggedIn = this.auth.isLoggedIn();

  this.ratingStars = Array.from(document.querySelectorAll('.fa')) as HTMLElement[];
  console.log(this.ratingStars)

}




getRecipe(){
  this.recipeService.getRecipe(this.recipeId)
  .subscribe(val => {
    console.log(this.recipe)
    this.recipe = val;
    this.convertImg(this.recipe);
  });
}
getUser(){
  let id = 0;
   this.tokenService.getId()
  .subscribe(val => {
    let idFromToken = this.auth.getIdFromToken();
    id = val || idFromToken
  })
  return id;
}


  convertImg(recipe : Recipe) {
     this.imgRecipe= this.convertDataToBase64(recipe.img);
  }

  goToDashBoard(){
    this.router.navigate([''] , )
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


  sendCommentary() {
    this.comment.userId = this.userId

    // Get the value of the textarea
    const textarea = document.getElementById('comment') as HTMLTextAreaElement;
    // Get the value of the textarea
    const commentText: string = textarea.value;
    this.comment.text = commentText;
    this.comment.userId = this.comment.userId;

    if(this.comment.text != null || this.comment.text != undefined || this.comment.text != '') {
      console.log(this.comment)
      this.recipeService.addComment(this.comment, this.recipeId)
      .subscribe(
        () => {
          this.getRecipe();
        },
        error => {
          console.log(error)
        }
      );
    }
  }


  deleteRecipe(){
    if (confirm("Are you sure you want to delete?")) {
      this.recipeService.deleteRecipe(this.recipeId)
      .subscribe(
        () => {
          this.router.navigate(['']);
        },
        error => {
          console.log(error)
        }
      );
    };
  }


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


  handleMouseOut() {
    this.ratingStars.forEach(star => {
      star.classList.remove('fa-star');
      star.classList.add('fa-star-o');
    });
  }

  rate(id : number) {
      this.recipeService.addRate(this.recipeId, id)
      .subscribe(
        () => {
          this.getRecipe();
        },
        error => {
          console.log(error)
        }
      );
    }

    editTemplate() {
      this.editFlag = !this.editFlag;
    }



    deleteTag(index: number) {
      this.recipe.tags.splice(index, 1);
    }

    addNewTag() {
      this.recipe.tags.push({ tagName: '' });
    }

    deleteIngredient(index: number) {
      this.recipe.ingredients.splice(index, 1);
    }

    addNewIngredient() {
      this.recipe.ingredients.push({ name: '', quantity: '', quantityType: ''});
    }

    deleteStep(index: number) {
      this.recipe.steps.splice(index, 1);
      for (let i = index; i < this.recipe.steps.length; i++) {
        this.recipe.steps[i].stepId = i + 1;
      }
    }

    addNewStep() {
      const newStepId = this.recipe.steps.length + 1;
      this.recipe.steps.push({ stepId: newStepId, stepDescription: ''});
    }

    saveChanges() {
      if(this.selectedFile != null || this.selectedFile != undefined || this.selectedFile != '') {
        this.recipe.img = this.selectedFile;
      }
      else{
        this.recipe.img = null;
      }
      this.recipeService.updateRecipe(this.recipe)
      .subscribe(
        () => {
          this.getRecipe();
          this.editTemplate();
        },
        error => {
          console.log(error)
        }
      );
    }

    deleteComment(index: number) {
      this.recipe.comments.splice(index, 1);
    }


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

