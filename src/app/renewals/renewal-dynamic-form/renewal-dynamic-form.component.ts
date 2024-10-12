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
  requestObject: any = {
    policyNumber: '',
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
  referenceNumber:any=null;
  selectedTenure: string=''; 
  baseQuote:string='';
  productId:any;
  healthConditions: string[] = [
    'Asthma',
    'Diabetes',
    'Hyperlipidaemia',
    'Hypertension',
    'PTCA',
    'COPD',
    'HighBMI'
  ];
  preexistingConditionSelected: string = 'no'; 
  member:any;

  constructor(private fb: FormBuilder,private renewalService: RenewalsService,private router: Router) {
  }

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
          subForms[nestedKey] = [controlValue[nestedKey]];  // Assign control value to each nested key
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
         if (event === 'addMember') {
          this.request={...this.requestObject,...this.form.value,
            referenceNumber:this.referenceNumber,SumInsured:this.selectedSumInsured,
            BaseQuote:this.baseQuote,ProductId:this.productId
           }
           this.request.policyNumber='21-24-0002334-00';
           console.log(this.request);
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
          this.request={...this.requestObject,...this.form.value,referenceNumber:this.referenceNumber
         }
         this.request.policyNumber='21-24-0002334-00';
         this.renewalService.updateaddressApi(this.request).subscribe(
          (res:any) => {
            this.renewalInfo = JSON.parse(res.data);
            console.log('updated',this.renewalInfo);
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
           this.request={...this.requestObject,...this.form.value,referenceNumber:this.referenceNumber
            }
            this.request.policyNumber='21-24-0002334-00';
            this.renewalService.updatenomineeApi(this.request).subscribe(
             (res:any) => {
               this.renewalInfo = JSON.parse(res.data);
               console.log('nominee',this.renewalInfo);
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
        this.subObject = { ...this.renewalInfo?.response?.policyData[0]?.HomeAddress };
        this.formObject = {
          Home_Address_1: this.subObject.Home_Address_1 || '',
          Home_Address_2: this.subObject.Home_Address_2 || '',
          Home_State: this.subObject.Home_State || '',
          Home_City: this.subObject.Home_City || '',
          Home_Pincode: this.subObject.Home_Pincode ||'',
       };
      } this.initializeForm();
      this.formId = value;
    }
    else if (value == 5004) {
      if (this.renewalInfo?.response?.policyData?.length > 0 && content == 'editNominee') {
        const nomineeDetails = this.renewalInfo?.response?.policyData[0]?.Nominee_Details;
        this.formObject = {
          nominee_first_name: nomineeDetails.nominee_first_name || '',
          nominee_last_name: nomineeDetails.nominee_last_name || '',
          nominee_dob: nomineeDetails.nominee_dob|| '',
          Nominee_Contact_No: nomineeDetails.Nominee_Contact_No || '',
          Relationship: nomineeDetails.Relationship || '',
          nominee_middle_name: '',
          nominee_mobile_number: '',
          nominee_emergencyPhoneNumber:'',
          nominee_email_address:'',
          nonimee_relationship_code:''
        };
      } 
      this.initializeForm();
      this.formId = value;
    }
    else if (value == 5003) {
      if (this.renewalInfo?.response?.policyData?.length > 0) {
        this.subObject = { ...this.renewalInfo?.response?.policyData[0]?.Members[member ?? 0] };
        this.formObject = {...this.subObject,
        Name: this.subObject.Name,
        idtype: this.subObject.Name,
        air: this.subObject.Name,
      };
    }
    console.log(this.subObject);
    
    this.initializeForm();
      this.formId = value;
    }
    else if (value == 5002) {
      this.formObject = {
        Name: '',
        weight: '',
        height: '',
        heightin: '',
        Gender: '',
        DoB: '',
        IdProof: '',
        IdProofNumber:'',
        AnnualIncome: '',
        occupation: '',
        education: '',
      };
      
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
        console.log("Renewal Info",res);
        console.log(JSON.parse("{\"productName\":\"Activ One Max\",\"exisitingPolicy\":\"no\",\"isAdityaBirlaPolicy\":null,\"policyNumber\":null,\"getPolicyDetails\":null,\"previousDocumentPara\":null,\"policyDocumentUpload\":null,\"memberDobProposer\":\"1999-07-10\",\"panNo\":\"CBGPJ2411M\",\"verifyKYC\":null,\"productVariant\":\"Max Plus\",\"isEmployee\":false,\"typeOfBusiness\":\"NB\",\"memberPlan\":\"Max Plus\",\"productType\":\"AO\",\"planCode\":\"MASSMARKET_PLUS\",\"productId\":\"7200\",\"preFix\":\"Mr\",\"firstName\":\"PRATIK\",\"middleName\":\"NITIN\",\"lastName\":\"JADHAV\",\"memberAgeProposer\":25,\"proposerGender\":\"M\",\"emailId\":\"pratik@gmail.com\",\"proposerAddress1\":\"S/O: NITIN JADHAV, 402, ARJUN SMRUTI, KALYAN\",\"proposerAddress2\":\"ROAD, GOPAL NAGAR, DOMBIVALI EAST, KALYAN\",\"proposerAddress3\":\"NEAR JANKI HOTEL\",\"city\":\"Thane\",\"country\":\"IN\",\"state\":\"MH\",\"mobileNumber\":\"7738030781\",\"idProof\":\"{\\\"id\\\":\\\"2\\\",\\\"value\\\":\\\"Aadhar Card\\\",\\\"name\\\":\\\"Aadhar Card\\\"}\",\"idNo\":\"7161\",\"annualIncome\":\"500000\",\"occupation\":\"{\\\"id\\\":\\\"O556\\\",\\\"value\\\":\\\"Self Employed\\\",\\\"name\\\":\\\"Self Employed\\\"}\",\"maritalStatus\":\"{\\\"id\\\":\\\"S\\\",\\\"value\\\":\\\"Single\\\",\\\"name\\\":\\\"Single\\\"}\",\"educationDetails\":\"{\\\"id\\\":\\\"6\\\",\\\"value\\\":\\\"Post Graduate\\\",\\\"name\\\":\\\"Post Graduate\\\"}\",\"nationality\":\"{\\\"id\\\":\\\"1\\\",\\\"value\\\":\\\"Indian\\\",\\\"name\\\":\\\"Indian\\\",\\\"selected\\\":true}\",\"sumInsured\":\"2000000\",\"pincode\":\"421201\",\"zone\":null,\"zoneValue\":\"\",\"horizontalLine\":null,\"addMembers\":null,\"insureMem\":null,\"numberOfInsuredMembers\":1,\"plandetails\":\"\",\"totalPremium\":\"\",\"next\":null,\"memberPolicyType\":\"Multi Individual\",\"insuredMembers.Self\":true,\"insuredMembers.Spouse\":false,\"insuredMembers.Son1\":false,\"insuredMembers.Daughter1\":false,\"insuredMembers.Mother\":false,\"insuredMembers.Father\":false,\"insuredMembers.Mother-In-Law\":false,\"insuredMembers.Father-In-Law\":false,\"insuredMemberDetails.0.relationshipType\":\"{\\\"id\\\":\\\"R001\\\",\\\"value\\\":\\\"Self\\\",\\\"name\\\":\\\"Self\\\",\\\"isIncrement\\\":false,\\\"imagePath\\\":\\\"assets/Self.png\\\"}\",\"insuredMemberDetails.0.relation\":\"Self\",\"insuredMemberDetails.0.memberdob\":\"1999-07-10\",\"insuredMemberDetails.0.memberAge\":25,\"insuredMemberDetails.0.firstName\":\"PRATIK\",\"insuredMemberDetails.0.lastName\":\"JADHAV\",\"insuredMemberDetails.0.middleName\":\"NITIN\",\"insuredMemberDetails.0.mobileNumber\":\"7738030781\",\"insuredMemberDetails.0.emailId\":\"pratik@gmail.com\",\"insuredMemberDetails.0.memberGender\":\"M\",\"insuredMemberDetails.0.sumInsured\":\"2000000\",\"insuredMemberDetails.0.pincode\":\"500013\",\"insuredMemberDetails.0.planType\":\"Multi Individual\",\"insuredMemberDetails.0.memberIndex\":0,\"insuredMemberDetails.0.city\":\"Hyderabad\",\"insuredMemberDetails.0.zone\":\"Zone II\",\"insuredMemberDetails.0.zoneValue\":\"Z002\",\"insuredMemberDetails.0.state\":\"TELANGANA\",\"insuredMemberDetails.0.covers\":[],\"insuredMembers\":{\"Self\":true,\"Spouse\":false,\"Son1\":false,\"Daughter1\":false,\"Mother\":false,\"Father\":false,\"Mother-In-Law\":false,\"Father-In-Law\":false},\"insuredMemberDetails\":[{\"relationshipType\":\"{\\\"id\\\":\\\"R001\\\",\\\"value\\\":\\\"Self\\\",\\\"name\\\":\\\"Self\\\",\\\"isIncrement\\\":false,\\\"imagePath\\\":\\\"assets/Self.png\\\"}\",\"relation\":\"Self\",\"memberdob\":\"1999-07-10\",\"memberAge\":25,\"firstName\":\"PRATIK\",\"lastName\":\"JADHAV\",\"middleName\":\"NITIN\",\"mobileNumber\":\"7738030781\",\"emailId\":\"pratik@gmail.com\",\"memberGender\":\"M\",\"sumInsured\":\"2000000\",\"pincode\":\"500013\",\"planType\":\"Multi Individual\",\"memberIndex\":0,\"city\":\"Hyderabad\",\"zone\":\"Zone II\",\"zoneValue\":\"Z002\",\"state\":\"TELANGANA\",\"covers\":[],\"isChronic\":\"No\",\"chronicDiseases\":null,\"roomCategory\":\"\",\"memberRelationCode\":24}],\"familySize\":\"1A\",\"proposerName\":\"PRATIKJADHAV\",\"proposerPincode\":\"500013\"}"
      
      ));
        
        this.renewalInfo = JSON.parse(res.data);
        this.email=this.renewalInfo?.response?.policyData[0]?.Email
        this.mobileNo=this.renewalInfo?.response?.policyData[0]?.Mobile
        this.selectedTenure = this.renewalInfo?.response?.policyData[0]?.Tenure;
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