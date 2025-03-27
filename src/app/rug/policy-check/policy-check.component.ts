import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-policy-check',
  templateUrl: './policy-check.component.html',
  styleUrls: ['./policy-check.component.scss']
})
export class PolicyCheckComponent {
  dispalyData: any;
  isLeadExisting: boolean = false;
  isLeadSubmmitted: boolean = false;
  isButtonsShow: boolean = true;
  constructor(
    private dialogRef: MatDialogRef<PolicyCheckComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any
  ){
  }
  ngOnInit() {
    console.log(this.data)
    this.dispalyData = this.data.displayData;
    this.isLeadExisting = this.data.isLeadExisting;
    this.isLeadSubmmitted = this.data.isLeadSubmmitted;
    if(this.isLeadExisting == true && this.isLeadSubmmitted == true){
      this.isButtonsShow = false;
    }
  }
  continueExisting(){
    this.dialogRef.close({
      IsCreateNew: false,
    });
  }
  createNew(){
    this.dialogRef.close({
      IsCreateNew: true,
    });
  }
  close(){
    this.dialogRef.close();
  }
}
