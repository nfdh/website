import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
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

type StudbookValue = '0' | '1';
type RegionValue = -1 | 0 | 1 | 2 | 3;

interface HuiskeuringForm {
  name: FormControl<string | null>,
  studbook: FormControl<StudbookValue | null>,
  region: FormControl<RegionValue | null>,
  location: FormControl<string | null>,
  preferred_date: FormControl<string | null>,

  rams_first: FormControl<string | null>,
  rams_second: FormControl<string | null>,
  ewes: FormControl<string | null>,
  num_locations: FormControl<string | null>,
  on_paper: FormControl<boolean | null>,

  remarks: FormControl<string | null>
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

export function createFormGroup(): FormGroup<HuiskeuringForm> {
  let group: FormGroup<HuiskeuringForm> | null = null;
  group = new FormGroup<HuiskeuringForm>({
    name: new FormControl<string>('', [
      Validators.required
    ]),
    studbook: new FormControl<StudbookValue | null>(null, [
      Validators.required
    ]),
    region: new FormControl<RegionValue | null>(null, [
      Validators.required
    ]),
    location: new FormControl<string>(''),
    preferred_date: new FormControl<string>('', [
      validatorIf(() => group?.controls.region.value !== -1,  Validators.required)
    ]),

    rams_first: new FormControl<string>('', [
      Validators.required
    ]),
    rams_second: new FormControl<string>('', [
      Validators.required
    ]),
    ewes: new FormControl<string>('', [
      Validators.required
    ]),
    num_locations: new FormControl<string>('1'),
    on_paper: new FormControl<boolean>(false),

    remarks: new FormControl<string>('')
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