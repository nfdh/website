import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { EventManager } from '@angular/platform-browser';

@Component({
  selector: 'app-dekverklaring-form',
  templateUrl: './dekverklaring-form.component.html',
  styleUrls: ['./dekverklaring-form.component.scss']
})
export class DekverklaringFormComponent {
  @Input()
  formGroup!: FormGroup

  constructor() { }

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
    Validators.required
  ])
}