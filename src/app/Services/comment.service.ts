import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private baseUrl: string = "https://localhost:7145/Comment";
  constructor(private http: HttpClient, private router: Router) { }



  CreateComment(comment : Comment , id : number){
    return this.http.post<Comment>(`${this.baseUrl}/c/${id}`, comment);
  }

}
