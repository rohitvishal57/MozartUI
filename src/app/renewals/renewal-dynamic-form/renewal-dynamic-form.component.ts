import { HttpClient } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { RenewalsService } from '../renewals.service';
import { Options } from '@angular-slider/ngx-slider';

@Component({
  selector: 'app-renewal-dynamic-form',
  templateUrl: './renewal-dynamic-form.component.html',
  styleUrls: ['./renewal-dynamic-form.component.scss']
})
export class RenewalDynamicFormComponent implements OnInit {
  form: FormGroup = this.fb.group({});
  formId: number = 5001;
  isEditEmail = false;
  isEditMobile =false;
  email = 'sujitp1@gmail.com';
  mobileNo = 9833474737;
  selectedButton: string = 'primary'; 
  selectedCoverages: any[] = []; 
  isRadioSelected = false;
  selectedPaymentType: string = '';
  selectedPaymentTypeLabel: string = '';
  isDropdownOpen: boolean = false;
  policySummary : boolean=false
  activeSection: string = 'primary';
  policyNumber:string=''; 
  renewalInfo: any;
  formObject: any = {};
  subObject:any = {};
  requestObject: any = {
    agentCode: '',
    productId: 0,
    quoteData: '',
    policyNumber: '',
    quoteNumber: '',
    comment: '',
    referenceNumber: '',
    tenure: 0
  };
  request:any;
  selectedSumInsured: any;
  sliderOptions: Options = {
    stepsArray: [
      { value: 500000 }, 
      { value: 700000 }, 
      { value: 1000000 },  
      { value: 1500000 }, 
      { value: 2500000 }, 
      { value: 5000000 },
      { value: 10000000 }, 
      { value: 20000000 } 
    ],
    translate: (value: number): string => {
      return '';
    }
  };
  optionalCovers:any;

  constructor(
    private fb: FormBuilder,
    private renewalService: RenewalsService,private router: Router
  ) {}

  ngOnInit() {
    this.renewalService.policy$.subscribe(policy => {
     if(policy.policyNo){
     this.policyNumber=policy.policyNo;
    this.activeSection=policy.activeSection
  }
   });
   this.getRenewalInfo();
   this.initializeForm();
   this.getproductdetailsandfeatures();
   this.selectedSumInsured = this.sliderOptions?.stepsArray?.[4]?.value ?? 0;
 }
 initializeForm() {
   const group: { [key: string]: any } = {}; 
   Object.keys(this.formObject).forEach((key: string) => {
     const controlValue = this.formObject[key];
     if (controlValue instanceof Object && !(controlValue instanceof Array)) {
       group[key] = this.fb.group(
         Object.keys(controlValue).reduce((subForms: { [nestedKey: string]: any }, nestedKey: string) => {
           subForms[nestedKey] = [controlValue[nestedKey]]; 
           return subForms;
         }, {})
       );
     } else {
       group[key] = [controlValue];
     }
   });
     this.form = this.fb.group(group);
 }

 onSumInsuredChange(eventValue: any) {
  this.selectedSumInsured = eventValue;
}
formatTickLabel(value: number, forSlider: boolean): string {
  if (value >= 10000000) {
    return forSlider == true ? (value / 10000000) + 'Cr' : '₹' + (value / 10000000) + ' Crores';
  } else if (value >= 100000 && value < 1000000) {
    return forSlider == true ? (value / 100000) + 'L' : '₹' + (value / 100000) + ' Lakhs';
  } else if (value >= 100000 ) {
    return forSlider == true ? (value / 100000) + 'L' : '₹' + (value / 100000) + ' Lakhs';
  }

  return value.toString();
}
 handleAction(event: string,item?: any) {
     switch (event) {
       case 'addMember':
         this.formId=5001;
         break;
       case 'editMember':
         this.formId=5001;
         break;
       case 'editAddress':
         this.formId=5001;
         if (event === 'editAddress') {
          this.request={...this.requestObject,
          HomeAddress: { ...this.form.value },
         }
         this.request.policyNumber='21-24-0002334-00';
         this.request.agentCode=localStorage.getItem('agentCode');
         this.request.comment='updated nominee detail',
         this.renewalService.updateaddressApi(this.request).subscribe(
          (res:any) => {
            this.renewalInfo = JSON.parse(res.data);
            console.log(this.renewalInfo);
            
          },
          (err) => {
            console.log("Error coming from getRenewalInfo API", err);
          }
        );
         console.log(this.request);
       } 
       else {
         console.log('Form is invalid');
       }         
         break;
         case 'editNominee':
          this.formId=5001;
          if (event === 'editNominee') {
           this.request={...this.requestObject,
             nomineeDetailRequest: { ...this.form.value },
            }
            this.request.nomineeDetailRequest.policyNumber='21-24-0002334-00';
            this.request.policyNumber='21-24-0002334-00';
            this.request.agentCode=localStorage.getItem('agentCode');
            this.request.comment='updated nominee detail',
            this.renewalService.updatenomineeApi(this.request).subscribe(
             (res:any) => {
               this.renewalInfo = JSON.parse(res.data);
               console.log(this.renewalInfo);
             },
             (err) => {
               console.log("Error coming from updatenomineeApi", err);
             }
           );
            console.log(this.request);
          } 
          else {
            console.log('Form is invalid');
          } 
          break; 
        case 'summary':
        this.activeSection='primary'
        break;
       default:
         console.warn('Unknown action:', event);
     }
   }
 toggleEditPaymentOption(value: any) {
   if(value == 'email'){
   this.isEditEmail = !this.isEditEmail;
   this.isEditMobile = false;
   } else if(value == 'mobileNo'){
     this.isEditMobile = !this.isEditMobile;
     this.isEditEmail=false;
     }
 }
 handlePaymentEvent(value: any) {
   if (this.email && this.email !== '' && value == 'email') {
     this.isEditEmail = false;
   }else if (this.mobileNo && this.mobileNo !== null && value == 'mobileNo') {
     this.isEditMobile = false;
   }
 }
 selectButton(button: string, value?: any,content? : any) {
  if (this.selectedButton === 'primary') {
    if (value == 5005) {
      if (this.renewalInfo?.response?.policyData?.length > 0) {
        this.subObject = { ...this.renewalInfo?.response?.policyData[0]?.HomeAddress };
        this.formObject = {
         home_Address_1: this.subObject.Home_Address_1 || '',
         home_Address_2: this.subObject.Home_Address_2 || '',
         home_Address_3: this.subObject.Home_Address_3 || '',
         home_State: this.subObject.Home_State || '',
         home_City: this.subObject.Home_City || '',
         home_Pincode: this.subObject.Home_Pincode ||'',
       };
      } this.initializeForm();
      this.formId = value;
    }
    else if (value == 5004) {
      if (this.renewalInfo?.response?.policyData?.length > 0 && content == 'editNominee') {
        const nomineeDetails = this.renewalInfo?.response?.policyData[0]?.Nominee_Details;
        this.formObject = {
          firstName: nomineeDetails.nominee_first_name || '',
          lastName: nomineeDetails.nominee_last_name || '',
          middleName: '',
          dob: nomineeDetails.nominee_dob|| '',
          contactNo: nomineeDetails.Nominee_Contact_No || '',
          relationship: nomineeDetails.Relationship || '',
          mobileNumber: '',
          emergencyPhoneNumber:'',
          emailAddress:'',
          policyNumber:''
        };
      } 
      this.initializeForm();
      this.formId = value;
    }
    else if (value == 5003) {
      
      this.formId = value;
    }
    else if (value == 5002) {
      this.formObject = {
        name: [''],
        weight: [''],
        heightft: [''],
        heightin: [''],
        gender: [''],
        dob: [''],
        idtype: [''],
        air: [''],
        occupation: [''],
        education: [''],
        conditions: this.fb.group({
          alcohol: [false],
          tobacco: [false],
          panmasala: [false],
          smoking: [false],
          other: [false],
        }),
        healthConditions: this.fb.group({
          highblood: [false],
          asthma: [false],
          diabetes: [false],
        })
      };
      
     this.initializeForm();
      this.formId = value;
    }
    else {
      this.formId = 5001; 
    }
  }
  else if (this.selectedButton === 'additional') {
    this.policySummary=false;
  } 
  else if (this.selectedButton == 'payment') {
    if(value == 'policySummary'){
      this.policySummary=true
    }
    else{
      this.policySummary=false;
    }
  }
}
 selectPaymentType(option: any) {
   this.selectedPaymentType = option.value;
   this.selectedPaymentTypeLabel = option.label;
   this.isDropdownOpen = false; 
 }
 @HostListener('document:click', ['$event'])
 onDocumentClick(event: Event) {
   const target = event.target as HTMLElement;
   const dropdown = document.querySelector('.custom-dropdown');

   if (dropdown && !dropdown.contains(target)) {
     this.isDropdownOpen = false;
   }
 }
 selectCoverage(coverage: any): void {
   const index = this.selectedCoverages.findIndex(c => c.id === coverage.id);
   if (index > -1) {
     this.selectedCoverages.splice(index, 1);
   } else {
     this.selectedCoverages.push(coverage);
   }
 }
 isCoverageSelected(coverage: any): boolean {
   return this.selectedCoverages.some(c => c.id === coverage.id);
 }
 onRadioChanges() {
   this.isRadioSelected = true;
   }
 applyRoomUpgrade() {
   this.isRadioSelected = false;
 }
 setSection(section: string) {
   this.activeSection = section;
 }
 proceed(value? :any) {
   if (this.activeSection === 'primary') {
     this.setSection('additional');
   } 
   else if (this.activeSection === 'additional') {
     this.setSection('policySummary');
   } 
   else if (this.activeSection === 'policySummary') {
      this.setSection('payment')
   }
   else if (this.activeSection === 'payment') {
    if(value == 'back') this.setSection('policySummary');
  }
 }
 renewNow() {
   this.setSection('payment')
 }
  getRenewalInfo() {
    this.renewalService.getRenewalInfoApi("21-24-0002334-00", {}).subscribe(
      (res:any) => {
        console.log("Renewal Info",res);
        this.renewalInfo = JSON.parse(res.data);
      },
      (err) => {
        console.log("Error coming from getRenewalInfo API", err);
      }
    );
  }
  changeroute(){
    this.renewalService.setQuote(this.renewalInfo);
    this.router.navigate(["renewals/subquotes"]);
  }
  getproductdetailsandfeatures(){
    const request={
      "productId": 2,
      "agentCode":localStorage.getItem('agentCode')
    }
    this.renewalService.getproductdetailsandfeatures(request).subscribe(
      (res:any) => { this.optionalCovers=res.data
        console.log(res.data);
      },
      (err) => {
        console.log("Error coming from getRenewalInfo API", err);
      }
    );
  }

}