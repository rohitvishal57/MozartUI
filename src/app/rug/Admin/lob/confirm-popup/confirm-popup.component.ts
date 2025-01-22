import { Component, Inject } from '@angular/core';
import { CancelPopupComponent } from '../cancel-popup/cancel-popup.component';
import { UpdatedPopupComponent } from '../updated-popup/updated-popup.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AdminService } from '../../admin.service';

@Component({
  selector: 'app-confirm-popup',
  templateUrl: './confirm-popup.component.html',
  styleUrls: ['./confirm-popup.component.scss']
})
export class ConfirmPopupComponent {
  lobData:any
  isSoloJourney:any
  constructor(private dialogRef:MatDialogRef<ConfirmPopupComponent>,private dialog: MatDialog, @Inject(MAT_DIALOG_DATA) data:any,private adminServise: AdminService ){
  this.lobData=data.value
  this.isSoloJourney=data.isSoloJourney

  }

  onConfim(){
   
      let reqBody={
        lobId: this.lobData.lobId || 0,
        lobName:this.lobData.lobName,
        isSoloJourney:this.isSoloJourney?!this.lobData.singleJourney:this.lobData.dualJourney,
        isDualJourney:this.isSoloJourney?this.lobData.singleJourney:!this.lobData.dualJourney,
        axisProcess:this.lobData.axisProcess,
        createdBy:'teleadmin2'
      }
     this.adminServise.createLob(reqBody).subscribe((response:any)=>{
          this.dialogRef.close()
          this.dialog.open(UpdatedPopupComponent) 
        },
        (error:any)=>{
          console.log(error)
        })
      
    }
  
    onCancel(){
      this.dialogRef.close()
      this.dialog.open(CancelPopupComponent)
    }

  
  closeIcon(){
    this.dialogRef.close();
  }
}
