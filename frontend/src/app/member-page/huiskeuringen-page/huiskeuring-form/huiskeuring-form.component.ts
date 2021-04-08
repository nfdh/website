import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AppTitleService } from 'src/app/services/app-title.service';

import availableDates from "../dates";

@Component({
  selector: 'app-huiskeuring-form',
  templateUrl: './huiskeuring-form.component.html',
  styleUrls: ['./huiskeuring-form.component.scss']
})
export class HuiskeuringFormComponent {
  @Input()
  formGroup!: FormGroup

  regionSubscription?: Subscription;

  constructor(titleService: AppTitleService) { 
    titleService.setTitle("Huiskeuring");
  }

  onRegionChange() {
    this.formGroup.controls.preferred_date.setValue('');
  }

  availableDatesForRegion(region: number) {
    return availableDates[region];
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
