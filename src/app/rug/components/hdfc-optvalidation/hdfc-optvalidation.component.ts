import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';
import { RugService } from '../../rug.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LeadsService } from 'src/app/leads/leads.service';
import { HttpClient } from '@angular/common/http';
import { NgToastService } from 'ng-angular-popup';

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
  isShowOtp: Boolean = false;
  isCustomerInfo: Boolean = false;
  referenceId : any = '';
  leadNumber: any = '';
  customerInfo : any ={};

  constructor(private formBuilder: FormBuilder,private rugService : RugService,private route: ActivatedRoute,private router: Router
    ,private leadService: LeadsService,private toast: NgToastService){ }

  ngOnInit() {
    this.customerForm = this.formBuilder.group({
      mobilenumber: ['', [Validators.required, Validators.pattern('^[6-9]\\d{9}$')]],
      dob: ['', [Validators.required]]
    });

    this.route.queryParams.subscribe(params => {
      localStorage.setItem('token', params['token']);
      this.leadNumber = params['LeadNumber']
    });

    this.getLeadInfoByLeadNumber();
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
            if (JSON.parse(response.data).isSuccess) {
              this.toast.success({ detail: "Success", summary: 'OTP Send Successfully.', duration: 3000 });
              this.isShowOtp = true;
              this.referenceId =  JSON.parse(response.data).data.responseString.refNo;
            }else{
              this.toast.error({ detail: "error", summary: 'Failed to send OTP.', duration: 3000 });
            }
          },
          (error)=>{
            console.error("Error from send OTP API:", error);
          });
      }
    }

    ValidateOTP(){
      let reqData = {
        refNo : this.referenceId,
        passwordValue : this.otpInfoObject
      }
      this.rugService.validateHdfcOTP(reqData).subscribe(
        (response: any) => {
          if (JSON.parse(response.data).isSuccess) {
          this.toast.success({ detail: "Success", summary: 'Validated Successfully.', duration: 3000 });
          this.customerInfo =  JSON.parse(response.data).data.sas_DIM_DEDUPE_OUTPUT.all_ACCOUNT.account_INFO;
          this.isCustomerInfo = true;
          }else{
            this.toast.error({ detail: "error", summary: 'Incorrect OPT.', duration: 3000 });
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


    getLeadInfoByLeadNumber(){
      this.leadService.getLeadInformationByLeadID(this.leadNumber).subscribe(
     (response)=>{
      if(response.isSuccess){
        this.customerForm.patchValue({
          mobilenumber : response.data.leadList[0].phoneNumber
        });
      }
     },(error)=>{
      console.log('failed to fetch lead Information',error);
     });
    }

     generateProposal() {
    if (!this.customerInfo) {
      console.error("Customer information is missing.");
      return;
    }

    const reqData = {
      customerName: `${this.customerInfo.v_D_CUST_FIRST_NAME ?? ''} ${this.customerInfo.v_D_CUST_LAST_NAME ?? ''}`.trim(),
      dob: this.customerInfo.d_D_CUST_DATE_OF_BIRTH ?? '',
      mobileNumber: this.customerInfo.v_D_CUST_MOBILE_PHONE ?? '',
      address1: this.customerInfo.v_D_CUST_OFF_ADR1 ?? '',
      address2: this.customerInfo.v_D_CUST_ADD2 ?? '',
      address3: this.customerInfo.v_D_CUST_OFF_ADR3 ?? '',
      city: this.customerInfo.v_D_CUST_CITY ?? '',
      state: this.customerInfo.v_D_CUST_STATE ?? '',
      pincode: this.customerInfo.v_D_CUST_ZIP_CODE ?? '',
      emailID: this.customerInfo.v_D_CUST_EMAIL_ADD ?? '',
      gender: this.customerInfo.v_D_CUST_GENDER ?? '',
      leadNumber: this.leadNumber ?? '',
      agentcode: ''
    };

    this.rugService.generateProposal(reqData).subscribe(
      (response: any) => {
        if(JSON.parse(response.data).isSuccess){
          window.location.href = JSON.parse(response.data).data;
        }
      },
      (error) => {
        console.error("Error from generateProposal API:", error);

      }
    );
  }}





