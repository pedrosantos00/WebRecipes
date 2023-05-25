import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { User } from 'src/app/Models/User';
import { AuthService } from 'src/app/Services/auth.service';
import { UserService } from 'src/app/Services/user.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  type: string = "password"
  istText: boolean = false
  eyeIcon: string = "fa-eye-slash"
  profileForm!: FormGroup;
  userId: number = 0;
  user = new User();
  userImage!: string;
  imgToUpdate!: any;

  constructor(private router: Router, private fb: FormBuilder, private auth: AuthService, private alert: NgToastService, private route: ActivatedRoute, private userService: UserService) {
  }


  ngOnInit(): void {
    // Get the userId from query/link parameters
    this.route.queryParams.subscribe(params => {
      this.userId = +params['UserId'];
    });


     // Get the user
    this.userService.getUser(this.userId)
      .subscribe(val => {
        this.user = val;
      });

     // Get the user image
    this.getUserImage(this.userId);


     // Init the profile form
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      role: [''],
      isBlocked: [false]
    })

  }

  // Toggle password visibility
  hideShowPass() {
    this.istText = !this.istText;
    this.istText ? this.eyeIcon = "fa-eye" : this.eyeIcon = "fa-eye-slash";
    this.istText ? this.type = "text" : this.type = "password";

  }

  // Navigate to the Admin dashboard
  goToDashBoard() {
    this.router.navigate(['/admin']);
  }


  // Update user data
  updateUserData() {
    let response;
    if (this.profileForm.value != "") {
      this.userService.updateUser(this.user.id, this.profileForm.value)
        .subscribe({
          next: (res) => {
            response = res?.message;
            this.alert.success({ detail: "SUCCESS", summary: res?.message, duration: 5000 })
          },
          error: (err) => {
            this.alert.error({ detail: "ERROR", summary: err?.message, duration: 5000 });
          }
        })
    }

    this.goToDashBoard();

  }

  //  mark  forms fields as dirty
  private validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(f => {
      const control = formGroup.get(f);
      if (control instanceof FormControl) {
        control.markAsDirty({ onlySelf: true });
      }
      else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    })
  }


  // Trigger the file input element
  triggerFileInput(): void {
    this.fileInput.nativeElement.click();

  }

   // update user  img
  onFileSelected(event: Event) {
    this.imgToUpdate = (event.target as HTMLInputElement).files?.[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.userImage = reader.result as string;
    };
    reader.readAsDataURL(this.imgToUpdate);
    if (this.imgToUpdate) {
      this.userService.updatePicture(this.user.id, this.imgToUpdate)
        .subscribe(
          () => {
            this.alert.success({ detail: "SUCCESS", summary: "Picture updated successfully.", duration: 5000 });
            this.userService.getUser(this.userId).subscribe(val => {
              this.user = val;
            });
          },
          error => {
            this.alert.error({ detail: "ERROR", summary: "Failed to update picture.", duration: 5000 });
          }
        );
    }
  }

   // Get the user image
  getUserImage(id: number) {
    this.userService.getUserImage(id)
      .then((imageData: string) => {
        this.userImage = imageData;
      })
      .catch(error => {
        this.userImage = 'https://w7.pngwing.com/pngs/831/88/png-transparent-user-profile-computer-icons-user-interface-mystique-miscellaneous-user-interface-design-smile-thumbnail.png';
      });
  }

}

