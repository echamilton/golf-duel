import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnInit {
  popupText: string;
  constructor(
    private dialogRef: MatDialogRef<PopupComponent>,
    @Inject(MAT_DIALOG_DATA) data) {
    this.popupText = data.text;
  }

  ngOnInit() {
  }

  onYes() {
    this.dialogRef.close('Yes');
  }

  onClose() {
    this.dialogRef.close('No');
  }

}
