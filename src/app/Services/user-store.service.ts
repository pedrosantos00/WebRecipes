import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserStoreService {

  private email$ = new BehaviorSubject<string>("");
  private role$ = new BehaviorSubject<string>("");
  private id$ = new BehaviorSubject<number>(0);

  constructor() { }

  public getRole(){
    return this.role$.asObservable();
  }

  public setRole(role:string){
    this.role$.next(role);
  }

  public setId(id:number){
    this.id$.next(id);
  }

  public getFullName(){
    return this.email$.asObservable();
  }

  public setFullName(email:string){
    this.email$.next(email);
  }

  public getId(){
    return this.id$.asObservable();
  }

}
