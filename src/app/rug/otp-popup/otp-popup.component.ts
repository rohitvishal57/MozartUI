import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-otp-popup',
  templateUrl: './otp-popup.component.html',
  styleUrls: ['./otp-popup.component.scss']
})
export class OtpPopupComponent implements OnInit{
  @ViewChild('captchaCanvas', { static: true }) captchaCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('input1') input1!: ElementRef;
  @ViewChild('input2') input2!: ElementRef;
  @ViewChild('input3') input3!: ElementRef;
  @ViewChild('input4') input4!: ElementRef;
  @ViewChild('input5') input5!: ElementRef;
  @ViewChild('input6') input6!: ElementRef;
  otpInfoObject: any;
  captchaFormOne!: FormGroup;
  form!: FormGroup;
  captchaText: any;
  captchaImage: string | null = null;
  isCaptchaOne: boolean = false;
  constructor(private fb: FormBuilder,
    private dialogRef: MatDialogRef<OtpPopupComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) { }
  ngOnInit() {
    console.log(this.data);
    // this.captchaFormOne = this.fb.group({
    //   captchaOneInput: ['', Validators.required]
    // });
    this.form = this.fb.group({
      captchaInput: ['', Validators.required]
    });
    this.generateCaptcha();
  }
  ngAfterViewInit(): void {
    this.generateCaptcha(); // Now the canvas is available
  }
  reloadCaptcha(): void {
    this.generateCaptcha();
    this.form.reset();
  }
  generateCaptcha(): void {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let captcha = '';
    for (let i = 0; i < 6; i++) {
      captcha += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    this.captchaText = captcha;
    console.log(this.captchaText);
    this.drawCaptcha(captcha);
  }  
  drawCaptcha(text: string): void {
    const canvas = this.captchaCanvas?.nativeElement;
    if (!canvas) {
      console.error('Canvas element is not available.');
      return;
    }
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Set background color
      ctx.fillStyle = '#f2f2f2';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw the text
      ctx.font = '30px Arial';
      ctx.fillStyle = '#000';
      ctx.fillText(text, 10, 35);

      // Draw random lines
      ctx.strokeStyle = '#888';
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
        ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
        ctx.stroke();
      }

      // Convert canvas to data URL
      this.captchaImage = canvas.toDataURL('image/png');
    } else {
      console.error('Failed to get canvas context.');
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
  async resendOtp(){
    const userCaptcha = this.form.get('captchaInput')?.value;
    // this.submitted = true;
    // if (userCaptcha === this.captchaText) {
    //   this.toastr.success('CAPTCHA validated successfully','');
    //   // this.result = 'CAPTCHA validated successfully';
    //   this.isCaptchaValidated=true;
    //   this.submitted = false;
    //   this.reloadCaptcha();
    // } else {
    //   // this.result = 'Invalid CAPTCHA, please try again';
    //   // this.submitted = false;
    //   this.isCaptchaValidated=false;
    //   this.toastr.warning('Invalid CAPTCHA, please try again','');
    //   this.reloadCaptcha();
    // }
    // if(this.isCaptchaValidated){
    //   let otpGenReq = this.data.generateOtpReq;
    //   this.loading = true
    //   const res = await this.dataService.postApiCall('/BranchBanking/GetBBOTP', otpGenReq);
    //   this.otpResponse = res;
    //   if (this.otpResponse.statusCode == 200 && this.otpResponse.isSuccess == true) {
    //     this.loading = false
    //     this.toastr.success(this.otpResponse.statusMessage,'',
    //     { timeOut: 5000 }
    //     );
    //   }
    // }
  }
  async validateOtp(){
    let reqObjBody = {
      leadId : this.data.leadId,
      otp: this.otpInfoObject
    }
    // const res = await this.dataService.postApiCall('/BranchBanking/ValidateBBOTP', reqObjBody);
    // this.otpValidateResponse = res;
    // this.loading = false;
    // if(this.otpValidateResponse.isOtpValidated == false){
    //   this.toastr.warning(this.otpValidateResponse.statusMessage,'',
    //   { timeOut: 5000 }
    //   );
    // }else{
    //   this.toastr.success(this.otpValidateResponse.statusMessage,'',
    //   { timeOut: 5000 }
    //   );
    //   this.dialogRef.close(this.otpValidateResponse);
    // }
  }
  close(){
    this.dialogRef.close("close Value");
  }
}
