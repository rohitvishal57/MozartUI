import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-payment-info',
  templateUrl: './payment-info.component.html',
  styleUrls: ['./payment-info.component.scss']
})
export class PaymentInfoComponent implements OnInit{

  constructor(
    private dialogRef: MatDialogRef<PaymentInfoComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) { }
  ngOnInit() {
    console.log(this.data);
  }
  proceedToSubmit(){
    this.dialogRef.close("close Value");
  }
}
