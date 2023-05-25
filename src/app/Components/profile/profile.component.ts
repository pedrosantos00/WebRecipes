import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { User } from 'src/app/Models/User';
import { AuthService } from 'src/app/Services/auth.service';
import { UserStoreService } from 'src/app/Services/user-store.service';
import { UserService } from 'src/app/Services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  editFlag!: boolean;
  profileForm!: FormGroup;
  istText: boolean = false;
  eyeIcon: string = "fa-eye-slash";
  type: string = "password";
  user: User = new User();
  id!: number;
  userImage!: string;
  imgToUpdate!: any;

  constructor(private fb: FormBuilder, private auth: AuthService, private alert: NgToastService, private tokenInfo: UserStoreService, private userService: UserService, private router: Router) {

  }

  ngOnInit(): void {
    this.id = this.getUser();
    // Initialize the profileForm FormGroup
    this.profileForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      email: [''],
      password: ['']

    })

     // get user data
    this.userService.getUser(this.id)
      .subscribe(val => {
        this.user = val;
        this.convertImg(this.user);
      })
  }


  // Convert the user's profile picture to base64 format for display
  convertImg(user: User) {
    if(this.user.profilePicture !=null) {
      this.userImage = this.convertDataToBase64(user.profilePicture);
    }
    else {
      this.userImage = "https://w7.pngwing.com/pngs/831/88/png-transparent-user-profile-computer-icons-user-interface-mystique-miscellaneous-user-interface-design-smile-thumbnail.png";
    }

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



  getUser() {
    let id = 0;
    this.tokenInfo.getId()
      .subscribe(val => {
        let idFromToken = this.auth.getIdFromToken();
        id = val || idFromToken
      })
    return id;
  }

  // Update user data with the provided form values
  updateUserData() {
    let response;
    if (this.profileForm.value != "") {
      this.userService.updateUser(this.user.id, this.profileForm.value)
        .subscribe({
          next: (res) => {
            response = res?.message;
            this.alert.success({ detail: "SUCCESS", summary: res?.message, duration: 5000 })
            this.userService.getUser(this.id)
              .subscribe(val => {
                this.user = val;
                this.edit();
                this.getUser();
              })

          },
          error: (err) => {
            this.alert.error({ detail: "ERROR", summary: err?.message, duration: 5000 });
            this.edit();
          }
        })
    }
  }

  // Trigger the file input element to open the file selection
  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

    // Update the user's profile picture with the selected image
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
            this.userService.getUser(this.id).subscribe(val => {
              this.user = val;
            });
          },
          error => {
            this.alert.error({ detail: "ERROR", summary: "Failed to update picture.", duration: 5000 });
          }
        );
    }
  }


// Toggle the editFlag to enable/disable form editing
  edit() {
    this.editFlag = !this.editFlag;
  }

  // Toggle the password visibility
  hideShowPass() {
    this.istText = !this.istText;
    this.istText ? this.eyeIcon = "fa-eye" : this.eyeIcon = "fa-eye-slash";
    this.istText ? this.type = "text" : this.type = "password";

  }
}
