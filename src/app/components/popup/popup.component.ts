import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IPopupModalData } from './../../models/models';

@Component({
  selector: 'golf-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent {
  popupText: string;
  constructor(
    private dialogRef: MatDialogRef<PopupComponent>,
    @Inject(MAT_DIALOG_DATA) data: IPopupModalData
  ) {
    this.popupText = data.text;
  }

  onYes(): void {
    this.dialogRef.close('Yes');
  }

  onNo(): void {
    this.dialogRef.close('No');
  }
}
