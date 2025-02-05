import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';
import { RugService } from '../../rug.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LeadsService } from 'src/app/leads/leads.service';

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
    ,private leadService: LeadsService){ }

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
              this.isShowOtp = true;
              this.referenceId =  JSON.parse(response.data).data.responseString.refNo;
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
          this.customerInfo =  JSON.parse(response.data).data.sas_DIM_DEDUPE_OUTPUT.all_ACCOUNT.account_INFO;
          this.isCustomerInfo = true;
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
      let reqData = {
              CustomerName: this.customerInfo.v_D_CUST_FIRST_NAME + " " +  this.customerInfo.v_D_CUST_LAST_NAME,
              Dob: this.customerInfo.d_D_CUST_DATE_OF_BIRTH,  // Date of Birth in the required format
              MobileNumber: this.customerInfo.v_D_CUST_MOBILE_PHONE,
              Address1: this.customerInfo.v_D_CUST_OFF_ADR1,
              Address2: this.customerInfo.v_D_CUST_ADD2,
              Address3: this.customerInfo.v_D_CUST_OFF_ADR3,
              City: this.customerInfo.v_D_CUST_CITY,
              State: this.customerInfo.v_D_CUST_STATE,
              Pincode: this.customerInfo.v_D_CUST_ZIP_CODE,
              EmailID: this.customerInfo.v_D_CUST_EMAIL_ADD,
              AgentCode: "I0002484",
              Gender: this.customerInfo.v_D_CUST_GENDER,
              LeadNumber: this.leadNumber
      };
  
      this.rugService.generateProposal(reqData).subscribe(
          (response: any) => {
          
            console.log('generateProposal',response);
          },
          (error) => {
              console.error("Error from send OTP API:", error);
          });
  }
  

  }





