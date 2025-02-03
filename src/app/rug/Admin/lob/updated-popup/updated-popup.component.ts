import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-updated-popup',
  templateUrl: './updated-popup.component.html',
  styleUrls: ['./updated-popup.component.scss']
})
export class UpdatedPopupComponent {

  constructor(private dialogRef:MatDialogRef<UpdatedPopupComponent>){
  }
  onClose(){
    this.dialogRef.close()
  }
}
