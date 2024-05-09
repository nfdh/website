import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup, Validators, FormControl, Form, AbstractControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InstructieRvoMachtigingComponent } from './instructie-rvo-machtiging/instructie-rvo-machtiging.component';

interface SignUpResult {
  success: boolean
}

type MembershipType = 'donateur' | 'stamboeklid' | 'kuddelid' | 'deelnemer-fokbeleid' | 'gezinslid';

type Breed = 'drents-heideschaap' | 'schoonebeeker' | 'both';

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
  breed: FormControl<Breed | null>,
  familyMember: FormControl<string | null>,
  donateurOwnsSheep: FormControl<boolean | null>,
  amount: FormControl<number | null>,
  ubn: FormControl<string | null>,
  rvoRelationNumber: FormControl<string | null>,
  isOrganisation: FormControl<boolean | null>,
  organisationName: FormControl<string | null>,
  organisationAddress: FormControl<string | null>,
  studbooks: FormArray<FormGroup<StudbookForm>>,
  acceptPrivacyStatement: FormControl<boolean | null>,
  sameInvoiceInformation: FormControl<boolean | null>,
  invoiceAddress: FormControl<string | null>,
  invoicePostalCode: FormControl<string | null>,
  invoiceCity: FormControl<string | null>,
  invoiceCode: FormControl<string | null>,
  invoiceEmail: FormControl<string | null>,
}

type Studbook = 'Drents Heideschaap' | 'Schoonebeeker';

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

    breed: new FormControl<Breed | null>(null, [
      Validators.required
    ]),

    familyMember: new FormControl<string>('', [
      Validators.required
    ]),

    donateurOwnsSheep: new FormControl<boolean>(false),

    amount: new FormControl<number>(30.00, [
      Validators.required,
      Validators.min(30)
    ]),

    ubn: new FormControl<string>('', [
      Validators.required,
      Validators.pattern(/^[0-9]{2,7}$/i)
    ]),
    rvoRelationNumber: new FormControl<string>('', [
      Validators.required
    ]),

    isOrganisation: new FormControl<boolean>(false),
    organisationName: new FormControl<string | null>(null, [
      Validators.required
    ]),
    organisationAddress: new FormControl<string | null>(null, [
      Validators.required
    ]),

    studbooks: new FormArray<FormGroup<StudbookForm>>([]),

    acceptPrivacyStatement: new FormControl<boolean>(false, [
      Validators.requiredTrue
    ]),

    invoiceCode: new FormControl<string>(''),
    sameInvoiceInformation: new FormControl<boolean>(true),
    invoiceAddress: new FormControl<string>('', [
      Validators.required
    ]),
    invoicePostalCode: new FormControl<string>('', [
      Validators.required
    ]),
    invoiceCity: new FormControl<string>('', [
      Validators.required
    ]),
    invoiceEmail: new FormControl<string>('', [
      Validators.required,
      Validators.email
    ]),
  });

  errorMessage = '';

  constructor(private route: ActivatedRoute, private httpClient: HttpClient, private router: Router, private dialog: MatDialog) {
    this.formGroup.controls.membershipType.valueChanges.subscribe(typeValue => this.updateFormEnabledState());
    this.formGroup.controls.isOrganisation.valueChanges.subscribe(typeValue => this.updateFormEnabledState());
    this.formGroup.controls.donateurOwnsSheep.valueChanges.subscribe(ownsValue => this.updateFormEnabledState());
    this.formGroup.controls.sameInvoiceInformation.valueChanges.subscribe(sameValue => this.updateFormEnabledState());

    this.formGroup.controls.breed.valueChanges.subscribe(breedValue => {
      if(breedValue == 'both') {
        if(this.formGroup.controls.studbooks.controls.length === 0) {
          this.formGroup.controls.studbooks.push(this.createStudbookFormGroup("Drents Heideschaap"));
          this.formGroup.controls.studbooks.push(this.createStudbookFormGroup("Schoonebeeker"));
        }
        else if(this.formGroup.controls.studbooks.controls.length === 1) {
          if(this.formGroup.controls.studbooks.controls[0].controls.studbook.value === "Drents Heideschaap") {
            this.formGroup.controls.studbooks.push(this.createStudbookFormGroup("Schoonebeeker"));
          }
          else {
            this.formGroup.controls.studbooks.insert(0, this.createStudbookFormGroup("Drents Heideschaap"));
          }
        }
      }
      else {
        const target: Studbook = breedValue === "drents-heideschaap" ? "Drents Heideschaap" : "Schoonebeeker";
        if(this.formGroup.controls.studbooks.controls.length === 0) {
          this.formGroup.controls.studbooks.push(this.createStudbookFormGroup(target));
        }
        else if(this.formGroup.controls.studbooks.controls.length === 2) {
          if(this.formGroup.controls.studbooks.controls[0].controls.studbook.value === target) {
            this.formGroup.controls.studbooks.removeAt(1);
          }
          else {
            this.formGroup.controls.studbooks.removeAt(0);
          }
        }
        else if(this.formGroup.controls.studbooks.controls[0].controls.studbook.value !== target) {
          this.formGroup.controls.studbooks.controls[0].controls.studbook.setValue(target);
        }
      }
    });

    route.queryParamMap.subscribe((params) => {
      const type = params.get("soort");
      if(type !== null && isMembershipType(type)) {
        this.formGroup.controls.membershipType.setValue(type);
      }
    });
  }

  updateFormEnabledState() {
    const membershipType = this.formGroup.controls.membershipType.value;
    
    setEnabledState(this.formGroup.controls.amount, membershipType === "donateur");
    setEnabledState(this.formGroup.controls.ubn, membershipType === "stamboeklid" || membershipType === "kuddelid" || membershipType === "deelnemer-fokbeleid" || (membershipType === "donateur" && this.formGroup.controls.donateurOwnsSheep.value!));
    setEnabledState(this.formGroup.controls.rvoRelationNumber, membershipType === "stamboeklid" || membershipType === "kuddelid" || membershipType === "deelnemer-fokbeleid");
    setEnabledState(this.formGroup.controls.familyMember, membershipType === "gezinslid");
    setEnabledState(this.formGroup.controls.studbooks, membershipType === "stamboeklid" || membershipType === "deelnemer-fokbeleid");
  
    setEnabledState(this.formGroup.controls.organisationName, membershipType !== "gezinslid" && this.formGroup.controls.isOrganisation.value!);
    setEnabledState(this.formGroup.controls.organisationAddress, membershipType !== "gezinslid" && this.formGroup.controls.isOrganisation.value!);

    setEnabledState(this.formGroup.controls.invoiceAddress, !this.formGroup.controls.sameInvoiceInformation.value);
    setEnabledState(this.formGroup.controls.invoicePostalCode, !this.formGroup.controls.sameInvoiceInformation.value);
    setEnabledState(this.formGroup.controls.invoiceCity, !this.formGroup.controls.sameInvoiceInformation.value);
    setEnabledState(this.formGroup.controls.invoiceEmail, !this.formGroup.controls.sameInvoiceInformation.value);
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

  createStudbookFormGroup(studbook: Studbook): FormGroup<StudbookForm> {
    const result = new FormGroup<StudbookForm>({
      studbook: new FormControl<Studbook>(studbook, [
        Validators.required
      ]),
      sheep: new FormArray<FormGroup<SheepForm>>([
        this.createSheepFormGroup()
      ])
    });
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

function setEnabledState(control: AbstractControl, enabled: boolean) {
  if(enabled) control.enable();
  else control.disable();
  control.updateValueAndValidity();
}