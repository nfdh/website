import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent {
  @Input()
  formGroup!: FormGroup

  @Input()
  addNew!: boolean

  constructor() { }
}

export function createFormGroup(): FormGroup {
  return new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    name: new FormControl('', [
      Validators.required
    ]),

    studbook_heideschaap: new FormControl(false),
    studbook_heideschaap_ko: new FormControl(false),
    studbook_schoonebeeker: new FormControl(false),
    studbook_schoonebeeker_ko: new FormControl(false),

    role_website_contributor: new FormControl(false),
    role_member_administrator: new FormControl(false),
    role_studbook_administrator: new FormControl(false),
    role_studbook_inspector: new FormControl(false)
  });
}