import { Component,OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
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
  kycData:any
  kycFormGroup!: FormGroup;
  kycDetailsSubmitted = false;
  actionKyc:number=3002;
  submit:boolean=true;
  fileName: string | null = null;
  kycLink:any;
  memberDetails:boolean=false;
  activeAction:any;
  offlinePaymentForm!: FormGroup;
  bankNameList:any[]=[];
  bankNameControl = new FormControl('');
  filteredBankNamesList:any[]=[];
  currentDate = new Date().toISOString().split('T')[0];
  isFeedBackModalVisible :Boolean= false;
  customerFeedbackForm !: FormGroup;
  formIndexValue: number = 0;
  stars: number[] = [1, 2, 3, 4, 5]; // Array for star ratings
  rating: number = 0; // Holds the current selected rating
  feedbackImpressedValues: String[] = ['Seamless payment', 'Ease of policy modification', 'Speedy Policy renewal', 'Payment receipt & confirm']
  feedBackMessage: boolean = false;
  impressedValues: boolean = false;
  feedbackSubmit: boolean = false;
  impressedLable: String = "";
  feedbackImpressedValue: String = '';
  fullQuoteResponse:any;
  file!: File;
  selectedOptionalCoverages: string[] = ["Personal Accident", "Annual Screening Package for Cancer Diagnosed Patients"];
  selectedHealthAddons: string[] = ["Vaccine Cover"];
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
      this.policyNumber = this.encryptionService.decrypt(sessionStorage.getItem('policyNumberRen') as string);
      this.activeAction = this.encryptionService.decrypt(sessionStorage.getItem('policyActionRen') as string);
      if(this.activeAction){
        if(this.activeAction== 'withoutmodify'){
          this.setSection('payment')
          this.getRenewalInfo(); 
        }
        else{
          this.getRenewalInfo(); 
          this.getProducts();
        }
      }
    });
   this.selectedSumInsured = this.sliderOptions?.stepsArray?.[4]?.value ?? 0;
   this.bankNameControl.valueChanges.subscribe(value => this.filterBankList(value));
   this.customerFeedbackForm = this.fb.group({
    message: [''],
    rating: [null, Validators.required], 
  });
 }
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
                this.toast.error({ detail: "", summary: "Failed to Add New Member.", duration: 1500 });
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
                this.toast.error({ detail: "", summary: "Failed to Update Member.", duration: 1500 });
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
                this.toast.error({ detail: "", summary: "Failed to Update Address.", duration: 1500 });
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
              this.toast.error({ detail: "", summary: "Failed to Update Nominee Details.", duration: 1500 });
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
  preExistingCondition(value:any){
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
  return dateString.split('T')[0]; 
}
 selectPaymentType(option: any) {
  if(option == 'offline'){
    this.formObject = {
      paymentOption: '',
      chequeAmount: this.renewalInfo?.response?.policyData[0]?.NetPremium || '',
      chequeNumber: '',
      chequeDate: '',
      ifscCode: '',
      bankNameControl: '',
      file: null
    };
    this.initializeForm();
    this.selectedPaymentType = option;
    this.yatraService.getAllBankDetails().subscribe({
      next: (res: any) => {
        console.log("bank names list",res.data);
        this.bankNameList = res.data;
        this.filteredBankNamesList = this.bankNameList;
      },
      error: (err) => {console.error(err);}
    });
  }
  else if(option == 'online' || option == 'E-Mandate' || option == 'Auto_Debit'){
    this.selectedPaymentType = option;
    const paymentRequestBody={
      "agentcode": this.agentCode,
      "proposalNumber": "",
      "paymentMethod": this.selectedPaymentType,
      "source": "Retail",
      "policyType": "Renewal",
      "policyNumber": this.policyNumber,
      "quoteNumber": "",
      "orderId": ""
     }
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
          this.toast.error({ detail: '',summary: 'Failed to payment.',duration: 3000});
        }
      });
     }  
 }
 filterBankList(event: any): void {
  const input = (event.target as HTMLInputElement).value.toLowerCase();
  const allowedKeys = ['Backspace', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
  const regex = /^[a-zA-Z]$/;   
  if (!allowedKeys.includes(event.key) && !regex.test(event.key)) {
    event.preventDefault();
    return;
  }
  this.filteredBankNamesList = this.bankNameList.filter((bank: any) =>
    bank.name.toLowerCase().includes(input)
  );
  console.log("input value", input);
  console.log("filtered names", this.filteredBankNamesList);
}
onBankNameSelected(selectedBankName: string): void {
  this.form.get('bankNameControl')?.setValue(selectedBankName);
  console.log("selected bank name", this.form.get('bankNameControl')?.value);
}
 setSection(section: string) {
   this.activeSection = section;
 }
 goNext(){
  if(this.activeSection== 'primary'){
    this.setSection('additional')
  }
  else if(this.activeSection == 'additional'){
    this.setSection('policySummary')
  } 
  else if(this.activeSection== 'policySummary'){
    this.setSection('payment')
  }else if(this.activeSection == 'payment'){
    if(this.selectedPaymentType == 'offline' && !this.form.valid){
      this.form.markAllAsTouched();
      return;
    }
    // const offlinePaymentRequestBody = {
    //   "policyType": "Renewal",
    //   "paymentMethod": "Offline",
    //   "paymentOption": this.form.value.paymentOption.toString(),
    //   "premiumAmount": this.form.value.chequeAmount.toString(),
    //   "checkNo": this.form.value.chequeNumber.toString(),
    //   "checkDate": this.form.value.chequeDate.toString(),
    //   "policyNumber": this.policyNumber.toString(),
    //   "agentCode": this.agentCode?.toString(),
    //   "bankName": this.form.value.bankNameControl.toString(),
    //   "ifsc": this.form.value.ifscCode.toString(),
    //   "formFile": []
    // };
    // console.log("offlinePaymentRequestBody",offlinePaymentRequestBody);
    const checkNumber= this.form.value.chequeNumber.toString()
    const checkAmount= this.form.value.chequeAmount.toString()
    console.log(checkAmount,checkNumber);
    
    const data = new FormData();
    data.append("policyType", "Renewal");
    data.append("paymentMethod", "Offline");
    data.append("paymentOption", this.form.value.paymentOption);
    data.append("premiumAmount", checkAmount);
    data.append("checkNo", checkNumber);
    data.append("checkDate", this.form.value.chequeDate);
    data.append("policyNumber", this.policyNumber);
    data.append("agentCode", this.agentCode|| "");
    data.append("bankName", this.form.value.bankNameControl);
    data.append("ifsc", this.form.value.ifscCode);
    data.append('formFile', this.file);
    console.log("uploaded file",this.file);
    console.log("data",data);
        // this.renewalService.getFullQuoteApi(offlinePaymentRequestBody).subscribe(
      this.renewalService.getFullQuoteApi(data).subscribe(
      (res:any)=>{
        if(res.isSuccess){
          console.log("offline payment reponse",res.data);
          this.fullQuoteResponse=res.data;          
          this.setSection('thankyou')
          this.hideSection=false
          this.isFeedBackModalVisible = true;
        }
        else{
          this.toast.error({ detail: '',summary:res.message,duration: 3000});
        }
      },
      (err)=>{
        this.toast.error({ detail: '',summary: 'Failed to do offline payment.',duration: 3000});
        console.log("error is coming from fullquote api");
    })
  }
}
comeBack(){
  if(this.activeAction=='withoutmodify'){
    if(this.activeSection == 'payment'){
      this.router.navigate(['renewal/renewalList'])
    }else if(this.activeSection == 'additional'){
      this.setSection('primary')
    }else if(this.activeSection == "policySummary"){
      this.setSection('additional')
    }
  }
  else{
    if(this.activeSection == 'primary'){
      this.router.navigate(['renewal/renewalList'])
    }else if(this.activeSection == 'additional'){
      this.setSection('primary')
    }else if(this.activeSection == "policySummary"){
      this.setSection('additional')
    }else if(this.activeSection == 'payment'){
      this.setSection('policySummary')
    }
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
  console.log(this.renewalInfo);
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
  getproductdetailsandfeatures() {
    const productName = this.renewalInfo?.response?.policyData?.[0]?.Name_of_product;    
    if (productName) {
      const matchingProduct = this.productsList.find((product: any) => product.productName === productName);
      // if (matchingProduct) {
        if(true){          
        const request = {
          // productId: matchingProduct.productId,
          productId:1,
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
          this.toast.error({ detail: '',summary: 'Please enter valid KYC details.',duration: 3000});
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
                this.toast.success({detail: '',summary: 'KYC Details Fetched Successfully.', duration: 1000}); 
             } else if(response.isSuccess === false){
              this.toast.error({detail: '',summary: 'Failed to Fetch KYC Details,Please try again later.',duration: 1000});
              this.getkycURL();
             }
             console.log("responsec body",response.isSuccess);
            },
            (error: any) => {
              this.getkycURL();
              this.toast.error({detail: '',summary: 'Failed to Fetch KYC Details,Please try again later.',duration: 1000});
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
    setRating(star: number) {
      this.rating = star;
      this.customerFeedbackForm.patchValue({ rating: this.rating }); // Update form with rating
      this.feedbackSubmit = true;
      this.impressedValues = true;
      if (star > 3) {
        this.impressedLable = 'What Impressed you ?';
        this.feedBackMessage = false;
      } else {
        this.impressedLable = 'Why aren\'t you happy?';
        this.feedBackMessage = true;
      }
    }
    submitFeedback() {
      let reqData: any = {};
      reqData.agentCode = this.agentCode;
      reqData.rating = this.customerFeedbackForm.value.rating;
      reqData.remarks = this.feedbackImpressedValue + ":" + this.customerFeedbackForm.value.message;
      reqData.customerId = "";
      this.yatraService.submitFeedback(reqData).subscribe((response) => {
        this.toast.success({ detail: 'Feedback submitted successfully! Thank you for your input.' });
      }, (error) => {
        this.toast.error({ detail: 'Failed to submit feedback. Please try again later.' });
      });
      // this.customerFeedbackModule.hide();
      this.isFeedBackModalVisible = false;
    }
    closeIsFeedBackModalVisible(){
      this.isFeedBackModalVisible = false;
    }
    onSelectValue(value: String) {
      this.feedbackImpressedValue = value;
    }
    onFileSelected(event: any) {
      this.file = event.target.files
      console.log('filetr',this.file);
      
      this.file = event.target.files[0];
      const maxSizeInBytes = 3 * 1024 * 1024; // 3MB
      const allowedFileTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];
      if (this.file) {
        this.fileName = this.file.name;
      }
      console.log("file",this.file);
    }
    
}