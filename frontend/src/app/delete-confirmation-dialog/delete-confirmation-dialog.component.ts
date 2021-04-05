import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SelectionMap, SelectionType } from '../services/selection';

type DeleteSelectionType = 'including' | 'excluding' | 'all';

@Component({
  selector: 'app-delete-confirmation-dialog',
  templateUrl: './delete-confirmation-dialog.component.html',
  styleUrls: ['./delete-confirmation-dialog.component.scss']
})
export class DeleteConfirmationDialogComponent {
  entityName: string;
  type: DeleteSelectionType;
  size: number;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { entityName: string, selection: SelectionMap<any> }) { 
    this.entityName = data.entityName;
    this.size = data.selection.size;
    switch(data.selection.type) {
      case SelectionType.Including: this.type = "including"; break;
      case SelectionType.Excluding: this.type = data.selection.partialSelection ? "excluding" : "all"; break;
    }
  }
}
