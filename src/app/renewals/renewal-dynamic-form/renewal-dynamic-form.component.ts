import { Component, OnInit } from "@angular/core";
import { FormBuilder,FormControl,FormGroup,Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { RenewalsService } from "../renewals.service";
import { NgToastService } from "ng-angular-popup";
import { YatraService } from "src/app/yatra/yatra/yatra.service";
import { CommonService } from "src/app/services/common.service";
import { validationConfig } from "src/app/interface/renewal-list.interface";
import { EncryptionService } from "src/app/services/encryption.service";

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
  isRadioSelected = false;
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
  memberRole: string = "";
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
  bankNameControl = new FormControl("");
  filteredBankNamesList: any[] = [];
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
  bankDetailsObject = { accountHolderName: "",accountNo: "",accountType: "",bankName: "",bankCity: "",bankBranch: "",IFSCCOde: "",MICRCode: ""};
  selectedBankName: any;
  selectedCityName: any;
  documentId: any;
  showAppointee: boolean = false;

  constructor( private fb: FormBuilder,private renewalService: RenewalsService,private router: Router,
    private toast: NgToastService,private ac: ActivatedRoute,private yatraService: YatraService,
    private commonService: CommonService,private encryptionService: EncryptionService) {
  }

  ngOnInit() {
    this.kycFormGroup = this.fb.group({
      panNumber: ["",[Validators.required, Validators.pattern("[A-Z]{5}[0-9]{4}[A-Z]{1}")],],
      dateOfBirth: ["",[Validators.required, Validators.pattern(/^\d{4}-\d{2}-\d{2}$/)],],
    });
    this.ac.paramMap.subscribe((params) => {
      this.policyNumber = this.encryptionService.decrypt(sessionStorage.getItem("policyNumberRen") as string);
      this.activeAction = this.encryptionService.decrypt(sessionStorage.getItem("policyActionRen") as string);
      if (this.activeAction) {
        if (this.activeAction == "withoutmodify") {
          this.setSection("payment");
          this.getRenewalInfo();
        } else {
          this.getRenewalInfo();
        }
      }
    });
    this.bankNameControl.valueChanges.subscribe((value) =>
      this.filterBankList(value)
    );
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
        this.getBankDetails();
        this.formObject = this.bankDetailsObject;
        this.initializeForm();
        this.formId = value;
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
        this.formId = value;
      } else if (value == 5003) {
        if (this.form.valid) {
          this.formId = value;
          this.PreExistingDiseases = this.fb.group({
            Asthma: ["N"],
            Diabetes: ["N"],
            Hyperlipidaemia: ["N"],
            Hypertension: ["N"],
            PTCA: ["N"],
            COPD: ["N"],
            HighBMI: ["N"],
          });
        } else {
          this.memberDetails = true;
          console.log("Form is invalid");
          return;
        }
      } else if (value == 5002) {
        if ( this.renewalInfo?.response?.policyData?.length > 0 && content == "addMember" ) {
          this.memberRole = "Add";
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
        } else if (
          this.renewalInfo?.response?.policyData?.length > 0 &&
          content == "editMember"
        ) {
          this.memberRole = "Update";
          this.formObject = {...this.renewalInfo?.response?.policyData[0]?.Members[member ?? 0],};
          this.formObject.DoB = this.formatDate(this.formObject.DoB);
        }
        this.initializeForm();
        this.formId = value;
        this.checkAndDisableSumInsured();
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
        if (this.memberRole === "Add" && this.form.valid) {
          this.requestObject = {};
          this.memberDetail();
          this.requestObject.member = JSON.stringify(this.form.value);
          this.requestObject.policyNumber = this.policyNumber;
          this.requestObject.referenceNumber = this.referenceNumber;
          this.requestObject.agentCode = this.agentCode;
          this.requestObject.memberId = "";
          this.requestObject.productId = 2;
          this.requestObject.quoteData = "";
          console.log("update or add", this.requestObject);
          console.log("add", this.form.value);
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
        } else if (this.memberRole === "Update" && this.form.valid) {
          this.requestObject = {};
          this.requestObject.member = JSON.stringify(this.form.value);
          this.requestObject.policyNumber = this.policyNumber;
          this.requestObject.referenceNumber = this.referenceNumber;
          this.requestObject.memberId = this.form.value.MemberId;
          this.requestObject.agentCode = this.agentCode;
          this.requestObject.productId = 2;
          this.requestObject.quoteData = "";
          this.renewalService.updateMemberDetailsApi(this.requestObject).subscribe(
              (res: any) => {
                if (res.data.isUpdateSuccess == true) {
                  const memberIndex =this.renewalInfo.response.policyData[0].Members.findIndex(
                      (member: any) =>member.FirstName === this.form.value.FirstName);
                  if (memberIndex !== -1) {
                    this.renewalInfo.response.policyData[0].Members[memberIndex] = {
                      ...this.renewalInfo.response.policyData[0].Members[memberIndex],...this.form.value,
                    };
                  } else {
                    console.log("Member not found for update");
                  }
                  this.referenceNumber = res.data.referenceNumber;
                }
              },
              (err) => {
                this.toast.error({detail: "",summary: "Failed to Update Member.",duration: 1500,});
              }
            );
          this.formId = 5001;
        } else {
          console.log("Form is invalid");
          return;
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
                  if (
                    this.form.value[key] !== null &&
                    this.form.value[key] !== undefined &&
                    this.form.value[key] !== ""
                  ) {
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
          console.log("Form is invalid");
          return;
        }
        break;
      case "summary":
        this.activeSection = "primary";
        break;
      case "editBankDetails":
        this.requestObject = {};
        this.requestObject.bankDetails = JSON.stringify(this.bankDetailsObject);
        this.requestObject.policyNumber = this.policyNumber;
        this.requestObject.referenceNumber = this.referenceNumber;
        this.renewalService.updateBankDetailsApi(this.requestObject).subscribe(
          (res: any) => {
            if (res.data.isUpdateSuccess == true && this.form.valid) {
              this.bankDetailsObject = {
                accountHolderName: this.form.value.accountHolderName || "",
                accountNo: this.form.value.accountNo || "",
                accountType: this.form.value.accountType || "",
                bankName: this.selectedBankName || "",
                bankCity: this.selectedCityName || "",
                bankBranch: this.selectedBankName || "",
                IFSCCOde: this.form.value.IFSCCOde || "",
                MICRCode: this.form.value.MICRCode || "",
              };
              this.referenceNumber = res.data.referenceNumber;
            }
          },
          (err) => {
            this.toast.error({
              detail: "",
              summary: "Failed to Update Bank Details.",
              duration: 1500,
            });
          }
        );
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
          // quoteData: "{\n  \"proposerPincode\": \"500013\",\n  \"typeOfBusiness\": \"NB\",\n  \"isEmployee\": false,\n  \"sumInsured\": \"5000000\",\n  \"numberOfInsuredMembers\": \"1\",\n  \"familySize\": \"1A\",\n  \"proposerName\": \"Manjunath Saukar\",\n  \"mobileNumber\": \"9876543211\",\n  \"memberPolicyType\": \"Multi Individual\",\n  \"insuredMemberDetails\": [\n    {\n      \"roomCategory\": \"\",\n      \"memberAge\": \"43\",\n      \"sumInsured\": \"5000000\",\n      \"isChronic\": \"No\",\n      \"chronicDiseases\": null,\n  \"pincode\": \"360380\",\n     \"zone\": \"Zone II\",\n      \"memberGender\": \"M\",\n      \"memberDob\": \"1980-12-31\",\n      \"memberRelation\": \"self\",\n      \"memberRelationCode\": \"24\",\n      \"covers\": [\n        {\n          \"coverId\": \"CIL\",\n          \"value\": \"1000000\"\n        },\n        {\n          \"coverId\": \"DECOV\",\n          \"value\": \"5000000\"\n        },\n        {\n          \"coverId\": \"SCOP\",\n          \"value\": \"5000000\"\n        },\n        {\n          \"coverId\": \"ANCANC\",\n          \"value\": \"5000000\"\n        },\n        {\n          \"coverId\": \"PCDED\",\n          \"value\": \"15000\"\n        },\n        {\n          \"coverId\": \"PPNDISC\",\n          \"value\": \"\"\n        },\n        {\n          \"coverId\": \"COMV\",\n          \"value\": \"5000000\"\n        },\n        {\n          \"coverId\": \"CANC\",\n          \"value\": \"5000000\"\n        },\n        {\n          \"coverId\": \"RVCV\",\n          \"value\": \"500\"\n        },\n        {\n          \"coverId\": \"TOPD\",\n          \"value\": \"5000000\"\n        },\n        {\n          \"coverId\": \"RRTO\",\n          \"value\": \"YSY\"\n        }\n      ]\n    }\n  ]\n}"
          quoteData: JSON.stringify(this.renewalInfo),
        };
        this.renewalService.getTenureDetailsApi(tenureRequestBody).subscribe(
          (res: any) => {
            if (res.isSuccess) {
              this.tenureDetail = res.data;
            }
            console.log("Tenure details received:", res);
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
          productId: 1,
          agentCode: this.agentCode,
        };
        this.renewalService.getproductdetailsandfeatures(request).subscribe(
          (res: any) => {
            const productFeatures = res.data.productFeatures;
            this.optionalCovers = productFeatures.filter((feature: any) => feature.categoryName === "Optional Covers");
            this.healthAddOns = productFeatures.filter((feature: any) => feature.categoryName === "Health Add On");
          },
          (err) => {
            console.error("Error coming from getproductdetailsandfeatures API",err);
          }
        );
      } else {
        console.error(`No matching product found for the product name: ${productName}`);
      }
    } else {
      console.error("Product name is not available in renewalInfo.");
    }
  }

  formatTickLabel(value: number, forSlider: boolean): string {
    if (value >= 10000000) {
      return forSlider == true ? value / 10000000 + "Cr": "₹" + value / 10000000 + " Crores";
    } else if (value >= 100000 && value < 1000000) {
      return forSlider == true ? value / 100000 + "L" : "₹" + value / 100000 + " Lakhs";
    } else if (value >= 100000) {
      return forSlider == true ? value / 100000 + "L" : "₹" + value / 100000 + " Lakhs";
    }
    return value.toString();
  }

  tenureUpdate(value: string, premium: number): void {
    const tenureRequest = {
      agentCode: this.agentCode,policyNumber: this.policyNumber,
      referenceNumber: this.referenceNumber || null,quoteNumber: "QE0042548062411",
    };
    console.log(tenureRequest);
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
      } else {
        this.showAppointee = true;
      }
    }
  }

  preExistingCondition(value: any) {
    this.preexistingConditionSelected = value;
  }

  isAnyConditionSelected(): boolean {
    return (
      this.chronicApplication.get("highBlood")?.value ||
      this.chronicApplication.get("asthma")?.value ||
      this.chronicApplication.get("diabetes")?.value ||
      this.chronicApplication.get("heart")?.value ||
      this.chronicApplication.get("lung")?.value ||
      this.chronicApplication.get("ent")?.value ||
      this.chronicApplication.get("kidney")?.value ||
      this.chronicApplication.get("brain")?.value ||
      this.chronicApplication.get("cancer")?.value ||
      this.chronicApplication.get("sexuallyTransmitted")?.value ||
      this.chronicApplication.get("anemia")?.value ||
      this.chronicApplication.get("accidental")?.value
    );
  }

  isAnyPreExistingDiseasesConditionSelected(): boolean {
    return this.healthConditions.some((condition) => {
      const controlValue = this.PreExistingDiseases.get(condition)?.value;
      return controlValue === "Y";
    });
  }

  checkAndDisableSumInsured(): void {
    if (this.memberRole === "Update") {
      this.form.get("SumInsured")?.disable();
    } else {
      this.form.get("SumInsured")?.enable();
    }
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
      this.formObject = { paymentOption: "", chequeAmount:this.renewalInfo?.response?.policyData[0]?.NetPremium || "",
        chequeNumber: "", chequeDate: "", ifscCode: "", bankNameControl: "", file: null, };
      this.initializeForm();
      this.selectedPaymentType = option;
      this.getBankDetails();
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
            window.open(paymenturl, "_blank");
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
        if (this.activeSection === "payment") {
          this.filteredBankNamesList = this.bankNameList;
        }
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  onBankChange(event: any) {
    const selectedBank = this.bankNameList.find(
      (bank: any) => bank.id === event.target.value
    );
    if (selectedBank) {
      this.selectedBankId = selectedBank.id;
      this.selectedBankName = selectedBank.name;
      this.getBankCityDetails(this.selectedBankId);
    } else {
      this.selectedBankId = "";
      this.selectedBankName = "";
      this.cityNameList = [];
      this.branchNameList = [];
    }
  }

  getBankCityDetails(bankId: any) {
    const reqData = {cityCode: "",bankCode: bankId,};
    this.yatraService.getBankCity(reqData).subscribe({
      next: (res: any) => {
        this.cityNameList = res.data;
        if (this.selectedCityId) {
          this.getBranchDetails(this.selectedBankId, this.selectedCityId);
        }
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  onCityChange(event: any) {
    const selectedCity = this.cityNameList.find(
      (city: any) => city.id === event.target.value
    );
    if (selectedCity) {
      this.selectedCityId = selectedCity.id;
      this.selectedCityName = selectedCity.name;
      this.getBranchDetails(this.selectedBankId, this.selectedCityId);
    } else {
      this.selectedCityId = "";
      this.selectedCityName = "";
    }
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

  onBranchChange(event: any) {
    const selectedbranch = this.branchNameList.find(
      (branch) => branch.id === this.form.get("bankBranch")?.value
    );
    if (selectedbranch) {
      this.form.get("IFSCCOde")?.setValue(selectedbranch.id);
      this.form.get("MICRCode")?.setValue(selectedbranch.value);
    }
  }

  setIfscCode(event: any, otherControl: any) {
    const data = JSON.parse(event.target.value);
    // this.dynamicFormGroup.get('ifscCode')?.setValue(data.id);
    // this.dynamicFormGroup.get('micrCode')?.setValue(data.value);
  }

  filterBankList(event: any): void {
    const input = (event.target as HTMLInputElement).value.toLowerCase();
    const allowedKeys = ["Backspace","Tab","Enter","ArrowLeft","ArrowRight","ArrowUp","ArrowDown" ];
    const regex = /^[a-zA-Z]$/;
    if (!allowedKeys.includes(event.key) && !regex.test(event.key)) {
      event.preventDefault();
      return;
    }
    this.filteredBankNamesList = this.bankNameList.filter((bank: any) =>
      bank.name.toLowerCase().includes(input)
    );
  }

  onBankNameSelected(selectedBankName: string): void {
    this.form.get("bankNameControl")?.setValue(selectedBankName);
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
    } else if(this.activeSection == 'additional'){
      this.setSection('policySummary')
    } else if(this.activeSection== 'policySummary'){
      this.setSection('payment')
    } else if(this.activeSection == 'payment'){
        if(this.selectedPaymentType == 'offline' && !this.form.valid){
          this.form.markAllAsTouched();
          return;
        }
        const offlinePaymentRequestBody = {
          "PolicyType": "Renewal",
          "PaymentMethod": "Offline",
          "Source":"Retail",
          "InstrumentType": this.form.value.paymentOption.toString(),
          "PremiumAmount": this.form.value.chequeAmount.toString(),
          "InstrumentNo": this.form.value.chequeNumber.toString(),
          "InstrumentDate": this.form.value.chequeDate.toString(),
          "PolicyNumber": this.policyNumber.toString(),
          "ProposalNum":"",
          "AgentCode": this.agentCode?.toString(),
          "BankName": this.form.value.bankNameControl.toString(),
          "IFSC": this.form.value.ifscCode.toString(),
          "MicrNo":"",
          "documentId": this.documentId
        };
        console.log("offlinePaymentRequestBody",offlinePaymentRequestBody);
        // const checkNumber= this.form.value.chequeNumber.toString()
        // const checkAmount= this.form.value.chequeAmount.toString()
        // console.log(checkAmount,checkNumber);
        // const data = new FormData();
        // data.append("PolicyType", "Renewal");
        // data.append("PaymentMethod", "Offline");
        // data.append("InstrumentType", this.form.value.paymentOption);
        // data.append("PremiumAmount", checkAmount);
        // data.append("InstrumentNo", checkNumber);
        // data.append("InstrumentDate", this.form.value.chequeDate);
        // data.append("PolicyNumber", this.policyNumber);
        // data.append("ProposalNum","")
        // data.append("AgentCode", this.agentCode|| "");
        // data.append("BankName", this.form.value.bankNameControl);
        // data.append("IFSC", this.form.value.ifscCode);
        // data.append("MicrNo","")
        // data.append('formFile', this.file);
        // console.log("uploaded file",this.file);
        // console.log("data",data);
            this.renewalService.getFullQuoteApi(offlinePaymentRequestBody).subscribe(
          // this.renewalService.getFullQuoteApi(data).subscribe(
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
            const kycRequestBody = {policy_Number: this.policyNumber,};
            this.renewalService.kycUpdate(kycRequestBody).subscribe(
              (res) => {
                this.kycFlag = res;
              },
              (err) => {
                console.log(err);
              }
            );
            this.actionKyc = action;
            this.toast.success({detail: "",summary: "KYC Details Fetched Successfully.",duration: 1000,});
          } else if (response.isSuccess === false) {
            this.toast.error({detail: "",summary: "Failed to Fetch KYC Details,Please try again later.",duration: 1000,});
            this.getkycURL();
          }
          console.log("responsec body", response.isSuccess);
        },
        (error: any) => {
          this.getkycURL();
          this.toast.error({detail: "",summary: "Failed to Fetch KYC Details,Please try again later.",duration: 1000,});
        }
      );
    }
  }

  getkycURL() {
    const requestBody = {policyNumber: this.policyNumber,
      fullName: "",panNumber: "",dob: "",pepCheck: "",businessType: "ren",};
    this.renewalService.getkycURL(requestBody, { responseType: "json" }).subscribe(
        (response: any) => {
          this.kycLink = `${response.message}`;
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
          console.log(res.data.uploadResponse[0].globalId);
          this.documentId = res.data.uploadResponse[0].globalId;
        }
      },
      (err) => {
        this.toast.error({ detail: "", summary: err.message, duration: 1500 });
      }
    );
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
      }
    } else {
      if (this.activeSection == "primary") {
        this.router.navigate(["renewal/renewalList"]);
      } else if (this.activeSection == "additional") {
        this.setSection("primary");
      } else if (this.activeSection == "policySummary") {
        this.setSection("additional");
      } else if (this.activeSection == "payment") {
        this.setSection("policySummary");
      }
    }
  }
  
}
