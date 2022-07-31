import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-instructie-rvo-machtiging',
  templateUrl: './instructie-rvo-machtiging.component.html',
  styleUrls: ['./instructie-rvo-machtiging.component.scss']
})
export class InstructieRvoMachtigingComponent {
  relationInfoColumns = ['field', 'value'];
  relationInfo = [
    { field: 'Verstrekt door/aan', value: 'Machtiging DOOR mij aan een andere relatie' },
    { field: 'Type relatienummer', value: 'Relatienummer RVO.nl' },
    { field: 'Relatienummer', value: '201620518' },
    { field: 'Postcode', value: '2231 AR' },
    { field: 'Huisnummer', value: '25' }
  ];

  constructor(private dialogRef: MatDialogRef<InstructieRvoMachtigingComponent>) { }

  onCloseClick() {
    this.dialogRef.close();
  }

}
