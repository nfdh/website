import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AppTitleService } from 'src/app/services/app-title.service';

interface AddResult {
  success: boolean,
  id?: number,
  reason?: "UNKNOWN"
}

@Component({
  selector: 'app-add-dekverklaring-page',
  templateUrl: './add-dekverklaring-page.component.html',
  styleUrls: ['./add-dekverklaring-page.component.scss']
})
export class AddDekverklaringPageComponent {
  formGroup = createFormGroup()

  errorMessage = '';

  constructor(
    private router: Router, 
    private route: ActivatedRoute, 
    private httpClient: HttpClient, 
    private snackBar: MatSnackBar,
    titleService: AppTitleService
  ) { 

    titleService.setTitle("Nieuwe dekverklaring indienen - Ledenportaal");
  }

  onSubmit() {
    if(!this.formGroup.valid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    this.httpClient.post<AddResult>("/api/dekverklaringen", this.formGroup.value)
      .subscribe((result) => {
        if(result.success) {
          this.router.navigate([".."], { relativeTo: this.route });
          this.snackBar.open("Dekverklaring is verzonden", "Openen", {
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

  seasonOffset(offset: number) {
    const filledIn = this.formGroup.controls.season.value;
    const seasonNumber = parseInt(filledIn, 10);
    if(isNaN(seasonNumber)) {
      return '?';
    }
    else {
      return seasonNumber + offset;
    }
  }

  dekgroepen() {
    return this.formGroup.controls.dekgroepen as FormArray;
  }

  dekgroepenFormGroups() {
    return this.dekgroepen().controls as FormGroup[];
  }

  addDekgroep() {
    this.dekgroepen().push(createDekgroepFormGroup());
  }

  rammen(dekgroep: number) {
    return this.dekgroepen().controls[dekgroep].get("rammen") as FormArray;
  }

  addRam(dekgroep: number) {
    this.rammen(dekgroep).push(createRamFormControl());
  }

  removeRam(dekgroep: number, ram: number) {
    const rammen = this.rammen(dekgroep);
    if(rammen.length === 1) {
      this.dekgroepen().removeAt(dekgroep);
    }
    else {
      rammen.removeAt(ram);
    }
  }
}

export function createFormGroup(): FormGroup {
  return new FormGroup({
    season: new FormControl('', [
      Validators.required
    ]),
    name: new FormControl('', [
      Validators.required
    ]),

    studbook: new FormControl('', [
      Validators.required
    ]),

    kovo: new FormControl('', [
      Validators.required
    ]),
    koe: new FormControl('', [
      Validators.required
    ]),
    kool: new FormControl('', [
      Validators.required
    ]),
    korl: new FormControl('', [
      Validators.required
    ]),

    dekgroepen: new FormArray([
      createDekgroepFormGroup()
    ]),

    remarks: new FormControl('')
  });
}

export function createDekgroepFormGroup() {
  return new FormGroup({
    ewe_count: new FormControl('', [
      Validators.required
    ]),
    rammen: new FormArray([
      createRamFormControl()
    ])
  });
}

export function createRamFormControl() {
  return new FormControl('', [
    Validators.required,
    Validators.pattern(/^0|[0-9]{12}$/g)
  ])
}