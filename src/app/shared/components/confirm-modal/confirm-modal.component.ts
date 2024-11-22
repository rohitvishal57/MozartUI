import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss']
})
export class ConfirmModalComponent implements OnInit {


  dialogName = ''
  dialogData : any ={};
  templateName !:any
  
  constructor(
    public dialogRef: MatDialogRef<ConfirmModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      console.log(data)
      this.dialogData = data
      this.dialogName = data.dialogName;
      if(data.tempalateName){
        this.templateName = data.templateName
      }
     }

  ngOnInit(): void {
  }

  closeModal(val:string){
    this.dialogRef.close(val)
  }

  yes() {
    this.dialogRef?.close(true)
  }

  closeDialog(){
    this.dialogRef.close()
  }
}
