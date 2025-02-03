import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-cancel-popup',
  templateUrl: './cancel-popup.component.html',
  styleUrls: ['./cancel-popup.component.scss']
})
export class CancelPopupComponent {
  
  constructor(private dialogRef:MatDialogRef<CancelPopupComponent>){
  }
  onClose(){
    this.dialogRef.close()
  }
}
