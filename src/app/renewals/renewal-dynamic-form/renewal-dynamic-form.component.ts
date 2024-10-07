import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RenewalsService } from '../renewals.service';

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
  control = {
    name: 'sumInsured',
    label: 'Sum Insured',
    type: 'range',
    min: 500000,
    max: 20000000,
    step: 500000,
    value: 500000,
    class: 'col-md-12'
  };
  rangeValue: { [key: string]: number } = { sumInsured: 500000 };
  renewalInfo: any;
  formObject: any = {};

  constructor(
    private fb: FormBuilder,
    private renewalService: RenewalsService
    ) {}

  ngOnInit() {
    this.renewalService.policy$.subscribe(policy => {
     if(policy.policyNo){
     this.policyNumber=policy.policyNo;}
   });
   this.getRenewalInfo();
   this.initializeForm();
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
           const updatedAddress = { ...this.form.value };
           Object.keys(updatedAddress).forEach((key) => {
             if (updatedAddress[key] !== null && updatedAddress[key] !== undefined && updatedAddress[key] !== '') {
               this.renewalInfo.response.policyData[0].HomeAddress[key] = updatedAddress[key];
             }
         });
         } 
         else {
           console.log('Form is invalid');
         }          
         break;
       case 'addNominee':
         this.formId=5001;
         if (event === 'addNominee') {
           const nominee = { ...this.form.value };
           const nomineeDetails = this.renewalInfo.response.policyData[0].Nominee_Details;
           Object.keys(nominee).forEach((key) => {nomineeDetails[key] = nominee[key];});
           const additionalKeys = {
               nominee_middle_name: nomineeDetails.nominee_middle_name || '',
               nominee_mobile_number: nomineeDetails.nominee_mobile_number || '',
               nominee_emergency_phone_number: nomineeDetails.nominee_emergency_phone_number || '',
               nominee_email_address: nomineeDetails.nominee_email_address || ''
           };
           Object.assign(nomineeDetails, additionalKeys);
           this.renewalInfo.response.policyData[0].Nominee_Details = nomineeDetails;
         } 
         else {
           console.log('Form is invalid');
         } 
         break;  
       default:
         console.warn('Unknown action:', event);
     }
   }
 updateRangeValue(event: any, controlName: string) {
 const value = event.target.value;
   this.rangeValue[controlName] = +value;
 }
 getBackground(value: number, min: number, max: number): string {
    const percentage = ((value - min) / (max - min)) * 100;
    return `linear-gradient(to right, #ffcc00 0%, #ffcc00 ${percentage}%, #f0f0f0 ${percentage}%, #f0f0f0 100%)`;
 }
 formatValue(value: number): string {
   return new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(value);
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
         this.formObject = { ...this.renewalInfo.response.policyData[0].HomeAddress };
       } this.initializeForm();
       this.formId = value;
     }
     else if (value == 5004) {
       if (this.renewalInfo?.response?.policyData?.length > 0 && content == 'editNominee') {
         const nomineeDetails = this.renewalInfo.response.policyData[0].Nominee_Details;
         this.formObject = {...nomineeDetails,
           nominee_middle_name: nomineeDetails.nominee_middle_name || '',
           nominee_mobile_number: nomineeDetails.nominee_mobile_number || '',
           nominee_emergency_phone_number: nomineeDetails.nominee_emergency_phone_number || '',
           nominee_email_address: nomineeDetails.nominee_email_address || ''
         };
       } 
       else if (content === 'addNominee') {
         this.formObject = Object.keys(this.renewalInfo.response.policyData[0].Nominee_Details)
           .reduce((acc:any, key:any) => { acc[key] = ''; return acc; }, {});
           this.formObject.nominee_middle_name = '';
           this.formObject.nominee_mobile_number = '';
           this.formObject.nominee_emergency_phone_number = '';
           this.formObject.nominee_email_address = '';  
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
   console.log("radio vlue whenever selecting",this.isRadioSelected);

   }
 setSection(section: string) {
   this.activeSection = section;
 }
 proceed(value? :any) {
   if (this.activeSection === 'primary') {
     this.setSection('additional');
   } 
   else if (this.activeSection === 'additional') {
     this.setSection('payment');
   } 
   else if (this.activeSection === 'payment') {
     if(value == 'back') this.setSection('additional')
   }
 }
 renewNow() {
   this.setSection('payment')
 }
  getRenewalInfo() {
    this.renewalService.getRenewalInfoApi(this.policyNumber, {}).subscribe(
      (res:any) => {
        console.log("Renewal Info",res);
        this.renewalInfo = JSON.parse(res.data);
      },
      (err) => {
        console.log("Error coming from getRenewalInfo API", err);
      }
    );
  }

}
