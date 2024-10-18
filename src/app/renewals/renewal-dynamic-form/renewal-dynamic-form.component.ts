import { Component,OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RenewalsService } from '../renewals.service';
import { Options } from '@angular-slider/ngx-slider';
import { NgToastService } from 'ng-angular-popup';
import { ClipboardModule } from '@angular/cdk/clipboard'
import { YatraService } from 'src/app/yatra/yatra/yatra.service';
import { CommonService } from 'src/app/services/common.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-renewal-dynamic-form',
  templateUrl: './renewal-dynamic-form.component.html',
  styleUrls: ['./renewal-dynamic-form.component.scss']
})
export class RenewalDynamicFormComponent implements OnInit {
  form: FormGroup = this.fb.group({});
  formId: number = 5001;
  selectedButton: string = 'primary'; 
  selectedCoverages: any[] = []; 
  isRadioSelected = false;
  selectedPaymentType: string = '';
  policySummary : boolean=false
  activeSection: string = 'primary';
  policyNumber:string=''; 
  renewalInfo: any;
  formObject: any = {};
  subObject:any = {};
  selectedSumInsured: any;
  optionalCovers:any;
  referenceNumber:any=null;
  selectedTenure: string=''; 
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
  bankNameList:any;
  kycData:any
  kycFormGroup!: FormGroup;
  kycDetailsSubmitted = false;
  actionKyc:number=3002;
  // payNow:any;
  submit:boolean=true;
  fileName: string | null = null;

  constructor(
    private fb: FormBuilder,
    private renewalService: RenewalsService,
    private router: Router,
    private toast: NgToastService,
    private ac:ActivatedRoute,
    private yatraService:YatraService,
  private commonService:CommonService,
  private spinner: NgxSpinnerService) {}

  ngOnInit() {
    this.kycFormGroup = this.fb.group({
      panNumber: ['',[Validators.required, Validators.pattern('[A-Z]{5}[0-9]{4}[A-Z]{1}')]],
      dateOfBirth: ['', [Validators.required,Validators.pattern(/^\d{4}-\d{2}-\d{2}$/)]],
    });
    this.ac.paramMap.subscribe((params) => {
      const policyNumber = params.get('policyNumber');
      const activeSection= params.get('activeSection')
      if (policyNumber) {
        this.policyNumber = policyNumber;
      }
      if(activeSection){
        if(activeSection == 'payment'){
          this.activeSection='policySummary';
          this.hideSection=false
        }else{this.activeSection=activeSection}
      }
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
      } else {group[key] = [controlValue]; }
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
         else {console.log('Form is invalid');} 
         break;
       case 'editMember':
         this.formId=5001;
         break;
       case 'editAddress':
         this.formId=5001;
         if (event === 'editAddress') {
            this.requestObject.updatedAddress=JSON.stringify(this.form.value);
            this.requestObject.policyNumber=this.policyNumber;
            this.requestObject.referenceNumber=this.referenceNumber; 
            console.log("editAddress",this.requestObject);
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
         else {console.log('Form is invalid');}         
         break;
        case 'editNominee':
          this.formId=5001;
          if (event === 'editNominee') {
            this.requestObject.updatedNomineeDetails=JSON.stringify(this.form.value);
            this.requestObject.policyNumber='21-24-0002334-00';
            this.requestObject.referenceNumber=this.referenceNumber;  
            console.log("updateNominee",this.requestObject);
                      
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
          else {console.log('Form is invalid');} 
          break; 
        case 'summary':
          this.activeSection='primary'
          break;
        case 'editBankDetails':
          this.formId=5001;
          break;  
        case 'cancel':
          this.formId=5001;
          break;
        default:
         console.warn('Unknown action:', event);
     }
  }
  preexistingCondition(value:any){
   this.preexistingConditionSelected=value
  }
 selectButton(value?: any,content? : any,member?:number) {
  if (this.selectedButton === 'primary') {
    if (value == 5006) {
      if (this.renewalInfo?.response?.policyData?.length > 0) {
        this.formObject = {...this.renewalInfo?.response?.policyData[0]?.HomeAddress };
      } 
      this.initializeForm();
      this.formId = value;
    }
    else if (value == 5005) {
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
    this.selectedPaymentType = option;
    this.yatraService.getAllBankDetails().subscribe({
      next: (res: any) => {this.bankNameList = res.data;},
      error: (err) => {console.error(err);}
    });
  }
  if(option == 'E-Nach' || option == 'E-Mandate' || option == 'Auto_Debit'){
    this.selectedPaymentType = option;
    console.log("payment type",this.selectedPaymentType);
  }
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
  console.log("active section",this.activeSection);
  
 }
 renewNow() {
   this.setSection('policySummary')
 }
 next1(){
  if(this.activeSection== 'policySummary'){
    this.setSection('kyc')
  }
  else if(this.activeSection== 'kyc'){
    if(this.kycData){
      this.setSection('payment')
    }
    else{
      this.toast.error({ detail: 'ERROR',summary: 'Please complete the KYC',duration: 1000});
    }
  } else if(this.activeSection== 'payment' && this.selectedPaymentType == 'offline'){
    this.submit=false
  }
}
payNow(){
   const paymentRequestBody={
    "agentcode": this.agentCode,
    "proposalNumber": this.policyNumber,
    "paymentMethod": this.selectedPaymentType,
    "source": "Retail",
    "policyType": "Renewal",
    "policyNumber": "",
    "quoteNumber": ""
   }
   if (paymentRequestBody.paymentMethod == "E-Nach" ||
    paymentRequestBody.paymentMethod == "E-Mandate" ||
    paymentRequestBody.paymentMethod == "Auto_Debit") {
    console.log("if calling",paymentRequestBody.paymentMethod);
    console.log("KYC completed",this.kycData);
    this.renewalService.paymentGatewayApi(paymentRequestBody).subscribe({
      next: (response: any) => {
        if (response.isSuccess==false && response.paymentURL) {
          window.open(response.paymentURL, '_blank');
        }
        else {
          console.log('Payment initiation failed:', response.errorMessage || 'Unknown error');
        }
      },
      error: (error: any) => {
        this.toast.error({ detail: 'ERROR',summary: 'Failed to payment ',duration: 3000});
      }
    });
   }
}
 getProducts() {
  const reqData={
    "agentCode": this.agentCode
  }
  this.commonService.Getproductlist(reqData).subscribe({
    next: (res) => {
      this.productsList = res.data;
      this.getTenureDetails();
      this.getproductdetailsandfeatures();
      console.log("products list",this.productsList);
    },
    error: (err) => {
       console.log("error coming form getproduct list API");
    }
  })
}
getRenewalInfo() {
    this.renewalService.getRenewalInfoApi(this.policyNumber, {}).subscribe(
      (res:any) => {
        console.log("Renewal Info",res);
        this.renewalInfo = JSON.parse(res.data);
        this.getProducts();
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
    handleKyc(action: any) {
      if (action === 3001) {
        // Handle action 3001
      } else if (action === 3002) {
        this.actionKyc = action;
      } else if (action === 3003) {
        this.kycDetailsSubmitted = true;
        if (this.kycFormGroup.invalid) {
          console.log("Form is invalid");
          this.toast.error({ detail: 'ERROR',summary: 'Please enter valid KYC details',duration: 3000});
        } else {
          const reqData = this.kycFormGroup.value;
          console.log("KYC request body", reqData);    
          this.yatraService.GetKycDetails(reqData).subscribe(
            (response: any) => {
              console.log("responsec body",response.success);
              if (response.success === true) {
                this.kycData = response.data;
                this.actionKyc = action;
                console.log("responsec body(if)",response.success);
                this.toast.success({detail: 'SUCCESS',summary: 'KYC Details Fetched Successfully', duration: 1000}); 
             } 
             console.log("responsec body",response.success);
            },
            (error: any) => {
              console.log("error body",error);
              this.toast.error({detail: 'ERROR',summary: 'Failed to Fetch KYC Details. Please try again later.',duration: 1000});
            }
          );          
        }
      }
    }
    onFileSelected(event: any) {
      const file: File = event.target.files[0];
      if (file) {
        this.fileName = file.name;
      }
    }
    comeBack(){
      if(this.activeSection == 'policySummary'){
      }else if(this.activeSection == 'kyc'){
          if(this.actionKyc == 3002){
            this.setSection('policySummary')
          }else if(this.actionKyc == 3003){
            this.actionKyc = 3002;
          }
      }else if(this.activeSection == "payment"){
        this.setSection('kyc');
      }

    }
}