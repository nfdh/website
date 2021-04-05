import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';
import { AuthenticationService, User } from '../services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent {
  loginForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  });

  isBusy: boolean = false;
  errorMessage: string | null = null;

  constructor(private httpClient: HttpClient, private authenticationService: AuthenticationService, private router: Router) { }

  onSubmit() {
    this.isBusy = true;
    this.errorMessage = null;

    this.httpClient.post<User | boolean>("/api/login", this.loginForm.value)
      .subscribe((result) => {
        if(result) {
          this.authenticationService.notifyLogin(result as User);

          this.router.navigate([this.router.routerState.snapshot.root.queryParams.returnUrl || "/ledenportaal"]);
        }
        else {
          this.isBusy = false;
          this.errorMessage = "De combinatie van e-mailadres en wachtwoord is onjuist";
        }
      }, (error) => {
        this.isBusy = false;
        this.errorMessage = "Er is een fout opgetreden tijdens het inloggen, probeer het later opnieuw.";
      });
  }
}
