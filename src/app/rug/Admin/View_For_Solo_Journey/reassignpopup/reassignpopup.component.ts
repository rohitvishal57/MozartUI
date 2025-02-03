import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-reassignpopup',
  templateUrl: './reassignpopup.component.html',
  styleUrls: ['./reassignpopup.component.scss']
})
export class ReassignpopupComponent {
  agentData: any
  selectedAvId:any
    constructor(  private dialogRef: MatDialogRef<ReassignpopupComponent>,
      @Inject(MAT_DIALOG_DATA) private data: any){
    }
    ngOnInit() {
      this.agentData = this.data.AVData;
      console.log(this.agentData);
    }
    closeIcon(){
      this.dialogRef.close();
    }
    close(){
      this.dialogRef.close(this.selectedAvId);
    }
}
