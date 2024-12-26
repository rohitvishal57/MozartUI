import { Component, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AdminService } from '../../admin.service';

@Component({
  selector: 'app-audit',
  templateUrl: './audit.component.html',
  styleUrls: ['./audit.component.scss']
})
export class AuditComponent {

  auditValue!:any
  constructor(private fb: FormBuilder,
    private dialogRef: MatDialogRef<AuditComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,    
    private adminService: AdminService

  ) {
  }

  ngOnInit(): void {
    this.auditValue = this.data.value
  }

  closeDialog(){
    this.dialogRef.close()
  }
}
