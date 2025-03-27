import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-not-valid-popup',
  templateUrl: './not-valid-popup.component.html',
  styleUrls: ['./not-valid-popup.component.scss']
})
export class NotValidPopupComponent {
  displayData:any;
constructor(
  private dialogRef: MatDialogRef<NotValidPopupComponent>,
  @Inject(MAT_DIALOG_DATA) private data: any,
){
this.displayData= this.data
}
}