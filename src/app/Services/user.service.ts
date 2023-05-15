import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../Models/User';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UserService {


  private baseUrl: string = "https://localhost:7145/User";
  constructor(private http: HttpClient, private router: Router) { }


  getUser(id? : number ) : Observable<User> {

    if(id == null || id == undefined) {
      return this.http.get<User>(`${this.baseUrl}`)
    }
    else{
      return this.http.get<User>(`${this.baseUrl}/${id}`)
    }

  }




  updateUser(id : number , userObj :  any){
    return this.http.put<any>(`${this.baseUrl}?id=${id}`,userObj)
  }

  remove(id : number){
    console.log(id)
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }



// PICTURES METHODS

  updatePicture(id: number, picture: File) {
    const formData = new FormData();
    formData.append('imageData', picture);
    return this.http.put<any>(`${this.baseUrl}/img=${id}`, formData);
  }

  getUserImage(id: number): Promise<string> {
    return this.http.get(`${this.baseUrl}/img=${id}`, { responseType: 'blob' })
      .toPromise()
      .then((blob: Blob | undefined) => {
        if (blob) {
          return this.blobToBase64(blob);
        } else {
          throw new Error('Failed to fetch user image.');
        }
      });
  }

  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
}
