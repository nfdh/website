import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent {
  @Input()
  formGroup!: UntypedFormGroup

  @Input()
  addNew!: boolean

  constructor() { }
}

export function createFormGroup(): UntypedFormGroup {
  return new UntypedFormGroup({
    email: new UntypedFormControl('', [
      Validators.required,
      Validators.email
    ]),
    name: new UntypedFormControl('', [
      Validators.required
    ]),
    reset_password_on_login: new UntypedFormControl(false),

    studbook_heideschaap: new UntypedFormControl(false),
    studbook_heideschaap_ko: new UntypedFormControl(false),
    studbook_schoonebeeker: new UntypedFormControl(false),
    studbook_schoonebeeker_ko: new UntypedFormControl(false),

    role_website_contributor: new UntypedFormControl(false),
    role_member_administrator: new UntypedFormControl(false),
    role_studbook_administrator: new UntypedFormControl(false),
    role_studbook_inspector: new UntypedFormControl(false)
  });
}