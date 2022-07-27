import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthenticationService, User } from '../services/authentication.service';
import { Router } from '@angular/router';
import { AppTitleService } from '../services/app-title.service';
import { setLastInfo } from './new-password-page/new-password-page.component';

interface LoginForm {
  email: FormControl<string | null>,
  password: FormControl<string | null>
}

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent {
  loginForm = new FormGroup<LoginForm>({
    email: new FormControl<string>('', [
      Validators.required
    ]),
    password: new FormControl<string>('', [
      Validators.required
    ])
  });

  isBusy: boolean = false;
  errorMessage: string | null = null;

  constructor(private httpClient: HttpClient, private authenticationService: AuthenticationService, private router: Router, titleService: AppTitleService) { 
    titleService.setTitle("Inloggen");
  }

  onSubmit() {
    this.errorMessage = null;

    if(!this.loginForm.valid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isBusy = true;

    this.httpClient.post<User | boolean | "reset_password_on_login">("/api/login", this.loginForm.value)
      .subscribe((result) => {
        if(typeof result === "object") {
          this.authenticationService.notifyLogin(result as User);

          this.router.navigate([this.router.routerState.snapshot.root.queryParams.returnUrl || "/ledenportaal"]);
        }
        else if(result === "reset_password_on_login") {
          setLastInfo(this.loginForm.controls.email.value!, this.loginForm.controls.password.value!);
          this.router.navigate(["/login/nieuw-wachtwoord"]);
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
