import { Component, OnInit } from "@angular/core";
import { FormBuilder,FormControl,FormGroup,Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { RenewalsService } from "../renewals.service";
import { NgToastService } from "ng-angular-popup";
import { YatraService } from "src/app/yatra/yatra/yatra.service";
import { CommonService } from "src/app/services/common.service";
import { validationConfig } from "src/app/interface/renewal-list.interface";
import { EncryptionService } from "src/app/services/encryption.service";
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: "app-renewal-dynamic-form",
  templateUrl: "./renewal-dynamic-form.component.html",
  styleUrls: ["./renewal-dynamic-form.component.scss"],
})
export class RenewalDynamicFormComponent implements OnInit {
  form: FormGroup = this.fb.group({});
  formId: number = 5001;
  selectedButton: string = "primary";
  selectedCoverages: any[] = [];
  selectedPaymentType: string = "";
  policySummary: boolean = false;
  activeSection: string = "primary";
  policyNumber: string = "";
  renewalInfo: any;
  renewalBaseObject: any;
  formObject: any = {};
  subObject: any = {};
  optionalCovers: any[] = [];
  healthAddOns: any;
  referenceNumber: any = null;
  selectedTenure: string = "";
  activeTab: string = "chronicCondition";
  kycFlag: any;
  preexistingConditionSelected: string = "no";
  healthConditions: string[] = ["Asthma","Diabetes","Hyperlipidaemia","Hypertension","PTCA","COPD","HighBMI" ];
  requestObject: any = { policyNumber: "string", referenceNumber: "string" };
  agentCode = localStorage.getItem("agentCode");
  productsList: any[] = [];
  hideSection: boolean = true;
  link: string = "";
  kycData: any;
  kycFormGroup!: FormGroup;
  kycDetailsSubmitted = false;
  actionKyc: number = 3002;
  submit: boolean = true;
  fileName: string | null = null;
  kycLink: any;
  memberDetails: boolean = false;
  activeAction: any;
  offlinePaymentForm!: FormGroup;
  bankNameList: any[] = [];
  cityNameList: any[] = [];
  branchNameList: any[] = [];
  filteredBankNamesList: any[] = [];
  filteredCitiesList: any[] = [];
  filteredBranchList: any[] = [];
  currentDate = new Date().toISOString().split("T")[0];
  isFeedBackModalVisible: Boolean = false;
  customerFeedbackForm!: FormGroup;
  formIndexValue: number = 0;
  stars: number[] = [1, 2, 3, 4, 5];
  rating: number = 0;
  feedbackImpressedValues: String[] = [ "Seamless payment","Ease of policy modification","Speedy Policy renewal","Payment receipt & confirm"];
  feedBackMessage: boolean = false;
  impressedValues: boolean = false;
  feedbackSubmit: boolean = false;
  impressedLable: String = "";
  feedbackImpressedValue: String = "";
  fullQuoteResponse: any;
  file!: File;
  selectedOptionalCoverages: string[] = [ "Personal Accident","Annual Screening Package for Cancer Diagnosed Patients",];
  selectedHealthAddons: string[] = ["Vaccine Cover"];
  tenureDetail: any;
  chronicApplication: FormGroup = this.fb.group({});
  PreExistingDiseases: FormGroup = this.fb.group({});
  selectedBankId!: string;
  selectedCityId!: string;
  bankDetailsObject = { accountHolderName: "",accountNo: "",accountType: "",bankName: "",bankCity: "",bankBranch: "",ifscCode: "",micrCode: ""};
  documentId: any;
  showAppointee: boolean = false;
  isMemberRadioSelected: boolean = false;
  selectedCheckboxes: Set<number> = new Set<number>();


  constructor( private fb: FormBuilder,private renewalService: RenewalsService,private router: Router,
    private toast: NgToastService,private ac: ActivatedRoute,private yatraService: YatraService,
    private commonService: CommonService,private encryptionService: EncryptionService,
    private languageService: LanguageService, private translateService: TranslateService) {
  }

  ngOnInit() {
    this.languageService.language$.subscribe(lang => {
      this.translateService.use(lang).subscribe({
        error: () => {
          this.translateService.use('en'); 
        }
      });
    });
    this.kycFormGroup = this.fb.group({
      panNumber: ["",[Validators.required, Validators.pattern("[A-Z]{5}[0-9]{4}[A-Z]{1}")],],
      dateOfBirth: ["",[Validators.required, Validators.pattern(/^\d{4}-\d{2}-\d{2}$/)],],
    });
    this.ac.paramMap.subscribe((params) => {
      this.policyNumber = this.encryptionService.decrypt(sessionStorage.getItem("policyNumberRen") as string);
      this.activeAction = this.encryptionService.decrypt(sessionStorage.getItem("policyActionRen") as string);
      if (this.activeAction) {
        if (this.activeAction == "withoutmodify") {
          this.getRenewalInfo();
          if(this.renewalInfo?.response?.policyData[0]?.CKYC_Number){
            this.setSection("payment");
          } else {
            this.setSection("kyc")
          }
        } else {
          this.getRenewalInfo();
        }
      }
    });
    this.customerFeedbackForm = this.fb.group({
      message: [""],
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
    } else {
      console.warn("formObject is empty or undefined.");
    }
    this.form = this.fb.group(group);
  }

  async getRenewalInfo() {
    const base = this.encryptionService.decrypt(sessionStorage.getItem("renewalData") as string);
    this.renewalInfo = JSON.parse(base.data.baseResponse);
    this.renewalBaseObject = this.renewalInfo;
    this.kycFlag = base.data.isKYCComplete;
    this.selectedTenure = this.renewalInfo?.response?.policyData[0]?.Tenure;
  }

  selectButton(value?: any, content?: any, member?: number) {
    if (this.selectedButton === "primary") {
      if (value == 5006) {
        this.formId =value;        
        if(this.bankDetailsObject.bankName==""){
          this.getBankDetails();
        }
        this.formObject = this.bankDetailsObject;        
        this.initializeForm();
      } else if (value == 5005) {
        if (this.renewalInfo?.response?.policyData?.length > 0) {
          this.formObject = { ...this.renewalInfo?.response?.policyData[0]?.HomeAddress,};
        }
        this.initializeForm();
        this.formId = value;
      } else if (value == 5004) {
        if (this.renewalInfo?.response?.policyData?.length > 0 && content == "editNominee") {
           this.formObject = {...this.renewalInfo?.response?.policyData[0]?.Nominee_Details};
          this.formObject.nominee_dob = this.formatDate(this.formObject.nominee_dob);
        }
        this.initializeForm();
        this.checkNomineeAge()
        this.formId = value;
      } else if (value == 5003) {
        if (this.form.valid) {
          this.formId = value;
          this.PreExistingDiseases = this.fb.group({
            Asthma: ["N"],Diabetes: ["N"],Hyperlipidaemia: ["N"],Hypertension: ["N"],PTCA: ["N"],COPD: ["N"],HighBMI: ["N"],
          });
        } else {
          this.memberDetails = true;
          return;
        }
      } else if (value == 5002) {
        if ( this.renewalInfo?.response?.policyData?.length > 0 && content == "addMember" ) {
          this.subObject = Object.keys( this.renewalInfo?.response?.policyData[0]?.Members[member ?? 0] ||
              {} ).reduce((acc: any, key: any) => {
            const value = this.renewalInfo?.response?.policyData[0]?.Members[member ?? 0][ key ];
            if (key === "MemberproductComponents") {
              acc[key] = value;
              return acc;
            }
            if (Array.isArray(value)) {
              acc[key] = [];
            } else if (value !== null && typeof value === "object") {
              acc[key] = Object.keys(value).reduce( (nestedAcc: any, nestedKey: any) => { nestedAcc[nestedKey] = ""; return nestedAcc; }, {} );
            } else {
              acc[key] = "";
            }
            return acc;
          }, {});
          this.formObject = { ...this.subObject };
          this.chronicApplication = this.fb.group({
            highBlood: [false],asthma: [false],diabetes: [false],heart: [false],lung: [false],ent: [false],
            kidney: [false],brain: [false],cancer: [false],sexuallyTransmitted: [false],anemia: [false],accidental: [false],
          });
        } else if ( this.renewalInfo?.response?.policyData?.length > 0 && content == "deleteMember" ) {

        }
        this.initializeForm();
        this.formId = value;
      } else {
        this.formId = 5001;
      }
    } else if (this.selectedButton === "additional") {
      this.formId = 5001;
      this.policySummary = false;
    } else if (this.selectedButton == "payment") {
      if (value == "policySummary") {
        this.policySummary = true;
      } else {
        this.policySummary = false;
      }
    }
  }

  handleAction(event: string, item?: any) {
    switch (event) {
      case "Member":
        if (this.form.valid) {
          this.requestObject = {};
          this.memberDetail();
          this.requestObject.member = JSON.stringify(this.form.value);
          this.requestObject.policyNumber = this.policyNumber;
          this.requestObject.referenceNumber = this.referenceNumber;
          this.requestObject.agentCode = this.agentCode;
          this.requestObject.memberId = "";
          this.requestObject.productId = 2;
          this.requestObject.quoteData = "";
          this.renewalService.updateMemberDetailsApi(this.requestObject).subscribe(
              (res: any) => {
                if (res.data.isUpdateSuccess == true) {
                  this.form.value.MemberId = res.MemberId;
                  this.renewalInfo.response.policyData[0].Members.push(this.form.value);
                  const newMemberIndex =this.renewalInfo.response.policyData[0].Members.length - 1;
                  this.referenceNumber = res.data.referenceNumber;
                }
              },
              (err) => {
                this.toast.error({detail: "",summary: "Failed to Add New Member.",duration: 1500,});
              }
            );
          this.formId = 5001;
        } 
        break;
      case "editMember":
        if (this.form.valid) {
          this.formId = 5001;
        } else {
          console.log("Form is invalid");
          return;
        }
        break;
      case "editAddress":
        if (this.form.invalid) {
          return;
        } else if (event === "editAddress" && this.form.valid) {
          this.requestObject = {};
          this.requestObject.updatedAddress = JSON.stringify(this.form.value);
          this.requestObject.policyNumber = this.policyNumber;
          this.requestObject.referenceNumber = this.referenceNumber;
          this.renewalService.updateaddressApi(this.requestObject).subscribe(
            (res: any) => {
              if (res.data.isUpdateSuccess == true) {
                Object.keys(this.form.value).forEach((key) => {
                  if (this.form.value[key] !== null && this.form.value[key] !== undefined && this.form.value[key] !== "" ) {
                    this.renewalInfo.response.policyData[0].HomeAddress[key] =
                      this.form.value[key];
                  }
                });
                this.referenceNumber = res.data.referenceNumber;
              }
            },
            (err) => {
              this.toast.error({detail: "",summary: "Failed to Update Address.",duration: 1500});
            }
          );
          this.formId = 5001;
        } else {
          console.log("Form is invalid", this.formObject);
        }
        break;
      case "editNominee":
        if (event === "editNominee" && this.form.valid) {
          this.requestObject = {};
          this.requestObject.updatedNomineeDetails = JSON.stringify(this.form.value);
          this.requestObject.policyNumber = this.policyNumber;
          this.requestObject.referenceNumber = this.referenceNumber;
          this.renewalService.updatenomineeApi(this.requestObject).subscribe(
            (res: any) => {
              if (res.data.isUpdateSuccess == true) {
                Object.keys(this.form.value).forEach((key) => {
                  if ( this.form.value[key] !== null && this.form.value[key] !== undefined && this.form.value[key] !== "" ) {
                    this.renewalInfo.response.policyData[0].Nominee_Details[key] = this.form.value[key];
                  }
                });
                this.referenceNumber = res.data.referenceNumber;
              }
            },
            (err) => {
              this.toast.error({ detail: "",summary: "Failed to Update Nominee Details.",duration: 1500});
            }
          );
          this.formId = 5001;
        } else {
          this.form.markAllAsTouched();
          console.log("Form is invalid");
          return;
        }
        break;
      case "summary":
        this.activeSection = "primary";
        break;
      case "editBankDetails":
        if(this.form.valid){
        this.requestObject = {};
        this.requestObject.bankDetails = JSON.stringify(this.bankDetailsObject);
        this.requestObject.policyNumber = this.policyNumber;
        this.requestObject.referenceNumber = this.referenceNumber;
        this.renewalService.updateBankDetailsApi(this.requestObject).subscribe(
          (res: any) => {
            if (res.data.isUpdateSuccess == true && this.form.valid) {
              Object.keys(this.form.value).forEach((key) => {
                const formValue = this.form.value[key];
                if (formValue !== null && formValue !== undefined && formValue !== "" && key in this.bankDetailsObject) {
                  (this.bankDetailsObject as any)[key] = this.form.value[key];;
                }
              });
              this.referenceNumber = res.data.referenceNumber;
            }
          },
          (err) => {
            this.toast.error({detail: "",summary: "Failed to Update Bank Details.",duration: 1500});
          }
        );} else {
          this.form.markAllAsTouched();
          return;
        }
        this.formId = 5001;
        break;
      case "cancel":
        this.memberDetails = false;
        this.formId = 5001;
        break;
      default:
        console.warn("Unknown action:", event);
      }
  }

  getTenureDetails() {
    const productName =this.renewalInfo?.response?.policyData[0]?.Name_of_product;
    if (productName) {
      const matchingProduct = this.productsList.find((product: any) => product.productName === productName);
      // if (matchingProduct) {
      if (true) {
        const tenureRequestBody = {
          agentCode: this.agentCode,
          // productId: matchingProduct.productId,
          productId: 1,
          quoteData: JSON.stringify(this.renewalInfo),
        };
        this.renewalService.getTenureDetailsApi(tenureRequestBody).subscribe(
          (res: any) => {
            if (res.isSuccess) {
              this.tenureDetail = res.data;
            }
          },
          (err) => {
            console.error("Error from getTenureDetails API:", err);
          }
        );
      } else {
        console.error("No matching product found for the productName:",productName);
      }
    } else {
      console.error("Product name is not available in renewalInfo.");
    }
  }

getproductdetailsandfeatures() {
  const productName =this.renewalInfo?.response?.policyData?.[0]?.Name_of_product;
  if (productName) {
    const matchingProduct = this.productsList.find(
      (product: any) => product.productName === productName
    );
    // if (matchingProduct) {
    if (true) {
      const request = {
        // productId: matchingProduct.productId,
        productId: 2,
        agentCode: this.agentCode,
      };
      this.renewalService.getproductdetailsandfeatures(request).subscribe(
        (res: any) => {
          const productFeatures = res.data.productFeatures;
          const listOfMembers = this.renewalInfo?.response?.policyData?.[0]?.Members;
          this.optionalCovers = productFeatures.filter(
            (feature: any) => feature.categoryName === 'Optional Covers'
          );
          this.healthAddOns = productFeatures.filter(
            (feature: any) => feature.categoryName === 'Health Add On'
          );
          console.log('Updated Product Features:', productFeatures);
        },
        (error: any) => {
          console.error('Error fetching product details and features:', error);
        }
      );
    }
  }
}

  tenureUpdate(value: string, premium: number): void {
    const tenureRequest = {
      agentCode: this.agentCode,policyNumber: this.policyNumber,
      referenceNumber: this.referenceNumber || null,quoteNumber: "QE0042548062411",
    };
    this.selectedTenure = value;
    this.renewalInfo.response.policyData[0].Tenure = value;
    this.renewalInfo.response.policyData[0].NetPremium = premium;
    this.renewalInfo.response.policyData[0].premium.Renewal_Gross_Premium =premium;
  }

  setActiveTab(tabName: string): void {
    this.activeTab = tabName;
  }

  memberDetail() {
    this.form.value.Mobile_Number = this.form.value.Mobile_Number.toString();
    this.form.value.Name =`${this.form.value.FirstName} ${this.form.value.MiddleName} ${this.form.value.LastName}`.trim();
    this.form.value.Policy_Type = "IND";
    this.form.value.PrimaryMember = "N";
    this.form.value.Age = this.calculateAge(this.form.value.DoB).toString();
    this.form.value.ChronicManagementApplicable = this.isAnyConditionSelected() ? "Yes" : "No";
    this.form.value.PreExistingDiseasesApplicable = this.isAnyConditionSelected() ? "Yes" : "No";
    this.form.value.Zone = this.form.value.MemberproductComponents?.[0]?.productComponent?.find(
        (component: any) => component.productComponentName === "zone" )?.productComponentValue;
  }

  calculateAge(dob: Date): number | string {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if ( monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    if (age < 1) {
      const diffInMs = today.getTime() - birthDate.getTime();
      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
      return `${diffInDays}days`;
    }
    return age;
  }

  checkNomineeAge() {
    const nomineeDob = this.form.get("nominee_dob")?.value;
    if (nomineeDob) {
      const dob = new Date(nomineeDob);
      const age = this.calculateAge(dob);
      if (+age >= 18) {
        this.showAppointee = false;
        this.form.removeControl('appointee_name');
        this.form.removeControl('appointee_age');
      } else {
        this.showAppointee = true;
        if (!this.form.contains('appointee_name')) {
          this.form.addControl('appointee_name', new FormControl('', Validators.required));
        }
        if (!this.form.contains('appointee_age')) {
            this.form.addControl('appointee_age', new FormControl('', Validators.required));
        }
      }
    }
  }

  preExistingCondition(value: any) {
    this.preexistingConditionSelected = value;
  }

  isAnyConditionSelected(): boolean {
    return (
      this.chronicApplication.get("highBlood")?.value || this.chronicApplication.get("asthma")?.value ||
      this.chronicApplication.get("diabetes")?.value || this.chronicApplication.get("heart")?.value || this.chronicApplication.get("lung")?.value ||
      this.chronicApplication.get("ent")?.value || this.chronicApplication.get("kidney")?.value || this.chronicApplication.get("brain")?.value ||
      this.chronicApplication.get("cancer")?.value || this.chronicApplication.get("sexuallyTransmitted")?.value ||
      this.chronicApplication.get("anemia")?.value || this.chronicApplication.get("accidental")?.value
    );
  }

  isAnyPreExistingDiseasesConditionSelected(): boolean {
    return this.healthConditions.some((condition) => {
      const controlValue = this.PreExistingDiseases.get(condition)?.value;
      return controlValue === "Y";
    });
  }

  private formatDate(dateString: string): string {
    if (!dateString) return "";
    if (/\d{2}\/\d{2}\/\d{4}/.test(dateString)) {
      const [day, month, year] = dateString.split("/");
      return `${year}-${month}-${day}`;
    }
    return dateString.split("T")[0];
  }

  selectPaymentType(option: any) {
    if (option == "offline") {
      this.formObject = { paymentOption: "", 
        premiumAmount:this.renewalBaseObject?.response?.policyData[0]?.premium.Renewal_Gross_Premium || "",
        instrumentNumber: "", 
        instrumentDate: "", 
        bankName:this.bankDetailsObject.bankName || "",
        bankCity:this.bankDetailsObject.bankCity || "",
        bankBranch:this.bankDetailsObject.bankBranch || "",
        ifscCode: this.bankDetailsObject.ifscCode || "", 
        micrCode:this.bankDetailsObject.micrCode || "",
        file: null };
      this.initializeForm();
      this.selectedPaymentType = option;
      if(this.bankDetailsObject.bankName=="")
      {
        this.getBankDetails();
      }
    } else if ( option == "online" || option == "E-Mandate" || option == "Auto_Debit" ) {
      this.selectedPaymentType = option;
      const paymentRequestBody = {
        agentcode: this.agentCode,
        proposalNumber: "",
        paymentMethod: this.selectedPaymentType,
        source: "Retail",
        policyType: "Renewal",
        policyNumber: this.policyNumber,
        quoteNumber: "",
        orderId: "",
      };
      this.renewalService.paymentGatewayApi(paymentRequestBody).subscribe({
        next: (response: any) => {
          const paymenturl = response.data.paymentURL;          
          if (response.isSuccess == true && paymenturl) {
            // window.open(paymenturl, '_blank')
            window.location.href= paymenturl
          } else {
            console.log("Payment initiation failed:",response.message || "Unknown error");
          }
        },
        error: (error: any) => {
          this.toast.error({detail: "",summary: "Failed to payment.",duration: 3000});
        },
      });
    }
  }

  getBankDetails() {
    this.yatraService.getAllBankDetails().subscribe({
      next: (res: any) => {
        this.bankNameList = res.data;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  getBankCityDetails(bankId: any) {
    const reqData = {cityCode: "",bankCode: bankId,};    
    this.yatraService.getBankCity(reqData).subscribe({
      next: (res: any) => {
        this.cityNameList = res.data;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  getBranchDetails(bankId: any, cityId: any) {
    const reqData = {bankCode: bankId,cityCode: cityId,};
    this.yatraService.getBranchDetails(reqData).subscribe({
      next: (res: any) => {
        this.branchNameList = res.data;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  onBankSelected(selectedBankName: string): void {   
   this.form.get("bankCity")?.setValue("");
   this.form.get("bankBranch")?.setValue("");
    if(this.bankDetailsObject.bankName=""){
      this.bankDetailsObject.bankCity=""
    }
    const selectedBank = this.bankNameList.find(
      (bank: any) => bank.name === selectedBankName
    );
    if (selectedBank) {
      this.selectedBankId = selectedBank.id;
      this.getBankCityDetails(this.selectedBankId);
    } else {
      this.selectedBankId = "";
      this.cityNameList = [];
      this.branchNameList = [];
      this.filteredCitiesList = [];
    }
  }

  onCitySelected(selectedCityName: string): void {
    this.form.get("bankBranch")?.setValue("");
    const selectedCity = this.cityNameList.find(
      (city: any) => city.name === selectedCityName
    );
    if (selectedCity) {
      this.selectedCityId = selectedCity.id;
      this.getBranchDetails(this.selectedBankId, this.selectedCityId);
    } else {
      this.selectedCityId = "";
    }
  }

  onBranchSelected(selectedBranchName: string): void {
    const selectedbranch = this.branchNameList.find(
      (branch) => branch.name ===  selectedBranchName
    );
    if (selectedbranch) {
      this.form.get("ifscCode")?.setValue(selectedbranch.id);
      this.form.get("micrCode")?.setValue(selectedbranch.value);
    }
  }

  filterBankList(event: any): void {
    const input = (event.target as HTMLInputElement).value.toLowerCase();
    this.form.get('bankCity')?.reset()
    this.form.get('bankBranch')?.reset()
    this.form.get('ifscCode')?.reset()
    this.form.get('micrCode')?.reset()
    const allowedKeys = ["Backspace","Tab","Enter","ArrowLeft","ArrowRight","ArrowUp","ArrowDown" ];
    const regex = /^[a-zA-Z\s]$/;
    if (!allowedKeys.includes(event.key) && !regex.test(event.key)) {
      event.preventDefault();
      return;
    }
    this.filteredBankNamesList = this.bankNameList.filter((bank: any) =>
      bank.name.toLowerCase().includes(input)
    );
  }

  filterCityList(event: any): void {
    const input = (event.target as HTMLInputElement).value.toLowerCase();
    this.form.get('bankBranch')?.reset()
    const allowedKeys = ["Backspace","Tab","Enter","ArrowLeft","ArrowRight","ArrowUp","ArrowDown"];
    const regex = /^[a-zA-Z]$/;
    if (!allowedKeys.includes(event.key) && !regex.test(event.key)) {
      event.preventDefault();
      return;
    }
    this.filteredCitiesList = this.cityNameList.filter((city: any) =>
      city.name.toLowerCase().includes(input)
    );
  }

  filterBranchList(event: any): void {
    const input = (event.target as HTMLInputElement).value.toLowerCase();
    const allowedKeys = ["Backspace","Tab","Enter","ArrowLeft","ArrowRight","ArrowUp","ArrowDown" ];
    const regex = /^[a-zA-Z]$/;
    if (!allowedKeys.includes(event.key) && !regex.test(event.key)) {
      event.preventDefault();
      return;
    }
    this.filteredBranchList = this.branchNameList.filter((branch: any) =>
      branch.name.toLowerCase().includes(input)
    );
  }

  openBankDropdown(): void {
    this.filteredBankNamesList = [...this.bankNameList];
  }

  openCityDropdown(): void {
    this.filteredCitiesList = [...this.cityNameList];
  }

  openBranchDropdown(): void {
    this.filteredBranchList = [...this.branchNameList];
  }

  setSection(section: string) {
    this.formId = 5001;
    this.activeSection = section;
    if (this.activeSection == "additional") {
      this.getProducts();
      this.getTenureDetails();
      this.getproductdetailsandfeatures();
    }
  }

  goNext(){
    if(this.activeSection== 'primary'){
      this.setSection('additional')
    }
    else if(this.activeSection == 'additional'){
      this.setSection('policySummary')
    } 
    else if(this.activeSection== 'policySummary'){
      if(this.renewalInfo?.response?.policyData[0]?.CKYC_Number){
        this.setSection("payment");
      } else {
        this.setSection("kyc")
      }
    }
    else if(this.activeSection== 'kyc'){
      // this.setSection('payment')
      if(this.kycData==undefined){
        this.toast.error({detail: "",summary: "Please complete the kyc",duration: 3000});
      }
      else{
        this.setSection('payment')
      }
    }
    else if(this.activeSection == 'payment'){
      console.log("form",this.form);
      if(this.selectedPaymentType == 'offline' && !this.form.valid){
        this.form.markAllAsTouched();
        return;
      }
      const offlinePaymentRequestBody = {
        "policyType": "Renewal",
        "paymentMethod": "Offline",
        "source":"Retail",
        "instrumentType": this.form.value.paymentOption,
        "premiumAmount": this.form.value.premiumAmount.toString(),
        "instrumentNo": this.form.value.instrumentNumber.toString(),
        "instrumentDate": this.form.value.instrumentDate.toString(),
        "policyNumber": this.policyNumber,
        "proposalNum":"",
        "agentCode": this.agentCode,
        "bankName": this.form.value.bankName,
        "ifsc": this.form.value.ifscCode,
        "micrNo":"",
        "documentId": this.documentId
      };
      console.log("offlinePaymentRequestBody",offlinePaymentRequestBody);
      this.renewalService.getFullQuoteApi(offlinePaymentRequestBody).subscribe(
        (res:any)=>{
          if(res.isSuccess){
            this.fullQuoteResponse=res.data;          
            this.setSection('thankyou')
            this.hideSection=false
            this.isFeedBackModalVisible = true;
          }
          else{
            this.toast.error({ detail: '',summary:res.message || "Failed to do Payment",duration: 3000});
          }
        },
        (err)=>{
          this.toast.error({ detail: '',summary: 'Failed to do offline payment.',duration: 3000});
          console.log("error is coming from fullquote api");
      })
    }
  }

  getProducts() {
    const reqData = {agentCode: this.agentCode,};
    this.commonService.Getproductlist(reqData).subscribe({
      next: (res) => {
        this.productsList = res.data;
      },
      error: (err) => {
        console.log("error coming form getproduct list API");
      },
    });
  }

  sendLink() { this.link = " ";}

  handleKyc(action: any) {
    this.kycDetailsSubmitted = true;
    if (this.kycFormGroup.invalid) {
      this.toast.error({detail: "",summary: "Please enter valid KYC details.",duration: 3000,});
    } else {
      const reqData = this.kycFormGroup.value;
      this.yatraService.GetKycDetails(reqData).subscribe(
        (response: any) => {
          if (response.isSuccess === true) {
            this.kycData = response.data;
            // const kycRequestBody = {policy_Number: this.policyNumber,};
            // this.renewalService.kycUpdate(kycRequestBody).subscribe(
            //   (res) => {
            //     this.kycFlag = res;
            //   },
            //   (err) => {
            //     console.log(err);
            //   }
            // );
            this.actionKyc = action;
            this.toast.success({detail: "",summary: "KYC Details Fetched Successfully.",duration: 2000,});
          } else if (response.isSuccess === false) {
            this.toast.error({detail: "",summary: "Failed to Fetch KYC Details,Please try again later.",duration: 2000,});
            this.getkycURL();
          }
          console.log("responsec body", response.isSuccess);
        },
        (error: any) => {
          this.getkycURL();
          this.toast.error({detail: "",summary: "Failed to Fetch KYC Details,Please try again later.",duration: 2000,});
        }
      );
    }
  }

  getkycURL() {
    const requestBody = {policyNumber: this.policyNumber,
      fullName: "",panNumber: "",dob: "",pepCheck: "",businessType: "ren",};
    this.renewalService.getkycURL(requestBody, { responseType: "json" }).subscribe(
        (response: any) => {
          if (response.data && Object.keys(response.data).length === 0) {
            this.kycLink = "";
          } else {
            this.kycLink = `${response.data}`;
          }
        },
        (error) => {
          this.kycLink = " ";
          console.error("Error:kyc", error);
        }
      );
  }

  setRating(star: number) {
    this.rating = star;
    this.customerFeedbackForm.patchValue({ rating: this.rating });
    this.feedbackSubmit = true;
    this.impressedValues = true;
    if (star > 3) {
      this.impressedLable = "What Impressed you ?";
      this.feedBackMessage = false;
    } else {
      this.impressedLable = "Why aren't you happy?";
      this.feedBackMessage = true;
    }
  }

  submitFeedback() {
    let reqData: any = {};
    reqData.agentCode = this.agentCode;
    reqData.rating = this.customerFeedbackForm.value.rating;
    reqData.remarks =this.feedbackImpressedValue + ":" + this.customerFeedbackForm.value.message;
    reqData.customerId = "";
    this.yatraService.submitFeedback(reqData).subscribe(
      (response) => {
        this.toast.success({ detail: "Feedback submitted successfully! Thank you for your input.", });
      },
      (error) => {
        this.toast.error({ detail: "Failed to submit feedback. Please try again later.",});
      }
    );
    this.isFeedBackModalVisible = false;
  }

  closeIsFeedBackModalVisible() {
    this.isFeedBackModalVisible = false;
  }

  onSelectValue(value: String) {
    this.feedbackImpressedValue = value;
  }

  onFileSelected(event: any) {
    this.file = event.target.files[0];
    const maxSizeInBytes = 3 * 1024 * 1024;
    const allowedFileTypes = [ "image/png","image/jpeg","image/jpg","application/pdf", ];
    if (this.file) {
      this.fileName = this.file.name;
    }
    const policyNum = this.policyNumber.replace(/-/g, "");
    const formData = new FormData();
    formData.append("Files", this.file);
    formData.append("UniqueNumber", policyNum);    
    this.commonService.uploaDocument(formData).subscribe(
      (res: any) => {        
        if (res.isSuccess) {
          this.documentId = res.data.uploadResponse[0].globalId;
        }
      },
      (err) => {
        this.toast.error({ detail: "", summary: err.message, duration: 1500 });
      }
    );
  }

  onCheckboxChange(index: number, event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      this.selectedCheckboxes.add(index);
    } else {
      this.selectedCheckboxes.delete(index);
    }
    this.isMemberRadioSelected = this.selectedCheckboxes.size > 0; // Update button state
  }

  comeBack() {
    if (this.activeAction == "withoutmodify") {
      if (this.activeSection == "payment") {
        this.router.navigate(["renewal/renewalList"]);
      } else if (this.activeSection == "additional") {
        this.setSection("primary");
      } else if (this.activeSection == "policySummary") {
        this.setSection("additional");
      } else if (this.activeSection == "primary") {
        this.router.navigate(["renewal/renewalList"]);
      } else if (this.activeSection == "kyc") {
        this.router.navigate(["renewal/renewalList"]);
      }
    } else {
      if (this.activeSection == "primary") {
        this.router.navigate(["renewal/renewalList"]);
      } else if (this.activeSection == "additional") {
        this.setSection("primary");
      } else if (this.activeSection == "policySummary") {
        this.setSection("additional");
      } else if (this.activeSection == "kyc") {
        this.setSection("policySummary");
      } else if (this.activeSection == "payment") {
        if(this.renewalInfo?.response?.policyData[0]?.CKYC_Number){
          this.setSection("policySummary");
        } else {
          this.setSection("kyc")
        }
      }
    }
  }

  selectedMembers: { [memberIndex: number]: { [featureName: string]: any } } = {};

  onMemberFeatureSelect(memberIndex: number, featureIndex: number, event: any): void {
    const featureName = this.productsList[featureIndex].featureName;
    if (event.target.checked) {
      if (!this.selectedMembers[memberIndex]) {
        this.selectedMembers[memberIndex] = {};
      }
      this.selectedMembers[memberIndex][featureName] = {};
    } else {
      delete this.selectedMembers[memberIndex]?.[featureName];
    }
  }

  onMemberFieldChange(memberIndex: number, featureName: string, fieldName: string, event: any): void {
    if (!this.selectedMembers[memberIndex]?.[featureName]) {
      this.selectedMembers[memberIndex][featureName] = {};
    }
    this.selectedMembers[memberIndex][featureName][fieldName] = event.target.value;
  }
  
}
