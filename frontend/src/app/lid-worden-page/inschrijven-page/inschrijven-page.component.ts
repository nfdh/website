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

type MembershipType = 'donateur' | 'stamboeklid' | 'kuddelid' | 'deelnemer-fokbeleid' | 'gezinslid';

type SheepGender = 'ram' | 'ooi';

type SheepRegisteredStatus = 'yes' | 'no' | 'unknown';

type Gender = 'male' | 'female' | 'other';

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
  gender: FormControl<Gender | null>,
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
  studbooks: FormArray<FormGroup<StudbookForm>>,
  acceptPrivacyStatement: FormControl<boolean | null>
}

type Studbook = 0 | 1;

interface StudbookForm {
  studbook: FormControl<Studbook | null>,
  sheep: FormArray<FormGroup<SheepForm>>
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
    gender: new FormControl<Gender | null>(null, [
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

    studbooks: new FormArray<FormGroup<StudbookForm>>([
      this.createStudbookFormGroup(0)
    ]),

    acceptPrivacyStatement: new FormControl<boolean>(false, [
      Validators.requiredTrue
    ]),
  });

  errorMessage = '';

  constructor(private route: ActivatedRoute, private httpClient: HttpClient, private router: Router, private dialog: MatDialog) {
    this.formGroup.controls.membershipType.valueChanges.subscribe(typeValue => {
      switch(typeValue) {
        case 'donateur':
          this.formGroup.controls.amount.enable();
          this.formGroup.controls.familyMember.disable();
          this.formGroup.controls.ubn.disable();
          this.formGroup.controls.rvoRelationNumber.disable();
          this.formGroup.controls.zwoegerVrij.disable();
          this.formGroup.controls.herdDscription.disable();
          this.formGroup.controls.studbooks.disable();
          break;

      }

      this.formGroup.controls.amount.updateValueAndValidity();
      this.formGroup.controls.familyMember.updateValueAndValidity();
      this.formGroup.controls.ubn.updateValueAndValidity();
      this.formGroup.controls.rvoRelationNumber.updateValueAndValidity();
      this.formGroup.controls.zwoegerVrij.updateValueAndValidity();
      this.formGroup.controls.herdDscription.updateValueAndValidity();
      this.formGroup.controls.studbooks.updateValueAndValidity();
  });

    route.queryParamMap.subscribe((params) => {
      const type = params.get("soort");
      if(type !== null && isMembershipType(type)) {
        this.formGroup.controls.membershipType.setValue(type);
      }
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

  onStudbookChange(index: number, newValue: Studbook | null) {
    if(this.formGroup.controls.studbooks.length === 1) {
      return;
    }
    
    const otherIndex = index === 0 ? 1 : 0;
    const other = this.formGroup.controls.studbooks.controls[otherIndex];
    const otherValue = newValue === 0 ? 1 : 0;
    other.controls.studbook.setValue(otherValue, {
      emitEvent: false
    });
  }

  createStudbookFormGroup(i: number): FormGroup<StudbookForm> {
    const result = new FormGroup<StudbookForm>({
      studbook: new FormControl<Studbook | null>(null, [
        Validators.required
      ]),
      sheep: new FormArray<FormGroup<SheepForm>>([
        this.createSheepFormGroup()
      ])
    });
    
    result.controls.studbook.valueChanges.subscribe((n) => this.onStudbookChange(i, n));

    return result;
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

  deleteStudbook(studbook: number) {
    this.formGroup.controls.studbooks.removeAt(studbook);
  }

  addStudbook() {
    const group = this.createStudbookFormGroup(1);

    const firstGroup = this.formGroup.controls.studbooks.controls[0];
    if(firstGroup.controls.studbook.value === 0) {
      group.controls.studbook.setValue(1);
    }
    else if(firstGroup.controls.studbook.value === 1) {
      group.controls.studbook.setValue(0);
    }

    this.formGroup.controls.studbooks.push(group);
  }

  deleteSheep(studbook: number, idx: number) {
    this.formGroup.controls.studbooks.controls[studbook].controls.sheep.removeAt(idx);
  }

  addSheep(studbook: number) {
    this.formGroup.controls.studbooks.controls[studbook].controls.sheep.push(this.createSheepFormGroup());
  }
}

function isMembershipType(value: string): value is MembershipType {
  return value === 'donateur' 
    || value == 'stamboeklid' 
    || value === 'kuddelid'
    || value === 'deelnemer-fokbeleid'
    || value === 'gezinslid';
}