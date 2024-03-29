import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService, User } from 'src/app/services/authentication.service';

let lastEmail: string | null = null;
let lastPassword: string | null = null;

export function setLastInfo($email: string, $password: string) {
  lastEmail = $email;
  lastPassword = $password;
}

interface NewPasswordForm {
  wachtwoord1: FormControl<string | null>,
  wachtwoord2: FormControl<string | null>
}

@Component({
  selector: 'app-new-password-page',
  templateUrl: './new-password-page.component.html',
  styleUrls: ['./new-password-page.component.scss']
})
export class NewPasswordPageComponent implements OnInit {
  isBusy: boolean = false;
  errorMessage: string | null = null;
  passwordsNotEqual: boolean = false;

  formGroup = new FormGroup<NewPasswordForm>({
    wachtwoord1: new FormControl<string>('', [
      Validators.required
    ]),
    wachtwoord2: new FormControl<string>('', [
      Validators.required,
    ])
  });

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit(): void {
  }

  onSubmit(ev: Event) {
    ev.preventDefault();

    if(!this.formGroup.valid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    if(this.formGroup.controls.wachtwoord1.value !== this.formGroup.controls.wachtwoord2.value) {
      this.passwordsNotEqual = true;
      return;
    }
    else {
      this.passwordsNotEqual = false;
    }

    this.isBusy = true;
    this.errorMessage = null;

    const values = {
      email: lastEmail,
      password: lastPassword,
      new_password: this.formGroup.controls.wachtwoord1.value
    };
    
    this.httpClient.post<User | boolean>("/api/login", values)
      .subscribe((result) => {
        if(typeof result === "object") {
          this.authenticationService.notifyLogin(result as User);

          this.router.navigate([this.router.routerState.snapshot.root.queryParams.returnUrl || "/ledenportaal"]);
        }
        else {
          this.isBusy = false;
          this.errorMessage = "Er is een fout opgetreden tijdens het inloggen, probeer het later opnieuw.";
        }
      }, (error) => {
        this.isBusy = false;
        this.errorMessage = "Er is een fout opgetreden tijdens het inloggen, probeer het later opnieuw.";
      });
  }
}