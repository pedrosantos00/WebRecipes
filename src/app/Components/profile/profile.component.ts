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
    this.profileForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      email: [''],
      password: ['']
    })

    this.userService.getUser(this.id)
      .subscribe(val => {
        this.user = val;
      })

    this.getUserImage(this.id);
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

  getUserImage(id: number) {
    this.userService.getUserImage(id)
      .then((imageData: string) => {
        this.userImage = imageData;
      })
      .catch(error => {
        this.userImage = 'https://w7.pngwing.com/pngs/831/88/png-transparent-user-profile-computer-icons-user-interface-mystique-miscellaneous-user-interface-design-smile-thumbnail.png';
      });
  }


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
              })

          },
          error: (err) => {
            this.alert.error({ detail: "ERROR", summary: err?.message, duration: 5000 });
          }
        })

      this.edit();
      window.location.reload();
    }
  }


  triggerFileInput(): void {
    this.fileInput.nativeElement.click();

  }

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



  edit() {
    this.editFlag = !this.editFlag;
  }

  hideShowPass() {
    this.istText = !this.istText;
    this.istText ? this.eyeIcon = "fa-eye" : this.eyeIcon = "fa-eye-slash";
    this.istText ? this.type = "text" : this.type = "password";

  }
}
