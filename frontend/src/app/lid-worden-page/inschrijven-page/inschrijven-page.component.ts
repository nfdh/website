import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';

interface SignUpResult {
  success: boolean
}

@Component({
  selector: 'app-inschrijven-page',
  templateUrl: './inschrijven-page.component.html',
  styleUrls: ['./inschrijven-page.component.scss']
})
export class InschrijvenPageComponent implements OnInit {
  formGroup = new FormGroup({
    fullName: new FormControl('', [
      Validators.required
    ]),
    firstName: new FormControl('', [
      Validators.required
    ]),
    address: new FormControl('', [
      Validators.required
    ]),
    postalCode: new FormControl('', [
      Validators.required
    ]),
    city: new FormControl('', [
      Validators.required
    ]),

    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    phoneNumber: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[0-9 \-\(\)]+$/i)
    ]),
    membershipType: new FormControl(undefined, [
      Validators.required
    ]),

    familyMember: new FormControl('', [
      Validators.required
    ]),

    amount: new FormControl(25.00, [
      Validators.required,
      Validators.min(25)
    ]),

    ubn: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[0-9]{2,7}$/i)
    ]),
    zwoegerVrij: new FormControl(undefined, [
      Validators.required
    ]),
    herdDscription: new FormControl('', [
      Validators.required
    ]),

    sheep: new FormArray([
      this.createSheepFormGroup()
    ]),

    acceptPrivacyStatement: new FormControl(false, [
      Validators.requiredTrue
    ]),
  });

  errorMessage = '';

  constructor(private route: ActivatedRoute, private httpClient: HttpClient, private router: Router) {
    this.formGroup.get('membershipType')!.valueChanges.subscribe(typeValue => {
      switch(typeValue) {
        // Donateur
        case 0:
          this.formGroup.get('amount')!.enable();
          this.formGroup.get('familyMember')!.disable();
          this.formGroup.get('ubn')!.disable();
          this.formGroup.get('zwoegerVrij')!.disable();
          this.formGroup.get('herdDscription')!.disable();
          this.formGroup.get('sheep')!.disable();
          break;

        // Basislidmaatschap
        case 1:
          this.formGroup.get('amount')!.disable();
          this.formGroup.get('familyMember')!.disable();
          this.formGroup.get('ubn')!.disable();
          this.formGroup.get('zwoegerVrij')!.disable();
          this.formGroup.get('herdDscription')!.disable();
          this.formGroup.get('sheep')!.disable();
          break;

        // Stamboeklidmaatschap
        case 2:
          this.formGroup.get('amount')!.disable();
          this.formGroup.get('familyMember')!.disable();
          this.formGroup.get('ubn')!.enable();
          this.formGroup.get('zwoegerVrij')!.disable();
          this.formGroup.get('herdDscription')!.disable();
          this.formGroup.get('sheep')!.enable();
          break;

        // Kudde
        case 3:
          this.formGroup.get('amount')!.disable();
          this.formGroup.get('familyMember')!.disable();
          this.formGroup.get('ubn')!.enable();
          this.formGroup.get('zwoegerVrij')!.enable();
          this.formGroup.get('herdDscription')!.enable();
          this.formGroup.get('sheep')!.disable();
          break;

        // Gezinslidmaatschap
        case 4:
          this.formGroup.get('amount')!.disable();
          this.formGroup.get('familyMember')!.enable();
          this.formGroup.get('ubn')!.disable();
          this.formGroup.get('zwoegerVrij')!.disable();
          this.formGroup.get('herdDscription')!.disable();
          this.formGroup.get('sheep')!.disable();
          break;
      }

      this.formGroup.get('amount')!.updateValueAndValidity();
      this.formGroup.get('familyMember')!.updateValueAndValidity();
      this.formGroup.get('ubn')!.updateValueAndValidity();
      this.formGroup.get('zwoegerVrij')!.updateValueAndValidity();
      this.formGroup.get('herdDscription')!.updateValueAndValidity();
      this.formGroup.get('sheep')!.updateValueAndValidity();
  });

    route.queryParamMap.subscribe((params) => {
      const type = params.get("soort");
      let typeValue;
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

  sheepFormGroups(): FormGroup[] {
    return (this.formGroup.get('sheep') as FormArray).controls as FormGroup[];
  }

  createSheepFormGroup(): FormGroup {
    return new FormGroup({
      gender: new FormControl(undefined, [
        Validators.required
      ]),
      number: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[0-9]{12}$/i)
      ]),
      birthdate: new FormControl(undefined, [
        Validators.required
      ]),
      dateOfPurchase: new FormControl(),
      ubnOfSeller: new FormControl(),
      registeredInStudbook: new FormControl(undefined, [
        Validators.required
      ])
    });
  }

  deleteSheep(idx: number) {
    (this.formGroup.controls.sheep as FormArray).removeAt(idx);
  }

  addSheep() {
    (this.formGroup.controls.sheep as FormArray).push(this.createSheepFormGroup());
  }
}