import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RenewalsService } from '../renewals.service';
import { Options } from '@angular-slider/ngx-slider';
import { NgToastService } from 'ng-angular-popup';
import { ClipboardModule } from '@angular/cdk/clipboard'
import { YatraService } from 'src/app/yatra/yatra/yatra.service';

@Component({
  selector: 'app-renewal-dynamic-form',
  templateUrl: './renewal-dynamic-form.component.html',
  styleUrls: ['./renewal-dynamic-form.component.scss']
})
export class RenewalDynamicFormComponent implements OnInit {
  form: FormGroup = this.fb.group({});
  formId: number = 5001;
  // isEditEmail = false;
  // isEditMobile =false;
  // email:any;
  // mobileNo :any;
  selectedButton: string = 'primary'; 
  selectedCoverages: any[] = []; 
  isRadioSelected = false;
  selectedPaymentType: string = '';
  // selectedPaymentTypeLabel: string = '';
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
  agentCode=localStorage.getItem('agentCode');
  productsList:any[]=[];
  hideSection:boolean=true;
  link: string = ''; 
  bankNameList:any

  constructor(
    private fb: FormBuilder,
    private renewalService: RenewalsService,
    private router: Router,
    private toast: NgToastService,
    private ac:ActivatedRoute,
    private yatraService:YatraService) {}

  ngOnInit() {
    this.ac.paramMap.subscribe((params) => {
      const policyNumber = params.get('policyNumber');
      const activeSection= params.get('activeSection')
      if (policyNumber) {
        this.policyNumber = policyNumber;
      }
      if(activeSection){
        if(activeSection == 'payment'){
          this.activeSection=activeSection;
          this.hideSection=false
        }else{
        this.activeSection=activeSection}
      }
    });
    this.renewalService.productsList$.subscribe((productsList) => {
      this.productsList = productsList;
    });
   this.getRenewalInfo();
   this.initializeForm();
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
//  toggleEditPaymentOption(value: any) {
//    if(value == 'email'){
//    this.isEditEmail = !this.isEditEmail;
//    this.isEditMobile = false;
//    } else if(value == 'mobileNo'){
//      this.isEditMobile = !this.isEditMobile;
//      this.isEditEmail=false;
//      }
//  }
//  handlePaymentEvent(value: any) {
//    if (this.email && this.email !== '' && value == 'email') {
//      this.isEditEmail = false;
//    }else if (this.mobileNo && this.mobileNo !== null && value == 'mobileNo') {
//      this.isEditMobile = false;
//    }
//  }
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
  if(option == 'offline'){
    this.yatraService.getAllBankDetails().subscribe({
      next: (res: any) => {
        this.bankNameList = res.data;
        console.log(this.bankNameList);
        
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
   this.selectedPaymentType = option;
  //  this.selectedPaymentTypeLabel = option.label;
  //  this.isDropdownOpen = false; 
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
    this.renewalService.getRenewalInfoApi(this.policyNumber, {}).subscribe(
      (res:any) => {
        console.log("Renewal Info",res);
        this.renewalInfo = JSON.parse(res.data);
        this.getTenureDetails();
        this.getproductdetailsandfeatures();
        this.selectedTenure = this.renewalInfo?.response?.policyData[0]?.Tenure;
      },
      (err) => {console.log("Error coming from getRenewalInfo API", err);}
    );
  }
  getTenureDetails() {
    const productName = this.renewalInfo?.response?.policyData[0]?.Name_of_product;
    if (productName) {
      const matchingProduct = this.productsList.find((product:any) => product.productName === productName);      
      if (matchingProduct) {
        const tenureRequestBody = {
          agentCode: this.agentCode,
          productId: matchingProduct.productId,  
          quoteData: "{\n  \"proposerPincode\": \"500013\",\n  \"typeOfBusiness\": \"NB\",\n  \"isEmployee\": false,\n  \"sumInsured\": \"5000000\",\n  \"numberOfInsuredMembers\": \"1\",\n  \"familySize\": \"1A\",\n  \"proposerName\": \"Manjunath Saukar\",\n  \"mobileNumber\": \"9876543211\",\n  \"memberPolicyType\": \"Multi Individual\",\n  \"insuredMemberDetails\": [\n    {\n      \"roomCategory\": \"\",\n      \"memberAge\": \"43\",\n      \"sumInsured\": \"5000000\",\n      \"isChronic\": \"No\",\n      \"chronicDiseases\": null,\n  \"pincode\": \"360380\",\n     \"zone\": \"Zone II\",\n      \"memberGender\": \"M\",\n      \"memberDob\": \"1980-12-31\",\n      \"memberRelation\": \"self\",\n      \"memberRelationCode\": \"24\",\n      \"covers\": [\n        {\n          \"coverId\": \"CIL\",\n          \"value\": \"1000000\"\n        },\n        {\n          \"coverId\": \"DECOV\",\n          \"value\": \"5000000\"\n        },\n        {\n          \"coverId\": \"SCOP\",\n          \"value\": \"5000000\"\n        },\n        {\n          \"coverId\": \"ANCANC\",\n          \"value\": \"5000000\"\n        },\n        {\n          \"coverId\": \"PCDED\",\n          \"value\": \"15000\"\n        },\n        {\n          \"coverId\": \"PPNDISC\",\n          \"value\": \"\"\n        },\n        {\n          \"coverId\": \"COMV\",\n          \"value\": \"5000000\"\n        },\n        {\n          \"coverId\": \"CANC\",\n          \"value\": \"5000000\"\n        },\n        {\n          \"coverId\": \"RVCV\",\n          \"value\": \"500\"\n        },\n        {\n          \"coverId\": \"TOPD\",\n          \"value\": \"5000000\"\n        },\n        {\n          \"coverId\": \"RRTO\",\n          \"value\": \"YSY\"\n        }\n      ]\n    }\n  ]\n}"
        };  
        this.renewalService.getTenureDetailsApi(tenureRequestBody).subscribe(
          (res) => {
            console.log("Tenure details received:", res);
          },
          (err) => {
            console.error("Error from getTenureDetails API:", err);
          }
        );
      } 
      else {
        console.error("No matching product found for the productName:", productName);
      }
    } 
    else {
      console.error("Product name is not available in renewalInfo.");
    }
  }
  changeroute(){
    this.renewalService.setQuote(this.renewalInfo);
    this.router.navigate(["renewals/subquotes"]);
  }
  getproductdetailsandfeatures() {
    const productName = this.renewalInfo?.response?.policyData?.[0]?.Name_of_product;
    if (productName) {
      const matchingProduct = this.productsList.find((product: any) => product.productName === productName);
      if (matchingProduct) {
        const request = {
          productId: matchingProduct.productId,
          agentCode: this.agentCode
        };  
        this.renewalService.getproductdetailsandfeatures(request).subscribe(
          (res: any) => {
            this.optionalCovers = res.data;
            console.log(res.data);
          },
          (err) => {
            console.error("Error coming from getproductdetailsandfeatures API", err);
          }
        );
      } else {
        console.error(`No matching product found for the product name: ${productName}`);
      }
    } else {
      console.error("Product name is not available in renewalInfo.");
    }
  }  
  sendLink(){
    this.link="https://www.paypal.com/invoice/p/#ABCDEFG123456"
    }

}