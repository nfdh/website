import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-wachtwoord-vergeten-page',
  templateUrl: './wachtwoord-vergeten-page.component.html',
  styleUrls: ['./wachtwoord-vergeten-page.component.scss']
})
export class WachtwoordVergetenPageComponent implements OnInit {
  isBusy: boolean = false;
  errorMessage: string | null = null;

  resetForm = new UntypedFormGroup({
    email: new UntypedFormControl('', [
      Validators.required,
      Validators.email
    ])
  });

  constructor(
    private activatedRoute: ActivatedRoute,
    private httpClient: HttpClient,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.activatedRoute.queryParamMap.subscribe(params => {
      this.resetForm.controls.email.setValue(params.get("email"));
    });
  }

  onSubmit() {
    if(!this.resetForm.valid) {
      this.resetForm.markAllAsTouched();
      return;
    }

    this.isBusy = true;
    this.errorMessage = null;

    this.httpClient.post<void>("/api/request-password-reset", this.resetForm.value)
      .subscribe((_) => {
        this.router.navigate(["/wachtwoord-vergeten/verzonden"]);
      }, (error) => {
        this.isBusy = false;
        this.errorMessage = "Er is een fout opgetreden, probeer het later opnieuw.";
      });
  }
}
