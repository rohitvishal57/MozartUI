import { DOCUMENT } from '@angular/common';
import { Component, Inject, inject, Renderer2 } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { firstValueFrom, lastValueFrom, tap } from 'rxjs';
import { IDynamicControl, IForm, IFormControl, IFormSections, IOptions, ISubControl, IValidator } from 'src/app/interface/form.interface';
import { CommonService } from 'src/app/services/common.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { YatraService } from 'src/app/yatra/yatra/yatra.service';
import { thankYou} from 'src/assets/styles/renewals-forms/combined_forms';
import { leads, payment } from 'src/assets/styles/renewals-forms/payment';
import { RenewalsService } from '../renewals.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { CustomersService } from 'src/app/customers/customers.service';
import { detailsForms } from 'src/assets/styles/renewals-forms/customer_payment';

@Component({
  selector: 'app-renewal-journey',
  templateUrl: './renewal-journey.component.html',
  styleUrls: ['./renewal-journey.component.scss']
})
export class RenewalJourneyComponent {

  form!: IForm;
  fb = inject(FormBuilder);
  renewalFormGroup: FormGroup = this.fb.group({});
  proposalNum: string = '';
  policyNumber: string = '';
  formData: any = {};
  private dynamicStyle!: HTMLLinkElement;
  covers: any[][] = [];
  selectedIndex: number = -1;
  totalPremium = 0;
  collapsedSections: { [key: string]: boolean } = {};
  public showHtmlContent: any;
  selectedButton: string | null = null;

  showPopup: boolean = false;
  showDoneButton = true;
  parentControl: any;
  selectedAddons: any[] = [];
  question: any;
  isOverlayVisible = false;
  changesMade: boolean = false;

  //tab-view variables
  activeMemberTabIndex: number = 0;
  activeTab: string = 'chronic';
  expandedItem: string = '';
  selectedItem: string = '';
  expandedCardIndex: number | null = null;
  bankCode: any;
  bankCity: any;
  selectedFile: any;
  documentId: any;
  agentCode: any;
  rowData: any={};
  formSequence: any[] = [detailsForms,leads,payment,thankYou];
  journeyProcess: any;
  currentDate = new Date().toISOString().split('T')[0];
  futureDate = new Date(new Date().setFullYear(new Date().getFullYear() + 10)).toISOString().split('T')[0];
  activeSection: string = "primary";
  formIndex: number = 0;
  existingRelations: any[] = [];
  QuoteNumber: any = [];
  tenureAmount: any[] = [0, 0, 0];
  discountList: number[] = [];
  displayTaxList: any[] = [];
  customerFeedbackForm !: FormGroup;
  formIndexValue: number = 0;
  stars: number[] = [1, 2, 3, 4, 5]; 
  rating: number = 0; 
  feedbackImpressedValues: String[] = ['Seamless payment', 'Ease of policy modification', 'Speedy Policy renewal', 'Payment receipt & confirm']
  feedBackMessage: boolean = false;
  impressedValues: boolean = false;
  feedbackSubmit: boolean = false;
  impressedLable: String = "";
  feedbackImpressedValue: String = '';
  isFeedBackModalVisible: Boolean = false;
  retrievedDocuments: any;
  verifyKYCStatus:boolean = false;
  isFullQuote:boolean=true;
  fromList:string="";
  nomineeDetail: boolean | undefined;
  tempFormData: any;
  bankDetail: any;
  bankName:any;
  nomineeRelationList :any;
  bankNameList :any;
  isKycModalVisible: boolean = false;
  kycForm:  FormGroup = this.fb.group({});
  changeDetectorRef: any;
  isHealthDeclarationVisible = false;
  healthDeclarationForm: FormGroup = this.fb.group({});
  members = [
    { firstName: 'John', lastName: 'Doe', showInputField: false },
    { firstName: 'Jane', lastName: 'Smith', showInputField: false }
  ];
  memberDetail: any[] = [];
  ghdFlag:boolean = false;
  bank: any;
  nominee: any;


  constructor(private route: ActivatedRoute, private encryptionService: EncryptionService, private renderer: Renderer2, 
    @Inject(DOCUMENT) private document: Document, private yatraService: YatraService, private toast: NgToastService, 
    public commonService: CommonService, private renewalService: RenewalsService, private router: Router, 
    private clipboard: Clipboard,private customerService: CustomersService) { }

  async ngOnInit() {
    this.showHtmlContent = false;
    this.agentCode = localStorage.getItem('agentCode') || "";

    const stateData = history.state;
    if (stateData && Object.keys(stateData).length > 0) {
      if (stateData.formData) {
        const decryptedFormData = this.encryptionService.decrypt(stateData.formData);
        this.policyNumber = decryptedFormData.policyNumber || "";
        this.rowData = decryptedFormData.isFullQuoteSuccess !== undefined ? decryptedFormData : {};
        this.fromList = stateData.fromList ? this.encryptionService.decrypt(stateData.fromList) : "";
        try {
          if ( (decryptedFormData.policyNumber &&
            !['SUCCESS', 'INITIATED', 'PENDING', 'INPROGRESS'].includes(decryptedFormData.paymentStatus) &&
            !(decryptedFormData?.paymentStatus?.startsWith('IN')) &&
            (decryptedFormData?.fullQuoteStatus === undefined || (decryptedFormData?.isFullQuoteSuccess !== true && decryptedFormData?.isFullQuoteSuccess !== false)) && 
            (this.fromList != "list") ) || 
            (['SUCCESS', 'INITIATED', 'PENDING', 'INPROGRESS','INTIATED'].includes(decryptedFormData.paymentStatus) && decryptedFormData.paymentMethodType == "emandate_payment")
          ){
              const renewalInfoRequestBody = {policy_Number: decryptedFormData.policyNumber};
              const response: any = await firstValueFrom(this.renewalService.getbasequoteApi(renewalInfoRequestBody));
              this.formData = { ...this.formData, ...decryptedFormData, ...response.data };
          }
        } catch (error) {
          console.error('Error fetching renewal info:');
        }
        this.formData = {  ...decryptedFormData ,...this.formData,};
        this.tempFormData=this.formData;
      }
      this.formSequence = stateData.formSequence ? this.encryptionService.decrypt(stateData.formSequence) : [detailsForms,leads,payment,thankYou];
      this.journeyProcess = stateData.journeyProcess ? this.encryptionService.decrypt(stateData.journeyProcess) : "";
      this.formIndex = stateData.formIndex ? parseInt(stateData.formIndex) : 0;
      if (stateData.formIndex) localStorage.setItem('formIndex', stateData.formIndex);
    } else {
      this.formSequence = [detailsForms,leads,payment,thankYou];
    }
    // this.formData.healthReturn="8000";
    // this.formData.netPremium = "3000";
    // this.formData.bankDetails.ifsc_code="";
    // this.formData.nomineeDetails.nominee_Address = "";
    // this.formData.bankDetails.bank_acc_no = "";
    // this.formData.isGHDApplicable=true;
    // this.formData.isKycCompleted = false;

    this.formData = { ...this.formData, ...this.transformData(this.formData) };
    this.memberDetail = this.formData.insuredMemberDetails || [];

    if (this.formData.nomineeFirstName === this.formData.nomineeLastName) {
      const nameParts = this.formData.nomineeFirstName.split(/\s+/);
      if (nameParts.length > 1) {
        this.formData.nomineeLastName = nameParts.pop() || ""; 
        this.formData.nomineeFirstName = nameParts.join(" ");
      } else {
        this.formData.nomineeLastName = ""; 
      }
    }
    if(this.formData.hrDeductedAmount){
      this.formData.totalPremium = this.formData.hrDeductedAmount ? this.formData.hrDeductedAmount : this.formData.totalPremium || "";
    } else if(this.formData.updatedPremium){
      this.formData.totalPremium = this.formData.updatedPremium ? this.formData.updatedPremium : this.formData.totalPremium || "";
    }
    this.getFormDataFromFormSequence();

    this.customerFeedbackForm = this.fb.group({
      message: [''],
      rating: [null, Validators.required],
    });

    this.kycForm = this.fb.group({
      pepStatus: [this.formData?.ifPEP ?? 'N'],
      kycConfirmed: [false, Validators.requiredTrue] 
    });
  }

  private transformData(formData: any): any {
    return {
      nomineeFirstName: this.formData.nomineeDetails?.nominee_first_name || "",
      nomineeMiddleName: this.formData.nomineeDetails?.nominee_middle_name || "",
      nomineeLastName: this.formData.nomineeDetails?.nominee_last_name || "",
      nomineeDob: this.formatDates(this.formData.nomineeDetails?.nominee_dob || ""),
      nomineeRelationWithProposer: this.formData.nomineeDetails?.relationship || "",
      gender: this.formData.gender || "",
      nomineeAddress:  this.formData.nomineeDetails?.nominee_Address || "",
      nomineeContactNo: this.formData.nomineeDetails?.nominee_Contact_No || "",
      policyNumber: this.formData.policyNumber || "",
      productCode: this.formData.productCode || "",
      isKycCompleted: this.formData.isKycCompleted || false,
      bankName: this.formData.bankDetails?.bank_name || "",
      accountNumber: this.formData.bankDetails?.bank_acc_no || "",
      confirmBankAccountNumber: this.formData.bankDetails?.confirm_Bank_acc_no || "",
      paymentIfscCode : this.formData.bankDetails?.ifsc_code || "",
      paymentBankName : this.formData.bankDetails?.bank_name || "",
      ifscCode: this.formData.bankDetails?.ifsc_code || "",
      micrCode: this.formData.bankDetails?.micr_code || "",
      bankBranchName: this.formData.bankDetails?.bank_branch_name || "",
      bankAccountType: this.formData.bankDetails?.bank_account_type || "",
      primarySecondary: this.formData.bankDetails?.primary_secondary || "",
      appointeeName: this.formData.nomineeDetails?.appointee_Name || "",
      appointeeContactNo : this.formData.nomineeDetails?.appointee_Mobile_Np || "",
      appointeeRelationWithNominee : this.formData.nomineeDetails?.appointee_Relation || "",
      finalPremium : this.formData.totalPremium,
      healthReturn: !isNaN(Number(this.formData.healthReturn)) 
      ? (Number(this.formData.healthReturn) % 1 === 0 
          ? Number(this.formData.healthReturn).toFixed(0) 
          : this.formData.healthReturn.toString()) 
      : "0"
    };
  }

  async getFormDataFromFormSequence() {
    this.showHtmlContent = false;

    if (this.dynamicStyle) {
      this.renderer.removeChild(this.document.head, this.dynamicStyle)
      this.showHtmlContent = false;
    }
    
    this.form = JSON.parse(JSON.stringify(this.formSequence[this.getFormIndexValue()]));  

    if (this.getFormIndexValue() == 0) {
      this.form.formSections.forEach((section: any) => {
        section.formControls.forEach((control: any) => {
         if (control.name === 'back') control.visible = false;
        })
      })
    }

    this.initializeForm();

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async initializeForm() {
    this.showHtmlContent = false;
    this.dynamciallyLoadCSS(this.form);
    this.form.formSections.forEach((section: any) => {
      section.formControls.forEach((control: any) => {        
        if (control.dynamicControls) {
          if (this.formData[control.name] && control.visible == true) {
            if (this.formData[control.name]) {
              control.value = this.formData[control.name].length;
            }
            control.dynamicControls = control.dynamicControls.slice(0, 1)
            this.formData[control.name].forEach((member: any, index: number) => {
              let tempDynamicControl = control.dynamicControls[0].map((element: any) => ({ ...element }));
              control.dynamicControls.push(tempDynamicControl)
              control.dynamicControls[index + 1].forEach((innerControl: any) => {
                if (innerControl.name == 'relation') {
                  innerControl.value = member.relation
                }
                if (innerControl.name == 'covers') {
                  innerControl.value = this.covers[index];
                }
                if (innerControl.name == 'zoneValue') {
                  innerControl.options = member.upgradableZones;
                }
              })
            })
          }
        }
        else {
          if ((this.formData[control.name]) || (this.formData[control.name] && !control.value)) {
            control.value = this.formData[control.name];
          }
        }
      });
    });
    if (this.form?.formSections) {
      this.renewalFormGroup = this.fb.group({});
      this.form.formSections.forEach((section) => {
        section.formControls.forEach(async (control: IFormControl) => {
          console.log(section, control);
          if (control.dynamicControls) {
            if (control.visible == true) {
              let tempFormArray = this.fb.array([]);
              for (let i = 1; i < control.dynamicControls.length; i++) {
                tempFormArray.push(this.initializeDynamicFormControls(control.dynamicControls[i], i));
              }
              this.renewalFormGroup.addControl(control.name, tempFormArray);
            }
          }
          else if (control.subControls) {
            if (control.type == 'questionnaire') {
              let demoMember: any;
              let demoTypeIndex: any;
              let doneButton: any;
              console.log(control);
              if (control.subControls) {
                demoMember = control.subControls.findIndex(control => control.name === 'demoMember')
                demoTypeIndex = control.subControls.findIndex(control => control.name === 'demoType');
                doneButton = control.subControls.find(control => control.name === 'doneButton');
                console.log(control);
                control.subControls = [
                  ...control.subControls.slice(demoMember, demoMember + 1),
                  ...control.subControls.slice(demoTypeIndex, demoTypeIndex + 1),
                ]; 
              }
              this.formData['insuredMemberDetails'].forEach((member: any, index: any) => {
                if (control.subControls) {
                  let tempMemberControl = JSON.parse(JSON.stringify(control.subControls[0]));
                  let tempInnerControl = JSON.parse(JSON.stringify(control.subControls[1]));
                  const tempRelationshipType = JSON.parse(member.relationshipType);
                  tempMemberControl.label = tempRelationshipType.value;
                  tempMemberControl.name = tempRelationshipType.value.toLowerCase();
                  tempInnerControl.label = tempRelationshipType.value;
                  tempInnerControl.name = tempRelationshipType.value;
                  console.log(tempInnerControl);
                  if (this.formData[control.name] && this.formData[control.name][tempMemberControl.name] == true) {
                    for (const key in this.formData[control.name]) {
                      const value = this.formData[control.name][key];
                      if (key == tempRelationshipType.value.toLowerCase()) {
                        if (typeof this.formData[control.name][key] === 'boolean' && this.formData[control.name][key] == true) {
                          tempMemberControl.value = true;
                          tempInnerControl.visible = true;
                          this.formData[control.name][tempRelationshipType.value].forEach((item: any) => {
                            tempInnerControl.innerArrayControl.push(tempInnerControl.innerArrayControl[0])
                          })
                        }
                      }
                    }
                  }
                  else {
                    tempInnerControl.innerArrayControl.push(tempInnerControl.innerArrayControl[0])
                  }
                  control.subControls?.push(tempMemberControl);
                  control.subControls?.push(tempInnerControl);
                }
              });
              control.subControls?.push(doneButton);
              this.renewalFormGroup.addControl(control.name, this.initializeSubControls(control.subControls.slice(2)));
            }
            else if (control.type == 'combinedCheckbox') {
              control.subControls.forEach((subControl: ISubControl) => {
                if (subControl.name == 'addOnDetails') {
                  const addOnId = control.subControls?.find(sub => sub.name === 'addOnId')?.value;
                  let demoTypeIndex: any;
                  let doneButton: any;
                  if (subControl.innerSubControls) {
                    demoTypeIndex = subControl.innerSubControls.findIndex(control => control.name === 'demoType');
                    doneButton = subControl.innerSubControls.find(control => control.name === 'doneButton');
                    subControl.innerSubControls = [
                      ...subControl.innerSubControls.slice(demoTypeIndex, demoTypeIndex + 1),
                    ]; 
                  }
                  this.formData['insuredMemberDetails'].forEach((member: any) => {
                    let matchingCover;
                    if (member.covers)
                      matchingCover = member.covers.find((cover: any) => cover.coverId === addOnId);
                    if (matchingCover) {
                      const addOnCoverControl = control.subControls?.find(sub => sub.name === 'addOnCover');
                      if (addOnCoverControl) {
                        addOnCoverControl.value = true;
                      }
                    }
                    if (subControl.innerSubControls) {
                      let tempInnerControl = JSON.parse(JSON.stringify(subControl.innerSubControls[0]));
                      const tempRelationshipType = member.relationshipType;
                      tempInnerControl.label = tempRelationshipType.value;
                      tempInnerControl.name = tempRelationshipType.value;
                      if (subControl.conditionCheck) {
                        tempInnerControl.coreControls.forEach((corecontrol: any, index: any) => {
                          if (corecontrol.dependentControls && this.formData[control.name]) {
                            const newvalue = this.formData[control.name][subControl.name][tempRelationshipType.value][index][corecontrol.name];
                            corecontrol.dependentControls.forEach((question: any) => {
                              let newcontrol = tempInnerControl.coreControls.find((item: any) => item.name == question)
                              newcontrol.visible = newvalue;
                            })
                          }
                        })
                      }
                      if (matchingCover) {
                        const sumInsuredControl = tempInnerControl.coreControls.find(
                          (core: any) => core.name === 'addOnSumInsured'
                        );
                        if (sumInsuredControl) {
                          sumInsuredControl.value = matchingCover.value;
                        }
                        const memberCheckboxControl = tempInnerControl.coreControls.find(
                          (core: any) => core.name === 'memberCheckbox'
                        );
                        if (memberCheckboxControl) {
                          memberCheckboxControl.value = true;
                        }
                      }
                      subControl.innerSubControls?.push(tempInnerControl);
                    }
                  });
                  subControl.innerSubControls?.push(doneButton);
                }
              });
            }
            this.renewalFormGroup.addControl(control.name, this.initializeSubControls(control.subControls));
          }
          else {
            if (control.type === 'date') {
              const lowerCaseName = control.name.toLowerCase();
              if (lowerCaseName.includes('dob') || lowerCaseName.includes('dateofbirth')) {
                const currentDate = new Date();
                const currentYear = currentDate.getFullYear();
                const currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0');
                const currentDay = String(currentDate.getDate()).padStart(2, '0');
                const dobPattern =
                  `^(18[0-9]{2}|19[0-9]{2}|20[0-${currentYear.toString().slice(2, 3)}][0-${currentYear.toString().slice(3, 4)}])` + // Years 1800-Current Year
                  `-(0[1-9]|1[0-2])` + 
                  `-(0[1-9]|[12][0-9]|3[01])` + 
                  `|${currentYear}-(${currentMonth}|0[1-9]|1[0-9])` +
                  `-${currentDay}|(0[1-9]|[12][0-9]|3[01])$`;
                control.validators?.push({
                  validatorName: "pattern",
                  pattern: dobPattern,
                  message: "Date of Birth should not exceed the current date and must be in yyyy-MM-dd format."
                });
              }
            }
            if(control.name == "accountNumber"){
              control.type = "text";
              control.validators =[];
            }
            let controlValidators: any = [];
            if (control.validators && control.visible == true && section.visible == true) {
              control.validators.forEach((val: IValidator) => {
                if (val.validatorName === 'required') controlValidators.push(Validators.required);
                if (val.validatorName === 'email') controlValidators.push(Validators.email);
                if (val.validatorName === 'minlength') controlValidators.push(Validators.minLength(val.minLength as number));
                if (val.validatorName === 'maxlength') controlValidators.push(Validators.maxLength(val.maxLength as number));
                if (val.validatorName === 'pattern') controlValidators.push(Validators.pattern(val.pattern as string));
                if (val.validatorName === 'requiredTrue') {
                  controlValidators.push((formControl: AbstractControl) => {
                    return formControl.value === true ? null : { requiredTrue: val.message || 'This field is required' };
                  });
                }
              })
            }
            if (['text', 'email', 'password', 'number', 'date', 'summary','paragraph','checkbox','word'].includes(control.type) && control.methodName) {
              if (control.otherControlName) {
                this.callMethod(control.methodName, control, section)
              }
              else {
                this.resolveMethod(control.methodName, control)
              }
            }
            if ((control.type === 'select') && control.options) {
              if (control.getAllOption && control.options.length === 0) {
                await this.resolveMethod(control.getAllOption, control);
              }
              else if (control.options.length === 0 && control.name == 'zoneValue') {
                control.options = this.formData['upgradableZones'];
              }
              if (control.value === "") {
                if (control.options && control.options.length > 0) {
                  control.options.forEach((option: IOptions) => {
                    if (option.selected) {
                      control.value = option.id ? this.stringifyObject(option) : option.value;
                    }
                  });
                }
              }
              if (control.methodName) {
                await this.resolveMethod(control.methodName, control);
              }
            }
            if (control.type == 'button' && control.methodName == "checkKycDetail") {
              this.resolveMethod(control.methodName, control);
            }
            if (control.type == 'custom-radio' && control.methodName) {
              this.resolveMethod(control.methodName, control);
            }
            if (control.name == 'totalPremium' && this.totalPremium != 0) {
              this.renewalFormGroup.addControl(control.name, new FormControl(this.totalPremium, controlValidators));
            }
            else {
              this.renewalFormGroup.addControl(control.name, new FormControl(control.value, controlValidators));
            }
            if (control.disabled) {
              this.disableFormControl(control.name);
            }
            if (control.type == 'custom-radio' && this.formData[control.name]) {
              const radioControl = this.renewalFormGroup.get(control.name);
              if (radioControl) {
                control.radioOptions?.forEach((option: any, index: number) => {
                  if (option.value == this.formData[control.name]) {
                    radioControl.setValue(option.value);
                    this.selectedIndex = index;
                  }
                });
              }
            }
          }
           this.bank = this.formData.accountNumber?.trim() && this.formData.ifscCode?.trim() && this.formData.bankName?.trim();
           this.nominee = this.formData.nomineeFirstName?.trim() && this.formData.nomineeLastName?.trim() && this.formData.nomineeDob?.trim() && this.formData.nomineeRelationWithProposer?.trim() && this.formData.nomineeAddress?.trim() && this.formData.nomineeContactNo?.trim();
            if (section.sectionTitle === "Bank Account Details" || section.sectionTitle === "Nominee Details") {
                if (section.sectionTitle === "Bank Account Details") {
                    if (this.bank) {
                        // control.disabled = true;
                    }
                }
                if (section.sectionTitle === "Nominee Details") {
                    if (this.nominee) {
                        // control.disabled = true;
                    }
                }
            }          
            if (control.disabled) {
              this.renewalFormGroup.get(control.name)?.disable();
            }
            if(this.bank && control.name == "accountNumber"){
              control.type = "text";
              control.validators =[];
            }
        });
      });      
    }
    if (this.formSequence[this.getFormIndexValue()].formTitle === 'Leads' && parseFloat(this.formData.healthReturn) < 1 ) {
      this.form.formSections.forEach((section) => {
        if (section.sectionTitle === "Health Returns For Renewal") {
          section.visible = false;
        }
      });
    }
    if (this.formSequence[this.getFormIndexValue()].formTitle === 'thankYou') {
      this.isFeedBackModalVisible = true;
    }
    if (this.formSequence[this.getFormIndexValue()]?.formTitle === 'Payment' && this.formData.isKycCompleted && !['kyc', 'payment'].includes(this.fromList)) {
      this.isKycModalVisible = true;
    }
    this.memberDetail.forEach((member, index) => {
      this.healthDeclarationForm.addControl('healthStatus' + index, new FormControl('no', Validators.required));
      this.healthDeclarationForm.addControl('GHDApplicable' + index, new FormControl('no', Validators.required)); 
      this.healthDeclarationForm.addControl('GHDRemarks' + index, new FormControl('')); 
    });
  }

  initializeDynamicFormControls(dynamicFormControls: any, index: any = null) {
    let formGroup: any = this.fb.group({})
    dynamicFormControls.forEach((control: IDynamicControl) => {
      if (control.subControls) {
        let tempFormArray = this.fb.array([]);
        formGroup.addControl(control.name, tempFormArray);
      }
      else {
        let controlValidators: any = [];
        if (control.validators && control.visible == true) {
          control.validators.forEach((val: IValidator) => {
            if (val.validatorName === 'required') controlValidators.push(Validators.required);
            if (val.validatorName === 'email') controlValidators.push(Validators.email);
            if (val.validatorName === 'minlength') controlValidators.push(Validators.minLength(val.minLength as number));
            if (val.validatorName === 'maxlength') controlValidators.push(Validators.maxLength(val.maxLength as number));
            if (val.validatorName === 'pattern') controlValidators.push(Validators.pattern(val.pattern as string));
          })
        }
        if (control.type === 'multiSelectCheckbox' && control.selectCheckboxOptions) {
          this.resolveMethod(control.methodName, control);
          const controlGroup = this.fb.group({});
          control.selectCheckboxOptions.forEach(option => {
            controlGroup.addControl(option.value, new FormControl(false));
          });
          formGroup.addControl(control.name, controlGroup);
        }
        if (control.type === 'subtabview') {
          control.tabs?.forEach(element => {
            const controlGroup = this.fb.group({});
            element.selectCheckboxOptions?.forEach(option => {
              controlGroup.addControl(option.value, new FormControl(false));
            });
            formGroup.addControl(element.name, controlGroup);
          });
        }
        if ((control.type == 'select') && control.getAllOption) {
          if (control.options?.length == 0) {
            this.resolveMethod(control.getAllOption, control);
          }
        }
        if (control.name == 'memberIndex' && index != null) {
          control.value = index - 1;
        }
        if (control.type == 'text' && control.methodName) {
          this.resolveMethod(control.methodName, control, index);
        }
        if (control.type == 'radio' && control.radioOptions) {
          let initialValue = control.radioOptions.find((option) => option.selected === true)?.value;
          formGroup.addControl(control.name, new FormControl(initialValue, controlValidators));
        }
        else {
          formGroup.addControl(control.name, new FormControl(control.value, controlValidators));
        }
      }
      if(control.name != "relationshipType"){
        if (control.disabled) {
         formGroup.get(control.name)?.disable();
        }
       }
    })
    return formGroup;
  }

  initializeSubControls(subControls: any, controlGroup: any = null) {
    let formGroup: any
    if (controlGroup) {
      formGroup = controlGroup;
    }
    else {
      formGroup = this.fb.group({});
    }
    if (Array.isArray(subControls)) {
      subControls.forEach((control: any) => {
        let controlValidators: any = [];
        if (control.validators && control.visible) {
          control.validators.forEach((val: IValidator) => {
            if (val.validatorName === 'required') controlValidators.push(Validators.required);
            if (val.validatorName === 'email') controlValidators.push(Validators.email);
            if (val.validatorName === 'minlength') controlValidators.push(Validators.minLength(val.minLength as number));
            if (val.validatorName === 'maxlength') controlValidators.push(Validators.maxLength(val.maxLength as number));
            if (val.validatorName === 'pattern') controlValidators.push(Validators.pattern(val.pattern as string));
          });
        }
        if ((control.type == 'select') && control.getAllOption) {
          if (control.options?.length == 0) {
            this.resolveMethod(control.getAllOption, control);
          }
        }
        if (control.innerArrayControl) {
          if (control.visible) {
            let tempFormArray = this.fb.array([]);
            for (let i = 1; i < control.innerArrayControl.length; i++) {
              tempFormArray.push(this.initializeDynamicFormControls(control.innerArrayControl[i], i));
            }
            formGroup.addControl(control.name, tempFormArray);
          }
          else {
            formGroup.addControl(control.name, new FormArray([]));
          }
        }
        if (control.innerSubControls) {
          formGroup.addControl(control.name, this.initializeSubControls(control.innerSubControls.slice(1)));
        }
        if (control.innerControls) {
          formGroup.addControl(control.name, this.initializeSubControls(control.innerControls));
        }
        else if (control.coreControls) {
          let tempFormArray = this.fb.array([]);
          for (let i = 0; i < control.coreControls.length; i++) {
            tempFormArray.push(this.initializeSubControls(control.coreControls[i]))
          }
          formGroup.addControl(control.name, tempFormArray);
        }
        else if (!control.displayOnly || control.displayOnly === false)
          if (this.selectedAddons.length > 0 && this.selectedAddons.find((addon: any) => addon === control.label) && control.type === 'checkbox') {
            formGroup.addControl(control.name, new FormControl(true, controlValidators));
          } else {
            formGroup.addControl(control.name, new FormControl(control.value, controlValidators));
          }
      });
    }
    else {
      let controlValidators: any = [];
      if (subControls.validators) {
        subControls.validators.forEach((val: IValidator) => {
          if (val.validatorName === 'required') controlValidators.push(Validators.required);
          if (val.validatorName === 'email') controlValidators.push(Validators.email);
          if (val.validatorName === 'minlength') controlValidators.push(Validators.minLength(val.minLength as number));
          if (val.validatorName === 'maxlength') controlValidators.push(Validators.maxLength(val.maxLength as number));
          if (val.validatorName === 'pattern') controlValidators.push(Validators.pattern(val.pattern as string));
        });
      }
      if (subControls.type == 'select' && subControls.getAllOption) {
        if (subControls.options?.length == 0) {
          this.resolveMethod(subControls.getAllOption, subControls);
        }
      }
      if (subControls.type == 'questionnaire' && subControls.innerControls) {
        if (subControls.visible == true) {
          formGroup.addControl(subControls.name, this.initializeSubControls(subControls.innerControls))
        }
        else {
          formGroup.addControl(subControls.name, new FormGroup({}));
        }
      }
      if (subControls.innerArrayControl) {
        if (subControls.visible) {
          let tempFormArray = this.fb.array([]);
          console.log(subControls.innerArrayControl);
          for (let i = 1; i < subControls.innerArrayControl.length; i++) {
            tempFormArray.push(this.initializeDynamicFormControls(subControls.innerArrayControl[i], i));
          }
          formGroup.setValue(subControls.name, tempFormArray);
        }
        else {
          formGroup.addControl(subControls.name, new FormArray([]));
        }
      }
      formGroup.addControl(subControls.name, new FormControl(subControls.value, controlValidators))
    }
    return formGroup;
  }

  async resolveMethod(methodName: string, ...args: any[]): Promise<void> {
    let filteredArgs = args.filter(arg => arg !== undefined && arg !== null);
    if (methodName === 'addOrRemoveAdditionalInsuredMember') {
      filteredArgs = filteredArgs.slice(-1);
    } else if (filteredArgs[filteredArgs.length - 1] === 'add' || filteredArgs[filteredArgs.length - 1] === 'remove') {
      filteredArgs.pop();
    }
    const method = (this as any)[methodName] as Function;
    if (method && typeof method === 'function') {
      try {
        const result = method.bind(this)(...filteredArgs);
        if (methodName == 'uploadSelectedDocument')
        if (result && typeof result.then === 'function') {
          await result; 
        } else {
          await Promise.resolve(result);
        }
        if (methodName === 'getProposerRelationship') {
          console.log("Proposer Relationship");
        }
      } catch (error) {
        console.error(`Error in method ${methodName}:`, error);
      }
    } else {
      console.error(`Method ${methodName} not found`);
    }
  }

  async callMethod(methodName: string, control: any, section?: any) {
    if (control.otherControlName && section != undefined) {
      let otherControl = section.formControls.filter((formControl: IFormControl) => formControl.name == control.otherControlName)[0];
      const method = (this as any)[methodName];
      if (method && typeof method === 'function') {
        await (this as any)[methodName](otherControl)
      } else {
        console.error(`Method ${methodName} not found`);
      }
    }
    else if (control && methodName) {
      await (this as any)[methodName](control)
    }
  }

  dynamciallyLoadCSS(form: IForm) {
    let tf: string = "default.css";
    if (form.themeFile) tf = form.themeFile;
    console.log(tf);
    this.dynamicStyle = this.renderer.createElement('link');
    this.renderer.setAttribute(this.dynamicStyle, 'rel', 'stylesheet');
    this.renderer.setAttribute(this.dynamicStyle, 'type', 'text/css');
    this.renderer.setAttribute(this.dynamicStyle, 'href', 'assets/styles/dynamicForm/' + tf)
    this.renderer.appendChild(this.document.head, this.dynamicStyle);
    this.showHtmlContent = true;
  }

  stringifyObject(obj: any): string {
    return JSON.stringify(obj);
  }

  isSectionCollapsed(sectionTitle: string): boolean {
    return !!this.collapsedSections[sectionTitle];
  }

  toggleSection(sectionTitle: string) {
    this.collapsedSections[sectionTitle] = !this.collapsedSections[sectionTitle];
  }

  async onInputChange(event: any, control: any, parentControl: any = null, index: any = null, subControl: any = null, innerControl: any = null, indexj: any = null) {
    if(control.name =="healthReturnUsage"){
      const maxAmount = Math.min(this.formData.netPremium, this.formData.healthReturn);
      if(maxAmount >= event.target.value){
        this.renewalFormGroup.get('totalPremium')?.setValue(this.formData.finalPremium - event.target.value);
      }else if(event.target.value == "" || event.target.value == undefined) {
        this.renewalFormGroup.get('totalPremium')?.setValue(this.formData.finalPremium);
      } 
      var premiumValidation = ""
      if ( (event.target.value > Number(this.formData.healthReturn))) {
        premiumValidation="Health Return Usage can't exceed Health Returns Amount";
   
      } else if ((event.target.value > Number(this.formData.netPremium))) {
        premiumValidation=`Health Return Usage can't exceed Net Premium Amount ${this.formData.netPremium}`;
      }
      this.form.formSections.forEach((section) => {
        if (section.sectionTitle === "Health Returns For Renewal") {
          section.formControls.forEach((formControl: any) => {
            if (control.name == formControl.name) {
              formControl.validators.forEach((validator: any) => {
                if (validator.validatorName === "max") {
                  validator.message = premiumValidation;
                }
              });
            }
          });
        }
      }); 
    }
    if (control.onChangeMethod != null && control.otherControlName != null) {
      this.form.formSections.forEach((section: any) => {
        section.formControls.forEach((formControl: any) => {
          if (formControl.name == control.otherControlName) {
            this.callMethodForOtherControls(event, control.onChangeMethod, control, formControl);
          }
        });
      });
    }
    if (parentControl !== null && parentControl.type == 'combinedCheckbox') {
      this.changeMainFormDependentControls(innerControl.dependentControls, event.target.checked, control.name, parentControl.name, index, innerControl.name);
      this.changeOverLayDone(control, parentControl, false);
    }
    if (parentControl == null && control.name == 'proposerPincode') {
      const pinCodeLength = this.renewalFormGroup.get('proposerPincode')?.value.length || 0;
      if (pinCodeLength === 6) {
        const reqData = {
          "pincode": event.target.value
        }
        this.commonService.getPinCodeByCity(reqData).subscribe({
          next: (res) => {
            if (res.isSuccess && res.data) {
              this.renewalFormGroup.get('city')?.setValue(res.data.city || '');
              this.renewalFormGroup.get('state')?.setValue(res.data.state || '');
              const zoneControl = this.renewalFormGroup.get('zone');
              const zoneControlValue = this.renewalFormGroup.get('zoneValue');
              if (zoneControl) {
                zoneControl.setValue(res.data.zone || '');
              }
              if (zoneControlValue) {
                zoneControlValue.setValue(res.data.zoneValue);
                this.form.formSections.forEach((section: any) => {
                  section.formControls.forEach((control: any) => {
                    if (control.name === 'zoneValue') {
                      control.options = [];
                      res.data.upgradableZones?.forEach((zoneOption: any) => {
                        control.options.push({
                          name: zoneOption.zone,
                          value: zoneOption.zoneCode
                        });
                      });
                    }
                  });
                });
              }
            } else {
              console.error('Failed to fetch zone details.');
              this.resetZoneAndLocationFields();
            }
          },
          error: (err: any) => {
            console.error('Error fetching zone details:', err);
            this.resetZoneAndLocationFields();
          }
        });
      } else {
        this.resetZoneAndLocationFields();
      }
    }
    if (control.onChangeMethod && control.type == 'date') {
      await this.resolveMethod(control.onChangeMethod, control, event.target.value);
    }
    if (control.methodName && control.type == 'checkbox') {
      await this.resolveMethod(control.methodName, control);
    }
    if (control.methodName && control.type == 'radio') {
      await this.resolveMethod(control.methodName, control);
    }
    if(control.onChangeMethod && control.type == 'select'){
      const selectedValue = this.renewalFormGroup.get(control.name)?.value;
      let selectedOption;
      if (control.name == 'paymentOption') {
        selectedOption = control.options.find((option: any) => option.value === selectedValue);
      }
      else {
        selectedOption = control.options.find((option: any) => option.value === JSON.parse(selectedValue).value);
      }
      this.resolveMethod(control.onChangeMethod, selectedOption.dependentControls)
    }
    if (parentControl == null && control.name == 'paymentIfscCode') {
      const ifscCodeDetails = this.renewalFormGroup.get('paymentIfscCode')?.value || '';
      if (!ifscCodeDetails) {
        this.renewalFormGroup.get('paymentBankName')?.setValue('');
        this.renewalFormGroup.get('paymentMicrCode')?.setValue('');
        return;
      }
      if (ifscCodeDetails.length == 11) {
        let bankDetails: any[] = [];
        this.yatraService.getAllBankDetails().subscribe({
          next: (res: any) => {
            bankDetails = res.data || [];
            const reqData = { ifscCode: event.target.value };
            this.yatraService.getBankDetailsViaIFSC(reqData).subscribe({
              next: (response: any) => {
                if (response.isSuccess && response.data) {
                  const matchingBank = bankDetails.find((bank) => bank.name === response.data.bankName);
                  const nobj = {
                    id: matchingBank ? matchingBank.id : "Unknown",
                    value: response.data.bankName,
                    name: response.data.bankName
                  };
                  this.form.formSections.forEach((section: any) => {
                    section.formControls.forEach((formControl: any) => {
                      if (formControl.name == "paymentBankName" && formControl.onChangeMethod) {
                        this.renewalFormGroup.get('paymentBankName')?.setValue(JSON.stringify(nobj) || '');
                      } else if (formControl.name == "paymentBankName") {
                        this.renewalFormGroup.get('paymentBankName')?.setValue(response.data.bankName || '');
                      }
                    });
                  });
                  this.renewalFormGroup.get('paymentMicrCode')?.setValue(response.data.micrCode || '');
                  if (response.data.bankName) {
                    const cityReqData = { cityName: "", bankName: response.data.bankName };
                    this.yatraService.getBankCity(cityReqData).subscribe({
                      next: (cityRes: any) => {
                        const cityDetails = cityRes.data || [];
                        const matchingCity = cityDetails.find((city: any) => city.name === response.data.bankCity);
                        const cobj = {
                          id: matchingCity ? matchingCity.id : "Unknown",
                          value: response.data.bankCity,
                          name: response.data.bankCity
                        };
                        if (control.onChangeMethod != null && "paymentBankCityName" != null) {
                          this.form.formSections.forEach((section: any) => {
                            section.formControls.forEach((formControl: any) => {
                              if (formControl.name == "paymentBankCityName") {
                                const event = {
                                  target: {
                                    value: JSON.stringify(nobj)
                                  }
                                };
                                this.getBankCity(event, formControl);
                              }
                            });
                          });
                        }
                        this.renewalFormGroup.get('paymentBankCityName')?.setValue(JSON.stringify(cobj) || '');
                        const branchReqData = {
                          bankName: response.data.bankName,
                          cityName: response.data.cityName
                        };
                        this.yatraService.getBranchDetails(branchReqData).subscribe({
                          next: (branchRes: any) => {
                            const branchDetails = branchRes.data || [];
                            const matchingBranch = branchDetails.find(
                              (branch: any) => branch.name === response.data.bankBranch
                            );
                            const branchObj = {
                              id: matchingBranch ? matchingBranch.id : "Unknown",
                              value: matchingBranch.value,
                              name: matchingBranch.name
                            };
                            if (control.onChangeMethod != null && "paymentBankBranchName" != null) {
                              this.form.formSections.forEach((section: any) => {
                                section.formControls.forEach((formControl: any) => {
                                  if (formControl.name == "paymentBankBranchName") {
                                    const event = {
                                      target: {
                                        value: JSON.stringify(cobj)
                                      }
                                    };
                                    this.getBranchDetails(event, formControl);
                                  }
                                });
                              });
                            }
                            this.renewalFormGroup.get('paymentBankBranchName')?.setValue(JSON.stringify(branchObj) || '');
                          },
                          error: (err) => {
                            console.error('Error fetching branch details', err);
                          }
                        });
                      },
                      error: (err) => {
                        console.error('Error fetching city details', err);
                      }
                    });
                  }
                  if (control.dependentControls.includes("pennyBtn")) {
                    this.changeMainFormDependentControls(control.dependentControls, true);
                  }
                } else {
                  this.toast.warning({
                    detail: "Warning",
                    summary: 'Failed to Fetch Bank Details',
                    duration: 3000
                  });
                }
              },
              error: (err) => {
                this.toast.error({
                  detail: "Error",
                  summary: 'Failed to Fetch Bank Details',
                  duration: 3000
                });
              }
            });
          },
          error: (err) => {
            console.error('Failed to fetch all bank details', err);
          }
        });
      }
    }
  }

  callMethodForOtherControls(event: any, method: string, control: IFormControl, otherControl: IFormControl) {
    const methodFunction = (this as any)[method] as Function;
    if (methodFunction && typeof methodFunction === 'function') {
      (this as any)[method](event, otherControl)
    } else {
      console.error(`Method ${method} not found`);
    }
  }

  hasAnyValue(control: IFormControl | IDynamicControl, parentControl: IFormControl | null = null, index: number | null = null): boolean {
    return parentControl != null && index != null ? (this.renewalFormGroup.get(parentControl.name) as FormArray).controls[index].get(control.name)?.value : this.renewalFormGroup.get(control.name)?.value
  }

  getValidationErrors(control: IFormControl | IDynamicControl | ISubControl, parentControl: IFormControl | ISubControl | null = null, index: number | null = null,
    subControl: any | null = null,
    innerControl: any | null = null,
    innerSubControl: any | null = null
  ): string {
    let myFormControl: any;
    if (innerControl != null && innerSubControl != null) {
      myFormControl = parentControl != null && index != null ? ((((this.renewalFormGroup.get(innerSubControl.name) as FormGroup)?.controls[parentControl.name] as FormGroup)
        .controls[subControl.name] as FormArray).controls[index] as FormGroup)
        .controls[innerControl.name].get(control.name) : this.renewalFormGroup.get(innerSubControl.name);
    }
    else if (subControl != null && index != null) {
      myFormControl = parentControl != null && index != null ? ((this.renewalFormGroup.get(subControl.name) as FormGroup)?.controls[parentControl.name] as FormArray).controls[index].get(control.name)
        : this.renewalFormGroup.get(control.name);
    }
    else {
      myFormControl = parentControl != null && index != null ? (this.renewalFormGroup.get(parentControl.name) as FormArray).controls[index].get(control.name) : this.renewalFormGroup.get(control.name)
    }
    let errorMessage = ''
    control.validators?.forEach((val) => {
      if (myFormControl?.hasError(val.validatorName as string)) {
        if (control.name == 'insuredMembers' && val.validatorName == 'required') {
          if (this.renewalFormGroup.get('planType')?.value == 'Multi Individual') {
            errorMessage = val.message as string + 'one'
          }
          else {
            errorMessage = val.message as string + 'two'
          }
        }
        else
          errorMessage = val.message as string
      }
    })
    return errorMessage;
  }

  disableFormControl(controlName: string): void {
    const formControl = this.renewalFormGroup.get(controlName);
    if (formControl) {
      formControl.disable();
    }
  }

  onPhoneNumberInputChange(event: any, control: any, subControl?: any, i?: any) {
    const input = event.target;
    let value = input.value.replace(/\D/g, '');
    if (value.length > 10) {
      value = value.slice(0, 10);
    }
    input.value = value;
    console.log(value, subControl, control, i);
    if (subControl) {
      this.renewalFormGroup.get(`${control.name}.${i}.${subControl.name}`)?.setValue(value);
    } else {
      this.renewalFormGroup.get(control.name)?.setValue(value);
    }
  }

  currentDateValue(control:any){
    control.value=this.currentDate;
  }

  getAllProposerOccupation(control: any, otherControl: any) {
    const reqData = {
      "agentCode":localStorage.getItem('agentCode')
      }; 
    this.yatraService.getProposerOccupation(reqData).subscribe({
      next: (res: any) => {
        console.log(res);
        control.options = res.data;
      },
      error: (err: any) => {
        console.error(err);
      }
    });
  }

  incrementMember(event: any, control: IFormControl, option: any) {
    event.stopPropagation();
    const formGroup = this.renewalFormGroup.get(control.name) as FormGroup;
    let index = parseInt(option.value.slice(-1), 10);
    index += 1;
    if ((index <= 4 && this.renewalFormGroup.get('memberPolicyType')?.value == 'Family Floater') || this.renewalFormGroup.get('memberPolicyType')?.value == 'Multi Individual' || this.renewalFormGroup.get('memberPolicyType')?.value == 'Individual') {
      const baseName = option.value.replace(/\d+$/, '');
      const newControlName = baseName + index;
      formGroup.addControl(newControlName, new FormControl(false));
      this.form.formSections.forEach((section) => {
        section.formControls.forEach((formControl: IFormControl) => {
          if (formControl.name === control.name) {
            formControl.selectCheckboxOptions?.push({
              label: option.label,
              value: newControlName,
              isIncrement: option.isIncrement,
              imagePath: option.imagePath
            });
            formControl.selectCheckboxOptions?.forEach((checkOption) => {
              if (checkOption.value === option.value) {
                checkOption.isIncrement = false;
              }
            });
          }
        });
      });
    }
  }

  getProposerRelationship(control: IFormControl): Promise<any> {
    return new Promise((resolve, reject) => {
      const reqData = {
        productId: "1",
        policyType: this.renewalFormGroup.get('memberPolicyType')?.value,
      };
      this.yatraService.GetProposerRelationships(reqData).pipe(
        tap((res: any) => {
          let controlValidators: any = [];
          control.validators?.forEach((val: IValidator) => {
            if (val.validatorName === 'required') controlValidators.push(Validators.required);
            if (val.validatorName === 'email') controlValidators.push(Validators.email);
            if (val.validatorName === 'minlength') controlValidators.push(Validators.minLength(val.minLength as number));
            if (val.validatorName === 'maxlength') controlValidators.push(Validators.maxLength(val.maxLength as number));
            if (val.validatorName === 'pattern') controlValidators.push(Validators.pattern(val.pattern as string));
          });
          const formDataRelations = Object.keys(this.formData.insuredMembers)
            .filter(
              (relation) =>
                !res.data.relationShip.some((option: any) => option.value === relation)
            )
            .map((relation) => {
              const baseName = relation.replace(/\d+$/, '');
              const imagePath = res.data.relationShip.find(
                (option: any) => option.value.startsWith(baseName)
              )?.imagePath || '';
              const id = res.data.relationShip.find(
                (option: any) => option.value.startsWith(baseName)
              )?.id || '';
              return {
                id,
                value: relation,
                name: relation,
                isIncrement: false,
                imagePath,

              };
            });
          const mergedOptions = [...res.data.relationShip, ...formDataRelations];
          const groupedRelations: Record<string, any[]> = mergedOptions.reduce((acc: Record<string, any[]>, option: any) => {
            const baseName = option.value.replace(/\d+$/, '');
            const isNumericSuffix = /\d$/.test(option.value);
            if (isNumericSuffix) {
              if (!acc[baseName]) acc[baseName] = [];
              acc[baseName].push(option);
            }
            return acc;
          }, {});
          Object.values(groupedRelations).forEach((group) => {
            group.forEach((relation, idx) => {
              relation.isIncrement = idx === group.length - 1;
            });
          });
          control.selectCheckboxOptions = mergedOptions;
          const controlGroup = this.fb.group({});
          control.selectCheckboxOptions.forEach((option: any) => {
            controlGroup.addControl(option.value, new FormControl(false));
          });
          this.renewalFormGroup.removeControl('insuredMembers');
          this.renewalFormGroup.addControl(control.name, controlGroup);
          this.flattenObject(this.formData);
        }),
        tap(() => {
        })
      ).subscribe({
        next: (res) => {
          resolve(res);
        },
        error: (err) => {
          reject(err);
        }
      });
    });
  }

  async onSubmit(control: any) {
    console.log(this.renewalFormGroup.value, this.form, this.renewalFormGroup);
    if (this.renewalFormGroup.valid) {
      if (this.form.saveBtnFunction) {
        await this.resolveMethod(this.form.saveBtnFunction);
      } else if (control != null && control.onClickMethod) {
        await this.resolveMethod(control.onClickMethod);
      }
      if(this.renewalFormGroup.value.panNo){
        this.formData.panNo = this.renewalFormGroup.value.panNo
      }
      if (this.getFormIndexValue() < this.formSequence.length - 1 && this.form.saveBtnFunction != "generatehalfqoute" && control.onClickMethod != 'getFullQuoteViaOfflinePayment') {
        let currentState = history.state;
        let updatedState = { ...currentState,
          formData: this.encryptionService.encrypt(this.renewalFormGroup.getRawValue()),
          formIndex: (parseInt(currentState.formIndex) + 1).toString(),
        };
        Object.assign(history.state, updatedState);
        this.router.navigateByUrl(this.router.url, { state: updatedState });
        setTimeout(() => {
          this.incrementIndex();
          this.getFormDataFromFormSequence();
        }, 50);
      }
    }
    else {
      console.log('Form is invalid', this.renewalFormGroup);
      Object.keys(this.renewalFormGroup.controls).forEach(field => {
        const control = this.renewalFormGroup.get(field);
        if (control instanceof FormArray) {
          control.controls.forEach(arrayControl => {
            if (arrayControl instanceof FormGroup) {
              Object.keys(arrayControl.controls).forEach(nestedField => {
                const nestedControl = arrayControl.get(nestedField);
                nestedControl?.markAsTouched({ onlySelf: true });
              });
            } else {
              arrayControl?.markAsTouched({ onlySelf: true });
            }
          });
        }
        else if (control instanceof FormGroup) {
          control?.markAsDirty({ onlySelf: true });
        }
        else {
          control?.markAsTouched({ onlySelf: true });
        }
      });
      if (this.renewalFormGroup.invalid) {
        this.toast.warning({ detail: "WARNING", summary: "Please fill the mandatory fields", duration: 3000 });
      }
    }

  }

  handlePolicyTypeChange(control: any, planType: string | null = null): void {
    if (planType == null)
      planType = control.value;
    setTimeout(() => {
      this.form.formSections.forEach((section: any) => {
        section.formControls.forEach((formControl: any) => {
          if (formControl.name == 'insuredMembers') {
            if (((this.formData.productType == 'GHS' || this.formData.productType == 'AS') && formControl.selectCheckboxOptions?.length == 0) || (this.formData.productType != 'GHS' && this.formData.productType != 'AS')) {
              this.resetInsuredMembers(control, planType);
              this.getProposerRelationship(formControl);
            }
            section.visible = true;
          }
        });
      });
    }, 0);
  }

  resetInsuredMembers(control: any, planType: any) {
    this.renewalFormGroup.get('numberOfInsuredMembers')?.setValue(0);
    if (planType === 'Multi Individual') {
      if (control.dependentControls)
        this.changeMainFormDependentControls(control.dependentControls, false, control.name);
      this.form.formSections.forEach((section: any) => {
        if (section.sectionTitle == "Insured Member Details") {
          section.formControls[0].visible = true;
          if (section.formControls[1]) {
            section.formControls[1].visible = false;
            while (section.formControls[1].dynamicControls.length > 1) {
              section.formControls[1].dynamicControls.pop();
            }
          }
          section.visible = false;
        }
      });
    }
    else if (planType === 'Family Floater') {
      if (control.dependentControls)
        this.changeMainFormDependentControls(control.dependentControls, true, control.name);
      this.form.formSections.forEach((section: any) => {
        if (section.sectionTitle == "Insured Member Details") {
          section.formControls[0].visible = false;
          section.formControls[1].visible = true;
          while (section.formControls[0].dynamicControls.length > 1) {
            section.formControls[0].dynamicControls.pop();
          }
          section.visible = false;
        }
      });
    }
    else {
      if (control.dependentControls)
        this.changeMainFormDependentControls(control.dependentControls, false, control.name);
      this.form.formSections.forEach((section: any) => {
        if (section.sectionTitle == "Insured Member Details") {
          section.formControls[0].visible = false;
          section.formControls[1].visible = false;
          while (section.formControls[0].dynamicControls.length > 1) {
            section.formControls[0].dynamicControls.pop();
          }
          while (section.formControls[1].dynamicControls.length > 1) {  
            section.formControls[1].dynamicControls.pop();
          }
        }
      });
    }
  }

  changeMainFormDependentControls(
    dependentControlNames: (string | { name: string; visibility: boolean })[],
    visibility: boolean,
    controlName: string | null = null,
    parentControlName: string | null = null,
    controlIndex: number | null = null,
    innerControl: any = null
  ) {
    console.log(dependentControlNames,
      visibility,
      controlName,
      parentControlName,
      controlIndex,
      innerControl);
    const tempIndex = this.activeMemberTabIndex;
    setTimeout(() => {
      if (dependentControlNames) {
        dependentControlNames.forEach((dependent) => {
          const dependentName = typeof dependent === 'string' ? dependent : dependent.name;
          const dependentVisibility = typeof dependent === 'string' ? visibility : dependent.visibility;
          this.form.formSections.forEach((section: IFormSections) => {
            section.formControls.forEach((control: IFormControl) => {
              if (control.dynamicControls && controlIndex != null && control.dynamicControls.length > controlIndex) {
                const targetDynamicControl = JSON.parse(JSON.stringify(control.dynamicControls[controlIndex]));
                targetDynamicControl.forEach((dynamicControl: IDynamicControl) => {
                  if (dynamicControl.name === dependentName) {
                    dynamicControl.visible = dependentVisibility;
                  } else if (dynamicControl.subControls && dynamicControl.name === parentControlName) {
                    dynamicControl.subControls.forEach((subControlArray: any) => {
                      subControlArray.forEach((subControl: ISubControl) => {
                        if (subControl.name === dependentName) {
                          subControl.visible = dependentVisibility;
                        }
                      });
                    });
                  }
                });
                control.dynamicControls[controlIndex] = targetDynamicControl;
              }
              else if (control.name == parentControlName && control.subControls) {
                control.subControls.forEach((subControl: any) => {
                  if (subControl.name == controlName && controlIndex != null) {
                    if (subControl.innerSubControls) {
                      subControl.innerSubControls[controlIndex].coreControls.forEach((innerControl: any, zindex: any) => {
                        if (innerControl.name == dependentName) {
                          innerControl.visible = visibility;
                          let dparentControl = this.renewalFormGroup.get(control.name) as FormGroup;
                          let dcontrol = dparentControl.get(subControl.name) as FormGroup;
                          let dsubControl = dcontrol.get(subControl.innerSubControls[controlIndex].name) as FormArray;
                          let dindexj = dsubControl.at(zindex) as FormGroup;
                          let dinnercontrol = dindexj.get(innerControl.name) as FormGroup;
                          if (innerControl.visible == false && innerControl.dependentControls && innerControl.dependentControls.length > 0) {
                            if (dinnercontrol instanceof FormControl) {
                              dinnercontrol.setValue(false);
                            }
                            innerControl.dependentControls.forEach((dependentName: string) => {
                              const dependentControlIndex = subControl.innerSubControls[controlIndex].coreControls.findIndex(
                                (control: any) => control.name === dependentName
                              );
                              let dependentControl = subControl.innerSubControls[controlIndex].coreControls[dependentControlIndex];
                              if (dependentControl) {
                                dependentControl.visible = visibility;
                                dindexj = dsubControl.at(dependentControlIndex) as FormGroup;
                                dinnercontrol = dindexj.get(dependentControl.name) as FormGroup;
                                Object.keys(dinnercontrol.controls).forEach((element: any) => {
                                  dinnercontrol.removeControl(element);
                                });
                              }
                            });
                          }
                          if (innerControl.innerControls && innerControl.visible == true) {
                            this.initializeSubControls(innerControl.innerControls, dinnercontrol)
                          }
                          else if (innerControl.innerControls && innerControl.visible == false) {
                            Object.keys(dinnercontrol.controls).forEach((element: any) => {
                              dinnercontrol.removeControl(element);
                            });
                          }
                        }
                      })
                    }
                    else if (subControl.innerArrayControl) {
                      subControl.innerArrayControl[controlIndex].forEach((innerControl: any, zindex: any) => {
                        if (innerControl.name == dependentName) {
                          innerControl.visible = visibility;
                          let dparentControl = this.renewalFormGroup.get(control.name) as FormGroup;
                          let dcontrol = dparentControl.get(subControl.name) as FormArray;
                          let dindexj = dcontrol.at(controlIndex) as FormGroup;
                          let dinnercontrol = dindexj.get(innerControl.name) as FormGroup;
                          if (innerControl.visible == false && innerControl.dependentControls && innerControl.dependentControls.length > 0) {
                            if (dinnercontrol instanceof FormControl) {
                              dinnercontrol.setValue(false);
                            }
                            innerControl.dependentControls.forEach((dependentName: string) => {
                              const dependentControlIndex = subControl.innerArrayControl[controlIndex].coreControls.findIndex(
                                (control: any) => control.name === dependentName
                              );
                              let dependentControl = subControl.innerArrayControl[controlIndex].coreControls[dependentControlIndex];
                              if (dependentControl) {
                                dependentControl.visible = visibility;
                                dindexj = dcontrol.at(controlIndex) as FormGroup;
                                dinnercontrol = dindexj.get(dependentControl.name) as FormGroup;
                                Object.keys(dinnercontrol.controls).forEach((element: any) => {
                                  dinnercontrol.removeControl(element);
                                });
                              }
                              else {
                                console.log('Dependent Control not found for:', dependentName);
                              }
                            });
                          }
                          if (innerControl.innerControls && innerControl.visible == true) {
                            this.initializeSubControls(innerControl.innerControls, dinnercontrol)
                          }
                          else if (innerControl.innerControls && innerControl.visible == false) {
                            Object.keys(dinnercontrol.controls).forEach((element: any) => {
                              dinnercontrol.removeControl(element);
                            });
                          }
                        }
                      })
                    }
                  }
                })
              }
              else if (control.name == parentControlName && control.dynamicControls && controlIndex != null) {
                const targetDynamicControl = JSON.parse(JSON.stringify(control.dynamicControls[controlIndex]));
                targetDynamicControl.forEach((dynamicControl: IDynamicControl) => {
                  if (dynamicControl.name == controlName && dynamicControl.innerControls) {
                    dynamicControl.innerControls.forEach((innerArrayControl: any) => {
                      if (innerArrayControl.name == innerControl) {
                        innerArrayControl.visible = visibility;
                      }
                    })
                  }
                })
              }
              else if (control.name == parentControlName && control.innerArrayControl && controlIndex != null) {
                control.innerArrayControl[controlIndex].forEach((innerControl: any) => {
                  if (innerControl.name == dependentName) {
                    innerControl.visible = visibility;
                  }
                })
              }
              else if (control.name === dependentName) {
                control.visible = dependentVisibility;
                if (dependentVisibility) {
                  let controlValidators: any = [];
                  control.validators?.forEach((val: IValidator) => {
                    if (val.validatorName === 'required') controlValidators.push(Validators.required);
                    if (val.validatorName === 'email') controlValidators.push(Validators.email);
                    if (val.validatorName === 'minlength') controlValidators.push(Validators.minLength(val.minLength as number));
                    if (val.validatorName === 'maxlength') controlValidators.push(Validators.maxLength(val.maxLength as number));
                    if (val.validatorName === 'pattern') controlValidators.push(Validators.pattern(val.pattern as string));
                  });
                  this.renewalFormGroup.get(control.name)?.setValidators(controlValidators);
                  this.renewalFormGroup.get(control.name)?.updateValueAndValidity();
                  if (control.name == 'zoneValue' && control.type == 'select') {
                    control.options = this.formData.availableZones.map((zone: any) => ({
                      name: zone,
                      value: zone
                    }));
                  }
                } else {
                  this.renewalFormGroup.get(control.name)?.clearValidators();
                  this.renewalFormGroup.get(control.name)?.reset();
                }
              }
            });
          });
        });
        this.changeDetectorRef.detectChanges();
      }
    }, 0);
    this.activeMemberTabIndex = tempIndex;
  }

  addCustomValidation(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const controlGroup = this.renewalFormGroup.get('insuredMembers') as FormGroup;
      if (controlGroup && this.renewalFormGroup.get('planType')?.value == 'Multi Individual') {
        const hasAtLeastOneSelected = Object.keys(controlGroup.controls).some(
          key => controlGroup.controls[key].value === true
        );
        return hasAtLeastOneSelected ? null : { required: true };
      }
      else if (controlGroup && this.renewalFormGroup.get('memberPolicyType')?.value == 'Family Floater') {
        const selectedCount = Object.keys(controlGroup.controls).filter(
          key => controlGroup.controls[key].value === true
        ).length;
        if (selectedCount < 2) {
          return { required: true };
        }
      }
      return null;
    };
  }

  memberSelected(event: Event | null, option: any, controls: any) {
    if (event != null) {
      if (this.existingRelations.some(relation => relation.includes(option.value))) {
        const selectedCheckbox = event.target as HTMLInputElement;
        selectedCheckbox.checked = true;
        return;
      }
    }
    const checkbox = event ? (event.target as HTMLInputElement) : { checked: true };
    if (checkbox.checked && this.renewalFormGroup.get('memberPolicyType')?.value == 'Family Floater') {
      this.toast.warning({ detail: "WARNING", summary: "Cannot select more than 4 childrens", duration: 3000 });
      checkbox.checked = false;
      return;
    }
    else {
      this.form.formSections.forEach(formsection => {
        formsection.formControls.forEach(formControl => {
          if (checkbox.checked == true) {
            if (formControl.name == controls.idProperty && formControl.dynamicControls && formControl.visible == true) {
              formsection.visible = true;
              let tempControl = formControl.dynamicControls[0].map((element: any) => ({ ...element }));
              tempControl[1].value = option.value;
              tempControl[0].value = option;
              formControl.dynamicControls?.push(tempControl);
              let formArr = this.renewalFormGroup.get(controls.idProperty) as FormArray;
              if (formArr != null) {
                formArr = this.renewalFormGroup.get(controls.idProperty) as FormArray;
                formArr.push(this.initializeDynamicFormControls(tempControl, formControl.dynamicControls.length - 1));
              }
              else {
                formArr = this.fb.array([]);
                formArr.push(this.initializeDynamicFormControls(tempControl, formControl.dynamicControls.length - 1));
                this.renewalFormGroup.addControl(controls.idProperty, formArr);
              }
              if (this.renewalFormGroup.get('memberPolicyType')?.value == 'Family Floater') {
                (this.renewalFormGroup.get(controls.idProperty) as FormArray)?.controls.forEach((control: any) => {
                  control.get('sumInsured')?.setValue(this.renewalFormGroup.get('sumInsured')?.value);
                })
              }
              this.renewalFormGroup.get('numberOfInsuredMembers')?.setValue(this.renewalFormGroup.get('numberOfInsuredMembers')?.value + 1);
            }
          }
          else if (checkbox.checked == false) {
            if (formControl.name == controls.idProperty && formControl.dynamicControls && formControl.visible == true) {
              let index = formControl.dynamicControls?.findIndex((element: any) => element[1].value == option.value);
              if (index !== undefined && index !== -1) {
                formControl.dynamicControls?.splice(index, 1);
                let formArr = this.renewalFormGroup.get(controls.idProperty) as FormArray;
                formArr.removeAt(index - 1);
                if (formArr.length == 0) {
                  formsection.visible = false;
                }
                Object.keys(this.formData).forEach(key => {
                  if (key.startsWith(`${controls.idProperty}.${index - 1}.`)) {
                    delete this.formData[key];
                  }
                  if (key.includes(option.value)) {
                    delete this.formData[key];
                  }
                });
                if (this.covers[index - 1]) {
                  this.covers.splice(index - 1, 1);
                }
                this.renewalFormGroup.get('numberOfInsuredMembers')?.setValue(
                  this.renewalFormGroup.get('numberOfInsuredMembers')?.value - 1
                );
              }
            }
          }
        });
      })
      const insuredMembersFormGroup = this.renewalFormGroup.get('insuredMembers') as FormGroup;
      if (insuredMembersFormGroup) {
        insuredMembersFormGroup.setValidators(this.addCustomValidation());
        insuredMembersFormGroup.updateValueAndValidity();
        console.log(this.renewalFormGroup.get('insuredMembers'));
      }
    }
  }

  flattenObject(obj: any, prefix = '') {
    console.log(obj);
    Object.keys(obj).forEach(key => {
      const value = obj[key];
      const newKey = prefix + key;
      if (key == 'criticalIllness') {
      }
      if (typeof value === 'object' && value !== null && Object.keys(value).length > 0) {
        if (typeof value === 'object' && value !== null && 'id' in value) {
          this.renewalFormGroup.get(newKey)?.patchValue(value);
        }
        else if (this.renewalFormGroup.get(newKey) instanceof FormGroup) {
          const formGroup = this.renewalFormGroup.get(newKey);
          Object.keys(value).forEach((key2) => {
            if (formGroup?.get(key2) instanceof FormArray) {
              const formArray = formGroup?.get(key2) as FormArray;
              const arrayOfObject = value[key2];
              arrayOfObject.forEach((obj: any, index: any) => {
                if (key2 == 'covers') {
                  const group = this.fb.group({
                    coverId: [obj.coverId],
                    value: [obj.value]
                  });
                  formArray.push(group);
                }
                else {
                  const innerarray = formArray.at(index) as FormGroup;
                  Object.keys(obj).forEach((key) => {
                    if (innerarray.contains(key)) {
                      innerarray.get(key)?.setValue(obj[key]);
                    } else {
                      innerarray.addControl(key, new FormControl(obj[key]));
                    }
                  });
                }
              });
            }
            else if (formGroup?.get(key2) instanceof FormGroup) {
              console.log(key2, this.formData.insuredMembers);
              Object.keys(value[key2]).forEach((member: any) => {
                console.log(formGroup?.get(key2)?.get(member) instanceof FormArray, formGroup?.get(key2)?.get(member), value[key2][member]);
                if (formGroup?.get(key2)?.get(member) instanceof FormArray) {
                  const addOnMemberDetails = formGroup?.get(key2)?.get(member) as FormArray;
                  addOnMemberDetails.controls.forEach((control, index) => {
                    if (value[key2][member][index]) {
                      control.patchValue(value[key2][member][index]);
                    }
                  });
                }
              })
            }
            else {
              formGroup?.get(key2)?.setValue(value[key2]);
            }
          })
        }
        else {
          this.flattenObject(value, newKey + '.');
        }
      }
      else {
        if (this.renewalFormGroup.get(newKey) && this.renewalFormGroup.get(newKey)?.value == "") {
          this.renewalFormGroup.get(newKey)?.patchValue(value);
        }
      }
    });
  }

  checkValidations(
    control: IFormControl | IDynamicControl,
    parentControl: IFormControl | null = null,
    index: number | null = null, subControl: any | null = null,
    innerControl: any | null = null,
    innerSubControl: any | null = null
  ): boolean {
    let myControl: AbstractControl | null;
    if (innerControl != null && innerSubControl != null && parentControl != null && index != null) {
      const parentArray = this.renewalFormGroup.get(control.name) as FormGroup;
      const parentArray1 = parentArray.controls[parentControl.name] as FormGroup;
      const parentArray2 = parentArray1.controls[subControl.name] as FormArray;
      const parentArray3 = parentArray2.controls[index] as FormGroup;
      myControl = parentArray3.controls[innerControl.name].get(innerSubControl.name);
    }
    else if (subControl != null && parentControl != null && index != null) {
      const parentArray = this.renewalFormGroup.get(control.name) as FormGroup;
      const parentArray1 = parentArray.controls[parentControl.name] as FormArray;
      const parentArray2 = parentArray1.controls[index] as FormGroup;
      myControl = parentArray2.get(subControl.name);
    }
    else if (parentControl != null && index != null) {
      const parentArray = this.renewalFormGroup.get(parentControl.name) as FormArray;
      myControl = parentArray.controls[index].get(control.name);
    } else {
      myControl = this.renewalFormGroup.get(control.name);
    }
    if (myControl instanceof FormControl) {
      return myControl.invalid && myControl.touched;
    } else if (myControl instanceof FormGroup) {
      return myControl.invalid && !myControl.pristine;
    }
    return false;
  }

  getButtonClass(control: any): string {
    return this.selectedButton === control.name ? 'active-button' : '';
  }

  onCheckboxChange(event: any, control: any, parentControl: any = null, index: number | null = null) {
    this.changesMade = true;
    if (parentControl != null && typeof parentControl === 'object') {
      this.parentControl = parentControl;
    }
    if ((event.target.type === 'button')) {
      if (parentControl != null && typeof parentControl === 'object' && parentControl.type == 'questionnaire') {
        this.question = parentControl.name;
        this.openPopUp();
      }
    }
    if ((event.target.type === 'checkbox' && event.target.checked)) {
      if (parentControl != null && typeof parentControl === 'object' && parentControl.type == 'combinedCheckbox') {
        const firstKey = Object.keys((this.renewalFormGroup.get(parentControl.name) as FormGroup)?.controls)[0];
        (this.renewalFormGroup.get(parentControl.name) as FormGroup)?.controls[firstKey].setValue(false);
        this.showOverlay(parentControl);
      }
      if (parentControl != null && parentControl.type == 'questionnaire') {
        const arrayName = (control.name).charAt(0).toUpperCase() + (control.name).slice(1);
        parentControl.subControls.forEach((subControl: any) => {
          if (subControl.name === arrayName) {
            subControl.visible = event.target.checked;
            let parentCode = this.renewalFormGroup.get(parentControl.name) as FormGroup;
            let controlCode = parentCode.get(subControl.name) as FormArray;
            if (event.target.checked == true) {
              if (index) {
                const newForm = this.initializeSubControls(subControl.innerArrayControl[0]);
                controlCode.push(newForm);
              }
            }
          }
          if (subControl.name === 'doneButton') {
            subControl.disabled = !event.target.checked;
          }
        });
        this.openPopUp();
      }
      if (control.onChangeMethod)
        this.resolveMethod(control.onChangeMethod, control?.popUpFormId, control?.dependentControls, true, control?.name, parentControl?.name, index, 'add');
    }
    else if (event.target.type === 'checkbox' && event.target.checked == false) {
      if (parentControl != null && typeof parentControl === 'object' && parentControl.type == 'combinedCheckbox') {
        parentControl.subControls.forEach((subControl: any) => {
          if (subControl.innerSubControls) {
            for (let i = 1; i < subControl.innerSubControls.length; i++) {
              if (subControl.innerSubControls[i].coreControls) {
                for (let j = 0; j < subControl.innerSubControls[i].coreControls.length; j++) {
                  if (subControl.conditionCheck) {
                    if (subControl.innerSubControls[i].coreControls[j].dependentControls) {
                      if (subControl.innerSubControls[i].coreControls[j].conditionCheck) {
                        subControl.innerSubControls[i].coreControls[j].value = false;
                        subControl.innerSubControls[i].coreControls[j].visible = true;
                      }
                      else {
                        subControl.innerSubControls[i].coreControls[j].value = false;
                        subControl.innerSubControls[i].coreControls[j].visible = false;
                      }
                    }
                    else {
                      subControl.innerSubControls[i].coreControls[j].visible = false;
                    }
                    let newcontrol = (this.renewalFormGroup.get(`${parentControl.name}.${subControl.name}.${subControl.innerSubControls[i].name}.${j}.${subControl.innerSubControls[i].coreControls[j].name}`) as any);
                    if (newcontrol instanceof FormGroup) {
                      Object.keys(newcontrol.controls).forEach((element: any) => {
                        console.log(newcontrol.controls[element], element);
                        newcontrol.removeControl(element);
                      });
                    }
                    else {
                      newcontrol.setValue(false);
                    }
                  }
                  else if (this.renewalFormGroup.get(`${parentControl.name}.${subControl.name}.${subControl.innerSubControls[i].name}.${j}.${subControl.innerSubControls[i].coreControls[j].name}`)?.value == true || this.renewalFormGroup.get(`${parentControl.name}.${subControl.name}.${subControl.innerSubControls[i].name}.${j}.${subControl.innerSubControls[i].coreControls[j].name}`)?.value == false) {
                    this.renewalFormGroup.get(`${parentControl.name}.${subControl.name}.${subControl.innerSubControls[i].name}.${j}.${subControl.innerSubControls[i].coreControls[j].name}`)?.setValue(false);
                  }
                  else {
                    this.renewalFormGroup.get(`${parentControl.name}.${subControl.name}.${subControl.innerSubControls[i].name}.${j}.${subControl.innerSubControls[i].coreControls[j].name}`)?.setValue('');
                  }
                }
              }
            }
          }
        })
        // this.changeRecalculate(true);
        // this.addOnRemoved(control, parentControl);
      }
      if (parentControl != null && parentControl.type == 'questionnaire') {
        const arrayName = (control.name).charAt(0).toUpperCase() + (control.name).slice(1);
        console.log('questionnaire', arrayName, event.target.checked);
        parentControl.subControls.forEach((subControl: any) => {
          if (subControl.name === arrayName) {
            subControl.visible = event.target.checked;
            if (event.target.checked == false) {
              subControl.innerArrayControl = subControl.innerArrayControl?.slice(0, 2);
              let formArray = (this.renewalFormGroup.get(parentControl.name) as FormGroup)?.controls[arrayName] as FormArray;
              formArray.clear();
              Object.keys(this.formData).forEach(key => {
                const baseKey = `${control.name}.${subControl.name}.`;
                if (key.startsWith(baseKey)) {
                  const index = key.substring(baseKey.length).split('.')[0];
                  if (index !== '0') {
                    delete this.formData[key];
                  } else {
                    this.formData[key] = '';
                  }
                }
              });
            }
          }
          if (subControl.name === 'doneButton') {
            subControl.disabled = false;
          }
        });
        this.openPopUp();
      }
      if (control.onChangeMethod)
        this.resolveMethod(control.onChangeMethod, control?.popUpFormId, control?.dependentControls, false, control?.name, parentControl?.name, index, 'remove');
    }
  }

  // addOnAdded(control: any, parentControl: any = null) {
  //   let addOnData = this.renewalFormGroup.get(parentControl.name)?.value;
  //   let modifiedInsuredMemberDetails = this.formData.insuredMemberDetails;

  //   Object.keys(addOnData.addOnDetails).forEach((key) => {
  //     if (addOnData.addOnDetails[key][0].memberCheckbox === true) {
  //       modifiedInsuredMemberDetails.forEach((member: any, index: number) => {
  //         if (member.relation === key) {
  //           let addOnSumInsured: any = 0;
  //           const coverId = addOnData.addOnId;
  //           const coverName = addOnData.additionalCoverName;
  //           let coverFound = false;

  //           if (!member.covers) {
  //             member.covers = [];
  //           }

  //           addOnData.addOnDetails[key].forEach((addOnDetail: any) => {
  //             if (addOnDetail.addOnSumInsured) {
  //               addOnSumInsured = addOnDetail.addOnSumInsured;
  //             }
  //             if (addOnData.addOnId === 'PA' && addOnDetail.occupation) {
  //               member.occupationCode = JSON.parse(addOnDetail.occupation).value;
  //             }
  //             if (addOnData.addOnId === 'PA' && addOnDetail.occupationRisk) {
  //               member.natureOfDutyCode = JSON.parse(addOnDetail.occupationRisk).value;
  //             }
  //           });

  //           member.covers.forEach((cover: any) => {
  //             if (cover.coverId === coverId) {
  //               cover.value = addOnSumInsured;
  //               coverFound = true;
  //             }
  //           });

  //           if (!coverFound) {
  //             member.covers.push({
  //               coverId: coverId,
  //               value: addOnSumInsured,
  //               coverName: coverName
  //             });
  //           }

  //           if (!this.covers[index]) {
  //             this.covers[index] = [];
  //           }

  //           let coverInCovers = this.covers[index].find((c: any) => c.coverId === coverId);
  //           if (coverInCovers) {
  //             coverInCovers.value = addOnSumInsured;
  //           } else {
  //             this.covers[index].push({
  //               coverId: coverId,
  //               value: addOnSumInsured,
  //               coverName: coverName
  //             });
  //           }
  //         }
  //       });
  //     } else if (addOnData.addOnDetails[key][0].memberCheckbox === false) {
  //       modifiedInsuredMemberDetails.forEach((member: any, index: number) => {
  //         if (member.relation === key) {
  //           const coverId = addOnData.addOnId;

  //           if (member.covers) {
  //             member.covers = member.covers.filter((cover: any) => cover.coverId !== coverId);
  //           }

  //           if (this.covers[index]) {
  //             this.covers[index] = this.covers[index].filter((cover: any) => cover.coverId !== coverId);
  //           }
  //         }
  //       });
  //     }
  //   });
  // }

  //New Remove addOn
  // addOnRemoved(control: any, parentControl: any = null) {
  //   let addOnData = this.renewalFormGroup.get(parentControl.name)?.value;
  //   let modifiedInsuredMemberDetails = this.formData.insuredMemberDetails;

  //   // Iterate over each member and remove the specified add-on from both insuredMemberDetails.covers and covers
  //   modifiedInsuredMemberDetails.forEach((member: any, index: number) => {
  //     const coverId = addOnData.addOnId;

  //     // Remove the add-on from the covers array of insuredMemberDetails
  //     if (member.covers) {
  //       member.covers = member.covers.filter((cover: any) => cover.coverId !== coverId);
  //     }

  //     // Synchronize the change in the local covers variable
  //     if (this.covers[index]) {
  //       this.covers[index] = this.covers[index].filter((cover: any) => cover.coverId !== coverId);
  //     }
  //   });

  //   // Call getPremiumAmount after removing the add-on if needed
  //   // this.getPremiumAmount();
  // }

  addOnMemberAdded(subControl: any, parentControl: any = null) {
    console.log(subControl, parentControl);

    if (parentControl != null) {
      let count = 0;
      let memberDetails = this.renewalFormGroup.get(parentControl.name)?.get(subControl.name)?.value;
      console.log(memberDetails);

      Object.keys(memberDetails).forEach(key => {
        let memberArray = memberDetails[key];
        console.log(memberArray);

        // Check if memberCheckbox is false for any member and set other fields to empty
        let memberCheckbox = memberArray.find((member: any) => member.memberCheckbox === false);

        if (memberCheckbox) {
          memberArray.forEach((member: any) => {
            if (!member.memberCheckbox) {
              // Set other fields to empty if memberCheckbox is false
              Object.keys(member).forEach(memberKey => {
                console.log(memberKey);
                if (memberKey !== 'memberCheckbox') {
                  member[memberKey] = '';
                  console.log((this.renewalFormGroup.get(parentControl.name)?.get(subControl.name)?.get(key)) as FormArray);
                  let memberArrayControl = (this.renewalFormGroup.get(parentControl.name)?.get(subControl.name)?.get(key)) as FormArray;
                  let memberFormGroup = memberArrayControl.controls.find((group: AbstractControl) => {
                    return (group as FormGroup).get(memberKey)
                  }) as FormGroup;
                  let memberFormGroupControl = memberFormGroup.get(memberKey);
                  if (memberFormGroupControl) {
                    memberFormGroupControl.setValue('');
                  }

                }
              });
            }
          });
        } else {
          count++;
          console.log(subControl, parentControl);
          let dependentControls: string[] = [];
          let tempControlArray = (((this.renewalFormGroup.get(parentControl.name) as FormGroup)?.get(subControl.name) as FormGroup)?.get(key) as FormArray);
          let breakFlag = false;
          this.form.formSections.forEach((section: IFormSections) => {
            if (breakFlag) return;
            section.formControls.forEach((control: IFormControl) => {
              if (breakFlag) return;
              if (control.name == parentControl.name && control.subControls) {
                control.subControls.forEach((subControl: ISubControl) => {
                  if (breakFlag) return;
                  if (subControl.innerSubControls) {
                    subControl.innerSubControls.forEach((innerSubControl: ISubControl) => {
                      if (breakFlag) return;
                      if (innerSubControl.name == key) {
                        innerSubControl.coreControls?.forEach((coreControl: ISubControl, aindex: any) => {
                          if (breakFlag) return;
                          console.log(coreControl);
                          if (coreControl.innerControls) {
                            coreControl.innerControls?.forEach((innerControl: any) => {
                              this.validationErrorNotification(tempControlArray, aindex, coreControl, innerControl, innerSubControl);
                              breakFlag = true;
                            })
                          }
                          else if (coreControl.name == 'memberCheckbox' && coreControl.dependentControls) {
                            dependentControls = coreControl.dependentControls;
                          }
                          console.log(dependentControls, tempControlArray);
                          if (!subControl.conditionCheck) {
                            let memberFormGroup = tempControlArray.controls.find((group: AbstractControl) => {
                              return (group as FormGroup).get(coreControl.name)
                            }) as FormGroup;
                            console.log(memberFormGroup);

                            let memberFormGroupControl = memberFormGroup.get(coreControl.name);
                            if (memberFormGroupControl?.value == '' && coreControl.type == 'text' && coreControl.name == 'addOnSumInsured') {
                              memberFormGroupControl.setValue(this.formData.sumInsured);
                            }
                            else if (memberFormGroupControl?.value == '') {

                              tempControlArray.controls.forEach((coreControlGroup: any) => {
                                Object.keys(coreControlGroup.controls).forEach((controlName: string) => {
                                  const control = coreControlGroup.get(controlName);

                                  if (control) {
                                    if (control.value === true) {
                                      // If the control's value is true, set it to false
                                      control.setValue(false);
                                    } else {
                                      // Set all other values to an empty string
                                      control.setValue('');
                                    }
                                  }
                                });

                              })
                              breakFlag = true;
                              count--;
                            }

                            console.log(memberFormGroup);




                          }
                        })
                      }
                    })
                  }
                })
              }
            })
          })
        }
      });
      console.log((this.renewalFormGroup.get(parentControl.name) as FormGroup)?.controls)
      // ?.controls[0].setValue(false);
      let control = this.renewalFormGroup.get(parentControl.name) as FormGroup;
      if (control) {
        const firstKey = Object.keys((this.renewalFormGroup.get(parentControl.name) as FormGroup)?.controls)[0];
        console.log(firstKey, count);
        // Get the first key
        if (count == 0) {
          control.controls[firstKey].setValue(false);
          // this.addOnRemoved(subControl, parentControl)
        }
        else {
          control.controls[firstKey].setValue(true);
          this.changeOverLayDone(subControl, parentControl, true);
          // this.addOnAdded(subControl, parentControl);
        }
      }

    }
    this.closeOverlay(subControl, parentControl);
  }

  closeOverlay(subControl: any, control: any = null) {
    if (subControl.conditionCheck && (this.renewalFormGroup.get(control.name) as FormGroup).invalid) {
      console.log(subControl);
      this.toast.warning({ detail: "WARNING", summary: "Please fill the mandatory fields", duration: 3000 })
    }
    else {
      this.closePopUp();
      subControl.visible = false;
    }
  }

  closePopUp(control: any = null) {
    console.log(control, this.renewalFormGroup);
    if (this.renewalFormGroup.invalid) {
      let dynamicControl = this.renewalFormGroup.get(control.name);
      this.traverseFormGroup(dynamicControl as FormGroup);
      if (dynamicControl instanceof FormGroup) {
        Object.keys(dynamicControl.controls).forEach(arrayControl => {
          console.log(arrayControl);
        })
      }
      console.log(this.renewalFormGroup, dynamicControl);
      // this.toast.warning({ detail: "WARNING", summary: "Please fill the mandatory fields", duration: 3000 })
    }
    else {
      this.isOverlayVisible = false;
    }
  }

  changeOverLayDone(control: any, parentControl: any, changeValue: boolean = false) {
    this.form.formSections.forEach((section) => {
      section.formControls.forEach((controls: any) => {
        if (controls.name == 'recalculate') {
          controls.visible = true;
        }
        if (controls.name == 'next') {
          controls.visible = false;
        }
        if (controls.name == parentControl.name) {
          if (parentControl.subControls) {
            parentControl.subControls.forEach((subControl: any) => {
              if (subControl.innerSubControls) {
                subControl.innerSubControls.forEach((innerSubControl: any) => {
                  if (innerSubControl.name == 'doneButton') {
                    if (subControl.conditionCheck) {
                      innerSubControl.disabled = false;
                    }
                    else {
                      innerSubControl.disabled = changeValue;
                    }
                  }
                })
              }
            })
          }
        }
      })
    })
  }

  showOverlay(control: any) {
    this.form.formSections.forEach((section: any) => {
      section.formControls.forEach((formControl: any) => {
        console.log(formControl, control);
        if (formControl.name == control.name && formControl.subControls) {
          formControl.subControls.forEach((subControl: any) => {
            if (subControl.name == 'addOnDetails') {
              subControl.visible = true;
            }
          })
        }
      })
    })
    this.openPopUp();
  }

  openPopUp() {
    this.isOverlayVisible = true;
  }

  traverseFormGroup(formGroup: FormGroup | FormArray) {
    if (formGroup instanceof FormGroup) {
      Object.keys(formGroup.controls).forEach((key) => {
        const control = formGroup.get(key);

        if (control instanceof FormControl) {
          control.markAsTouched();
          console.log(`FormControl - Key: ${key}, Value: ${control.value}`);
        } else if (control instanceof FormGroup) {
          console.log(`FormGroup - Key: ${key}`);
          // Recursively traverse nested FormGroup
          this.traverseFormGroup(control);
        } else if (control instanceof FormArray) {
          console.log(`FormArray - Key: ${key}`);
          control.controls.forEach((arrayControl, index) => {
            console.log(`FormArray Index: ${index}`);
            // Recursively traverse FormGroup or FormControl within the FormArray
            this.traverseFormGroup(arrayControl as FormArray);
          });
        }
      });
    } else if (formGroup instanceof FormArray) {
      formGroup.controls.forEach((arrayControl, index) => {
        console.log(`FormArray Index: ${index}`);
        // Recursively traverse FormGroup or FormControl within the FormArray
        this.traverseFormGroup(arrayControl as FormArray);
      });
    }
  }

  hasSubValue(control: any, parentControl: any | null = null, innerControl: any | null = null, innerSubControl: any | null = null, index: any | null = null) {
    console.log(control, parentControl, innerControl, innerSubControl, index, this.renewalFormGroup);
    const formControl = parentControl != null && index != null ?
      (((this.renewalFormGroup.get(control.name) as FormGroup)?.controls[parentControl.name] as FormGroup).controls[innerControl.name] as FormArray).controls[index].get(innerSubControl.name)?.value
      : this.renewalFormGroup.get(control.name);
    return formControl;
  }

  hasInnerSubValue(control: any, parentControl: any | null = null, subControl: any | null = null, index: any | null = null, innerControl: any | null = null, innerSubControl: any | null = null) {
    const formControl = parentControl != null && index != null
      ? ((((this.renewalFormGroup.get(control.name) as FormGroup)?.controls[parentControl.name] as FormGroup)
        .controls[subControl.name] as FormArray).controls[index] as FormGroup)
        .controls[innerControl.name].get(innerSubControl.name)
      : this.renewalFormGroup.get(control.name);
    return formControl ? formControl.value : null;
  }

  // changeRecalculate(visiblility: boolean) {
  //   this.form.formSections.forEach((section: any) => {
  //     section.formControls.forEach((formControl: any) => {
  //       if (formControl.name == 'recalculate') {
  //         formControl.visible = visiblility;
  //       }
  //       if (formControl.name == 'next') {
  //         formControl.visible = !visiblility;
  //       }
  //     })
  //   })
  // }

  validationErrorNotification(dynamicControl: any, aindex: any, coreControl: any, innerControl: any, innerSubControl: any) {
    console.log(dynamicControl, aindex, coreControl, innerControl, innerSubControl);
    if (dynamicControl instanceof FormArray) {
      dynamicControl.controls.forEach(arrayControl => {
        console.log(arrayControl);
        if (arrayControl instanceof FormGroup) {
          Object.keys(arrayControl.controls).forEach((nestedField: any) => {
            const fieldJson = innerSubControl.coreControls.find((type: any) => type.name == nestedField);
            console.log(fieldJson);
            if (arrayControl.controls[nestedField] instanceof FormGroup) {
              const subControl = arrayControl.controls[nestedField] as FormGroup;

              for (const controlName of Object.keys(subControl.controls)) {
                const control = subControl.controls[controlName];
                const nestedControl = subControl.get(controlName);
                console.log(controlName, control, nestedControl);
                nestedControl?.markAsTouched({ onlySelf: true });
              }
            }

            else if (fieldJson.type != 'checkbox') {
              const nestedControl = arrayControl.get(nestedField);
              nestedControl?.markAsTouched({ onlySelf: true });
            }
          });
        } else {
          arrayControl?.markAsTouched({ onlySelf: true });
        }
      });
    }
  }

  //tab-view methods
  generateHeader(control: any, i: any) {  
    const imagePath = (this.renewalFormGroup.get(control.name) as FormArray)?.controls[i - 1].value['relationshipType'].imagePath;
    return imagePath;
  }

  selectTab(tabName: string) {
    this.activeTab = tabName;
    this.expandedItem = '';
  }

  toggleContent(index: number): void {
    this.expandedCardIndex = this.expandedCardIndex === index ? null : index;
  }

  onButtonClick(control: any) {
    this.selectedButton = control.name;
    const paymentModeControl = this.renewalFormGroup.get('paymentMode');
    if (paymentModeControl) {
      paymentModeControl.setValue(this.selectedButton);
    }
    if (this.selectedButton !== 'offline') {
      this.form.formSections.forEach((section: any) => {
          section.formControls.forEach((controls: any) => {
              if (controls.name === 'offline' && controls.dependentControls) {
                  controls.dependentControls.forEach((item: any) => {
                      const controlToHide = this.form.formSections
                          .flatMap((sec: any) => sec.formControls)
                          .find((ctrl: any) => ctrl.name === item);
                      if (controlToHide) {
                          controlToHide.visible = false;
                          if (controlToHide.name === "paymentOption" && controlToHide.options) {
                            this.renewalFormGroup.patchValue({ paymentOption: '' });
                            controlToHide.options.forEach((option: any) => {                                  
                                  if (option.dependentControls) {
                                      this.form.formSections.forEach((section: any) => {
                                          section.formControls.forEach((control: any) => {
                                            if(control.label != "Total Premium/Incl tax"){
                                              if (option.dependentControls.some((item: any) => item.name === control.name && item.visibility)) {
                                                control.visible = false;
                                              }
                                            }
                                          });
                                      });
                                  }                                  
                            });
                          }
                      }
                  });
              }
          });
      });
  }
  // else {
  //     this.form.formSections.forEach((section: any) => {
  //       section.formControls.forEach((controls: any) => {
  //         if (controls.name !== 'offline' && controls.dependentControls) {
  //           controls.dependentControls.forEach((item: any) => {
  //             const controlToHide = this.form.formSections
  //               .flatMap((sec: any) => sec.formControls)
  //               .find((ctrl: any) => ctrl.name === item);
  //             if (controlToHide) {
  //               controlToHide.visible = false;
  //             }
  //           });
  //         }
  //       });
  //     });
  //   }
    ['autoDebit', 'emandate_payment'].forEach((button) => {
      if (this.selectedButton !== button) {
        this.form.formSections.forEach((section: any) => {
          section.formControls.forEach((controls: any) => {
            if (controls.name === button && controls.dependentControls) {
              controls.dependentControls.forEach((item: any) => {
                const controlToHide = this.form.formSections
                  .flatMap((sec: any) => sec.formControls)
                  .find((ctrl: any) => ctrl.name === item);
                if (controlToHide) {
                  controlToHide.visible = false;
                  const formControl = this.renewalFormGroup.get(controlToHide.name);
                  if (formControl) {
                    formControl.disable();
                    formControl.clearValidators();
                    formControl.updateValueAndValidity();
                  }
                }
              });
            }
          });
        });
      }
    });
    if (control.dependentControls) {
      this.form.formSections.forEach((section: any) => {
        section.formControls.forEach((controls: any) => {
          control.dependentControls.forEach((item: any) => {
            if (controls.name == item) {
              controls.visible = true;
              const formControl = this.renewalFormGroup.get(controls.name);
              if (formControl) {
                formControl.enable();
                if (controls.validators) {
                  const validators = controls.validators.map((val: any) => {
                    if (val.validatorName === 'required') {
                      return Validators.required;
                    } else if (val.validatorName === 'pattern') {
                      return Validators.pattern(val.pattern); // Add pattern validator
                    } else if (val.validatorName === 'maxlength' && val.maxLength) {
                      return Validators.maxLength(val.maxLength);
                    } else if (val.validatorName === 'minlength' && val.minLength) {
                      return Validators.minLength(val.minLength);
                    }
                    return null;
                  }).filter(Boolean);
                  formControl.setValidators(validators);
                  formControl.updateValueAndValidity();
                }
              }
            }
          });
          if (controls.name == 'nextNotWork' && (control.dependentControls.includes('nextOffline') || control.dependentControls.includes('nextOnline'))) {
            controls.visible = false;
          }
        });
      });
    } else {
      let list: any = [];
      this.form.formSections.forEach((section: any) => {
        section.formControls.forEach((controls: any) => {
          if (controls.dependentControls) {
            list = controls.dependentControls;
          }
          list.forEach((item: any) => {
            if (controls.name == item) {
              controls.visible = false;
              const formControl = this.renewalFormGroup.get(control.name);
              if (formControl) {
                formControl.disable();
                formControl.clearValidators();
                formControl.updateValueAndValidity();
              }
            }
          });
        });
      });
    }
  }

  async getAllBankDetails(control: any) {
    if (!this.bankNameList) { 
      this.yatraService.getAllBankDetails().subscribe({
        next: (res: any) => {
          this.bankNameList = res.data;
          this.setBankOptions(control);
        },
        error: (err) => {
          console.error(err);
        }
      });
    } else {
      this.setBankOptions(control);
    }
  }
  
  private setBankOptions(control: any) {
    control.options = this.bankNameList;
    const matchingOption = this.bankNameList.find((opt: any) => opt.value?.toString().toLowerCase() === control.value?.toString().toLowerCase());    
    if (matchingOption) {
      control.value = JSON.stringify(matchingOption);
    }
    this.renewalFormGroup.get(control.name)?.setValue(control.value);
  }
  
  async getBankCity(event: any, otherControl: any) {
    if(otherControl){
      otherControl.value = "";
      otherControl.options = [];
      const data = JSON.parse(event.target.value);
      this.bankCode = data.id;
      const reqData = {
        "cityName": "",
        "bankName": this.bankCode
      };
      this.yatraService.getBankCity(reqData).subscribe({
        next: (res: any) => {
          console.log(res);
          otherControl.options = [...res.data];
        },
        error: (err) => {
          console.error(err);
        }
      });

    } else {
      const reqData = {
        "cityName": "",
        "bankName": event.value
      };
      this.bankCode = event.value;
      this.yatraService.getBankCity(reqData).subscribe({
        next: (res: any) => {
          this.form.formSections.forEach((section) => {
            if (section.sectionTitle === "Bank Account Details") {
            section.formControls.forEach((formControl: any) => {
              if ([event.otherControlName].includes(formControl.name)) {
                formControl.options = [...res.data];
              }
            });
          }
          });
        },
        error: (err) => {
          console.error(err);
        }
      });

    }
  }

 async getBranchDetails(event: any, otherControl: any) {
    otherControl.value = "";
    otherControl.options = []; 
    const data = JSON.parse(event.target.value);
    this.bankCity = data.id as string;
    const reqData = {
      "bankName": this.bankCode,
      "cityName": this.bankCity
    };
    this.yatraService.getBranchDetails(reqData).subscribe({
      next: (res: any) => {
        console.log(res);
        otherControl.options = [...res.data];
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  setIfscCode(event: any, otherControl: any) {
    const data = JSON.parse(event.target.value);    
    if(otherControl.name == "paymentIfscCode"){
      this.renewalFormGroup.get('paymentIfscCode')?.setValue(data.id);
      this.renewalFormGroup.get('paymentMicrCode')?.setValue(data.value);
    }
    this.renewalFormGroup.get('ifscCode')?.setValue(data.id);
    this.formData.ifscCode=data.id;
    this.formData.micrCode=data.value;
    this.renewalFormGroup.get('micrCode')?.setValue(data.value);
  }

  triggerFileInput(controlName: string) {
    const fileInputControl = this.document.getElementById(controlName);
    fileInputControl?.click();
  }

  onFileSelected(inputName: string, event: any) {
    const file = event.target.files[0];
    const maxSizeInBytes = 3 * 1024 * 1024;
    const allowedFileTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];
    const control = this.renewalFormGroup.get(inputName);
    if (file) {
      control?.setErrors(null);
      if (!allowedFileTypes.includes(file.type)) {
        control?.setErrors({ fileType: true });
      }
      if (file.size > maxSizeInBytes) {
        control?.setErrors({ fileSize: true });
      }
      if (!control?.errors) {
        this.selectedFile = file;
        control?.setValue(file.name);
      } else {
        control?.markAsTouched();
        this.selectedFile = null;
      }
    }
  }

  async onUploadFile(event: any, control: any) {
    if (event[0]) {
      if (this.renewalFormGroup?.get(control.name)) {
        this.selectedFile = event[0];
        this.renewalFormGroup?.get(control.name)?.setValue(event[0].name);
      } else {
        this.renewalFormGroup?.get(control.name)?.markAsTouched();
        this.selectedFile = null;
      }
    }
    const formData = new FormData();
    const policyNum = this.formData.policyNumber.replace(/-/g, "");
    formData.append("Files", event[0]);
    formData.append("UniqueNumber", policyNum);
        this.commonService.uploadDocument(formData).subscribe(
          async (res: any) => {
            if (res.isSuccess) {
              this.documentId = res.data.uploadResponse[0].globalId
              this.toast.success({ detail: "Success", summary: res.message, duration: 3000 });
            } else {
              this.toast.error({
                detail: "Error",
                summary: res.message,
                duration: 3000,
              });
            }
          },
          (err) => {
            console.error("Error during upload:", err);
            this.toast.error({detail: "Error",summary: err.message || "Document upload failed.",duration: 1500});
          }
        );
  }

  getFormIndexValue() {
    const formIndex = localStorage.getItem("formIndex") as string;
    console.log("getFormIndexValue()", formIndex ? parseInt(formIndex, 10) : 0);
    this.formIndex = formIndex ? parseInt(formIndex, 10) : 0;
    return formIndex ? parseInt(formIndex, 10) : 0;
  }

  setFormIndexValue(value: number) {
    localStorage.setItem("formIndex", value.toString());
  }

  incrementIndex() {
    const currentIndex = this.getFormIndexValue();
    this.setFormIndexValue(currentIndex + 1);
    console.log("currentIndex", currentIndex);
  }

  decrementIndex() {
    const currentIndex = this.getFormIndexValue();
    this.setFormIndexValue(currentIndex - 1);
  }

  onPrevious(control: any) {
    if (this.getFormIndexValue() > 0) {
      this.decrementIndex();
      if(this.getFormIndexValue() == 1){
        this.formData.totalPremium = this.formData.finalPremium;
        this.formData.healthReturnUse = false;
        this.formData.consentCheck = false;
      }
      this.getFormDataFromFormSequence();
    }
  }
  // async nomineeUpdate(): Promise<void> {

  // }

  async getFullQuoteViaOfflinePayment(): Promise<void> {
    return new Promise((resolve, reject) => {
      const data = this.renewalFormGroup.value;
      if (data.paymentOption === "Pay Order" && data.payOrderDate !== this.currentDate) {
        this.toast.warning({ detail: 'Warning', summary: 'Please Enter Current Date.', duration: 3000 });
        return;
      }
      if (data.paymentOption === "Cheque" && data.chequeDate !== this.currentDate) {
        this.toast.warning({ detail: 'Warning', summary: 'Please Enter Current Date.', duration: 3000 });
        return;
      }
      if (data.paymentOption === "Demand Draft" && data.demandDraftDate !== this.currentDate) {
        this.toast.warning({ detail: 'Warning', summary: 'Please Enter Current Date.', duration: 3000 });
        return;
      }
      if (this.formSequence[this.getFormIndexValue()]?.formTitle === 'Payment' && !this.ghdFlag && this.formData.isGHDApplicable) {
        this.isHealthDeclarationVisible = true;
        return;
      }
      const offlinePaymentRequestBody = {
        "policyType": "Renewal",
        "paymentMethod": "Offline",
        "source": "Retail",
        "instrumentType": data.paymentOption || "",
        "premiumAmount": this.formData.totalPremium || "",
        "instrumentNo": data.chequeNumber || data.demandDraftNumber || data.payOrderNumber || "",
        "instrumentDate": data.chequeDate || data.demandDraftDate || data.payOrderDate || "",
        "policyNumber": this.policyNumber,
        "proposalNum": "",
        "agentCode": this.agentCode,
        "bankName": data.paymentBankName || this.formData.paymentBankName || "",
        "ifsc": data.paymentIfscCode || this.formData.paymentIfscCode || "",
        "micrNo": this.formData.micrCode || "",
        "bankAccountNumber": this.formData.accountNumber || "",
        "documentId": this.documentId,
        "productName": this.formData.productName || ""
      };
      this.renewalService.getFullQuoteApi(offlinePaymentRequestBody).subscribe(
        (res: any) => {
          if (res.isSuccess && res.statusCode === 200 && res.data.isFullQuoteSuccess) {
            this.isFullQuote = res.data.isFullQuoteSuccess || false;
            this.formData.status = res.data.status || "";
            this.formData.policyStartDate = res.data.policyStartDate || "";
            this.formData.policyEndDate = res.data.policyEndDate || "";
            this.formData.receiptID = res.data.receiptID || "";
            this.formData.customerId = res.data.customerId || "";
            this.formData.premiumPaid = res.data.premiumPaid || "";
            this.rowData.paymentStatus = "";
            this.rowData.isFullQuoteSuccess =res.data.isFullQuoteSuccess || false;
            const transFormData={
              policyNo:res.data.policyNumber || "",
              applicationNumber : res.data.proposalNumber || ""
            }
            this.formData = { ...this.formData, ...transFormData};
            if(res.data.errorMessage){
              this.toast.success({ detail: 'Success', summary: res.data.errorMessage || 'Success', duration: 3000 });
            }
            this.formData = { ...this.formData, ...this.renewalFormGroup.getRawValue() };
            let currentState = history.state;
            let updatedState = {
              ...currentState,
              formData: this.encryptionService.encrypt(this.renewalFormGroup.getRawValue()),
              formIndex: (parseInt(currentState.formIndex) + 1).toString(),
            };
            this.router.navigate([], {
              state: updatedState,
            });
            this.incrementIndex();
            this.getFormDataFromFormSequence();
          }else if (res.isSuccess && res.statusCode === 200 && !res.data.isFullQuoteSuccess) {
            this.isFullQuote = res.data.isFullQuoteSuccess;
            this.formData.status = res.data.status || null;
            this.formData.policyStartDate = res.data.policyStartDate || null;
            this.formData.policyEndDate = res.data.policyEndDate || null;
            this.formData.receiptID = res.data.receiptID || null;
            this.formData.customerId = res.data.customerId || null;
            this.formData.premiumPaid = res.data.premiumPaid || null;
            this.rowData.paymentMessage = "Policy Issuance Pending";
            if(res.data.errorMessage){
              this.toast.warning({ detail: 'Warning', summary: res.data.errorMessage || 'policy issuance failed.', duration: 3000 });
            }
            this.formData = { ...this.formData, ...this.renewalFormGroup.getRawValue() };
            let currentState = history.state;
            let updatedState = {
              ...currentState,
              formData: this.encryptionService.encrypt(this.renewalFormGroup.getRawValue()),
              formIndex: (parseInt(currentState.formIndex) + 1).toString(),
            };
            this.router.navigate([], {
              state: updatedState,
            });
            this.incrementIndex();
            this.getFormDataFromFormSequence();
          }
          else {
            this.toast.warning({ detail: "Warning", summary: res.message || "Payment and policy issuance failed", duration: 5000 });
          }
        },
        (err) => {
          this.toast.error({ detail: '', summary: 'Failed to do offline payment.', duration: 3000 });
        })
    });
  }
  
  mergeMember(control: any) {
    const a = Object.keys(this.formData.insuredMembers).filter(
      key => this.formData.insuredMembers[key] === true
    );
    control.value = a;
  }

  async getNomineeRelationShip(control: any) {
    if (!this.nomineeRelationList) {
      this.yatraService.getNomineeRelationship().subscribe({
        next: (res: any) => {
          this.nomineeRelationList = res.data;
          this.setNomineeOptions(control);
        },
        error: (err) => {
          console.error(err);
        }
      });
    } else {
      this.setNomineeOptions(control);
    }
  }
  
  private setNomineeOptions(control: any) {
    control.options = this.nomineeRelationList;
    const matchingOption = this.nomineeRelationList.find((opt: any) => opt.name?.toString().toLowerCase() === control.value?.toString().toLowerCase());
        if (matchingOption) {
      control.value = JSON.stringify(matchingOption);
    }
    this.renewalFormGroup.get(control.name)?.setValue(control.value);
  }

  getNatureOfDuty(control: any) {
    this.yatraService.getNatureOfDuty().subscribe({
      next: (res: any) => {
        control.options = res.data;
      },
      error: (err: any) => {
        console.error(err);
      }
    });
  }

  getInsuredOccupation(control: any) {
    this.yatraService.getInsuredOccupation().subscribe({
      next: (res: any) => {
        control.options = res.data;
      },
      error: (err: any) => {
        console.error(err);
      }
    });
  }

  calculateAge(dob: Date): number | string {
    const today = new Date();
    const birthDate = new Date(dob);
    if (birthDate > today) {
      return 'invalid';
    }
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    if (age < 1) {
      const diffInMs = today.getTime() - birthDate.getTime();
      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
      if (diffInDays < 91) {
        return 'invalid'; 
      }
      return `${diffInDays}days`;
    }
    return `${age}`;
  }

  jsonParse(string: any, extract: any) {
    const value = JSON.parse(string);
    return value[extract];
  }

  resetZoneAndLocationFields() {
    this.renewalFormGroup.get('city')?.setValue('');
    this.renewalFormGroup.get('state')?.setValue('');
    this.renewalFormGroup.get('zone')?.disable();
    this.renewalFormGroup.get('zone')?.setValue('');
    this.form.formSections.forEach((section: any) => {
      section.formControls.forEach((control: any) => {
        if (control.name === 'zoneValue') {
          control.options = [];
        }
      });
    });
  }

  checkNomineeAge(control: any, nomineeDob: any = null) {
    if (nomineeDob == null) {
      nomineeDob = this.formData.nomineeDob
    }
    if (Number(this.calculateAge(nomineeDob)) < 18) {
      this.changeMainFormDependentControls(control.dependentControls, true);
    }
    else {
      this.changeMainFormDependentControls(control.dependentControls, false);
    }
  }

  sendPaymentLink(control: any) {
    const sendPaymentRequestBody = {
      firstName: this.formData?.firstName,
      lastName: this.formData?.lastName,
      agentcode: this.agentCode,
      emailId: this.formData.emailId,
      productName: this.formData?.productName,
      businessType: "REN",
      pNumber: this.formData?.policyNumber,
      productCode: this.formData?.productCode,
      premiumAmount: this.formData?.totalPremium,
      mobilenumber: this.formData.mobileNumber
    };
    this.renewalService.sharePaymentLinkApi(sendPaymentRequestBody).subscribe({
      next: (response: any) => {
        if (response.data) {
          this.toast.success({ detail: "SUCCESS", summary: response.data.message || "Link has been sent successfully", duration: 3000 });
          if(response.data.paymentLink){
            this.changeMainFormDependentControls(control.dependentControls, true);
            this.renewalFormGroup.get(control.dependentControls[0])?.setValue(response.data.paymentLink);
          }
        } else {
          this.toast.warning({ detail: "WARNING", summary: "Invalid payment link received", duration: 3000 });
        }
      },
      error: (error) => {
        this.toast.error({ detail: "ERROR", summary: "Failed to generate payment link", duration: 3000 });
      }
    });
  }

  redirectToJustPay(control?: any) {
    const data = this.renewalFormGroup.value;
    if (this.selectedButton === "emandate_payment" && (!data.emandateConsent || !data.emandateTerms)) {
      this.toast.warning({ detail: "WARNING", summary: "Checkbox selection is mandatory", duration: 3000 });
      return;
    }
    if (this.selectedButton === "autoDebit" && (!data.autoDebitConsent || !data.autoDebitTerms)) {
      this.toast.warning({ detail: "WARNING", summary: "Checkbox selection is mandatory", duration: 3000 });
      return;
    }
    if (this.formSequence[this.getFormIndexValue()]?.formTitle === 'Payment' && !this.ghdFlag && this.formData.isGHDApplicable) {
      this.isHealthDeclarationVisible = true;
      return;
    }
    if (this.selectedButton !== 'offline') {
      const reqData = {
        agentcode: this.agentCode,
        proposalNumber: '',
        paymentMethod: this.selectedButton,
        source: 'Retail',
        policyType: 'Renewal',
        policyNumber: this.formData.policyNumber,
        quoteNumber: '',
        ProductName: this.formData.productName,
        userType: "Agent",
      };
      this.renewalService.justPayRedirection(reqData).subscribe({
        next: (response: any) => {
          if (response.data.paymentURL && response.data.paymentURL !== null && response.data.paymentURL !== '') {
            if (this.selectedButton == 'sendLinkButton') {
              // this.renewalFormGroup.get(control.dependentControls[0])?.setValue(response.data.paymentURL);
            }
            else {
              window.location.href = response.data.paymentURL;
            }
          } else {
            this.toast.warning({ detail: "WARNING", summary: response.message || "Invalid payment link received", duration: 3000 });
          }
        },
        error: (error) => {
          this.toast.error({ detail: "ERROR", summary: "Failed to generate payment link", duration: 3000 });
        }
      });
    }
  }

  async checkKycDetail(control: any): Promise<void> {
    // if (this.formData.healthReturnUse && Number(this.formData.healthReturn) > 0) {
    //   const healthReturnReqBody = {
    //     policyNumber: this.policyNumber,
    //     hrAmount: this.formData.healthReturnUsage,
    //     IsHRAmountUsed: 'Y'
    //   };
    //   try {
    //     const res: any = await this.renewalService.updatehealthreturns(healthReturnReqBody).toPromise();
    //     if (res.data.isUpdated) {
    //       // this.formData.totalPremium = Math.floor(Number(this.formData.totalPremium) - Number(this.formData.healthReturnUsage)).toString();
    //     } else {
    //       this.toast.error({detail: "Error",summary: res.data.message || "Failed to update health returns",duration: 4000});
    //     }
    //   } catch (err) {
    //     console.log(err);
    //     this.toast.error({detail: "Error",summary: "Something went wrong while updating health returns.",duration: 4000});
    //     return; 
    //   }
    // }  
    // this.updateVisibility(control);
    let isVisible = !this.verifyKYCStatus && !this.formData.isKycCompleted;
    this.form.formSections.forEach((section) => {
      section.formControls.forEach((formControl: IFormControl) => {
        if (formControl.name === control.name) {
          section.visible = isVisible;
          this.form.formSections[1].visible = !isVisible;
        }
      });
    });
  }
  
  // updateVisibility(control: any): void {
  //   let isVisible = !this.verifyKYCStatus && !this.formData.isKycCompleted;
  //   this.form.formSections.forEach((section) => {
  //     section.formControls.forEach((formControl: IFormControl) => {
  //       if (formControl.name === control.name) {
  //         section.visible = isVisible;
  //         this.form.formSections[1].visible = !isVisible;
  //       }
  //     });
  //   });
  // }
  
  checkPaymentStatus(control: any): void {    
    if(!this.isFullQuote || this.rowData.paymentStatus == "PENDING" || !this.rowData.isFullQuoteSuccess){
      this.form.formSections.forEach((section, sectionIndex) => {
        if (sectionIndex === 0) {
          section.formControls.forEach((formControl: IFormControl) => {
            if (formControl.name === "label1") formControl.label = this.rowData.paymentMessage 
            else if(formControl.name == "backToRenewalList") formControl.visible=true
          });
        } else {
          section.visible = false;
        }
      });
   }
  }

  initiateKycURL() {
    const kycRequestBody = {
      policyNumber: this.policyNumber,
      fullName: this.formData.proposerName,
      panNumber: this.formData.panNo || "",
      dob: this.formatDate(this.formData.memberDobProposer) || "",
      pepCheck: "No",
      businessType: "REN",
      userType: "Agent"
    };
    this.renewalService.getkycURL(kycRequestBody).subscribe(
      (res: any) => {
        // window.open(res.data.kycUrl, '_blank');
        window.location.href = res.data.kycUrl;
      },
      (err) => {
        console.log(err);
      }
    );    
  }

  shareKycURL(control: any) {
    const kycRequestBody = {
      policyNumber: this.policyNumber,
      proposerNumber: "",
      fullName: this.formData.proposerName,
      panNumber: this.formData.panNo || "",
      dob: this.formatDate(this.formData.memberDobProposer) || "",
      pepCheck: "No",
      businessType: "REN",
      emailId: this.formData.emailId,
      agentCode: this.agentCode,
      MobileNumber: this.formData.mobileNumber,
      ProductName: this.formData.productName,
      ProductCode: this.formData.productCode
    };
    this.renewalService.sharekyclinkApi(kycRequestBody).subscribe(
      (res: any) => {
        if (res.data.isShareKyc) {
          this.toast.success({ detail: "SUCCESS", summary: "Link has been sent successfully", duration: 3000 });
        }
        this.changeMainFormDependentControls(control.dependentControls, true);
        this.renewalFormGroup.get(control.dependentControls[0])?.setValue(res.data.kycLink);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  backToRenewalList(){
    this.router.navigate(['renewal/renewalList'], { 
      state: {
        formData: this.encryptionService.encrypt(this.policyNumber),
      }
    });
  }

  getDate(dateType: any): string {
    if (dateType === 'currentDate') {
      return this.currentDate;
    } else if (dateType === 'futureDate') {
      return this.futureDate;
    } else if (dateType === 'pastDate') {
    }
    return '';
  }

  formatDate(dateString: string | Date): string {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return ""; 
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  formatDates(dateString: string): string {
    if (!dateString) return "";
    const isoFormatRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (isoFormatRegex.test(dateString)) {
        return dateString;
    }
    const [day, month, year] = dateString.split("/");
    if (!day || !month || !year) return dateString;
    return `${year}-${month}-${day}`;
}

  copyText(control: any) {
    console.log(control);
    this.clipboard.copy(this.renewalFormGroup.get(control.name)?.value);
    this.toast.success({ detail: "SUCCESS", summary: `Text copied to clipboard!`, duration: 3000 });
  }

  setRating(star: number) {
    this.rating = star;
    this.customerFeedbackForm.patchValue({ rating: this.rating });
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
    // this.yatraService.submitFeedback(reqData).subscribe((response) => {
    //   this.toast.success({ detail: 'Feedback submitted successfully! Thank you for your input.' });
    // }, (error) => {
    //   this.toast.error({ detail: 'Failed to submit feedback. Please try again later.' });
    // });
    // this.customerFeedbackModule.hide();
    this.isFeedBackModalVisible = false;
  }

  closeIsFeedBackModalVisible() {
    let reqData = {
      "proposalNum": this?.formData?.proposalNumber,
      // "partnerId": this.partnerId,
      "agentCode": this.agentCode,
      "formData": JSON.stringify(this.renewalFormGroup.getRawValue()),
      "formName": this.formSequence[this.getFormIndexValue()].formName,
      "formConfig": JSON.stringify(this.formSequence),
      // "productId": this.productId.toString(),
      "formId": this.formSequence[this.getFormIndexValue()].formId,
      "jsonForm": JSON.stringify(this.form),
      "formSequence": this.getFormIndexValue(),
      // "leadNumber": this.leadnumber,
      // "quoteNumber": this.formData.quoteId ? this.formData.quoteId : ""
    };

    // console.log(reqData, this.renewalFormGroup.getRawValue());

    // this.yatraService.Insertorupdateformdata(reqData).subscribe({
    //   next: (res: any) => {
    //     console.log(res);
    //     // this.leadnumber = res.data;
    //   },
    //   error: (err) => {
    //     console.error(err);
    //   }
    // });
    this.isFeedBackModalVisible = false;
  }

  onSelectValue(value: String) {
    this.feedbackImpressedValue = value;
  }

  onClickDownloadFromConfirmation() {
    this.onSearchDocumentFromConfirmation();
    if (this.retrievedDocuments) {
      const downloadPolicyKitRequestBody = {
        agentCode: this.agentCode,
        referenceId: this.agentCode,
        eventName: "Download policy kit request from customers",
        proposalNumber: this.policyNumber,
        downloadRequest: [
          {
            omniDocImageIndex: this.retrievedDocuments[0].omniDocImageIndex,
            fileName: this.retrievedDocuments[0].fileName,
          },
        ],
        sourceSystemName: "",
        identifier: "",
      };
      this.customerService.downloadDocumentApi(downloadPolicyKitRequestBody).subscribe(
        (response: any) => {
          if (response.isSuccess && response.data?.downloadResponse?.length > 0) {
            const file = response.data.downloadResponse[0];
            if (file.byteArray && file.fileName) {
              const byteArray = new Uint8Array(
                atob(file.byteArray).split("").map((char) => char.charCodeAt(0))
              );
              const blob = new Blob([byteArray], { type: "application/pdf" });
              const fileURL = window.URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.href = fileURL;
              link.download = file.fileName;
              document.body.appendChild(link)
              link.click();
              document.body.removeChild(link)
              window.open(fileURL, "_blank");
            }
          } else {
            this.toast.warning({ detail: "Warning", summary: response.message || "No file found to download.", duration: 3000 });
          }
        },
        (error: any) => {
          console.error("Download Policy Kit Error:", error);
          this.toast.error({ detail: "", summary: "Error while downloading Policy Kit.", duration: 3000 });
        }
      );
    }
  }

  onSearchDocumentFromConfirmation() {
    const searchDocumentRequestBody = {
      referenceId: this.agentCode,
      searchRequest: [
        {
          categoryID: "",
          description: "",
          dataClassParam: [
            {
              docSearchParamId: "2",
              value: this.policyNumber
            },
            {
              docSearchParamId: "15",
              value: "PS_04",
            },
          ],
        },
      ],
      agentCode: this.agentCode,
      eventName: "Search policy kit request from customers",
      sourceSystemName: "",
      searchOperator: "AND",
    };
    this.customerService.searchDocumentApi(searchDocumentRequestBody).subscribe(
      (response: any) => {
        if (response.isSuccess) {
          const searchResponse = response.data.searchResponse;
          this.retrievedDocuments = searchResponse;
          if (searchResponse && searchResponse[0]?.error?.length > 0) {
            this.toast.success({ detail: "", summary: "No documents are available to download.", duration: 2000 });
            return;
          }
        } else {
          this.toast.error({ detail: "", summary: response.message || "Failed to search document.", duration: 2000 });
        }
      },
      (error: any) => {
        console.error("Search document error", error);
        this.toast.error({ detail: "", summary: "Error while searching the document.", duration: 2000 });
      }
    );
  }

  getLabels(control: any) {
    let startIdx = control.indexOf('{{');
    let endIdx = control.indexOf('}}');
    let string: any;
    if (startIdx !== -1 && endIdx !== -1) {
      string = control.slice(startIdx + 2, endIdx).trim();
    }
    switch (string) {
      case 'actName':
        return control.replace('{{actName}}', this.formData?.accountNumber);
      case 'emailId':
        const emailId = this.formData?.emailId;
        if (emailId) {
          const anchorTag = `<a href="mailto:${emailId}">${emailId}</a>`;
          return control.replace('{{emailId}}', anchorTag);
        }
        return control;
      default:
        return control;
    }
  }

  skipKycURL(control:any){
    const skipKycRequestBody = {
      policyNumber:this.policyNumber,
      proposalNumber: "",
      businessType:"REN"
    };
    this.renewalService.skipKycLinkApi(skipKycRequestBody).subscribe(
      (res: any) => {
        console.log("skipKycResponseBody", res);
        if (res.data.kycStatus) {
          this.toast.success({detail: "Success",summary: res.message,duration: 3000});
          this.verifyKYCStatus = res.data.kycStatus;
          if(this.verifyKYCStatus){
            const currentState = this.router.getCurrentNavigation()?.extras.state || {};
            this.tempFormData.isKycCompleted = true
            this.router.navigate([], {
              state: {
                ...currentState,
                formData: this.encryptionService.encrypt(this.tempFormData),
              },
            });
          }
          this.checkKycDetail(control);
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  // checkNomineeDetail(control: any): void {
  //   // this.formData.nomineeDob = "";
  //   this.nomineeDetail = false;
  //   if(this.formData.nomineeDob){
  //     this.nomineeDetail = false;
  //   }else {
  //     this.nomineeDetail = true;
  //   }
  //   this.form.formSections.forEach((section) => {
  //     section.formControls.forEach((formControl: IFormControl) => {
  //       if (formControl.name == control.name && this.formData.isKycCompleted) {
  //         console.log(formControl);
  //         this.form.formSections[1].visible = this.nomineeDetail;
  //         if(this.nomineeDetail){
  //           const val = {appointeeName: "",appointeeContactNo:"",appointeeRelationWithNominee:""}
  //           this.formData={...this.formData,...val}            
  //         }
  //       }
  //     });
  //   });
  // }

  // checkBankDetail(control: any): void {
  //   // this.formData.bankName = "";
  //   // console.log(control);
  //   this.bankDetail = false;
  //   if(this.formData.bankName){
  //     this.bankDetail = false;
  //   }else {
  //     this.bankDetail = true;
  //   }
  //   this.form.formSections.forEach((section) => {
  //     section.formControls.forEach((formControl: IFormControl) => {
  //       if (formControl.name == control.name && this.formData.isKycCompleted) {
  //         this.form.formSections[2].visible = this.bankDetail;
  //       }
  //     });
  //   });
  // }

  // updateNomineeDetails(){
  //   const data = this.renewalFormGroup.value;
  //   const nomiData = {
  //     "nominee_first_name": data.nomineeFirstName || "",
  //     "nominee_last_name": data.nomineeLastName || "",
  //     "nominee_dob": data.nomineeDob || "",
  //     "nominee_relationship_code": JSON.parse(data.nomineeRelationWithProposer).name || "",
  //     "Nominee_Name": data.nomineeFirstName + data.nomineeLastName || "",
  //     "Nominee_Address": data.nomineeAddress || "",
  //     "Nominee_Gender": data.gender || "",
  //     "Nominee_Contact_No": data.nomineeContactNo || "",
  //     "Relationship": JSON.parse(data.nomineeRelationWithProposer).name || "",
  //     "Appointee_Name": data.appointeeName,
  //     "Appointee_Relation": data.appointeeRelationWithNominee || "",
  //     "Appointee_Age": "",
  //     "Appointee_Mobile_Np": data.appointeeContactNo || ""
  //   }    
  //   const bankDetail = {
  //     policyNumber: this.policyNumber,
  //     nomineeDetails:JSON.stringify(nomiData)
  //   };
  //   this.renewalService.updateNomineeDetailApi(bankDetail).subscribe(
  //     (res: any) => {
  //       if(res.data.isUpdated){
  //         this.toast.success({ detail: "Success", summary: "Nominee Updated Successfully.", duration: 3000 });
  //       } else {
  //       this.toast.error({ detail: "Error", summary: "Failed to update Nominee Details", duration: 3000 });
  //       }      
  //     },
  //     (err) => {
  //       console.log(err);
  //     }
  //   );
  // }

  // updateBankDetails(){
  //   const data = this.renewalFormGroup.value;    
  // const bankData = {
  //   "Bank_acc_no": data.accountNumber || "",
  //   "Confirm_Bank_acc_no": data.accountNumber || "",
  //   "Ifsc_code": this.formData.ifscCode || data.ifscCode || "",
  //   "Micr_code": this.formData.micrCode || data.micrCode || "",
  //   "Bank_name": JSON.parse(data.bankName).name || "",
  //   "Bank_branch_name": data.bankBranch ? JSON.parse(data.bankBranch).name || "" : "",
  //   "Bank_account_type": "SAVINGS",
  //   "Dr_gl_code": "",
  //   "Cr_gl_code": "",
  //   "Primary_secondary": "",
  //   "paymentOption": "",  
  //   "paymentBankName": JSON.parse(data.bankName).name || ""
  // };  
  // const bankDetail = {
  //   policyNumber: this.policyNumber,
  //   bankDetails: JSON.stringify(bankData)
  // };
  // this.renewalService.updateBankDetailApi(bankDetail).subscribe(
  //     (res: any) => {
  //       if(res.data.isUpdated){
  //         this.formData.accountNumber=data.accountNumber;
  //         this.formData.paymentBankName= JSON.parse(data.bankName).name;
  //         this.formData.paymentIfscCode= this.formData.ifscCode || data.ifscCode;
  //         this.toast.success({ detail: "Success", summary: "BankDetail Updated Successfully.", duration: 3000 });
  //       } else {
  //       this.toast.error({ detail: "Error", summary: "Failed to update Bank Details", duration: 3000 });
  //       }
  //     },
  //     (err) => {
  //       console.log(err);
  //     }
  //   );
  // }

  // checkleadValidation(controls?: any) {
  //   const data = this.renewalFormGroup.value;
  //   let result = false;
  //   this.form.formSections.forEach((section) => {
  //     section.formControls.forEach((formControl: IFormControl) => {
  //       if (section.sectionTitle === controls) {
  //         const control = this.renewalFormGroup.get(formControl.name);
  //         if (control) {
  //           if (control instanceof FormGroup) {
  //             control.markAsDirty({ onlySelf: true });
  //           } else {
  //             control.markAsTouched({ onlySelf: true });
  //             if (control.status == "INVALID") {
  //               result = true;
  //               this.toast.warning({ detail: "WARNING", summary: "Please fill the mandatory fields", duration: 3000 });
  //             }
  //           }
  //         }
  //       }
  //     });
  //   });
  //   if (Number(this.calculateAge(data.nomineeDob)) < 18 && (!data.appointeeName || !data.appointeeRelationWithNominee)) {
  //     this.toast.warning({ detail: "WARNING", summary: "Please fill the mandatory appointee fields", duration: 3000 });
  //     return;
  //   }    
  //   // if(controls == "Bank Account Details" && !result){
  //   //   this.updateBankDetails();
  //   // } else if(controls == "Nominee Details" && !result){
  //   //   this.updateNomineeDetails();
  //   // }
  //   result= false
  // }

 async generatehalfqoute(control:any){
    const data = this.renewalFormGroup.value;   

    if (Number(this.calculateAge(data.nomineeDob)) < 18 && (!data.appointeeName || !data.appointeeRelationWithNominee)) {
      this.toast.warning({ detail: "WARNING", summary: "Please fill the mandatory appointee fields", duration: 3000 });
      return;
    }

    // if (!this.nominee) await this.checkleadValidation("Nominee Details");
    // if (!this.bank) await this.checkleadValidation("Bank Account Details");
    
    const halfQuote = {
      policy_Number: this.policyNumber,
      overWriteAutoDebit: this.formData?.isAutoDebit ? "YES" : "NO",
    
      nomineeDetails: (
        data.nomineeFirstName !== this.formData.nomineeFirstName ||
        data.nomineeLastName !== this.formData.nomineeLastName ||
        data.nomineeDob !== this.formData.nomineeDob ||
        (data.nomineeRelationWithProposer && JSON.parse(data.nomineeRelationWithProposer).name) !== this.formData.nomineeRelationWithProposer ||
        data.nomineeAddress !== this.formData.nomineeAddress ||
        data.nomineeContactNo !== this.formData.nomineeContactNo
      ) ? JSON.stringify({
        nominee_first_name: data.nomineeFirstName || "",
        nominee_last_name: data.nomineeLastName || "",
        nominee_dob: data.nomineeDob || "",
        nominee_relationship_code: data.nomineeRelationWithProposer ? JSON.parse(data.nomineeRelationWithProposer).name || "" : "",
        Nominee_Name: data.nomineeFirstName && data.nomineeLastName ? `${data.nomineeFirstName} ${data.nomineeLastName}` : "",
        Nominee_Address: data.nomineeAddress || "",
        Nominee_Gender: data.gender || "",
        Nominee_Contact_No: data.nomineeContactNo || "",
        Relationship: data.nomineeRelationWithProposer ? JSON.parse(data.nomineeRelationWithProposer).name || "" : "",
        Appointee_Name: data.appointeeName || "",
        Appointee_Relation: data.appointeeRelationWithNominee ? JSON.parse(data.appointeeRelationWithNominee).name || "" : "",
        Appointee_Age: "",
        Appointee_Mobile_Np: data.appointeeContactNo || ""
      }) : "",
    
      bankDetails: (
        data.accountNumber !== this.formData.accountNumber ||
        (data.bankName && JSON.parse(data.bankName).name) !== this.formData.bankName ||
        data.proposerName !== this.formData.proposerName
      ) ? JSON.stringify({
        Bank_acc_no: data.accountNumber || "",
        Confirm_Bank_acc_no: data.accountNumber || "",
        Ifsc_code: this.formData.ifscCode || data.ifscCode || "",
        Micr_code: this.formData.micrCode || data.micrCode || "",
        Bank_name: data.bankName ? JSON.parse(data.bankName).name || "" : "",
        Bank_branch_name: data.bankBranch ? JSON.parse(data.bankBranch).name || "" : "",
        Bank_account_type: "SAVINGS",
        Dr_gl_code: "",
        Cr_gl_code: "",
        Primary_secondary: "",
        paymentOption: "",
        paymentBankName: data.bankName ? JSON.parse(data.bankName).name || "" : ""
      }) : "",
    
      HrAmount: data.healthReturnUse ? data.healthReturnUsage.toString() || "" : "",
      panCardNo:this.formData.panNo
    };
    
    this.renewalService.generatehalfqoute(halfQuote).subscribe(
        (res: any) => {
          if(res.data.isSuccess){
            this.formData = { ...this.formData, ...this.renewalFormGroup.getRawValue() };
            this.formData.totalPremium=res.data.premium || this.formData.totalPremium;
            this.formData.finalPremium=res.data.premium || this.formData.finalPremium;               
            if(data.healthReturnUse && Number(this.formData.healthReturn) > 0){
              this.formData.totalPremium = Math.floor(Number(this.formData.finalPremium) - Number(this.formData.healthReturnUsage)).toString();
            }
            this.ghdFlag = false;
            this.router.navigate([], {
              state: {
                ...history.state,
                formIndex: (parseInt(history.state.formIndex) + 1).toString(),
              },
            });
            this.incrementIndex();
            this.getFormDataFromFormSequence();
            // this.toast.success({ detail: "Success", summary: res.data.message || "half quote generated successfully.", duration: 3000 });
            this.showToast("Success", res.data.message || "Half quote generated successfully.", "success");
          } else {
          // this.toast.error({ detail: "Error", summary: res.data.message || "Failed to generate half quote", duration: 5000 });
          this.showToast("Error", res.data.message || "Failed to generate half quote", "error", 5000);
          }
        },
        (err) => {
          console.log(err);
        }
    );
  }
   
  healthReturnsCall(control: any) {
    const data = this.renewalFormGroup.value;
    const maxAmount = Math.min(Number(this.formData.netPremium), Number(this.formData.healthReturn));
    const regexPattern = `^[1-9][0-9]*$`;
    this.form.formSections.forEach((section) => {
      if (section.sectionTitle === "Health Returns For Renewal") {
        section.formControls.forEach((formControl: any) => {
          if (control.dependentControls?.includes(formControl.name)) {
            if(formControl.name == "healthReturnUsage"){
              formControl.visible = !!data.healthReturnUse;
              if (Number(this.formData.healthReturn>Number(this.formData.netPremium))) {
                formControl.value="";
              } else {
                formControl.value =  Number(this.formData.healthReturn) || data.healthReturnUsage  || "0";
              }
              const dependentFormControl = this.renewalFormGroup.get(formControl.name);
              if (dependentFormControl && formControl.visible) {
                dependentFormControl.enable();    
                const validators = [
                  Validators.pattern(regexPattern),
                  Validators.max(maxAmount)
                ];
                dependentFormControl.setValidators(validators);
                dependentFormControl.updateValueAndValidity();
                dependentFormControl.markAllAsTouched();
                var premiumValidation = ""
                // if ((this.formData.healthReturn>this.formData.netPremium)) {
                  // premiumValidation=`Health Return Usage can't exceed Net Premium amount ${this.formData.netPremium}`;
                // }
                formControl.validators.forEach((validator: any) => {
                  if (validator.validatorName === "max") {
                    validator.message = premiumValidation;
                  }
                });
                if(Number(this.formData.netPremium) > Number(this.formData.healthReturn)){
                this.renewalFormGroup.get('totalPremium')?.setValue(this.formData.totalPremium - this.formData.healthReturn);}
              } else {
                if (dependentFormControl) {
                  dependentFormControl.disable();
                  dependentFormControl.clearValidators();
                  dependentFormControl.updateValueAndValidity();
                }
                  this.renewalFormGroup.get('totalPremium')?.setValue(this.formData.finalPremium);
              }
            }else {
              formControl.visible = !!data.healthReturnUse;
              formControl.label=`Note - HealthReturns can be redeemed only upto the Net Premium Amount ${this.formData.netPremium}`
            }
          }
        });
      }
    });  
  }
  
 async continueWithExistingKyc() {
    this.isKycModalVisible = false;
    if(this.kycForm.value.pepStatus == 'N'){
      return;
    }
    const pepDetail = {
      policyNumber: this.policyNumber,
      PEPStatus: this.kycForm.value.pepStatus
    };
    try {
      const res: any = await lastValueFrom(this.renewalService.updatepepstatusApi(pepDetail));
      if (res.data.isUpdated) {
        this.showToast("Success", "PEP Details Updated Successfully.", "success"); 
      } else {
        this.showToast("Error", "Failed to update PEP Details!", "error");
      }
    } catch (err) {
      console.log(err);
      this.showToast("Error", "Something went wrong!", "error");
    }
  }

  async checkPEPDetail(control : any) {
    const data = this.renewalFormGroup.value;
    const pepDetail = {
      policyNumber: this.policyNumber,
      PEPStatus: data.ifPEP
    };    
    try {
      const res: any = await lastValueFrom(this.renewalService.updatepepstatusApi(pepDetail));
      if (res.data.isUpdated) {
        this.toast.success({ detail: "Success", summary: "PEP Details Updated Successfully.", duration: 3000 });  
      } else {
        this.toast.error({ detail: "Error", summary: "Failed to update PEP Details", duration: 3000 });
      }
    } catch (err) {
      console.log(err);
      this.toast.error({ detail: "Error", summary: "Something went wrong!", duration: 3000 });
    }
  }


  redoKyc(): void {
    this.form.formSections.forEach((section) => {
      section.formControls.forEach((formControl: IFormControl) => {
        if (formControl.name === "checkKycControl") {
          section.visible = true;
          this.form.formSections[1].visible = false;
        }
      });
    });
    this.isKycModalVisible = false;
  }

  toggleInputField(index: number, value: string) {
    this.memberDetail[index].showInputField = value === 'yes';
    const ghdApplicableControl = this.healthDeclarationForm.get('GHDApplicable' + index);
    const ghdRemarksControl = this.healthDeclarationForm.get('GHDRemarks' + index);
    ghdApplicableControl?.setValue(value);
    if (value === 'yes') {
      ghdRemarksControl?.setValidators([Validators.required]);
    } else {
      ghdRemarksControl?.clearValidators();
      ghdRemarksControl?.setValue('');
    }
    ghdRemarksControl?.updateValueAndValidity();
  }
  
  
  
  closeModal() {
    this.isHealthDeclarationVisible = false;
    if (this.selectedButton !== 'offline') {
      // this.ghdFlag=true;
      // this.redirectToJustPay();
    } else if (this.selectedButton == 'offline') {
      // this.ghdFlag=true;
      // this.getFullQuoteViaOfflinePayment();
    }
  }
  
  async confirmHealthDeclaration() {
    if (this.healthDeclarationForm.valid) {
      this.isHealthDeclarationVisible = false;
    }

    const data = this.healthDeclarationForm.value;
    const transformedData = this.memberDetail.map((member, index) => {
      const ghdApplicableKey = `GHDApplicable${index}`;
      const ghdRemarksKey = `GHDRemarks${index}`;
      return {
        memberId: member.memberId || "",
        GHDFlag: data[ghdApplicableKey] === 'yes' ? 'Y' : (data[ghdApplicableKey] === 'no' ? 'N' : ''), 
        remarks: data[ghdRemarksKey] || "" 
      };
    });

    const ghdDetail = {
      policyNumber: this.policyNumber,
      GHDdetails: transformedData
    };
    try {
      const res: any = await lastValueFrom(this.renewalService.updateghddetailsApi(ghdDetail));
      if (res.data.isUpdated) {
        // this.toast.success({ detail: "Success", summary: "GHD Updated Successfully.", duration: 3000 }); 
        this.showToast("Success", "GHD Updated Successfully.", "success"); 
        this.ghdFlag = true;
        // this.selectedButton !== 'offline' ? this.redirectToJustPay() : this.getFullQuoteViaOfflinePayment();
      } else {
        // this.toast.error({ detail: "Error", summary: "Failed to update GHD Details", duration: 3000 });
        this.showToast("Error", "Failed to update GHD Details", "error");
        this.form.formSections.forEach((section) => {
          if (section.sectionTitle === "Bottom Section") {
          section.formControls.forEach((formControl: any) => {
            if (formControl.name == "nextOnline" || formControl.name == "nextOffline") {
              formControl.visible = false;
            }
            if (formControl.name == "nextNotWork") {
              formControl.visible = true;
            }
          });
        }
        });

      }
    } catch (err) {
      // this.toast.error({ detail: "Error", summary: "Something went wrong!", duration: 3000 });
      this.showToast("Error", "Something went wrong!", "error");
    }
  }

  private showToast(title: string, message: string, type: 'success' | 'error' | 'warning', duration: number = 3000): void {
    this.toast[type]({ detail: title, summary: message, duration });
  }

  consentCheckboxSelection(control: any){
    const isChecked = this.renewalFormGroup.value.consentCheck;
    this.form.formSections.forEach((section) => {
      if (section.sectionTitle === "Bottom Section") {
      section.formControls.forEach((formControl: IFormControl) => {
        if (["nextNotWork", "next"].includes(formControl.name)) {
          formControl.visible = formControl.name === "next" ? isChecked : !isChecked;
        }
      });
    }
    });
  }
  

}
