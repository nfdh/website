import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup, Validators, FormControl, Form } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InstructieRvoMachtigingComponent } from './instructie-rvo-machtiging/instructie-rvo-machtiging.component';

interface SignUpResult {
  success: boolean
}

type MembershipType = 0 | 1 | 2 | 3 | 4;

type SheepGender = 0 | 1;

type SheepRegisteredStatus = 0 | 1 | 2;

interface SheepForm {
  gender: FormControl<SheepGender | null>,
  number: FormControl<string | null>,
  birthdate: FormControl<string | null>,
  dateOfPurchase: FormControl<string | null>,
  ubnOfSeller: FormControl<string | null>,
  registeredInStudbook: FormControl<SheepRegisteredStatus | null>
}

interface SignUpForm {
  fullName: FormControl<string | null>,
  firstName: FormControl<string | null>,
  address: FormControl<string | null>,
  postalCode: FormControl<string | null>,
  city: FormControl<string | null>,
  email: FormControl<string | null>,
  phoneNumber: FormControl<string | null>,
  membershipType: FormControl<MembershipType | null>,
  familyMember: FormControl<string | null>,
  amount: FormControl<number | null>,
  ubn: FormControl<string | null>,
  rvoRelationNumber: FormControl<string | null>,
  zwoegerVrij: FormControl<boolean | null>,
  herdDscription: FormControl<string | null>
  sheep: FormArray<FormGroup<SheepForm>>,
  acceptPrivacyStatement: FormControl<boolean | null>
}

@Component({
  selector: 'app-inschrijven-page',
  templateUrl: './inschrijven-page.component.html',
  styleUrls: ['./inschrijven-page.component.scss']
})
export class InschrijvenPageComponent implements OnInit {
  formGroup = new FormGroup<SignUpForm>({
    fullName: new FormControl<string>('', [
      Validators.required
    ]),
    firstName: new FormControl<string>('', [
      Validators.required
    ]),
    address: new FormControl<string>('', [
      Validators.required
    ]),
    postalCode: new FormControl<string>('', [
      Validators.required
    ]),
    city: new FormControl<string>('', [
      Validators.required
    ]),

    email: new FormControl<string>('', [
      Validators.required,
      Validators.email
    ]),
    phoneNumber: new FormControl<string>('', [
      Validators.required,
      Validators.pattern(/^[0-9 \-\(\)]+$/i)
    ]),
    membershipType: new FormControl<MembershipType | null>(null, [
      Validators.required
    ]),

    familyMember: new FormControl<string>('', [
      Validators.required
    ]),

    amount: new FormControl<number>(25.00, [
      Validators.required,
      Validators.min(25)
    ]),

    ubn: new FormControl<string>('', [
      Validators.required,
      Validators.pattern(/^[0-9]{2,7}$/i)
    ]),
    rvoRelationNumber: new FormControl<string>('', [
      Validators.required
    ]),
    zwoegerVrij: new FormControl<boolean>(false, [
      Validators.required
    ]),
    herdDscription: new FormControl<string>('', [
      Validators.required
    ]),

    sheep: new FormArray<FormGroup<SheepForm>>([
      this.createSheepFormGroup()
    ]),

    acceptPrivacyStatement: new FormControl<boolean>(false, [
      Validators.requiredTrue
    ]),
  });

  errorMessage = '';

  constructor(private route: ActivatedRoute, private httpClient: HttpClient, private router: Router, private dialog: MatDialog) {
    this.formGroup.controls.membershipType.valueChanges.subscribe(typeValue => {
      switch(typeValue) {
        // Donateur
        case 0:
          this.formGroup.controls.amount.enable();
          this.formGroup.controls.familyMember.disable();
          this.formGroup.controls.ubn.disable();
          this.formGroup.controls.rvoRelationNumber.disable();
          this.formGroup.controls.zwoegerVrij.disable();
          this.formGroup.controls.herdDscription.disable();
          this.formGroup.controls.sheep.disable();
          break;

        // Basislidmaatschap
        case 1:
          this.formGroup.controls.amount.disable();
          this.formGroup.controls.familyMember.disable();
          this.formGroup.controls.ubn.disable();
          this.formGroup.controls.rvoRelationNumber.disable();
          this.formGroup.controls.zwoegerVrij.disable();
          this.formGroup.controls.herdDscription.disable();
          this.formGroup.controls.sheep.disable();
          break;

        // Stamboeklidmaatschap
        case 2:
          this.formGroup.controls.amount.disable();
          this.formGroup.controls.familyMember.disable();
          this.formGroup.controls.ubn.enable();
          this.formGroup.controls.rvoRelationNumber.enable();
          this.formGroup.controls.zwoegerVrij.disable();
          this.formGroup.controls.herdDscription.disable();
          this.formGroup.controls.sheep.enable();
          break;

        // Kudde
        case 3:
          this.formGroup.controls.amount.disable();
          this.formGroup.controls.familyMember.disable();
          this.formGroup.controls.ubn.enable();
          this.formGroup.controls.rvoRelationNumber.enable();
          this.formGroup.controls.zwoegerVrij.enable();
          this.formGroup.controls.herdDscription.enable();
          this.formGroup.controls.sheep.disable();
          break;

        // Gezinslidmaatschap
        case 4:
          this.formGroup.controls.amount.disable();
          this.formGroup.controls.familyMember.enable();
          this.formGroup.controls.ubn.disable();
          this.formGroup.controls.rvoRelationNumber.disable();
          this.formGroup.controls.zwoegerVrij.disable();
          this.formGroup.controls.herdDscription.disable();
          this.formGroup.controls.sheep.disable();
          break;
      }

      this.formGroup.controls.amount.updateValueAndValidity();
      this.formGroup.controls.familyMember.updateValueAndValidity();
      this.formGroup.controls.ubn.updateValueAndValidity();
      this.formGroup.controls.rvoRelationNumber.updateValueAndValidity();
      this.formGroup.controls.zwoegerVrij.updateValueAndValidity();
      this.formGroup.controls.herdDscription.updateValueAndValidity();
      this.formGroup.controls.sheep.updateValueAndValidity();
  });

    route.queryParamMap.subscribe((params) => {
      const type = params.get("soort");
      let typeValue: MembershipType;
      switch(type) {
        case 'donateur': typeValue = 0; break;
        case 'basislidmaatschap': typeValue = 1; break;
        case 'stamboeklidmaatschap': typeValue = 2; break;
        case 'kudde': typeValue = 3; break;
        case 'gezinslidmaatschap': typeValue = 4; break;
        default: return;
      }
      this.formGroup.controls.membershipType.setValue(typeValue);
    });
  }

  openRvoInstructions(e: MouseEvent) {
    e.preventDefault();

    this.dialog.open(InstructieRvoMachtigingComponent, {
      width: '1000px'
    });
  }

  onSubmit() {
    this.errorMessage = '';

    if(!this.formGroup.valid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    this.httpClient.post<SignUpResult>("/api/signup", this.formGroup.value)
      .subscribe((result) => {
        if(result.success) {
          this.router.navigate(["./verzonden"], { relativeTo: this.route });
        }
        else {
          this.errorMessage = "Er is een fout opgetreden bij het versturen, probeer het later opnieuw.";
        }
      }, (e) => {
        this.errorMessage = "Er is een fout opgetreden bij het versturen, probeer het later opnieuw.";
      });
  }

  ngOnInit(): void {
  }

  createSheepFormGroup(): FormGroup<SheepForm> {
    return new FormGroup<SheepForm>({
      gender: new FormControl<SheepGender | null>(null, [
        Validators.required
      ]),
      number: new FormControl<string>('', [
        Validators.required,
        Validators.pattern(/^[0-9]{12}$/i)
      ]),
      birthdate: new FormControl<string | null>(null, [
        Validators.required
      ]),
      dateOfPurchase: new FormControl<string | null>(null),
      ubnOfSeller: new FormControl<string | null>(null),
      registeredInStudbook: new FormControl<SheepRegisteredStatus | null>(null, [
        Validators.required
      ])
    });
  }

  deleteSheep(idx: number) {
    this.formGroup.controls.sheep.removeAt(idx);
  }

  addSheep() {
    this.formGroup.controls.sheep.push(this.createSheepFormGroup());
  }
}