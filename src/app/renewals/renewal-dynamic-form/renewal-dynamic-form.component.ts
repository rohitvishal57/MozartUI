import { Component,OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RenewalsService } from '../renewals.service';
import { Options } from '@angular-slider/ngx-slider';
import { NgToastService } from 'ng-angular-popup';
import { YatraService } from 'src/app/yatra/yatra/yatra.service';
import { CommonService } from 'src/app/services/common.service';
import { validationConfig }  from 'src/app/interface/renewal-list.interface';
import { EncryptionService } from 'src/app/services/encryption.service';

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
  healthAddOns:any;
  referenceNumber:any=null;
  selectedTenure: string=''; 
  activeTab: string = 'chronicCondition';
  memberRole: string='';
  kycFlag:any;
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
  submit:boolean=true;
  fileName: string | null = null;
  kycLink:any
  memberDetails:boolean=false;
  
  constructor(
    private fb: FormBuilder,private renewalService: RenewalsService,
    private router: Router,private toast: NgToastService,
    private ac:ActivatedRoute,private yatraService:YatraService,
    private commonService:CommonService,private encryptionService: EncryptionService) {}

  ngOnInit() {    
    this.kycFormGroup = this.fb.group({
      panNumber: ['',[Validators.required, Validators.pattern('[A-Z]{5}[0-9]{4}[A-Z]{1}')]],
      dateOfBirth: ['', [Validators.required,Validators.pattern(/^\d{4}-\d{2}-\d{2}$/)]],
    });
    this.ac.paramMap.subscribe((params) => {
      const policyNumber = this.encryptionService.decrypt(sessionStorage.getItem('policyNumberRen') as string);
      const activeSection = this.encryptionService.decrypt(sessionStorage.getItem('policyActionRen') as string);
      if (policyNumber) {this.policyNumber = policyNumber;}
      if(activeSection){
        if(activeSection == 'payment'){
          this.activeSection='policySummary';
          this.getRenewalInfo();          
          this.hideSection=false;
        }
        else{
          this.getRenewalInfo();
          this.getProducts(); 
          this.activeSection = activeSection;
          // this.loadDataSequentially(activeSection);
        }
      }
      const paymentStatus = this.renewalService.getPaymentStatus();      
      if (paymentStatus === '1') {this.submit = false;
      } else if (paymentStatus === '2') {this.activeSection = 'payment';
      }
    });
   this.selectedSumInsured = this.sliderOptions?.stepsArray?.[4]?.value ?? 0;
 }

//  async loadDataSequentially(activeSection:any) {
//   try {
//     await this.getRenewalInfo();
//     await this.getProducts(); 
//     this.activeSection = activeSection;
//   } catch (error) {
//     console.error("Error loading data:", error);
//   }
// }

  initializeForm() {
    const group: { [key: string]: any } = {};
    if (this.formObject && Object.keys(this.formObject).length > 0) {
      Object.keys(this.formObject).forEach((key: string) => {
        const controlValue = this.formObject[key];
        const validators = validationConfig[key] || [];        
        group[key] = [controlValue || "", validators];
      });
    } else {console.warn('formObject is empty or undefined.');}
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
         if (this.memberRole === 'Add' && this.form.valid) {  
            this.form.value.SumInsured=this.selectedSumInsured;
            this.requestObject.member=JSON.stringify(this.form.value);
            this.requestObject.policyNumber='21-24-0002334-00';
            this.requestObject.referenceNumber=this.referenceNumber; 
            this.requestObject.agentCode="4620973";
            this.requestObject.productId=2;
            this.requestObject.quoteData="";
            console.log("update or add",this.requestObject);
            this.renewalService.updateMemberDetailsApi(this.requestObject).subscribe(
              (res:any) => {
                if(res.data.isUpdateSuccess == true){
                  this.renewalInfo.response.policyData[0].Members.push(this.form.value);
                  const newMemberIndex = this.renewalInfo.response.policyData[0].Members.length - 1;
                  this.renewalInfo.response.policyData[0].Members[newMemberIndex].SumInsured = this.selectedSumInsured;
                  this.referenceNumber=res.data.referenceNumber;
                }
              },
              (err) => {
                this.toast.error({ detail: "Error", summary: "Failed to Add New Member.", duration: 1500 });
              }
            );this.formId=5001;
         } 
         else if (this.memberRole === 'Update' && this.form.valid) {
            this.form.value.SumInsured=this.selectedSumInsured;
            this.requestObject.member=JSON.stringify(this.form.value);
            this.requestObject.policyNumber='21-24-0002334-00';
            this.requestObject.referenceNumber=this.referenceNumber; 
            this.requestObject.agentCode="4620973";
            this.requestObject.productId=2;
            this.requestObject.quoteData="";
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
              },
              (err) => {
                this.toast.error({ detail: "Error", summary: "Failed to Update Member.", duration: 1500 });
                }
            );this.formId=5001;
         } 
         else {console.log('Form is invalid'); return;} 
         break;
       case 'editMember':
        if(this.form.valid){
          this.formId=5001;
        }else{
          console.log('Form is invalid');
          return;
        }
         break;
       case 'editAddress':
         if(this.form.invalid){   
          return;
         }else if (event === 'editAddress' && this.form.valid) {
            this.requestObject.updatedAddress=JSON.stringify(this.form.value);
            this.requestObject.policyNumber=this.policyNumber;
            this.requestObject.referenceNumber=this.referenceNumber; 
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
              },
              (err) => {
                this.toast.error({ detail: "Error", summary: "Failed to Update Address.", duration: 1500 });
                }
            ); this.formId=5001; 
         } 
         else { console.log('Form is invalid' , this.formObject);}    
         break;
        case 'editNominee':
          if (event === 'editNominee' && this.form.valid) {
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
              }
            );this.formId=5001;
          } 
          else {console.log('Form is invalid'); return;} 
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
        this.formObject.nominee_dob=this.formatDate(this.formObject.nominee_dob);
      } 
      this.initializeForm();
      this.formId = value;
    }
    else if (value == 5003) {
      if(this.form.valid){
        this.formId = value;
      }else{
        this.memberDetails=true;
        console.log('Form is invalid');
        return;
      }
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
      console.log(this.formObject);
      console.log(this.renewalInfo);
      this.formObject.DoB =this.formatDate(this.formObject.DoB);
      if (!isNaN(this.formObject?.SumInsured)) {
        const sumInsuredValue = Number(this.formObject.SumInsured);
        const closestValue = this.sliderOptions?.stepsArray?.reduce((prev, curr) => {
          return Math.abs(curr.value - sumInsuredValue) < Math.abs(prev.value - sumInsuredValue) ? curr : prev;});
        this.selectedSumInsured = closestValue?.value ?? 0;
      } else {this.selectedSumInsured = this.sliderOptions?.stepsArray?.[4]?.value ?? 0;}     
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
private formatDate(dateString: string): string {
  if (!dateString) return '';
  return dateString.split('T')[0]; // Extracts just the date part (YYYY-MM-DD)
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
     this.formId = 5001;
     this.setSection('additional');
   } 
   else if (this.activeSection === 'additional') {
     this.formId = 5001;
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
   this.formId = 5001;
   this.setSection('policySummary')
 }
 nextMethod(){
  if(this.activeSection== 'policySummary'){
    if(this.kycFlag == true){
      this.setSection('payment')
    }
    else{
      this.setSection('kyc')
    }
  }
  else if(this.activeSection == 'kyc'){
    if(this.kycData){
      this.setSection('payment')
    }
    else{
      this.toast.error({ detail: 'ERROR',summary: 'Please complete the KYC',duration: 1000});
    }
  } 
  else if(this.activeSection== 'payment' && this.selectedPaymentType == 'offline'){
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
    "quoteNumber": "",
    "orderId": ""
   }
   if (paymentRequestBody.paymentMethod == "E-Nach" || paymentRequestBody.paymentMethod == "E-Mandate" ||
    paymentRequestBody.paymentMethod == "Auto_Debit") {
    this.renewalService.paymentGatewayApi(paymentRequestBody).subscribe({
      next: (response: any) => {
        const paymenturl=response.data.paymentURL
        if (response.isSuccess==true && paymenturl) {
          window.open(paymenturl, '_blank');
        }
        else {
          console.log('Payment initiation failed:', response.message || 'Unknown error');
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
      if(res != null){
      this.getproductdetailsandfeatures();}
    },
    error: (err) => {
       console.log("error coming form getproduct list API");
    }
  })
}

async getRenewalInfo() {
  const base = this.encryptionService.decrypt(sessionStorage.getItem('renewalData') as string);
  this.renewalInfo = JSON.parse(base.data.baseResponse);
  this.kycFlag = base.data.isKYCComplete;
  this.selectedTenure = this.renewalInfo?.response?.policyData[0]?.Tenure;
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
    this.router.navigate(["renewal/quote"]);
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
            const productFeatures = res.data.productFeatures;
            this.optionalCovers = productFeatures.filter((feature: any) => feature.categoryName === 'Optional Covers');
            this.healthAddOns = productFeatures.filter((feature: any) => feature.categoryName === 'Health Add On');
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
    this.link=" "
  }
  handleKyc(action: any) {
        this.kycDetailsSubmitted = true;
        if (this.kycFormGroup.invalid) {
          this.toast.error({ detail: 'ERROR',summary: 'Please enter valid KYC details',duration: 3000});
        } else {
          const reqData = this.kycFormGroup.value;
          this.yatraService.GetKycDetails(reqData).subscribe(
            (response: any) => {
              if (response.isSuccess === true) {
                this.kycData = response.data;
                const kycRequestBody={
                  policy_Number:this.policyNumber
                }
                this.renewalService.kycUpdate(kycRequestBody).subscribe(
                  (res)=>{
                    console.log("Kyc value after kycUpdate call",this.kycData);
                    
                    this.kycFlag=res
                  },
                  (err)=>{console.log(err);}
                )
                this.actionKyc = action;
                this.toast.success({detail: 'SUCCESS',summary: 'KYC Details Fetched Successfully', duration: 1000}); 
             } else if(response.isSuccess === false){
              this.toast.error({detail: 'ERROR',summary: 'Failed to Fetch KYC Details. Please try again later.',duration: 1000});
              this.getkycURL();
             }
             console.log("responsec body",response.isSuccess);
            },
            (error: any) => {
              this.getkycURL();
              this.toast.error({detail: 'ERROR',summary: 'Failed to Fetch KYC Details. Please try again later.',duration: 1000});
            }
          );          
      }
    }
    
    getkycURL(){
      const requestBody = {
        policyNumber: this.policyNumber,fullName: '',  
        panNumber: '', dob: '', pepCheck: '', businessType: "ren"
      };
      this.renewalService.getkycURL(requestBody, { responseType: 'json' }).subscribe(
        (response:any) => {
          this.kycLink = `${response.message}`;
        },
        error => {
          this.kycLink=" "
          console.error('Error:kyc', error);
        }
      );
    }

    onFileSelected(event: any) {
      const file: File = event.target.files[0];
      if (file) {this.fileName = file.name;}
    }

    comeBack(){
      if(this.activeSection == 'policySummary'){
        if(this.hideSection == false){
          this.renewalService.clearPaymentStatus();
          this.router.navigate([`renewal/renewalList`]);
        }else if(this.activeSection == 'policySummary'){
          this.setSection('additional')
        }
      }else if(this.activeSection == 'kyc'){
        this.setSection('policySummary')
      }else if(this.activeSection == "payment"){
        if(this.kycFlag){
          this.setSection('policySummary');
        }else if(!this.kycFlag){
        this.setSection('kyc');
        }
      }
    }
}