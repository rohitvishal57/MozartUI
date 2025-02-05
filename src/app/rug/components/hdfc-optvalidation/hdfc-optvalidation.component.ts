import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';
import { RugService } from '../../rug.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-hdfc-optvalidation',
  templateUrl: './hdfc-optvalidation.component.html',
  styleUrls: ['./hdfc-optvalidation.component.scss']
})
export class HdfcOptvalidationComponent {

  @ViewChild('input1') input1!: ElementRef;
  @ViewChild('input2') input2!: ElementRef;
  @ViewChild('input3') input3!: ElementRef;
  @ViewChild('input4') input4!: ElementRef;
  @ViewChild('input5') input5!: ElementRef;
  @ViewChild('input6') input6!: ElementRef;
  customerForm!: FormGroup;
  otpInfoObject: any;
  submitted : Boolean = false;
  isShowOtp: boolean = false;
  referenceId : any = '';


  constructor(private formBuilder: FormBuilder,private rugService : RugService,private route: ActivatedRoute,private router: Router) { }

  ngOnInit() {
    this.customerForm = this.formBuilder.group({
      mobilenumber: ['', [Validators.required, Validators.pattern('^[6-9]\\d{9}$')]],
      dob: ['', [Validators.required]]
    });

    this.route.queryParams.subscribe(params => {
      localStorage.setItem('token', params['token']);
      this.customerForm.patchValue({
        mobilenumber: params['mobileNo']
      });

      // ✅ Correct way to remove query params
      // this.router.navigate([], {
      //   relativeTo: this.route,
      //   queryParams: {},
      //   replaceUrl: true
      // });
    });
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

    focusNext(event: any, nextInput: any) {
      const inputLength = event.target.value.length;
      if (inputLength === 1 && nextInput) {
        nextInput.focus();
      }
    }

    onSubmit(){
      this.submitted = true;
      if(this.customerForm.valid){
        let reqData = {
          phoneNumber : this.customerForm.get("mobilenumber")?.value,
          dateOfBirth : this.customerForm.get("dob")?.value
        }

        this.rugService.sendHdfcOTP(reqData).subscribe(
          (response: any) => {
          //  if (response.isSuccess) {
              this.isShowOtp = true;
              this.referenceId =  response.referenceId;
          //  }
          },
          (error)=>{
            console.error("Error from send OTP API:", error);
          });
      }
    }


    ValidateOTP(){
      let reqData = {
        referenceId : this.referenceId,
        passwordValue : this.otpInfoObject
      }
      this.rugService.validateHdfcOTP(reqData).subscribe(
        (response: any) => {
          if (response.isSuccess) {
            this.referenceId =  response.referenceId;
          }
        },
        (error)=>{
          console.error("Error from send OTP API:", error);
        });
    }

    isNumber(event: KeyboardEvent) {
      const pattern = /[0-9]/; // Only allow digits
      const inputChar = String.fromCharCode(event.charCode);
      if (!pattern.test(inputChar)) {
        event.preventDefault(); // Block non-numeric input
      }
    }

  }





