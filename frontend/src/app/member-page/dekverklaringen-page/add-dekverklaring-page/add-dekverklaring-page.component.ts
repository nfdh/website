import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, defer } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AppTitleService } from 'src/app/services/app-title.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

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

  hasKuddeOvereenkomst$ = combineLatest([
    defer(() => this.formGroup.controls.studbook.valueChanges.pipe(startWith(this.formGroup.controls.studbook.value))),
    this.authenticationService.user$
  ]).pipe(
    map(([studbook, user]) => {
      switch(studbook) {
        case '0': return user?.studbook_heideschaap_ko;
        case '1': return user?.studbook_schoonebeeker_ko;
        default: return false;
      }
    })
  );

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

    this.hasKuddeOvereenkomst$.subscribe(ko => {
      if(ko) {
        this.formGroup.controls.kovo.enable();
        this.formGroup.controls.koe.enable();
        this.formGroup.controls.kool.enable();
        this.formGroup.controls.korl.enable();
      }
      else {
        this.formGroup.controls.kovo.disable();
        this.formGroup.controls.koe.disable();
        this.formGroup.controls.kool.disable();
        this.formGroup.controls.korl.disable();
      }
    });

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
  const currentYear = new Date().getFullYear();

  return new FormGroup({
    season: new FormControl(currentYear.toString(), [
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