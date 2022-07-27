import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormControl, UntypedFormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { AppTitleService } from 'src/app/services/app-title.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
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

  hasHeideschaap$ = this.authenticationService.user$.pipe(map(u => u?.studbook_heideschaap));
  hasSchoonebeeker$ = this.authenticationService.user$.pipe(map(u => u?.studbook_schoonebeeker));

  singleStudbook$ = this.authenticationService.user$.pipe(map(u => !u?.studbook_heideschaap || !u.studbook_schoonebeeker));

  constructor(
    private router: Router, 
    private route: ActivatedRoute, 
    private httpClient: HttpClient, 
    private snackBar: MatSnackBar,
    titleService: AppTitleService,
    private authenticationService: AuthenticationService
  ) { 
    this.authenticationService.user$.subscribe(u => {
      if(u) {
        this.formGroup.controls.name.setValue(u.selection_name);

        if(u.studbook_heideschaap && !u.studbook_schoonebeeker) {
          this.formGroup.controls.studbook.setValue('0');
        }
        else if(u.studbook_schoonebeeker && !u.studbook_heideschaap) {
          this.formGroup.controls.studbook.setValue('1');
        }
      }
    });

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

export function createFormGroup(): UntypedFormGroup {
  let group: UntypedFormGroup | null = null;
  group = new UntypedFormGroup({
    name: new UntypedFormControl('', [
      Validators.required
    ]),
    studbook: new UntypedFormControl('', [
      Validators.required
    ]),
    region: new UntypedFormControl('', [
      Validators.required
    ]),
    location: new UntypedFormControl(''),
    preferred_date: new UntypedFormControl('', [
      validatorIf(() => group?.get("region")?.value !== -1,  Validators.required)
    ]),

    rams_first: new UntypedFormControl('', [
      Validators.required
    ]),
    rams_second: new UntypedFormControl('', [
      Validators.required
    ]),
    ewes: new UntypedFormControl('', [
      Validators.required
    ]),
    num_locations: new UntypedFormControl(1),
    on_paper: new UntypedFormControl(false),

    remarks: new UntypedFormControl('')
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