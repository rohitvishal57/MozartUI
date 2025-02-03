import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-successpopup',
  templateUrl: './successpopup.component.html',
  styleUrls: ['./successpopup.component.scss']
})
export class SuccesspopupComponent {
  displayContent: any
  constructor(  private dialogRef: MatDialogRef<SuccesspopupComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any){
  }
  ngOnInit() {
    this.displayContent = this.data;
    console.log(this.data);
  }
  closeIcon(){
    this.dialogRef.close();
  }
  close(){
    this.dialogRef.close();
  }
}
