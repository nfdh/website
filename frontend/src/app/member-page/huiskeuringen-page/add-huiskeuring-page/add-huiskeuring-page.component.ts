import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AppTitleService } from 'src/app/services/app-title.service';
import availableDates from "../dates";

interface AddResult {
  success: boolean,
  id?: number,
  reason?: "UNKNOWN"
}

@Component({
  selector: 'app-add-huiskeuring-page',
  templateUrl: './add-huiskeuring-page.component.html',
  styleUrls: ['./add-huiskeuring-page.component.scss']
})
export class AddHuiskeuringPageComponent {
  formGroup = createFormGroup()

  errorMessage = '';

  constructor(
    private router: Router, 
    private route: ActivatedRoute, 
    private httpClient: HttpClient, 
    private snackBar: MatSnackBar,
    titleService: AppTitleService
  ) { 

    titleService.setTitle("Inschrijven voor huiskeuring - Ledenportaal");
  }

  onSubmit() {
    if(!this.formGroup.valid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    this.httpClient.post<AddResult>("/api/huiskeuringen", this.formGroup.value)
      .subscribe((result) => {
        if(result.success) {
          this.router.navigate([".."], { relativeTo: this.route });
          this.snackBar.open("Aanmelding voor huiskeuring is verzonden", "Openen", {
            duration: 5000
          })
            .onAction()
            .subscribe(() => {
              this.router.navigate(["..", result.id], { relativeTo: this.route })
            });
        }
        else {
          this.errorMessage = "Er is een fout opgetreden bij het versturen, probeer het later opnieuw.";
        }
      }, (e) => {
        this.errorMessage = "Er is een fout opgetreden bij het versturen, probeer het later opnieuw.";
      });
  }

  onRegionChange() {
    this.formGroup.controls.preferred_date.setValue('');
  }

  availableDatesForRegion(region: number) {
    return availableDates[region];
  }
}

export function createFormGroup(): FormGroup {
  let group: FormGroup | null = null;
  group = new FormGroup({
    name: new FormControl('', [
      Validators.required
    ]),
    studbook: new FormControl('', [
      Validators.required
    ]),
    region: new FormControl('', [
      Validators.required
    ]),
    location: new FormControl(''),
    preferred_date: new FormControl('', [
      validatorIf(() => group?.get("region")?.value !== -1,  Validators.required)
    ]),

    rams_first: new FormControl('', [
      Validators.required
    ]),
    rams_second: new FormControl('', [
      Validators.required
    ]),
    ewes: new FormControl('', [
      Validators.required
    ]),
    num_locations: new FormControl(1),
    on_paper: new FormControl(false),

    remarks: new FormControl('')
  });
  return group;
}

function validatorIf(predicate: () => boolean, validator: ValidatorFn) {
  return function(formControl: AbstractControl) {
    if (predicate()) {
      return validator(formControl); 
    }
    return null;
  };
}