import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-hdfc-validation-popup',
  templateUrl: './hdfc-validation-popup.component.html',
  styleUrls: ['./hdfc-validation-popup.component.scss']
})
export class HdfcValidationPopupComponent {
  @ViewChild('input1') input1!: ElementRef;
  @ViewChild('input2') input2!: ElementRef;
  @ViewChild('input3') input3!: ElementRef;
  @ViewChild('input4') input4!: ElementRef;
  @ViewChild('input5') input5!: ElementRef;
  @ViewChild('input6') input6!: ElementRef;
  otpInfoObject: any;
  customerForm!: FormGroup;
  submitted: boolean = false;
  isShowOtp: boolean = false;
  constructor(private formBuilder: FormBuilder,private toast: NgToastService,
    private dialogRef: MatDialogRef<HdfcValidationPopupComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) { }

  ngOnInit() {
    console.log(this.data);
    this.customerForm = this.formBuilder.group({
      mobilenumber: ['', [Validators.required, Validators.pattern('^[6-9]\\d{9}$')]],
      dob: ['', [Validators.required]]
    });
  }
  isNumber(event: KeyboardEvent) {
    const pattern = /[0-9]/; // Only allow digits
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault(); // Block non-numeric input
    }
  }
  focusNext(event: any, nextInput: any) {
    const inputLength = event.target.value.length;
    if (inputLength === 1 && nextInput) {
      nextInput.focus();
    }
  }
  focusPrevious(event: KeyboardEvent, previousInput: HTMLInputElement | null): void {
    const inputLength = (event.target as HTMLInputElement).value.length;
    const charCode = event.keyCode || event.which;
    
    // If the key pressed is backspace and the current input is empty, move focus to the previous input
    if (charCode === 8 && inputLength === 0 && previousInput) {
      previousInput.focus();
    }
  }
  restrictToNumbers(event: KeyboardEvent): void {
    const charCode = event.charCode || event.keyCode || event.which;
    // Allow only numbers (0-9)
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }
  async onComplete() {
    // Do something when OTP entry is complete
    this.otpInfoObject = this.input1.nativeElement.value +
    this.input2.nativeElement.value +
    this.input3.nativeElement.value +
    this.input4.nativeElement.value +
    this.input5.nativeElement.value +
    this.input6.nativeElement.value;
  }
  close(){
    this.dialogRef.close();
  }
  onSubmit(){
    this.submitted = true;
    console.log(this.customerForm.value);
    if(this.customerForm.valid){
      this.isShowOtp = true;
    }else{
      this.isShowOtp = false;
    }
    // this.dialogRef.close();
  }
}
