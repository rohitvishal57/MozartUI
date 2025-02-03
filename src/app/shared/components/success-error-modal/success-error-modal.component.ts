import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-success-error-modal',
  templateUrl: './success-error-modal.component.html',
  styleUrls: ['./success-error-modal.component.scss']
})
export class SuccessErrorModalComponent {
  constructor(
    public dialogRef: MatDialogRef<SuccessErrorModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { type: string; title: string; message: string }
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }
}