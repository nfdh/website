import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService, User } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-opnieuw-instellen-page',
  templateUrl: './opnieuw-instellen-page.component.html',
  styleUrls: ['./opnieuw-instellen-page.component.scss']
})
export class OpnieuwInstellenPageComponent implements OnInit {
  isBusy: boolean = false;
  errorMessage: string | null = null;
  
  formGroup = new FormGroup({
    wachtwoord1: new FormControl('', [
      Validators.required
    ]),
    wachtwoord2: new FormControl('', [
      Validators.required,
    ])
  }, [
    passwordsAreEqual
  ]);

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

    this.isBusy = true;
    this.errorMessage = null;

    const token = this.activatedRoute.snapshot.queryParamMap.get("code");

    this.httpClient.post<User | boolean>("/api/reset-password", { token: token, new_password: this.formGroup.controls.wachtwoord1.value })
      .subscribe((result) => {
        this.authenticationService.notifyLogin(result as User);
        this.router.navigate(["/ledenportaal"]);
      }, (error) => {
        this.isBusy = false;
        this.errorMessage = "Er is een fout opgetreden, probeer het later opnieuw.";
      });
  }
}

function passwordsAreEqual(control: AbstractControl): ValidationErrors | null {
  const group = control as FormGroup;
  if(group.controls.wachtwoord1.value !== group.controls.wachtwoord2.value) {
    return {
      "passwordsAreEqual": true
    };
  }

  return null;
}