import { Component, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AdminService } from '../../Admin/admin.service';

@Component({
  selector: 'app-auditpopup',
  templateUrl: './auditpopup.component.html',
  styleUrls: ['./auditpopup.component.scss']
})
export class AuditpopupComponent {
  auditValue!:any
  constructor(private fb: FormBuilder,
    private dialogRef: MatDialogRef<AuditpopupComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,    
    private adminService: AdminService

  ) {
  }
  ngOnInit(): void {
    console.log(this.data);
    this.auditValue = this.data;
  }

  closeDialog(){
    this.dialogRef.close()
  }
}
