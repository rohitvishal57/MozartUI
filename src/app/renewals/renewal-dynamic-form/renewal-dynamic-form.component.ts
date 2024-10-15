import { HttpClient } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { RenewalsService } from '../renewals.service';
import { Options } from '@angular-slider/ngx-slider';
import { NgToastService } from 'ng-angular-popup';

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
  email:any;
  mobileNo :any;
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
  request:any;
  selectedSumInsured: any;
  optionalCovers:any;
  referenceNumber:any=null;
  selectedTenure: string=''; 
  baseQuote:string='';
  productId:any;
  member:any;
  activeTab: string = 'chronicCondition';
  memberRole: string='';
  preexistingConditionSelected: string = 'no'; 
  healthConditions: string[] = [
    'Asthma',
    'Diabetes',
    'Hyperlipidaemia',
    'Hypertension',
    'PTCA',
    'COPD',
    'HighBMI'
  ];
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
  requestObject: any = {policyNumber: "string",referenceNumber: "string",};

  constructor(private fb: FormBuilder,private renewalService: RenewalsService,private router: Router,private toast: NgToastService) {}

  ngOnInit() {
    this.renewalService.policy$.subscribe(policy => {
     if(policy.policyNo){
        this.policyNumber=policy.policyNo;
        if(policy.activeSection == 'payment'){
        this.activeSection=policy.activeSection;
        }
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
setActiveTab(tabName: string): void {
  this.activeTab = tabName;
}
 handleAction(event: string,item?: any) {
     switch (event) {
       case 'Member':
         this.formId=5001;
         if (this.memberRole === 'Add' && this.form.valid) {
            this.form.value.SumInsured=this.selectedSumInsured;
            this.requestObject.member=JSON.stringify(this.form.value);
            this.requestObject.policyNumber='21-24-0002334-00';
            this.requestObject.referenceNumber=this.referenceNumber; 
            this.requestObject.agentCode="4620973";
            this.requestObject.productId=2;
            this.requestObject.quoteData="";
            console.log(this.requestObject);
            this.renewalService.updateMemberDetailsApi(this.requestObject).subscribe(
              (res:any) => {
                if(res.data.isUpdateSuccess == true){
                  this.renewalInfo.response.policyData[0].Members.push(this.form.value);
                  const newMemberIndex = this.renewalInfo.response.policyData[0].Members.length - 1;
                  this.renewalInfo.response.policyData[0].Members[newMemberIndex].SumInsured = this.selectedSumInsured;
                  this.referenceNumber=res.data.referenceNumber;
                }
                console.log('updated',res);
              },
              (err) => {
                this.toast.error({ detail: "Error", summary: "Failed to Add New Member.", duration: 1500 });
                console.log("Error coming from updateMemberDetails API", err);}
            );
         } 
         else if (this.memberRole === 'Update' && this.form.valid) {
            this.form.value.SumInsured=this.selectedSumInsured;
            this.requestObject.member=JSON.stringify(this.form.value);
            this.requestObject.policyNumber='21-24-0002334-00';
            this.requestObject.referenceNumber=this.referenceNumber; 
            this.requestObject.agentCode="4620973";
            this.requestObject.productId=2;
            this.requestObject.quoteData="";
            console.log(this.requestObject);
            this.renewalService.updateMemberDetailsApi(this.requestObject).subscribe(
              (res:any) => {
                if(res.data.isUpdateSuccess == true){
                  const memberIndex = this.renewalInfo.response.policyData[0].Members.findIndex((member:any) => member.FirstName === this.form.value.FirstName);
                  if (memberIndex !== -1) {
                    this.renewalInfo.response.policyData[0].Members[memberIndex] = { ...this.renewalInfo.response.policyData[0].Members[memberIndex], ...this.form.value };
                    this.renewalInfo.response.policyData[0].Members[memberIndex].SumInsured = this.selectedSumInsured;
                  } else {console.log('Member not found for update');}
                  this.referenceNumber=res.data.referenceNumber;
                }
                console.log('updated',res);
              },
              (err) => {
                this.toast.error({ detail: "Error", summary: "Failed to Update Member.", duration: 1500 });
                console.log("Error coming from updateMemberDetails API", err);}
            );
         } 
         else {
           console.log('Form is invalid');
         } 
         break;
       case 'editMember':
         this.formId=5001;
         break;
       case 'editAddress':
         this.formId=5001;
         if (event === 'editAddress') {
            this.requestObject.updatedAddress=JSON.stringify(this.form.value);
            this.requestObject.policyNumber='21-24-0002334-00';
            this.requestObject.referenceNumber=this.referenceNumber; 
            console.log(this.requestObject);
            this.renewalService.updateaddressApi(this.requestObject).subscribe(
              (res:any) => {
                if(res.data.isUpdateSuccess == true){
                  Object.keys(this.form.value).forEach((key) => {
                    if (this.form.value[key] !== null && this.form.value[key] !== undefined && this.form.value[key] !== '') {
                      this.renewalInfo.response.policyData[0].HomeAddress[key] = this.form.value[key];
                    }
                  })
                  this.referenceNumber=res.data.referenceNumber;
                }
                console.log('updated',this.renewalInfo);
              },
              (err) => {
                this.toast.error({ detail: "Error", summary: "Failed to Update Address.", duration: 1500 });
                console.log("Error coming from updateaddressApi API", err);}
            );
          } 
          else {
            console.log('Form is invalid');
          }         
         break;
         case 'editNominee':
          this.formId=5001;
          if (event === 'editNominee') {
            this.requestObject.updatedNomineeDetails=JSON.stringify(this.form.value);
            this.requestObject.policyNumber='21-24-0002334-00';
            this.requestObject.referenceNumber=this.referenceNumber;            
            this.renewalService.updatenomineeApi(this.requestObject).subscribe(
             (res:any) => {
              if(res.data.isUpdateSuccess == true){
                Object.keys(this.form.value).forEach((key) => {
                  if (this.form.value[key] !== null && this.form.value[key] !== undefined && this.form.value[key] !== '') {
                    this.renewalInfo.response.policyData[0].Nominee_Details[key] = this.form.value[key];
                  }
                 })
                 this.referenceNumber=res.data.referenceNumber;
              }
             },
             (err) => {
              this.toast.error({ detail: "Error", summary: "Failed to Update Nominee Details.", duration: 1500 });
              console.log("Error coming from updatenomineeApi", err);}
            );
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
   preexistingCondition(value:any){
    this.preexistingConditionSelected=value
    console.log(this.preexistingConditionSelected);
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
 selectButton(value?: any,content? : any,member?:number) {
  if (this.selectedButton === 'primary') {
    if (value == 5005) {
      if (this.renewalInfo?.response?.policyData?.length > 0) {
        this.formObject = {...this.renewalInfo?.response?.policyData[0]?.HomeAddress };
      } 
      this.initializeForm();
      this.formId = value;
    }
    else if (value == 5004) {
      if (this.renewalInfo?.response?.policyData?.length > 0 && content == 'editNominee') {
        this.formObject = {...this.renewalInfo?.response?.policyData[0]?.Nominee_Details};
      } 
      this.initializeForm();
      this.formId = value;
    }
    else if (value == 5003) {
      this.formId = value;
    }
    else if (value == 5002) {
      if (this.renewalInfo?.response?.policyData?.length > 0 && content == 'addMember'){
        this.memberRole='Add';
      this.subObject = Object.keys(this.renewalInfo?.response?.policyData[0]?.Members[member ?? 0] || {})
          .reduce((acc: any, key: any) => { acc[key] = '';return acc; }, {});
      this.formObject = {...this.subObject};
    }
    else if (this.renewalInfo?.response?.policyData?.length > 0 && content == 'editMember'){
      this.memberRole='Update';
      this.formObject = {...this.renewalInfo?.response?.policyData[0]?.Members[member ?? 0]};      
    }
     this.initializeForm();
      this.formId = value;
    }
    else {
      this.formId = 5001; 
    }
  }
  else if (this.selectedButton === 'additional') {
    this.formId = 5001
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
  if(section == 'additional'){ this.formId = 5001;}
   this.activeSection = section;
 }
 proceed(value? :any) {
   if (this.activeSection === 'primary') {
    this.formId = 5001
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
        this.renewalInfo = JSON.parse(res.data);
        this.email=this.renewalInfo?.response?.policyData[0]?.Email
        this.mobileNo=this.renewalInfo?.response?.policyData[0]?.Mobile
        this.selectedTenure = this.renewalInfo?.response?.policyData[0]?.Tenure;
      },
      (err) => {console.log("Error coming from getRenewalInfo API", err);}
    );
  }
  changeroute(){
    this.renewalService.setQuote(this.renewalInfo);
    this.router.navigate(["renewals/subquotes"]);
  }
  getproductdetailsandfeatures(){
    const request={"productId": 2,"agentCode":localStorage.getItem('agentCode')}
    this.renewalService.getproductdetailsandfeatures(request).subscribe(
      (res:any) => { this.optionalCovers=res.data},
      (err) => {console.log("Error coming from getRenewalInfo API", err);}
    );
  }
}