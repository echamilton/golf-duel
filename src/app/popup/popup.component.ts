import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<PopupComponent>,
        @Inject(MAT_DIALOG_DATA) data)  {
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
