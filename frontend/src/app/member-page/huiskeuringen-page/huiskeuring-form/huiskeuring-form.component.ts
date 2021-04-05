import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-huiskeuring-form',
  templateUrl: './huiskeuring-form.component.html',
  styleUrls: ['./huiskeuring-form.component.scss']
})
export class HuiskeuringFormComponent {
  @Input()
  formGroup!: FormGroup

  regionSubscription?: Subscription;

  constructor() { 
    
  }

  onRegionChange() {
    console.log('reset region');
    this.formGroup.controls.preferred_date.setValue('');
  }
}

export function createFormGroup(): FormGroup {
  return new FormGroup({
    name: new FormControl('', [
      Validators.required
    ]),
    region: new FormControl('', [
      Validators.required
    ]),

    preferred_date: new FormControl('', [
      Validators.required
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
    locations: new FormControl(1),
    on_paper: new FormControl(false),

    remarks: new FormControl('')
  });
}
