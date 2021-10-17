import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface User {
  email: string,
  name: string,
  role_website_contributor: boolean,
  role_member_administrator: boolean,
  role_studbook_administrator: boolean,
  role_studbook_inspector: boolean
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private userSubject$ = new BehaviorSubject<User | null>(null);
  public user$ = this.userSubject$.asObservable()

  constructor() {
    const user = sessionStorage.getItem("user");
    if(user) {
      this.userSubject$.next(JSON.parse(user) as User);
    }
  }

  notifyLogin(user: User) {
    this.userSubject$.next(user);
    sessionStorage.setItem("user", JSON.stringify(user));
  }

  notifyLogout() {
    this.userSubject$.next(null);
    sessionStorage.removeItem("user");
  }
}
