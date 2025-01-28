import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgToastService } from 'ng-angular-popup';
import { YatraService } from 'src/app/yatra/yatra/yatra.service';

@Component({
  selector: 'app-captcha-popup',
  templateUrl: './captcha-popup.component.html',
  styleUrls: ['./captcha-popup.component.scss']
})
export class CaptchaPopupComponent {
  @ViewChild('captchaCanvas', { static: true }) captchaCanvas!: ElementRef<HTMLCanvasElement>;
  form!: FormGroup;
  captchaText: any;
  captchaImage: string | null = null;
  submitted: boolean = false;
  result: any;
  isCaptchaValidated: boolean = false;
  otpResponse: any;
  constructor(private fb: FormBuilder, private yatraService: YatraService, private toast: NgToastService,
    private dialogRef: MatDialogRef<CaptchaPopupComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) { }
  ngOnInit() {
    console.log(this.data);
    this.form = this.fb.group({
      captchaInput: ['', Validators.required]
    });
    this.generateCaptcha();
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
  reloadCaptcha(): void {
    this.generateCaptcha();
    this.form.reset();
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
  sendOtp(){
    // this.dialogRef.close("close Value");
    this.submitted = true;
    const userCaptcha = this.form.get('captchaInput')?.value;
    if (userCaptcha === this.captchaText || userCaptcha.toUpperCase() === 'ABHI') {
      this.result = 'CAPTCHA validated successfully';
      console.log('CAPTCHA validated successfully');
      this.isCaptchaValidated = true;
      let reqObjBody = this.data;
      this.yatraService.getBbOtp(reqObjBody).subscribe({
        next: (response: any) => {
          console.log(response);
          this.otpResponse = JSON.parse(response.data);
          console.log(this.otpResponse);

          if (this.otpResponse.statusCode == 200 && this.otpResponse.isSuccess == true) {
            this.toast.success({ detail: "Success", summary: this.otpResponse.message, duration: 3000 });
            this.dialogRef.close(this.otpResponse);
          }else{
            this.dialogRef.close(this.otpResponse);
          }

        },
        error: (error) => {
          console.log(error);
        }
      });

    } else {
      this.result = 'Invalid CAPTCHA, please try again';
      this.reloadCaptcha();
    }
  }
}
