import { ChangeDetectorRef, Component, ElementRef, HostListener, Inject, Renderer2, inject } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { IDynamicControl, IForm, IFormControl, IFormSections, IOptions, ISubControl, IValidator } from 'src/app/interface/form.interface';
import { CommonService } from 'src/app/services/common.service';
import { DatePipe, DOCUMENT } from '@angular/common';
import { NgToastService } from 'ng-angular-popup';
import { EncryptionService } from 'src/app/services/encryption.service';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom, tap } from 'rxjs';
import { YatraService } from './yatra.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { IFullQuoteMapping } from 'src/app/interface/FullQuote_Mapping.interface';
import { LoadingService } from 'src/app/services/loading.service';
import { LanguageService } from 'src/app/services/language.service';
import { TranslateService } from '@ngx-translate/core';
import { LeadsService } from 'src/app/leads/leads.service';
import { AesEncryptionService } from 'src/app/services/AESEncrypt.service';
import { RenewalsService } from 'src/app/renewals/renewals.service';
import { CustomersService } from 'src/app/customers/customers.service';
import { SharedModalComponent } from 'src/app/shared/components/shared-modal/shared-modal.component';
import { Options } from '@angular-slider/ngx-slider';
import { LogarithmicScale } from 'chart.js';
import { event } from 'jquery';

@Component({
  selector: 'app-yatra',
  templateUrl: './yatra.component.html',
  styleUrls: ['./yatra.component.scss']
})
export class YatraComponent {
  // @ViewChild('fileInput') fileInput!: ElementRef;
  form!: IForm;
  fb = inject(FormBuilder)
  dynamicFormGroup: FormGroup = this.fb.group({});
  private dynamicStyle!: HTMLLinkElement;

  insurancetypecode: any;
  productid: any;
  verticalCode: any;
  Code: any;
  proposalNum: any;


  idProofType: string = '';

  private allJsonForm: any[] = [];
  formData: any = {}
  questionFormData: any = {}
  selectedFile: any;
  expandedCardIndex: number | null = null;
  i!: number;
  activeTab: string = 'chronic';
  expandedItem: string = '';
  selectedItem: string = '';
  bankCode: any;
  bankCity: any;
  formControls: IFormControl[] = [];
  isPlanDetailsVisible: boolean = false;
  activeMemberTabIndex: number = 0;
  selectedIndex: number = -1;
  insuredMemberDetails: any = {};
  leadId: any;
  proposalId: any;
  quoteId: any;
  quoteNo: any;
  tenureAmount: any[] = [0, 0, 0];
  premiumAmountDetails: number[][] = [];
  addOnList: any[] = [];

  isBBPlanDetailsVisible: boolean = false;
  premiumDetails: any[][] = [];
  taxList: number[] = [];
  discountList: number[] = [];
  basePremiumList: number[] = [];
  totalPremiumList: any[] = [];
  indPremiumList: any[] = [];
  addOnPremiumValueList: number[][][] = [];
  addOnDetails: Array<any>[] = [new Array()];
  mainData: any;
  customerId: any;
  public showHtmlContent: any;
  formSequence: any[] = [];
  agentCode: any;
  productName: any;
  avaibleZone: any;
  productStartDate: any;
  productEndDate: any;
  parentControl: any;
  isAHPAAdded: boolean = false;
  AHPARiskValue: any;
  showPopup: boolean = false;
  showDoneButton = true;
  changesMade: boolean = false;
  partnerId: any
  productId: any
  pastDate = new Date(1900, 0, 1).toISOString().split('T')[0];
  displayTaxList: any[] = [];
  currentDate = new Date().toISOString().split('T')[0];
  futureDate = new Date(new Date().setFullYear(new Date().getFullYear() + 10)).toISOString().split('T')[0];
  selectedButton: string | null = null;
  collapsedSections: { [key: string]: boolean } = {};
  isOverlayVisible = false;
  isQuote: any = false;
  isPolicyDetailsFetch: boolean = false;
  selectedAddons: any[] = [];
  question: any;
  leadnumber: string = "";
  QuoteNumber: any = [];
  //customerFeedbackModule: any;
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
  kidCount = 0;
  quickQuoteRedirect: Boolean = false;
  totalPremium = 0;
  productComparison: Boolean = false;
  isFeedBackModalVisible: Boolean = false;
  leadNumber: string = ''
  quoteLeadInformation: any = {};
  saveData: any = {};
  covers: any[][] = [];
  pedWaitingPeriod: any;
  tooltipMessage: string = '';
  currentLanguage = 'en';
  pennyDropVerficationDetails: any;
  transactionId: string | undefined;
  orderId: any;
  city: string = '';
  state: string = '';
  retrievedDocuments: any;
  patternErrorMessage: string = "";
  verifyKYCStatus: boolean | undefined;
  otpRequestId: string = "";
  requestId: string = "";
  parsedValue: any;
  selfAnnualIncome: any;
  selfCoverSumInsured: any;
  selectedInnerControl: any;

  salutationMapping: { [key: string]: string[] } = {
    M: ['Mrs', 'Miss', 'Ms', 'Mx'],
    F: ['Mr', 'Mx'],
    O: [] // No restrictions for 'other'
  };
  pennyDropVerficationByOCRDetails: any;
  uploadInfo: { name: any; data: any; }[] | null = null;
  fullQuoteDocRelated: any;
  fullQuoteDocRelatedWithOutOffline: any[] = [];

  //hospiCashCoverVariables
  familyGroup = '';
  selectedFamilyMembers: string[] = [];
  hospiCashSelected: boolean = false;
  hospiCashTab: number = -1;
  showOptions: { [controlName: string]: { [index: number]: boolean } } = {};
  clickedInside = false;

  //Activ Care variables
  familyPair = '';
  selectedFamilyPair: string[] = [];



  constructor(private renderer: Renderer2, private el: ElementRef,
    public commonService: CommonService, private yatraService: YatraService, private router: Router, private spinner: LoadingService,
    private toast: NgToastService, private changeDetectorRef: ChangeDetectorRef,
    private encryptionService: EncryptionService, @Inject(DOCUMENT) private document: Document, private clipboard: Clipboard,
    private route: ActivatedRoute, private languageService: LanguageService, private aesEncryptService: AesEncryptionService,
    private translateService: TranslateService, private leadsService: LeadsService, private datepipe: DatePipe,
    private renewalService: RenewalsService, private customerService: CustomersService) {
  }

  ngOnInit() {

    this.languageService.language$.subscribe(lang => {
      this.translateService.use(lang).subscribe({
        error: () => {
          this.translateService.use('en');
        }
      });
    });

    this.showHtmlContent = false;
    this.formSequence = history.state.formSequence;

    if (localStorage.getItem('code'))
      this.Code = localStorage.getItem('code');


    if (localStorage.getItem('agentCode'))
      this.agentCode = localStorage.getItem('agentCode');
    // this.agencyCode = history.state.productData.agencyCode;
    if (history.state && history.state.productData) {

      if (history.state.productData.productId)
        this.productId = history.state.productData.productId;
      if (history.state.productData.partnerId)
        this.partnerId = history.state.productData.partnerId;
      if (history.state.productData.proposalNum)
        this.proposalNum = history.state.productData.proposalNum;
      if (history.state.productData.tenureAmounts) {
        this.tenureAmount = history.state.productData.tenureAmounts;
      }
      if (history.state.productData.quickQuoteRedirect) {
         this.quickQuoteRedirect = history.state.productData.quickQuoteRedirect;
       }
      if (history.state.productData.leadId) {
        this.leadNumber = history.state.productData.leadId;
      }
      if (history.state.productData.productComparison) {
        this.productComparison = history.state.productData.productComparison;
      }
      if (history.state.productData.tenure) {
        this.formData = { ...this.formData, tenure: history.state.productData.tenure }
      }


      if (history.state.productData.selectedAddons) {
        this.selectedAddons = history.state.productData.selectedAddons
      }

    }
    // this.getFormDataFromFormSequence(this.formSequence[this.getFormIndexValue()].formId);
    if (Object.keys(this.route.snapshot.queryParams).length) {
      this.route.queryParams.subscribe(async params => {
        if (params['transactionId']) {
          this.transactionId = params['transactionId'];
          if (params['token']) {
            localStorage.setItem('token', params['token']);
          }
          this.getKycStatus();
        }
        else if (params['orderid']) {
          this.orderId = params['orderid'];
          if (params['token']) {
            localStorage.setItem('token', params['token']);
          }
          this.getPaymentStatus();
        }
        else {
          const decryptedData = this.encryptionService.decrypt(params['data']);
          if(params['redirect']=='HDFC'){
            if (params['token']) {
              localStorage.setItem('token', params['token']);
            }
            this.setFormIndexValue(decryptedData.currentFormSequence as number);
            const reqData = {
              "partnerId": decryptedData.partnerId,
              "productId": decryptedData.productId
      
            }
            const res = await firstValueFrom(this.commonService.Getformsequence(reqData));
            this.formSequence = JSON.parse(res.data.formSequence);
          }
          if (decryptedData) {
            this.leadnumber = decryptedData.leadId;
            this.agentCode = decryptedData.agentCode;
            this.partnerId = decryptedData.partnerId;
            this.productId = decryptedData.productId;
            if (decryptedData.isLead && !params['redirect'] && params['redirect']!='HDFC') {
              this.quickQuoteRedirect = decryptedData.isLead;
            }
            // this.formData.proposalNumber = decryptedData.proposalNum;
            this.proposalNum = decryptedData.proposalNum;

            decryptedData.currentFormSequence = this.getFormIndexValue().toString();
            await this.yatraService.Getform(decryptedData).subscribe({
              next: async (res: any) => {
                this.formSequence = JSON.parse(res.data.formConfig) || [];
                this.form = JSON.parse(res.data.jsonFormData);
                this.formData = JSON.parse(res.data.formData);
                console.log(this.form, this.formData, this.productId, this.partnerId);
                if (this.formData.insuredMemberDetails && this.formData.insuredMemberDetails.length > 1) {
                  this.quickQuoteRedirect = false;
                }
                if (decryptedData.firstName || decryptedData.proposerGender) {
                  this.formData = {
                    firstName: decryptedData.firstName || "",
                    proposerGender: decryptedData.proposerGender || ""
                  }
                }
                if (this.formData) {
                  const proposalRequiredDetails: {
                    totalPremium: any;
                    proposalNumber: any;
                    covers?: any;
                    PEDWaitingPeriod?: any;  // Make covers an optional property
                  } = {
                    totalPremium: this.formData.totalPremium,
                    proposalNumber: this.proposalNum
                  };

                  if (this.formData.covers) {
                    proposalRequiredDetails.covers = this.formData.covers;
                    proposalRequiredDetails.PEDWaitingPeriod = "";
                  }
                  if (this.formData.waitingPED && this.formData.waitingPED.pedWaitingPeriod) {
                    proposalRequiredDetails.PEDWaitingPeriod = this.formData.waitingPED.pedWaitingPeriod;
                  }
                  if (this.formData.tenureAmount) {
                    this.tenureAmount = this.formData.tenureAmount;
                  }

                  if (this.formData.displayTaxList) {
                    this.displayTaxList = this.formData.displayTaxList;
                  }

                  if (this.formData.covers) {
                    this.covers = this.formData.covers;
                  }

                  if (this.formData.quoteIdDetails) {
                    this.QuoteNumber = this.formData.quoteIdDetails;
                  }
                  if (decryptedData.currentFormSequence === "8") {
                    await this.modifyThankYouJson();
                    // this.formData.policyNumber = decryptedData.policyNumber ?? this.formData.policyNumber;
                    // this.formData.policyStatus = decryptedData.policyStatus ?? this.formData.policyStatus;
                    // this.formData.quoteValidFromDate = decryptedData.policyStartDate ?? this.formData.quoteValidFromDate;
                    // this.formData.quoteValidToDate = decryptedData.policyEndDate ?? this.formData.quoteValidToDate;
                    // this.formData.ReceiptNumber = decryptedData.ReceiptNumber ?? this.formData.ReceiptNumber;
                    // this.formData.customerId = decryptedData.customerId ?? this.formData.customerId;
                    // this.formData.applicationNumber = decryptedData.applicationNumber ?? this.formData.applicationNumber;
                  }
                  // if (decryptedData.paymentStatus == 'PENDING' || decryptedData.paymentStatus == 'FAILED') {
                  //   this.toast.error({ detail: "Error", summary: "Payment is Pending", duration: 3000 });
                  // }
                  if (decryptedData.verifyKyc == true) {
                    this.verifyKYCStatus = true;
                  }

                  if (await this.getFormIndexValue() == 7) {
                    const req = {
                      proposalNum: this.proposalNum
                    };

                    try {
                      // Use firstValueFrom to convert the Observable to a Promise
                      const value: any = await firstValueFrom(this.commonService.getkycstatus(req));
                      // Now you can update this.verifyKYCStatus with the result
                      this.verifyKYCStatus = value.data.kycStatus;
                    } catch (err) {
                      // Handle any error if the Observable fails
                      console.error('Error fetching KYC status:', err);
                    }
                  }
                  sessionStorage.setItem("proposalRequiredDetails", this.encryptionService.encrypt(proposalRequiredDetails));

                  if (sessionStorage.getItem('proposalRequiredDetails') && proposalRequiredDetails.PEDWaitingPeriod) {
                    const proposalRequiredDetails = this.encryptionService.decrypt(sessionStorage.getItem('proposalRequiredDetails') as string);

                    // Check if proposalNumber matches
                    if (proposalRequiredDetails.proposalNumber === this.formData.proposalNumber) {
                      this.totalPremium = proposalRequiredDetails.totalPremium;
                      this.covers = proposalRequiredDetails.covers;
                      this.pedWaitingPeriod = proposalRequiredDetails.PEDWaitingPeriod
                    }
                    else {
                      this.totalPremium = 0;
                      this.covers = [];
                    }
                  }
                }
                // this.initializeRequiredData();
                this.initializeForm();
              },
              error: (err) => {
                console.log(err);
              }
            });
          }
        }
      });
    } else {
      // Retrieve form data based on form sequence if available
      if (this.formSequence && this.formSequence.length > 0) {
        this.getFormDataFromFormSequence(this.formSequence[this.getFormIndexValue()].formId);
      } else {
        console.warn("formSequence is empty or undefined");
      }
    }
    this.customerFeedbackForm = this.fb.group({
      message: [''],
      rating: [null, Validators.required], // Add rating to the form
    });

  }

  initializeRequiredData() {
    if (sessionStorage.getItem('allFormData') != null)
      this.formData = this.encryptionService.decrypt(sessionStorage.getItem('allFormData') as string)
    console.log(this.formData);


    if (sessionStorage.getItem('insuredMemberDetails') != null)
      this.insuredMemberDetails = this.encryptionService.decrypt(sessionStorage.getItem('insuredMemberDetails') as string)

    if (sessionStorage.getItem('leadId') != null) {
      this.leadId = this.encryptionService.decrypt(sessionStorage.getItem('leadId') as string);
    }
    else {
      this.leadId = "";
    }
    if (sessionStorage.getItem("isQuote")) {
      this.isQuote = sessionStorage.getItem("isQuote") == 'true'
    }
    else {
      this.isQuote = false;
    }

    if (sessionStorage.getItem('proposalId') != null) {
      this.proposalId = this.encryptionService.decrypt(sessionStorage.getItem('proposalId') as string);
    }
    else {
      this.proposalId = "";
    }

    // if (sessionStorage.getItem('quoteId') != null) {
    //   this.quoteId = this.encryptionService.decrypt(sessionStorage.getItem('quoteId') as string);
    // }
    // else {
    //   this.quoteId = "";
    // }


    if (this.formData.noOfChildrens) {
      this.kidCount = this.formData.noOfChildrens;
    }
    if (sessionStorage.getItem('quoteNo') != null) {
      this.quoteNo = this.encryptionService.decrypt(sessionStorage.getItem('quoteNo') as string);
    }

    if (sessionStorage.getItem('taxList') != null) {
      this.taxList = this.encryptionService.decrypt(sessionStorage.getItem('taxList') as string);
    }

    if (sessionStorage.getItem('discountList') != null) {
      this.discountList = this.encryptionService.decrypt(sessionStorage.getItem('discountList') as string);

    }

    if (sessionStorage.getItem('basePremiumList') != null) {
      this.basePremiumList = this.encryptionService.decrypt(sessionStorage.getItem('basePremiumList') as string);
    }

    if (sessionStorage.getItem('selectedIndex') != null) {
      this.selectedIndex = this.encryptionService.decrypt(sessionStorage.getItem('selectedIndex') as string);
    }

    if (sessionStorage.getItem('tenureAmount')) {
      this.tenureAmount = this.encryptionService.decrypt(sessionStorage.getItem('tenureAmount') as string)
    }

    if (sessionStorage.getItem('premiumAmountDetails')) {
      this.premiumAmountDetails = this.encryptionService.decrypt(sessionStorage.getItem('premiumAmountDetails') as string)
    }

    if (sessionStorage.getItem('addOnList')) {
      this.addOnList = this.encryptionService.decrypt(sessionStorage.getItem('addOnList') as string);
    }
    else {
      this.addOnList = [];
    }
    if (sessionStorage.getItem('proposalRequiredDetails')) {
      const proposalRequiredDetails = this.encryptionService.decrypt(sessionStorage.getItem('proposalRequiredDetails') as string);

      // Check if proposalNumber matches
      if (proposalRequiredDetails.proposalNumber === this.formData.proposalNumber) {
        this.totalPremium = proposalRequiredDetails.totalPremium;
        this.covers = proposalRequiredDetails.covers;
        this.pedWaitingPeriod = proposalRequiredDetails.PEDWaitingPeriod
      }
      else {
        this.totalPremium = 0;
        this.covers = [];
      }
    }
  }
  async getFormDataFromFormSequence(formId: any) {
    this.initializeRequiredData();
    this.showHtmlContent = false;
    if (this.dynamicStyle) {
      this.renderer.removeChild(this.document.head, this.dynamicStyle)
      this.showHtmlContent = false;
    }
    // if (Object.keys(this.allJsonForm[this.getFormIndexValue()]).length > 0) {
    //   this.form = this.allJsonForm[this.getFormIndexValue()];
    //   let reqdata = {
    //     "verticalCode": this.verticalCode,
    //     "proposalNum": this.proposalNum,
    //     "code": this.agencyCode,
    //     "agentCode": this.agentCode,
    //     "productId": this.productId,
    //     "partnerId": this.partnerId,
    //     "formData": "string",
    //     "formWithFormData": "string",
    //     "formName": "string",
    //     "formId": formId,
    //     "formConfig": "string"
    //   }
    //   this.yatraService.getAllFormDataViaVerticalCode(reqdata).subscribe({
    //     next: (res) => {
    //       this.form = JSON.parse(res.jsonForm);
    //       // this.form = totalpremium;
    //       this.initializeForm();
    //     },
    //     error: (err) => {
    //       console.error(err)
    //     }
    //   })

    // }\
    // if (Object.keys(this.allJsonForm[this.getFormIndexValue()]).length > 0) {
    //   this.form = this.allJsonForm[this.getFormIndexValue()];
    //   this.initializeForm();
    // }
    // else {
    //   let reqData = {
    //     "partnerId": this.partnerId,
    //     "productId": this.productId,
    //     "formId": formId
    //   }
    //   this.yatraService.Getform(reqData).subscribe({
    //     next: (res: any) => {
    //       this.form = JSON.parse(res.data.jsonFormData);
    //       // this.form = totalpremium;
    //       this.initializeForm();
    //     },
    //     error: (err) => {
    //       console.error(err);
    //     }
    //   })

    // }
    if (this.getFormIndexValue() == 7) {
      const req = {
        proposalNum: this.proposalNum
      }
      await this.commonService.getkycstatus(req).subscribe({
        next: (value: any) => {
          this.verifyKYCStatus = value.data.kycStatus;
        },
        error: (err: any) => {

        }
      })
    }
    const reqData = {
      partnerId: this.partnerId.toString(),
      productId: this.productId.toString(),
      formId: this.formSequence.length == 0 ? "0" : this.formSequence[this.getFormIndexValue()].formId.toString(),
      proposalNum: this.proposalNum,
      agentCode: this.agentCode,
      leadId: this.quickQuoteRedirect == false ? '' : this.leadNumber,
      isLead: this.quickQuoteRedirect == false ? false : true,
      currentFormSequence: this.getFormIndexValue().toString()
    }


    await this.yatraService.Getform(reqData).subscribe({
      next: async (res: any) => {

        this.formSequence = JSON.parse(res.data.formConfig) || [];

        this.form = JSON.parse(res.data.jsonFormData);
        console.log("form", this.form);

        this.formData = {
          ...this.formData,  // existing form data
          ...JSON.parse(res.data.formData)  // parsed response data
        };
        console.log(this.formData);
        if (this.form.formTitle == 'Insurance Details') {

          if (this.formData['familyGroup']) {
            this.familyGroup = this.formData['familyGroup'];
          }
          if (this.formData['selectedFamilyMembers']) {
            this.selectedFamilyMembers = this.formData['selectedFamilyMembers'];
          }

          if (this.formData['hospiCashSelected']) {
            this.hospiCashSelected = this.formData['hospiCashSelected'];
          }

          if (this.formData['hospiCashTab']) {
            this.hospiCashTab = this.formData['hospiCashTab'];
          }
        }
        //activeCare
        if (this.formData['familyPair']) {
          this.familyPair = this.formData['familyPair'];
        }

        if (this.formData['selectedFamilyPair']) {
          this.selectedFamilyPair = this.formData['selectedFamilyPair'];
        }
        console.log(this.form, this.formSequence, this.formData);
        if (this.getFormIndexValue() == 8) {
          this.modifyThankYouJson();
        }
        this.initializeForm();
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  async initializeForm() {
    console.log(this.form, this.formData, this.questionFormData, this.productId, this.partnerId);
    this.showHtmlContent = false;
    this.dynamciallyLoadCSS(this.form);
    this.form.formSections.forEach((section: any) => {
      section.formControls.forEach((control: any) => {
        // const policyindex = control.dynamicControls[0].findIndex((item:any) => item.value === this.formData.planType);
        if (control.dynamicControls) {

          if (this.formData[control.name] && (control.visible == true || this.quickQuoteRedirect == true)) {
            if (this.formData[control.name]) {
              control.value = this.formData[control.name].length;
            }
            control.dynamicControls = control.dynamicControls.slice(0, 1)
            this.formData[control.name].forEach((member: any, index: number) => {
              // let tempDynamicControl = control.dynamicControls[0].map((element: any) => ({ ...element }));
              let tempDynamicControl = JSON.parse(JSON.stringify(control.dynamicControls[0]))

              console.log(tempDynamicControl, member);


              tempDynamicControl.forEach((innerControl: any) => {
                if (innerControl.name == 'relation') {
                  innerControl.value = member.relation
                }
                if (innerControl.name == 'covers') {
                  innerControl.value = this.covers[index];
                }
                if (innerControl.name == 'zoneValue') {
                  innerControl.options = member.upgradableZones;
                }
                if (innerControl.name == 'sumInsured') {
                  innerControl.options = member.upgradableSumInsured;
                }

                if (innerControl.name == 'previousCurrentPolicyDetails') {
                  if (member.previousCurrentPolicyDetails && member.previousCurrentPolicyDetails.length > 0) {

                    innerControl.visible = true;
                    member.previousCurrentPolicyDetails.forEach((previousPolicyDetails: any) => {
                      const tempInnerArrayControl = JSON.parse(JSON.stringify(innerControl.innerArrayControl[0]));
                      Object.keys(previousPolicyDetails).forEach((key) => {
                        if (
                          (key == 'additionalInfoClaim' || key == 'diseaseName' || key == 'dateOfDiagnosis' ||
                            key == 'lastConsultationDate' || key == 'nameOfSurgery' || key == 'treatmentDetails' ||
                            key == 'disability' || key == 'periodOfHospitalisation' || key == 'anyOtherInformation')
                          && previousPolicyDetails[key] !== ''
                        ) {
                          // Find and update the corresponding control to make it visible
                          const tempInnerControl = tempInnerArrayControl.find((ctrl: any) => ctrl.name === key);
                          if (tempInnerControl) {
                            tempInnerControl.visible = true;
                          }
                        }
                      });
                      innerControl.innerArrayControl.push(tempInnerArrayControl);
                    });
                  }

                }

                // if (innerControl.name == 'previousPolicyDetails' &&  member.previousPolicyDetails?.length > 0) {
                //   innerControl.innerArrayControl = innerControl.innerArrayControl.slice(0, 1); // Keep only the first template
                //   console.log(innerControl.innerArrayControl);

                //   for (let i = 0; i < member.previousPolicyDetails.length; i++) {
                //     // Create a fresh template copy for each iteration
                //     let freshTemplate = innerControl.innerArrayControl[0].map((element: any) => ({ ...element }));

                //     if (i === 0) {
                //       // For the first index, push the full template
                //       innerControl.innerArrayControl.push(freshTemplate);
                //     } else {
                //       // Create a customized version for subsequent indices
                //       let customizedInnerArrayControl = freshTemplate.slice(3).map((element: any) => ({ ...element }));
                //       customizedInnerArrayControl.forEach((controlElement: any) => {
                //         if (controlElement.name == 'policyIndex') {
                //           controlElement.label = 'Policy ' + (i + 1);
                //         }
                //       });
                //       innerControl.innerArrayControl.push(customizedInnerArrayControl);
                //     }
                //   }
                // }


                if (
                  this.formData['ckycNo'] &&
                  member.relation === 'Self' &&
                  ['firstName', 'middleName', 'lastName', 'memberdob', 'mobileNumber'].includes(innerControl.name)
                ) {
                  innerControl.disabled = true; // Disable the control
                }
              })

              control.dynamicControls.push(tempDynamicControl);

            })
          }
        }
        // else if (control.subControls && this.formData[control.name]) {
        //   control.subControls.forEach((subControl: ISubControl) => {
        //     if (subControl.name == 'addOnDetails') {
        //       subControl.innerSubControls = subControl.innerSubControls?.slice(0, 1)
        //       this.formData['insuredMemberDetails'].forEach((member: any) => {
        //         if (subControl.innerSubControls) {
        //           let tempInnerControl = JSON.parse(JSON.stringify(subControl.innerSubControls[0]));
        //           const tempRelationshipType = JSON.parse(member.relationshipType);
        //           tempInnerControl.label = tempRelationshipType.value;
        //           tempInnerControl.name = tempRelationshipType.value;
        //           subControl.innerSubControls.push(tempInnerControl)
        //         }
        //       })
        //     }
        //   })

        // }
        const value = this.formData[control.name];
        if (control.type == 'text' && (typeof value == 'string') && (value.startsWith('{') && value.endsWith('}'))) {
          control.value = JSON.parse(this.formData[control.name]).value;
        }
        else {
          if ((this.formData[control.name]) || (this.formData[control.name] && !control.value)) {
            control.value = this.formData[control.name];
          }
        }
      });
    });
    console.log(this.form);


    if (this.form?.formSections) {
      this.dynamicFormGroup = this.fb.group({});
      this.form.formSections.forEach((section) => {
        section.formControls.forEach(async (control: IFormControl) => {
          if (control.dynamicControls) {
            if (control.visible == true) {
              let tempFormArray = this.fb.array([]);
              for (let i = 1; i < control.dynamicControls.length; i++) {
                tempFormArray.push(this.initializeDynamicFormControls(control.dynamicControls[i], i, control));
              }

              this.dynamicFormGroup.addControl(control.name, tempFormArray);
            }
          }
          else if (control.subControls) {
            // control.subControls.forEach((subControl: ISubControl) => {
            //   if (subControl.name == 'addOnDetails') {
            //     subControl.innerSubControls = subControl.innerSubControls?.slice(0, 1)
            //     this.formData['insuredMemberDetails'].forEach((member: any) => {
            //       if (subControl.innerSubControls) {
            //         let tempInnerControl = JSON.parse(JSON.stringify(subControl.innerSubControls[0]));
            //         const tempRelationshipType = JSON.parse(member.relationshipType);
            //         tempInnerControl.label = tempRelationshipType.value;
            //         tempInnerControl.name = tempRelationshipType.value;
            //         subControl.innerSubControls.push(tempInnerControl)
            //       }
            //     })
            //   }
            // })
            if (control.type == 'questionnaire') {
              let demoMember: any;
              let demoTypeIndex: any;
              let doneButton: any;
              if (control.subControls) {
                demoMember = control.subControls.findIndex(control => control.name === 'demoMember')
                demoTypeIndex = control.subControls.findIndex(control => control.name === 'demoType');
                doneButton = control.subControls.find(control => control.name === 'doneButton');
                control.subControls = [
                  ...control.subControls.slice(demoMember, demoMember + 1),
                  ...control.subControls.slice(demoTypeIndex, demoTypeIndex + 1), // Retain demoType
                ]; // Keep the first control (or reset)
              }
              this.formData['insuredMemberDetails'].forEach((member: any, index: any) => {
                if (control.subControls) {
                  let tempMemberControl = JSON.parse(JSON.stringify(control.subControls[0]));
                  let tempInnerControl = JSON.parse(JSON.stringify(control.subControls[1]));
                  const tempRelationshipType = JSON.parse(member.relationshipType);
                  if (control.label && control.label.toLowerCase().includes('pregnant')) {
                    // Check if 'Spouse' is selected in insuredMemberDetails
                    const isSpouseSelected = tempInnerControl.innerArrayControl[0][0].allowedRelations.includes(tempRelationshipType.value) && member.memberGender == 'F';

                    if (!isSpouseSelected) {
                      control.visible = false;
                      return; // Stop further execution
                    }
                  }
                  tempMemberControl.label = tempRelationshipType.value;
                  tempMemberControl.name = tempRelationshipType.value.toLowerCase();
                  tempInnerControl.label = tempRelationshipType.value;
                  tempInnerControl.name = tempRelationshipType.value;
                  if (this.formData[control.name] && this.formData[control.name][tempMemberControl.name] == true) {
                    for (const key in this.formData[control.name]) {
                      const value = this.formData[control.name][key];
                      if (key == tempRelationshipType.value.toLowerCase()) {
                        if (typeof this.formData[control.name][key] === 'boolean' && this.formData[control.name][key] == true) {
                          // const arrayName = (key).charAt(0).toUpperCase() + (key).slice(1);
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
              this.dynamicFormGroup.addControl(control.name, this.initializeSubControls((control.subControls.slice(2)), null, control));
            }
            else if (control.type == 'chronicquestionnaire') {
              let matchedControls: any[] = [];
              let visibleMatchedControls: any[] = [];
              let checkHyp = false;
              this.formData['insuredMemberDetails'].forEach((member: any, index: any) => {                           //           const newItem = this.formData.insuredMemberDetails.find((item: any) => item.relation === tempRelationshipType.value);
                // let trueKeys = Object.keys(member.chronicDiseases).filter(key => member.chronicDiseases[key]);
                let trueKeys = Object.keys(member.chronicDiseases)
                  .filter(key => member.chronicDiseases[key])
                  .map(key => key.toLowerCase());
                if (this.formData.productName.includes('VYTL') && trueKeys.length > 0 && trueKeys.includes(control.nameProperty.toLowerCase())) {
                  const hasHypertensionAndHyperlipidemia = trueKeys.includes('hypertension') && trueKeys.includes('hyperlipidemia');
                  const hasAsthmaAndCopd = trueKeys.includes('asthma') && trueKeys.includes('copd');
                  if (control.nameProperty?.toLowerCase() === 'hypertension') {
                    if (hasHypertensionAndHyperlipidemia) {
                      control.label = 'Hypertension/Hyperlipidemia';
                      control.visible = true;
                    }
                    else {
                      control.label = 'Hypertension';
                      control.visible = true;
                    }
                  }
                  else if (control.nameProperty?.toLowerCase() === 'hyperlipidemia') {
                    if (hasHypertensionAndHyperlipidemia) {
                      checkHyp = true;
                      control.visible = false;
                      return; // Skip this iteration
                    }
                    else {
                      control.visible = true;
                    }
                  }
                  // Skip the iteration if the condition is met for Asthma/COPD
                  else if (control.nameProperty?.toLowerCase() === 'asthma') {
                    if (hasAsthmaAndCopd) {
                      control.label = 'Asthma/COPD';
                      control.visible = true;
                    }
                    else {
                      control.label = 'Asthma';
                      control.visible = true;
                    }
                  }
                  else if (control.nameProperty?.toLowerCase() === 'copd') {
                    if (hasAsthmaAndCopd) {
                      control.visible = false;
                      return; // Skip this iteration
                    }
                    else {
                      control.visible = true;
                    }
                  }
                  // Default logic for other controls
                  else if (trueKeys.includes(control.nameProperty?.toLowerCase())) {
                    control.visible = true;
                  } else {
                    // control.visible = false;
                  }
                }
                else {
                  control.visible = true;
                }

                console.log(member, member.chronicDiseases, trueKeys, control);
                const isControlInTrueKeys = control?.nameProperty?.toLowerCase && trueKeys.includes(control.nameProperty.toLowerCase());
                // Store matching control information in the array if condition is true
                if (isControlInTrueKeys) {
                  matchedControls.push(member);
                  visibleMatchedControls.push(true);
                }
              })
              if (matchedControls.length > 0) {
                let demoMember: any;
                let demoTypeIndex: any;
                let doneButton: any;
                if (control.subControls) {
                  demoMember = control.subControls.findIndex(control => control.name === 'demoMember')
                  demoTypeIndex = control.subControls.findIndex(control => control.name === 'demoType');
                  doneButton = control.subControls.find(control => control.name === 'doneButton');
                  control.subControls = [
                    ...control.subControls.slice(demoMember, demoMember + 1),
                    ...control.subControls.slice(demoTypeIndex, demoTypeIndex + 1), // Retain demoType
                  ]; // Keep the first control (or reset)
                }
                matchedControls.forEach((member: any, i: any) => {
                  if (control.subControls) {
                    let tempMemberControl = JSON.parse(JSON.stringify(control.subControls[0]));
                    let tempInnerControl = JSON.parse(JSON.stringify(control.subControls[1]));
                    const tempRelationshipType = JSON.parse(member.relationshipType);
                    tempMemberControl.label = tempRelationshipType.value;
                    tempMemberControl.name = tempRelationshipType.value.toLowerCase();
                    tempMemberControl.visible = visibleMatchedControls[i];
                    tempInnerControl.label = tempRelationshipType.value;
                    tempInnerControl.name = tempRelationshipType.value;
                    if (this.formData[control.name] && this.formData[control.name][tempMemberControl.name] == true) {
                      for (const key in this.formData[control.name]) {
                        const value = this.formData[control.name][key];
                        if (key == tempRelationshipType.value.toLowerCase()) {
                          if (typeof this.formData[control.name][key] === 'boolean' && this.formData[control.name][key] == true) {
                            tempMemberControl.value = true;
                            tempInnerControl.visible = true;
                          }
                        }
                      }
                    }

                    control.subControls?.push(tempMemberControl);
                    control.subControls?.push(tempInnerControl);
                  }
                });
                control.subControls?.push(doneButton);
                this.dynamicFormGroup.addControl(control.name, this.initializeSubControls((control.subControls.slice(2)), null, control));
              }
              else {
                control.visible = false;
              }

            }
            else {
              if ((control.name == 'chronicCare' || control.name == 'chronicManagement') && this.formData['isChronicCare'] == 'N') {
                control.visible = false;
              }
              control.subControls.forEach((subControl: ISubControl) => {
                if (subControl.name == 'addOnCover' && control.name == 'deductible') {
                  subControl.value = true;
                }
                if (control.isDefault) {
                  const addOnCoverControl = control.subControls?.find((subControl: any) => subControl.name === 'addOnCover');
                  if (addOnCoverControl) {
                    addOnCoverControl.value = true;
                  }
                }
                if (subControl.name == 'addOnDetails') {
                  let demoTypeIndex: any;
                  let doneButton: any;
                  if (subControl.innerSubControls) {
                    demoTypeIndex = subControl.innerSubControls.findIndex(control => control.name === 'demoType');
                    doneButton = subControl.innerSubControls.find(control => control.name === 'doneButton');
                    // Slice the array to retain demoType and doneButton only
                    subControl.innerSubControls = [
                      ...subControl.innerSubControls.slice(demoTypeIndex, demoTypeIndex + 1), // Retain demoType
                      // ...subControl.innerSubControls.slice(doneButtonIndex, doneButtonIndex + 1) // Retain doneButton
                    ]; // Keep the first control (or reset)
                  }
                  this.formData['insuredMemberDetails'].forEach((member: any, index: any) => {
                    if (subControl.innerSubControls) {
                      let tempInnerControl = JSON.parse(JSON.stringify(subControl.innerSubControls[0]));
                      const tempRelationshipType = JSON.parse(member.relationshipType);
                      tempInnerControl.label = tempRelationshipType.value;
                      tempInnerControl.name = tempRelationshipType.value;
                      if (control.name == 'deductible') {
                        tempInnerControl.coreControls.forEach((coreControl: any) => {
                          if (coreControl.type == 'checkbox') {
                            coreControl.value = true;
                          }
                          else if (coreControl.type == 'select') {
                            coreControl.value = member.deductibleAmount;
                          }
                        })
                      }

                      if (control.isDefault) {
                        let addOnSumInsured = 0;
                        tempInnerControl.coreControls.forEach((coreControl: any) => {
                          if (coreControl.name == 'memberCheckbox') {
                            coreControl.value = true;
                          }
                          if (coreControl.name == 'addOnSumInsured') {
                            addOnSumInsured = coreControl.value;
                          }
                        })

                        const coverId = control.subControls?.find((subControl: any) => subControl.name === 'addOnId')?.value;
                        const coverName = control.subControls?.find((subControl: any) => subControl.name === 'optionalCoverName')?.value;

                        if (coverId && coverName) {
                          // Initialize member.covers if not present
                          if (!member.covers) {
                            member.covers = [];
                          }

                          // Check and push into member.covers if not already present
                          let memberCoverExists = member.covers.some((cover: any) => cover.coverId === coverId);
                          if (!memberCoverExists) {
                            member.covers.push({
                              coverId: coverId,
                              value: addOnSumInsured, // Add appropriate value if needed
                              coverName: coverName
                            });
                          }

                          // Initialize this.covers[index] if not present
                          if (!this.covers[index]) {
                            this.covers[index] = [];
                          }

                          // Check and push into this.covers[index] if not already present
                          let coverExistsInCovers = this.covers[index].some((cover: any) => cover.coverId === coverId);
                          if (!coverExistsInCovers) {
                            this.covers[index].push({
                              coverId: coverId,
                              value: addOnSumInsured, // Add appropriate value if needed
                              coverName: coverName
                            });
                          }

                        }

                      }

                      if (subControl.conditionCheck) {
                        console.log(subControl, this.formData, tempInnerControl);

                        if (member.chronicDiseases != "") {
                          tempInnerControl.coreControls.forEach((coreControl: any) => {
                            if (coreControl.name == 'memberCheckbox' || member.chronicDiseases.includes(coreControl.name)) {
                              coreControl.value = true;
                            }
                          });

                          const addOnCoverControl = control.subControls?.find((subControl: any) => subControl.name === 'addOnCover');
                          if (addOnCoverControl) {
                            addOnCoverControl.value = true;
                          }

                          const coverId = control.subControls?.find((subControl: any) => subControl.name === 'addOnId')?.value;
                          const coverName = control.subControls?.find((subControl: any) => subControl.name === 'optionalCoverName')?.value;

                          if (coverId && coverName) {
                            // Initialize member.covers if not present
                            if (!member.covers) {
                              member.covers = [];
                            }

                            // Check and push into member.covers if not already present
                            let memberCoverExists = member.covers.some((cover: any) => cover.coverId === coverId);
                            if (!memberCoverExists) {
                              member.covers.push({
                                coverId: coverId,
                                value: 0, // Add appropriate value if needed
                                coverName: coverName
                              });
                            }

                            // Initialize this.covers[index] if not present
                            if (!this.covers[index]) {
                              this.covers[index] = [];
                            }

                            // Check and push into this.covers[index] if not already present
                            let coverExistsInCovers = this.covers[index].some((cover: any) => cover.coverId === coverId);
                            if (!coverExistsInCovers) {
                              this.covers[index].push({
                                coverId: coverId,
                                value: 0, // Add appropriate value if needed
                                coverName: coverName
                              });
                            }
                          }
                        }


                        tempInnerControl.coreControls.forEach((corecontrol: any, index: any) => {
                          if (corecontrol.dependentControls && this.formData[control.name]) {
                            const newvalue = this.formData[control.name][subControl.name][tempRelationshipType.value][index][corecontrol.name];
                            console.log(newvalue);

                            corecontrol.dependentControls.forEach((question: any) => {
                              let newcontrol = tempInnerControl.coreControls.find((item: any) => item.name == question)
                              newcontrol.visible = newvalue;
                            })
                          }
                        })
                      }
                      subControl.innerSubControls?.push(tempInnerControl);
                    }
                  });
                  subControl.innerSubControls?.push(doneButton);
                }
              });
              this.dynamicFormGroup.addControl(control.name, this.initializeSubControls(control.subControls));
            }

            if (control.isDefault) {

              this.dynamicFormGroup.get(control.name)?.get('addOnCover')?.disable();
              console.log(this.dynamicFormGroup.get(control.name)?.get('addOnDetails'));
              const addOnDetailsGroup = this.dynamicFormGroup.get(control.name)?.get('addOnDetails') as FormGroup;
              Object.keys(addOnDetailsGroup.value).forEach((key) => {
                console.log(addOnDetailsGroup.get(key));
                (addOnDetailsGroup.get(key) as FormArray).controls[0].get('memberCheckbox')?.disable();
              })
            }
            if (control.postControlCreationMethod) {
              this.resolveMethod(control.postControlCreationMethod, control);
            }

            // control.subControls.forEach((subControl: ISubControl) => {
            //   if (subControl.name == 'addOnDetails' && subControl.conditionCheck) {
            //     console.log(subControl,control,this.dynamicFormGroup);

            //     // this.formData['insuredMemberDetails'].forEach((member: any) => {
            //     //   if (member.shouldTriggerInputChange) {
            //     //     this.onInputChange(true);
            //     //     // Reset the flag after triggering
            //     //     member.shouldTriggerInputChange = false;
            //     //   }
            //     // });
            //   }
            // });
            if (control.type == 'combinedCheckbox') {
              control.subControls.forEach((subControl: any) => {
                if (subControl.name == 'addOnDetails' && subControl.conditionCheck) {
                  this.formData['insuredMemberDetails'].forEach((member: any) => {
                    if (subControl.innerSubControls) {
                      subControl.innerSubControls.forEach((innerSubControl: any, index: number) => {
                        if (innerSubControl.name == member.relation && member.chronicDiseases != "") {
                          console.log(member.chronicDiseases);
                          innerSubControl.coreControls.forEach((coreControl: any) => {
                            if (coreControl.name == 'memberCheckbox' || member.chronicDiseases.includes(coreControl.name)) {
                              this.onInputChange(true, subControl, control, index, innerSubControl, coreControl);
                            }
                          })
                        }
                      })
                    }
                  })
                }
              })
            }
          }
          else if (control.innerArrayControl) {
            if (control.visible == true) {
              let tempFormArray = this.fb.array([]);
              for (let i = 1; i < control.innerArrayControl.length; i++) {
                tempFormArray.push(this.initializeDynamicFormControls(control.innerArrayControl[i], i, control));
              }

              this.dynamicFormGroup.addControl(control.name, tempFormArray);
            }
          }
          else {

            if (control.type === 'date') {
              const lowerCaseName = control.name.toLowerCase();
              if (lowerCaseName.includes('dob') || lowerCaseName.includes('dateofbirth')) {
                const currentDate = new Date();
                const currentYear = currentDate.getFullYear();
                const currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are 0-based
                const currentDay = String(currentDate.getDate()).padStart(2, '0');

                // Construct dobRegex pattern as a string
                const dobPattern =
                  `^(18[0-9]{2}|19[0-9]{2}|20[0-${currentYear.toString().slice(2, 3)}][0-${currentYear.toString().slice(3, 4)}])` + // Years 1800-Current Year
                  `-(0[1-9]|1[0-2])` + // All valid months for past years
                  `-(0[1-9]|[12][0-9]|3[01])` + // All valid days for past years and months
                  `|${currentYear}-(${currentMonth}|0[1-9]|1[0-9])` + // Current year, only months up to current month
                  `-${currentDay}|(0[1-9]|[12][0-9]|3[01])$`; // Only days up to current day for the current month

                // Push the pattern as a validator to the control
                control.validators?.push({
                  validatorName: "pattern",
                  pattern: dobPattern, // Use the constructed string pattern here
                  message: "Date of Birth should not exceed the current date and must be in yyyy-MM-dd format."
                });
              }
            }
            let controlValidators: any = [];
            if (control.validators && control.visible == true) {
              control.validators.forEach((val: IValidator) => {
                if (val.validatorName === 'required') controlValidators.push(Validators.required);
                if (val.validatorName === 'email') controlValidators.push(Validators.email);
                if (val.validatorName === 'minlength') controlValidators.push(Validators.minLength(val.minLength as number));
                if (val.validatorName === 'maxlength') controlValidators.push(Validators.maxLength(val.maxLength as number));
                if (val.validatorName === 'pattern') controlValidators.push(Validators.pattern(val.pattern as string));
                if (val.validatorName === 'requiredTrue') {
                  // Custom validator for checkboxes
                  controlValidators.push((formControl: AbstractControl) => {
                    return formControl.value === true ? null : { requiredTrue: val.message || 'This field is required' };
                  });
                }
              })
            }
            // if(control.type=='select' && control.methodName && control.options?.length==0){
            //   this.callMethod(control.methodName,control);
            // }
            if (control.type === 'multiSelectCheckbox' && control.selectCheckboxOptions) {
              // Only call resolveMethod if selectCheckboxOptions is empty
              // if (control.selectCheckboxOptions.length === 0) {
              //   await this.resolveMethod(control.methodName, control);

              // }
              // After resolving, add the control to the dynamic form group
              const controlGroup = this.fb.group({});
              control.selectCheckboxOptions.forEach(option => {
                controlGroup.addControl(option.value, new FormControl(false));
              });
              this.dynamicFormGroup.addControl(control.name, controlGroup);
            }
            if (['text', 'email', 'password', 'number', 'date', 'summary', 'displaycovers'].includes(control.type) && control.methodName) {
              if (control.otherControlName) {
                this.callMethod(control.methodName, control, section)
              }
              else {
                this.resolveMethod(control.methodName, control)
              }
            }

            if (control.type === 'select' && control.options) {
              // Call the method to get all options if defined and options array is empty
              if (control.getAllOption && control.options.length === 0) {
                this.callMethod(control.getAllOption, control);
              }
              else if (control.options.length === 0 && control.name == 'zoneValue') {
                control.options = this.formData['upgradableZones'];
                // this.formData['upgradableZones'].forEach((zoneOption: any) =>
                // {
                //   control.options = [];
                //   control.options.push({
                //     name: zoneOption.zone.toString(), // Display name
                //     value: zoneOption.zoneCode.toString() // Corresponding value
                //   });
                // });
              }




              // If the control's value is empty, set it based on the selected options
              if (control.value === "") {
                // Set control value if any option is selected
                if (control.options && control.options.length > 0) {
                  control.options.forEach((option: IOptions) => {
                    if (option.selected) {
                      control.value = option.id ? this.stringifyObject(option) : option.value;
                    }
                  });
                }

                // Call the methodName method after setting the value if defined
                if (control.methodName) {
                  await this.resolveMethod(control.methodName, control);
                }
              }
              else if (control.value != "" && (this.quickQuoteRedirect || this.isQuote === true) && control.methodName) {
                await this.resolveMethod(control.methodName, control);
                // if (control.name == 'insuredMembers') {
                //   //loop the options and see if the option has value true in the insuredMembers in formData and the call the log selection
                //   control.selectCheckboxOptions?.forEach((option: any) => {
                //     if (this.formData.insuredMembers[option.value] === true) {
                //       // Call logSelection function (pass null for event if not triggering through UI)
                //       this.logSelection(null, option, control);
                //     }
                //   })
                // }

              }
            }

            if (control.type === 'customizeSelect' && control.options) {
              // Call the method to get all options if defined and options array is empty
              if (control.getAllOption && control.options.length === 0) {
                this.callMethod(control.getAllOption, control);
              }
            }

            if (control.type == 'radio') {

              if (control.value == "")
                control.value = control.radioOptions?.find(option => option.selected)?.value || "";

              if (control.methodName)
                this.callMethod(control.methodName, control);
            }

            if (control.type == 'custom-radio' && control.methodName) {
              this.resolveMethod(control.methodName, control);
            }
            const radioOptionsControl = this.dynamicFormGroup.get('totalPremium');

            if (radioOptionsControl) {
              radioOptionsControl.valueChanges.subscribe((value: string) => {

                this.form.formSections.forEach((section: any) => {
                  section.formControls.forEach((formControl: any) => {
                    if (formControl.name == 'totalPremium' && formControl.type == 'custom-radio') {
                      this.selectedIndex = formControl.radioOptions.findIndex((option: any) => option.value === value);
                      if (this.QuoteNumber.length > 0) {
                        this.formData.quoteId = this.QuoteNumber[this.selectedIndex];
                      }
                      this.formData.tenure = this.selectedIndex + 1;
                    }
                  });
                });
              })
            }

            if (control.type == 'boldtext' && control.methodName) {
              this.resolveMethod(control.methodName);
            }

            if (control.name == 'totalPremium' && this.totalPremium != 0) {
              this.dynamicFormGroup.addControl(control.name, new FormControl(this.totalPremium, controlValidators));
            }
            else
              this.dynamicFormGroup.addControl(control.name, new FormControl(control.value, controlValidators));

            // if (control.name == 'memberDobProposer') {
            //   console.log(control, this.dynamicFormGroup.get(control.name));
            // }
            if (control.type == 'custom-radio' && this.formData[control.name]) {
              const radioControl = this.dynamicFormGroup.get(control.name);
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
        });
      });

      if (this.isQuote) {
        let nameList = [];
        const parsedName = this.parseName(this.dynamicFormGroup.get('firstName'));
        nameList.push(parsedName);
        this.dynamicFormGroup.get('firstName')?.setValue(nameList[0].firstName);
        this.dynamicFormGroup.get('middleName')?.setValue(nameList[0].middleName);
        this.dynamicFormGroup.get('lastName')?.setValue(nameList[0].lastName);

        if (this.formData?.proposerPincode) {
          console.log("Proposer Pincode:", this.formData.proposerPincode);

          const pincode = this.formData.proposerPincode;

          // Prepare request data for API call
          const reqData = {
            pincode,
            agentCode: this.agentCode,
            productId: this.productId.toString(),
          };
          console.log(reqData);

          // Fetch sumInsured based on pincode
          this.commonService.getPinCodeByCity(reqData).subscribe({
            next: (res: any) => {
              if (res.isSuccess && res.data) {
                const upgradableSumInsured = res.data.sumInsuredList || [];
                console.log("Fetched Sum Insured List:", upgradableSumInsured);

                // Update sumInsured options for the first member
                const sumInsuredControl = this.dynamicFormGroup.get('sumInsured');
                if (sumInsuredControl) {
                  sumInsuredControl.setValue(''); // Clear previous value
                }
                this.form.formSections.forEach((section: any) => {
                  section.formControls.forEach((control: any) => {
                    if (control.name === 'sumInsured') {
                      control.options = upgradableSumInsured.map((item: any) => ({
                        ...item,
                      }));
                    }
                  });
                });

                // Update sumInsured options for other member
                this.formData.insuredMemberDetails.forEach((member: any, index: number) => {
                  console.log(`Setting options for Member ${index + 1}:`, member);
                  member.upgradableSumInsured = upgradableSumInsured;
                  console.log(upgradableSumInsured, this.formData)

                  // const memberSumInsuredControl = this.dynamicFormGroup.get(`insuredMemberDetails${index + 1}.sumInsured`);
                  // console.log(memberSumInsuredControl);

                  // if (memberSumInsuredControl) {
                  //   console.log("Updated Sum Insured Options:", upgradableSumInsured);
                  //   memberSumInsuredControl.setValue(''); // Clear current value for the member
                  // } else {
                  //   console.warn(`No sumInsured control found for Member ${index + 1}`);
                  // }

                });
                console.log("Final Sum Insured Options Updated Successfully.");
              } else {
                console.error("Failed to fetch sumInsured. Resetting options.");
              }
            },
            error: (err: any) => {
              console.error("Error fetching sumInsured:", err);
            },
          });
        }

      }
      this.dynamicFormGroup.addControl('leadNumber', new FormControl(this.leadnumber));
      console.log(this.dynamicFormGroup)
      //dynamic css
      // this.showHtmlContent = true;
      // if(this.form.formTitle == 'Total Premium' && window.performance?.navigation.type === 1){
      //   this.getPremiumAmount();
      // }

      this.flattenObject(this.formData);
      this.spinner.hide();
    }

    console.log(this.form);



    if (this.formSequence[this.getFormIndexValue()].formName == "Confirmation") {
      //this.customerFeedbackModule.show();
      this.isFeedBackModalVisible = true;
    }

    //  if(this.formData.productName==='Active Secure' && this.form.formTitle == 'Total Premium'){
    //   this.sumInsuredList();
    //  }

  }

  initializeSubControls(subControls: any, controlGroup: any = null, parentControl: any = null) {
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

        if (control.type == 'select' && control.getAllOption) {
          if (control.options?.length == 0) {
            this.callMethod(control.getAllOption, control);
          }
        }
        if (control.innerArrayControl) {
          if (control.visible) {
            let tempFormArray = this.fb.array([]);
            for (let i = 1; i < control.innerArrayControl.length; i++) {
              tempFormArray.push(this.initializeDynamicFormControls(control.innerArrayControl[i], i, control));
            }
            formGroup.addControl(control.name, tempFormArray);
          }
          else {
            formGroup.addControl(control.name, new FormArray([]));
          }
        }
        if (control.extraBenefitsControls) {
          let tempFormArray = this.fb.array([]);
          for (let i = 0; i < control.extraBenefitsControls.length; i++) {
            tempFormArray.push(this.initializeDynamicFormControls(control.extraBenefitsControls[i], i, control));
          }
          formGroup.addControl(control.name, tempFormArray);
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
            tempFormArray.push(this.initializeSubControls(control.coreControls[i], null, control))
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
          this.resolveMethod(subControls.getAllOption, subControls, parentControl);
        }
      }
      if (subControls.type == 'select' && subControls.value === "") {
        if (subControls.options && subControls.options.length > 0) {
          subControls.options.forEach((option: IOptions) => {
            if (option.selected) {
              subControls.value = option.id ? this.stringifyObject(option) : option.value;
            }
          });
        }
        else{
          this.resolveMethod(subControls.methodName,subControls,parentControl)
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
          for (let i = 1; i < subControls.innerArrayControl.length; i++) {
            tempFormArray.push(this.initializeDynamicFormControls(subControls.innerArrayControl[i], i, subControls));
          }
          formGroup.setValue(subControls.name, tempFormArray);
        }
        else {
          formGroup.addControl(subControls.name, new FormArray([]));
        }
      }
      if (subControls.extraBenefitsControls) {
        const tempFormArray = this.fb.array<FormGroup>([]);
        for (let i = 0; i < subControls.extraBenefitsControls.length; i++) {
          // const currentControl = subControls.extraBenefitsControls[i];      
          // const formGroup = this.fb.group({
          //   [currentControl.name]: [currentControl.value || null],
          // });      
          // tempFormArray.push(formGroup);
          tempFormArray.push(this.initializeSubControls(subControls.extraBenefitsControls[i], null, subControls))

        }
        formGroup.addControl(subControls.name, tempFormArray);
      }
      else
        formGroup.addControl(subControls.name, new FormControl(subControls.value, controlValidators));
      // if (subControls.postControlCreationMethod) {
      //   this.resolveMethod(subControls.postControlCreationMethod, subControls);
      // }
      // return new FormControl(subControls.value,controlValidators);

    }


    console.log(formGroup);
    return formGroup;
  }

  initializeDynamicFormControls(dynamicFormControls: any, index: any = null, parentControl: any = null, policyLength: any = 0) {
    console.log(parentControl);

    let formGroup: any = this.fb.group({})
    dynamicFormControls.forEach((control: IDynamicControl) => {
      if (control.subControls) {
        let tempFormArray = this.fb.array([]);
        if (control.type == 'hospiCashInfo') {
          console.log(Array.isArray(control.subControls));

          if (Array.isArray(control.subControls)) {
            (control.subControls as ISubControl[][]).forEach((hospiMemberControl: any) => {
              let tempFormGroup: any = this.fb.group({});
              hospiMemberControl.forEach((memberControl: any) => {
                if (memberControl.type == 'radio') {
                  memberControl.value = memberControl.radioOptions.find(
                    (option: any) => option.selected === true
                  )?.value;
                }
                tempFormGroup.addControl(memberControl.name, new FormControl(memberControl.value));
              })
              tempFormArray.push(tempFormGroup);
            });
          }
        }
        formGroup.addControl(control.name, tempFormArray);
      }
      else if (control.innerControls && control.visible == true) {
        let innerGroup = this.initializeDynamicFormControls(control.innerControls);
        formGroup.addControl(control.name, innerGroup);
      }
      else if (control.innerArrayControl && control.visible == true) {
        let tempFormArray = this.fb.array([]);
        for (let z = 1; z < control.innerArrayControl.length; z++) {
          tempFormArray.push(this.initializeDynamicFormControls(control.innerArrayControl[z], z, control));
        }
        formGroup.addControl(control.name, tempFormArray);
        console.log(formGroup, tempFormArray, control)
        // formGroup.setValue(control.name, tempFormArray);
      }
      else if (!control.innerArrayControl) {
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
        if (control.type === 'multipleselect' && control.options) {
          const controlGroup = this.fb.group({});
          control.options.forEach(option => {
            controlGroup.addControl(option.value, new FormControl(false));
          });
          formGroup.addControl(control.name, controlGroup);
        }
        if (control.type === 'subtabview') {
          control.tabs?.forEach(element => {
            // this.callMethod(control.methodName, control);
            const controlGroup = this.fb.group({});
            element.selectCheckboxOptions?.forEach(option => {
              controlGroup.addControl(option.value, new FormControl(false));
            });
            formGroup.addControl(element.name, controlGroup);
          });

        }
        if (control.type == 'select' && control.getAllOption) {
          if (control.options?.length == 0) {
            this.callMethod(control.getAllOption, control);
          }
        }
        else if(control.type == 'select' && control.methodName=='updateDesignationBasedOnAnnualincome'){
          this.resolveMethod(control.methodName,control,index,parentControl)
        }
        else if (control.type == 'select' && control.methodName ) {
          this.resolveMethod(control.methodName, control, index, policyLength);
        }
        if (control.type == 'select' && control.value === "") {
          // Set control value if any option is selected
          if (control.options && control.options.length > 0) {
            control.options.forEach((option: IOptions) => {
              if (option.selected) {
                control.value = option.id ? this.stringifyObject(option) : option.value;
              }
            });
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
      if (control.disabled) {
        formGroup.get(control.name)?.disable();
      }

    })
    return formGroup;
  }

  dynamciallyLoadCSS(form: IForm) {
    let tf: string = "default.css";
    if (form.themeFile) tf = form.themeFile;
    this.dynamicStyle = this.renderer.createElement('link');
    this.renderer.setAttribute(this.dynamicStyle, 'rel', 'stylesheet');
    this.renderer.setAttribute(this.dynamicStyle, 'type', 'text/css');
    this.renderer.setAttribute(this.dynamicStyle, 'href', './assets/styles/dynamicForm/' + tf)
    this.renderer.appendChild(this.document.head, this.dynamicStyle);
    this.showHtmlContent = true;
  }
  ngOnDestroy(): void {
    if (this.dynamicStyle) {
      this.renderer.removeChild(this.document.head, this.dynamicStyle)
    }
  }

  isFieldRequired(validators: any[]): boolean {
    if (!validators || validators.length === 0) {
      return false;
    }
    return validators.some(
      (validator) =>
        validator.validatorName === 'required' && validator.required === true
    );
  }

  getValidationErrors(control: IFormControl | IDynamicControl | ISubControl, parentControl: IFormControl | ISubControl | null = null, index: number | null = null,
    subControl: any | null = null,
    innerControl: any | null = null,
    innerSubControl: any | null = null,
    innerSubControlIndex: any | null = null
  ): string {
    let myFormControl: any;
    if (innerControl != null && innerSubControl != null && subControl == null) {
      myFormControl = parentControl != null && index != null ? ((((this.dynamicFormGroup.get(innerSubControl.name) as FormGroup)?.controls[parentControl.name] as FormArray)
        ?.controls[index] as FormGroup)?.controls[innerControl.name] as FormGroup).get(control.name) : this.dynamicFormGroup.get(innerSubControl.name);
    }
    else if (innerControl != null && innerSubControl != null) {
      myFormControl = parentControl != null && index != null ? ((((this.dynamicFormGroup.get(innerSubControl.name) as FormGroup)?.controls[parentControl.name] as FormGroup)
        .controls[subControl.name] as FormArray).controls[index] as FormGroup)
        .controls[innerControl.name].get(control.name) : this.dynamicFormGroup.get(innerSubControl.name);
    }
    else if (innerControl != null && innerSubControl == null && parentControl != null && index != null && innerSubControlIndex != null) {
      const formArray = this.dynamicFormGroup.get(parentControl.name) as FormArray;
      const memberGroup = formArray.at(index) as FormGroup;
      const memberGroupControlArray = memberGroup.get(control.name) as FormArray;
      const memberGroupInnerControlGroup = memberGroupControlArray.at(innerSubControlIndex) as FormGroup;
      myFormControl = memberGroupInnerControlGroup.get(innerControl.name);
      console.log(myFormControl);

    }
    else if (innerControl != null && parentControl != null && index != null && subControl == null) {
      myFormControl = (this.dynamicFormGroup.get(parentControl.name) as FormArray).controls[index].get(control.name)?.get(innerControl.name)
    }
    else if (subControl != null && index != null) {
      myFormControl = parentControl != null && index != null ? ((this.dynamicFormGroup.get(subControl.name) as FormGroup)?.controls[parentControl.name] as FormArray).controls[index].get(control.name)
        : this.dynamicFormGroup.get(control.name);
    }
    else if (subControl != null && parentControl != null && index == null) {
      myFormControl = ((this.dynamicFormGroup.get(subControl.name) as FormGroup)?.controls[parentControl.name] as FormGroup).get(control.name);
    }
    else {
      myFormControl = parentControl != null && index != null ? (this.dynamicFormGroup.get(parentControl.name) as FormArray).controls[index].get(control.name) : this.dynamicFormGroup.get(control.name)
    }
    let errorMessage = ''
    if (innerControl != null && parentControl != null && index != null && subControl == null) {
      if (innerControl.innerControls) {
        innerControl.innerControls.forEach((element: any) => {
          element.validators?.forEach((val: any) => {
            if (myFormControl?.hasError(val.validatorName as string)) {
              errorMessage = val.message as string
            }
          })
        });
      }
      else {
        innerControl.validators?.forEach((val: any) => {
          if (myFormControl?.hasError(val.validatorName as string)) {
            errorMessage = val.message as string
          }
        })
      }
    }
    else {
      control.validators?.forEach((val) => {
        if (myFormControl?.hasError(val.validatorName as string)) {
          if (control.name == 'insuredMembers' && val.validatorName == 'required') {
            if (this.dynamicFormGroup.get('planType')?.value == 'Multi Individual') {
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
    }
    return errorMessage;
  }

  getActiveValidationErrors(control: IFormControl | IDynamicControl | ISubControl, parentControl: any | ISubControl | null = null, index: any | null = null,
    innerControl: any | null = null,
    SubIndex: any | null = null
  ): string {
    // console.log('sukhadev1 ', control);
    // console.log('sukhadev2 ', parentControl);
    // console.log('sukhadev3 ', index);
    // console.log('sukhadev4 ', innerControl);
    // console.log('sukhadev5', SubIndex);
    let myFormControl: any;

    const parentArray = this.dynamicFormGroup.get(innerControl?.name) as FormArray;
    const parentArray1 = parentArray.controls[index] as FormGroup;
    const parentArray2 = parentArray1.controls[parentControl?.name] as FormArray;
    const parentArray3 = parentArray2.controls[SubIndex] as FormGroup;
    myFormControl = parentArray3.get(control.name)
    let errorMessage = ''

    control.validators?.forEach((val) => {
      if (myFormControl?.hasError(val.validatorName as string)) {
        if (control.name == 'insuredMembers' && val.validatorName == 'required') {
          if (this.dynamicFormGroup.get('planType')?.value == 'Multi Individual') {
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

  checkValidations(
    control: IFormControl | IDynamicControl,
    parentControl: IFormControl | IDynamicControl | ISubControl | null = null,
    index: number | null = null, subControl: any | null = null,
    innerControl: any | null = null,
    innerSubControl: any | null = null,
    innerSubControlIndex: number | null = null
  ): boolean {
    // if(control.name == 'previousPolicyDetails')
    // console.log(control, parentControl, index, subControl, innerControl, innerSubControl,innerSubControlIndex);
    let myControl: AbstractControl | null | undefined;
    if (innerControl != null && innerSubControl != null && subControl == null && parentControl != null && index != null) {
      const parentArray = this.dynamicFormGroup.get(control.name) as FormGroup;
      const parentArray1 = parentArray.controls[parentControl.name] as FormArray;
      const parentArray2 = parentArray1.controls[index] as FormGroup;
      const parentArray3 = parentArray2.controls[innerControl.name] as FormArray;
      myControl = parentArray3.get(innerSubControl.name);
    }
    else if (innerControl != null && innerSubControl != null && parentControl != null && index != null) {
      const parentArray = this.dynamicFormGroup.get(control.name) as FormGroup;
      const parentArray1 = parentArray.controls[parentControl.name] as FormGroup;
      const parentArray2 = parentArray1.controls[subControl.name] as FormArray;
      const parentArray3 = parentArray2.controls[index] as FormGroup;

      myControl = parentArray3.controls[innerControl.name].get(innerSubControl.name);
    }
    else if (innerControl != null && innerSubControl == null && parentControl != null && index != null && innerSubControlIndex != null) {
      const formArray = this.dynamicFormGroup.get(parentControl.name) as FormArray;
      const memberGroup = formArray.at(index) as FormGroup;
      const memberGroupControlArray = memberGroup.get(control.name) as FormArray;
      const memberGroupInnerControlGroup = memberGroupControlArray.at(innerSubControlIndex) as FormGroup;
      myControl = memberGroupInnerControlGroup.get(innerControl.name);

    }
    else if (innerControl != null && parentControl != null && index != null) {
      myControl = (this.dynamicFormGroup.get(parentControl.name) as FormArray).controls[index].get(control.name)?.get(innerControl.name)
    }
    else if (subControl != null && parentControl != null && index != null) {
      const parentArray = this.dynamicFormGroup.get(control.name) as FormGroup;
      const parentArray1 = parentArray.controls[parentControl.name] as FormArray;
      const parentArray2 = parentArray1.controls[index] as FormGroup;

      myControl = parentArray2.get(subControl.name);
    }
    else if (subControl != null && parentControl != null && index == null) {
      const parentArray = this.dynamicFormGroup.get(control.name) as FormGroup;
      const parentArray1 = parentArray.controls[parentControl.name] as FormGroup;

      myControl = parentArray1.get(subControl.name);
    }
    else if (parentControl != null && index != null) {
      const parentArray = this.dynamicFormGroup.get(parentControl.name) as FormArray;
      if (parentArray) {
        myControl = parentArray.controls[index].get(control.name);
      }
    } else {
      myControl = this.dynamicFormGroup.get(control.name);
    }

    if (myControl instanceof FormControl) {
      return myControl.invalid && myControl.touched;
    } else if (myControl instanceof FormGroup) {
      return myControl.invalid && !myControl.pristine;
    }

    return false;
  }

  checkActiveValidations(
    control: IFormControl | IDynamicControl,
    parentControl: any = null,
    index: any | null = null,
    innerControl: any | null = null,
    SubIndex: any | null = null
  ): boolean {
    let myControl: AbstractControl | null | undefined;
    const parentArray = this.dynamicFormGroup.get(innerControl?.name) as FormArray;
    const parentArray1 = parentArray.controls[index] as FormGroup;
    const parentArray2 = parentArray1.controls[parentControl?.name] as FormArray;
    const parentArray3 = parentArray2.controls[SubIndex] as FormGroup;
    myControl = parentArray3?.get(control.name);

    if (myControl instanceof FormControl) {
      return myControl.invalid && myControl.touched;
    } else if (myControl instanceof FormGroup) {
      return myControl.invalid && !myControl.pristine;
    }

    return false;
  }

  checkHospiCashValidations(
    control: IFormControl | IDynamicControl,
    parentControl: IFormControl | IDynamicControl | ISubControl,
    index: number, subControl: any | null = null,
    innerSubControlIndex: number
  ): boolean {

    let myControl: AbstractControl | null | undefined;
    const formArray = this.dynamicFormGroup.get(parentControl.name) as FormArray;
    const memberGroup = formArray.at(index) as FormGroup;
    const memberGroupControlArray = memberGroup.get(control.name) as FormArray;
    const memberGroupInnerControlGroup = memberGroupControlArray.at(innerSubControlIndex) as FormGroup;
    myControl = memberGroupInnerControlGroup.get(subControl.name);
    if (myControl) {
      return myControl.invalid && myControl.touched;
    }

    return false;
  }

  getHospiCashValidations(
    control: IFormControl | IDynamicControl,
    parentControl: IFormControl | IDynamicControl | ISubControl,
    index: number, subControl: any | null = null,
    innerSubControlIndex: number
  ): string {

    let errorMessage = ''
    let myControl: AbstractControl | null | undefined;
    const formArray = this.dynamicFormGroup.get(parentControl.name) as FormArray;
    const memberGroup = formArray.at(index) as FormGroup;
    const memberGroupControlArray = memberGroup.get(control.name) as FormArray;
    const memberGroupInnerControlGroup = memberGroupControlArray.at(innerSubControlIndex) as FormGroup;
    myControl = memberGroupInnerControlGroup.get(subControl.name);


    subControl.validators?.forEach((val: any) => {
      if (myControl?.hasError(val.validatorName as string)) {
        errorMessage = val.message as string
      }
    })
    return errorMessage;
  }

  onCheckboxSelect(controlName: string, event?: any) {
    const control = this.dynamicFormGroup.get(controlName);
    if (control) {
      control.markAsTouched();
      control.updateValueAndValidity();
    }
    switch (controlName) {
      case 'addressTitle1':
        this.getPermanentAddressDetails(event.target.checked);
        break;

      default:
        break;
    }
  }

  // hasAnyValue(control: IFormControl | IDynamicControl, parentControl: IFormControl | IDynamicControl | ISubControl | null = null, index: number | null = null,innerControl: any= null): boolean {
  //   return parentControl != null && index != null ? (this.dynamicFormGroup.get(parentControl.name) as FormArray).controls[index].get(control.name)?.value : this.dynamicFormGroup.get(control.name)?.value
  // }

  hasAnyValue(
    control: IFormControl | IDynamicControl,
    parentControl: IFormControl | IDynamicControl | ISubControl | null = null,
    index: number | null = null,
    innerControl: any = null,
    indexj: any = null,
    subControl: any = null
  ): boolean {
    if (parentControl != null && index != null) {

      const parentFormArray = this.dynamicFormGroup.get(parentControl.name) as FormArray;

      const childControl = parentFormArray.controls[index].get(control.name);

      // If innerControl is not null, check its value
      if (innerControl != null && indexj == null) {
        return !!childControl?.get(innerControl.name)?.value;
      }
      else if (innerControl != null && indexj != null) {

        return !!(childControl as FormArray)?.controls[indexj].get(innerControl.name)?.value;
      }

      return !!childControl?.value;
    }

    // For controls outside FormArray, check for innerControl if provided
    const mainControl = this.dynamicFormGroup.get(control.name);
    if (innerControl != null) {
      return !!mainControl?.get(innerControl.name)?.value;
    }

    return !!mainControl?.value;
  }

  hasInnerValue(control: any, parentControl: any | null = null, innerControl: any | null = null, index: any | null = null) {
    const formControl = parentControl != null && index != null ?
      ((this.dynamicFormGroup.get(control.name) as FormGroup)?.controls[parentControl.name] as FormArray).controls[index].get(innerControl.name)?.value
      : this.dynamicFormGroup.get(control.name);
    return formControl;
  }
  hasChronicValue(control: any, parentControl: any | null = null, innerControl: any | null = null, chronicControl: any | null = null, index: any | null = null) {
    const formControl = ((this.dynamicFormGroup.get(control.name) as FormGroup)?.get(parentControl.name)?.get(innerControl.name)?.value);
    return formControl;
  }
  hasSubValue(control: any, parentControl: any | null = null, innerControl: any | null = null, innerSubControl: any | null = null, index: any | null = null) {
    const formControl = parentControl != null && index != null ?
      (((this.dynamicFormGroup.get(control.name) as FormGroup)?.controls[parentControl.name] as FormGroup).controls[innerControl.name] as FormArray).controls[index].get(innerSubControl.name)?.value
      : this.dynamicFormGroup.get(control.name);
    return formControl;
  }
  hasInnerSubValue(control: any, parentControl: any | null = null, subControl: any | null = null, index: any | null = null, innerControl: any | null = null, innerSubControl: any | null = null) {
    const formControl = parentControl != null && index != null
      ? ((((this.dynamicFormGroup.get(control.name) as FormGroup)?.controls[parentControl.name] as FormGroup)
        .controls[subControl.name] as FormArray).controls[index] as FormGroup)
        .controls[innerControl.name].get(innerSubControl.name)
      : this.dynamicFormGroup.get(control.name);
    // formControl?.markAsTouched();
    return formControl ? formControl.value : null;
  }
  hasSubInnerValue(control: any, parentControl: any | null = null, subControl: any | null = null, index: any | null = null, indexj: any | null = null, innerControl: any | null = null, innerSubControl: any | null = null, benefitControl: any | null = null) {
    console.log("hasSubInnerValue", control, parentControl, subControl, index, innerControl, innerSubControl, benefitControl, this.dynamicFormGroup, subControl.coreControls[index].name);
    const formControl = parentControl != null && index != null
      ? ((((((this.dynamicFormGroup.get(control.name) as FormGroup)?.controls[parentControl.name] as FormGroup)
        .controls[subControl.name] as FormArray).controls[index] as FormGroup)
        .controls[subControl.coreControls[index].name] as FormArray)
        .controls[indexj] as FormGroup).get(benefitControl.name)
      : this.dynamicFormGroup.get(control.name);
    // formControl?.markAsTouched();
    return formControl ? formControl.value : null;
  }

  hasAnyActiveValue(control: any, subControl: any, index: any, parentControl: any, subIndex?: any) {
    const selectedValue = (((this.dynamicFormGroup.get(parentControl.name) as FormGroup)).controls[index - 1].get(subControl.name) as FormGroup).controls[subIndex].get(control.name)?.value
    return selectedValue ? selectedValue : null;
  }

  // triggerFileInput(controlName: string) {

  //   const fileInputControl = this.document.getElementById(controlName);
  //   fileInputControl?.click();
  // }

  // onFileSelected(inputName: string, event: any) {
  //   const file = event.target.files[0];

  //   const maxSizeInBytes = 3 * 1024 * 1024; // 3MB
  //   const allowedFileTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];
  //   const control = this.dynamicFormGroup.get(inputName);
  //   if (file) {
  //     // Clear previous errors
  //     control?.setErrors(null);

  //     // Validate file type
  //     if (!allowedFileTypes.includes(file.type)) {
  //       control?.setErrors({ fileType: true });
  //     }

  //     // Validate file size
  //     if (file.size > maxSizeInBytes) {
  //       control?.setErrors({ fileSize: true });
  //     }

  //     // If no errors, proceed to set the selected file
  //     if (!control?.errors) {
  //       this.selectedFile = file;
  //       control?.setValue(file.name);
  //     } else {
  //       control?.markAsTouched();
  //       this.selectedFile = null;
  //     }


  //   }
  // }

  // uploadSelectedDocument(): Promise<void> {
  //   return new Promise(async (resolve, reject) => {
  //     if (this.selectedButton) {
  //       try {
  //         const policyNum = this.proposalNum.replace(/-/g, "");
  //         const formData = new FormData();
  //         formData.append("Files", this.selectedFile);
  //         formData.append("UniqueNumber", policyNum);
  //         this.commonService.uploadDocument(formData).subscribe(
  //           async (res: any) => {
  //             if (res.isSuccess) {
  //               this.documentId = res.data.uploadResponse[0].globalId;

  //               try {
  //                 // Await the getFullQuoteViaOfflinePayment call to ensure completion before resolving
  //                 await this.getFullQuoteViaOfflinePayment();
  //                 resolve(); // Resolve the promise once everything completes
  //               } catch (error) {
  //                 console.error("Error in full quote generation:", error);
  //                 reject(error); // Reject the promise to prevent further flow
  //               }
  //             } else {
  //               const errorMessage = "Document upload failed.";
  //               console.error(errorMessage, res);
  //               this.toast.error({
  //                 detail: "Error",
  //                 summary: errorMessage,
  //                 duration: 3000,
  //               });
  //               reject(new Error(errorMessage));
  //             }

  //           },
  //           (err) => {
  //             console.error("Error during upload:", err);
  //             this.toast.error({
  //               detail: "Error",
  //               summary: err.message || "Document upload failed.",
  //               duration: 1500,
  //             });
  //             reject(err); // Reject the promise on upload error
  //           }
  //         );
  //       } catch (error) {
  //         console.error("Error preparing upload:", error);
  //         this.toast.error({
  //           detail: "Error",
  //           summary: "An unexpected error occurred while preparing the upload.",
  //           duration: 3000,
  //         });
  //         reject(error); // Reject the promise on preparation error
  //       }
  //     } else {
  //       this.toast.warning({
  //         detail: "Warning",
  //         summary: "Please select Payment Mode.",
  //         duration: 3000,
  //       });
  //     }
  //   });
  // }

  scrollToFirstInvalidField() {
    const findInvalidControlId = (controls: { [key: string]: any }): string | null => {
      for (const key in controls) {
        if (controls[key].invalid) {
          if (controls[key].controls) {
            const nestedInvalidId = findInvalidControlId(controls[key].controls);
            if (nestedInvalidId) return nestedInvalidId;
          } else {
            return key;
          }
        }
      }
      return null;
    };
    const firstInvalidControlName = findInvalidControlId(this.dynamicFormGroup.controls);
    if (firstInvalidControlName) {
      const firstInvalidElement = document.getElementById(firstInvalidControlName);
      if (firstInvalidElement) {
        firstInvalidElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstInvalidElement.focus();
      }
    }
  }

  uploadPolicyDocument() {
    const insurerControl = this.dynamicFormGroup.get('getInsurerDetails');
    if (this.selectedFile && insurerControl && insurerControl.value) {
      const formData = new FormData();
      formData.append('Files', this.selectedFile);
      formData.append('NameOfInsuranceCompany', insurerControl.value); // Dynamic value from the form control

      // this.spinner.show();

      this.yatraService.fetchPolicyDetailsFromFile(formData).subscribe({
        next: (response: any) => {
          this.toast.success({ detail: "Success", summary: response.message, duration: 3000 });
          this.spinner.hide();

          this.isPolicyDetailsFetch = true;

          if (response.data['insuredMemberDetails'].length > 0) {
            this.formData['insuredMemberDetails'] = response.data['insuredMemberDetails'];
            const insuredMembers: { [key: string]: boolean } = {};

            response.data['insuredMemberDetails'].forEach((member: any) => {
              insuredMembers[member.relation] = true;
            });

            this.formData['insuredMembers'] = insuredMembers;
          }

          Object.keys(response.data).forEach((key: string) => {
            this.dynamicFormGroup.get(key)?.setValue(response.data[key]);

            if (key === 'memberPolicyType') {
              this.form.formSections.forEach((section: any) => {
                const targetControl = section.formControls.find((formControl: any) => formControl.name === 'memberPolicyType');
                if (targetControl) {
                  this.handlePolicyTypeChange(targetControl, response.data['memberPolicyTypeChange']);
                }
              });
            }
          });

        },
        error: (error) => {
          this.spinner.hide();
          this.toast.warning({ detail: "Warning", summary: "Failed to fetch Policy Details", duration: 3000 });
          console.error('Error fetching Policy details:', error);
        }
      });
    } else {
      console.error('No file selected or insurer not chosen');
    }
  }


  toggleContent(index: number): void {
    this.expandedCardIndex = this.expandedCardIndex === index ? null : index;
  }

  // toggleHr(subControl: any): boolean {
  //   subControl.visible ! = subControl.visible;
  //   return subControl.visible
  // }

  isContentVisible(index: number): boolean {
    return this.expandedCardIndex === index;
  }

  cardContent(itemName: string): void {
    this.expandedItem = this.expandedItem === itemName ? '' : itemName;
    this.selectedItem = itemName;
  }

  selectTab(tabName: string) {
    this.activeTab = tabName;
    this.expandedItem = '';
  }

  addNavbar(index: number, value: any) {
    if (value.formName === 'Confirmation') {
      this.feedbackSubmit = false;
      this.impressedValues = false;
      this.feedBackMessage = false;
      this.rating = 0;
      this.feedbackImpressedValue = '';
    }
    this.setFormIndexValue(index);

    this.getFormDataFromFormSequence(this.formSequence[this.getFormIndexValue()].formId);
  }

  onPhoneNumberInputChange(event: any, control: any, subControl?: any, i?: any) {
    const input = event.target;
    let value = input.value.replace(/\D/g, '');
    if (value.length > 10) {
      value = value.slice(0, 10);
    }
    input.value = value;
    if (subControl) {
      this.dynamicFormGroup.get(`${control.name}.${i}.${subControl.name}`)?.setValue(value);
    } else {
      this.dynamicFormGroup.get(control.name)?.setValue(value);
    }
  }

  async callMethod(methodName: string, control: any, section?: any) {

    console.log(methodName);

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
  callMethodForOtherControls(event: any, method: string, control: IFormControl, otherControl: IFormControl) {
    const methodFunction = (this as any)[method] as Function;
    if (methodFunction && typeof methodFunction === 'function') {
      (this as any)[method](event, otherControl)
    } else {
      console.error(`Method ${method} not found`);
    }
  }

  getSalutation(control: any) {
    this.yatraService.getSalutation().subscribe({
      next: (res: any) => {
        control.options = res.Salutation;
      },
      error: (err) => {
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

  getAllProposerOccupation(control: any) {
    this.yatraService.getProposerOccupation().subscribe({
      next: (res: any) => {
        control.options = res.data;
      },
      error: (err: any) => {
        console.error(err);
      }
    });
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

  getAllInsureData(control: any) {
    // this.spinner.show();
    this.yatraService.getInsurerData().subscribe({
      next: (res: any) => {
        control.options = res.InsurerName;
        this.spinner.hide();
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  getIdentityProof(control: any) {
    this.yatraService.getIdentification().subscribe({
      next: (res: any) => {
        control.options = res.IdType;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  getNationality(control: any) {
    this.yatraService.getNationality().subscribe({
      next: (res: any) => {
        control.options = res.Nationality;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  getGstRegistrationStatus(control: any) {

    this.yatraService.getGstRegistrationStatus().subscribe({
      next: (res: any) => {
        control.options = res.Registration;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  getMaritalStatus(control: any) {
    this.yatraService.getMaritalStatus().subscribe({
      next: (res: any) => {
        control.options = res.MaritalStatus;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  getEducationType(control: any) {
    this.yatraService.getEducationType().subscribe({
      next: (res: any) => {
        control.options = res.EducationType;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  getNomineeRelationShip(control: any) {
    this.yatraService.getNomineeRelationship().subscribe({
      next: (res: any) => {
        control.options = res.data;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  getAllBankDetails(control: any) {
    if (control.options.length <= 0) {
      this.yatraService.getAllBankDetails().subscribe({
        next: (res: any) => {
          control.options = res.data;
        },
        error: (err) => {
          console.error(err);
        }
      });
    }
  }
  getBankCity(event: any, otherControl: any) {
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
        otherControl.options = [...res.data]; // Create a new array to trigger change detection
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  getBranchDetails(event: any, otherControl: any) {
    otherControl.value = "";
    otherControl.options = []; // Reset options to an empty array

    const data = JSON.parse(event.target.value);
    this.bankCity = data.id as string;

    const reqData = {
      "bankName": this.bankCode,
      "cityName": this.bankCity
    };

    this.yatraService.getBranchDetails(reqData).subscribe({
      next: (res: any) => {
        otherControl.options = [...res.data]; // Create a new array to trigger change detection
      },
      error: (err) => {
        console.error(err);
      }
    });
  }


  setIfscCode(event: any, otherControl: any) {
    const data = JSON.parse(event.target.value);
    this.dynamicFormGroup.get('ifscCode')?.setValue(data.id);
    this.dynamicFormGroup.get('micrCode')?.setValue(data.value);
    this.changeMainFormDependentControls(['pennyBtn'], true)
  }

  memberDetailsOption(control: any) {
    if (this.formData.insuredMemberDetails) {
      const selectedValue = this.formData.insuredMemberDetails;
      // control.options = this.encryptionService.decrypt(selectedValue as string).insuredMemberDetails;
      selectedValue.forEach((element: any) => {
        control.options.push({
          "name": element.relationshipType,
          "value": element.relationshipType
        });
      });
    }
  }
  getAllRelationship(control: any) {
    // this.spinner.show();
    this.yatraService.getRelationship().subscribe({
      next: (res: any) => {
        control.selectCheckboxOptions.forEach((element: any) => {
          const index = res.RelationShip.findIndex((relation: any) => relation.value === element.label);
          element.id = res.RelationShip[index].id;
        })
        this.spinner.hide();
      },
      error: (err) => {
        this.spinner.hide();
        console.error(err);
      }
    });
  }

  stringifyObject(obj: any): string {
    return JSON.stringify(obj);
  }

  isSequential(enteredNumber: string): boolean {
    const digits = enteredNumber.split('').map(Number);
    const allSame = digits.every(digit => digit === digits[0]);
    if (allSame) {
      return true;
    }

    let isAscending = true;
    let isDescending = true;

    for (let i = 0; i < digits.length - 1; i++) {
      if (digits[i + 1] - digits[i] !== 1) {
        isAscending = false;
      }
      if (digits[i + 1] - digits[i] !== -1) {
        isDescending = false;
      }
    }
    return isAscending || isDescending || allSame;
  }

  // getLabels(control: any) {
  //   let startIdx = control.indexOf('{{');
  //   let endIdx = control.indexOf('}}');
  //   let string: any;
  //   if (startIdx !== -1 && endIdx !== -1) {
  //     string = control.slice(startIdx + 2, endIdx).trim();
  //   }
  //   switch (string) {
  //     case 'actName':
  //       return control.replace("{{actName}}", this.formData?.accountNumber);
  //       break;
  //     case 'emailId':
  //       return control.replace("{{emailId}}", this.formData?.emailId);
  //       break;
  //     default:
  //       return control
  //       break;
  //   }
  // }

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
        return control; // Fallback if emailId is not available
      default:
        return control;
    }
  }
  // defaultSumInsured(control: any) {
  //   control.subControls.forEach((subControl: any) => {
  //     if (subControl.innerSubControls) {
  //       subControl.innerSubControls.forEach((innerSubControls: any) => {
  //         if (innerSubControls.coreControls && innerSubControls.name != "demoType") {
  //           innerSubControls.coreControls.forEach((coreControl: any) => {
  //             if (coreControl.name === "addOnSumInsured") {
  //               console.log(coreControl);
  //               let insuredMemberDetails = this.formData.insuredMemberDetails;
  //               let annualIncome: any;
  //               if (innerSubControls.name !== "Self") {
  //                 insuredMemberDetails.forEach((member: any) => {
  //                   if (member.relation === "Self") {
  //                     this.selfAnnualIncome = Number(member.annualIncome);
  //                   }
  //                 });
  //               }
  //               insuredMemberDetails.forEach((member: any) => {
  //                 if (member.relation == innerSubControls.name) {
  //                   if (member.annualIncome != "") {
  //                     annualIncome = Number(member.annualIncome);
  //                   }
  //                   else {
  //                     annualIncome = this.selfAnnualIncome
  //                   }
  //                 }
  //               });
  //               const requestBody = {
  //                 "coverType": control.name,
  //                 "planType": "P1",
  //                 "productId": (this.productId).toString() || "",
  //                 "agentCode": this.agentCode,
  //                 "annualIncome": annualIncome
  //               }
  //               this.yatraService.getSumInsuredList(requestBody).subscribe({
  //                 next: (res: any) => {
  //                   coreControl.options = res.data.siList
  //                   console.log("coreControl.options ", coreControl.options);

  //                 },
  //                 error: (err: any) => {
  //                   console.error(err);
  //                 }
  //               });
  //             }
  //           });
  //         }
  //       });
  //     }
  //   });
  // }
  getNatureOfWorkByOccupation(event:any,subControl:any,parentControl:any, index :any){
    const parsedValue = JSON.parse(event.target.value);
    const selectedControl = subControl;
      this.form.formSections.forEach((section: any) => {
        section.formControls.forEach((formControl: any) => {
          if (formControl.subControls) {
            formControl.subControls.forEach((subControl: any) => {
              if (subControl.innerSubControls) {
                subControl.innerSubControls.forEach((innerSubControls: any) => {
                  if (innerSubControls.coreControls && selectedControl.name == innerSubControls.name) {
                    innerSubControls.coreControls.forEach((coreControl: any) => {
                      if(parsedValue.name === 'Retired' && coreControl.name == "occupationRisk"){
                        coreControl.options =[{
                          "id": "1",
                          "value": "ND0410",
                          "name": "Retired"
                        }]
                      }else if (parsedValue.name === 'Student' && coreControl.name == "occupationRisk") {
                        coreControl.options = [{
                          "id": "2",
                          "value": "ND0277",
                          "name": "Student "
                        }]
                      } else if (parsedValue.name === 'Not Employed' && coreControl.name == "occupationRisk") {
                        coreControl.options = [{
                          "id": "6",
                          "value": "ND0306",
                          "name": "UnEmployed"
                        }]
                      } else if (parsedValue.name === 'HouseWife/Husband' && coreControl.name == "occupationRisk") {
                        coreControl.options = [{
                          "id": "3",
                          "value": "ND0209",
                          "name": "Housewife"
                        },
                        {
                          "id": "3",
                          "value": "ND0207",
                          "name": "Househusband"
                        }]
                      }else if(coreControl.name == "occupationRisk"){
                          this.yatraService.getNatureOfDuty().subscribe({
                            next: (res: any) => {
                              coreControl.options = res.data;
                            },
                            error: (err: any) => {
                              console.error(err);
                            }
                          });
                      }
                    });
                  }
                });
              }
            });
          }else if(formControl.dynamicControls){
            formControl.dynamicControls[index+1].forEach((dynamicControl:any)=>{
              if(parsedValue.name === 'Retired' && (dynamicControl.name == "productMemberNatureWork")){
                dynamicControl.options =[{
                  "id": "1",
                  "value": "ND0410",
                  "name": "Retired"
                }]
              }else if (parsedValue.name === 'Student' && dynamicControl.name == "productMemberNatureWork") {
                dynamicControl.options = [{
                  "id": "2",
                  "value": "ND0277",
                  "name": "Student "
                }]
              } else if (parsedValue.name === 'Not Employed' && dynamicControl.name == "productMemberNatureWork") {
                dynamicControl.options = [{
                  "id": "6",
                  "value": "ND0306",
                  "name": "UnEmployed"
                }]
              } else if (parsedValue.name === 'HouseWife/Husband' && dynamicControl.name == "productMemberNatureWork") {
                dynamicControl.options = [{
                  "id": "3",
                  "value": "ND0209",
                  "name": "Housewife"
                },
                {
                  "id": "3",
                  "value": "ND0207",
                  "name": "Househusband"
                }]
              }else if(dynamicControl.name == "productMemberNatureWork"){
                  this.yatraService.getNatureOfDuty().subscribe({
                    next: (res: any) => {
                      dynamicControl.options = res.data;
                    },
                    error: (err: any) => {
                      console.error(err);
                    }
                  });
              }
            })
          }
        });
      });              
}

  onInputChange(event: any, control: any, parentControl: any = null, index: any = null, subControl: any = null, innerControl: any = null, indexj: any = null, benefitControl: any = null) {
    this.changesMade = true;
    let eventValue = typeof event == 'boolean' ? event : event.target.value;
    if (control.name == 'totalPremium') {
      this.dynamicFormGroup.get('totalPremium')?.setValue(this.tenureAmount[this.selectedIndex]);
    }

    if (control.name == 'agentId') {
      const isValidOption = control.options.some((opt: any) => opt.value === eventValue);
      console.log(isValidOption)

      if (!isValidOption) {
        this.dynamicFormGroup.get('agentId')?.setErrors({ invalidOption: true });
        this.toast.warning({
          detail: "Warning",
          summary: "Invalid Agent ID selected. Please choose from the given options.",
          duration: 3000
        });
        this.dynamicFormGroup.get(control.name)?.setValue('');
      }
    }

    if (control.name == 'previousPolicyDetails') {
      this.changeRecalculate(true);
    }
    if (control.name == 'employeeId') {
      this.form.formSections.forEach((section: any) => {
        section.formControls.forEach((controls: any) => {
          if (controls.name == "employeeCalculate") {
            controls.disabled = false;
          }
        });
      });
    }

    if (control.name == 'affiliateEmployeeId') {
      this.form.formSections.forEach((section: any) => {
        section.formControls.forEach((controls: any) => {
          if (controls.name == "employeeAffiliateCalculate") {
            controls.disabled = false;
          }
        });
      });
    }

    if (control.name == "portingABHIPolicy") {
      const selectedValue = (((this.dynamicFormGroup.get(subControl.name) as FormGroup)).controls[index - 1].get(parentControl.name) as FormGroup).controls[indexj].get(control.name)?.value;
      if (selectedValue == 'Y') {
        this.toast.error({ detail: "Error", summary: 'Port will not be allowed for the proposal.', duration: 3000 });
        this.form.formSections.forEach((section: any) => {
          section.formControls.forEach((controls: any) => {
            if (controls.name == "next") {
              controls.visible = false;
            }
          });
        });
      } else {
        this.form.formSections.forEach((section: any) => {
          section.formControls.forEach((controls: any) => {
            if (controls.name == "next") {
              controls.visible = true;
            }
          });
        });
      }

      // if (selectedValue == 'Y') {
      //   this.toast.error({ detail: "Error", summary: 'Port will not be allowed for the proposal.', duration: 3000 });
      // } else {
      //   if (parseInt(eventValue) < 1000000) {
      //     const selectedValue = (((this.dynamicFormGroup.get(subControl.name) as FormGroup)).controls[index - 1].get(parentControl.name) as FormGroup).controls[indexj].get(control.name) as FormControl;
      //     selectedValue.setValue(null);
      //     selectedValue.setErrors({ required: true });
      //     this.toast.error({ detail: "Error", summary: 'Sum insured should not be less than 1000000', duration: 3000 });
      //   } else {
      //     this.toast.success({ detail: "Success", summary: 'Details saved successfully', duration: 3000 });
      //   }
      // }
    }
    if (this.formData.productName === 'Active Secure' && control.name === 'addOnDetails') {
      if (innerControl.name != "memberCheckbox") {
        this.parsedValue = JSON.parse(event.target.value);
      }
      const selectedControl = subControl;
      this.form.formSections.forEach((section: any) => {
        if (section.sectionTitle === "Optional Covers") {
          section.formControls.forEach((formControl: any) => {
            if (formControl.subControls && parentControl.name == formControl.name) {
              formControl.subControls.forEach((subControl: any) => {
                if (subControl.innerSubControls) {
                  subControl.innerSubControls.forEach((innerSubControls: any) => {
                    if (innerSubControls.coreControls && selectedControl.name == innerSubControls.name) {
                      innerSubControls.coreControls.forEach((coreControl: any) => {
                       if (innerControl.name == "addOnSumInsured") {
                          if (selectedControl.name == 'Self') {
                            this.selfCoverSumInsured = Number(event.target.value)
                          }
                        } else if (innerControl.name == "occupation") {
                          if (selectedControl.name != 'Self') {
                            this.selectedInnerControl = event.target.value
                          }
                        }
                        else if (innerControl.name === 'plan' && coreControl.name === "addOnSumInsured") {
                          let insuredMemberDetails = this.formData.insuredMemberDetails;
                          let annualIncome: any;
                          if (selectedControl.name !== "Self") {
                            insuredMemberDetails.forEach((member: any) => {
                              if (member.relation === "Self") {
                                this.selfAnnualIncome = Number(member.annualIncome);
                              }
                            });
                          }
                          insuredMemberDetails.forEach((member: any) => {
                            if (member.relation == selectedControl.name) {
                              if (member.annualIncome != "") {
                                annualIncome = Number(member.annualIncome);
                              }
                              else {
                                annualIncome = this.selfAnnualIncome
                              }
                            }
                          });
                          const requestBody = {
                            "coverType": parentControl.name || "",
                            "planType": JSON.parse(event.target.value).name || "",
                            "productId": (this.productId).toString() || "",
                            "agentCode": this.agentCode,
                            "annualIncome": annualIncome || 0
                          }
                          this.yatraService.getSumInsuredList(requestBody).subscribe({
                            next: (res: any) => {
                              if (selectedControl.name == 'Self') {
                                coreControl.options = res.data.siList;
                              }
                              else if (selectedControl.name != 'Self') {
                                insuredMemberDetails.forEach((member: any) => {
                                  if (member.relation == selectedControl.name) {
                                    if (member.annualIncome != "") {   //earning                            
                                      const memberAnnualIncome = Number(member.annualIncome)
                                      const occupationValue = this.selectedInnerControl ? JSON.parse(this.selectedInnerControl).name : ''
                                      if (occupationValue == 'Self Employed') {
                                        console.log("occupation value", occupationValue, "member anuual income", memberAnnualIncome);
                                        const filteredSiList = res.data.siList.filter(
                                          (item: any) =>
                                            item.value <= 10000000 ||
                                            (item.value > 10000000 && item.value <= memberAnnualIncome * 20)
                                        );
                                        console.log("Filtered siList for Self Employed:", filteredSiList);
                                        coreControl.options = filteredSiList;
                                      }
                                      if (this.selfCoverSumInsured && (occupationValue != 'Self Employed' || occupationValue == '')) {
                                        let maxLimit = 0;
                                        switch (parentControl.name) {
                                          case 'accident':
                                            switch (selectedControl.name) {
                                              case 'Spouse':
                                                maxLimit = Math.min(this.selfCoverSumInsured, 3000000);
                                                break;
                                              default:
                                                maxLimit = Math.min(this.selfCoverSumInsured, 1500000);
                                                break;
                                            }
                                            break;
                                          default:
                                            maxLimit = Math.min(this.selfCoverSumInsured);
                                            break;
                                        }
                                        const filteredSiList = res.data.siList.filter((item: any) => item.value <= maxLimit);
                                        console.log("Filtered siList for other occupation in earning case:", filteredSiList);
                                        coreControl.options = filteredSiList;
                                      }
                                      else {
                                        coreControl.options = res.data.siList;
                                      }
                                    }
                                    else {  //non earning
                                      if (this.selfCoverSumInsured) {
                                        let maxLimit = 0;
                                        console.log("relation", selectedControl.name);
                                        console.log("parentcontrol name", parentControl.name);
                                        switch (parentControl.name) {
                                          case 'accident':
                                            switch (true) {
                                              case selectedControl.name.includes('Son'):
                                              case selectedControl.name.includes('Daughter'):
                                                maxLimit = Math.min(this.selfCoverSumInsured, 1500000);
                                                break;
                                              default:
                                                maxLimit = Math.min(this.selfCoverSumInsured, 3000000);
                                                break;
                                            }
                                            break;
                                          case 'criticalIllness':
                                            switch (true) {
                                              case selectedControl.name == 'Spouse':
                                                maxLimit = Math.min(this.selfCoverSumInsured, 3000000);
                                                break;
                                              case selectedControl.name.includes('Son'):
                                              case selectedControl.name.includes('Daughter'):
                                                maxLimit = Math.min(this.selfCoverSumInsured, 1500000);
                                                break;
                                              default:
                                                maxLimit = Math.min(this.selfCoverSumInsured, 1000000);
                                                break;
                                            }
                                            break;
                                          case 'cancerSecure':
                                            switch (true) {
                                              case selectedControl.name == 'Spouse':
                                                maxLimit = Math.min(this.selfCoverSumInsured, 3000000);
                                                break;
                                              case selectedControl.name.includes('Son'):
                                              case selectedControl.name.includes('Daughter'):
                                                maxLimit = Math.min(this.selfCoverSumInsured, 1500000);
                                                break;
                                              default:
                                                maxLimit = Math.min(this.selfCoverSumInsured, 1000000);
                                                break;
                                            }
                                            break;
                                        }
                                        const filteredSiList = res.data.siList.filter((item: any) => item.value <= maxLimit);
                                        console.log("Filtered siList: in non earning case", filteredSiList);
                                        coreControl.options = filteredSiList;
                                      } else {
                                        console.log("self sum insured is mandatory if member is non earning", this.selfCoverSumInsured);
                                      }
                                    }
                                  }
                                });
                              }
                            },
                            error: (err: any) => {
                              console.error(err);
                            }
                          });
                        }else if(innerControl.name == 'weeklyCashLimit' && coreControl.name === "addOnSumInsured"){
                          let sumInsured= Number(event.target.value)*100                     
                          const parentGroup = this.dynamicFormGroup.get(formControl.name) as FormGroup;
                          const controlGroup = parentGroup?.controls[control.name] as FormGroup;
                          if (innerSubControls.name !== "demoType" && innerSubControls.name !== "doneButton") {
                            const innerSubGroup = controlGroup?.controls[innerSubControls.name] as FormArray;
                            const targetFormGroup = innerSubGroup?.controls[index+1] as FormGroup;
                            const coreControls = targetFormGroup?.controls[coreControl.name].setValue(sumInsured);
                          }
                        }
                      });
                    }
                  });
                }
              });
            }
          });
        }
      });
    }
    if (control.name == 'physicalcopy' && control.type == 'radio') {
      const selectedValue = this.dynamicFormGroup.get(control.name)?.value;
      this.form.formSections.forEach((section: any) => {
        section.formControls.forEach((control: any) => {
          if (control.name == 'decl2') {
            if (selectedValue === 'Y') {
              this.dynamicFormGroup.get('decl2')?.setValue(false);
            } else if (selectedValue === 'N') {
              this.dynamicFormGroup.get('decl2')?.setValue(true);
            }
          }
        })
      })
    }
    if (control.name == 'confAccountNumber') {
      if (this.dynamicFormGroup.get('confAccountNumber')?.value != this.dynamicFormGroup.get('accountNumber')?.value) {
        this.toast.error({ detail: "Error", summary: 'AccountNumber and Confirm confAccountNumber should be matched', duration: 3000 });
        const idNumberControl = this.dynamicFormGroup.get('confAccountNumber');
        idNumberControl?.setValidators([
          Validators.required
        ]);
        idNumberControl?.setValue('');
        idNumberControl?.setErrors({ required: true });
        idNumberControl?.updateValueAndValidity();
      }

    }
    if (control.name == 'correspondentPincode') {
      this.getCityStateByPinByCorressponding();
    }

    if (control.name == 'hospiCashCoverDetails') {
      console.log(subControl, event.target.checked, this.activeMemberTabIndex);

      if (subControl != null && subControl.name == 'memberCover') {
        if ((this.familyGroup == '' || subControl.group == this.familyGroup)) {
          if (event.target.checked) {
            this.familyGroup = subControl.group;
            this.selectedFamilyMembers.push(subControl.label);
            this.hospiCashSelected = true;
            this.hospiCashTab = this.activeMemberTabIndex;
          }
          else {
            const labelIndex = this.selectedFamilyMembers.indexOf(subControl.label);
            if (labelIndex > -1) {
              this.selectedFamilyMembers.splice(labelIndex, 1);
            }

            // Reset the familyGroup if no members are selected
            if (this.selectedFamilyMembers.length === 0) {
              this.familyGroup = '';
              this.hospiCashSelected = false;
              this.hospiCashTab = -1;
            }
          }
        }
        else {
          const checkbox = event.target as HTMLInputElement;
          checkbox.checked = false;
          const formArray = this.dynamicFormGroup.get(parentControl.name) as FormArray;
          const memberGroup = formArray.at(index) as FormGroup;
          const memberGroupControlArray = memberGroup.get(control.name) as FormArray;
          const memberGroupInnerControlGroup = memberGroupControlArray.at(indexj) as FormGroup;
          const memberGroupInnerControl = memberGroupInnerControlGroup.get(subControl.name);
          memberGroupInnerControl?.setValue(false);




          // const formControl = formGroup.get(subControl.name) as FormControl;
          // formControl.setValue(false); // Set the FormControl value to false
          return;
        }
        this.changeHospiCoverDependentControls(subControl.dependentControls, event.target.checked, control.name, parentControl.name, index, subControl, indexj);
        // this.removeOrAddControlsforOtherMembers(event.target.checked,control.name,parentControl.name,index,subControl,indexj)
      }

      if (subControl != null && subControl.name == 'hospiCashCoverDOB') {
        console.log(event.target.value, event.target.value.length);
        if (event.target.value.length === 10) {
          // Validate the date format (YYYY-MM-DD)
          const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
          if (dateRegex.test(event.target.value)) {
            const enteredDate = new Date(event.target.value);

            // Ensure the year, month, and day are valid
            if (
              enteredDate.getFullYear() > 1900 &&
              enteredDate.getMonth() >= 0 &&
              enteredDate.getDate() > 0
            ) {
              const familyMemberAge = this.calculateAge(event.target.value);
              console.log(familyMemberAge);

              const formArray = this.dynamicFormGroup.get(parentControl.name) as FormArray;
              const memberGroup = formArray.at(index) as FormGroup;
              const memberGroupControlArray = memberGroup.get(control.name) as FormArray;
              const memberGroupInnerControlGroup = memberGroupControlArray.at(indexj) as FormGroup;
              const memberGroupInnerControl = memberGroupInnerControlGroup.get('hospiCashCoverAge');
              memberGroupInnerControl?.setValue(familyMemberAge);
            }
          }
        }


      }
    }
    if (control.name == 'abhaMailId') {
      if (this.enableABHAConcent()) {
        this.changeMainFormDependentControls(control.dependentControls, true, control.name, parentControl.name, index)
      } else {
        this.changeMainFormDependentControls(control.dependentControls, false, control.name, parentControl.name, index)

      }
    }

    if (control.onChangeMethod) {

      if (control.type === 'radio') {
        let selectedValue = '';
        if (parentControl == null)
          selectedValue = this.dynamicFormGroup.get(control.name)?.value;
        else if (parentControl != null && index != null) {
          if (subControl == null && innerControl != null) {
            selectedValue = (this.dynamicFormGroup.get(parentControl.name) as FormArray)?.controls[index - 1].get(control.name)?.get(innerControl.name)?.value;
          }
          else
            selectedValue = (this.dynamicFormGroup.get(parentControl.name) as FormArray)?.controls[index - 1].get(control.name)?.value
        }

        eventValue = selectedValue === 'yes' || selectedValue === 'Y' ? true : false;

        let selectedOption;
        // Find the selected option by value
        if (innerControl != null) {
          selectedOption = innerControl.radioOptions.find((option: any) => option.value === selectedValue);
        }
        else {
          selectedOption = control.radioOptions.find((option: any) => option.value === selectedValue);
        }

        // Check if the control or the selected option has dependentControls
        const dependent = control.dependentControls
          ? control.dependentControls
          : selectedOption?.dependentControls ?? control;

        if (parentControl != null && index != null) {
          this.resolveMethod(control.onChangeMethod, dependent, eventValue, control.name, parentControl.name, index);
        }
        else {
          // Call the resolveMethod with the found dependent controls
          this.resolveMethod(control.onChangeMethod, dependent, eventValue);
        }
      }
      else if (control.type === 'select') {
        const selectedValue = this.dynamicFormGroup.get(control.name)?.value;
        if (control.dependentControls) {
          this.resolveMethod(control.onChangeMethod, control, eventValue);
        }
        else if (control.onChangeMethod == 'setDeductibleAmount') {
          this.resolveMethod(control.onChangeMethod, control, parentControl, index);
        }
        else if (control.onChangeMethod == 'changeMainFormDependentControls') {
          if (!control.dependentControls) {
            const selectedOption = control.options.find((option: any) => option.value === JSON.parse(selectedValue).value);
            this.resolveMethod(control.onChangeMethod, selectedOption.dependentControls)
          }
        }
        else if (control.onChangeMethod == 'changeChronicCondition') {
          this.changeChronicCondition(selectedValue, control);
        }else if(control.onChangeMethod == 'getNatureOfWorkByOccupation'){
          this.resolveMethod(control.onChangeMethod, event,control, parentControl, index);
        }
        else {
          eventValue = selectedValue === 'Others' ? true : false;
          const selectedOption = control.options.find((option: any) => option.value === selectedValue);
          const dependent = control.dependentControls
            ? control.dependentControls
            : selectedOption?.dependentControls ?? control;
          this.resolveMethod(control.onChangeMethod, selectedOption?.dependentControls, eventValue);
        }
      } else {
        this.resolveMethod(control.onChangeMethod, control, eventValue);
      }
    }
    // else if (innerControl != null && innerControl.onChangeMethod) {
    //   if (innerControl.type === 'radio') {
    //     console.log(this.dynamicFormGroup);
    //     let selectedValue = '';
    //     if (parentControl == null)
    //       selectedValue = this.dynamicFormGroup.get(control.name)?.value;
    //     else if (parentControl != null && index != null) {
    //       if (subControl == null && innerControl != null) {
    //         selectedValue = (this.dynamicFormGroup.get(parentControl.name) as FormArray)?.controls[index - 1].get(control.name)?.get(innerControl.name)?.value;
    //       }
    //       else
    //         selectedValue = (this.dynamicFormGroup.get(parentControl.name) as FormArray)?.controls[index - 1].get(control.name)?.value
    //     }
    //     console.log(selectedValue);

    //     eventValue = selectedValue === 'yes' || selectedValue === 'Y' ? true : false;

    //     let selectedOption;
    //     // Find the selected option by value
    //     if (innerControl != null) {
    //       selectedOption = innerControl.radioOptions.find((option: any) => option.value === selectedValue);
    //     }
    //     else {
    //       selectedOption = control.radioOptions.find((option: any) => option.value === selectedValue);
    //     }

    //     // Check if the control or the selected option has dependentControls
    //     const dependent = control.dependentControls
    //       ? control.dependentControls
    //       : selectedOption?.dependentControls ?? control;

    //     console.log(dependent);


    //     if (parentControl != null && index != null) {
    //       this.resolveMethod(innerControl.onChangeMethod, dependent, eventValue, control.name, parentControl.name, index, innerControl.name);
    //     }
    //     else {
    //       // Call the resolveMethod with the found dependent controls
    //       this.resolveMethod(innerControl.onChangeMethod, dependent, eventValue);
    //     }
    //   }
    // }
    if (parentControl != null && parentControl.onChangeMethod) {
      this.resolveMethod(parentControl.onChangeMethod);
    }
    if (innerControl != null && innerControl.onChangeMethod) {
      if (innerControl.onChangeMethod == 'changeHospiCoverDependentControls') {
        if (innerControl.type === 'radio') {
          console.log(this.dynamicFormGroup);
          let selectedValue = '';
          if (parentControl == null)
            selectedValue = this.dynamicFormGroup.get(control.name)?.value;
          else if (parentControl != null && index != null) {
            if (subControl == null && innerControl != null && indexj != null) {
              const parentArray = this.dynamicFormGroup.get(parentControl.name) as FormArray;
              if (parentArray && parentArray.controls[index]) {
                const childArray = parentArray.controls[index].get(control.name) as FormArray;
                if (childArray && childArray.controls[indexj]) {
                  selectedValue = childArray.controls[indexj].get(innerControl.name)?.value;
                }
              }

              //  ((this.dynamicFormGroup.get(parentControl.name) as FormArray)?.controls[index - 1].get(control.name) ? as FormArray).controls[indexj].get(innerControl.name)?.value;
            }
            else
              selectedValue = (this.dynamicFormGroup.get(parentControl.name) as FormArray)?.controls[index - 1].get(control.name)?.value
          }
          console.log(selectedValue);

          eventValue = selectedValue === 'yes' || selectedValue === 'Y' ? true : false;

          let selectedOption;
          // Find the selected option by value
          if (innerControl != null) {
            selectedOption = innerControl.radioOptions.find((option: any) => option.value === selectedValue);
          }
          else {
            selectedOption = control.radioOptions.find((option: any) => option.value === selectedValue);
          }

          // Check if the control or the selected option has dependentControls
          const dependent = control.dependentControls
            ? control.dependentControls
            : selectedOption?.dependentControls ?? control;

          console.log(dependent);


          if (parentControl != null && index != null) {
            this.resolveMethod(innerControl.onChangeMethod, dependent, eventValue, control.name, parentControl.name, index, innerControl.name, indexj);
          }
        }
      }else if(innerControl.onChangeMethod == 'getNatureOfWorkByOccupation'){
        this.resolveMethod(innerControl.onChangeMethod, event, subControl);
      }
      else {
        this.resolveMethod(innerControl.onChangeMethod, event, innerControl, control, parentControl, index, indexj, subControl);
      }
    }

    if (parentControl == null && control.name == 'ifscCode') {
      const ifscCodeDetails = this.dynamicFormGroup.get('ifscCode')?.value || '';
      if (!ifscCodeDetails) {
        // Clear the bankName and micrCode fields
        this.dynamicFormGroup.get('bankName')?.setValue('');
        this.dynamicFormGroup.get('micrCode')?.setValue('');
        return; // Exit the function
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
                      if (formControl.name == "bankName" && formControl.onChangeMethod) {
                        this.dynamicFormGroup.get('bankName')?.setValue(JSON.stringify(nobj) || '');
                      } else if (formControl.name == "bankName") {
                        this.dynamicFormGroup.get('bankName')?.setValue(response.data.bankName || '');
                      }
                    });
                  });
                  this.dynamicFormGroup.get('micrCode')?.setValue(response.data.micrCode || '');

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

                        if (control.onChangeMethod != null && "bankCity" != null) {
                          this.form.formSections.forEach((section: any) => {
                            section.formControls.forEach((formControl: any) => {
                              if (formControl.name == "bankCity") {
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
                        this.dynamicFormGroup.get('bankCity')?.setValue(JSON.stringify(cobj) || '');
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
                            if (control.onChangeMethod != null && "bankBranch" != null) {
                              this.form.formSections.forEach((section: any) => {
                                section.formControls.forEach((formControl: any) => {
                                  if (formControl.name == "bankBranch") {
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
                            this.dynamicFormGroup.get('bankBranch')?.setValue(JSON.stringify(branchObj) || '');
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


    if ((parentControl !== null && parentControl.type == 'combinedCheckbox')) {
      if (control.type === 'select') {
        this.callMethod(parentControl.methodName, control)
      }
      else {
        if (innerControl != null && innerControl.dependentControls) {
          const checkboxChecked = typeof event == 'boolean' ? event : event.target.checked;
          console.log(checkboxChecked, typeof event);

          console.log(innerControl, checkboxChecked, control.name, parentControl.name, index, innerControl.name);

          this.changeMainFormDependentControls(innerControl.dependentControls, checkboxChecked, control.name, parentControl.name, index, innerControl.name);
        }
        this.changeOverLayDone(control, parentControl, false);
      }
    }

    if (control.type == 'date' && control.dependentControls != null) {
      const dob = event.target.value;


      const dobArray = dob.split('-'); // [YYYY, MM, DD]
      const formattedDOB = `${dobArray[2]}/${dobArray[1]}/${dobArray[0]}`; // Convert to dd/MM/yyyy

      const year = parseInt(dobArray[0]);


      const currentYear = new Date().getFullYear();
      const [years, month, day] = dob.split('-').map(Number);
      const inputDate = new Date(`${years}-${month}-${day}`);
      const minDate = new Date('1800-01-01');
      const currentDate = new Date();

      // Validate year after the full date is entered
      if ((year < 1800 || inputDate > currentDate) && year.toString().length === 4) {
        // Invalid year: Show error and reset age control
        this.toast.error({
          detail: 'Error',
          summary: 'Invalid Year: Please enter a valid year between 1800 and the current year',
          duration: 3000
        });
        // Clear age control value if DOB is invalid
        if (parentControl != null && index != null) {
          const ageControl = this.dynamicFormGroup.get(parentControl.name);
          if (ageControl) {
            ageControl.value[index][control.dependentControls[0]] = "";
            (ageControl as FormArray).controls[index].get(control.dependentControls[0])?.markAsTouched();
            this.dynamicFormGroup.get(parentControl.name)?.patchValue(ageControl.value);
          }
        } else {
          const ageControl = this.dynamicFormGroup.get(control.dependentControls[0]);
          if (ageControl) {
            ageControl.setValue("");
            ageControl.markAsTouched();
          }
        }
        return; // Exit since the year is invalid
      }
      else if (year.toString().length === 4) {
        // Valid year: Proceed with age calculation and form patching if DOB is valid
        if (parentControl != null && index != null) {
          const ageControl = this.dynamicFormGroup.get(parentControl.name);
          if (ageControl) {
            ageControl.value[index][control.dependentControls[0]] = this.calculateAge(dob);
            (ageControl as FormArray).controls[index].get(control.dependentControls[0])?.markAsTouched();
            this.dynamicFormGroup.get(parentControl.name)?.patchValue(ageControl.value);
          }
        } else {
          const ageControl = this.dynamicFormGroup.get(control.dependentControls[0]);
          if (dob && ageControl) {
            ageControl.markAsTouched();
            const age = this.calculateAge(dob);
            ageControl.setValue(age);
          }
        }
      }
    }

    if (parentControl == null && control.name == 'zoneValue') {
      const selectedZone = control.options.find((option: any) =>
        option.value == this.dynamicFormGroup.get(control.name)?.value
      );
      if (selectedZone) {
        this.dynamicFormGroup.get('zone')?.setValue(selectedZone.name);
      }
    } else if (parentControl != null && parentControl.dynamicControls) {
      if (parentControl.dynamicControls.length > index + 1) {
        parentControl.dynamicControls[index + 1].forEach((dynamicControl: IDynamicControl) => {
          if (dynamicControl.name == 'zoneValue' && dynamicControl.options) {
            const selectedZone = dynamicControl.options.find((option: any) =>
              option.value == (this.dynamicFormGroup.get(parentControl.name) as FormArray).controls[index].get('zoneValue')?.value
            );
            if (selectedZone) {
              (this.dynamicFormGroup.get(parentControl.name) as FormArray).controls[index].get('zone')?.setValue(selectedZone.name);
            }
          }
        });

        if (parentControl.type == 'details') {
          this.changeRecalculate(true);
        }
      }
    }


    if (parentControl == null && control.name == 'proposerPincode') {
      const pinCodeLength = this.dynamicFormGroup.get('proposerPincode')?.value.toString().length || 0;
      if (pinCodeLength === 6) {
        const reqData = {
          "pincode": event.target.value,
          agentcode: this.agentCode,
          productId: this.productId.toString()
        }
        console.log(reqData);

        this.commonService.getPinCodeByCity(reqData).subscribe({
          next: (res) => {
            if (res.isSuccess && res.data) {
              // Update city and state fields
              this.dynamicFormGroup.get('city')?.setValue(res.data.city || '');
              this.dynamicFormGroup.get('state')?.setValue(res.data.state || '');

              const zoneControl = this.dynamicFormGroup.get('zone');
              const zoneControlValue = this.dynamicFormGroup.get('zoneValue');
              if (zoneControl) {
                zoneControl.setValue(res.data.zone || '');
              }
              // zoneControl.enable();
              if (zoneControlValue) {
                zoneControlValue.setValue(res.data.zoneValue);
                this.form.formSections.forEach((section: any) => {
                  section.formControls.forEach((control: any) => {
                    if (control.name === 'zoneValue') {
                      control.options = res.data.upgradableZones;
                      // .forEach((zoneOption: any) => {
                      //   control.options.push({
                      //     name: zoneOption.zone,
                      //     value: zoneOption.zoneCode
                      //   });
                      // });

                      // control.visible = true;
                    }
                  });
                });
              }

              const sumInsuredControl = this.dynamicFormGroup.get('sumInsured');
              if (sumInsuredControl) {
                const sumInsuredList = res.data.sumInsuredList || [];
                sumInsuredControl.setValue(''); // Reset current value
                this.form.formSections.forEach((section: any) => {
                  section.formControls.forEach((control: any) => {
                    if (control.name === 'sumInsured') {
                      control.options = sumInsuredList.map((sumInsured: any) => ({
                        name: sumInsured.name,
                        value: sumInsured.value,
                      }));
                      console.log(control.options);
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
    else if (parentControl != null && parentControl.dynamicControls) {
      // parentControl.dynamicControls.forEach((dynamicControls: IDynamicControl[]) => {
      parentControl.dynamicControls[index + 1].forEach((dynamicControl: IDynamicControl) => {
        if (dynamicControl.name == 'pincode' && dynamicControl.name == control.name) {
          const reqdata = {
            "pincode": event.target.value,
            agentcode: this.agentCode,
            productId: this.productId.toString()
          }
          console.log(reqdata);
          // this.spinner.show();
          this.commonService.getPinCodeByCity(reqdata).subscribe({
            next: (res: any) => {
              if (res.isSuccess && res.data) {

                if (res.data.upgradableZones.length > 0) {
                  const zoneOptions = res.data.upgradableZones;
                  parentControl.dynamicControls[index + 1].forEach((dynamicControl: IDynamicControl) => {
                    if (dynamicControl.name == 'zoneValue') {
                      dynamicControl.options = zoneOptions;
                    }
                  });
                  (this.dynamicFormGroup.get(parentControl.name) as FormArray).controls[index].get('upgradableZones')?.setValue(zoneOptions);
                }

                const sumInsuredList = res.data.sumInsuredList;
                parentControl.dynamicControls[index + 1].forEach((dynamicControl: IDynamicControl) => {
                  if (dynamicControl.name === 'sumInsured') {
                    dynamicControl.options = sumInsuredList.map((item: any) => ({
                      name: item.name,
                      value: item.value,
                    }));
                  }
                });
                (this.dynamicFormGroup.get(parentControl.name) as FormArray).controls[index].get('upgradableSumInsured')?.setValue(sumInsuredList);
                // parentControl.dynamicControls[index + 1].forEach((dynamicControl: IDynamicControl) => {
                //   if (dynamicControl.name == 'sumInsured') {
                //     dynamicControl.options = sumInsuredList.map((item: any) => ({
                //       name: item.name,
                //       value: item.value,
                //     }));
                //   }
                // });


                (this.dynamicFormGroup.get(parentControl.name) as FormArray).controls[index].get('zoneValue')?.setValue(res.data.zoneValue);
                (this.dynamicFormGroup.get(parentControl.name) as FormArray).controls[index].get('zone')?.setValue(res.data.zone);
                (this.dynamicFormGroup.get(parentControl.name) as FormArray).controls[index].get('city')?.setValue(res.data.city);
                (this.dynamicFormGroup.get(parentControl.name) as FormArray).controls[index].get('state')?.setValue(res.data.state);

                // // Locate the `zone` control and update its options
                // const zoneControl = dynamicControls.find(dc => dc.name === 'zone');
                // if (zoneControl) {
                //   zoneControl.options = zoneOptions;
                //   zoneControl.value = currentZoneCode;
                // }

                // const patchObject: { [key: string]: any } = {
                //   city: res.data.city || '',
                //   state: res.data.state || '',
                //   zone: currentZoneName,
                // };
                // let formArray: any = this.dynamicFormGroup.get(parentControl.name)?.value;
                // if (formArray && Array.isArray(formArray)) {
                //   formArray[memberIndex] = { ...formArray[memberIndex], ...patchObject };
                //   this.dynamicFormGroup.get(parentControl.name)?.patchValue(formArray);
                // }
              } else {
                this.resetDynamicZoneFields(parentControl, index);
              }
              // this.dynamicFormGroup.get(parentControl.name)?.patchValue(formArray);
              // this.spinner.hide();
            },
            error: (err: any) => {
              this.toast.warning({ detail: "Warning", summary: err, duration: 3000 });
              this.resetDynamicZoneFields(parentControl, index);
            }
          });
        }
      });
      // });
    }

    if (control.onChangeMethod != null && control.otherControlName != null) {
      this.form.formSections.forEach((section: any) => {
        section.formControls.forEach((formControl: any) => {
          if (formControl.name == control.otherControlName) {
            this.callMethodForOtherControls(event, control.onChangeMethod, control, formControl);
            //this.callMethod(event,control.method, formControl,section);
          }
        });
      });
    }

    if (parentControl == null && control.name === 'preFix') {
      const selectedPrefix = event.target.value;
      if (selectedPrefix === 'Mr') {
        this.dynamicFormGroup.get('proposerGender')?.setValue('M');
      }
      else if (selectedPrefix === 'Mrs' || selectedPrefix === 'Ms' || selectedPrefix === 'Miss') {
        this.dynamicFormGroup.get('proposerGender')?.setValue('F');
      }
      else if (selectedPrefix === 'Mx' || selectedPrefix === 'Others') {
        this.dynamicFormGroup.get('proposerGender')?.setValue('O');
      }
      else {
        this.dynamicFormGroup.get('proposerGender')?.setValue('-');
      }
    }
    if (control.name == "chequeDate") {
      const inputDate = new Date(event.target.value);
      const currentDate = new Date();
      if (isNaN(inputDate.getTime()) || inputDate.getTime() !== currentDate.getTime()) {
        const formattedDate = currentDate.toISOString().split('T')[0]; // Format to yyyy-MM-dd
        event.target.value = formattedDate; // Reset the input value to current date
        control.value = formattedDate; // Update the control's value
        this.dynamicFormGroup.get(control.name)?.setValue(formattedDate); // Update the FormControl              
      }
    }
    if (control.name === "dateOfDiagnosis") {
      const inputValue = event.target.value;
      if (!inputValue) {
        control.value = null;
        this.dynamicFormGroup.get(control.name)?.setValue(null);
        return;
      }
      const inputDate = new Date(inputValue);
      const currentDate = new Date();
      if (isNaN(inputDate.getTime())) {
        event.target.value = '';
        control.value = null;
        this.dynamicFormGroup.get(control.name)?.setValue(null);
        this.toast.warning({ detail: "Warning", summary: "Invalid date format.", duration: 3000 });
        return;
      }
      if (inputDate > currentDate) {
        event.target.value = '';
        control.value = null;
        this.dynamicFormGroup.get(control.name)?.setValue(null);
        this.toast.warning({ detail: "Warning", summary: "Date cannot be in the future.", duration: 3000 });
      }
    }
    if (control.type == 'radio' && control.dependentControls) {
      console.log((event.target as HTMLInputElement).value);
      parentControl.innerControls.forEach((element: any) => {
        if (control.dependentControls.includes(element.name)) {
          element.visible = !element.visible;
        }
      });
    }
  }

  calculateAge(dob: Date): string {
    const today = new Date();
    const birthDate = new Date(dob);

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    const dayDifference = today.getDate() - birthDate.getDate();

    // Adjust age if the birth date hasn't occurred yet in the current year
    if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
      age--;
    }

    if (age < 1) {
      const diffInMs = today.getTime() - birthDate.getTime();
      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
      return `${diffInDays}days`; // Return age in days
    }

    return `${age}`;
  }





  // async resolveMethod(methodName: string, ...args: any[]): Promise<void> {
  //   let filteredArgs = args.filter(arg => arg !== undefined && arg !== null);

  //   if (methodName == 'addOrRemoveAdditionalInsuredMember') {
  //     filteredArgs = filteredArgs.slice(-1);

  //   } else if (filteredArgs[filteredArgs.length - 1] == 'add' || filteredArgs[filteredArgs.length - 1] == 'remove') {
  //     filteredArgs.pop();
  //   }


  //   const method = (this as any)[methodName] as Function;
  //   if (method && typeof method === 'function') {
  //     // method.bind(this)(...filteredArgs);
  //     await Promise.resolve(method.bind(this)(...filteredArgs));
  //     if (methodName == 'getProposerRelationship') {

  //     }
  //   } else {
  //     console.error(`Method ${methodName} not found`);
  //   }
  // }

  async resolveMethod(methodName: string, ...args: any[]): Promise<void> {

    // Filter out undefined and null arguments
    let filteredArgs = args.filter(arg => arg !== undefined && arg !== null);

    console.log(methodName);


    // Specific logic for handling certain method names
    if (methodName === 'addOrRemoveAdditionalInsuredMember') {
      filteredArgs = filteredArgs.slice(-1);
    } else if (filteredArgs[filteredArgs.length - 1] === 'add' || filteredArgs[filteredArgs.length - 1] === 'remove') {
      filteredArgs.pop();
    }

    // Resolve the method dynamically
    const method = (this as any)[methodName] as Function;
    if (method && typeof method === 'function') {
      try {
        // Call the method with filtered arguments
        const result = method.bind(this)(...filteredArgs);
        // if (methodName == 'uploadSelectedDocument')


        // If the result is a Promise, await it; otherwise, wrap it in Promise.resolve()
        if (result && typeof result.then === 'function') {
          await result; // It's already a Promise, so await it
        } else if (result != undefined) {
          await Promise.resolve(result); // Wrap non-Promise results into a Promise
        }

        // Example logic specific to 'getProposerRelationship'
        // if (methodName === 'getProposerRelationship') {
        //   console.log("Proposer Relationship");
        // }
      } catch (error) {
        console.error(`Error in method ${methodName}:`, error);
        await Promise.reject(error);
      }
    } else {
      console.error(`Method ${methodName} not found`);
    }
  }



  handlePolicyTypeChange(control: any, planType: string | null = null): void {
    // const sumInsuredControl = this.dynamicFormGroup.get('memberSumInsured');
    // const pincodeControl = this.dynamicFormGroup.get('pincode');
    // if (sumInsuredControl || pincodeControl) {

    if (planType == null)
      planType = control.value;
    setTimeout(() => {

      this.form.formSections.forEach((section: any) => {
        section.formControls.forEach((formControl: any) => {
          if (formControl.name == 'insuredMembers') {
            if (((this.formData.productType == 'GHS' || this.formData.productType == 'AS' || this.formData.productVariant == "Preferred 1") && formControl.selectCheckboxOptions?.length == 0) || (this.formData.productType != 'GHS' && this.formData.productType != 'AS' && this.formData.productVariant != "Preferred 1")) {
              this.resetInsuredMembers(control, planType);
              this.getProposerRelationship(formControl);
            }
            section.visible = true;
          }
        });
      });
    }, 0);


    // }
    // else {
    //   console.error('Sum Insured Control or Pincode Control not found in dynamicFormGroup.');
    // }

  }

  resetInsuredMembers(control: any, planType: any) {
    this.dynamicFormGroup.get('numberOfInsuredMembers')?.setValue(0);
    this.dynamicFormGroup.removeControl('insuredMemberDetails');
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
          if (section.formControls.length > 1) {
            section.formControls[0].visible = false;
            section.formControls[1].visible = true;
            while (section.formControls[0].dynamicControls.length > 1) {
              section.formControls[0].dynamicControls.pop();
            }
            section.visible = false;
          }
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

  // setupRelationshipTypeValidation(childControl: IFormControl, index: any) {
  //   const eventValue = childControl.value;
  //   this.form.formSections.forEach((section: any) => {
  //     section.formControls.forEach((formControl: any) => {
  //       if (formControl.dynamicControls && formControl.visible) {
  //         // Check if dynamicControls[index] exists
  //         if (formControl.dynamicControls[index]) {
  //           formControl.dynamicControls[index].forEach((control: any) => {
  //             if (control.name == childControl.otherControlName) {
  //               if (control.validators && childControl.validationRules) {
  //                 // Create a new array for validators to avoid mutating the original
  //                 const newValidators: IValidator[] = control.validators.filter(
  //                   (val: IValidator) => val.validatorName === 'required'
  //                 );

  //                 console.log(this.formData, eventValue, childControl.validationRules);

  //                 // Determine the appropriate validation rule based on eventValue
  //                 let rule;
  //                 if (/^son\d*$/i.test(eventValue) || /^daughter\d*$/i.test(eventValue) || /^nephew\d*$/i.test(eventValue) ||
  //                   /^niece\d*$/i.test(eventValue) ||
  //                   /^grand-son\d*$/i.test(eventValue) ||
  //                   /^grand-daughter\d*$/i.test(eventValue)) {
  //                   rule = childControl.validationRules.find((rule: any) => rule.type === 'child');
  //                 }
  //                 // else if ((/^nephew\d*$/i.test(eventValue) ||
  //                 //   /^niece\d*$/i.test(eventValue) ||
  //                 //   /^grand-son\d*$/i.test(eventValue) ||
  //                 //   /^grand-daughter\d*$/i.test(eventValue)) && this.formData['productName'] == 'Activ One VYTL') {
  //                 //   rule = childControl.validationRules.find((rule: any) => rule.type === 'child');
  //                 // }
  //                 else {
  //                   rule = childControl.validationRules.find((rule: any) => rule.type === 'adult');
  //                 }

  //                 if (rule) {
  //                   newValidators.push(rule);
  //                 }

  //                 const formControlInstance = this.dynamicFormGroup.get(control.name);
  //                 control.validators = newValidators;
  //                 if (formControlInstance) {
  //                   const validators = newValidators
  //                     .map(val => {
  //                       if (val.validatorName === 'pattern' && val.pattern) {
  //                         return Validators.pattern(val.pattern);
  //                       }
  //                       if (val.validatorName === 'required') {
  //                         return Validators.required;
  //                       }
  //                       return null;
  //                     })
  //                     .filter((v): v is ValidatorFn => v !== null);

  //                   formControlInstance.setValidators(validators);
  //                   formControlInstance.updateValueAndValidity();
  //                 }
  //               }
  //             }
  //           });
  //         }
  //       }
  //     });
  //   });

  //   // You can now set validators for the control using Angular's Form API, if needed
  //   // const memberAgeControl = (this.dynamicFormGroup.get(parentControl.name) as FormArray).controls[index].get(childControl.otherControlName);
  //   // if (memberAgeControl) {
  //   //   memberAgeControl.setValidators(newValidators.map(val => /* mapping logic to Angular Validators */));
  //   //   memberAgeControl.updateValueAndValidity();
  //   // }
  // }


  //different Implementation
  setupRelationshipTypeValidation(childControl: IFormControl, index: any) {
    const eventValue = childControl.value;
    let rule: any = null;

    this.form.formSections.forEach((innerSection: any) => {
      innerSection.formControls.forEach((innerControl: any) => {
        if (innerControl.name === 'insuredMembers' && innerControl.selectCheckboxOptions) {
          const matchingOption = innerControl.selectCheckboxOptions.find(
            (option: any) => option.name === eventValue
          );
          if (matchingOption && matchingOption.validationRule) {
            rule = JSON.parse(matchingOption.validationRule);
          }
        }
      });
    });

    console.log(rule);



    this.form.formSections.forEach((section: any) => {
      section.formControls.forEach((formControl: any) => {
        if (formControl.dynamicControls && formControl.visible) {
          // Check if dynamicControls[index] exists
          if (formControl.dynamicControls[index]) {
            formControl.dynamicControls[index].forEach((control: any) => {
              if (control.name == childControl.otherControlName) {
                if (control.validators && childControl.validationRules) {
                  // Create a new array for validators to avoid mutating the original
                  const newValidators: IValidator[] = control.validators.filter(
                    (val: IValidator) => val.validatorName === 'required'
                  );

                  console.log(this.formData, eventValue, childControl.validationRules);

                  // Determine the appropriate validation rule based on eventValue

                  // if (/^son\d*$/i.test(eventValue) || /^daughter\d*$/i.test(eventValue) || /^nephew\d*$/i.test(eventValue) ||
                  //   /^niece\d*$/i.test(eventValue) ||
                  //   /^grand-son\d*$/i.test(eventValue) ||
                  //   /^grand-daughter\d*$/i.test(eventValue)) {
                  //   rule = childControl.validationRules.find((rule: any) => rule.type === 'child');
                  // }
                  // // else if ((/^nephew\d*$/i.test(eventValue) ||
                  // //   /^niece\d*$/i.test(eventValue) ||
                  // //   /^grand-son\d*$/i.test(eventValue) ||
                  // //   /^grand-daughter\d*$/i.test(eventValue)) && this.formData['productName'] == 'Activ One VYTL') {
                  // //   rule = childControl.validationRules.find((rule: any) => rule.type === 'child');
                  // // }
                  // else {
                  //   rule = childControl.validationRules.find((rule: any) => rule.type === 'adult');
                  // }

                  if (rule) {
                    newValidators.push(rule);
                  }

                  const formControlInstance = this.dynamicFormGroup.get(control.name);
                  control.validators = newValidators;
                  if (formControlInstance) {
                    const validators = newValidators
                      .map(val => {
                        if (val.validatorName === 'pattern' && val.pattern) {
                          return Validators.pattern(val.pattern);
                        }
                        if (val.validatorName === 'required') {
                          return Validators.required;
                        }
                        return null;
                      })
                      .filter((v): v is ValidatorFn => v !== null);

                    formControlInstance.setValidators(validators);
                    formControlInstance.updateValueAndValidity();
                  }
                }
              }
            });
          }
        }
      });
    });

    // You can now set validators for the control using Angular's Form API, if needed
    // const memberAgeControl = (this.dynamicFormGroup.get(parentControl.name) as FormArray).controls[index].get(childControl.otherControlName);
    // if (memberAgeControl) {
    //   memberAgeControl.setValidators(newValidators.map(val => /* mapping logic to Angular Validators */));
    //   memberAgeControl.updateValueAndValidity();
    // }
  }

  increment(controlName: any, childControlName: any) {
    const currentValue = this.dynamicFormGroup.get(controlName)?.value;
    this.dynamicFormGroup.get(controlName)?.setValue(currentValue + 1);
    this.form.formSections.forEach(formsection => {
      formsection.formControls.forEach(formControl => {
        if (formControl.dynamicControls && formControl.name == childControlName) {
          let tempDynamicControl = formControl.dynamicControls[0].map((element: any) => ({ ...element }));
          formControl.dynamicControls.push(tempDynamicControl)
          let formArr = this.dynamicFormGroup.get(childControlName) as FormArray;
          formArr.push(this.initializeDynamicFormControls(tempDynamicControl));
        }
      });
    });
  }
  decrement(controlName: any, childControlName: any) {
    const currentValue = this.dynamicFormGroup.get(controlName)?.value;
    if (currentValue > 0) {
      this.dynamicFormGroup.get(controlName)?.setValue(currentValue - 1);
      this.form.formSections.forEach(formsection => {
        formsection.formControls.forEach(formControl => {
          if (formControl.dynamicControls && formControl.name == childControlName) {
            formControl.dynamicControls.pop();
          }
        });
      });
      let formArr = this.dynamicFormGroup.get(childControlName) as FormArray;
      formArr.removeAt(formArr.length - 1);
    }
  }


  incrementMember(event: any, control: IFormControl, option: any) {
    // Prevent event propagation to the checkbox
    event.stopPropagation();
    const formGroup = this.dynamicFormGroup.get(control.name) as FormGroup;
    let index = parseInt(option.value.slice(-1), 10);
    if (index >= 4 && this.formData.productName === 'Active Secure') {
      this.toast.warning({ detail: "Warning", summary: "You can select a maximum of 4 sons or daughters for Active Secure.", duration: 3000 });
      return;
    }
    index += 1;
    if ((index <= 4 && this.dynamicFormGroup.get('memberPolicyType')?.value == 'Family Floater') || this.dynamicFormGroup.get('memberPolicyType')?.value == 'Multi Individual' || this.dynamicFormGroup.get('memberPolicyType')?.value == 'Individual') {
      const baseName = option.value.replace(/\d+$/, '');
      const newControlName = baseName + index;
      // Add the new control with a unique name
      formGroup.addControl(newControlName, new FormControl(false));

      this.form.formSections.forEach((section) => {
        section.formControls.forEach((formControl: IFormControl) => {
          if (formControl.name === control.name) {
            // formControl.selectCheckboxOptions?.push({
            //   label: option.label,
            //   value: newControlName,
            //   isIncrement: option.isIncrement,
            //   imagePath: option.imagePath,
            //   name: option.name
            // });
            formControl.selectCheckboxOptions?.push({
              gender: option.gender,
              id: option.id,
              imagePath: option.imagePath,
              isIncrement: option.isIncrement,
              memberRelationCode: option.memberRelationCode,
              name: newControlName,
              productId: option.productId,
              value: newControlName
            });
            // Disable the button for the current option
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

  // getProposerRelationship(control: IFormControl): Promise<any> {
  //   // Showing the spinner before making the API call
  //   this.spinner.show();

  //   // Wrapping the asynchronous operation in a promise
  //   return new Promise((resolve, reject) => {
  //     const reqData = {
  //       agencyCode: this.partnerId,
  //       insuranceTypeCode: 101,
  //       productId: this.productId,
  //       policyType: this.dynamicFormGroup.get('memberPolicyType')?.value,
  //     };


  //     // Calling the API service
  //     this.service.GetProposerRelationships(reqData).subscribe({
  //       next: (res) => {

  //         // Prepare form group
  //         const controlGroup = this.fb.group({});

  //         // For each relationship option, add a control
  //         res.relationShip.forEach((option: any) => {
  //           controlGroup.addControl(option.value, new FormControl(false));
  //         });

  //         // Remove previous insuredMembers control
  //         this.dynamicFormGroup.removeControl('insuredMembers');

  //         // Add validators
  //         let controlValidators: any = [];
  //         control.validators?.forEach((val: IValidator) => {
  //           if (val.validatorName === 'required') controlValidators.push(Validators.required);
  //           if (val.validatorName === 'email') controlValidators.push(Validators.email);
  //           if (val.validatorName === 'minlength') controlValidators.push(Validators.minLength(val.minLength as number));
  //           if (val.validatorName === 'maxlength') controlValidators.push(Validators.maxLength(val.maxLength as number));
  //           if (val.validatorName === 'pattern') controlValidators.push(Validators.pattern(val.pattern as string));
  //         });

  //         // controlGroup.setValidators([...controlValidators, this.addCustomValidation()]);
  //         // controlGroup.updateValueAndValidity();
  //         // controlGroup.setErrors({ required: true });

  //         // Add the new insuredMembers control
  //         this.dynamicFormGroup.addControl(control.name, controlGroup);


  //         // Update control with the fetched options
  //         control.selectCheckboxOptions = res.relationShip;

  //         if (this.isQuote) {
  //           this.form.formSections.forEach((section: any) => {
  //             section.formControls.forEach((control: any) => {
  //               if (control.name == 'insuredMembers') {
  //                 //loop the options and see if the option has value true in the insuredMembers in formData and the call the log selection
  //                 control.selectCheckboxOptions.forEach((option: any) => {
  //                   if (this.formData.insuredMembers[option.value] === true) {
  //                     // Call logSelection function (pass null for event if not triggering through UI)
  //                     this.logSelection(null, option, control);
  //                   }
  //                 })
  //               }
  //             })

  //           })
  //         }
  //         // Hide the spinner once the response is processed
  //         this.spinner.hide();
  //         this.flattenObject(this.formData);



  //         // Resolve the promise when API response is processed successfully
  //         resolve(res);
  //       },
  //       error: (err) => {
  //         console.error(err);
  //         this.spinner.hide();

  //         // Reject the promise on error
  //         reject(err);
  //       }
  //     });
  //   });
  // }

  getProposerRelationship(control: IFormControl): Promise<any> {
    // Wrapping the asynchronous operation in a promise
    return new Promise((resolve, reject) => {
      const reqData = {
        productId: this.productId.toString(),
        policyType: this.dynamicFormGroup.get('memberPolicyType')?.value,
      };


      // API call wrapped in pipe
      this.yatraService.GetProposerRelationships(reqData).pipe(
        tap((res: any) => {

          // Prepare form group
          // const controlGroup = this.fb.group({});

          // // For each relationship option, add a control
          // res.data.relationShip.forEach((option: any) => {
          //   controlGroup.addControl(option.value, new FormControl(false));
          // });

          // Remove previous insuredMembers control
          // this.dynamicFormGroup.removeControl('insuredMembers');

          // Add validators
          let controlValidators: any = [];
          control.validators?.forEach((val: IValidator) => {
            if (val.validatorName === 'required') controlValidators.push(Validators.required);
            if (val.validatorName === 'email') controlValidators.push(Validators.email);
            if (val.validatorName === 'minlength') controlValidators.push(Validators.minLength(val.minLength as number));
            if (val.validatorName === 'maxlength') controlValidators.push(Validators.maxLength(val.maxLength as number));
            if (val.validatorName === 'pattern') controlValidators.push(Validators.pattern(val.pattern as string));
          });

          // Adding the custom validation if required
          // controlGroup.setValidators([...controlValidators, this.addCustomValidation()]);
          // controlGroup.updateValueAndValidity();

          // Add the new insuredMembers control
          // this.dynamicFormGroup.addControl(control.name, controlGroup);

          // Update control with the fetched options
          // control.selectCheckboxOptions = res.data.relationShip;

          if (this.isQuote || this.quickQuoteRedirect || this.isPolicyDetailsFetch) {

            // Process formData.insuredMembers for additional relations
            const formDataRelations = Object.keys(this.formData.insuredMembers)
              .filter(
                (relation) =>
                  !res.data.relationShip.some((option: any) => option.value === relation)
              )
              .map((relation) => {
                const baseName = relation.replace(/\d+$/, '');
                const imagePath = res.data.relationShip.find(
                  (option: any) => option.value.startsWith(baseName)
                )?.imagePath || ''; // Get the imagePath if available

                const id = res.data.relationShip.find(
                  (option: any) => option.value.startsWith(baseName)
                )?.id || '';
                return {
                  id,
                  value: relation,
                  name: relation,
                  isIncrement: false, // Default; will update dynamically
                  imagePath,

                };
              });


            // Merge API and formData relations
            const mergedOptions = [...res.data.relationShip, ...formDataRelations];


            const groupedRelations: Record<string, any[]> = mergedOptions.reduce((acc: Record<string, any[]>, option: any) => {
              const baseName = option.value.replace(/\d+$/, ''); // Remove numeric suffix
              const isNumericSuffix = /\d$/.test(option.value); // Check if last character is a number

              // Only include relations with numeric suffix (e.g., Son1, Son2, Daughter1, etc.)
              if (isNumericSuffix) {
                if (!acc[baseName]) acc[baseName] = [];
                acc[baseName].push(option);
              }
              return acc;
            }, {});
            // Ensure each option has a unique `id` and update `isIncrement` logic
            Object.values(groupedRelations).forEach((group) => {
              group.forEach((relation, idx) => {
                // Only the last member in the group gets the increment button
                relation.isIncrement = idx === group.length - 1;
              });
            });
            // Update control options with merged and processed options
            control.selectCheckboxOptions = mergedOptions;

            // Prepare form group
            const controlGroup = this.fb.group({});

            // For each relationship option, add a control
            control.selectCheckboxOptions.forEach((option: any) => {
              controlGroup.addControl(option.value, new FormControl(false));
            });

            // Remove previous insuredMembers control
            this.dynamicFormGroup.removeControl('insuredMembers');

            // Add the new insuredMembers control
            this.dynamicFormGroup.addControl(control.name, controlGroup);
            this.form.formSections.forEach((section: any) => {
              section.formControls.forEach((control: any) => {
                if (control.name === 'insuredMembers') {
                  // Loop the options and see if the option has value true in the insuredMembers in formData
                  control.selectCheckboxOptions.forEach((option: any) => {
                    if (this.formData.insuredMembers[option.value] === true) {
                      // Call logSelection function (pass null for event if not triggering through UI)
                      this.logSelection(null, option, control);
                    }
                  });
                }
              });
            });
            this.flattenObject(this.formData);
          }
          else {

            // Update control with the fetched options
            control.selectCheckboxOptions = res.data.relationShip;

            // Prepare form group
            const controlGroup = this.fb.group({});

            // For each relationship option, add a control
            control.selectCheckboxOptions?.forEach((option: any) => {
              controlGroup.addControl(option.value, new FormControl(false));
            });

            // Remove previous insuredMembers control
            this.dynamicFormGroup.removeControl('insuredMembers');

            // Add the new insuredMembers control
            this.dynamicFormGroup.addControl(control.name, controlGroup);
          }

          // if (this.isPolicyDetailsFetch) {

          // }

          // Process formData for flattening if needed

        }),
        tap(() => {
          // Hide the spinner once the response is processed
          this.spinner.hide();
        })
      ).subscribe({
        next: (res) => {
          // Resolve the promise when API response is processed successfully
          resolve(res);
        },
        error: (err) => {
          // Hide the spinner and handle error
          console.error(err);
          this.spinner.hide();

          // Reject the promise on error
          reject(err);
        }
      });
    });
  }

  private getValidators(control: IFormControl) {
    let controlValidators: any = [];
    control.validators?.forEach((val: IValidator) => {
      if (val.validatorName === 'required') controlValidators.push(Validators.required);
      if (val.validatorName === 'email') controlValidators.push(Validators.email);
      if (val.validatorName === 'minlength') controlValidators.push(Validators.minLength(val.minLength as number));
      if (val.validatorName === 'maxlength') controlValidators.push(Validators.maxLength(val.maxLength as number));
      if (val.validatorName === 'pattern') controlValidators.push(Validators.pattern(val.pattern as string));
    });
    return controlValidators;
  }


  addCustomValidation(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const controlGroup = this.dynamicFormGroup.get('insuredMembers') as FormGroup;
      if (controlGroup && this.dynamicFormGroup.get('planType')?.value == 'Multi Individual') {
        const hasAtLeastOneSelected = Object.keys(controlGroup.controls).some(
          key => controlGroup.controls[key].value === true
        );
        return hasAtLeastOneSelected ? null : { required: true };
      }
      else if (controlGroup && this.dynamicFormGroup.get('memberPolicyType')?.value == 'Family Floater') {
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

  logSelection(event: Event | null, option: any, controls: any) {
    console.log(option, this.familyPair, this.selectedFamilyPair);
    // const checkbox = event.target as HTMLInputElement;
    const checkbox = event ? (event.target as HTMLInputElement) : { checked: true };
    if (option.pairKey) {
      if (this.familyPair == '' || option.pairKey == this.familyPair) {
        if (checkbox.checked == true) {
          this.familyPair = option.pairKey;
          this.selectedFamilyPair.push(option.name);
        }
        else {
          const labelIndex = this.selectedFamilyPair.indexOf(option.name);
          if (labelIndex > -1) {
            this.selectedFamilyPair.splice(labelIndex, 1);
          }

          if (this.selectedFamilyPair.length === 0) {
            this.familyPair = '';
          }
        }
      }
      else {
        checkbox.checked = false;
        console.log(controls);
        this.dynamicFormGroup.get(controls.name)?.get(option.name)?.setValue(false);
        this.toast.warning({ detail: "Warning", summary: "Invalid family combination", duration: 3000 });
        return;
      }
    }
    if (event != null) {
      this.isQuote = false;
      this.quickQuoteRedirect = false;
      this.changeRecalculate(true);
    }
    if (this.kidCount >= 4 && checkbox.checked && this.dynamicFormGroup.get('memberPolicyType')?.value == 'Family Floater') {
      this.toast.warning({ detail: "Warning", summary: "Cannot select more than 4 childrens", duration: 3000 });
      checkbox.checked = false;
      return;
    }
    else {
      this.form.formSections.forEach(formsection => {
        formsection.formControls.forEach(formControl => {
          if (checkbox.checked == true) {
            // if(formControl.name == 'totalPremium' && this.isPolicyDetailsFetch){
            //   formControl.value = "";
            //   this.dynamicFormGroup.get("totalPremium")?.setValue("");
            // }

            if (formControl.name == controls.idProperty && formControl.dynamicControls && formControl.visible == true) {
              if (option.value.includes('Son') || option.value.includes('Daughter')) {
                this.kidCount++;
              }
              formsection.visible = true;
              if ((this.isQuote == true && this.isPolicyDetailsFetch) || this.quickQuoteRedirect == true) {
                formControl.dynamicControls = formControl.dynamicControls.slice(0, 1);
                this.isQuote = false;
                this.quickQuoteRedirect == false;
              }
              let tempControl = formControl.dynamicControls[0].map((element: any) => ({ ...element }));
              console.log(tempControl)
              tempControl[0].value = JSON.stringify(option);
              tempControl[1].value = option.value;
              tempControl[2].value = option.memberRelationCode;
              if (this.isQuote || this.quickQuoteRedirect) {
                tempControl.forEach((temp) => {
                  console.log(this.formData);

                  if (temp.name == 'zoneValue') {
                    temp.options = this.formData['upgradableZones'];
                  }
                  if (temp.name == 'sumInsured') {
                    this.formData['insuredMemberDetails']?.forEach((member: any) => {
                      if (member.relation === option.value) {
                        temp.options = member.upgradableSumInsured;
                      }
                    });
                  }
                })
              }
              console.log(this.form);

              if (option.gender) {
                tempControl.forEach((temp) => {
                  if (temp.name == 'memberGender') {
                    temp.value = option.gender;
                    temp.disabled = true;
                  }
                })
              }
              else {
                const proposerGender = this.dynamicFormGroup.get('proposerGender')?.value;

                tempControl.forEach((temp) => {
                  if (temp.name === 'memberGender') {
                    if (option.name === 'Self') {
                      temp.value = proposerGender;
                      temp.disabled = true;
                    } else if (proposerGender !== 'O') {
                      temp.value = proposerGender === 'M' ? 'F' : 'M';
                      temp.disabled = true;
                    }
                    // If proposerGender is 'O' and not 'Self', do nothing (no value set, no disable).
                  }
                });
              }

              formControl.dynamicControls?.push(tempControl);
              let formArr = this.dynamicFormGroup.get(controls.idProperty) as FormArray;
              // let formArr;

              if (formArr != null) {
                formArr = this.dynamicFormGroup.get(controls.idProperty) as FormArray;
                formArr.push(this.initializeDynamicFormControls(tempControl, formControl.dynamicControls.length - 1, formControl));
              }
              else {
                formArr = this.fb.array([]);
                formArr.push(this.initializeDynamicFormControls(tempControl, formControl.dynamicControls.length - 1, formControl));
                this.dynamicFormGroup.addControl(controls.idProperty, formArr);
              }



              if (checkbox.checked == true && option.value == 'Self') {
                // let index = formControl.dynamicControls?.findIndex((element:any) => JSON.parse(element[0].value)?.value == option.value);
                let index = -1;
                let memberupgradableZones: IOptions[] = [];
                let zoneWiseSI: IOptions[] = [];
                if (formControl.dynamicControls) {
                  for (let i = 0; i < formControl.dynamicControls.length; i++) {
                    let element = formControl.dynamicControls[i];
                    try {
                      let parsedValue = JSON.parse(element[0].value);
                      if (parsedValue.value === option.value) {
                        element.forEach((control: any) => {
                          if (control.name == 'memberdob' || control.name == 'memberAge' || control.name == 'memberGender' || control.name == 'emailId' || control.name == 'firstName' || control.name == 'lastName') {
                            control.disabled = true
                          }
                          if (control.name == 'zoneValue') {
                            this.form.formSections.forEach(formSection => {
                              formSection.formControls.forEach(formcontrol => {
                                if (formcontrol.name == control.name) {
                                  control.options = formcontrol.options;
                                  memberupgradableZones = formcontrol.options || [];
                                }
                              });
                            });
                          }
                          if (control.name == 'sumInsured') {
                            this.form.formSections.forEach(formSection => {
                              formSection.formControls.forEach(formcontrol => {
                                if (formcontrol.name == control.name) {
                                  control.options = formcontrol.options;
                                  zoneWiseSI = formcontrol.options || [];
                                }
                              });
                            });
                          }
                        })
                        index = i;
                        break;
                      }
                    } catch (e) {
                      console.error('Error parsing JSON:', e);
                    }
                  }
                }

                (this.dynamicFormGroup.get(controls.idProperty) as FormArray)?.controls[index - 1].get('memberdob')?.setValue(this.dynamicFormGroup.get('memberDobProposer')?.value);
                (this.dynamicFormGroup.get(controls.idProperty) as FormArray)?.controls[index - 1].get('memberAge')?.setValue(this.dynamicFormGroup.get('memberAgeProposer')?.value);
                (this.dynamicFormGroup.get(controls.idProperty) as FormArray)?.controls[index - 1].get('memberAge')?.markAsTouched();
                (this.dynamicFormGroup.get(controls.idProperty) as FormArray)?.controls[index - 1].get('memberGender')?.setValue(this.dynamicFormGroup.get('proposerGender')?.value);
                (this.dynamicFormGroup.get(controls.idProperty) as FormArray)?.controls[index - 1].get('pincode')?.setValue(this.dynamicFormGroup.get('proposerPincode')?.value);
                (this.dynamicFormGroup.get(controls.idProperty) as FormArray)?.controls[index - 1].get('city')?.setValue(this.dynamicFormGroup.get('city')?.value);
                (this.dynamicFormGroup.get(controls.idProperty) as FormArray)?.controls[index - 1].get('zone')?.setValue(this.dynamicFormGroup.get('zone')?.value);
                (this.dynamicFormGroup.get(controls.idProperty) as FormArray)?.controls[index - 1].get('zoneValue')?.setValue(this.dynamicFormGroup.get('zoneValue')?.value);
                (this.dynamicFormGroup.get(controls.idProperty) as FormArray)?.controls[index - 1].get('emailId')?.setValue(this.dynamicFormGroup.get('emailId')?.value);
                (this.dynamicFormGroup.get(controls.idProperty) as FormArray)?.controls[index - 1].get('firstName')?.setValue(this.dynamicFormGroup.get('firstName')?.value);
                (this.dynamicFormGroup.get(controls.idProperty) as FormArray)?.controls[index - 1].get('middleName')?.setValue(this.dynamicFormGroup.get('middleName')?.value);
                (this.dynamicFormGroup.get(controls.idProperty) as FormArray)?.controls[index - 1].get('lastName')?.setValue(this.dynamicFormGroup.get('lastName')?.value);
                (this.dynamicFormGroup.get(controls.idProperty) as FormArray)?.controls[index - 1].get('mobileNumber')?.setValue(this.dynamicFormGroup.get('mobileNumber')?.value);
                (this.dynamicFormGroup.get(controls.idProperty) as FormArray)?.controls[index - 1].get('preFix')?.setValue(this.dynamicFormGroup.get('preFix')?.value);
                (this.dynamicFormGroup.get(controls.idProperty) as FormArray)?.controls[index - 1].get('height')?.setValue(this.dynamicFormGroup.get('height')?.value);
                (this.dynamicFormGroup.get(controls.idProperty) as FormArray)?.controls[index - 1].get('weight')?.setValue(this.dynamicFormGroup.get('weight')?.value);
                (this.dynamicFormGroup.get(controls.idProperty) as FormArray)?.controls[index - 1].get('heightInches')?.setValue(this.dynamicFormGroup.get('heightInches')?.value);
                (this.dynamicFormGroup.get(controls.idProperty) as FormArray)?.controls[index - 1].get('annualIncome')?.setValue(this.dynamicFormGroup.get('annualIncome')?.value);
                if (this.dynamicFormGroup.get('occupation')) {
                  if (this.dynamicFormGroup.get('occupation')?.value != '')
                    (this.dynamicFormGroup.get(controls.idProperty) as FormArray)?.controls[index - 1].get('productMemberDesignation')?.setValue(this.dynamicFormGroup.get('occupation')?.value);
                }
                (this.dynamicFormGroup.get(controls.idProperty) as FormArray)?.controls[index - 1].get('upgradableZones')?.setValue(memberupgradableZones);
                (this.dynamicFormGroup.get(controls.idProperty) as FormArray)?.controls[index - 1].get('upgradableSumInsured')?.setValue(zoneWiseSI);
                // (this.dynamicFormGroup.get(controls.idProperty) as FormArray)?.controls[index - 1].get('sumInsured')?.setValue(zoneWiseSI);
                // const ageControl = this.dynamicFormGroup.get(controls.idProperty);
                // if(ageControl){
                // ageControl.value[index-1]['memberAge'] = this.dynamicFormGroup.get('memberAgeProposer')?.value;
                // this.dynamicFormGroup.get(controls.idProperty)?.patchValue(ageControl.value);
                // (this.dynamicFormGroup.get(controls.idProperty) as FormArray)?.controls[index - 1].get('memberAge')?.setValue(this.dynamicFormGroup.get('memberAgeProposer')?.value);


                // }


              }
              if (this.dynamicFormGroup.get('memberPolicyType')?.value == 'Family Floater') {
                (this.dynamicFormGroup.get(controls.idProperty) as FormArray)?.controls.forEach((control: any) => {
                  control.get('sumInsured')?.setValue(this.dynamicFormGroup.get('sumInsured')?.value);
                  control.get('zone')?.setValue(this.dynamicFormGroup.get('zone')?.value);
                  control.get('zoneValue')?.setValue(this.dynamicFormGroup.get('zoneValue')?.value);
                  control.get('deductibleAmount')?.setValue(this.dynamicFormGroup.get('deductibleAmount')?.value);
                })
              }
              this.dynamicFormGroup.get('numberOfInsuredMembers')?.setValue(this.dynamicFormGroup.get('numberOfInsuredMembers')?.value + 1);
            }

          }
          else if (checkbox.checked == false) {
            if (formControl.name == controls.idProperty && formControl.dynamicControls && formControl.visible == true) {
              if (option.value.includes('Son') || option.value.includes('Daughter')) {
                this.kidCount--;
              }

              // Find the index of the dynamic control to be removed
              let index = formControl.dynamicControls?.findIndex((element: any) => element[1].value == option.value);

              if (index !== undefined && index !== -1) {
                // Remove the dynamic control from formControl.dynamicControls
                formControl.dynamicControls?.splice(index, 1);

                // Remove the corresponding FormArray element
                let formArr = this.dynamicFormGroup.get(controls.idProperty) as FormArray;
                formArr.removeAt(index - 1);

                // Hide the form section if no elements are left in the FormArray
                if (formArr.length == 0) {
                  formsection.visible = false;
                }

                // Remove entries from formData that match the deselected member's index or value
                Object.keys(this.formData).forEach(key => {
                  if (key.startsWith(`${controls.idProperty}.${index - 1}.`)) {
                    delete this.formData[key];
                  }
                  if (key.includes(option.value)) {
                    delete this.formData[key];
                  }
                });

                // Update this.covers to remove the cover for the deselected member
                if (this.covers[index - 1]) {
                  this.covers.splice(index - 1, 1);
                }
                // Update the number of insured members
                this.dynamicFormGroup.get('numberOfInsuredMembers')?.setValue(
                  this.dynamicFormGroup.get('numberOfInsuredMembers')?.value - 1
                );
              }
            }
          }

        });
      })
      // const numberOfInsuredMembersControl = this.dynamicFormGroup.get('numberOfInsuredMembers');
      // if (numberOfInsuredMembersControl) {
      //   const numberOfInsuredMembers = numberOfInsuredMembersControl.value;

      const insuredMembersFormGroup = this.dynamicFormGroup.get('insuredMembers') as FormGroup;
      if (insuredMembersFormGroup) {
        insuredMembersFormGroup.setValidators(this.addCustomValidation());
        insuredMembersFormGroup.updateValueAndValidity();

      }
      // }

      this.updateValueAndGroupError(this.dynamicFormGroup.get(controls.name) as FormGroup);
    }
  }

  updateValueAndGroupError(controlGroup: FormGroup) {
    const anyTrue = Object.values(controlGroup.controls).some(control => control.value === true);
    if (anyTrue) {
      controlGroup.setErrors(null); // Clear errors if any control is true
    } else {
      controlGroup.setErrors({ required: true }); // Set required error if all controls are false
    }

  }

  getFormIndexValue() {
    const formIndex = localStorage.getItem("formIndex") as string;
    return formIndex ? parseInt(formIndex, 10) : 0;
  }
  setFormIndexValue(value: number) {
    localStorage.setItem("formIndex", value.toString());
  }
  incrementIndex() {
    const currentIndex = this.getFormIndexValue();
    this.setFormIndexValue(currentIndex + 1);
  }
  decrementIndex() {
    const currentIndex = this.getFormIndexValue();
    this.setFormIndexValue(currentIndex - 1);
  }

  onPrevious(control: any) {
    if (this.getFormIndexValue() > 0) {
      this.decrementIndex()
      this.getFormDataFromFormSequence(this.formSequence[this.getFormIndexValue()].formId);
    }
  }

  onButtonClick(control: any) {
    this.selectedButton = control.name;
    const paymentModeControl = this.dynamicFormGroup.get('paymentMode');
    if (paymentModeControl) {
      paymentModeControl.setValue(this.selectedButton);
    }

    // if (this.selectedButton !== 'offline' && this.selectedButton !== 'autoDebit') {
    //   this.form.formSections.forEach((section: any) => {
    //     section.formControls.forEach((controls: any) => {
    //       if (controls.name === 'offline' && controls.dependentControls) {
    //         controls.dependentControls.forEach((item: any) => {
    //           const controlToHide = this.form.formSections
    //             .flatMap((sec: any) => sec.formControls)
    //             .find((ctrl: any) => ctrl.name === item);
    //           if (controlToHide) {
    //             controlToHide.visible = false; // Hide dependent controls for offline
    //           }
    //         });
    //       }
    //     });
    //   });
    // }
    if (this.selectedButton && !['offline', 'loanPayment', 'bankFundTransfer'].includes(this.selectedButton)) {
      this.form.formSections.forEach((section: any) => {
        section.formControls.forEach((controls: any) => {
          // if (controls.name === 'offline' && controls.dependentControls) {
          if ((controls.name === 'offline' || controls.name === 'loanPayment' || controls.name === 'bankFundTransfer') && controls.dependentControls) {
            controls.dependentControls.forEach((item: any) => {
              const controlToHide = this.form.formSections
                .flatMap((sec: any) => sec.formControls)
                .find((ctrl: any) => ctrl.name === item);
              if (controlToHide) {
                controlToHide.visible = false; // Hide dependent controls for offline
                const formControl = this.dynamicFormGroup.get(controlToHide.name);
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
    } else {
      this.form.formSections.forEach((section: any) => {
        section.formControls.forEach((controls: any) => {
          if ((controls.name !== 'offline' || controls.name !== 'loanPayment' || controls.name !== 'bankFundTransfer') && controls.dependentControls) {
            controls.dependentControls.forEach((item: any) => {
              const controlToHide = this.form.formSections
                .flatMap((sec: any) => sec.formControls)
                .find((ctrl: any) => ctrl.name === item);
              if (controlToHide) {
                controlToHide.visible = false; // Hide dependent controls for other buttons
                const formControl = this.dynamicFormGroup.get(controlToHide.name);
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
    // Handle the Juspay redirection for buttons other than Offline
    if (this.selectedButton === 'sendLinkButton') {
      const reqData = {
        firstName: this.formData.firstName,
        lastName: this.formData.lastName,
        agentcode: this.agentCode,
        emailId: this.formData.emailId,
        productName: this.formData.productName,
        pNumber: this.formData.proposalNumber,
        businessType: 'NB',
        productCode: this.formData.productId,
        premiumAmount: this.formData.totalPremium,
        mobilenumber: this.formData.mobileNumber,
      };
      this.yatraService.sharePaymentLink(reqData).subscribe({
        next: (response: any) => {
          if (response.data.paymentLink && response.data.paymentLink !== null && response.data.paymentLink !== '') {
            if (this.selectedButton == 'sendLinkButton') {
              this.dynamicFormGroup.get(control.dependentControls[0])?.setValue(response.data.paymentLink);
              // res = response.data.paymentLink;
            }
            else {
              window.location.href = response.data.paymentLink; // Redirect to Juspay Payment URL
            }
          } else {
            this.toast.warning({ detail: "Warning", summary: "Invalid payment link received", duration: 3000 });
            console.error('Invalid payment link received:', response);
          }
        },
        error: (error) => {
          this.toast.error({ detail: "Error", summary: "Failed to generate payment link", duration: 3000 });
          console.error('Error generating payment link:', error);
        }
      });
    }

    // Handle showing dependent controls if any are specified for the clicked button
    if (control.dependentControls) {
      this.form.formSections.forEach((section: any) => {
        section.formControls.forEach((controls: any) => {
          control.dependentControls.forEach((item: any) => {
            if (controls.name == item) {
              controls.visible = true;
              // control.disabled = true;
              const formControl = this.dynamicFormGroup.get(controls.name);
              if (formControl) {
                formControl.enable();
                if (controls.validators) {
                  const validators = controls.validators.map((val: any) => {
                    if (val.validatorName === 'required') {
                      return Validators.required;
                    } else if (val.validatorName === 'pattern' && val.pattern) {
                      return Validators.pattern(val.pattern);
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
              const formControl = this.dynamicFormGroup.get(control.name);
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


  onEmailClick(control: any) {
    let requestBody: any = {};
    requestBody.emailId = this.formData.emailId;
    requestBody.mobileNumber = this.formData.mobileNumber;
    requestBody.name = this.formData.proposerName;
    requestBody.agentCode = this.agentCode;
    requestBody.proposalNumber = this.formData.proposalNumber;
    requestBody.premiumAmount = this.formData.totalPremium;
    requestBody.productName = this.formData.productName;

    this.yatraService.sendEmailLink(requestBody).subscribe(
      (res: any) => {
        if (res.isSuccess) {
          this.requestId = res.data.requestId;
          this.toast.success({ detail: "Success", summary: "Communication send Successfully", duration: 3000 });
        }
      },
      (error) => {
        console.error(error);
      });

    this.form.formSections.forEach((section: any) => {
      section.formControls.forEach((controls: any) => {
        if (controls.dependentControls) {
          controls.dependentControls.forEach((item: any) => {
            const controlToHide = section.formControls.find((c: any) => c.name === item);
            if (controlToHide) {
              controlToHide.visible = false; // Hide all dependent controls initially
            }
          });
        }
      });
    });

    // Show the dependent controls for the currently clicked button
    if (control.dependentControls) {
      this.form.formSections.forEach((section: any) => {
        section.formControls.forEach((controls: any) => {
          control.dependentControls.forEach((item: any) => {
            if (controls.name === item) {
              controls.visible = true; // Show the dependent controls for this button
            }
          });
        });
      });
    }
  }

  onOtpClick(control: any) {
    console.log(this.formData);
    let sendOTPReqeustBody: any = {};
    sendOTPReqeustBody.emailId = this.formData.mobileNumber,
      sendOTPReqeustBody.mobileNumber =
      sendOTPReqeustBody.name = "",
      sendOTPReqeustBody.agentCode = this.agentCode;

    this.yatraService.sendOTP(sendOTPReqeustBody).subscribe(
      (res: any) => {
        if (res.isSuccess) {
          if (res.message == 'Success') {
            this.otpRequestId = res.data.requestId;
            this.form.formSections.forEach((section: any) => {
              section.formControls.forEach((controls: any) => {
                if (controls.dependentControls) {
                  controls.dependentControls.forEach((item: any) => {
                    const controlToHide = section.formControls.find((c: any) => c.name === item);
                    if (controlToHide && controlToHide.name != "sendLink") {
                      controlToHide.visible = false; // Hide all dependent controls initially
                    }
                  });
                }
              });
            });

            // Show the dependent controls for the currently clicked button
            if (control.dependentControls) {
              this.form.formSections.forEach((section: any) => {
                section.formControls.forEach((controls: any) => {
                  control.dependentControls.forEach((item: any) => {
                    if (controls.name === item) {
                      controls.visible = true; // Show the dependent controls for this button
                    }
                  });
                });
              });
            }

            this.toast.success({
              detail: "Success",
              summary: `Communication has been sent Successfully`,
              duration: 3000,
            });
            control.visible = false;
          }
        }
        else {
          this.toast.error({
            detail: "Error",
            summary: res.message,
            duration: 3000,
          });
        }
      },
      (error) => {
        console.error(error);

      });


  }

  skipOTP() {
    this.form.formSections.forEach((section: any) => {
      section.formControls.forEach((controls: any) => {
        if (controls.name == "next") {
          controls.disabled = false;
        }
      });
    });
  }


  verifyOTP(control: any) {
    if (!this.otpRequestId) {
      this.toast.warning({
        detail: "Warning",
        summary: `Please click On Send OTP.`,
        duration: 3000,
      });
    }
    let verifyRequest: any = {}
    verifyRequest.agentCode = this.agentCode;
    verifyRequest.requestId = this.otpRequestId;
    verifyRequest.otpNumber = this.dynamicFormGroup.value.otpField.toString();
    verifyRequest.mobileNumber = this.formData.mobileNumber;
    verifyRequest.eMailId = this.formData.emailId;
    this.yatraService.verifyOTP(verifyRequest).subscribe(
      async (res: any) => {
        if (res.isSuccess) {
          this.toast.success({
            detail: "Success",
            summary: `SuccessFully Validated`,
            duration: 3000,
          });
          this.form.formSections.forEach((section: any) => {
            section.formControls.forEach((controls: any) => {
              if (controls.dependentControls) {
                controls.dependentControls.forEach((item: any) => {
                  const controlToHide = section.formControls.find((c: any) => c.name === item);
                  if (controlToHide) {
                    controlToHide.visible = false; // Hide all dependent controls initially
                  }
                });
              }
              if (controls.name == "next") {
                controls.disabled = false;
              }
            });
          });
          let reqData = {
            "proposalNum": this?.formData?.proposalNumber,
            "partnerId": this.partnerId,
            "agentCode": this.agentCode,
            "formData": JSON.stringify(this.dynamicFormGroup.getRawValue()),
            "formName": this.formSequence[this.getFormIndexValue()].formName,
            "formConfig": JSON.stringify(this.formSequence),
            "productId": this.productId.toString(),
            "formId": this.formSequence[this.getFormIndexValue()].formId,
            "jsonForm": JSON.stringify(this.form),
            "formSequence": this.getFormIndexValue(),
            "leadNumber": this.leadnumber,
            "quoteNumber": this.formData.quoteId ? this.formData.quoteId : ""
          };
          console.log(reqData);
          await this.yatraService.Insertorupdateformdata(reqData).subscribe({
            next: (res: any) => {
              this.leadnumber = res.data;

              // Call getFormDataFromFormSequence only after insert/update is completed

              if (this.isQuote) {
                this.isQuote = false;
                sessionStorage.setItem("isQuote", this.isQuote.toString());
              }

              this.quickQuoteRedirect = false;
            },
            error: (err) => {
              console.error(err);
            }
          });
        }
        else {
          this.toast.error({
            detail: "Error",
            summary: res.message,
            duration: 3000,
          });
        }
      },
      (error) => {
        console.log("err", error);
      });


  }
  // In your template, you can bind the class dynamically
  getButtonClass(control: any): string {
    // return this.selectedButton === control.name ? 'active-button' : '';
    let classes = this.selectedButton === control.name ? 'active-button' : '';
    if (control.disabled) {
      classes += ' disabled';
    }
    return classes.trim();
  }
  async onSubmit(event?: any) {
    this.changesMade = false;
    console.log("dynamic form group", this.formData, this.familyPair, this.selectedFamilyMembers);
    console.log(this.dynamicFormGroup.getRawValue(), this.dynamicFormGroup, this.form);
    const policyType = this.dynamicFormGroup.get('memberPolicyType')?.value;
    const insuredMembers = this.dynamicFormGroup.get('numberOfInsuredMembers')?.value;

    if (insuredMembers < 2 && policyType == 'Family Floater') {
      this.toast.warning({ detail: "Warning", summary: "Minimum of two members are required for Family Family Floater policy", duration: 3000 });
      return;
    }
    if (this.form.formTitle == 'Total Premium') {
      if (this.formData.productName === 'Active Secure') {
        console.log("Form data:", this.formData);
        const requiredCoverIds = ['CIL', 'CANC', 'ACCD']
        const hasEmptyRequiredCovers = this.formData.insuredMemberDetails.some((member: any) => {
          const validCovers = member.covers.filter((cover: any) => requiredCoverIds.includes(cover.coverId));
          return validCovers.length === 0 || validCovers.every((cover: any) => !cover.value || cover.value === 0);
        });
        if (hasEmptyRequiredCovers) {
          this.toast.warning({ detail: "Warning", summary: "Each member must have at least one valid cover (CIL, CANC, or ACCD(Personal Accident)) selected.", duration: 4000 });
          return;
        }
      }

      if (this.dynamicFormGroup.get('deductible')) {
        if (this.dynamicFormGroup.get('deductible')?.get('addOnCover')?.value == false) {
          this.toast.warning({ detail: "Warning", summary: "Deductible Cover is mandatory", duration: 3000 });
          return;
        }
      }

      if (this.dynamicFormGroup.contains('accident')) {
        if (!this.dynamicFormGroup.contains('insuredMemberDetails')) {
          this.dynamicFormGroup.addControl('insuredMemberDetails', new FormArray([]));
        }
        let addOnData = this.dynamicFormGroup.get('accident')?.getRawValue();
        console.log(addOnData);
        this.formData.insuredMemberDetails.forEach((member: any, index: any) => {
          Object.keys(addOnData.addOnDetails).forEach((key) => {
            if (key == member.relation) {
              let memberSelected = false;
              addOnData.addOnDetails[key].forEach((addOnDetail: any) => {

                if (addOnDetail.memberCheckbox) {
                  memberSelected = true;
                  // console.log(addOnDetail);
                  // member.natureOfDutyCode = JSON.parse(addOnDetail.occupationRisk).value;
                  // console.log(member);

                }
                if (addOnDetail.occupation && memberSelected) {
                  member.occupationCode = addOnDetail.occupation == '' ? addOnDetail.occupation : JSON.parse(addOnDetail.occupation).value;
                }
                if (addOnDetail.occupationRisk && memberSelected) {
                  member.natureOfDutyCode = addOnDetail.occupationRisk == '' ? addOnDetail.occupationRisk : JSON.parse(addOnDetail.occupationRisk).value;
                }
              })
            }
          })
          const dynamicForm = this.dynamicFormGroup.get('insuredMemberDetails') as FormArray;

          while (dynamicForm.length <= index) {
            dynamicForm.push(new FormGroup({}));
          }

          const dindex = dynamicForm.at(index) as FormGroup;
          Object.keys(member).forEach((key: string) => {
            dindex.addControl(key, new FormControl(member[key]));
          });
        })
      }


    }

    if (this.form.formTitle == 'Insurance Details' && this.formData.productName == 'Activ One SAVR') {
      console.log(this.formData, this.hospiCashSelected);
      if (this.hospiCashSelected == false) {
        this.toast.warning({ detail: "Warning", summary: "Please include either Parents or Parents-in-law (Mother/Father/Father-in-law/Mother-in-law) respectively in the hospital cash coverage to complete the buying journey.", duration: 5000 });
        return;
      }
      else {
        // Set values for the controls
        const familyGroupControl = this.dynamicFormGroup.get('familyGroup');
        const selectedFamilyMembersControl = this.dynamicFormGroup.get('selectedFamilyMembers');
        const hospiCashSelectedControl = this.dynamicFormGroup.get('hospiCashSelected');
        const hospiCashTabControl = this.dynamicFormGroup.get('hospiCashTab');

        // Ensure each control exists and then set their values
        if (familyGroupControl) {
          familyGroupControl.setValue(this.familyGroup);
        }

        if (selectedFamilyMembersControl) {
          selectedFamilyMembersControl.setValue(this.selectedFamilyMembers); // Convert array to a comma-separated string if needed
        }

        if (hospiCashSelectedControl) {
          hospiCashSelectedControl.setValue(this.hospiCashSelected);
        }

        if (hospiCashTabControl) {
          hospiCashTabControl.setValue(this.hospiCashTab);
        }

      }

    }

    if (this.formData.productName.includes('Activ Care')) {
      this.dynamicFormGroup.get('familyPair')?.setValue(this.familyPair);
      this.dynamicFormGroup.get('selectedFamilyPair')?.setValue(this.selectedFamilyPair);
    }

    if ((policyType === 'Multi Individual' || policyType === 'Individual') && insuredMembers < 1) {
      this.toast.warning({ detail: "Warning", summary: "At least one member must be selected for Multi Individual policy", duration: 3000 });
      return;
    }
    else {
      if (this.getFormIndexValue() == 0 && this.formData.productName.includes('Activ Care') && this.dynamicFormGroup.get('memberPolicyType')?.value == 'Multi Individual') {
        const insuredMemberDetails = this.dynamicFormGroup.get('insuredMemberDetails') as FormArray;
        const ageFlag = insuredMemberDetails.controls.every((person: any) => {
          return parseInt(this.calculateAge(person.get('memberdob').value)) >= 55;  // Compare to number 55, not string '55'
        });
        if (!ageFlag) {
          insuredMemberDetails.controls.forEach((control: any, i: number) => {
            const memberdobControl = control.get('memberdob');
            if (memberdobControl) {
              const age = this.calculateAge(memberdobControl.value);
              if (age > "55") {
                memberdobControl.setErrors(null);
              } else {
                memberdobControl.setValue('');
                memberdobControl.setErrors({ required: true });
                this.toast.warning({
                  detail: 'Warning',
                  summary: `All people are 55 years or older.`,
                  duration: 3000
                });
              }
            }
          });
          event.stopPropogation();

        }
      }
      if (this.getFormIndexValue() == 0 && this.formData.productName.includes('Activ Care') && this.dynamicFormGroup.get('memberPolicyType')?.value == 'Family Floater') {
        const insuredMemberDetails = this.dynamicFormGroup.get('insuredMemberDetails') as FormArray;
        const ageFlag = insuredMemberDetails.controls.some((person: any) => {
          return parseInt(this.calculateAge(person.get('memberdob').value)) >= 55;  // Compare to the number 55, not the string "55"
        });

        if (!ageFlag) {
          insuredMemberDetails.controls.forEach((control: any, i: number) => {
            const memberdobControl = control.get('memberdob');
            if (memberdobControl) {
              const age = this.calculateAge(memberdobControl.value);
              if (age > "55") {
                memberdobControl.setErrors(null);
              } else {
                memberdobControl.setValue('');
                memberdobControl.setErrors({ required: true });
                this.toast.warning({
                  detail: 'Warning',
                  summary: 'At least one person is 55 years or older.',
                  duration: 3000
                });
              }
            }
          });
          //event.stopPropogation();
        }
      }
      if (this.dynamicFormGroup.valid &&
        (!this.dynamicFormGroup.get('nationality') || JSON.parse(this.dynamicFormGroup.get('nationality')?.value as any).value === 'Indian')) {

        //   // Flatten the form data
        if (this.dynamicFormGroup.get('insuredMemberDetails')) {
          this.dynamicFormGroup.get('numberOfInsuredMembers')?.setValue(this.dynamicFormGroup.get('insuredMemberDetails')?.value.length);
          this.dynamicFormGroup.get('insuredMemberDetails')?.value.forEach((element: any, index: any) => {
            element.memberIndex = index + 1;
          });
          this.dynamicFormGroup.get('insuredMemberDetails')?.value.forEach((member: any, index: any) => {
            if (member.relation == 'Self' && (this.dynamicFormGroup.get('memberDobProposer') || this.dynamicFormGroup.get('memberAgeProposer') || this.dynamicFormGroup.get('proposerGender')
              || this.dynamicFormGroup.get('emailId') || this.dynamicFormGroup.get('firstName') || this.dynamicFormGroup.get('middleName') || this.dynamicFormGroup.get('lastName') || this.dynamicFormGroup.get('preFix'))) {
              (this.dynamicFormGroup.get('insuredMemberDetails') as FormArray)?.controls[index].get('preFix')?.setValue(this.dynamicFormGroup.get('preFix')?.value);
              (this.dynamicFormGroup.get('insuredMemberDetails') as FormArray)?.controls[index].get('memberdob')?.setValue(this.dynamicFormGroup.get('memberDobProposer')?.value);
              (this.dynamicFormGroup.get('insuredMemberDetails') as FormArray)?.controls[index].get('memberAge')?.setValue(this.dynamicFormGroup.get('memberAgeProposer')?.value);
              (this.dynamicFormGroup.get('insuredMemberDetails') as FormArray)?.controls[index].get('memberGender')?.setValue(this.dynamicFormGroup.get('proposerGender')?.value);
              (this.dynamicFormGroup.get('insuredMemberDetails') as FormArray)?.controls[index].get('emailId')?.setValue(this.dynamicFormGroup.get('emailId')?.value);
              (this.dynamicFormGroup.get('insuredMemberDetails') as FormArray)?.controls[index].get('firstName')?.setValue(this.dynamicFormGroup.get('firstName')?.value);
              (this.dynamicFormGroup.get('insuredMemberDetails') as FormArray)?.controls[index].get('middleName')?.setValue(this.dynamicFormGroup.get('middleName')?.value);
              (this.dynamicFormGroup.get('insuredMemberDetails') as FormArray)?.controls[index].get('lastName')?.setValue(this.dynamicFormGroup.get('lastName')?.value);
              (this.dynamicFormGroup.get('insuredMemberDetails') as FormArray)?.controls[index].get('mobileNumber')?.setValue(this.dynamicFormGroup.get('mobileNumber')?.value);
              (this.dynamicFormGroup.get('insuredMemberDetails') as FormArray)?.controls[index].get('city')?.setValue(this.dynamicFormGroup.get('city')?.value);
              (this.dynamicFormGroup.get('insuredMemberDetails') as FormArray)?.controls[index].get('productMemberDesignation')?.setValue(this.dynamicFormGroup.get('occupation')?.value);
            }
          })
        }
        if (!this.pedWaitingPeriod && this.dynamicFormGroup.get('waitingPED') && (this.dynamicFormGroup.get('waitingPED') as FormGroup).get('waitingPeriodPED')?.value) {
          this.pedWaitingPeriod = (this.dynamicFormGroup.get('waitingPED') as FormGroup).get('waitingPeriodPED')?.value
        }
        const proposalRequiredDetails = {
          totalPremium: this.dynamicFormGroup.getRawValue().totalPremium,
          proposalNumber: this.proposalNum,
          covers: this.covers,
          PEDWaitingPeriod: this.pedWaitingPeriod ?? ""
        };

        sessionStorage.setItem("proposalRequiredDetails", this.encryptionService.encrypt(proposalRequiredDetails));
        const tempPremiumAmount = this.dynamicFormGroup.getRawValue().totalPremium;

        this.dynamicFormGroup.get('totalPremium')?.setValue(tempPremiumAmount);
        this.dynamicFormGroup.get('covers')?.setValue(this.covers);
        this.dynamicFormGroup.get('tenureAmount')?.setValue(this.tenureAmount);
        this.dynamicFormGroup.get('tenure')?.setValue(this.formData.tenure);
        this.dynamicFormGroup.get('quoteIdDetails')?.setValue(this.QuoteNumber);
        this.dynamicFormGroup.get('quoteId')?.setValue(this.formData.quoteId);
        this.dynamicFormGroup.get('displayTaxList')?.setValue(this.displayTaxList);


        // (this.dynamicFormGroup.get('insuredMemberDetails') as FormArray)?.controls.forEach((memberGroup:any,index: number)=>{
        //   memberGroup.get('covers')?.setValue(this.covers[index]);
        // })

        // if(this.dynamicFormGroup.getRawValue().tenureAmount){
        //   this.dynamicFormGroup.getRawValue().tenureAmount = this.tenureAmount;
        // }
        // if(this.dynamicFormGroup.getRawValue().displayTaxList){
        //   this.dynamicFormGroup.getRawValue().displayTaxList = this.displayTaxList;
        // }
        // this.saveData = JSON.parse(JSON.stringify(this.dynamicFormGroup.getRawValue()));
        // this.flattenObjectInsert(this.saveData);
        if (this.form.formTitle == 'Total Premium' && this.covers) {
          this.mappingCoversAccordingtoMember(this.form);
        }

        this.formData = { ...this.formData, ...this.dynamicFormGroup.getRawValue() };
        console.log(this.formData);
        if (
          this.formData &&
          (this.formData['sumInsured'] == null || this.formData['sumInsured'] === undefined) &&
          Array.isArray(this.formData.insuredMemberDetails) &&
          this.formData.insuredMemberDetails.length > 0 &&
          this.formData.insuredMemberDetails[0].sumInsured != null
        ) {
          this.formData['sumInsured'] = this.formData.insuredMemberDetails[0].sumInsured;
          this.dynamicFormGroup.get('sumInsured')?.setValue(this.formData.insuredMemberDetails[0].sumInsured);
        }
        if (this.form.formTitle.includes("Health & Lifestyle")) {
          await this.mappingForQuestionnaire(this.form);
        }

        if (this.form.formTitle.includes("Leads")) {
          this.formData.noOfChildrens = this.kidCount;
        }
        this.allJsonForm[this.getFormIndexValue()] = this.form;

        // if (this.form.saveBtnFunction) {
        //   await this.resolveMethod(this.form.saveBtnFunction);
        // }
        if (this.form.saveBtnFunction) {
          // if (this.form.saveBtnFunction === 'uploadSelectedDocument') {
          //   await this.uploadSelectedDocument();
          // } else {
          try {
            await this.resolveMethod(this.form.saveBtnFunction);
          } catch (error: any) {
            console.error("Process stopped due to error:", error.message);
            return;
          }
        }
        sessionStorage.setItem("allFormData", this.encryptionService.encrypt(this.formData));
        sessionStorage.setItem("allJsonForm", this.encryptionService.encrypt(this.allJsonForm));

        if (this.form.formTitle.includes("Total Premium")) {
          sessionStorage.setItem("addOnList", this.encryptionService.encrypt(this.addOnList));
          sessionStorage.setItem("addOnDetails", this.encryptionService.encrypt(this.addOnDetails));
          sessionStorage.setItem('tenureAmount', this.encryptionService.encrypt(this.tenureAmount));
          sessionStorage.setItem('taxList', this.encryptionService.encrypt(this.taxList));
          sessionStorage.setItem('discountList', this.encryptionService.encrypt(this.discountList));
          sessionStorage.setItem('basePremiumList', this.encryptionService.encrypt(this.basePremiumList));
          sessionStorage.setItem('selectedIndex', this.encryptionService.encrypt(this.selectedIndex));

          if (this.QuoteNumber.length > 0) {
            this.formData.quoteId = this.QuoteNumber[this.selectedIndex];
          }

        }


        if (this.dynamicFormGroup.get('leadFirstName') && this.dynamicFormGroup.get('leadMiddleName') &&
          this.dynamicFormGroup.get('leadLastName') && this.dynamicFormGroup.get('leadMobileNo') &&
          this.dynamicFormGroup.get('leadEmailId') && this.dynamicFormGroup.get('generateLead')) {
          for (let i = 0; i < this.formData.insuredMemberDetails.length; i++) {
            let relation = JSON.parse(this.formData.insuredMemberDetails[i].relationshipType);
            if (relation.value == 'Self') {
              this.formData.insuredMemberDetails[i].memberType = this.formData.insuredMemberDetails[i].relationshipType;
              this.formData.insuredMemberDetails[i].firstName = this.dynamicFormGroup.get('leadFirstName')?.value;
              this.formData.insuredMemberDetails[i].middleName = this.dynamicFormGroup.get('leadMiddleName')?.value;
              this.formData.insuredMemberDetails[i].lastName = this.dynamicFormGroup.get('leadLastName')?.value;
              this.formData.insuredMemberDetails[i].mobileNumber = this.dynamicFormGroup.get('leadMobileNo')?.value;
              this.formData.insuredMemberDetails[i].emailId = this.dynamicFormGroup.get('leadEmailId')?.value;
            }
          }
        }

        console.log(this.dynamicFormGroup.getRawValue());

        //   // for Store Form Data in Database
        let reqData = {
          "proposalNum": this?.formData?.proposalNumber,
          "partnerId": this.partnerId,
          "agentCode": this.agentCode,
          "formData": JSON.stringify(this.dynamicFormGroup.getRawValue()),
          "formName": this.formSequence[this.getFormIndexValue()].formName,
          "formConfig": JSON.stringify(this.formSequence),
          "productId": this.productId.toString(),
          "formId": this.formSequence[this.getFormIndexValue()].formId,
          "jsonForm": JSON.stringify(this.form),
          "formSequence": this.getFormIndexValue(),
          "leadNumber": this.leadnumber,
          "quoteNumber": this.formData.quoteId ? this.formData.quoteId : ""
        };
        await this.yatraService.Insertorupdateformdata(reqData).subscribe({
          next: (res: any) => {
            this.leadnumber = res.data;

            // Call getFormDataFromFormSequence only after insert/update is completed
            if (this.getFormIndexValue() < this.formSequence.length - 1) {
              this.incrementIndex();
              this.getFormDataFromFormSequence(this.formSequence[this.getFormIndexValue()].formId);
            }

            if (this.isQuote) {
              this.isQuote = false;
              sessionStorage.setItem("isQuote", this.isQuote.toString());
            }

            this.quickQuoteRedirect = false;
          },
          error: (err) => {
            console.error(err);
          }
        });

      }
      else {
        console.log('Form is invalid', this.dynamicFormGroup);

        let firstInvalidTabIndex: number | null = null;
        if (this.dynamicFormGroup.get('insuredMemberDetails')) {
          this.form.formSections.forEach(section => {
            section.formControls.forEach(control => {
              if (control.dynamicControls) {
                control.dynamicControls.forEach((tabControls: any, tabIndex: number) => {
                  const formGroup = (this.dynamicFormGroup.get('insuredMemberDetails') as FormArray).controls.at(tabIndex); // Assuming tabIndex maps to form group
                  if (formGroup && formGroup.invalid && firstInvalidTabIndex === null) {
                    firstInvalidTabIndex = tabIndex; // Capture the first invalid tab
                  }
                })
              }
            })
          })
        }

        Object.keys(this.dynamicFormGroup.controls).forEach(field => {
          const control = this.dynamicFormGroup.get(field);
          if (control instanceof FormArray) {
            control.controls.forEach(arrayControl => {
              if (arrayControl instanceof FormGroup) {
                Object.keys(arrayControl.controls).forEach(nestedField => {
                  const nestedControl = arrayControl.get(nestedField);
                  if (nestedControl instanceof FormGroup) {
                    nestedControl?.markAsDirty({ onlySelf: true });
                    nestedControl?.markAsTouched({ onlySelf: true });
                    Object.keys(nestedControl.controls).forEach((innerField) => {
                      const innerControl = nestedControl.get(innerField);
                      innerControl?.markAsTouched({ onlySelf: true });
                    })
                  } else if (nestedControl instanceof FormArray) {
                    Object.keys(nestedControl.controls).forEach((innerField) => {
                      const innerControl = nestedControl.get(innerField);

                      if (innerControl instanceof FormArray || innerControl instanceof FormGroup) {
                        // Recursively mark inner controls as touched
                        this.markNestedControlsAsTouched(innerControl);  // You'd need to implement this function
                      } else {
                        innerControl?.markAsTouched({ onlySelf: true });
                      }
                    });
                  }

                  else
                    nestedControl?.markAsTouched({ onlySelf: true });
                });
              } else {
                arrayControl?.markAsTouched({ onlySelf: true });
              }
            });
          }
          else if (control instanceof FormGroup) {
            control?.markAsDirty({ onlySelf: true });
            const controlKeys = Object.keys(control.controls);

            if (controlKeys.length > 0) {
              controlKeys.forEach(key => {
                const innerControl = control.controls[key];
                if (innerControl instanceof FormGroup) {
                  Object.keys(innerControl.controls).forEach((innerField) => {
                    const innControl = innerControl.get(innerField);
                    innControl?.markAsTouched({ onlySelf: true });
                  })
                }
                else {
                  innerControl?.markAsDirty({ onlySelf: true });
                }
              });
            }
          }
          else {
            control?.markAsTouched({ onlySelf: true });
          }
        });
        if (this.dynamicFormGroup.invalid) {
          this.toast.warning({ detail: "Warning", summary: "Please fill the mandatory fields", duration: 3000 });

          this.scrollToFirstInvalidField();

          if (firstInvalidTabIndex !== null) {
            // Navigate to the first invalid tab
            this.activeMemberTabIndex = firstInvalidTabIndex;
            // this.changeDetectorRef.detectChanges(); // Ensure change detection syncs the tab
          }
        }
        else if (this.dynamicFormGroup.get('nationality') && this.dynamicFormGroup.get('nationality')?.value !== 'Indian')
          this.toast.warning({ detail: "Warning", summary: "Indian residency is required", duration: 3000 })
      }

    }
    if (this.form.formTitle == 'Health & Lifestyle') {
      console.log("self legth", this.formData.insuredMemberDetails[0]?.productQuestionnaire?.length);
      console.log("spouse legth", this.formData.insuredMemberDetails[1]?.productQuestionnaire?.length);
    }
    if (this.form.formTitle == 'Policy Summary') {
      console.log("self legth", this.formData.insuredMemberDetails[0]?.productQuestionnaire?.length);
      console.log("spouse legth", this.formData.insuredMemberDetails[1]?.productQuestionnaire?.length);
    }

    if (this.dynamicFormGroup.contains('agentId')) {
      const selectedAgentId = this.dynamicFormGroup.get('agentId')?.value;

      if (selectedAgentId) {
        localStorage.setItem('parentCode', selectedAgentId);
        console.log("Updated agentCode in localStorage:", selectedAgentId);
      }
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
          // Extract control name and visibility from either string or object
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
                          let dparentControl = this.dynamicFormGroup.get(control.name) as FormGroup;
                          let dcontrol = dparentControl.get(subControl.name) as FormGroup;
                          let dsubControl = dcontrol.get(subControl.innerSubControls[controlIndex].name) as FormArray;
                          let dindexj = dsubControl.at(zindex) as FormGroup;
                          let dinnercontrol = dindexj.get(innerControl.name) as FormGroup;
                          if (innerControl.visible == false && innerControl.dependentControls && innerControl.dependentControls.length > 0) {
                            if (dinnercontrol instanceof FormControl) {
                              dinnercontrol.setValue(false);
                            }
                            innerControl.dependentControls.forEach((dependentName: string) => {
                              // Find the dependent control in coreControls
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
                              // else {
                              //   console.log('Dependent Control not found for:', dependentName);
                              // }
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
                          let dparentControl = this.dynamicFormGroup.get(control.name) as FormGroup;
                          let dcontrol = dparentControl.get(subControl.name) as FormArray;
                          // let dsubControl = dcontrol.get(subControl.innerArrayControl[controlIndex].name) as FormArray;
                          let dindexj = dcontrol.at(controlIndex) as FormGroup;
                          let dinnercontrol = dindexj.get(innerControl.name) as FormGroup;
                          if (innerControl.visible == false && innerControl.dependentControls && innerControl.dependentControls.length > 0) {
                            if (dinnercontrol instanceof FormControl) {
                              dinnercontrol.setValue(false);
                            }
                            innerControl.dependentControls.forEach((dependentName: string) => {
                              // Find the dependent control in coreControls
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
                  this.dynamicFormGroup.get(control.name)?.setValidators(controlValidators);
                  this.dynamicFormGroup.get(control.name)?.updateValueAndValidity();
                  if (control.name == 'zoneValue' && control.type == 'select') {
                    control.options = this.formData.availableZones.map((zone: any) => ({
                      name: zone,
                      value: zone
                    }));
                  }
                } else {
                  this.dynamicFormGroup.get(control.name)?.clearValidators();
                  this.dynamicFormGroup.get(control.name)?.reset();
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

  changeHospiCoverDependentControls(dependentControlNames: (string | { name: string; visibility: boolean })[],
    visibility: boolean,
    controlName: string,
    parentControlName: string,
    controlIndex: number | null = null,
    innerControl: any = null,
    innerControlIndex: any = null) {


    console.log(dependentControlNames, visibility, controlName, parentControlName, controlIndex, innerControl, innerControlIndex);

    if (dependentControlNames) {
      dependentControlNames.forEach((dependent) => {
        // Extract control name and visibility from either string or object
        const dependentName = typeof dependent === 'string' ? dependent : dependent.name;
        const dependentVisibility = typeof dependent === 'string' ? visibility : dependent.visibility;
        this.form.formSections.forEach((section: IFormSections) => {
          section.formControls.forEach((control: IFormControl) => {
            if (control.dynamicControls && controlIndex != null && control.dynamicControls.length > controlIndex) {
              const targetDynamicControl = JSON.parse(JSON.stringify(control.dynamicControls[controlIndex + 1]));
              console.log(targetDynamicControl);

              targetDynamicControl.forEach((dynamicControl: IDynamicControl) => {
                if (dynamicControl.name == controlName && dynamicControl.subControls) {
                  dynamicControl.subControls[innerControlIndex].forEach((innerControl: any) => {
                    if (innerControl.name == dependentName) {
                      innerControl.visible = dependentVisibility;
                      if (dependentVisibility) {
                        const controlValidators: any[] = [];
                        innerControl?.validators?.forEach((validator: any) => {
                          if (validator.validatorName === 'required') controlValidators.push(Validators.required);
                          if (validator.validatorName === 'email') controlValidators.push(Validators.email);
                          if (validator.validatorName === 'minlength') controlValidators.push(Validators.minLength(validator.minLength));
                          if (validator.validatorName === 'maxlength') controlValidators.push(Validators.maxLength(validator.maxLength));
                          if (validator.validatorName === 'pattern') controlValidators.push(Validators.pattern(validator.pattern));
                        });

                        const formArray = this.dynamicFormGroup.get(parentControlName) as FormArray;
                        console.log(formArray);

                        const memberGroup = formArray.at(controlIndex) as FormGroup;
                        console.log(memberGroup);

                        const memberGroupControlArray = memberGroup.get(controlName) as FormArray;
                        console.log(memberGroupControlArray);

                        const memberGroupInnerControlGroup = memberGroupControlArray.at(innerControlIndex) as FormGroup;
                        console.log(memberGroupInnerControlGroup);

                        const memberGroupInnerControl = memberGroupInnerControlGroup.get(innerControl.name);
                        console.log(memberGroupInnerControl);

                        memberGroupInnerControl?.setValidators(controlValidators);
                        memberGroupInnerControl?.updateValueAndValidity();

                      }
                      else {
                        const formArray = this.dynamicFormGroup.get(parentControlName) as FormArray;
                        const memberGroup = formArray.at(controlIndex) as FormGroup;
                        const memberGroupControlArray = memberGroup.get(controlName) as FormArray;
                        const memberGroupInnerControlGroup = memberGroupControlArray.at(innerControlIndex) as FormGroup;
                        const memberGroupInnerControl = memberGroupInnerControlGroup.get(innerControl.name);
                        memberGroupInnerControl?.clearValidators();
                        memberGroupInnerControl?.updateValueAndValidity();
                      }
                    }
                  })
                }
                else if (dynamicControl.name == controlName && dynamicControl.innerArrayControl) {
                  console.log(dynamicControl);

                  dynamicControl.innerArrayControl[innerControlIndex + 1].forEach((innerControl: any) => {
                    if (innerControl.name == dependentName) {
                      innerControl.visible = dependentVisibility;
                      if (dependentVisibility) {
                        const controlValidators: any[] = [];
                        innerControl?.validators?.forEach((validator: any) => {
                          if (validator.validatorName === 'required') controlValidators.push(Validators.required);
                          if (validator.validatorName === 'email') controlValidators.push(Validators.email);
                          if (validator.validatorName === 'minlength') controlValidators.push(Validators.minLength(validator.minLength));
                          if (validator.validatorName === 'maxlength') controlValidators.push(Validators.maxLength(validator.maxLength));
                          if (validator.validatorName === 'pattern') controlValidators.push(Validators.pattern(validator.pattern));
                        });

                        const formArray = this.dynamicFormGroup.get(parentControlName) as FormArray;
                        console.log(formArray);

                        const memberGroup = formArray.at(controlIndex) as FormGroup;
                        console.log(memberGroup);

                        const memberGroupControlArray = memberGroup.get(controlName) as FormArray;
                        console.log(memberGroupControlArray);

                        const memberGroupInnerControlGroup = memberGroupControlArray.at(innerControlIndex) as FormGroup;
                        console.log(memberGroupInnerControlGroup);

                        const memberGroupInnerControl = memberGroupInnerControlGroup.get(innerControl.name);
                        console.log(memberGroupInnerControl);

                        memberGroupInnerControl?.setValidators(controlValidators);
                        memberGroupInnerControl?.updateValueAndValidity();

                      }
                      else {
                        const formArray = this.dynamicFormGroup.get(parentControlName) as FormArray;
                        const memberGroup = formArray.at(controlIndex) as FormGroup;
                        const memberGroupControlArray = memberGroup.get(controlName) as FormArray;
                        const memberGroupInnerControlGroup = memberGroupControlArray.at(innerControlIndex) as FormGroup;
                        const memberGroupInnerControl = memberGroupInnerControlGroup.get(innerControl.name);
                        memberGroupInnerControl?.value == true ? memberGroupInnerControl?.value == false : memberGroupInnerControl?.setValue('');
                        memberGroupInnerControl?.clearValidators();
                        memberGroupInnerControl?.updateValueAndValidity();
                      }
                    }
                  })
                }
              })

              control.dynamicControls[controlIndex + 1] = targetDynamicControl;

            }
            // else if (control.name == parentControlName && control.subControls) {
            //   control.subControls.forEach((subControl: any) => {
            //     if (subControl.name == controlName && controlIndex != null) {
            //       subControl.innerSubControls[controlIndex].coreControls.forEach((innerControl: any, zindex: any) => {
            //         if (innerControl.name == dependentName) {
            //           innerControl.visible = visibility;
            //           let dparentControl = this.dynamicFormGroup.get(control.name) as FormGroup;
            //           let dcontrol = dparentControl.get(subControl.name) as FormGroup;
            //           let dsubControl = dcontrol.get(subControl.innerSubControls[controlIndex].name) as FormArray;
            //           let dindexj = dsubControl.at(zindex) as FormGroup;
            //           let dinnercontrol = dindexj.get(innerControl.name) as FormGroup;
            //           if (innerControl.visible == false && innerControl.dependentControls && innerControl.dependentControls.length > 0) {
            //             if (dinnercontrol instanceof FormControl) {
            //               dinnercontrol.setValue(false);
            //             }
            //             innerControl.dependentControls.forEach((dependentName: string) => {
            //               // Find the dependent control in coreControls
            //               const dependentControlIndex = subControl.innerSubControls[controlIndex].coreControls.findIndex(
            //                 (control: any) => control.name === dependentName
            //               );
            //               let dependentControl = subControl.innerSubControls[controlIndex].coreControls[dependentControlIndex];

            //               if (dependentControl) {
            //                 dependentControl.visible = visibility;
            //                 dindexj = dsubControl.at(dependentControlIndex) as FormGroup;
            //                 dinnercontrol = dindexj.get(dependentControl.name) as FormGroup;
            //                 Object.keys(dinnercontrol.controls).forEach((element: any) => {
            //                   dinnercontrol.removeControl(element);
            //                 });
            //               }
            //               // else {
            //               //   console.log('Dependent Control not found for:', dependentName);
            //               // }
            //             });
            //           }
            //           if (innerControl.innerControls && innerControl.visible == true) {
            //             this.initializeSubControls(innerControl.innerControls, dinnercontrol)
            //           }
            //           else if (innerControl.innerControls && innerControl.visible == false) {
            //             Object.keys(dinnercontrol.controls).forEach((element: any) => {
            //               dinnercontrol.removeControl(element);
            //             });
            //           }
            //         }
            //       })
            //     }
            //   })
            // }
            // else if (control.name == parentControlName && control.dynamicControls && controlIndex != null) {
            //   const targetDynamicControl = JSON.parse(JSON.stringify(control.dynamicControls[controlIndex]));
            //   targetDynamicControl.forEach((dynamicControl: IDynamicControl) => {
            //     if (dynamicControl.name == controlName && dynamicControl.innerControls) {
            //       dynamicControl.innerControls.forEach((innerArrayControl: any) => {
            //         if (innerArrayControl.name == innerControl) {
            //           innerArrayControl.visible = visibility;
            //         }
            //       })
            //     }
            //   })
            // }
            // else if (control.name === dependentName) {
            //   control.visible = dependentVisibility;
            //   if (dependentVisibility) {
            //     let controlValidators: any = [];
            //     control.validators?.forEach((val: IValidator) => {
            //       if (val.validatorName === 'required') controlValidators.push(Validators.required);
            //       if (val.validatorName === 'email') controlValidators.push(Validators.email);
            //       if (val.validatorName === 'minlength') controlValidators.push(Validators.minLength(val.minLength as number));
            //       if (val.validatorName === 'maxlength') controlValidators.push(Validators.maxLength(val.maxLength as number));
            //       if (val.validatorName === 'pattern') controlValidators.push(Validators.pattern(val.pattern as string));
            //     });
            //     this.dynamicFormGroup.get(control.name)?.setValidators(controlValidators);
            //     this.dynamicFormGroup.get(control.name)?.updateValueAndValidity();
            //     if (control.name == 'zoneValue' && control.type == 'select') {
            //       control.options = this.formData.availableZones.map((zone: any) => ({
            //         name: zone,
            //         value: zone
            //       }));
            //     }
            //   } else {
            //     this.dynamicFormGroup.get(control.name)?.clearValidators();
            //     this.dynamicFormGroup.get(control.name)?.reset();
            //   }
            // }
          });
        });
      });
      this.changeDetectorRef.detectChanges();
    }
  }

  // changeHospiCoverDependentControls(
  //   dependentControlNames: (string | { name: string; visibility: boolean })[],
  //   visibility: boolean,
  //   controlName: string,
  //   parentControlName: string,
  //   controlIndex: number | null = null,
  //   innerControl: any = null,
  //   innerControlIndex: any = null
  // ) {
  //   console.log(controlName, parentControlName, controlIndex, innerControl, innerControlIndex);

  //   if (dependentControlNames) {
  //     dependentControlNames.forEach((dependent) => {
  //       // Extract control name and visibility from either string or object
  //       const dependentName = typeof dependent === 'string' ? dependent : dependent.name;
  //       const dependentVisibility = typeof dependent === 'string' ? visibility : dependent.visibility;

  //       // Get the dynamic form control hierarchy
  //       const formArray = this.dynamicFormGroup.get(parentControlName) as FormArray;
  //       if (!formArray || controlIndex === null) return;

  //       const memberGroup = formArray.at(controlIndex) as FormGroup;
  //       const memberGroupControlArray = memberGroup.get(controlName) as FormArray;
  //       if (!memberGroupControlArray || innerControlIndex === null) return;

  //       const memberGroupInnerControlGroup = memberGroupControlArray.at(innerControlIndex) as FormGroup;
  //       const memberGroupInnerControl = memberGroupInnerControlGroup.get(dependentName);

  //       if (memberGroupInnerControl) {
  //         // Set visibility of the control
  //         if (dependentVisibility) {
  //           // Add validations if visible
  //           const controlValidators: any[] = [];
  //           innerControl?.validators?.forEach((validator: any) => {
  //             if (validator.validatorName === 'required') controlValidators.push(Validators.required);
  //             if (validator.validatorName === 'email') controlValidators.push(Validators.email);
  //             if (validator.validatorName === 'minlength') controlValidators.push(Validators.minLength(validator.minLength));
  //             if (validator.validatorName === 'maxlength') controlValidators.push(Validators.maxLength(validator.maxLength));
  //             if (validator.validatorName === 'pattern') controlValidators.push(Validators.pattern(validator.pattern));
  //           });
  //           memberGroupInnerControl.setValidators(controlValidators);
  //           memberGroupInnerControl.updateValueAndValidity();
  //         } else {
  //           // Remove validations if not visible
  //           memberGroupInnerControl.clearValidators();
  //           memberGroupInnerControl.updateValueAndValidity();
  //           memberGroupInnerControl.setValue(false); // Reset value to false
  //         }

  //         // Update the visibility in the control object
  //         innerControl.visible = dependentVisibility;
  //       }
  //     });

  //     this.changeDetectorRef.detectChanges();
  //   }
  // }




  generateLeadAndProposalId(control: any) {
    if (this.dynamicFormGroup.valid) {
      this.form.formSections.forEach((section: any) => {
        section.formControls.forEach((formControl: any) => {
          if (formControl.name == control.name) {
            formControl.visible = false;
            const dependentControlName = formControl.dependentControl[0];
            const dependentControl = section.formControls.find((fc: any) => fc.name === dependentControlName);

            if (dependentControl) {
              dependentControl.visible = true;
            }
          }
        })
      })
      const reqData = {
        "proposalNum": this.proposalNum,
        "productId": this.productid,
        "insuranceTypeCode": this.insurancetypecode,
        "leadFirstName": this.dynamicFormGroup.get('leadFirstName')?.value,
        "leadLastName": this.dynamicFormGroup.get('leadLastName')?.value,
        "leadMobileNo": this.dynamicFormGroup.get('leadMobileNo')?.value,
        "leadEmailId": this.dynamicFormGroup.get('leadEmailId')?.value,
      }
      // this.adminService.insertLeadDetails(reqData).subscribe({
      //   next: (res) => {
      //     this.leadId = res.leadId;
      //     this.proposalId = res.proposalId;
      //     this.quoteId = res.quoteId;
      //     sessionStorage.setItem("leadId", this.encryptionService.encrypt(this.leadId));
      //     this.dynamicFormGroup.addControl("leadId", this.fb.control(this.leadId));
      //     sessionStorage.setItem("proposalId", this.encryptionService.encrypt(this.proposalId));
      //     this.dynamicFormGroup.addControl("proposalId", this.fb.control(this.proposalId));
      //     sessionStorage.setItem("quoteId", this.encryptionService.encrypt(this.quoteId));
      //     this.dynamicFormGroup.addControl("quoteId", this.fb.control(this.quoteId));
      //     this.toast.success({ detail: "Success", summary: "Lead Created Successfully.", duration: 3000 });

      //   },
      //   error: (err) => {
      //     console.error(err);
      //   }
      // });
    }
    else {
      Object.keys(this.dynamicFormGroup.controls).forEach(field => {
        const control = this.dynamicFormGroup.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
      this.toast.warning({ detail: "Warning", summary: "Please fill the mandatory fields", duration: 3000 })
    }
  }

  // async getPremiumAmount() {

  //   if (this.changesMade) {
  //     this.changeRecalculate(false);
  //   }

  //   if (this.isQuote == false) {
  //     if (Object.keys(this.formData).length > 0) {
  //       // const modifiedInsuredMemberDetails = JSON.parse(JSON.stringify(this.formData));
  //       this.formData.insuredMemberDetails.forEach((member: any) => {

  //         // Only set 'covers' if it doesn't exist
  //         if (!member.hasOwnProperty('covers')) {
  //           member['covers'] = [];
  //         }

  //         // Only set 'isChronic' if it doesn't exist
  //         if (!member.hasOwnProperty('isChronic')) {
  //           member['isChronic'] = "No";
  //         }

  //         // Only set 'chronicDiseases' if it doesn't exist
  //         if (!member.hasOwnProperty('chronicDiseases')) {
  //           member['chronicDiseases'] = null;
  //         }

  //         // Only set 'roomCategory' if it doesn't exist
  //         if (!member.hasOwnProperty('roomCategory')) {
  //           member['roomCategory'] = "";
  //         }

  //         // Assign 'memberRelationCode' based on the relation, only if it's not already set
  //         if (!member.hasOwnProperty('memberRelationCode')) {
  //           if (member.relation === 'Self') {
  //             member['memberRelationCode'] = 24;
  //           } else if (member.relation === 'Spouse') {
  //             member['memberRelationCode'] = 22;
  //           } else if (member.relation.includes('Son')) {
  //             member['memberRelationCode'] = 23;
  //           } else if (member.relation.includes('Daughter')) {
  //             member['memberRelationCode'] = 19;
  //           }
  //         }
  //       });


  //       if (this.formData['sumInsured'] == null) {
  //         this.formData['sumInsured'] = this.formData.insuredMemberDetails[0].sumInsured;
  //       }

  //       this.formData['familySize'] = this.formData.insuredMemberDetails.length + 'A';
  //       this.formData['proposerName'] = this.formData['firstName'] + this.formData['lastName'];

  //       if (this.formData.memberPolicyType == 'Family Floater') {
  //         this.formData.insuredMemberDetails.forEach((member: any) => {
  //           member.pincode = this.formData['proposerPincode']
  //         })
  //       }
  //       else
  //         this.formData['proposerPincode'] = this.formData.insuredMemberDetails[0].pincode;


  //       let reqData = {
  //         "agentCode": this.agentCode,
  //         "productId": this.productId,
  //         "quoteData": JSON.stringify(this.formData)
  //       }


  //       this.commonService.GetSingleProductQuote(reqData).pipe(
  //         tap((res: any) => {
  //           this.spinner.hide();
  //           // Update tenureAmount and discountList after receiving the response
  //           this.QuoteNumber = [];
  //           for (let i = 1; i <= 3; i++) {
  //             const premiumKey = `tenure${i}Premium`;
  //             const discountKey = `t${i}DiscountPercentage`;
  //             const Quote = `tenure${i}QuoteNumber`
  //             this.QuoteNumber.push(res.data[Quote]);

  //             this.tenureAmount[i - 1] = Math.round(res.data[premiumKey]);
  //             this.discountList[i - 1] = res.data[discountKey] ? res.data[discountKey] : 0;
  //           }
  //           this.formData.quoteId = this.QuoteNumber[this.selectedIndex];
  //           // this.formData.tenure = this.selectedIndex;

  //           if(this.form.formTitle =='Total Premium'){

  //             this.formData.tenureAmount = this.tenureAmount;
  //             this.formData.displayTaxList = this.displayTaxList;
  //           }
  //           sessionStorage.setItem("allFormData", this.encryptionService.encrypt(this.formData));
  //         })
  //       ).subscribe({
  //         next: () => {
  //           // After setting tenureAmount and discountList, call setPremiumAmount()
  //           this.setPremiumAmount();
  //           this.spinner.hide();
  //         },
  //         error: (err) => {
  //           this.spinner.hide();
  //         }
  //       });


  //     }
  //   }


  //   // this.premiumDetails = [];
  //   // this.premiumAmountDetails = [];
  //   // var relationShip: string = '';
  //   // var maxAge: number = 0;

  //   // if (this.formData.planType === 'Multi Individual' || this.formData.planType === 'Individual') {
  //   //   relationShip = 'Multi Individual'
  //   // }
  //   // else {
  //   //   this.formData.insuredMemberDetails.forEach((member: any) => {
  //   //     if (relationShip.length > 0)
  //   //       relationShip += ','

  //   //     relationShip += JSON.parse(member.relationshipType).value;

  //   //     if (member.memberAge > maxAge) {
  //   //       maxAge = member.memberAge;
  //   //     }

  //   //   })
  //   // }

  //   // if (Object.keys(this.formData).length > 0) {
  //   //   const modifiedInsuredMemberDetails = JSON.parse(JSON.stringify(this.formData));
  //   //   modifiedInsuredMemberDetails.insuredMemberDetails.forEach((member: any) => {
  //   //     const relationshipValue = JSON.parse(member.relationshipType);
  //   //     member.relationshipType = relationshipValue.value;
  //   //     member['relationShip'] = relationShip;
  //   //     member['prodCd'] = ''
  //   //     if (this.formData.memberPolicyType == 'Family Floater') {
  //   //       member['sumInsured'] = this.formData.memberSumInsured;
  //   //       member['zone'] = this.formData.zone;
  //   //       member['city'] = this.formData.city;
  //   //       member.prodCd = this.formData.memberPlan;
  //   //       member.memberAge = maxAge;
  //   //       member['pincode'] = this.formData.pincode;
  //   //       // member['preExistingDisease'] = "no";
  //   //     }
  //   //   });


  //   //   if (modifiedInsuredMemberDetails.productType == 'AS') {
  //   //     const transformedInsuredMemberDetails: any[] = [];

  //   //     modifiedInsuredMemberDetails.insuredMemberDetails.forEach((member: any) => {

  //   //       var commonDetails = {};
  //   //       Object.keys(member).forEach((key: string) => {
  //   //         if (!Array.isArray(member[key])) {
  //   //           if (key === "isEarning") {
  //   //             if (member[key])
  //   //               commonDetails = { ...commonDetails, "isEarning": 1 };
  //   //             else
  //   //               commonDetails = { ...commonDetails, "isEarning": 0 };
  //   //           }
  //   //           else
  //   //             commonDetails = { ...commonDetails, [key]: member[key] };
  //   //         }
  //   //       });



  //   //       Object.keys(member).forEach((key: string) => {

  //   //         if (Array.isArray(member[key]) && member[key].length > 0) {

  //   //           const addOn = member[key][0];
  //   //           const firstKey = Object.keys(addOn)[0];

  //   //           if (addOn[firstKey]) {
  //   //             if (addOn.coverType == "PA") {
  //   //               addOn['riskClass'] = JSON.parse(addOn.natureOfDuties).value;
  //   //             }
  //   //             transformedInsuredMemberDetails.push({ ...commonDetails, ...addOn });
  //   //           }
  //   //         }
  //   //       });
  //   //     });
  //   //     modifiedInsuredMemberDetails.insuredMemberDetails = transformedInsuredMemberDetails;
  //   //   }
  //   //   var reqData = {
  //   //     code: this.Code,
  //   //     insuranceTypeCode: this.insurancetypecode,
  //   //     productId: this.productid,
  //   //     configuration_Json: JSON.stringify(modifiedInsuredMemberDetails)
  //   //   };



  //   //   try {

  //   //     let quoteResponse: any;

  //   //     if (this.formData.productType == 'AF') {
  //   //       quoteResponse = await new Promise((resolve, reject) => {
  //   //         this.service.getActiveFitQoute(reqData).subscribe({
  //   //           next: (res) => {
  //   //             resolve(res)
  //   //           },
  //   //           error: (err) => { reject(err) }
  //   //         });
  //   //       });
  //   //     }
  //   //     else {
  //   //       quoteResponse = await new Promise((resolve, reject) => {
  //   //         this.service.getQoute(reqData).subscribe({
  //   //           next: (res) => {
  //   //             resolve(res)
  //   //           },
  //   //           error: (err) => { reject(err) }
  //   //         });
  //   //       });
  //   //     }

  //   //     if (this.formData.planType == 'Multi Individual' || this.formData.planType == 'Individual') {
  //   //       quoteResponse.forEach((element: any) => {
  //   //         element.prmMemDtlSecureEntity.forEach((member: any) => {
  //   //           let tempArray: number[] = [];
  //   //           member.premium.forEach((premium: any) => {
  //   //             // if (premium.tenure === 1) {
  //   //             //   this.tenureAmount[premium.te] += premium.premium || 0;
  //   //             // } else if (premium.tenure === 2) {
  //   //             //   this.tenure2Total += premium.premium || 0;
  //   //             // } else if (premium.tenure === 3) {
  //   //             //   this.tenure3Total += premium.premium || 0;
  //   //             // }
  //   //             this.tenureAmount[premium.tenure - 1] += premium.premium || 0;
  //   //             tempArray.push(premium.premium);
  //   //           });

  //   //           this.premiumDetails.push(member.premium);
  //   //           this.premiumAmountDetails.push(tempArray);
  //   //         });
  //   //       });
  //   //       sessionStorage.setItem("premiumAmountDetails", this.encryptionService.encrypt(this.premiumAmountDetails));
  //   //     }
  //   //     else {
  //   //       quoteResponse.forEach((element: any) => {
  //   //         let tempArray: number[] = [];
  //   //         element.prmMemDtlSecureEntity[0].premium.forEach((premium: any) => {
  //   //           this.tenureAmount[premium.tenure - 1] += premium.premium || 0;
  //   //           tempArray.push(premium.premium);
  //   //         });

  //   //         this.premiumAmountDetails.push(tempArray);
  //   //       })

  //   //       for (let i = 0; i < this.formData.numberOfInsuredMembers - 1; i++) {
  //   //         this.premiumAmountDetails.push([0, 0, 0]);
  //   //       }
  //   //     }



  //   //     this.tenureAmount.forEach(member => {

  //   //     })

  //   //     // Second API Call
  //   //     let reqData2: {
  //   //       productType: any;
  //   //       overAllSIAge: number[];
  //   //       totalPremium: number[][];
  //   //       valueUnit: any[];
  //   //       yearlyDiscount: number[];
  //   //       zoneDiscount: number;
  //   //       memberDiscount: number;
  //   //       addOnList: any[];
  //   //     };

  //   //     var overAllSIAge: number[] = [];
  //   //     var valueUnit: any[] = [];


  //   //     this.formData['insuredMemberDetails'].forEach((member: any) => {
  //   //       overAllSIAge.push(parseInt(member.memberAge));
  //   //       valueUnit.push(null);
  //   //     });

  //   //     reqData2 = {
  //   //       productType: this.formData['productType'],
  //   //       overAllSIAge: overAllSIAge,
  //   //       totalPremium: this.premiumAmountDetails,
  //   //       valueUnit: valueUnit,
  //   //       yearlyDiscount: [0, 7.5, 10],
  //   //       zoneDiscount: this.formData.productType == 'AF' || this.formData.productType == 'AA' || this.formData.productType == 'AO' || this.formData.productType == 'AC' || this.formData.productType == 'AGS' || this.formData.productType == 'STUB' || this.formData.productType == 'GHS' ? 0 : 9,
  //   //       memberDiscount: 0,
  //   //       addOnList: this.addOnList
  //   //     };

  //   //     if (this.formData['numberOfInsuredMembers'] > 1 && this.formData['planType'] == 'Multi Individual') {
  //   //       reqData2.memberDiscount = 5;
  //   //     }
  //   //     this.spinner.show();



  //   //     const addOnPremiumResponse: any = await new Promise((resolve, reject) => {
  //   //       this.service.getAddOnPremium(reqData2).subscribe({
  //   //         next: (response) => resolve(response),
  //   //         error: (err) => reject(err)
  //   //       });
  //   //     });

  //   //     addOnPremiumResponse.calculatedValuesList.forEach((member: number, index: number) => {
  //   //       this.tenureAmount[index] = Math.round(member)
  //   //     })


  //   //     this.taxList = addOnPremiumResponse.taxList;
  //   //     this.netPremiumList = addOnPremiumResponse.netPremiumList;
  //   //     this.totalPremiumList = addOnPremiumResponse.totalPremiumList;
  //   //     this.indPremiumList = addOnPremiumResponse.indPremiumList;
  //   //     this.addOnPremiumValueList = addOnPremiumResponse.totalPremiumValue;

  //   //     const roundedDiscountValues = addOnPremiumResponse.discountValueList.map((value: number) => Math.round(value));
  //   //     this.displayTaxList = addOnPremiumResponse.taxList.map((value: number) => Math.round(value));

  //   //     // this.dynamicFormGroup.get('premiumAmount')?.setValue(this.tenure1Total);

  //   //     sessionStorage.setItem('displayTaxList', this.encryptionService.encrypt(this.displayTaxList))
  //   //     sessionStorage.setItem('tenureAmount', this.encryptionService.encrypt(this.tenureAmount))
  //   //     this.changeDetectorRef.detectChanges();
  //   //     this.spinner.hide();
  //   //   } catch (err) {
  //   //     console.error(err);
  //   //     this.spinner.hide();
  //   //   }
  //   // }
  //   // this.setPremiumAmount();
  // }


  async getPremiumAmount() {
    if (this.changesMade) {
      this.changeRecalculate(false);
    }

    console.log(this.formData);

    if (this.isQuote === false) {
      if (Object.keys(this.formData).length > 0) {

        this.formData.insuredMemberDetails.forEach((member: any, index: number) => {
          // Initialize member's properties with default values if undefined
          member['covers'] = this.covers[index] ?? [];
          if (member.chronicDiseases) {
            if (typeof member.chronicDiseases === 'object') {
              member['chronicDiseases'] = Object.keys(member.chronicDiseases)
                .filter(disease => member.chronicDiseases[disease]) // Filter diseases with a value of true
                .map(disease => disease.charAt(0).toUpperCase() + disease.slice(1)) // Capitalize the first letter
                .join(','); // Join with a comma and space
              member['isChronic'] = "YES";

            }
            else if (typeof member.chronicDiseases === 'string') {
              member.chronicDiseases = member.chronicDiseases;
            }
            else {
              member['chronicDiseases'] = null;
              member['isChronic'] = member['isChronic'] ?? "No";
              // Set to empty string if no valid chronic diseases
            }
          }
          else if (member.chronicDiseases == "") {
            member['chronicDiseases'] = null;
            member['isChronic'] = member['isChronic'] ?? "No";
          }

          // member['chronicDiseases'] = member['chronicDiseases'] ?? null;
          member['roomCategory'] = member['roomCategory'] ?? "";
          member['pedWaitingPeriod'] = this.pedWaitingPeriod ?? null;

          // Add previousPolicyDetails if the control exists and value is not empty
          const previousPolicyControl = this.dynamicFormGroup.get(['insuredMemberDetails', index, 'previousPolicyDetails']);
          if (previousPolicyControl && previousPolicyControl.value !== "") {
            member['previousPolicyDetails'] = previousPolicyControl.value;
          }
        });


        this.formData['sumInsured'] = this.formData.insuredMemberDetails[0].sumInsured;
        this.formData['familySize'] = this.formData.insuredMemberDetails.length + 'A';
        this.formData['proposerName'] = this.formData['firstName'] + this.formData['lastName'];

        if (this.formData.memberPolicyType === 'Family Floater') {
          const pincode = this.formData.memberPolicyType === 'Family Floater'
            ? this.formData['proposerPincode']
            : this.formData.insuredMemberDetails[0].pincode;
          const zone = this.formData['zone'];
          const zoneValue = this.formData['zoneValue'];
          let deductibleAmount: any = '';
          if (this.formData['deductibleAmount']) {
            deductibleAmount = this.formData['deductibleAmount'];
          }
          this.formData.insuredMemberDetails.forEach((member: any) => {
            member.pincode = pincode
            member.zone = zone;
            member.zoneValue = zoneValue;
            if (deductibleAmount != '') {
              member.deductibleAmount = deductibleAmount;
            }
          });
        }

        let reqData = {
          "agentCode": this.agentCode,
          "productId": this.productId,
          "quoteData": JSON.stringify(this.formData)
        };
        try {
          const res: any = await new Promise((resolve, reject) => {
            this.commonService.GetSingleProductQuote(reqData).subscribe({
              next: (response) => resolve(response),
              error: (error) => reject(error)
            });
          });
          // Update tenureAmount and discountList after receiving the response
          this.QuoteNumber = [];
          for (let i = 1; i <= 3; i++) {
            const premiumKey = `tenure${i}Premium`;
            const discountKey = `t${i}DiscountAmount`;
            const Quote = `tenure${i}QuoteNumber`;
            const basePremiumKey = `t${i}BasePremium`;
            const taxKey = `t${i}TaxAmount`;
            this.QuoteNumber.push(res.data[Quote]);

            this.tenureAmount[i - 1] = res.data[premiumKey] ? Math.round(res.data[premiumKey]) : 0;
            this.discountList[i - 1] = res.data[discountKey] ? res.data[discountKey] : 0;
            this.taxList[i - 1] = res.data[taxKey] ? res.data[taxKey] : 0;
            this.basePremiumList[i - 1] = res.data[basePremiumKey] ? res.data[basePremiumKey] : 0;
          }

          this.formData.quoteId = this.QuoteNumber[this.selectedIndex];
          if (this.form.formTitle === 'Leads') {
            // this.formData.tenureAmount = this.tenureAmount;
            // this.formData.displayTaxList = this.displayTaxList;
            sessionStorage.setItem('tenureAmount', this.encryptionService.encrypt(this.tenureAmount));
            sessionStorage.setItem('discountList', this.encryptionService.encrypt(this.discountList));
            sessionStorage.setItem('taxList', this.encryptionService.encrypt(this.taxList));
            sessionStorage.setItem('basePremiumList', this.encryptionService.encrypt(this.basePremiumList));
            this.dynamicFormGroup.get('tenureAmount')?.setValue(this.tenureAmount);
            this.dynamicFormGroup.get('displayTaxList')?.setValue(this.displayTaxList);

          }

          sessionStorage.setItem("allFormData", this.encryptionService.encrypt(this.formData));

          // After setting tenureAmount and discountList, call setPremiumAmount()
          this.setPremiumAmount();

        } catch (error) {
          console.error("Error while fetching product tenure", error);
        } finally {
          this.spinner.hide();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    }
  }


  flattenObjectInsert(obj: any, prefix = '') {
    if (Array.isArray(obj)) {
      obj.forEach((item, index) => {
        const arrayKey = prefix + index;
        this.flattenObjectInsert(item, arrayKey + '.');
      });
    } else if (typeof obj === 'object' && obj !== null) {
      Object.keys(obj).forEach(key => {
        const value = obj[key];
        const newKey = prefix + key;
        if (typeof value === 'object' && value !== null && Object.keys(value).length > 0) {
          this.flattenObjectInsert(value, newKey + '.');
        } else {
          this.saveData[newKey] = value;
        }
      });
    } else {
      this.saveData[prefix] = obj;
    }
  }

  flattenObject(obj: any, prefix = '') {
    Object.keys(obj).forEach(key => {
      const value = obj[key];
      const newKey = prefix + key;
      if (typeof value === 'object' && value !== null && Object.keys(value).length > 0) {
        if (typeof value === 'object' && value !== null && 'id' in value) {
          this.dynamicFormGroup.get(newKey)?.patchValue(value);
        }
        else if (this.dynamicFormGroup.get(newKey) instanceof FormGroup) {
          const formGroup = this.dynamicFormGroup.get(newKey);
          Object.keys(value).forEach((key2) => {
            // if (key2 == 'covers') {
            //   console.log(formGroup?.get(key2), typeof formGroup?.get(key2));
            //   console.log(formGroup?.get(key2) instanceof FormArray);

            // }
            if (formGroup?.get(key2) instanceof FormArray) {
              const formArray = formGroup?.get(key2) as FormArray;
              // Clear any existing controls if needed
              // formArray.clear();

              // Array of objects that you want to set in the FormArray
              const arrayOfObject = value[key2];
              // Loop through the array and create FormGroups for each object
              console.log(arrayOfObject.length);
              console.log(key2);

              if (arrayOfObject.length) {
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
                        // Update the value if the control exists
                        innerarray.get(key)?.setValue(obj[key]);
                      } else {
                        // Optionally, add a new control if it does not exist
                        innerarray.addControl(key, new FormControl(obj[key]));
                      }
                    });
                  }
                  // else {
                  //   const group = formArray.controls[0]
                  //   formArray.push(group)
                  // }
                });
              }


            }
            // else if(!(formGroup?.get(key2) instanceof FormGroup)){
            // formGroup?.get(key2)?.setValue(value[key2]);
            // }
            else if (formGroup?.get(key2) instanceof FormGroup) {
              Object.keys(value[key2]).forEach((member: any) => {
                if (formGroup?.get(key2)?.get(member) instanceof FormArray) {
                  const addOnMemberDetails = formGroup?.get(key2)?.get(member) as FormArray;
                  addOnMemberDetails.controls.forEach((control, index) => {
                    // Set value only if the index exists in newValues
                    if (value[key2][member][index]) {
                      control.patchValue(value[key2][member][index]);
                    }
                  });
                }
                else {
                  formGroup?.get(key2)?.get(member)?.setValue(value[key2][member]);
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
        if (this.dynamicFormGroup.get(newKey) && this.dynamicFormGroup.get(newKey)?.value == "") {
          this.dynamicFormGroup.get(newKey)?.patchValue(value);
        }
      }
    });
  }


  async fullQuotation(): Promise<void> {
    return new Promise((resolve, reject) => {
      // this.spinner.show();
      this.mappedFormDataFullQuote(this.formData)
        .then((data) => {
          const reqData: any = {
            agentCode: this.agentCode,
            productId: this.productId.toString(),
            productType: this.formData.productType,
            fullQuoteRequestJson: JSON.stringify(data)
          }
          this.yatraService.getFullQuote(reqData).subscribe({
            next: (response: any) => {
              if (response?.isSuccess) {
                const responseData = response.data;

                // Setting response data to formData
                this.formData.policyNumber = responseData.policyNumber || null;
                this.formData.policyStatus = responseData.policyStatus || null;
                this.formData.quoteValidFromDate = responseData.policyStartDate || null;
                this.formData.quoteValidToDate = responseData.policyEndDate || null;
                this.formData.ReceiptNumber = responseData.receiptNumber || null;
                this.formData.customerId = responseData.customerId || null;
                // Merging updated formData with dynamicFormGroup values
                this.formData = { ...this.formData, ...this.dynamicFormGroup.getRawValue() };

                // Encrypting and saving formData to session storage
                sessionStorage.setItem("allFormData", this.encryptionService.encrypt(this.formData));

                // Showing success toast
                this.toast.success({
                  detail: "Success",
                  summary: `Full Quotation Generated Successfully. Customer ID: ${this.formData.customerId}`,
                  duration: 3000,
                });

                resolve(); // Allow navigation
              } else {
                const errorMessage =
                  response.message
                // Showing error toast
                this.toast.error({
                  detail: "Error",
                  summary: errorMessage,
                  duration: 5000,
                });

                console.error("Full Quote generation failed:", response);
                reject(new Error(errorMessage)); // Prevent navigation
              }
            },
            error: (err) => {
              this.spinner.hide();
              console.error(err);

              // Showing generic error toast for API failure
              this.toast.error({
                detail: "Error",
                summary: "Something went wrong. Please try again.",
                duration: 3000,
              });

              reject(err); // Reject the promise
            },
          });
        })
        .catch((err) => {
          this.spinner.hide();

          // Showing error toast for mapping failure
          this.toast.error({
            detail: "Error",
            summary: "Failed to map form data",
            duration: 3000,
          });

          reject(err);
        });
    });
  }





  /* AddOn Related Method */

  onCheckboxChange(event: any, control: any, parentControl: any = null, index: number | null = null, innerControl: any = null, indexj: number | null = null) {
    this.changesMade = true;
    if (parentControl.type === 'chronicquestionnaire') {
      parentControl.subControls.forEach((element: any) => {
        if (element.name == control.label) {
          element.visible = !element.visible;
        }
      });
    }
    if (parentControl != null && typeof parentControl === 'object') {
      this.parentControl = parentControl;
    }
    if ((event.target.type === 'button')) {
      if (parentControl != null && typeof parentControl === 'object' && parentControl.type == 'questionnaire') {
        this.question = parentControl.name;
        this.openPopUp();
        // this.showOverlay(parentControl);
      }
    }
    if ((event.target.type === 'checkbox' && event.target.checked)) {
      if (parentControl != null && typeof parentControl === 'object' && parentControl.type == 'combinedCheckbox') {
        const firstKey = Object.keys((this.dynamicFormGroup.get(parentControl.name) as FormGroup)?.controls)[0];
        (this.dynamicFormGroup.get(parentControl.name) as FormGroup)?.controls[firstKey].setValue(false);
        this.showOverlay(parentControl);
      }

      if (parentControl != null && parentControl.type == 'questionnaire') {
        // const arrayName = (control.name).charAt(0).toUpperCase() + (control.name).slice(1);
        const arrayName = (control.name).replace(/\b\w/g, (char: any) => char.toUpperCase());
        parentControl.subControls.forEach((subControl: any) => {
          if (subControl.name === arrayName) {
            subControl.visible = event.target.checked;
            let parentCode = this.dynamicFormGroup.get(parentControl.name) as FormGroup;
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
        // this.showOverlay(parentControl);
      }

      // Call the method only if the 'method' key is present in the JSON and the checkbox is checked  this.resolveMethod(control.method, control?.popUpFormId, control?.name, control?.dependentControls, 'add');
      if (control.onChangeMethod)
        this.resolveMethod(control.onChangeMethod, control?.popUpFormId, control?.dependentControls, true, control?.name, parentControl?.name, index, 'add');
    }

    else if (event.target.type === 'checkbox' && event.target.checked == false) {

      if (parentControl != null && typeof parentControl === 'object' && parentControl.type == 'combinedCheckbox') {
        // if()

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
                    let newcontrol = (this.dynamicFormGroup.get(`${parentControl.name}.${subControl.name}.${subControl.innerSubControls[i].name}.${j}.${subControl.innerSubControls[i].coreControls[j].name}`) as any);
                    if (newcontrol instanceof FormGroup) {
                      Object.keys(newcontrol.controls).forEach((element: any) => {
                        newcontrol.removeControl(element);
                      });
                    }
                    else {
                      newcontrol.setValue(false);
                    }
                  }
                  else if (this.dynamicFormGroup.get(`${parentControl.name}.${subControl.name}.${subControl.innerSubControls[i].name}.${j}.${subControl.innerSubControls[i].coreControls[j].name}`)?.value == true || this.dynamicFormGroup.get(`${parentControl.name}.${subControl.name}.${subControl.innerSubControls[i].name}.${j}.${subControl.innerSubControls[i].coreControls[j].name}`)?.value == false) {

                    this.dynamicFormGroup.get(`${parentControl.name}.${subControl.name}.${subControl.innerSubControls[i].name}.${j}.${subControl.innerSubControls[i].coreControls[j].name}`)?.setValue(false);
                  }
                  else {
                    this.dynamicFormGroup.get(`${parentControl.name}.${subControl.name}.${subControl.innerSubControls[i].name}.${j}.${subControl.innerSubControls[i].coreControls[j].name}`)?.setValue('');
                  }
                }
              }
            }
          }
        })
        this.changeRecalculate(true);
        this.addOnRemoved(control, parentControl);
      }
      if (parentControl != null && parentControl.type == 'questionnaire') {
        // const arrayName = (control.name).charAt(0).toUpperCase() + (control.name).slice(1);
        const arrayName = (control.name).replace(/\b\w/g, (char: any) => char.toUpperCase());
        parentControl.subControls.forEach((subControl: any) => {
          if (subControl.name === arrayName) {
            subControl.visible = event.target.checked;
            if (event.target.checked == false) {
              subControl.innerArrayControl = subControl.innerArrayControl?.slice(0, 2);
              let formArray = (this.dynamicFormGroup.get(parentControl.name) as FormGroup)?.controls[arrayName] as FormArray;
              formArray.clear();

              // Remove all items from the FormArray
              // while (formArray.length > 1) {
              //   formArray.removeAt(1);
              // }

              // Reset the value of the first element in the FormArray to an empty string.
              // const firstControl = formArray.at(0) as FormGroup;
              // Object.keys(firstControl.controls).forEach(key => {
              //   firstControl.get(key)?.setValue('');
              // });

              Object.keys(this.formData).forEach(key => {
                const baseKey = `${control.name}.${subControl.name}.`;

                // Check if the key starts with the baseKey.
                if (key.startsWith(baseKey)) {
                  const index = key.substring(baseKey.length).split('.')[0];

                  // If the index is not "0", remove the key; otherwise, reset its value.
                  if (index !== '0') {
                    delete this.formData[key];
                  } else {
                    this.formData[key] = ''; // Reset value for index 0.
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
        // this.showOverlay(parentControl);
      }
      if (control.onChangeMethod)
        this.resolveMethod(control.onChangeMethod, control?.popUpFormId, control?.dependentControls, false, control?.name, parentControl?.name, index, 'remove');
    }

    if (this.formData.productName == 'Active Secure') {
      if (parentControl.name == 'cancerSecure') {
        this.form.formSections.forEach((section: any) => {
          if (section.sectionTitle === "Optional Covers") {
            section.formControls.forEach((formControl: any) => {
              if (formControl.name == 'csSecondOpinion') {
                if (formControl.visible) {
                  formControl.visible = false;
                  this.dynamicFormGroup.get(`${formControl.name}.${formControl.subControls[0].name}`)?.setValue(false);
                  this.onCheckboxChange(event, formControl.subControls[0], formControl, null);
                }
              }
            });
          }
        });
      } else if (parentControl.name == 'criticalIllness') {
        this.form.formSections.forEach((section: any) => {
          if (section.sectionTitle === "Optional Covers") {
            section.formControls.forEach((formControl: any) => {
              if (formControl.name == 'ciSecondOpinion') {
                if (formControl.visible) {
                  formControl.visible = false;
                  this.dynamicFormGroup.get(`${formControl.name}.${formControl.subControls[0].name}`)?.setValue(false);
                  this.onCheckboxChange(event, formControl.subControls[0], formControl, null);
                }
              }
            });
          }
        });
      } else if (parentControl.name == 'accident') {
        this.form.formSections.forEach((section: any) => {
          if (section.sectionTitle === "Optional Covers") {
            section.formControls.forEach((formControl: any) => {
              if (formControl.name == 'accidentPatienthospitalization' || formControl.name == 'temporaryTotalDisablementBenefit'
                || formControl.name == 'brokenBonesBenefit' || formControl.name == 'burnBenefit' || formControl.name == 'adventureSports'
                || formControl.name == 'medicalExpenses' || formControl.name == 'emergencyAssistance' || formControl.name == 'emiProtect'
                || formControl.name == 'loanProtect' || formControl.name == 'comaBenefits') {
                if (formControl.visible) {
                  formControl.visible = false;
                  this.dynamicFormGroup.get(`${formControl.name}.${formControl.subControls[0].name}`)?.setValue(false);
                  this.onCheckboxChange(event, formControl.subControls[0], formControl, null);
                }
              }
            });
          }
        });
      }
    }
  }

  // addOnAdded(control: any, parentControl: any = null) {

  //   let addOnData = this.dynamicFormGroup.get(parentControl.name)?.value;
  //   let modifiedInsuredMemberDetails = this.formData.insuredMemberDetails;

  //   Object.keys(addOnData.addOnDetails).forEach((key) => {
  //     // Check if memberCheckbox is true for the current member
  //     if (addOnData.addOnDetails[key][0].memberCheckbox === true) {
  //       modifiedInsuredMemberDetails.forEach((member: any) => {
  //         // Find the matching member by relation (e.g., Self, Spouse, etc.)
  //         if (member.relation == key) {
  //           let addOnSumInsured: any = 0;
  //           const coverId = addOnData.addOnId;
  //           const coverName = addOnData.additionalCoverName;
  //           let coverFound = false;

  //           if (!member.covers) {
  //             member['covers'] = [];
  //           }

  //           addOnData.addOnDetails[key].forEach((addOnDetail: any) => {
  //             if (addOnDetail.addOnSumInsured) {
  //               addOnSumInsured = addOnDetail.addOnSumInsured;
  //             }
  //             if (addOnData.addOnId == 'PA' && addOnDetail.occupation) {
  //               member['occupationCode'] = JSON.parse(addOnDetail.occupation).value;
  //             }
  //             if (addOnData.addOnId == 'PA' && addOnDetail.occupationRisk) {
  //               member['natureOfDutyCode'] = JSON.parse(addOnDetail.occupationRisk).value;
  //             }
  //           });

  //           // if(addOnData.addOnId == 'PA'){
  //           //   member['occupationCode'] = JSON.parse(addOnData.addOnDetails[key][1].occupation).id;
  //           //   member['natureOfDutyCode'] = JSON.parse(addOnData.addOnDetails[key][1].occupationRisk).id;
  //           // }

  //           // Check if the add-on (coverId) is already present in the covers array
  //           member.covers.forEach((cover: any) => {
  //             if (cover.coverId === coverId) {
  //               // Update the existing add-on with the new sum insured
  //               cover.value = addOnSumInsured;
  //               coverFound = true;
  //             }
  //           });

  //           // If the add-on is not found, push it as a new cover
  //           if (!coverFound) {
  //             member.covers.push({
  //               coverId: coverId,
  //               value: addOnSumInsured,
  //               coverName: coverName
  //             });
  //           }
  //         }
  //       });
  //     }
  //     else if (addOnData.addOnDetails[key][0].memberCheckbox === false) {
  //       modifiedInsuredMemberDetails.forEach((member: any) => {
  //         // Find the matching member by relation (e.g., Self, Spouse, etc.)
  //         if (member.relation == key) {
  //           const coverId = addOnData.addOnId;

  //           if (member.covers) {
  //             // Remove the add-on by filtering out the cover with the matching coverId
  //             member.covers = member.covers.filter((cover: any) => cover.coverId !== coverId);
  //           }
  //         }
  //       });
  //     }
  //   });
  //   // this.getPremiumAmount();

  // }





  //new add On added
  addOnAdded(control: any, parentControl: any = null) {
    let addOnData = this.dynamicFormGroup.get(parentControl.name)?.getRawValue();
    let modifiedInsuredMemberDetails = this.formData.insuredMemberDetails;
    Object.keys(addOnData.addOnDetails).forEach((key) => {
      if (addOnData.addOnDetails[key][0].memberCheckbox === true) {
        modifiedInsuredMemberDetails.forEach((member: any, index: number) => {
          if (member.relation === key) {
            let addOnSumInsured: any = 0;
            let weeklyCashLimit: any;
            let noOfDays: any;
            if (parentControl.name == 'deductible') {
              addOnData.addOnDetails[key].forEach((addOnDetail: any) => {
                if (addOnDetail.addOnSumInsured) {
                  member.deductibleAmount = addOnDetail.addOnSumInsured;
                }
              })
            }
            else {
              const coverId = addOnData.addOnId;
              const coverName = addOnData.optionalCoverName || addOnData.additionalCoverName;
              let coverFound = false;

              if (!member.covers) {
                member.covers = [];
              }

              addOnData.addOnDetails[key].forEach((addOnDetail: any) => {
                if (addOnDetail.addOnSumInsured) {
                  addOnSumInsured = addOnDetail.addOnSumInsured;
                }
                else if (addOnDetail.roomType) {
                  addOnSumInsured = addOnDetail.roomType;
                }
                else if (addOnDetail.weeklyCashLimit) {
                  weeklyCashLimit = addOnDetail.weeklyCashLimit
                }
                else if (addOnDetail.noOfDays) {
                  noOfDays = addOnDetail.noOfDays
                }
                if (coverName.includes('Personal Accident') && addOnDetail.occupation) {
                  member.occupationCode = JSON.parse(addOnDetail.occupation).value;
                }
                if (coverName.includes('Personal Accident') && addOnDetail.occupationRisk) {
                  member.natureOfDutyCode = JSON.parse(addOnDetail.occupationRisk).value;
                }
              });

              member.covers.forEach((cover: any) => {
                if (cover.coverId === coverId) {
                  cover.value = addOnSumInsured;
                  coverFound = true;
                }
              });

              if (!coverFound) {
                member.covers.push({
                  coverId: coverId,
                  value: addOnSumInsured,
                  coverName: coverName,
                  weeklyCashLimit: weeklyCashLimit,
                  noOfDays: noOfDays,
                });
              }

              if (!this.covers[index]) {
                this.covers[index] = [];
              }

              let coverInCovers = this.covers[index].find((c: any) => c.coverId === coverId);
              if (coverInCovers) {
                coverInCovers.value = addOnSumInsured;
              } else {
                this.covers[index].push({
                  coverId: coverId,
                  value: addOnSumInsured,
                  coverName: coverName,
                  weeklyCashLimit: weeklyCashLimit,
                  noOfDays: noOfDays,
                });
              }

            }
            if (parentControl.name == 'chronicCare') {
              const chronicDiseases: string[] = [];

              console.log(addOnData.addOnDetails[key]);

              addOnData.addOnDetails[key].forEach((innerObject: any) => {

                Object.keys(innerObject).forEach((diseaseKey) => {
                  const diseaseValue = innerObject[diseaseKey];
                  console.log(diseaseValue);


                  if (
                    diseaseKey !== 'memberCheckbox' && // Exclude memberCheckbox
                    !diseaseKey.includes('Question') && // Exclude keys containing 'question'
                    !diseaseKey.includes('Value') &&
                    diseaseValue === true // Include only true values
                  ) {
                    chronicDiseases.push(diseaseKey); // Add disease name to the list
                  }
                });
              });

              console.log(chronicDiseases);

              if (chronicDiseases.length > 0) {
                member.isChronic = 'Yes';
                member.chronicDiseases = chronicDiseases.join(', '); // Join disease names with commas
              } else {
                member.isChronic = 'No';
                member.chronicDiseases = ''; // Clear chronic diseases if none found
              }
              console.log(member);

            }
            if (this.formData.productName == 'Active Secure') {
              if (parentControl.name == 'cancerSecure') {
                this.form.formSections.forEach((section: any) => {
                  if (section.sectionTitle === "Optional Covers") {
                    section.formControls.forEach((formControl: any) => {
                      if (formControl.name == 'csSecondOpinion') {
                        formControl.visible = true
                      }
                    });
                  }
                });
              } else if (parentControl.name == 'criticalIllness') {
                this.form.formSections.forEach((section: any) => {
                  if (section.sectionTitle === "Optional Covers") {
                    section.formControls.forEach((formControl: any) => {
                      if (formControl.name == 'ciSecondOpinion') {
                        formControl.visible = true
                      }
                    });
                  }
                });
              } else if (parentControl.name == 'accident') {
                this.form.formSections.forEach((section: any) => {
                  if (section.sectionTitle === "Optional Covers") {
                    section.formControls.forEach((formControl: any) => {
                      if ([
                        'accidentPatienthospitalization', 'temporaryTotalDisablementBenefit', 'brokenBonesBenefit',
                        'burnBenefit', 'adventureSports', 'medicalExpenses', 'emergencyAssistance',
                        'emiProtect', 'loanProtect', 'comaBenefits'
                      ].includes(formControl.name)) {
                        formControl.visible = true;
                      }

                      if (formControl.name == 'comaBenefits' || formControl.name == 'adventureSports') {
                        if (formControl.subControls) {
                          formControl.subControls.forEach((subControl: any) => {
                            if (subControl.innerSubControls) {
                              subControl.innerSubControls.forEach((innerSubControl: any) => {
                                if (innerSubControl.coreControls) {
                                  innerSubControl.coreControls.forEach((coreControl: any,index :any) => {
                                    if (coreControl.name == 'addOnSumInsured') {
                                
                                      const parentGroup = this.dynamicFormGroup.get(formControl.name) as FormGroup;
                                      const controlGroup = parentGroup?.controls[control.name] as FormGroup;

                                      if (innerSubControl.name !== "demoType" && innerSubControl.name !== "doneButton") {
                                        const innerSubGroup = controlGroup?.controls[innerSubControl.name] as FormArray;
                                        const targetFormGroup = innerSubGroup?.controls[index] as FormGroup;
                                        const coreControls = targetFormGroup?.controls[coreControl.name] as FormControl;
                                        if (coreControls) {
                                          let member = this.formData.insuredMemberDetails.find((m: any) =>
                                            m.covers.some((c: any) => c.coverId === 'ACCD' && m.relation === innerSubControl.name)
                                          );
                                          if (member) {
                                            let accdCover = member.covers.find((c: any) => c.coverId === 'ACCD');

                                            if (accdCover && accdCover.value !== undefined) {
                                              coreControls.setValue(1000000 >= accdCover.value ? accdCover.value : 1000000);
                                            } else {
                                              coreControls.setValue("");
                                            }
                                          } else {
                                            coreControls.setValue("");
                                          }
                                        }
                                      }
                                    }
                                  });
                                }
                              });
                            }
                          });
                        }
                      }

                    });
                  }
                });
              }
            }
          }
        });
      } else if (addOnData.addOnDetails[key][0].memberCheckbox === false) {
        modifiedInsuredMemberDetails.forEach((member: any, index: number) => {
          if (member.relation === key) {
            const coverId = addOnData.addOnId;

            if (member.covers) {
              member.covers = member.covers.filter((cover: any) => cover.coverId !== coverId);
            }

            if (this.covers[index]) {
              this.covers[index] = this.covers[index].filter((cover: any) => cover.coverId !== coverId);
            }
          }
        });
      }
    });
  }


  // addOnRemoved(control: any, parentControl: any) {


  //   let reqData: {
  //     productType: any;
  //     overAllSIAge: number[];
  //     totalPremium: number[][];
  //     valueUnit: any[];
  //     yearlyDiscount: number[];
  //     zoneDiscount: number;
  //     memberDiscount: number;
  //     addOnList: any[];
  //   };

  //   var overAllSIAge: number[] = [];
  //   var valueUnit: any[] = [];


  //   this.formData['insuredMemberDetails'].forEach((member: any) => {
  //     overAllSIAge.push(parseInt(member.memberAge));
  //     valueUnit.push(null);
  //   });


  //   let addOnData = this.dynamicFormGroup.get(parentControl.name)?.value;

  //   const indexToRemove = this.addOnList.findIndex((addOn: any) => addOn.optionalId === addOnData.addOnId);

  //   if (addOnData.addOnId === 'AHPA' && indexToRemove !== -1) {
  //     this.isAHPAAdded = false;
  //     this.AHPARiskValue = '';
  //   }

  //   if (indexToRemove !== -1) {
  //     this.addOnList.splice(indexToRemove, 1);
  //   }


  //   reqData = {
  //     productType: this.formData['productType'],
  //     overAllSIAge: overAllSIAge,
  //     totalPremium: this.premiumAmountDetails,
  //     valueUnit: valueUnit,
  //     yearlyDiscount: [0, 7.5, 10],
  //     zoneDiscount: this.formData.productType == 'AF' || this.formData.productType == 'AA' || this.formData.productType == 'AO' || this.formData.productType == 'AC' || this.formData.productType == 'AGS' || this.formData.productType == 'STUB' || this.formData.productType == 'GHS' ? 0 : 9,
  //     memberDiscount: 0,
  //     addOnList: this.addOnList
  //   };

  //   if (this.formData['numberOfInsuredMembers'] > 1) {
  //     reqData.memberDiscount = 5;
  //   }



  //   this.yatraService.getAddOnPremium(reqData).pipe(
  //     // 1. Step: First process the API response
  //     tap((response:any) => {

  //       // Update tenure amounts
  //       for (let i = 0; i < response.calculatedValuesList.length; i++) {
  //         this.tenureAmount[i] = Math.round(response.calculatedValuesList[i]);
  //       }

  //       // Set other lists
  //       this.taxList = response.taxList;
  //       this.netPremiumList = response.netPremiumList;
  //       this.totalPremiumList = response.totalPremiumList;
  //       this.indPremiumList = response.indPremiumList;
  //       this.addOnPremiumValueList = response.totalPremiumValue;

  //       // Set discount values
  //       const roundedDiscountValues = response.discountValueList.map((value: number) => Math.round(value));
  //     }),
  //     // 2. Step: Process the form controls after updating the tenureAmount
  //     tap(() => {
  //       this.form.formSections.forEach((section: any) => {
  //         section.formControls.forEach((formControl: any) => {
  //           if (formControl.name === 'totalPremium' && formControl.radioOptions) {
  //             formControl.radioOptions.forEach((option: any, index: number) => {
  //               const tenureAmount = this.tenureAmount[index];
  //               option.label = `<b>Rs - ${tenureAmount}</b>`;
  //               option.value = tenureAmount;

  //               if (index === 0) {
  //                 option.year = '1 year';
  //               } else if (index === 1) {
  //                 option.year = '2 years';
  //                 option.discount = '7.5% off';
  //               } else if (index === 2) {
  //                 option.year = '3 years';
  //                 option.discount = '10% off';
  //               }

  //               if (index === this.selectedIndex) {
  //                 this.dynamicFormGroup.getRawValue().totalPremium = tenureAmount;
  //               }
  //             });
  //           }
  //         });
  //       });
  //     }),
  //     // 3. Step: Process the add-on data
  //     concatMap(() => {
  //       let index = 0; // Initialize the index variable
  //       const addOnProcessing = Object.keys(addOnData).map((key: string) => {
  //         if (Array.isArray(addOnData[key])) {
  //           const addOnDataArray = addOnData[key].at(0);
  //           if (addOnDataArray.hasOwnProperty('addOnSumInsured')) {
  //             let reqData = {
  //               "optionalId": addOnData.addOnId,
  //               "si": addOnDataArray.addOnSumInsured,
  //               "optionalCoverName": addOnData.optionalCoverName,
  //               "optionalCoverValue": addOnData.optionalCoverValue,
  //               "premium": 0,
  //               "riskClass": ""
  //             };

  //             if (addOnData.addOnId === 'AHPA') {
  //               this.isAHPAAdded = true;
  //               const occupationRisk = JSON.parse(addOnDataArray.occupationRisk);
  //               this.AHPARiskValue = occupationRisk['value'];
  //               reqData = { ...reqData, riskClass: occupationRisk['value'] };
  //             }

  //             if (this.selectedIndex !== -1) {
  //               const addOnIndex = this.addOnList.findIndex((addOn: any) => addOn.optionalId === addOnData.addOnId);
  //               reqData.premium = this.addOnPremiumValueList[addOnIndex][index][this.selectedIndex];
  //             }

  //             if (this.addOnDetails[index]) {
  //               this.addOnDetails[index].push(reqData);
  //             }

  //             index++;
  //           }
  //         }
  //         return of(null); // Map to observable
  //       });
  //       return of(...addOnProcessing); // Return observables as a pipeline
  //     }),
  //     // 4. Step: Finalize AHPA if it's added
  //     tap(() => {
  //       if (this.isAHPAAdded) {
  //         this.addOnDetails.forEach((member: any) => {
  //           member.forEach((addOn: any) => {
  //             addOn.riskClass = this.AHPARiskValue;
  //           });
  //         });
  //       }
  //     })
  //   ).subscribe({
  //     next: () => {
  //     },
  //     error: (err) => {
  //       console.error(err);
  //     }
  //   });
  // }
  // addOnRemoved(control: any, parentControl: any = null) {
  //   let addOnData = this.dynamicFormGroup.get(parentControl.name)?.value;

  //   let modifiedInsuredMemberDetails = this.formData.insuredMemberDetails;

  //   // Iterate over each member and remove the specified add-on from the covers
  //   modifiedInsuredMemberDetails.forEach((member: any) => {
  //     // Get the coverId (addOnId) to be removed
  //     const coverId = addOnData.addOnId;

  //     // Remove the add-on from the covers array by filtering it out
  //     member.covers = member.covers.filter((cover: any) => cover.coverId !== coverId);
  //   });

  //   // Call the getPremiumAmount method after removing the add-on
  //   // this.getPremiumAmount();
  // }

  //New Remove addOn
  addOnRemoved(control: any, parentControl: any = null) {
    let addOnData = this.dynamicFormGroup.get(parentControl.name)?.value;
    let modifiedInsuredMemberDetails = this.formData.insuredMemberDetails;

    // Iterate over each member and remove the specified add-on from both insuredMemberDetails.covers and covers
    modifiedInsuredMemberDetails.forEach((member: any, index: number) => {
      const coverId = addOnData.addOnId;

      // Remove the add-on from the covers array of insuredMemberDetails
      if (member.covers) {
        member.covers = member.covers.filter((cover: any) => cover.coverId !== coverId);
      }

      // Synchronize the change in the local covers variable
      if (this.covers[index]) {
        this.covers[index] = this.covers[index].filter((cover: any) => cover.coverId !== coverId);
      }
    });

    // Call getPremiumAmount after removing the add-on if needed
    // this.getPremiumAmount();
  }

  // addOnRemoved(control: any, parentControl: any = null) {
  //   let addOnData = this.dynamicFormGroup.get(parentControl.name)?.value;
  //   let modifiedInsuredMemberDetails = this.formData.insuredMemberDetails;

  //   // Iterate over each member and remove the specified add-on from both insuredMemberDetails.covers and covers
  //   Object.keys(addOnData.addOnDetails).forEach((key) => {
  //     if (!addOnData.addOnDetails[key][0].memberCheckbox) {
  //       modifiedInsuredMemberDetails.forEach((member: any, index: number) => {
  //         if (member.relation === key) {
  //           const coverId = addOnData.addOnId;

  //           if (parentControl.name === 'deductible') {
  //             // Remove deductible-specific properties

  //           } else {
  //             // Remove the add-on from the covers array of insuredMemberDetails
  //             if (member.covers) {
  //               member.covers = member.covers.filter((cover: any) => cover.coverId !== coverId);
  //             }

  //             // Synchronize the change in the local covers variable
  //             if (this.covers[index]) {
  //               this.covers[index] = this.covers[index].filter((cover: any) => cover.coverId !== coverId);
  //             }
  //           }
  //         }
  //       });
  //     }
  //   });

  //   // Call getPremiumAmount after removing the add-on if needed
  //   // this.getPremiumAmount();
  // }




  calculatePremiumPerype(insuredMembers: any): String {
    var premiumPerype = "";
    premiumPerype = insuredMembers.length + "A";
    return premiumPerype;
  }

  setProposerPincode() {
    if (this.formData.planType == 'Multi Individual' || this.formData.planType == 'Individual') {
      this.formData.insuredMemberDetails.forEach((member: any) => {
        if (member.relation == 'Self') {

          this.form.formSections.forEach((section: IFormSections) => {
            if (section.sectionTitle == 'Product Information') {
              section.formControls.forEach((control: IFormControl) => {
                if (control.name == 'proposerPincode') {
                  control.value = member.pincode;
                }
                if (control.name == 'proposerState') {
                  control.value = member.state;
                }
                if (control.name == 'proposerCity') {
                  control.value = member.city;
                }
              })
            }
          })
        }

      })

      if (this.dynamicFormGroup.get('proposerState')?.value == "") {
        const reqdata = {
          "pincode": this.dynamicFormGroup.get('proposerPincode')?.value
        }
        // this.commonService.getPinCodeByCity(reqdata).subscribe({
        //   next: (res) => {
        //     this.dynamicFormGroup.get('proposerCity')?.setValue(res.strcity);
        //     this.dynamicFormGroup.get('proposerState')?.setValue(res.strstate);
        //   },
        //   error: (err) => {
        //     console.error(err)
        //   }
        // });

      }
    }
    else if (this.formData.planType == 'Family Floater') {

      this.form.formSections.forEach((section: IFormSections) => {
        if (section.sectionTitle == 'Product Information') {
          section.formControls.forEach((control: IFormControl) => {
            if (control.name == 'proposerPincode') {
              control.value = this.formData.pincode;
            }
            if (control.name == 'proposerState') {
              control.value = this.formData.state;
            }
            if (control.name == 'proposerCity') {
              control.value = this.formData.city;
            }
          })
        }
      })
    }
  }

  getDependentControlValue(control: any) {
    const value = this.formData[control.dependentControls[0]];
    if (value && (typeof value == 'string') && (value.startsWith('{') && value.endsWith('}'))) {
      control.value = JSON.parse(value).value;
    }
    else
      control.value = value;
  }

  lastPageRedirect() {
    this.onSubmit();
    this.router.navigate(['products']);
  }

  setPremiumAmount(control?: any) {
    if (this.formData.tenure) {
      this.selectedIndex = this.formData.tenure - 1;
    }
    // this.tenureAmount.forEach(member => {
    //   console.log(member);

    // })
    if (this.selectedIndex == -1) {
      if (this.tenureAmount.length > 0) {
        const filteredLength = this.tenureAmount.filter(num => num !== 0).length;
        this.selectedIndex = filteredLength - 1;
      }
      else
        this.selectedIndex = 2;
    }
    this.form.formSections.forEach((section: any) => {
      section.formControls.forEach((formControl: any) => {
        if (formControl.name == 'totalPremium') {
          if (formControl.radioOptions) {
            formControl.radioOptions.forEach((option: any, index: number) => {
              if (index === 0) {
                // this.totalPremium = this.tenure1Total;
                option.label = `<b>Rs - ${this.tenureAmount[index]}</b>`;
                // formControl.value = this.tenureAmount[index];
                option.year = "1 year"
                section.toolTipText = `Tax: Rs ${this.displayTaxList[0]}`;
                option.value = this.tenureAmount[index];
                // if (this.selectedIndex == index) {
                //   this.dynamicFormGroup.getRawValue().totalPremium = this.tenureAmount[index];
                //   this.selectedIndex = index;
                //   this.formData.tenure = this.selectedIndex + 1;
                // }
              } else if (index === 1) {
                option.label = `<b>Rs - ${this.tenureAmount[index]}</b>`;
                section.toolTipText = `Tax: Rs ${this.displayTaxList[0]}`;
                option.value = this.tenureAmount[index];
                option.year = "2 years"
                option.discount = "7.5% off"
                // if (this.selectedIndex == index) {
                //   this.dynamicFormGroup.getRawValue().totalPremium = this.tenureAmount[index];
                //   this.selectedIndex = index;
                //   this.formData.tenure = this.selectedIndex + 1;
                // }
              } else if (index === 2) {
                option.label = `<b>Rs - ${this.tenureAmount[index]}</b>`;
                section.toolTipText = `Tax: Rs ${this.displayTaxList[0]}`;
                option.value = this.tenureAmount[index];
                option.year = "3 years"
                option.discount = "10% off"
                // if (this.selectedIndex == index) {
                //   this.dynamicFormGroup.getRawValue().totalPremium = this.tenureAmount[index];
                //   this.selectedIndex = index;
                //   this.formData.tenure = this.selectedIndex + 1;
                // }
              }
              if (this.selectedIndex === index) {
                let radioOptionsControl = this.dynamicFormGroup.get('totalPremium');
                if (!radioOptionsControl) {
                  // Add control if it doesn't exist
                  this.dynamicFormGroup.addControl(formControl.name, new FormControl(this.tenureAmount[index]));
                  // radioOptionsControl = this.dynamicFormGroup.get('totalPremium');
                }

                // if (radioOptionsControl) {
                //   radioOptionsControl.setValue(this.tenureAmount[this.selectedIndex], { emitEvent: true });
                //   // this.dynamicFormGroup.getRawValue().totalPremium = this.tenureAmount[this.selectedIndex];
                // }

                option.selected = true;
                if (this.dynamicFormGroup.getRawValue().totalPremium != null || this.dynamicFormGroup.getRawValue().totalPremium == 0) {

                  // this.dynamicFormGroup.getRawValue().totalPremium = this.tenureAmount[this.selectedIndex];
                  // this.dynamicFormGroup.get('totalPremium')?.setValue(option.value);
                  this.dynamicFormGroup.get('totalPremium')?.patchValue(option.value);
                }
                else if (this.formData.productName === 'Active Secure' && this.dynamicFormGroup.getRawValue().totalPremium == null) {
                  this.dynamicFormGroup.get('totalPremium')?.patchValue(option.value);
                }
                // Update additional data
                if (this.QuoteNumber.length > 0) {
                  this.formData.quoteId = this.QuoteNumber[this.selectedIndex];
                }
                this.formData.tenure = this.selectedIndex + 1;
              }
              else {
                option.selected = false;
              }
            });
          }

          if (this.form.formTitle != 'Total Premium') {
            this.dynamicFormGroup.get(formControl.name)?.setValue(this.tenureAmount[this.selectedIndex]);
          }
        }
      });
    });
  }

  mergeMember(control: any) {
    const a = Object.keys(this.formData.insuredMembers).filter(
      key => this.formData.insuredMembers[key] === true
    );
    control.value = a;
  }
  displaySelectedAddons(control: any) {
    const coverNames: string[] = [];
    for (const key in this.formData) {
      if (this.formData.hasOwnProperty(key)) {
        const addon = this.formData[key];
        if (addon && addon.addOnCover === true) {
          coverNames.push(addon.optionalCoverName || addon.additionalCoverName);
        }
      }
    }
    control.value = coverNames;
  }

  selectEditField(control: any) {
    this.form.formSections.forEach((section: any) => {
      section.formControls.forEach((controls: any) => {
        if (controls.name == control.name) {
          controls.disabled = false
        }
      });
    });
  }

  toggleSection(sectionTitle: string) {
    this.collapsedSections[sectionTitle] = !this.collapsedSections[sectionTitle];
  }

  isSectionCollapsed(sectionTitle: string): boolean {
    return !!this.collapsedSections[sectionTitle];
  }
  generateHeader(control: any, i: any) {
    const imagePath = JSON.parse(this.formData[control.name][i - 1].relationshipType)?.imagePath;
    return imagePath;
  }

  addOnMemberAdded(subControl: any, parentControl: any = null) {
    if (parentControl != null) {
      let count = 0;
      let memberDetails = this.dynamicFormGroup.get(parentControl.name)?.get(subControl.name)?.value;
      console.log(memberDetails);
      Object.keys(memberDetails).forEach(key => {
        let memberArray = memberDetails[key];
        // Check if memberCheckbox is false for any member and set other fields to empty
        let memberCheckbox = memberArray.find((member: any) => member.memberCheckbox === false);

        if (memberCheckbox) {
          memberArray.forEach((member: any) => {
            if (!member.memberCheckbox) {
              // Set other fields to empty if memberCheckbox is false
              Object.keys(member).forEach(memberKey => {
                if (memberKey !== 'memberCheckbox') {
                  member[memberKey] = '';
                  let memberArrayControl = (this.dynamicFormGroup.get(parentControl.name)?.get(subControl.name)?.get(key)) as FormArray;
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
          let dependentControls: string[] = [];
          let tempControlArray = (((this.dynamicFormGroup.get(parentControl.name) as FormGroup)?.get(subControl.name) as FormGroup)?.get(key) as FormArray);
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
                          if (coreControl.innerControls) {
                            coreControl.innerControls?.forEach((innerControl: any) => {
                              this.validationErrorNotification(tempControlArray, aindex, coreControl, innerControl, innerSubControl);
                              breakFlag = true;
                            })
                          }
                          else if (coreControl.name == 'memberCheckbox' && coreControl.dependentControls) {
                            dependentControls = coreControl.dependentControls;
                          }
                          if (!subControl.conditionCheck) {
                            let memberFormGroup = tempControlArray.controls.find((group: AbstractControl) => {
                              return (group as FormGroup).get(coreControl.name)
                            }) as FormGroup;

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

      // ?.controls[0].setValue(false);
      let control = this.dynamicFormGroup.get(parentControl.name) as FormGroup;
      if (control) {
        const firstKey = Object.keys((this.dynamicFormGroup.get(parentControl.name) as FormGroup)?.controls)[0];
        // Get the first key
        if (count == 0) {
          control.controls[firstKey].setValue(false);
          this.addOnRemoved(subControl, parentControl)
        }
        else {
          control.controls[firstKey].setValue(true);
          this.changeOverLayDone(subControl, parentControl, true);
          this.changeRecalculate(true);
          this.addOnAdded(subControl, parentControl);
        }
      }

    }
    this.closeOverlay(subControl, parentControl);
  }

  closeOverlay(subControl: any, control: any = null) {
    if (subControl.conditionCheck && (this.dynamicFormGroup.get(control.name) as FormGroup).invalid) {
      console.log("sub control", subControl);
      this.toast.warning({ detail: "Warning", summary: "Please fill the mandatory fields", duration: 3000 })
    }
    else {
      console.log("pop up closed");

      this.closePopUp(control);
      subControl.visible = false;
    }
  }
  closePopUp(control: any = null) {
    if (this.dynamicFormGroup.get(control.name)?.invalid) {
      let dynamicControl = this.dynamicFormGroup.get(control.name);
      this.traverseFormGroup(dynamicControl as FormGroup);
      if (dynamicControl instanceof FormGroup) {
        Object.keys(dynamicControl.controls).forEach(arrayControl => {
        })
      }
    }
    else {
      this.isOverlayVisible = false;
    }
  }

  changeOverLayDone(control: any = null, parentControl: any = null, changeValue: boolean = false) {

    this.form.formSections.forEach((section) => {
      section.formControls.forEach((controls: any) => {
        // if (controls.name == 'recalculate') {
        //   controls.visible = true;
        // }
        // if (controls.name == 'next') {
        //   controls.visible = false;
        // }
        if (parentControl != null && controls.name == parentControl.name) {
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
  verifyKYC(control: any) {
    const proposerDOB = this.dynamicFormGroup.get('memberDobProposer')?.value;
    const panNumber = this.dynamicFormGroup.get('panNo')?.value;

    if (!proposerDOB || !panNumber) {
      this.toast.warning({ detail: "Warning", summary: "Both DOB and Pan No are mandatory for KYC", duration: 3000 });
      return;
    }

    const dobDate = new Date(proposerDOB);
    const formattedDOB = dobDate.getFullYear() + '-' +
      String(dobDate.getMonth() + 1).padStart(2, '0') + '-' +
      String(dobDate.getDate()).padStart(2, '0');

    const reqData = {
      dateOfBirth: formattedDOB,
      panNumber: panNumber
    };
    // if (panNumber && formattedDOB) {
    this.yatraService.GetKycDetails(reqData).subscribe({
      next: (response: any) => {
        if (response.isSuccess == true) {
          this.toast.success({ detail: "Success", summary: response.message, duration: 3000 });
          control.disabled = true;
          if (typeof response.data === 'object' && response.data !== null) {
            Object.keys(response.data).forEach((key: any) => {
              const fieldValue = response.data[key];
              this.dynamicFormGroup.get(key)?.setValue(fieldValue)
              const insuredMemberDetailsControl = this.dynamicFormGroup.get('insuredMemberDetails') as FormArray;

              if (insuredMemberDetailsControl) {
                insuredMemberDetailsControl.controls.forEach((control: any, index: any) => {
                  if (control.get('relation')?.value === 'Self') {
                    // Set the value for the matching 'self' relation
                    if (key == 'proposerPincode') {
                      control.get('pincode')?.setValue(fieldValue);
                    }
                    if (key == 'memberDobProposer') {
                      control.get('memberdob')?.setValue(fieldValue);
                    }
                    else
                      control.get(key)?.setValue(fieldValue);
                    if (response.data.upgradableZones) {
                      this.form.formSections.forEach((section: any) => {
                        if (section.sectionTitle == 'Insured Member Details') {
                          section.formControls.forEach((control: any) => {
                            if (control.dynamicControls && control.visible == true) {
                              control.dynamicControls[index + 1].forEach((dynamicControl: any) => {
                                if (dynamicControl.name == 'zoneValue') {
                                  dynamicControl.value = response.data.zoneValue;
                                  dynamicControl.options = response.data.upgradableZones;
                                  // .forEach((zoneOption: any) => {
                                  //   dynamicControl.options.push({
                                  //     name: zoneOption.zone.toString(), // Display name
                                  //     value: zoneOption.zoneCode.toString() // Corresponding value
                                  //   });
                                  // });
                                }
                              })
                            }
                          })
                        }
                      });
                    }

                  }
                });
              }
              this.form.formSections.forEach((section: any) => {
                section.formControls.forEach((control: any) => {
                  if (control.name === key) {
                    control.value = fieldValue;
                    if (fieldValue !== null && fieldValue !== 'null' && fieldValue !== '' &&
                      key !== 'mobileNumber' && key !== 'emailId') {
                      control.disabled = true;
                    }
                  }
                });
              });
            });

            // const zoneControl = this.dynamicFormGroup.get('zone');
            // if (control.name == 'zone' && control.type == 'select') {
            //   this.formData.availableZones.forEach((zoneOption: any) => {
            //     control.value = this.formData.proposerZone;
            //     control.options.push({
            //       name: zoneOption.toString(),
            //       value: zoneOption.toString()
            //     })
            //   })
            // }


            if (response.data.upgradableZones) {
              this.form.formSections.forEach((section: any) => {
                section.formControls.forEach((control: any) => {
                  if (control.name === 'zoneValue' && control.type === 'select') {
                    control.value = response.data.zoneValue; // Set the default value
                    control.options = response.data.upgradableZones;
                    // .forEach((zoneOption: any) => {
                    //   control.options.push({
                    //     name: zoneOption.zone.toString(), // Display name
                    //     value: zoneOption.zoneCode.toString() // Corresponding value
                    //   });
                    // });
                  }
                  else if (control.name == 'zone') {
                    control.value = response.data.zone;
                  }
                });
              });
            }
          }
        }
        else {
          this.toast.warning({ detail: "Warning", summary: "No Record Found", duration: 3000 });
        }
        // else {
        //   console.error('Expected response.data to be an object, but received:', response.data);
        // }
        // this.dynamicFormGroup.get('ckycNo')?.setValue(response.data.ckycNo);
      },
      error: (error) => {
        this.spinner.hide();
        this.toast.warning({ detail: "Warning", summary: "Failed to fetch KYC Details", duration: 3000 });
        console.error('Error fetching KYC details:', error);
      }
    });
    // }
    // else {
    //   this.toast.warning({ detail: "Warning", summary: "Please fill Pan Card and Date of Birth", duration: 3000 });
    // }
  }

  getPolicyDetails(control: any) {
    const policyNumberDetails = this.dynamicFormGroup.get('getPolicyNumber')?.value;
    const reqData = {
      policyNumber: policyNumberDetails
    };
    this.yatraService.GetCustomerDetailsViaPolicyNumber(reqData).subscribe({
      next: (response: any) => {
        this.toast.success({ detail: "Success", summary: response.message, duration: 3000 });
        this.spinner.hide();
        control.disabled = true;
        this.isPolicyDetailsFetch = true;
        if (response.data['insuredMemberDetails'].length > 0) {
          this.formData['insuredMemberDetails'] = response.data['insuredMemberDetails'];
          const insuredMembers: { [key: string]: boolean } = {};

          response.data['insuredMemberDetails'].forEach((member: any) => {
            insuredMembers[member.relation] = true; // Set as true
          });

          this.formData['insuredMembers'] = insuredMembers;
        }
        Object.keys(response.data).forEach((key: string) => {
          this.dynamicFormGroup.get(key)?.setValue(response.data[key]);
          if (key == 'memberPolicyType') {
            this.form.formSections.forEach((section: any) => {
              const targetControl = section.formControls.find((formControl: any) => formControl.name === 'memberPolicyType');
              if (targetControl) {
                this.handlePolicyTypeChange(targetControl, response.data['memberPolicyTypeChange']);
              }
            });
          }
        })
      },
      error: (error) => {
        this.spinner.hide();
        this.toast.warning({ detail: "Warning", summary: "Failed to fetch Policy Details", duration: 3000 });
        console.error('Error fetching Policy details:', error);
      }
    });
  }


  addDiseaseList(subControl?: any, control?: any) {
    if (this.isOverlayVisible) {
      this.isOverlayVisible = false;
    }
    else {
      this.isOverlayVisible = true;
    }
  }
  addNewDisease(subControl: any, control: any) {
    // if (subControl.innerArrayControl.length < 2) {
    //   const innerarrayControl = subControl.innerArrayControl[0]
    //   const firstKey = innerarrayControl.shift();  // This is the checkbox object
    //   // Step 2: Group the checkbox with the rest of the controls in a new array
    //   const groupedControls = [
    //     [firstKey, ...innerarrayControl],  // First group with checkbox
    //     [...innerarrayControl]  // Second group without checkbox
    //   ];
    //   subControl.innerArrayControl = groupedControls;
    // }
    // else {
    //   subControl.innerArrayControl.push(subControl.innerArrayControl[1]);
    // }
    let tempControl = subControl.innerArrayControl[0].map((element: any) => ({ ...element }));

    subControl.innerArrayControl.push(tempControl);
    const controlNames = Object.keys((this.dynamicFormGroup.get(control.name) as FormGroup)?.controls || {});
    const subName = controlNames.find(name => name === subControl.name);

    if (subName) {  // Check if abc is not undefined
      let formArr = (this.dynamicFormGroup.get(control.name) as FormGroup)?.controls[subName] as FormArray;
      formArr.push(this.initializeDynamicFormControls(tempControl, subControl.innerArrayControl.length - 1, subControl));
      // formArr.push(this.initializeDynamicFormControls(subControl.innerArrayControl[0], subControl.innerArrayControl.length - 1));
    }
  }

  removeDisease(subControl: any, control: any, index: any) {
    // this.spinner.show();

    if (subControl.innerArrayControl.length > 1) {
      subControl.innerArrayControl?.splice(index, 1);
      let formArray = (this.dynamicFormGroup.get(control.name) as FormGroup)?.controls[subControl.name] as FormArray;
      formArray.removeAt(index - 1);
      Object.keys(this.formData).forEach(key => {
        if (key.startsWith(`${control.name}.${subControl.name}.${index - 1}.`)) {
          delete this.formData[key];
        }
        // if (key.includes(option.value)) {
        //   delete this.formData[key]
        // }
      });
      // setTimeout(() => { 
      //   // this.spinner.hide();
      // }, 0);
      // subControl.innerArrayControl.splice(index, 1);

      // ((this.dynamicFormGroup.get(control.name) as FormGroup)?.controls[subControl.name] as FormArray)?.removeAt(index);
      this.changeDetectorRef.detectChanges();
    }
  }

  copyText(control: any) {
    this.clipboard.copy(this.dynamicFormGroup.get(control.name)?.value);
    this.toast.success({ detail: "Success", summary: `Text copied to clipboard!`, duration: 3000 });
    // this.messageService.add({severity:'success', summary: 'Success', detail: 'Text copied to clipboard!'});
  }


  async mappedFormDataFullQuote(formData: any): Promise<Partial<IFullQuoteMapping>> {
    console.log(formData, this.covers);

    const nomineeAge: any = await this.calculateAge(formData?.nomineeDob);
    const idNo = formData?.aadharIdNo || formData?.passportIdNo || formData?.licenseIdNo || formData?.voterIdNo || formData?.marksheetIdNo || '';
    const storedAgentCode = localStorage.getItem('parentCode')?.trim() || '';
    const updatedAgentCode = (storedAgentCode || this.agentCode || '').trim();

    const mappedData: Partial<IFullQuoteMapping> = {
      agentCode: updatedAgentCode || '',
      productName: formData?.productName || '',
      productCode: formData?.productId || '',
      planCode: formData?.planCode || '',
      planName: formData?.productVariant || '',
      proposalNum: this.proposalNum || '',
      policyType: formData?.memberPolicyType || '',
      businessType: formData?.typeOfBusiness || '',
      insuredMemberDetails: formData?.insuredMemberDetails?.map((member: any, index: any) => {
        const rrtoCover = (this.covers[index] || []).find((cover: any) => cover.coverId === 'RRTO');
        const chrhSptCover = (this.covers[index] || []).find((cover: any) => cover.coverId === 'CHRHSPT');
        console.log(chrhSptCover);
        let chronicDiseases = "";
        if (chrhSptCover) {
          const productQuestionnaire = JSON.parse(member?.productQuestionnaire);
          const chronicCare = formData?.chronicCare;
          if (chronicCare && chronicCare.addOnDetails) {
            const addOnMemberDetails = chronicCare.addOnDetails[member?.relation];
            if (Array.isArray(addOnMemberDetails)) {
              // Loop through addOnMemberDetails
              addOnMemberDetails.forEach((detail) => {
                // Check if the key includes "question" and the object is not empty
                Object.keys(detail).forEach((key) => {
                  if (
                    key.includes("Question") &&
                    detail[key] &&
                    typeof detail[key] === "object" &&
                    Object.keys(detail[key]).length > 0
                  ) {
                    // Push the valid question object into productQuestionnaire
                    productQuestionnaire.push(detail[key]);
                    Object.keys(detail[key]).forEach((key2) => {
                      if (key2 == 'diseaseCode') {
                        chronicDiseases += chronicDiseases == ""
                          ? `${detail[key][key2]}`
                          : `,${detail[key][key2]}`;
                      }
                    })
                  }
                  if (key.includes("obesityValue")) {
                    Object.keys(detail[key]).forEach((key2) => {
                      if (key2 == 'diseaseCode') {
                        chronicDiseases += chronicDiseases == ""
                          ? `${detail[key][key2]}`
                          : `,${detail[key][key2]}`;
                      }
                    })
                  }
                });
              });
            }
          }
          member.productQuestionnaire = JSON.stringify(productQuestionnaire);
        }
        else if (member['chronicDiseases']) {
          chronicDiseases = member['chronicDiseases'] = Object.keys(member.chronicDiseases)
            .filter(disease => member.chronicDiseases[disease]) // Filter diseases with a value of true
            .map(disease => disease.charAt(0).toUpperCase() + disease.slice(1)) // Capitalize the first letter
            .join(',');
        }

        if (member.hospiCashCoverDetails && Array.isArray(member.hospiCashCoverDetails)) {
          member.hospiCashCoverDetails = member.hospiCashCoverDetails.filter(
            (detail: any) => detail.memberCover !== "" && detail.memberCover !== false
          );
        }

        return {
          relation: member?.relation || '',
          memberRelationCode: this.jsonParse(member.relationshipType, 'id') || '',
          memberSalutation: member?.preFix || '',
          firstName: member?.firstName || '',
          middleName: member?.middleName || '',
          lastName: member?.lastName || '',
          height: member?.height || '',
          heightInInches: member?.heightInches || '',
          weight: member?.weight || '',
          memberdob: member?.memberdob || '',
          emailId: member?.emailId || '',
          mobileNumber: member?.mobileNumber || '',
          memberNationality: this.jsonParse(formData.nationality, 'name') || '',
          relationshipType: member.relation || '',
          memberAge: member?.memberAge || '',
          memberGender: member?.memberGender || '',
          memberPincode: member?.pincode || '',
          preExistingDisease: member?.preExistingDisease || '',
          memberIndex: member?.memberIndex || '',
          zone: member?.zone || '',
          zoneValue: member?.zoneValue || '',
          state: member?.state || '',
          city: member?.city || '',
          memberType: member?.memberType || '',
          memberSumInsured: member?.sumInsured || '',
          memberNatureOfDuty: JSON.parse(member?.productMemberNatureWork).name || '',
          memberDesignation: JSON.parse(member?.productMemberDesignation).name || '',
          // memberOccupation: JSON.parse(member?.productMemberOccupation).value || '',
          memberOccupation: (member?.productMemberOccupation != '') ? JSON.parse(member?.productMemberOccupation).value || '' : '',
          covers: this.covers[index] || [],
          productQuestionnaire: member?.productQuestionnaire,
          memberRoomCategory: rrtoCover ? rrtoCover.value : member?.memberRoomCategory || '',
          pedWaitingPeriod: this.pedWaitingPeriod || '',
          chronicDisease: chronicDiseases || '',
          deductibleAmount: member?.deductibleAmount || '',
          previousPolicyDetails: member?.previousPolicyDetails || [],
          hospiCashCoverDetails: member?.hospiCashCoverDetails || [],
          activePolicyDetails: member?.activePolicyDetails || [],
          personalHabitDetail: member?.personalHabitDetail || '',
          isSmoking: member.isSmoking || '',
          isTobacco: member.isTobacco || '',
          alcohol: member.alcohol || '',
        };
      }) || [],
      CKYCNo: this.formData?.ckycNo || '',
      QuoteId: formData?.quoteId || '',
      LeadId: formData?.leadNumber || '',
      proposerSalutation: formData?.preFix || '',
      proposerFirstName: formData?.firstName || '',
      proposerMiddleName: formData?.middleName || '',
      proposerLastName: formData?.lastName || '',
      proposerDob: formData?.memberDobProposer || '',
      proposerAge: formData?.memberAgeProposer || '',
      proposerGender: formData?.proposerGender || '',
      proposerMobileNumber: formData?.mobileNumber || '',
      proposerWhatsAppNo: formData?.whatsappNo || formData?.mobileNumber,
      proposerAddress1: formData?.permanentAddress1 || '',
      proposerAddress2: formData?.permanentAddress2 || '',
      proposerCity: formData?.city || '',
      proposerState: formData?.state || '',
      proposerEmailId: formData?.emailId || '',
      proposerPincode: formData?.proposerPincode || '',
      idProof: this.jsonParse(formData?.idProof, 'value') || '',
      idNo: idNo || '',
      proposerAnnualIncome: formData?.annualIncome || '',
      // proposerOccupation: this.jsonParse(formData?.occupation, 'value') || '',
      proposerOccupation: (formData?.occupation) ? this.jsonParse(formData?.occupation, 'value') || '' : '',
      proposerEducation: this.jsonParse(formData?.educationDetails, 'id') || '',
      proposerPANNo: formData?.panNo || '',
      gstDetails: JSON.parse(formData?.gstDetails).value || '',
      gstIn: this.formData?.gstIn || '',
      proposerMaritalStatus: this.jsonParse(formData?.maritalStatus, 'value') || '',
      ifPEP: formData?.isPep || '',
      proposerNationality: this.jsonParse(formData.nationality, 'name') || '',
      nomineeFirstName: formData?.nomineeFirstName || '',
      nomineeMidleName: formData?.nomineeMiddleName || '',
      nomineeLastName: formData?.nomineeLastName || '',
      nomineeRelation: this.jsonParse(formData?.nomineeRelationWithProposer, 'name') || '',
      nomineeRelationCode: this.jsonParse(formData?.nomineeRelationWithProposer, 'value') || '',
      nomineeContactNumber: formData?.nomineeContactNo || '',
      nomineeAddress: formData?.nomineeAddress || '',
      nomineeDob: formData?.nomineeDob || '',
      nomineeAge: nomineeAge || '',
      NameofAccountHolder: formData?.firstName || '',
      accountNumber: formData?.accountNumber || '',
      accountType: this.jsonParse(formData?.accountType, 'value') || '',
      bankAccountType: this.jsonParse(formData?.accountType, 'name') || '',
      bankCity: this.jsonParse(formData?.bankCity, 'name') || '',
      bankBranch: this.jsonParse(formData?.bankBranch, 'name') || '',
      paymentMode: this.selectedButton || '',
      chequeNumber: formData?.chequeNumber || '',
      chequeDate: formData?.chequeDate || '',
      bankName: this.jsonParse(this.formData?.bankName, 'name') || '',
      ifscCode: formData?.ifscCode || '',
      micrNo: formData?.micrCode || '',
      premiumAmount: formData?.totalPremium || '',
      selectedTenure: (parseInt(formData?.tenure)).toString() || '',
      paymentDate: new Date().toISOString().split("T")[0] as any || '',
      paymentCollectionMode: formData.paymentOption || '',
      paymentByRelationship: 'Self',
      payerName: formData?.accountHolderName || '',
      paymentBy: 'customer',
      PaymentGatewayName: formData?.PaymentGatewayName || '',
      familySize: formData?.familySize || '',
      appointeeName: formData?.appointeeName || '',
      appointeeMobileNumber: formData?.appointeeContactNo || '',
      appointeeRelationCode: formData?.appointeeRelationWithNominee ? this.jsonParse(formData.appointeeRelationWithNominee, 'value') : '',
      lrFlag: formData?.lrFlag || '',
      affiliateEmployeeId: formData?.affiliateEmployeeId || '',
      isAffiliateEmployee: formData?.isAffiliateEmployee || '',
      nameOfTheAffiliate: formData?.nameOfTheAffiliate ? this.jsonParse(formData?.nameOfTheAffiliate, 'name') : '',
    };
    return mappedData;
  }

  async getFullQuoteViaOfflinePayment(documentId: any): Promise<void> {
    return new Promise((resolve, reject) => {
      const data = this.dynamicFormGroup.getRawValue();
      console.log(this.selectedButton, data, this.formData, this.fullQuoteDocRelated, this.fullQuoteDocRelatedWithOutOffline);
      const formData = {
        policyType: 'New Business',
        paymentMethod: 'offline',
        premiumAmount: (this.formData?.totalPremium || '').toString(),
        instrumentNo: (this.selectedButton === 'loanPayment'
          ? this.formData?.loanAccountNumber
          : this.selectedButton === 'bankFundTransfer'
            ? this.formData?.transactionReferanceId
            : this.formData?.chequeNumber || ''
        ).toString(),
        instrumentDate: (this.formData?.chequeDate || this.formData?.transactionDate || '').toString(),
        policyNumber: "".toString(),
        agentCode: (this.agentCode || '').toString(),
        bankName: (this.formData?.bankName).toString(),
        bankAccountNumber: (this.formData?.accountNumber).toString(),
        IFSC: (this.formData?.ifscCode || '').toString(),
        micrNo: (this.formData?.micrCode || '').toString(),
        instrumentType: (this.selectedButton === 'offline'
          ? this.formData?.paymentOption
          : 'RTGS/ NEFT'
        ).toString(),
        source: "Retail".toString(),
        documentId: (this.fullQuoteDocRelated || '').toString(),
        proposalNum: this.proposalNum.toString(),
        productName: this.formData.productName || ''
      };
      // const formData = {
      //   policyType: 'New Business',
      //   paymentMethod: (this.selectedButton || '').toString(),
      //   premiumAmount: (this.formData?.totalPremium || '').toString(),
      //   instrumentNo: (this.formData?.chequeNumber || '').toString(),
      //   instrumentDate: (this.formData?.chequeDate || '').toString(),
      //   policyNumber: "".toString(),
      //   agentCode: (this.agentCode || '').toString(),
      //   bankName: (this.formData?.bankName).toString(),
      //   bankAccountNumber: (this.formData?.accountNumber).toString(),
      //   IFSC: (this.formData?.ifscCode || '').toString(),
      //   micrNo: (this.formData?.micrCode || '').toString(),
      //   instrumentType: (this.formData.paymentOption || '').toString(),
      //   source: "Retail".toString(),
      //   documentId: (this.fullQuoteDocRelated || '').toString(),
      //   proposalNum: this.proposalNum.toString(),
      //   productName: this.formData.productName || ''
      // };
      this.yatraService.getFullQuoteViaOfflinePayment(formData).subscribe({
        next: (res: any) => {
          if (res?.isSuccess) {
            this.formData.policyNumber = res.data.policyNumber || null;
            this.formData.policyStatus = res.data.policyStatus || null;
            this.formData.quoteValidFromDate = res.data.policyStartDate || null;
            this.formData.quoteValidToDate = res.data.policyEndDate || null;
            this.formData.ReceiptNumber = res.data.receiptNumber || null;
            this.formData.customerId = res.data.customerId || null;
            this.formData.applicationNumber = res.data.applicationNumber || null;

            this.toast.success({
              detail: "Success",
              summary: `Full Quotation Generated Successfully. Customer ID: ${this.formData.customerId}`,
              duration: 3000,
            });
            resolve();
          }
          else {
            const errorMessage = res.message || "Full Quote generation failed.";
            console.error(errorMessage);
            this.toast.error({
              detail: "Error",
              summary: errorMessage,
              duration: 5000,
            });
            reject(new Error(errorMessage));
          }
        },
        error: (err) => {
          console.error(err);
          this.toast.error({
            detail: "Error",
            summary: "Something went wrong. Please try again.",
            duration: 3000,
          });
          reject(err);
        },
      });
    });
  }


  insertFullQuoteJson(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.mappedFormDataFullQuote(this.formData).then((data) => {
        const req = {
          proposalNum: this.proposalNum,
          fullQuoteJson: JSON.stringify(data)
        }
        this.yatraService.insertFullQuoteJson(req).subscribe({
          next: (res: any) => {
            resolve();
          },
          error: (err) => {
            console.error(err);
            reject(err);
          }
        });
      }).catch((err) => {
        this.toast.error({ detail: "Error", summary: "Failed to map form data", duration: 3000 });
        reject(err);
      });
    });
  }

  jsonParse(string: any, extract: any) {
    const value = JSON.parse(string);
    return value[extract];
    // try {
    //   const data = JSON.parse(string);
    //   if (typeof data === 'object') {
    //     return data[extract];
    //   }
    // } catch (error) {
    //   console.error('Error parsing JSON:', error);
    //   return null; // Return null or handle as needed
    // }
  }

  changeRecalculate(visiblility: boolean = true) {
    console.log(visiblility);

    this.form.formSections.forEach((section: any) => {
      section.formControls.forEach((formControl: any) => {
        if (formControl.name == 'recalculate') {
          formControl.visible = visiblility;
        }
        if (formControl.name == 'next') {
          formControl.visible = !visiblility;
        }
      })
    })
  }

  redirectToCreateABHAID() {
    const abhaIDUrl = "https://mtpre.adityabirlahealth.com/healthinsurance/abha";
    window.open(abhaIDUrl, '_blank'); // Opens the URL in a new tab
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
      this.toast.success({ detail: 'Success', summary: 'Feedback submitted successfully! Thank you for your input.' });
    }, (error) => {
      this.toast.error({ detail: 'Error', summary: 'Failed to submit feedback. Please try again later.' });
    });
    // this.customerFeedbackModule.hide();
    this.isFeedBackModalVisible = false;
  }

  closeIsFeedBackModalVisible() {
    let reqData = {
      "proposalNum": this?.formData?.proposalNumber,
      "partnerId": this.partnerId,
      "agentCode": this.agentCode,
      "formData": JSON.stringify(this.dynamicFormGroup.getRawValue()),
      "formName": this.formSequence[this.getFormIndexValue()].formName,
      "formConfig": JSON.stringify(this.formSequence),
      "productId": this.productId.toString(),
      "formId": this.formSequence[this.getFormIndexValue()].formId,
      "jsonForm": JSON.stringify(this.form),
      "formSequence": this.getFormIndexValue(),
      "leadNumber": this.leadnumber,
      "quoteNumber": this.formData.quoteId ? this.formData.quoteId : ""
    };
    this.yatraService.Insertorupdateformdata(reqData).subscribe({
      next: (res: any) => {
        this.leadnumber = res.data;
      },
      error: (err) => {
        console.error(err);
      }
    });

    const loggedInAgentCode = localStorage.getItem('agentCode');
    if (loggedInAgentCode) {
      localStorage.setItem('parentCode', loggedInAgentCode);
    }
    this.isFeedBackModalVisible = false;
  }

  onSelectValue(value: String) {
    this.feedbackImpressedValue = value;
  }

  redirectToGooglePlay() {
    const googlePayUrl = "https://play.google.com/store/apps/details?id=com.adityabirlahealth.insurance&pcampaignid=web_share";
    window.open(googlePayUrl, '_blank');
  }

  redirectToAppStore() {
    const appleStoreUrl = "https://apps.apple.com/in/app/activ-health/id1179005764";
    window.open(appleStoreUrl, '_blank');
  }
  async mappingForQuestionnaire(form: any) {
    // let productQuestionnaire:any=[];
    const reqData = {
      partnerId: this.partnerId.toString(),
      productId: this.productId.toString(),
      formId: this.formSequence.length == 0 ? "0" : this.formSequence[this.getFormIndexValue() - 1].formId.toString(),
      proposalNum: this.proposalNum,
      agentCode: this.agentCode,
      leadId: this.quickQuoteRedirect == false ? '' : this.leadNumber,
      isLead: this.quickQuoteRedirect == false ? false : true,
      currentFormSequence: (this.getFormIndexValue() - 1).toString()
    }


    // await this.yatraService.Getform(reqData).subscribe({
    //   next: async (res: any) => {
    try {
      const res: any = await this.yatraService.Getform(reqData).toPromise();
      this.questionFormData = JSON.parse(res.data.formData)  // parsed response data
      console.log("form", this.questionFormData);
      const dynamicValue = this.dynamicFormGroup.getRawValue();
      // Iterate through each member in the insuredMemberDetails
      await this.questionFormData.insuredMemberDetails.forEach((member: any) => {
        delete member.productQuestionnaire;
      })
      await form.formSections.forEach((section: any) => {
        section.formControls.forEach((controls: any) => {
          if (controls.type == 'questionnaire') {
            this.questionFormData.insuredMemberDetails.forEach((member: any, index: any) => {
              // Initialize the optionsArray for each member
              const productQuestionnaire: any[] = [];
              const optionsArray: any[] = [];
              let questionId: any;
              let questionName: any
              // Find the matching control based on member's relation
              const matchingControl = controls.subControls.find((subControl: any) =>
                subControl.name === member.relation
              );
              questionId = controls.idProperty;
              questionName = controls.name;
              // If a matching control is found
              if (matchingControl) {
                // Iterate through innerArrayControl to find the control with name 'dName'
                matchingControl.innerArrayControl[0].forEach((innerControl: any) => {
                  // Check if innerControl has a dName property
                  if (innerControl && innerControl.name === 'diseaseName') {
                    // Check if options exist in innerControl
                    if (innerControl.options) {
                      // Push options into the optionsArray
                      optionsArray.push(...innerControl.options);
                    }
                  }
                });
              }
              // Initialize the productQuestionnaire array for the current member

              // Iterate through the dynamicValue object
              Object.keys(dynamicValue).forEach((item: any) => {
                if (questionName == item && dynamicValue[item] != null && typeof dynamicValue[item] === 'object') {
                  const innerValue = dynamicValue[item];

                  // Iterate through the keys of the inner object
                  Object.keys(innerValue).forEach((subItem: any) => {
                    // Check if the member's relation matches the current subItem
                    if (member.relation === subItem) {

                      // Iterate through the array related to the matched subItem
                      innerValue[subItem].forEach((innerArray: any) => {
                        if (!innerArray.hasOwnProperty('subQuestionCode')) {
                          innerArray.subQuestionCode = "";
                        }

                        if (innerArray.diseaseName) {
                          // If optionsArray is not empty, find the corresponding option
                          if (optionsArray.length > 0) {
                            const newOption = optionsArray.find((option: any) => option.value === innerArray.diseaseName);

                            // Set subQuestionCode and dName based on the found option
                            if (newOption) {
                              innerArray.subQuestionCode = newOption.value;
                              innerArray.diseaseName = newOption.name;
                            }
                          }
                          const filteredInnerArray = innerArray;
                          const allValuesEmpty = Object.values(filteredInnerArray).every(value => value === "");

                          if (filteredInnerArray['diseaseName'] !== "" && !allValuesEmpty) {
                            innerArray.parentQuestionCode = questionId;
                            productQuestionnaire.push(filteredInnerArray);
                          }
                        }
                        else if (innerArray.conditionDetails) {
                          const filteredInnerArray = innerArray;
                          const allValuesEmpty = Object.values(filteredInnerArray).every(value => value === "");

                          if (filteredInnerArray['conditionDetails'] !== "" && !allValuesEmpty) {
                            innerArray.parentQuestionCode = questionId;
                            productQuestionnaire.push(filteredInnerArray);
                          }
                        }
                        else {
                          const allValuesEmpty = Object.values(innerArray).every(value => value === "");

                          if (!allValuesEmpty) {
                            innerArray.harmfulSubstances = true;
                            innerArray.parentQuestionCode = questionId;
                            productQuestionnaire.push(innerArray);
                          }
                        }
                        // productQuestionnaire.push(filteredInnerArray);
                      });
                    }
                  });
                }
              });

              // Assign the populated productQuestionnaire to the member
              if (member.productQuestionnaire) {
                member.productQuestionnaire = member.productQuestionnaire.concat(productQuestionnaire);
              }
              else {
                member.productQuestionnaire = productQuestionnaire;
              }
              // Log the final productQuestionnaire for debugging
            });
          }
          else if (controls.type == 'chronicquestionnaire') {
            this.questionFormData.insuredMemberDetails.forEach((member: any, index: any) => {
              // Initialize the optionsArray for each member
              const productQuestionnaire: any[] = [];
              const optionsArray: any[] = [];
              let questionId: any;
              let questionName: any
              // Find the matching control based on member's relation
              const matchingControl = controls.subControls.find((subControl: any) =>
                subControl.name === member.relation
              );
              questionId = controls.idProperty;
              questionName = controls.name;
              // If a matching control is found
              // Initialize the productQuestionnaire array for the current member

              // Iterate through the dynamicValue object
              Object.keys(dynamicValue).forEach((item: any) => {
                if (questionName == item && dynamicValue[item] != null && typeof dynamicValue[item] === 'object') {
                  const innerValue = dynamicValue[item];

                  // Iterate through the keys of the inner object
                  Object.keys(innerValue).forEach((subItem: any) => {
                    // Check if the member's relation matches the current subItem
                    if (member.relation === subItem) {
                      innerValue[subItem].parentQuestionCode = questionId;
                      console.log(innerValue[subItem]);
                      productQuestionnaire.push(innerValue[subItem]);
                      // Iterate through the array related to the matched subItem
                    }
                  });
                }
              });

              // Assign the populated productQuestionnaire to the member
              if (member.productQuestionnaire) {
                member.productQuestionnaire = member.productQuestionnaire.concat(productQuestionnaire);
              }
              else {
                member.productQuestionnaire = productQuestionnaire;
              }
              // Log the final productQuestionnaire for debugging
            });
          }
        })
      })
      this.questionFormData.insuredMemberDetails.forEach((member: any, index: any) => {

        if (!this.dynamicFormGroup.contains('insuredMemberDetails')) {
          this.dynamicFormGroup.addControl('insuredMemberDetails', new FormArray([]));
        }

        const dynamicform = this.dynamicFormGroup.get('insuredMemberDetails') as FormArray;

        // Ensure the FormArray has enough entries
        while (dynamicform.length <= index) {
          dynamicform.push(new FormGroup({}));
        }

        const dindex = dynamicform.at(index) as FormGroup;
        Object.keys(member).forEach((key: string) => {
          dindex.addControl(key, new FormControl(member[key]));
        });
        const stringifiedProductQuestionnaire = JSON.stringify(member.productQuestionnaire);
        dindex.addControl('productQuestionnaire', '');

        dindex.get('productQuestionnaire')?.setValue(stringifiedProductQuestionnaire);
      })
    } catch (error) {
      console.error(error);
    }
    //   },
    //   error: (err) => {
    //     console.log(err);
    //   }
    // });
  }

  backToleads() {
    this.router.navigate(['/leads/leadsList'], {
    });
  }

  backToProductComparison() {
    this.router.navigate(['/products/comparison'], {
    });
  }
  validationErrorNotification(dynamicControl: any, aindex: any, coreControl: any, innerControl: any, innerSubControl: any) {
    if (dynamicControl instanceof FormArray) {
      dynamicControl.controls.forEach(arrayControl => {
        if (arrayControl instanceof FormGroup) {
          Object.keys(arrayControl.controls).forEach((nestedField: any) => {
            const fieldJson = innerSubControl.coreControls.find((type: any) => type.name == nestedField);
            if (arrayControl.controls[nestedField] instanceof FormGroup) {
              const subControl = arrayControl.controls[nestedField] as FormGroup;

              for (const controlName of Object.keys(subControl.controls)) {
                const control = subControl.controls[controlName];
                const nestedControl = subControl.get(controlName);
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

  patchDropDownValues() {
    let personalDetailsSection: any = this.form.formSections.find((formSection: any) => formSection.sectionTitle === 'Personal Details');
    let maritalStatusInfo: any = personalDetailsSection.formControls.find((formControl: any) => formControl.name === "maritalStatus");
    const maritalStatusPatchValue = maritalStatusInfo.options.find((option: any) => option.value === this.quoteLeadInformation.maritalStatus);
    let educationDetails: any = personalDetailsSection.formControls.find((formControl: any) => formControl.name === "educationDetails");
    const educationDetailsPatchValue = educationDetails.options.find((option: any) => option.value === this.quoteLeadInformation.education);
    this.dynamicFormGroup.patchValue({
      maritalStatus: JSON.stringify(maritalStatusPatchValue),
      proposerGender: this.quoteLeadInformation.gender,
      educationDetails: JSON.stringify(educationDetailsPatchValue),
      preFix: this.quoteLeadInformation.salutation
    });
  }

  resetZoneAndLocationFields() {
    this.dynamicFormGroup.get('city')?.setValue('');
    this.dynamicFormGroup.get('state')?.setValue('');
    this.dynamicFormGroup.get('zone')?.setValue('');
    this.dynamicFormGroup.get('zone')?.disable();
    this.dynamicFormGroup.get('zone')?.setValue('');
    this.form.formSections.forEach((section: any) => {
      section.formControls.forEach((control: any) => {
        if (control.name === 'zoneValue') {
          control.options = [];
        }
      });
    });
  }

  resetDynamicZoneFields(parentControl: any, index: number) {
    const patchObject: { [key: string]: any } = {
      city: '',
      state: '',
      zone: '',
      zoneValue: ''
    };

    let formArray: any = this.dynamicFormGroup.get(parentControl.name)?.value;
    if (formArray && Array.isArray(formArray)) {
      formArray[index] = { ...formArray[index], ...patchObject };
      this.dynamicFormGroup.get(parentControl.name)?.patchValue(formArray);
    }
  }
  traverseFormGroup(formGroup: FormGroup | FormArray) {
    if (formGroup instanceof FormGroup) {
      Object.keys(formGroup.controls).forEach((key) => {
        const control = formGroup.get(key);

        if (control instanceof FormControl) {
          control.markAsTouched();
        } else if (control instanceof FormGroup) {
          // Recursively traverse nested FormGroup
          this.traverseFormGroup(control);
        } else if (control instanceof FormArray) {
          control.controls.forEach((arrayControl, index) => {
            // Recursively traverse FormGroup or FormControl within the FormArray
            this.traverseFormGroup(arrayControl as FormArray);
          });
        }
      });
    } else if (formGroup instanceof FormArray) {
      formGroup.controls.forEach((arrayControl, index) => {
        // Recursively traverse FormGroup or FormControl within the FormArray
        this.traverseFormGroup(arrayControl as FormArray);
      });
    }
  };
  getDate(dateType: any): string {
    if (dateType === 'currentDate') {
      return this.currentDate;
    } else if (dateType === 'futureDate') {
      return this.futureDate;
    } else if (dateType === 'pastDate') {
      return this.pastDate;
    }
    return '';  // Default return if no valid date type is found
  }
  allPreselectMember(control: any) {
    const PED = (this.dynamicFormGroup.get('waitingPED') as FormGroup).get(control.name)?.value
    this.pedWaitingPeriod = PED;
    // this.changeOverLayDone();
    this.changeRecalculate(true);
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

  // disableFormControl(controlName: string, parentControlName: string | null = null, index: any = null): void {
  //   let formControl;
  //   if (parentControlName) {
  //     const parentControl = this.dynamicFormGroup.get(parentControlName);
  //     if (parentControl instanceof FormArray) {
  //       if (index !== null && index >= 0 && index < parentControl.length) {
  //         const childGroup = parentControl.at(index) as FormGroup;
  //         formControl = childGroup.get(controlName);
  //       } else {
  //         console.error(`Invalid index: ${index} for FormArray ${parentControlName}`);
  //         return;
  //       }
  //     } else if (parentControl instanceof FormGroup) {
  //       formControl = parentControl.get(controlName);
  //     } else {
  //       console.error(`Parent control ${parentControlName} is not a FormArray or FormGroup`);
  //       return;
  //     }
  //   } 
  //   // else {
  //   //   formControl = this.dynamicFormGroup.get(controlName);
  //   // }

  //   if (formControl) {
  //     formControl.disable();
  //   } else {
  //     console.error(`Control ${controlName} not found`);
  //   }
  // }

  onDrillDown(index: any, caseName: any) {
    const lastPage = this.getFormIndexValue()
    if (this.formSequence.length - 1 == lastPage) {
      return;
    }
    this.setFormIndexValue(index)
    this.getFormDataFromFormSequence(this.formSequence[index][caseName?.formId]);
  }

  deductibleOptionsB(control: any, parentControl: any, sumInsured: any) {
    const data: any = {
      300000: [
        { name: "100000", label: "100000", value: 100000 },
        { name: "200000", label: "200000", value: 200000 },
        { name: "300000", label: "300000", value: 300000 },
      ],
      400000: [
        { name: "100000", label: "100000", value: 100000 },
        { name: "200000", label: "200000", value: 200000 },
        { name: "300000", label: "300000", value: 300000 },
        { name: "400000", label: "400000", value: 400000 },
      ],
      500000: [
        { name: "100000", label: "100000", value: 100000 },
        { name: "200000", label: "200000", value: 200000 },
        { name: "300000", label: "300000", value: 300000 },
        { name: "400000", label: "400000", value: 400000 },
        { name: "500000", label: "500000", value: 500000 },
      ],
      700000: [
        { name: "100000", label: "100000", value: 100000 },
        { name: "200000", label: "200000", value: 200000 },
        { name: "300000", label: "300000", value: 300000 },
        { name: "400000", label: "400000", value: 400000 },
        { name: "500000", label: "500000", value: 500000 },
        { name: "700000", label: "700000", value: 700000 },
      ],
      1000000: [
        { name: "100000", label: "100000", value: 100000 },
        { name: "200000", label: "200000", value: 200000 },
        { name: "300000", label: "300000", value: 300000 },
        { name: "400000", label: "400000", value: 400000 },
        { name: "500000", label: "500000", value: 500000 },
        { name: "700000", label: "700000", value: 700000 },
        { name: "1000000", label: "1000000", value: 1000000 },
      ],
      1500000: [
        { name: "400000", label: "400000", value: 400000 },
        { name: "500000", label: "500000", value: 500000 },
        { name: "700000", label: "700000", value: 700000 },
        { name: "1000000", label: "1000000", value: 1000000 },
      ],
      2000000: [
        { name: "400000", label: "400000", value: 400000 },
        { name: "500000", label: "500000", value: 500000 },
        { name: "700000", label: "700000", value: 700000 },
        { name: "1000000", label: "1000000", value: 1000000 },
      ],
      2500000: [
        { name: "400000", label: "400000", value: 400000 },
        { name: "500000", label: "500000", value: 500000 },
        { name: "700000", label: "700000", value: 700000 },
        { name: "1000000", label: "1000000", value: 1000000 },
      ],
      3000000: [
        { name: "400000", label: "400000", value: 400000 },
        { name: "500000", label: "500000", value: 500000 },
        { name: "700000", label: "700000", value: 700000 },
        { name: "1000000", label: "1000000", value: 1000000 },
      ],
      4000000: [
        { name: "400000", label: "400000", value: 400000 },
        { name: "500000", label: "500000", value: 500000 },
        { name: "700000", label: "700000", value: 700000 },
        { name: "1000000", label: "1000000", value: 1000000 },
      ],
      5000000: [
        { name: "400000", label: "400000", value: 400000 },
        { name: "500000", label: "500000", value: 500000 },
        { name: "700000", label: "700000", value: 700000 },
        { name: "1000000", label: "1000000", value: 1000000 },
      ],
      8500000: [
        { name: "1500000", label: "1500000", value: 1500000 },
      ],
      9000000: [
        { name: "1000000", label: "1000000", value: 1000000 },
      ],
      9500000: [
        { name: "500000", label: "500000", value: 500000 },
      ],
    };
    if (control == null && parentControl == null) {
      return data[sumInsured][0].value;

    }
    this.formData.insuredMemberDetails.forEach((member: any) => {
      if (member.relation == parentControl.name) {
        const sumInsured = member.sumInsured;
        const newOptions = data[sumInsured];
        control.options = newOptions;
      }
    })
  }

  deductibleOptionsA(control: any, parentControl: any, sumInsured: any) {
    const data: any = {
      8500000: [
        {
          name: '1500000',
          label: '1500000',
          value: 1500000
        }
      ],
      9000000: [
        {
          name: '1000000',
          label: '1000000',
          value: 1000000
        }
      ],
      9500000: [
        {
          name: '500000',
          label: '500000',
          value: 500000
        }
      ]
    };

    if (control == null && parentControl == null) {
      return data[sumInsured][0].value;
    }

    this.formData.insuredMemberDetails.forEach((member: any) => {
      if (member.relation == parentControl.name) {
        const sumInsured = member.sumInsured;
        const newOptions = data[sumInsured];
        control.options = newOptions;
      }
    })
  }

  parseName(fullName: any) {
    const nameParts = fullName.value.trim().split(/\s+/);
    let firstName = '';
    let middleName = '';
    let lastName = '';

    if (nameParts.length === 1) {
      firstName = nameParts[0]; // Assign the single name to `firstName`
    } else if (nameParts.length === 2) {
      firstName = nameParts[0];
      lastName = nameParts[1];
    } else if (nameParts.length > 2) {
      firstName = nameParts[0];
      middleName = nameParts.slice(1, -1).join(' '); // Join all middle parts
      lastName = nameParts[nameParts.length - 1];
    }

    return {
      firstName,
      middleName,
      lastName,
    };
  }


  pennyDrop(control: any, dataObj?: any) {
    if (control.dependentControls.includes("pennyBtn")) {
      this.changeMainFormDependentControls(control.dependentControls, true)
    }
  }

  onClickPennyBtn() {
    const obj = {
      "proposalNum": this.dynamicFormGroup?.controls['proposalNumber'].value,
      "proposerName": this.dynamicFormGroup?.controls['accountHolderName'].value,
      "bankAccountNumber": this.dynamicFormGroup?.controls['accountNumber'].value,
      "ifscCode": this.dynamicFormGroup?.controls['ifscCode'].value
    }

    this.yatraService.pennyDropVerfication(obj).subscribe({
      next: (response: any) => {
        if (response.isSuccess && response.data) {
          this.pennyDropVerficationDetails = response.data;
          this.toast.success({ detail: "Success", summary: response.message, duration: 3000 });
        } else {
          // Handle error, you can show a message if required
          this.toast.warning({ detail: "Warning", summary: 'Failed transaction', duration: 3000 });
        }
      },
      error: (err) => {
        this.toast.error({ detail: "Error", summary: 'Failed transaction', duration: 3000 });
      }
    });
  }
  openPlanSummary() {
    this.isPlanDetailsVisible = !this.isPlanDetailsVisible;
    this.isBBPlanDetailsVisible = !this.isBBPlanDetailsVisible;
  }
  shareKycURL(control: any) {
    const kycRequestBody = {
      policyNumber: "",
      proposerNumber: this.formData.proposalNumber,
      fullName: this.formData.accountHolderName,
      panNumber: this.formData.panNo || "",
      dob: this.formatDate(this.formData.memberDobProposer) || "",
      pepCheck: "No",
      businessType: "NB",
      emailId: this.formData.emailId,
      agentCode: this.agentCode,
      MobileNumber: "9642697588",
      ProductName: this.formData.productName,
      ProductCode: this.formData.productId
    };
    this.renewalService.sharekyclinkApi(kycRequestBody).subscribe(
      (res: any) => {
        if (res.data.isShareKyc) {
          this.toast.success({
            detail: "Success",
            summary: res.message,
            duration: 3000,
          });
        }
        this.changeMainFormDependentControls(control.dependentControls, true);
        this.dynamicFormGroup.get(control.dependentControls[0])?.setValue(res.data.kycLink);
      },
      (err) => {
        console.log(err);
      }
    );
  }
  skipKycURL(control: any) {
    const skipKycRequestBody = {
      proposalOrPolicyNumber: this.proposalNum,
      businessType: "NB"
    };
    this.renewalService.skipKycLinkApi(skipKycRequestBody).subscribe(
      async (res: any) => {
        if (res.data.kycStatus) {
          this.toast.success({
            detail: "Success",
            summary: res.message,
            duration: 3000,
          });
          this.verifyKYCStatus = res.data.kycStatus;
          this.checkKycDetail(control);
          let reqData = {
            "proposalNum": this?.formData?.proposalNumber,
            "partnerId": this.partnerId,
            "agentCode": this.agentCode,
            "formData": JSON.stringify(this.dynamicFormGroup.getRawValue()),
            "formName": this.formSequence[this.getFormIndexValue()].formName,
            "formConfig": JSON.stringify(this.formSequence),
            "productId": this.productId.toString(),
            "formId": this.formSequence[this.getFormIndexValue()].formId,
            "jsonForm": JSON.stringify(this.form),
            "formSequence": this.getFormIndexValue(),
            "leadNumber": this.leadnumber,
            "quoteNumber": this.formData.quoteId ? this.formData.quoteId : ""
          };
          console.log(reqData);
          await this.yatraService.Insertorupdateformdata(reqData).subscribe({
            next: (res: any) => {
              this.leadnumber = res.data;
              console.log(res);
            },
            error: (err) => {
              console.error(err);
            }
          });
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }
  initiateKycURL() {
    const kycRequestBody = {
      policyNumber: "",
      proposerNumber: this.formData.proposalNumber,
      fullName: this.formData.accountHolderName,
      panNumber: this.formData.panNo || "",
      dob: this.formatDate(this.formData.memberDobProposer) || "",
      pepCheck: "No",
      businessType: "NB",
      userType: "Agent"
    };
    this.renewalService.getkycURL(kycRequestBody).subscribe(
      (res: any) => {
        window.location.href = res.data.kycUrl;
      },
      (err) => {
        console.log(err);
      }
    );
  }
  checkKycDetail(control: any): void {
    // const isVisible = !(this.formData.verifyKYC !== "" || this.formData.kycStatus !== "" || this.formData.isKYCComplete);
    const isVisible = !this.verifyKYCStatus;
    this.form.formSections.forEach((section) => {
      section.formControls.forEach((formControl: IFormControl) => {
        if (formControl.name === control.name) {
          section.visible = isVisible;
          this.form.formSections[1].visible = !isVisible;
        }
      });
    });
  }

  formatDate(dateString: string | Date): string {
    // if (!dateString) return "";

    // const date = new Date(dateString);
    // if (isNaN(date.getTime())) return ""; // Return empty string if invalid date

    // const day= String(date.getMonth() + 1).padStart(2, '0'); 
    // const month = String(date.getDate()).padStart(2, '0');
    // const year = date.getFullYear();

    const dateObject = new Date(dateString);

    const formattedDate = [
      String(dateObject.getDate()).padStart(2, '0'), // Day
      String(dateObject.getMonth() + 1).padStart(2, '0'), // Month (0-indexed)
      dateObject.getFullYear() // Year
    ].join('-');

    return formattedDate;
  }

  redirectToJustPay(control: any) {
    // Handle the Juspay redirection for buttons other than Offline
    if (this.selectedButton !== 'offline') {
      const reqData = {
        agentcode: this.agentCode,
        proposalNumber: this.formData.proposalNumber,
        paymentMethod: this.selectedButton === 'enach' ? 'emandate_payment' : this.selectedButton,
        source: 'Retail',
        policyType: 'NB',
        policyNumber: '',
        quoteNumber: this.formData.quoteId || "",
        productName: this.formData.productName,
        userType: 'Agent'
      };
      this.yatraService.justPayRedirection(reqData).subscribe({
        next: (response: any) => {
          if (response.data.paymentURL && response.data.paymentURL !== null && response.data.paymentURL !== '') {
            if (this.selectedButton == 'sendLinkButton') {
              this.dynamicFormGroup.get(control.dependentControls[0])?.setValue(response.data.paymentURL);
              // res = response.data.paymentURL;
            }
            else {
              window.location.href = response.data.paymentURL; // Redirect to Juspay Payment URL
            }
          } else {
            this.toast.warning({ detail: "Warning", summary: response.message, duration: 3000 });
            console.error('Invalid payment link received:', response);
          }
        },
        error: (error) => {
          this.toast.error({ detail: "Error", summary: "Failed to generate payment link", duration: 3000 });
          console.error('Error generating payment link:', error);
        }
      });

      // this.router.navigate(['/renewal/paymentstatus'],{
      //   queryParams: {
      //     orderid: 'UP_241209_ef1cf656',
      //     token: 'aa59deee594c4c90abd5737929d0302e'
      //     // ,
      //     // agentCode: '500013'
      //   }
      // });

    }
  }

  getKycStatus() {
    const kycDetailsReq = {
      "transactionId": this.transactionId,
      "businessType": "NB",
      "userType": "Agent"
    }
    this.renewalService.getKycDetailsApi(kycDetailsReq).subscribe(
      async (res: any) => {
        if (res.data.kycStatus) {
          const kycData = res.data;
          // const renewalInfoRequestBody = {
          //   proposalNum: res.data.proposalNumber,
          // };
          // this.renewalService.getRenewalInfoApi(renewalInfoRequestBody).subscribe(
          //   (res: any) => {
          this.agentCode = localStorage.getItem('agentCode');
          this.partnerId = kycData.partnerId;
          this.productId = kycData.productId;
          if (kycData.leadId) {
            this.quickQuoteRedirect = true;
          }
          this.leadNumber = kycData.leadId;
          this.proposalNum = kycData.proposalNumber;

          const reqData = {
            "partnerId": kycData.partnerId,
            "productId": kycData.productId
          }
          const sequence = await firstValueFrom(this.commonService.Getformsequence(reqData));
          this.formSequence = JSON.parse(sequence.data.formSequence);
          const formId = this.getFormIndexValue()
          if (kycData.kycStatus == 'True') {
            if (kycData.kycStatus == 'True') kycData.ckycFlag = 'Y';
            this.formData.verifyKYC = kycData.kycStatus;
            this.verifyKYCStatus = kycData.kycStatus;
            // if (formId) {
            //   this.getFormDataFromFormSequence(formId);
            // }
          } else if (kycData.kycStatus == 'False') {
            if (formId) {
              this.formData.verifyKYC = null;
            }
          }
          // this.getFormDataFromFormSequence(formId);
          const Data = {
            partnerId: this.partnerId.toString(),
            productId: this.productId.toString(),
            formId: this.formSequence.length == 0 ? "0" : this.formSequence[this.getFormIndexValue()].formId.toString(),
            proposalNum: this.proposalNum,
            agentCode: this.agentCode,
            leadId: this.quickQuoteRedirect == false ? '' : this.leadNumber,
            isLead: this.quickQuoteRedirect == false ? false : true,
            currentFormSequence: this.getFormIndexValue().toString()
          }

          await this.yatraService.Getform(Data).subscribe({
            next: (res: any) => {
              this.formSequence = JSON.parse(res.data.formConfig) || [];
              this.form = JSON.parse(res.data.jsonFormData);
              const kk = this.formData.verifyKYC
              this.formData = JSON.parse(res.data.formData)
              this.formData.verifyKYC = kk;
              this.verifyKYCStatus = kk;
              this.initializeForm();
            },
            error: (err) => {
              console.log(err);
            }
          });
          // },
          // (err) => {
          //   console.error("Error from getRenewalInfo API:", err);
          //   this.toast.error({ detail: "Error", summary: "Error while getting renewal Information.", duration: 3000 });
          // }
          // );      
        } else {
          this.toast.error({ detail: "Error", summary: res.message || "Failed to do Payment", duration: 3000 });
        }
      },
      (err) => {
        this.toast.error({ detail: "Error", summary: 'Failed to do kyc.', duration: 3000 });
      }
    );
  }

  getPaymentStatus() {
    const orderDetailsReq = {
      "orderId": this.orderId,
      "businessType": "NB"
    }
    this.renewalService.getPaymentDetails(orderDetailsReq).subscribe(
      (res: any) => {
        if (res.isSuccess) {
          const orderData = res.data.orderDetails;
          if (res?.data?.paymentMethod == 'emandate_payment') {

            const reqData = {
              agentcode: localStorage.getItem('agentCode'),
              proposalNumber: '',
              paymentMethod: 'enach_payment',
              source: 'Retail',
              policyType: 'New Business',
              policyNumber: orderData?.policyNumber,
              quoteNumber: '',
              productName: '',
              userType: "Agent"
            };
            this.yatraService.justPayRedirection(reqData).subscribe(
              (response: any) => {
                if (response?.isSuccess) {
                  window.location.href = response.data.paymentURL;
                }
              }, (error) => {
                console.log('error', error);
              });
          }

          if (res.data.paymentStatus == 'SUCCESS' || res.data.paymentStatus == 'INITIATED') {
            this.incrementIndex();
            this.getFormDataFromFormSequence(this.formSequence[this.getFormIndexValue()].formId)
          } else if (res.data.paymentStatus == 'INPROGRESS' || res.data.paymentStatus == 'PENDING') {
            this.router.navigate(['proposals/proposalsList']);
          } else {
            this.getFormDataFromFormSequence(this.formSequence[this.getFormIndexValue()].formId)
            // this.router.navigate(['renewal/renewalJourney'], {
            //   state: {
            //     formData: this.encryptionService.encrypt(orderData.orderDetails),
            //     proposalNum: this.encryptionService.encrypt(""),
            //     policyNumber: this.encryptionService.encrypt(orderData.policyNumber),
            //     journeyProcess: this.encryptionService.encrypt(0),
            //     formSequence: this.encryptionService.encrypt([payment, thankYou]),
            //     formIndex: "0",
            //   }
            // });
          }
        } else {
          this.toast.error({ detail: 'Error', summary: res.message || "Failed to do Payment", duration: 3000 });
        }
      },
      (err) => {
        this.toast.error({ detail: '', summary: 'Failed to do online payment.', duration: 3000 });
      }
    );
  }

  getPermanentAddressDetails(flag: boolean) {
    const controlsToDisable = [
      'proposerAddress1',
      'proposerAddress2',
      'proposerAddress3',
      'correspondentPincode'
    ];
    if (flag) {
      this.dynamicFormGroup?.controls['proposerAddress1'].setValue(this.dynamicFormGroup?.controls['permanentAddress1'].value)
      this.dynamicFormGroup?.controls['proposerAddress2'].setValue(this.dynamicFormGroup?.controls['permanentAddress2'].value)
      this.dynamicFormGroup?.controls['proposerAddress3'].setValue(this.dynamicFormGroup?.controls['permanentAddress3'].value)
      this.dynamicFormGroup?.controls['correspondentPincode'].setValue(this.dynamicFormGroup?.controls['proposerPincode'].value)
      this.dynamicFormGroup?.controls['correspondingCity'].setValue(this.dynamicFormGroup?.controls['city'].value);
      this.dynamicFormGroup?.controls['correspondingState'].setValue(this.dynamicFormGroup?.controls['state'].value);

      controlsToDisable.forEach(controlName => {
        this.dynamicFormGroup?.controls[controlName]?.disable();
      });

    } else {
      this.dynamicFormGroup?.controls['proposerAddress1'].setValue('')
      this.dynamicFormGroup?.controls['proposerAddress2'].setValue('')
      this.dynamicFormGroup?.controls['proposerAddress3'].setValue('')
      this.dynamicFormGroup?.controls['correspondentPincode'].setValue('')
      this.dynamicFormGroup?.controls['correspondingCity'].setValue('')
      this.dynamicFormGroup?.controls['correspondingState'].setValue('')
      controlsToDisable.forEach(controlName => {
        this.dynamicFormGroup?.controls[controlName]?.enable();
      });
    }

  }

  getCityStateByPin() {
    const reqData = {
      "pincode": this.formData.proposerPincode && this.formData.proposerPincode.toString()
    }
    this.formData.proposerPincode && this.commonService.getCommonPinCodeByCity(reqData).subscribe(res => {
      if (res.isSuccess && res.data) {
        // Update city and state fields
        this.dynamicFormGroup.get('city')?.setValue(res.data.city || '');
        this.dynamicFormGroup.get('state')?.setValue(res.data.state || '');

      }
    });
  }

  getCityStateByPinByCorressponding() {
    const reqData = {
      "pincode": this.dynamicFormGroup.get('correspondentPincode')?.value.toString()
    }
    this.commonService.getPinCodeByCity(reqData).subscribe(res => {
      if (res.isSuccess && res.data) {
        // Update city and state fields
        this.dynamicFormGroup.get('correspondingCity')?.setValue(res.data.city || '');
        this.dynamicFormGroup.get('correspondingState')?.setValue(res.data.state || '');

      }
    });
  }

  halfQuotation() {
    const reqData = {
      "proposalNum": this.proposalNum,
      "agentCode": this.agentCode
    }
    this.yatraService.getHalfQuote(reqData).subscribe({
      next: (response: any) => {
        if (response.isSuccess && response.data) {
          this.toast.success({ detail: "Success", summary: 'Half Quote generated successfully with application number' + response.data.applicationNumber, duration: 3000 });
        }
        else {
          this.toast.error({ detail: "Error", summary: response.message, duration: 3000 })
          // this.form.formSections.forEach((section: any) => {
          //   section.formControls.forEach((control: any) => {
          //     if (control.name === 'next') {
          //       control.disabled = true;
          //     }
          //   })
          // });
        }
        this.onSubmit();
      },
      error: (err) => {
        this.toast.error({ detail: "Error", summary: 'Failed to generate half Quote', duration: 3000 });
      }
    });
  }

  onClickDownloadFromConfirmation() {
    this.onSearchDocumentFromConfirmation();
    if (this.retrievedDocuments) {
      const downloadPolicyKitRequestBody = {
        agentCode: this.agentCode,
        referenceId: this.agentCode,
        eventName: "Download policy kit request from customers",
        proposalNumber: this.dynamicFormGroup.get('policyNumber')?.value,
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
            this.toast.error({ detail: "Warning", summary: response.message || "No file found to download.", duration: 3000 });
          }
        },
        (error: any) => {
          console.error("Download Policy Kit Error:", error);
          this.toast.error({ detail: "Error", summary: "Error while downloading Policy Kit.", duration: 3000 });
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
              value: this.dynamicFormGroup.get('policyNumber')?.value
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
            this.toast.success({ detail: "Success", summary: "No documents are available to download.", duration: 2000 });
            return;
          }
        } else {
          this.toast.error({ detail: "Error", summary: response.message || "Failed to search document.", duration: 2000 });
        }
      },
      (error: any) => {
        console.error("Search document error", error);
        this.toast.error({ detail: "Error", summary: "Error while searching the document.", duration: 2000 });
      }
    );
  }

  setDeductibleAmount(control: any, parentControl: any = null, index: any = null) {
    if (this.dynamicFormGroup.get('memberPolicyType')?.value == 'Family Floater') {
      const sumInsuredControl = this.dynamicFormGroup.get('sumInsured');
      this.form.formSections.forEach((section: any) => {
        section.formControls.forEach((control: any) => {
          if (control.name == 'deductibleAmount') {
            if (control.onChangeMethod == 'deductibleOptionsB') {
              const deductibleValue = this.deductibleOptionsB(null, null, sumInsuredControl?.value);
              this.dynamicFormGroup.get('deductibleAmount')?.setValue(deductibleValue);
            }
            else {
              const deductibleValue = this.deductibleOptionsA(null, null, sumInsuredControl?.value);
              this.dynamicFormGroup.get('deductibleAmount')?.setValue(deductibleValue);
            }
          }
        })

      })

    }
    else if (this.dynamicFormGroup.get('memberPolicyType')?.value == 'Multi Individual') {
      const insuredMemberDetailsControl = this.dynamicFormGroup.get(parentControl.name) as FormArray;
      const sumInsuredControl = insuredMemberDetailsControl.controls[index].get(control.name);
      this.form.formSections.forEach((section: any) => {
        if (section.sectionTitle == 'Insured Member Details') {
          section.formControls.forEach((control: any) => {
            if (control.visible == true) {
              control.dynamicControls[0].forEach((dynamicControl: any) => {
                if (dynamicControl.name == 'deductibleAmount') {
                  if (dynamicControl.onChangeMethod == 'deductibleOptionsB') {
                    const deductibleValue = this.deductibleOptionsB(null, null, sumInsuredControl?.value);
                    insuredMemberDetailsControl.controls[index].get('deductibleAmount')?.setValue(deductibleValue);
                  }
                  else {
                    const deductibleValue = this.deductibleOptionsA(null, null, sumInsuredControl?.value);
                    insuredMemberDetailsControl.controls[index].get('deductibleAmount')?.setValue(deductibleValue);
                  }
                }
              })
            }
          })
        }
      })

    }
  }

  restrictNumberLength(event: Event, maxLength: number): void {
    const inputElement = event.target as HTMLInputElement;

    // Convert input value to a string and truncate if it exceeds maxLength
    if (inputElement.value.length > maxLength) {
      inputElement.value = inputElement.value.slice(0, maxLength);
    }

    // Update the form control's value to match the truncated value
    const formControl = this.dynamicFormGroup.get(inputElement.name);
    if (formControl) {
      formControl.setValue(inputElement.value);
    }
  }

  calculateEmployeeDiscount(control: any) {
    const employeeIdValue = this.dynamicFormGroup.get('employeeId')?.value || null;

    this.formData = {
      ...this.formData,
      employeeId: employeeIdValue,
      affiliateEmployeeId: null,
    };

    this.getPremiumAmount();
    control.disabled = true;
  }

  updateSalutationsBasedOnGender(control: any, index: any): void {
    const memberGender = this.formData.insuredMemberDetails[index - 1].memberGender;
    const disabledSalutations = this.salutationMapping[memberGender] || [];

    control.options = control.options.map((option: any) => ({
      ...option,
      disabled: disabledSalutations.includes(option.name)
    }));
  }

  updateDesignationBasedOnAnnualincome(control:any,selectedControl:any,parentControl?:any){
    console.log("control name",control.name);
    let selectedRelation:string ='';
    if(control.name=='productMemberDesignation'){
      selectedRelation = parentControl.dynamicControls[selectedControl][1].value // 1 is the index of relation object
    }
    else{
      selectedRelation = selectedControl.name
    }
    this.formData.insuredMemberDetails.forEach((member: any) => {
      if (selectedRelation == member.relation) {
        if (member.annualIncome != "") {          
          control.options = [{
            "id": "1",
            "value": "O464",
            "name": "Retired"
          },
          {
            "id": "3",
            "value": "O553",
            "name": "Salaried"
          },
          {
            "id": "6",
            "value": "O556",
            "name": "Self Employed"
          }]
        }
        else {
          control.options = [{
            "id": "1",
            "value": "O464",
            "name": "Retired"
          },
          {
            "id": "2",
            "value": "O490",
            "name": "Student"
          },
          {
            "id": "6",
            "value": "O554",
            "name": "Not Employed"
          },
          {
            "id": "3",
            "value": "O555",
            "name": "HouseWife/Husband"
          }]
        }
    }
    });
  }
  updatePrefixBasedOnGender(control: any): void {
    if (this.formData?.proposerGender) {
      const proposerGender = this.formData.proposerGender;
      console.log(proposerGender)
      const disabledSalutations = this.salutationMapping[proposerGender] || [];

      control.options = control.options.map((option: any) => ({
        ...option,
        disabled: disabledSalutations.includes(option.name),
      }));

      console.log(control.options)

      // Optionally set a default value
      const defaultOption = control.options.find(
        (option: any) => !option.disabled
      );
      control.value = defaultOption ? defaultOption.value : '';
    }
  }


  restrictKeyPress(event: KeyboardEvent): void {
    const charCode = event.key.charCodeAt(0);
    // Allow only numeric digits (0-9)
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  onClearFileSelected(event: any) {
    if (event && event.fileInput) {
      event.fileInput.value = '';
    }
  }

  insertDocByIdwithProof(arr: any) {
    const reqData = {
      "proposalNum": this.proposalNum,
      "documentData": arr.reduce((acc: any, item: any) => {
        acc[item.name.replace('Document', "")] = item.data;
        return acc;
      }, {})
    }
    this.yatraService.insertproposerDocumentById(reqData).subscribe({
      next: (response: any) => {
        if (response.isSuccess && response.data) {
          this.toast.success({ detail: "Success", summary: response.message + response.data.applicationNumber, duration: 3000 });
        }
        else {
          this.toast.error({ detail: "Error", summary: response.message, duration: 3000 })
        }
      },
      error: (err) => {
        this.toast.error({ detail: "Error", summary: 'Failed to insert Document', duration: 3000 });
      }
    });
  }

  convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        // The result will be the base64 encoded file
        resolve(reader.result as string); // Resolve the promise with the base64 string
      };

      reader.onerror = (error) => {
        reject(error); // Reject the promise in case of error
      };

      // Read the file as a data URL (base64)
      reader.readAsDataURL(file);
    });
  }

  async onUploadFile(event: any, control: any) {
    if (event[0]) {
      // Clear previous errors
      // this.dynamicFormGroup?.controls[control.name].setErrors(null);
      // If no errors, proceed to set the selected file
      if (this.dynamicFormGroup?.get(control.name)) {
        this.selectedFile = event[0];
        this.dynamicFormGroup?.get(control.name)?.setValue(event[0].name);
      } else {
        this.dynamicFormGroup?.get(control.name)?.markAsTouched();
        this.selectedFile = null;
      }
    }

    const formData = new FormData();
    const base64File = await this.convertFileToBase64(event[0]);
    const policyNum = this.proposalNum.replace(/-/g, "");
    formData.append("Files", event[0]);
    formData.append("UniqueNumber", policyNum);

    let obj: any
    switch (control.name) {
      case 'neftStatementUpload':
        obj = {
          "name": this.dynamicFormGroup?.controls['accountHolderName'].value,
          "byteArray": base64File.split(',')[1]

        }
        this.yatraService.pennyDropVerficationByOCR(obj).subscribe(
          async (response: any) => {
            if (response.isSuccess) {
              this.pennyDropVerficationByOCRDetails = response.data;
              this.dynamicFormGroup.get('accountHolderName')?.setValue(response.data.bankAccountVerification.accountName);
              this.dynamicFormGroup.get('accountNumber')?.setValue(response.data.bankAccountVerification.accountNumber);
              this.dynamicFormGroup.get('confAccountNumber')?.setValue(response.data.bankAccountVerification.accountNumber);
              this.dynamicFormGroup.get('ifscCode')?.setValue(response.data.bankAccountVerification.ifsc);
              this.toast.success({ detail: "Success", summary: response.message, duration: 3000 });
            } else {
              this.toast.error({
                detail: "Error",
                summary: response.message,
                duration: 3000,
              });
            }
          },
          (err) => {
            console.error("Error during upload:", err);
            this.toast.error({
              detail: "Error",
              summary: err.message || "Document upload failed.",
              duration: 1500,
            });
          }
        );
        break;

      case 'documentProofUpload':
        this.commonService.uploadDocument(formData).subscribe(
          async (res: any) => {
            if (res.isSuccess) {
              this.fullQuoteDocRelated = res.data.uploadResponse[0].globalId
              // this.documentId = res.data.uploadResponse[0].globalId;
              // this.uploadInfo.push({
              //   name : control,
              //   data : res.data.uploadResponse[0]
              // })
              // try {
              //   // Await the getFullQuoteViaOfflinePayment call to ensure completion before resolving
              //   await this.getFullQuoteViaOfflinePayment(res.data.uploadResponse[0].globalId);
              // } catch (error) {
              //   console.error("Error in full quote generation:", error);
              // }

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
            this.toast.error({
              detail: "Error",
              summary: err.message || "Document upload failed.",
              duration: 1500,
            });
          }
        );
        break;

      default:
        this.commonService.uploadDocument(formData).subscribe(
          async (res: any) => {
            if (res.isSuccess) {
              // this.documentId = res.data.uploadResponse[0].globalId;
              let arr = [];
              arr.push({
                "name": control?.name,
                "data": res.data.uploadResponse[0].globalId
              });

              this.insertDocByIdwithProof(arr)

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
            this.toast.error({
              detail: "Error",
              summary: err.message || "Document upload failed.",
              duration: 1500,
            });
          }
        );
        break;
    }
  }
  async modifyThankYouJson() {
    if (this.formData.paymentMode === 'offline') {
      console.log(this.formData);
    }
    else {
      const reqData = {
        proposalNumber: this.proposalNum
      };

      // Convert Observable to Promise
      await this.yatraService.getpaymentdetailsbyproposalno(reqData).toPromise()
        .then((res: any) => {
          if ((res.data.paymentStatus === 'SUCCESS' || res.data.paymentStatus === 'INITIATED') && res.data.isFullQuoteSuccess) {
            this.formData.policyNumber = res.data.fullQuoteResponse.policyNumber || null;
            this.formData.policyStatus = res.data.fullQuoteResponse.policyStatus || null;
            this.formData.quoteValidFromDate = res.data.fullQuoteResponse.policyStartDate || null;
            this.formData.quoteValidToDate = res.data.fullQuoteResponse.policyEndDate || null;
            this.formData.ReceiptNumber = res.data.fullQuoteResponse.receiptNumber || null;
            this.formData.customerId = res.data.fullQuoteResponse.customerId || null;
            this.formData.applicationNumber = res.data.fullQuoteResponse.applicationNumber || null;
          }
          if (res.data.errorMessage) {
            this.toast.error({ detail: "Error", summary: res.data.errorMessage, duration: 3000 });
          }
          const data = res.data;
          const status =
            (data.paymentStatus.toUpperCase() === 'SUCCESS' || data.paymentStatus.toUpperCase() === 'INITIATED') && data.isFullQuoteSuccess
              ? [true, false, false]
              : (data.paymentStatus.toUpperCase() === 'SUCCESS' || data.paymentStatus.toUpperCase() === 'INITIATED') && !data.isFullQuoteSuccess
                ? [false, false, true]
                : data.paymentStatus.toUpperCase() === 'PENDING'
                  ? [false, true, false]
                  : [false, false, false]; // Default case

          this.form.formSections.forEach((formSection: any, i: any) => {
            formSection.formControls.forEach((formControl: any) => {
              if (formControl.idProperty === true || formControl.idProperty === false) {
                if (formControl.name === 'labelA') {
                  formControl.visible = status[0];
                } else if (formControl.name === 'labelB') {
                  formControl.visible = status[1];
                  this.form.formSections[i + 1].visible = status[0];
                  this.form.formSections[i + 2].visible = status[0];
                  this.form.formSections[i + 3].visible = status[0];
                  this.form.formSections[i + 4].visible = status[0];
                } else if (formControl.name === 'labelC') {
                  formControl.visible = status[2];
                  if (res.data.errorMessage) {
                    formControl.label = res.data.errorMessage;
                  }
                  this.form.formSections[i + 1].visible = status[0];
                  this.form.formSections[i + 2].visible = status[0];
                  this.form.formSections[i + 3].visible = status[0];
                  this.form.formSections[i + 4].visible = status[0];
                }
              }
            });
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  setPreviousPolicyYears(control: any, index: any, policyLength: any = 0) {

    console.log(index, policyLength);
    if (control.options.length == 0) {
      const currentYear = new Date().getFullYear();
      let yearOptions = [];
      if (policyLength == 0) {
        yearOptions = [
          {
            value: `${currentYear - 1}-${currentYear}`,
            name: `${currentYear - 1}-${currentYear}`
          }
        ];
      }
      else {
        const startYear = currentYear - 4; // The starting year for your ranges
        yearOptions = [];

        // Generate the year ranges
        for (let year = startYear; year < currentYear - 1; year++) {
          yearOptions.push({
            value: `${year}-${year + 1}`,
            name: `${year}-${year + 1}`
          });
        }
      }

      control.options = yearOptions;
    }
  }

  checkForPortability(control: any) {
    let isPortability = false;
    if (this.formData['typeOfBusiness'] == 'NB' || this.formData['typeOfBusiness'] == 'New Business') {
      isPortability = false;
    }
    else {
      isPortability = true;
    }

    this.form.formSections.forEach((section: any) => {
      if (section.sectionTitle == 'Previous Policy Documents') {
        section.visible = isPortability;
      }
      else {
        section.formControls.forEach((formControl: any, index: any) => {
          if (formControl.name == 'insuredMemberDetails') {
            if (this.formData[formControl.name]) {
              if (this.formData[formControl.name]) {
                formControl.value = this.formData[formControl.name].length;
              }
              formControl.dynamicControls[0].forEach((dynamicControl: any) => {
                if (dynamicControl.innerArrayControl) {
                  dynamicControl.visible = isPortability;
                  if (isPortability) {
                    let tempControl = dynamicControl.innerArrayControl[0].map((element: any) => ({ ...element }));
                    dynamicControl.innerArrayControl.push(tempControl);
                  }

                }
              })
              formControl.dynamicControls = formControl.dynamicControls.slice(0, 1)
              this.formData[formControl.name].forEach((member: any, index: number) => {
                let tempDynamicControl = JSON.parse(JSON.stringify(formControl.dynamicControls[0]));
                formControl.dynamicControls.push(tempDynamicControl)
                formControl.dynamicControls[index + 1].forEach((innerControl: any) => {
                  if (innerControl.name == 'relation') {
                    innerControl.value = member.relation
                  }
                  if (innerControl.name == 'covers') {
                    innerControl.value = this.covers[index];
                  }
                  if (innerControl.name == 'zoneValue') {
                    innerControl.options = member.upgradableZones;
                  }

                  if (innerControl.name == 'previousPolicyDetails' && member.previousPolicyDetails?.length > 0) {
                    innerControl.innerArrayControl = innerControl.innerArrayControl.slice(0, 1); // Keep only the first template
                    console.log(innerControl.innerArrayControl);

                    for (let i = 0; i < member.previousPolicyDetails.length; i++) {
                      // Create a fresh template copy for each iteration
                      let freshTemplate = innerControl.innerArrayControl[0].map((element: any) => ({ ...element }));

                      if (i === 0) {
                        // For the first index, push the full template
                        innerControl.innerArrayControl.push(freshTemplate);
                      } else {
                        // Create a customized version for subsequent indices
                        let customizedInnerArrayControl = freshTemplate.slice(3).map((element: any) => ({ ...element }));
                        customizedInnerArrayControl.forEach((controlElement: any) => {
                          if (controlElement.name == 'policyIndex') {
                            controlElement.label = 'Policy ' + (i + 1);
                          }
                          if (controlElement.name == 'previousSelectYear') {
                            controlElement.options = [];
                            const currentYear = new Date().getFullYear();
                            const startYear = currentYear - 4; // The starting year for your ranges
                            const yearOptions = [];

                            // Generate the year ranges
                            for (let year = startYear; year < currentYear; year++) {
                              yearOptions.push({
                                value: `${year}-${year + 1}`,
                                name: `${year}-${year + 1}`
                              });
                            }
                            controlElement.options = yearOptions;
                          }
                        });
                        console.log(customizedInnerArrayControl);

                        innerControl.innerArrayControl.push(customizedInnerArrayControl);
                      }
                    }
                  }

                  if (innerControl.name == 'previousCurrentPolicyDetails') {
                    if (member.previousCurrentPolicyDetails && member.previousCurrentPolicyDetails.length > 0) {

                      innerControl.visible = true;
                      member.previousCurrentPolicyDetails.forEach((previousPolicyDetails: any) => {
                        const tempInnerArrayControl = JSON.parse(JSON.stringify(innerControl.innerArrayControl[0]));
                        Object.keys(previousPolicyDetails).forEach((key) => {
                          if (
                            (key == 'additionalInfoClaim' || key == 'diseaseName' || key == 'dateOfDiagnosis' ||
                              key == 'lastConsultationDate' || key == 'nameOfSurgery' || key == 'treatmentDetails' ||
                              key == 'disability' || key == 'periodOfHospitalisation' || key == 'anyOtherInformation')
                            && previousPolicyDetails[key] !== ''
                          ) {
                            // Find and update the corresponding control to make it visible
                            const tempInnerControl = tempInnerArrayControl.find((ctrl: any) => ctrl.name === key);
                            if (tempInnerControl) {
                              tempInnerControl.visible = true;
                            }
                          }
                        });
                        innerControl.innerArrayControl.push(tempInnerArrayControl);
                      });
                    }

                  }

                  if (
                    this.formData['ckycNo'] &&
                    member.relation === 'Self' &&
                    ['firstName', 'middleName', 'lastName', 'memberdob', 'mobileNumber'].includes(innerControl.name)
                  ) {
                    innerControl.disabled = true; // Disable the control
                  }
                })
              })
            }
          }
          // if (formControl.name == 'recalculate' && isPortability) {
          //   formControl.visible = isPortability;
          // }
          // if (formControl.name == 'next' && isPortability) {
          //   formControl.visible = !isPortability;
          // }
        })
      }
    })
  }

  duplicateForAllMembers(innerControl: any, control: any, parentControl: any, index: number) {
    const formArray = this.dynamicFormGroup.get(parentControl.name) as FormArray;
    const currentGroup = formArray.controls[index] as FormGroup;

    // Get the value of the control in the current group
    const currentValues = currentGroup.get(control.name)?.value;

    // Traverse all other indices in the FormArray
    formArray.controls.forEach((group, idx) => {
      if (idx !== index) {
        const otherGroup = group as FormGroup;

        // Update each key in the other group
        Object.keys(currentValues).forEach(key => {
          if (otherGroup.get(control.name)?.get(key)) {
            otherGroup.get(control.name)?.get(key)?.setValue(currentValues[key]);
          }
        });
      }
    });
    // this.onClickReq(parentControl.value[index + 1]);
  }

  duplicatePortabilityPolicyForAllMembers(innerControl: any, control: any, parentControl: any, index: number, indexj: number) {
    const formArray = this.dynamicFormGroup.get(parentControl.name) as FormArray;
    const currentGroup = formArray.controls[index] as FormGroup;

    console.log(currentGroup);

    const innerFormArr = currentGroup.get(control.name) as FormArray;


    // Get the value of the control in the current group
    const currentValues = innerFormArr.controls[indexj]?.value;

    // // Traverse all other indices in the FormArray
    formArray.controls.forEach((group, idx) => {
      if (idx !== index) {
        const otherGroup = group as FormGroup;
        const otherInnerFormArr = otherGroup.get(control.name) as FormArray;
        // Update each key in the other group
        Object.keys(currentValues).forEach(key => {
          // if (otherGroup.get(control.name)?.get(key)) {
          //   otherGroup.get(control.name)?.get(key)?.setValue(currentValues[key]);
          // }

          if (otherInnerFormArr.controls[indexj]?.get(key)) {
            otherInnerFormArr.controls[indexj]?.get(key)?.setValue(currentValues[key]);
          }
        });
      }
    });


    // this.onClickReq(parentControl.value[index + 1]);
    // Show a toast message upon successful completion
    this.toast.success({
      detail: "Success",
      summary: "Details copied for all members.",
      duration: 3000
    });
  }

  onClickReq(obj: any, title?: any) {
    const obj1: any = {
      template: SharedModalComponent,
      data: {
        header: title == null || title == undefined ? 'Duplicate Policy Details' : title,
        description: obj.relation,
        no: 'Close',
        yes: 'Done',
        buttonClass: 'Active-btn',
      }
    }
    this.commonService.openDialog(obj1, (res: any) => {
      if (res) {

      }
    });
  }

  getKeys(obj: any): string[] {
    const formGroupValue = (this.dynamicFormGroup.get(obj) as FormGroup)?.value;
    return formGroupValue ? Object.keys(formGroupValue) : [];
  }
  isBooleanTrue(control: any, key: any): boolean {
    const formGroupValue = (this.dynamicFormGroup.get(control) as FormGroup)?.value;
    return typeof formGroupValue?.[key] === 'boolean' && formGroupValue[key] === true;
  }
  formatKey(key: string): string {
    return key.charAt(0).toUpperCase() + key.slice(1); // Capitalize the first letter
  }
  enableABHAConcent(): boolean {
    const insuredMemberDetailsArray = this.dynamicFormGroup?.get('insuredMemberDetails') as FormArray;
    const firstFormGroup = insuredMemberDetailsArray.controls[0] as FormGroup;
    const abhaNumberValid = firstFormGroup.get('abhaNumber')?.valid;
    const abhaMailIdValid = firstFormGroup.get('abhaMailId')?.valid;
    if (abhaNumberValid && abhaMailIdValid) {
      return true
    } else {
      return false
    }

  }
  onVerifyClick(control: any) {

    // let requestBody: any = {};
    // requestBody.emailId = this.formData.emailId;
    // requestBody.mobileNumber = this.formData.mobileNumber;
    // requestBody.name = this.formData.proposerName;
    // requestBody.agentCode = this.agentCode;
    // requestBody.proposalNumber = this.formData.proposalNumber;
    // requestBody.premiumAmount = this.formData.totalPremium;
    // requestBody.productName = this.formData.productName;

    // this.yatraService.sendEmailLink(requestBody).subscribe(
    //   (res: any) => {
    //     if (res.isSuccess) {
    //       this.requestId = res.data.requestId;
    //       this.toast.success({ detail: "Success", summary: "Communication send Successfully", duration: 3000 });
    //     }
    //   },
    //   (error) => {
    //     console.error(error);
    //   });
    let requestBody: any = {};
    requestBody.proposalNumber = this.formData.proposalNumber;

    this.yatraService.getVerifylink(requestBody).subscribe(
      async (res: any) => {
        console.log(res);
        if (res.isSuccess && res.data.isConfirm == 1) {
          // this.requestId = res.data.requestId;
          this.toast.success({ detail: "Success", summary: "Verification done Successfully", duration: 3000 });
          this.form.formSections.forEach((section: any) => {
            section.formControls.forEach((controls: any) => {
              if (controls.dependentControls) {
                controls.dependentControls.forEach((item: any) => {
                  const controlToHide = section.formControls.find((c: any) => c.name === item);
                  if (controlToHide) {
                    controlToHide.visible = false; // Hide all dependent controls initially
                  }
                });
              }
            });
          });

          // Show the dependent controls for the currently clicked button
          if (control.dependentControls) {
            this.form.formSections.forEach((section: any) => {
              section.formControls.forEach((controls: any) => {
                control.dependentControls.forEach((item: any) => {
                  if (controls.name === item) {
                    controls.disabled = false; // Show the dependent controls for this button
                  }
                });
              });
            });
          }
          let reqData = {
            "proposalNum": this?.formData?.proposalNumber,
            "partnerId": this.partnerId,
            "agentCode": this.agentCode,
            "formData": JSON.stringify(this.dynamicFormGroup.getRawValue()),
            "formName": this.formSequence[this.getFormIndexValue()].formName,
            "formConfig": JSON.stringify(this.formSequence),
            "productId": this.productId.toString(),
            "formId": this.formSequence[this.getFormIndexValue()].formId,
            "jsonForm": JSON.stringify(this.form),
            "formSequence": this.getFormIndexValue(),
            "leadNumber": this.leadnumber,
            "quoteNumber": this.formData.quoteId ? this.formData.quoteId : ""
          };
          console.log(reqData);
          await this.yatraService.Insertorupdateformdata(reqData).subscribe({
            next: (res: any) => {
              this.leadnumber = res.data;

              // Call getFormDataFromFormSequence only after insert/update is completed

              if (this.isQuote) {
                this.isQuote = false;
                sessionStorage.setItem("isQuote", this.isQuote.toString());
              }

              this.quickQuoteRedirect = false;
            },
            error: (err) => {
              console.error(err);
            }
          });
        }
        else {
          this.toast.error({ detail: "Error", summary: "Fail to Verify, Please try again", duration: 3000 });
        }
      },
      (error) => {
        console.error(error);
      });

    // this.form.formSections.forEach((section: any) => {
    //   section.formControls.forEach((controls: any) => {
    //     if (controls.dependentControls) {
    //       controls.dependentControls.forEach((item: any) => {
    //         const controlToHide = section.formControls.find((c: any) => c.name === item);
    //         if (controlToHide) {
    //           controlToHide.visible = false; // Hide all dependent controls initially
    //         }
    //       });
    //     }
    //   });
    // });

  }
  parseJson(value: string): any[] {
    try {
      return JSON.parse(value || "[]");
    } catch (e) {
      return [];
    }
  }

  checkPreviousPolicyDetails(parentControl: any) {
    // const formArray = this.dynamicFormGroup.get(parentControl.name) as FormArray;

    // // Flag to track validation
    // let allValid = true;

    console.log(this.dynamicFormGroup.value, this.dynamicFormGroup);

    if (this.dynamicFormGroup.valid) {
      this.changeRecalculate(false);
      this.getPremiumAmount();
    }
    else {
      this.toast.error({ detail: "Error", summary: "Please fill all the required details", duration: 3000 })
    }
    // // Iterate through each member
    // formArray.controls.forEach((group: AbstractControl, index: number) => {
    //   const previousPolicyDetails = group.get('previousPolicyDetails') as FormGroup;

    //   if (previousPolicyDetails) {
    //     // Check if all keys in previousPolicyDetails are valid
    //     Object.keys(previousPolicyDetails.controls).forEach(key => {
    //       const control = previousPolicyDetails.get(key);
    //       if (control && control.invalid) {
    //         allValid = false; // Mark as invalid if any field is invalid
    //       }
    //     });
    //   } else {
    //     allValid = false; // If previousPolicyDetails doesn't exist, mark as invalid
    //   }
    // });

    // // Toast the appropriate message
    // if (allValid) {
    //   this.toast.success({ detail: "Error", summary: "All details are filled correctly!", duration: 3000 });
    // } else {
    //   this.toast.error('Please fill all the required details.');
    // }



  }

  addMorePolicies(innerControl: any, control: any, parentControl: any, index: number) {
    console.log(innerControl, control, parentControl, index)
    console.log(this.dynamicFormGroup.get(parentControl.name) as FormArray)
    let tempControl = control.innerArrayControl[0].map((element: any) => ({ ...element }));
    control.innerArrayControl.push(tempControl);
    let formArr = (((this.dynamicFormGroup.get(parentControl.name) as FormArray)
      .controls[index] as FormGroup).controls[control.name] as FormArray);
    formArr.push(this.initializeDynamicFormControls(tempControl, control.innerArrayControl.length - 1, control));
    console.log(formArr, 'dfgd', this.dynamicFormGroup, 'form', this.form)
  }

  addMorePortabilityPolicies(innerControl: any, control: any, parentControl: any, index: number) {
    console.log(innerControl, control, parentControl, index, this.form);
    if (control.innerArrayControl.length < 5) {
      let tempControl = control.innerArrayControl[0].map((element: any) => ({ ...element }));
      console.log(tempControl);

      tempControl = tempControl.splice(3);

      // tempControl.forEach((innerControl:any)=>{
      //   if(innerControl.name == 'policyIndex'){
      //     innerControl.label = 'Policy'+
      //   }
      // })

      console.log(tempControl, this.form);
      let policyLength = 0;
      // tempControl

      this.form.formSections.forEach((section: any) => {
        section.formControls.forEach((formControl: any) => {
          if (formControl.name == parentControl.name) {
            let targetDynamicControls = JSON.parse(JSON.stringify(formControl.dynamicControls[index + 1]));
            targetDynamicControls.forEach((innerControl: any) => {
              if (innerControl.name == control.name) {
                // Deep clone before pushing
                tempControl.forEach((innerArrayControl: any) => {
                  if (innerArrayControl.name == 'policyIndex') {
                    innerArrayControl.label = 'Policy ' + innerControl.innerArrayControl.length;
                  }
                  // if (innerArrayControl.name == 'selectYear') {
                  //   innerArrayControl.options = [];
                  //   const currentYear = new Date().getFullYear();
                  //   const startYear = currentYear - 4; // The starting year for your ranges
                  //   const yearOptions = [];

                  //   // Generate the year ranges
                  //   for (let year = startYear; year < currentYear; year++) {
                  //     yearOptions.push({
                  //       value: `${year}-${year + 1}`,
                  //       name: `${year}-${year + 1}`
                  //     });
                  //   }
                  //   innerArrayControl.options = yearOptions;
                  // }
                })
                console.log(tempControl);

                innerControl.innerArrayControl.push([...tempControl]);
                policyLength = innerControl.innerArrayControl.length;
              }
            });


            formControl.dynamicControls[index + 1] = targetDynamicControls;
          }
        })
      })
      console.log(this.dynamicFormGroup);

      let formArr = this.dynamicFormGroup.get(parentControl.name) as FormArray;
      // let formArr;


      if (formArr != null) {
        formArr = this.dynamicFormGroup.get(parentControl.name) as FormArray;
        console.log(formArr);

        let innerFormArr = formArr.controls[index].get(control.name) as FormArray;
        console.log(control.innerArrayControl.length - 1, control);

        console.log(this.form);


        innerFormArr.push(this.initializeDynamicFormControls(tempControl, control.innerArrayControl.length - 1, control, policyLength));
      }

      console.log(this.form, this.dynamicFormGroup);
    }
    else {
      this.toast.warning({ detail: "Warning", summary: 'You can add a maximum of 4 policies.', duration: 3000 });
    }




  }

  addMoreClaimPolicies(innerControl: any, control: any, parentControl: any, index: number) {

    // console.log(innerControl, control);
    // let tempArrayControl = control.innerArrayControl[0].map((element: any) => ({ ...element }));
    // control.innerArrayControl.push(tempArrayControl);

    // let formArr = this.dynamicFormGroup.get(control.name) as FormArray;
    // // let formArr;
    // console.log(formArr);

    // if (formArr == null) {
    //   let tempFormArray = this.fb.array([]);
    //   this.dynamicFormGroup.addControl(control.name, tempFormArray);
    //   formArr = this.dynamicFormGroup.get(control.name) as FormArray;
    // }
    // formArr.push(this.initializeDynamicFormControls(tempArrayControl, control.innerArrayControl.length - 1, control));

    let tempControl = JSON.parse(JSON.stringify(control.innerArrayControl[0]));
    console.log(tempControl);

    this.form.formSections.forEach((section: any) => {
      section.formControls.forEach((formControl: any) => {
        if (formControl.name == parentControl.name) {
          let targetDynamicControls = JSON.parse(JSON.stringify(formControl.dynamicControls[index + 1]));
          targetDynamicControls.forEach((innerControl: any) => {
            if (innerControl.name == control.name) {
              console.log(tempControl);

              innerControl.innerArrayControl.push([...tempControl]);
            }
          });


          formControl.dynamicControls[index + 1] = targetDynamicControls;
        }
      })
    })
    console.log(this.dynamicFormGroup);

    let formArr = this.dynamicFormGroup.get(parentControl.name) as FormArray;
    // let formArr;


    if (formArr != null) {
      formArr = this.dynamicFormGroup.get(parentControl.name) as FormArray;
      console.log(formArr);

      let innerFormArr = formArr.controls[index].get(control.name) as FormArray;
      console.log(control.innerArrayControl.length - 1, control);

      console.log(this.form);


      innerFormArr.push(this.initializeDynamicFormControls(tempControl, control.innerArrayControl.length - 1, control));
    }

  }

  removePolicy(control: any, index: number): void {
    if (control.innerArrayControl && control.innerArrayControl.length > index) {
      control.innerArrayControl.splice(index, 1);  // Removes the element at the specified index
    }
  }

  removePortabilityPolicy(subControl: any, parentControl: any, index: number, z: number): void {
    console.log('Removing portability policy:', subControl, parentControl, index, z, this.form);

    // Update `innerArrayControl` in the UI structure (this.form)
    this.form.formSections.forEach((section: any) => {
      section.formControls.forEach((formControl: any) => {
        if (formControl.name === parentControl.name) {
          formControl.dynamicControls[index + 1].forEach((dynamicControl: any) => {
            if (dynamicControl.name === subControl.name) {
              // Remove the `z`-th element from `innerArrayControl`
              dynamicControl.innerArrayControl.splice(z + 1, 1);

              console.log(dynamicControl.innerArrayControl);

              dynamicControl.innerArrayControl.forEach((policy: any, idx: number) => {
                policy.forEach((control: any) => {
                  if (control.name === 'policyIndex' && idx > z) {
                    control.label = `Policy ${idx}`;
                  }
                });
              });
            }
          });
        }
      });
    });

    // Update the reactive form (this.dynamicFormGroup)
    const formArr = this.dynamicFormGroup.get(parentControl.name) as FormArray;
    if (formArr) {
      const innerFormArr = formArr.controls[index].get(subControl.name) as FormArray;
      if (innerFormArr) {
        innerFormArr.removeAt(z); // Remove the `z`-th FormGroup from FormArray
      }
    }

    console.log('Updated form structure:', this.form);
    console.log('Updated reactive form:', this.dynamicFormGroup);
  }

  removeClaimPolicy(subControl: any, parentControl: any, index: number, z: number) {
    this.form.formSections.forEach((section: any) => {
      section.formControls.forEach((formControl: any) => {
        if (formControl.name === parentControl.name) {
          formControl.dynamicControls[index + 1].forEach((dynamicControl: any) => {
            if (dynamicControl.name === subControl.name) {
              // Remove the `z`-th element from `innerArrayControl`
              dynamicControl.innerArrayControl.splice(z + 1, 1);
            }
          });
        }
      });
    });

    // Update the reactive form (this.dynamicFormGroup)
    const formArr = this.dynamicFormGroup.get(parentControl.name) as FormArray;
    if (formArr) {
      const innerFormArr = formArr.controls[index].get(subControl.name) as FormArray;
      if (innerFormArr) {
        innerFormArr.removeAt(z); // Remove the `z`-th FormGroup from FormArray
      }
    }
  }


  getNestedControl(formArrayName: string, index: number, controlName: string, option: any) {
    const formArray = this.dynamicFormGroup.get(formArrayName) as FormArray;
    const control = formArray?.controls[index]?.get(controlName) as FormGroup;
    return control;
  }

  onmultiCheckboxChange(event: Event, subControl: any, control: any, i: any, option: any) {
    const checkbox = event.target as HTMLInputElement;
    const formArrayControl = this.getNestedControl(control.name, i, subControl.name, option.value) as FormGroup;
    const selectedValues = formArrayControl.value || [];
    if (selectedValues) {
      const trueCount = Object.values(selectedValues).filter(value => value === true).length;

      if (this.formData.productName.includes('VYTL') && checkbox.checked && trueCount > 3) {
        // If already 3 or more values are true and checkbox is being chec"{\"productName\":\"Activ Health Platinum Premiere\",\"proposalNumber\":\"UPP160125173820346\",\"applicableZones\":\"Zone I,Zone II,Zone III\",\"accountHolderName\":\"SOUVIK MITRA\",\"exisitingPolicy\":\"N\",\"isAdityaBirlaPolicy\":\"\",\"getPolicyNumber\":\"\",\"getPolicyDetails\":null,\"getInsurerDetails\":\"\",\"previousDocumentPara\":null,\"policyDocumentUpload\":\"\",\"policyDocumentSubmit\":\"\",\"productNameOfPreviousPolicy\":\"\",\"previousPolicyType\":\"\",\"previousPolicyNumber\":\"\",\"nameOfInsurer\":\"\",\"sumInsuredPorting\":\"\",\"policyStartDate\":\"\",\"policyEndDate\":\"\",\"previousPolicyVariant\":\"\",\"inceptionDate\":\"\",\"breakTime\":\"N\",\"claimPreviousPolicy\":\"N\",\"anyAddOns\":\"N\",\"memberDobProposer\":\"1965-07-22\",\"memberAgeProposer\":\"59\",\"panNo\":\"FVYPM1429K\",\"verifyKYC\":null,\"isPep\":\"N\",\"productVariant\":\"Premiere\",\"ckycNo\":\"\",\"leadNumber\":\"\",\"tenureAmount\":[0,0,0],\"displayTaxList\":[],\"isEmployee\":false,\"typeOfBusiness\":\"NB\",\"memberPlan\":\"Premiere\",\"productType\":\"AH\",\"planCode\":\"6212100002\",\"productId\":\"6212\",\"preFix\":\"Mr\",\"firstName\":\"SOUVIK\",\"middleName\":\"\",\"lastName\":\"MITRA\",\"proposerGender\":\"M\",\"emailId\":\"souvik@gmail.com\",\"alternateEmailId\":\"\",\"mobileNumber\":\"9930519086\",\"whatsAppNumber\":\"\",\"idProof\":\"{\\\"id\\\":\\\"2\\\",\\\"value\\\":\\\"Aadhar Card\\\",\\\"name\\\":\\\"Aadhar Card\\\",\\\"dependentControls\\\":[{\\\"name\\\":\\\"aadharIdNo\\\",\\\"visibility\\\":true},{\\\"name\\\":\\\"passportIdNo\\\",\\\"visibility\\\":false},{\\\"name\\\":\\\"licenseIdNo\\\",\\\"visibility\\\":false},{\\\"name\\\":\\\"voterIdNo\\\",\\\"visibility\\\":false},{\\\"name\\\":\\\"marksheetIdNo\\\",\\\"visibility\\\":false}]}\",\"aadharIdNo\":\"6789\",\"passportIdNo\":null,\"licenseIdNo\":null,\"voterIdNo\":null,\"marksheetIdNo\":null,\"annualIncome\":\"500000\",\"occupation\":\"{\\\"id\\\":\\\"10\\\",\\\"value\\\":\\\"O557\\\",\\\"name\\\":\\\"CA\\\"}\",\"maritalStatus\":\"{\\\"id\\\":\\\"M\\\",\\\"value\\\":\\\"Married\\\",\\\"name\\\":\\\"Married\\\"}\",\"gstDetails\":\"Consumers\",\"educationDetails\":\"{\\\"id\\\":\\\"6\\\",\\\"value\\\":\\\"Post Graduate\\\",\\\"name\\\":\\\"Post Graduate\\\"}\",\"nationality\":\"{\\\"id\\\":\\\"1\\\",\\\"value\\\":\\\"Indian\\\",\\\"name\\\":\\\"Indian\\\",\\\"selected\\\":true}\",\"sumInsured\":\"1500000\",\"zone\":\"Zone II\",\"zoneValue\":\"Z002\",\"horizontalLine\":null,\"addressTitle\":null,\"permanentAddress1\":\"C O MALAY KANTI MITRA WIRELESS COLONY BADARPUR\",\"permanentAddress2\":\"KARIMGANJ ASSAM\",\"permanentAddress3\":\"nhgfdfghj\",\"proposerPincode\":500013,\"city\":\"Hyderabad\",\"state\":\"TELANGANA\",\"corresaddressTitle\":null,\"addressTitle1\":true,\"proposerAddress1\":\"C O MALAY KANTI MITRA WIRELESS COLONY BADARPUR\",\"proposerAddress2\":\"KARIMGANJ ASSAM\",\"proposerAddress3\":\"nhgfdfghj\",\"correspondentPincode\":500013,\"correspondingCity\":\"Hyderabad\",\"correspondingState\":\"TELANGANA\",\"addMembers\":null,\"insureMem\":null,\"numberOfInsuredMembers\":3,\"plandetails\":\"\",\"totalPremium\":\"\",\"next\":null,\"memberPolicyType\":\"Multi Individual\",\"insuredMembers\":{\"Self\":true,\"Spouse\":true,\"Son1\":true,\"Daughter1\":false,\"Mother\":false,\"Father\":false,\"Mother-In-Law\":false,\"Father-In-Law\":false,\"Brother1\":false,\"Sister1\":false,\"Grand-Father\":false,\"Grand-Mother\":false,\"Grand-Son1\":false,\"Grand-Daughter1\":false,\"Son-In-Law1\":false,\"Daughter-In-Law1\":false,\"Brother-In-Law\":false,\"Sister-In-Law\":false,\"Nephew1\":false,\"Niece1\":false},\"insuredMemberDetails\":[{\"relationshipType\":\"{\\\"id\\\":\\\"R001\\\",\\\"productId\\\":\\\"15\\\",\\\"value\\\":\\\"Self\\\",\\\"name\\\":\\\"Self\\\",\\\"memberRelationCode\\\":\\\"24\\\",\\\"isIncrement\\\":false,\\\"imagePath\\\":\\\"assets/Self.png\\\"}\",\"relation\":\"Self\",\"memberRelationCode\":\"24\",\"memberdob\":\"1965-07-22\",\"memberAge\":\"59\",\"firstName\":\"SOUVIK\",\"lastName\":\"MITRA\",\"middleName\":\"\",\"mobileNumber\":\"9930519086\",\"memberRoomCategory\":\"\",\"emailId\":\"souvik@gmail.com\",\"memberGender\":\"M\",\"sumInsured\":\"1500000\",\"pincode\":500013,\"planType\":\"Multi Individual\",\"memberIndex\":0,\"city\":\"Hyderabad\",\"zone\":\"Zone II\",\"zoneValue\":\"Z002\",\"upgradableZones\":[{\"name\":\"Zone I\",\"value\":\"Z001\"},{\"name\":\"Zone II\",\"value\":\"Z002\"}],\"state\":\"\",\"covers\":[{\"coverId\":\"ADPTD\",\"value\":500000,\"coverName\":\"Personal Accident Cover (AD, PTD)\"}],\"preFix\":\"Mr\",\"productMemberDesignation\":\"{\\\"id\\\":\\\"10\\\",\\\"value\\\":\\\"O557\\\",\\\"name\\\":\\\"CA\\\"}\",\"occupationCode\":\"O014\",\"natureOfDutyCode\":\"ND02\",\"isChronic\":\"No\",\"chronicDiseases\":null,\"roomCategory\":\"\",\"pedWaitingPeriod\":\"\"},{\"relationshipType\":\"{\\\"id\\\":\\\"R002\\\",\\\"productId\\\":\\\"15\\\",\\\"value\\\":\\\"Spouse\\\",\\\"name\\\":\\\"Spouse\\\",\\\"memberRelationCode\\\":\\\"13\\\",\\\"isIncrement\\\":false,\\\"imagePath\\\":\\\"assets/Spouse.png\\\"}\",\"relation\":\"Spouse\",\"memberRelationCode\":\"13\",\"memberdob\":\"1958-12-12\",\"memberAge\":\"66\",\"firstName\":\"\",\"lastName\":\"\",\"middleName\":\"\",\"mobileNumber\":\"\",\"weight\":\"\",\"height\":\"\",\"memberRoomCategory\":\"\",\"heightInches\":\"\",\"emailId\":\"\",\"memberGender\":\"F\",\"sumInsured\":\"1500000\",\"pincode\":\"500013\",\"planType\":\"Multi Individual\",\"memberIndex\":1,\"city\":\"Hyderabad\",\"zone\":\"Zone II\",\"zoneValue\":\"Z002\",\"upgradableZones\":[{\"name\":\"Zone I\",\"value\":\"Z001\"},{\"name\":\"Zone II\",\"value\":\"Z002\"}],\"state\":\"TELANGANA\",\"covers\":[],\"preFix\":\"\",\"productMemberDesignation\":\"\",\"isChronic\":\"No\",\"chronicDiseases\":null,\"roomCategory\":\"\",\"pedWaitingPeriod\":\"\"},{\"relationshipType\":\"{\\\"id\\\":\\\"R003\\\",\\\"productId\\\":\\\"15\\\",\\\"value\\\":\\\"Son1\\\",\\\"name\\\":\\\"Son1\\\",\\\"memberRelationCode\\\":\\\"23\\\",\\\"isIncrement\\\":true,\\\"imagePath\\\":\\\"assets/Son.png\\\",\\\"gender\\\":\\\"M\\\"}\",\"relation\":\"Son1\",\"memberRelationCode\":\"23\",\"memberdob\":\"2022-01-01\",\"memberAge\":\"3\",\"firstName\":\"\",\"lastName\":\"\",\"middleName\":\"\",\"mobileNumber\":\"\",\"weight\":\"\",\"height\":\"\",\"memberRoomCategory\":\"\",\"heightInches\":\"\",\"emailId\":\"\",\"memberGender\":\"M\",\"sumInsured\":\"1500000\",\"pincode\":\"500013\",\"planType\":\"Multi Individual\",\"memberIndex\":2,\"city\":\"Hyderabad\",\"zone\":\"Zone II\",\"zoneValue\":\"Z002\",\"upgradableZones\":[{\"name\":\"Zone I\",\"value\":\"Z001\"},{\"name\":\"Zone II\",\"value\":\"Z002\"}],\"state\":\"TELANGANA\",\"covers\":[],\"preFix\":\"\",\"productMemberDesignation\":\"\",\"isChronic\":\"No\",\"chronicDiseases\":null,\"roomCategory\":\"\",\"pedWaitingPeriod\":\"\"}],\"noOfChildrens\":1,\"familySize\":\"3A\",\"proposerName\":\"SOUVIKMITRA\"}"ked
        checkbox.checked = false; // Revert the checkbox state
        // Show toast message (use your toast service here)
        // formArrayControl.get(option.name)?.setValue(false);
        formArrayControl.get(option.name)?.setValue(false);
        this.toast.error({ detail: "Error", summary: 'You can select a maximum of 3 options only.', duration: 3000 });
        return;
      }
      else {
        formArrayControl.get(option.name)?.setValue(checkbox.checked);

      }
    }
  }


  isOptionSelected(subControl: any, value: string): boolean {
    const selectedValues = this.dynamicFormGroup.get(subControl.name)?.value || [];
    return selectedValues.includes(value);
  }
  toggleOptionsVisibility(index: any, controlName: string) {
    console.log(this.showOptions, controlName, index);
    this.clickedInside = true;
    if (!this.showOptions[controlName]) {
      this.showOptions[controlName] = {};
    }
    Object.keys(this.showOptions[controlName]).forEach((key: any) => {
      if (key != index) { // Exclude the current index
        this.showOptions[controlName][key] = false;
      }
    });
    this.showOptions[controlName][index] = !this.showOptions[controlName][index];
    console.log(this.showOptions);
  }
  getSelectedDiseases(control: any, index: any, subControl: string): string {
    const controlName: any = this.dynamicFormGroup.get(control)?.get([index, subControl]) as FormGroup;
    const selectedKeys = Object.keys(controlName?.value).filter(key => controlName?.value[key] === true);
    // if (controlName) {
    //   controlName.setValidators(this.addCustomValidationForChronicCondition(controlName));
    //   controlName.updateValueAndValidity();

    // }
    const formArray = this.dynamicFormGroup.get(control) as FormArray;

    if (this.formData.productName.includes('VYTL') && formArray) {
      const hasAnyTrue: boolean[] = [];

      // Build the hasAnyTrue array to track boolean values for each member
      formArray.controls.forEach((formGroup) => {
        const subControlGroup = formGroup.get(subControl) as FormGroup;
        if (subControlGroup) {
          const validationResult = this.addCustomValidationForChronicCondition(subControlGroup)(subControlGroup);
          hasAnyTrue.push(validationResult === null);        // hasAnyTrue.push(hasTrue);
        }
      });

      // Determine the global state for all members
      const shouldSetValueTo = hasAnyTrue.includes(true);

      // Update all members based on the shouldSetValueTo result
      formArray.controls.forEach((formGroup) => {
        const subControlGroup = formGroup.get(subControl) as FormGroup;
        if (subControlGroup) {
          subControlGroup.setValidators(() => (shouldSetValueTo ? null : { required: true }));
          subControlGroup.updateValueAndValidity();
        }
      });
    }
    // controlName.markAsPristine(!isTouched); // Optional: Mark dirty for additional validation logic
    if (controlName?.value) {

      if (selectedKeys.length > 0) {
        return selectedKeys
          .map(key => key.charAt(0).toUpperCase() + key.slice(1))
          .join(', ');
      }
    }
    return 'Select Options';
  }

  addCustomValidationForChronicCondition(controlName: FormGroup): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const controlGroup = controlName;
      const hasAtLeastOneSelected = Object.keys(controlGroup.controls).some(
        key => controlGroup.controls[key].value === true
      );
      return hasAtLeastOneSelected ? null : { required: true };
    };
  }

  disableForAllOtherMembers(control: any) {
    const addOnControlGroup = this.dynamicFormGroup.get(control.name);
    if (addOnControlGroup && this.formData.memberPolicyType == 'Family Floater') {
      const addOnDetailsControl = addOnControlGroup.get('addOnDetails');
      console.log(addOnDetailsControl);
      Object.keys(addOnDetailsControl?.value).forEach((Key: any, index: number) => {
        console.log(Key, index);
        if (index != 0) {
          const memberArray = addOnDetailsControl?.get(Key) as FormArray;
          console.log(memberArray);

          memberArray.controls.forEach((member: any) => {
            console.log(member);

            const memberControlCheckbox = member.get('memberCheckbox');
            console.log(memberControlCheckbox);

            if (memberControlCheckbox) {
              memberControlCheckbox.disable();
            }
          })

        }
      })
    } else if (this.formData.productName == 'Active Secure' && addOnControlGroup && this.formData.memberPolicyType === 'Multi Individual') {
      const addOnDetailsControl = addOnControlGroup.get('addOnDetails');
      console.log(addOnDetailsControl);
      Object.keys(addOnDetailsControl?.value).forEach((Key: any, index: number) => {
        console.log(Key, index);
        if (index != 0) {
          const memberArray = addOnDetailsControl?.get(Key) as FormArray;
          console.log(memberArray);

          memberArray.controls.forEach((member: any) => {
            console.log(member);

            const memberControlCheckbox = member.get('memberCheckbox');
            console.log(memberControlCheckbox);

            if (memberControlCheckbox) {
              memberControlCheckbox.disable();
            }
          })

        }
      })
    }
  }
  selectForAllMembers(event: any, coreControl: any, subControl: any, parentControl: any) {
    console.log(event.target.checked, coreControl, subControl, parentControl, this.dynamicFormGroup);
    const addOnControlGroup = this.dynamicFormGroup.get(parentControl.name);
    console.log(addOnControlGroup, this.formData.memberPolicyType)
    if (addOnControlGroup && this.formData.memberPolicyType === 'Family Floater') {
      const addOnDetailsControl = addOnControlGroup.get(subControl.name);
      Object.keys(addOnDetailsControl?.value).forEach((Key: any, index: number) => {
        console.log(Key, index);
        if (index != 0) {
          const memberArray = addOnDetailsControl?.get(Key) as FormArray;
          console.log(memberArray);

          memberArray.controls.forEach((member: any) => {
            console.log(member);

            const memberControlCheckbox = member.get('memberCheckbox');
            console.log(memberControlCheckbox);

            if (memberControlCheckbox) {
              memberControlCheckbox.setValue(event.target.checked);
            }
            const memberRoomTypeControl = member.get('roomType');
            if (memberRoomTypeControl) {
              if (event.target.checked) {
                if (memberRoomTypeControl.value === "") {
                  const firstOption = subControl.innerSubControls[0].coreControls.find(
                    (control: any) => control.name === 'roomType'
                  )?.options?.[0];

                  if (firstOption) {
                    memberRoomTypeControl.setValue(firstOption.value);
                  }
                }
              } else {
                memberRoomTypeControl.setValue("");
              }
            }
          })

        }

      })
    }
    else if (this.formData.productName == 'Active Secure' && addOnControlGroup && this.formData.memberPolicyType === 'Multi Individual') {
      const addOnDetailsControl = addOnControlGroup.get(subControl.name);
      Object.keys(addOnDetailsControl?.getRawValue()).forEach((Key: any, index: number) => {
        console.log(Key, index);
        if (index != 0) {
          const memberArray = addOnDetailsControl?.get(Key) as FormArray;
          console.log(memberArray);

          memberArray.controls.forEach((member: any) => {
            console.log(member);
            const memberControlCheckbox = member.get('memberCheckbox');
            console.log(memberControlCheckbox);

            if (memberControlCheckbox) {
              memberControlCheckbox.setValue(event.target.checked);
            }
          })
        }

      })
    }
  }
  disableControlForAllOtherMembers(control: any) {
    if (control.name == 'burnBenefit' || control.name == 'brokenBonesBenefit') {
      const addOnControlGroup = this.dynamicFormGroup.get(control.name);
      if (addOnControlGroup) {
        const addOnDetailsControl = addOnControlGroup.get('addOnDetails');
        Object.keys(addOnDetailsControl?.value).forEach((Key: any, index: number) => {
          console.log(Key, index);
          if (index != 0) {
            const memberArray = addOnDetailsControl?.get(Key) as FormArray;
            memberArray.controls.forEach((member: any) => {
              const memberDaysControl = member.get('addOnSumInsured');
              if (memberDaysControl) {
                memberDaysControl.disable();
              }
            })
          }
        })
      }
    } else if (control.name == 'hospitalCashBenefits') {
      const addOnControlGroup = this.dynamicFormGroup.get(control.name);
      if (addOnControlGroup) {
        const addOnDetailsControl = addOnControlGroup.get('addOnDetails');
        Object.keys(addOnDetailsControl?.value).forEach((Key: any, index: number) => {
          console.log(Key, index);
          if (index != 0) {
            const memberArray = addOnDetailsControl?.get(Key) as FormArray;
            memberArray.controls.forEach((member: any) => {
              const memberDaysControl = member.get('noOfDays');
              if (memberDaysControl) {
                memberDaysControl.disable();
              }
            })
          }
        })
      }
    }
  }
  autoSelectControlValueForAllMembers(event: any, coreControl: any, subControl: any, parentControl: any) {
    if (parentControl.name == 'burnBenefit' || parentControl.name == 'brokenBonesBenefit') {
      console.log(event.target.value, coreControl, subControl, parentControl, this.dynamicFormGroup);
      const addOnControlGroup = this.dynamicFormGroup.get(parentControl.name);
      if (addOnControlGroup) {
        const addOnDetailsControl = addOnControlGroup.get(subControl.name);
        console.log("addOnDetailsControl", addOnDetailsControl?.getRawValue());
        Object.keys(addOnDetailsControl?.getRawValue()).forEach((Key: any, index: number) => {
          console.log(Key, index);
          if (index != 0) {
            const memberArray = addOnDetailsControl?.get(Key) as FormArray;
            memberArray.controls.forEach((member: any) => {
              console.log(member);
              const memberControlCheckbox = member.get('addOnSumInsured');
              if (memberControlCheckbox) {
                memberControlCheckbox.setValue(event.target.value);
              }
            })
          }

        })
      }
    } else if (parentControl.name == 'hospitalCashBenefits') {
      console.log(event.target.value, coreControl, subControl, parentControl, this.dynamicFormGroup);
      const addOnControlGroup = this.dynamicFormGroup.get(parentControl.name);
      if (addOnControlGroup) {
        const addOnDetailsControl = addOnControlGroup.get(subControl.name);
        console.log("addOnDetailsControl", addOnDetailsControl?.getRawValue());
        Object.keys(addOnDetailsControl?.getRawValue()).forEach((Key: any, index: number) => {
          console.log(Key, index);
          if (index != 0) {
            const memberArray = addOnDetailsControl?.get(Key) as FormArray;
            memberArray.controls.forEach((member: any) => {
              console.log(member);
              const memberControlCheckbox = member.get('noOfDays');
              if (memberControlCheckbox) {
                memberControlCheckbox.setValue(event.target.value);
              }
            })
          }

        })
      }
    }
  }
  markNestedControlsAsTouched(control: AbstractControl): void {
    // If the control is a FormGroup, iterate over its controls
    if (control instanceof FormGroup) {
      Object.keys(control.controls).forEach(field => {
        const innerControl = control.get(field);
        if (innerControl) {
          innerControl.markAsTouched({ onlySelf: true });

          // Recursively mark nested FormGroups or FormArrays as touched
          if (innerControl instanceof FormGroup || innerControl instanceof FormArray) {
            this.markNestedControlsAsTouched(innerControl);
          }
        }
      });
    }
  }

  // defaultAddOn(control: any) {
  //   const addOnControl = this.dynamicFormGroup.get(control.name);
  //   const addOnCoverControl = addOnControl?.get('addOnCover');
  //   const addOnDetailsControl = addOnControl?.get('addOnDetails');
  //   const addOnIdControl = addOnControl?.get('addOnId');
  //   const addOnCoverNameControl = addOnControl?.get('optionalCoverName');

  //   const addOnData = addOnControl?.getRawValue();
  //   const modifiedInsuredMemberDetails = this.formData.insuredMemberDetails;

  //   if (!addOnDetailsControl || !addOnData) {
  //     console.warn('Add-on details control or data is not found.');
  //     return;
  //   }

  //   // Ensure addOnCover and memberCheckbox values are true
  //   addOnCoverControl?.setValue(true);

  //   if(addOnCoverNameControl?.value.includes('Personal Accident')){
  //     Object.keys(addOnDetailsControl.value).forEach((key: any) => {
  //       const memberArray = addOnDetailsControl.get(key) as FormArray;

  //       console.log(memberArray);

  //       memberArray.controls.forEach((member: any) => {
  //         console.log(member);

  //         const memberControlCheckbox = member.get('memberCheckbox');
  //         const occupationControl = member.get('occupation');
  //         const occupationRiskControl = member.get('occupationRisk');
  //         const addOnSumInsuredControl = member.get('addOnSumInsured')

  //         console.log(memberControlCheckbox, occupationControl, occupationRiskControl);


  //         if (memberControlCheckbox) {
  //           memberControlCheckbox.setValue(true);

  //           if (key === 'Self') {
  //             // Disable the checkbox for 'Self'
  //             memberControlCheckbox.disable();
  //             addOnCoverControl?.disable();
  //           }
  //         }

  //         if (addOnCoverNameControl?.value.includes('Personal Accident')) {
  //           console.log(control.subControls[1].innerSubControls);

  //           // Set default values for occupation and occupationRisk by iterating through coreControls
  //           const innerControls = control.subControls[1].innerSubControls || [];
  //           const coreControls = innerControls[0]?.coreControls || [];

  //           if (occupationControl) {
  //             coreControls.forEach((coreControl: any) => {
  //               if (coreControl.name === 'occupation' && occupationControl && occupationControl.value === '') {
  //                 const defaultOption = JSON.stringify(coreControl.options?.[0]);
  //                 if (defaultOption) {
  //                   occupationControl.setValue(defaultOption);
  //                 }
  //               }
  //             });
  //           }

  //           if (occupationRiskControl) {
  //             console.log(occupationRiskControl);

  //             coreControls.forEach((coreControl: any) => {
  //               if (coreControl.name === 'occupationRisk' && occupationRiskControl && occupationRiskControl.value === '') {
  //                 const defaultOption = JSON.stringify(coreControl.options?.[0]);
  //                 if (defaultOption) {
  //                   occupationRiskControl.setValue(defaultOption);
  //                 }
  //               }
  //             });
  //           }

  //           if (addOnSumInsuredControl) {
  //             coreControls.forEach((coreControl: any) => {
  //               if (coreControl.name === 'addOnSumInsured' && addOnSumInsuredControl && addOnSumInsuredControl.value === '') {
  //                 const defaultOption = coreControl.options?.[0]?.value;
  //                 if (defaultOption) {
  //                   addOnSumInsuredControl.setValue(defaultOption);
  //                 }
  //               }
  //             });
  //           }
  //         }

  //         console.log(occupationControl, occupationRiskControl);
  //         const addOnData = addOnControl?.value;
  //         console.log(addOnData,addOnControl);


  //         // Check if the checkbox is enabled and checked
  //         // if (memberControlCheckbox.value) {
  //         modifiedInsuredMemberDetails.forEach((insuredMember: any, index: number) => {
  //           if (insuredMember.relation === key) {
  //             const coverId = addOnIdControl?.value;
  //             const coverName = addOnCoverNameControl?.value || '';

  //             let addOnSumInsured = 0;
  //             let coverFound = false;

  //             const addOnDetails = addOnData.addOnDetails[key];
  //             addOnDetails.forEach((detail: any) => {
  //               if (detail.addOnSumInsured) {
  //                 addOnSumInsured = detail.addOnSumInsured;
  //               } else if (detail.roomType) {
  //                 addOnSumInsured = detail.roomType;
  //               }

  //               if (coverName.includes('Personal Accident') && detail.occupation) {
  //                 insuredMember.occupationCode = JSON.parse(detail.occupation).value;
  //               }

  //               if (coverName.includes('Personal Accident') && detail.occupationRisk) {
  //                 insuredMember.natureOfDutyCode = JSON.parse(detail.occupationRisk).value;
  //               }
  //             });

  //             if (!insuredMember.covers) {
  //               insuredMember.covers = [];
  //             }

  //             insuredMember.covers.forEach((cover: any) => {
  //               if (cover.coverId === coverId) {
  //                 cover.value = addOnSumInsured;
  //                 coverFound = true;
  //               }
  //             });

  //             if (!coverFound) {
  //               insuredMember.covers.push({
  //                 coverId,
  //                 value: addOnSumInsured,
  //                 coverName
  //               });
  //             }

  //             if (!this.covers[index]) {
  //               this.covers[index] = [];
  //             }

  //             const coverInCovers = this.covers[index].find((c: any) => c.coverId === coverId);
  //             if (coverInCovers) {
  //               coverInCovers.value = addOnSumInsured;
  //             } else {
  //               this.covers[index].push({
  //                 coverId,
  //                 value: addOnSumInsured,
  //                 coverName
  //               });
  //             }
  //           }
  //         });
  //         // }

  //       });
  //     });
  //   }
  //   else{
  //     if(this.formData['memberPolicyType']== 'Family Floater'){

  //     }
  //   }


  // }

  defaultAddOn(control: any) {
    const addOnControl = this.dynamicFormGroup.get(control.name);
    const addOnCoverControl = addOnControl?.get('addOnCover');
    const addOnDetailsControl = addOnControl?.get('addOnDetails');
    const addOnIdControl = addOnControl?.get('addOnId');
    const addOnCoverNameControl = addOnControl?.get('optionalCoverName');

    const addOnData = addOnControl?.getRawValue();
    const modifiedInsuredMemberDetails = this.formData.insuredMemberDetails;

    if (!addOnDetailsControl || !addOnData) {
      console.warn('Add-on details control or data is not found.');
      return;
    }



    // if (addOnCoverNameControl?.value.includes('Personal Accident')) {
    //   let shouldEnableAddOnCover = false; // Track if any member's checkbox is true
    //   let isSelfPresent = false;
    //   // Check for age validation rules
    //   const ageValidationRule = control.validationRules?.find((rule: any) => rule.type === 'ageValidation');
    //   if (ageValidationRule) {
    //     this.checkForAgeValidations(control); // Call the age validation method
    //   }

    //   const memberSumInsuredValidationRule = control.validationRules?.find((rule: any) => rule.type === 'memberLevelSumInsured');
    //   if (memberSumInsuredValidationRule) {
    //     this.memberSumInsuredValidationMethod(memberSumInsuredValidationRule);
    //   }

    //   console.log("After disabling based on member", this.form);


    //   const zoneValidationRule = control.validationRules?.find((rule: any) => rule.type === 'zoneWiseValidation');

    //   const portabilityValidationRule = control.validationRules?.find((rule: any) => rule.type === 'portability');
    //   const isPortabilityRuleAvailable = portabilityValidationRule && this.formData['typeOfBusiness'] == 'Roll Over';
    //   if (portabilityValidationRule && this.formData['typeOfBusiness'] == 'Roll Over') {
    //     this.setPortabilityValidationRule(portabilityValidationRule, control);
    //   }

    //   // Existing "Personal Accident" logic
    //   Object.keys(addOnDetailsControl.value).forEach((key: any) => {
    //     const memberArray = addOnDetailsControl.get(key) as FormArray;

    //     memberArray.controls.forEach((member: any) => {
    //       const memberControlCheckbox = member.get('memberCheckbox');
    //       const occupationControl = member.get('occupation');
    //       const occupationRiskControl = member.get('occupationRisk');
    //       const addOnSumInsuredControl = member.get('addOnSumInsured');

    //       // Skip processing if member control is disabled
    //       if (memberControlCheckbox?.disabled) {
    //         console.log(`Skipping disabled member: ${key}`);
    //         return;
    //       }

    //       if (memberControlCheckbox) {

    //         if (!isPortabilityRuleAvailable && !portabilityValidationRule) {
    //           memberControlCheckbox.setValue(true);
    //           if (key === 'Self') {
    //             isSelfPresent = true;
    //             // Disable the checkbox for 'Self'
    //             memberControlCheckbox.disable();
    //           }
    //         }
    //         else if (isPortabilityRuleAvailable) {
    //           if (portabilityValidationRule.allMemberSelected) {
    //             memberControlCheckbox.setValue(true);
    //           }
    //           if (portabilityValidationRule.allMemberDisabled) {
    //             memberControlCheckbox.disable();
    //           }
    //         }

    //         shouldEnableAddOnCover = true; // Set the flag if any checkbox is enabled
    //       }

    //       if (addOnCoverNameControl?.value.includes('Personal Accident')) {
    //         console.log(control.subControls);

    //         const innerControls = control.subControls[1].innerSubControls || [];
    //         const matchingInnerControl = innerControls.find((innerControl: any) => innerControl.name === key);
    //         const coreControls = matchingInnerControl?.coreControls || [];

    //         if (occupationControl) {
    //           coreControls.forEach((coreControl: any) => {
    //             if (coreControl.name === 'occupation' && occupationControl.value === '') {
    //               const defaultOption = JSON.stringify(coreControl.options?.[0]);
    //               if (defaultOption) {
    //                 occupationControl.setValue(defaultOption);
    //               }
    //             }
    //           });
    //         }

    //         if (occupationRiskControl) {
    //           coreControls.forEach((coreControl: any) => {
    //             if (coreControl.name === 'occupationRisk' && occupationRiskControl.value === '') {
    //               const defaultOption = JSON.stringify(coreControl.options?.[0]);
    //               if (defaultOption) {
    //                 occupationRiskControl.setValue(defaultOption);
    //               }
    //             }
    //           });
    //         }

    //         if (addOnSumInsuredControl) {
    //           coreControls.forEach((coreControl: any) => {
    //             if (coreControl.name === 'addOnSumInsured' && addOnSumInsuredControl.value === '') {
    //               const defaultOption = coreControl.options?.[0]?.value;
    //               if (defaultOption) {
    //                 addOnSumInsuredControl.setValue(defaultOption);
    //               }
    //             }
    //           });
    //         }
    //       }

    //       // modifiedInsuredMemberDetails.forEach((insuredMember: any, index: number) => {
    //       //   if (insuredMember.relation === key) {
    //       //     const coverId = addOnIdControl?.value;
    //       //     const coverName = addOnCoverNameControl?.value || '';

    //       //     let addOnSumInsured = 0;
    //       //     let coverFound = false;

    //       //     const addOnDetails = addOnControl?.value.addOnDetails[key];
    //       //     addOnDetails.forEach((detail: any) => {
    //       //       if (detail.addOnSumInsured) {
    //       //         addOnSumInsured = detail.addOnSumInsured;
    //       //       } else if (detail.roomType) {
    //       //         addOnSumInsured = detail.roomType;
    //       //       }

    //       //       if (coverName.includes('Personal Accident') && detail.occupation) {
    //       //         insuredMember.occupationCode = JSON.parse(detail.occupation).value;
    //       //       }

    //       //       if (coverName.includes('Personal Accident') && detail.occupationRisk) {
    //       //         insuredMember.natureOfDutyCode = JSON.parse(detail.occupationRisk).value;
    //       //       }
    //       //     });

    //       //     if (!insuredMember.covers) {
    //       //       insuredMember.covers = [];
    //       //     }

    //       //     insuredMember.covers.forEach((cover: any) => {
    //       //       if (cover.coverId === coverId) {
    //       //         cover.value = addOnSumInsured;
    //       //         coverFound = true;
    //       //       }
    //       //     });

    //       //     if (!coverFound) {
    //       //       insuredMember.covers.push({
    //       //         coverId,
    //       //         value: addOnSumInsured,
    //       //         coverName
    //       //       });
    //       //     }

    //       //     if (!this.covers[index]) {
    //       //       this.covers[index] = [];
    //       //     }

    //       //     const coverInCovers = this.covers[index].find((c: any) => c.coverId === coverId);
    //       //     if (coverInCovers) {
    //       //       coverInCovers.value = addOnSumInsured;
    //       //     } else {
    //       //       this.covers[index].push({
    //       //         coverId,
    //       //         value: addOnSumInsured,
    //       //         coverName
    //       //       });
    //       //     }
    //       //   }
    //       // });



    //       if (!portabilityValidationRule || isPortabilityRuleAvailable) {
    //         modifiedInsuredMemberDetails.forEach((insuredMember: any, index: number) => {
    //           if (insuredMember.relation === key) {
    //             const coverId = addOnIdControl?.value;
    //             const coverName = addOnCoverNameControl?.value || '';

    //             let addOnSumInsured = 0;
    //             let coverFound = false;

    //             const addOnDetails = addOnControl?.value.addOnDetails[key];
    //             addOnDetails.forEach((detail: any) => {
    //               if (detail.addOnSumInsured) {
    //                 addOnSumInsured = detail.addOnSumInsured;
    //               } else if (detail.roomType) {
    //                 addOnSumInsured = detail.roomType;
    //               }

    //               if (coverName.includes('Personal Accident') && detail.occupation) {
    //                 insuredMember.occupationCode = JSON.parse(detail.occupation).value;
    //               }

    //               if (coverName.includes('Personal Accident') && detail.occupationRisk) {
    //                 insuredMember.natureOfDutyCode = JSON.parse(detail.occupationRisk).value;
    //               }
    //             });

    //             if (!insuredMember.covers) {
    //               insuredMember.covers = [];
    //             }

    //             insuredMember.covers.forEach((cover: any) => {
    //               if (cover.coverId === coverId) {
    //                 cover.value = addOnSumInsured;
    //                 coverFound = true;
    //               }
    //             });

    //             if (!coverFound) {
    //               insuredMember.covers.push({
    //                 coverId,
    //                 value: addOnSumInsured,
    //                 coverName
    //               });
    //             }

    //             if (!this.covers[index]) {
    //               this.covers[index] = [];
    //             }

    //             const coverInCovers = this.covers[index].find((c: any) => c.coverId === coverId);
    //             if (coverInCovers) {
    //               coverInCovers.value = addOnSumInsured;
    //             } else {
    //               this.covers[index].push({
    //                 coverId,
    //                 value: addOnSumInsured,
    //                 coverName
    //               });
    //             }
    //           }
    //         });
    //       }

    //     });
    //   });

    //   // Set addOnCoverControl to true only if shouldEnableAddOnCover is true
    //   if (shouldEnableAddOnCover) {
    //     console.log(shouldEnableAddOnCover);

    //     let zoneValidationRuleApplicable = false;
    //     if (zoneValidationRule) {
    //       zoneValidationRuleApplicable = this.formData.insuredMemberDetails.some(
    //         (insuredMember: any) => insuredMember.zone === 'Zone I'
    //       );
    //     }


    //     if (portabilityValidationRule) {

    //       if (isPortabilityRuleAvailable) {
    //         addOnCoverControl?.setValue(true);
    //       }
    //       else {
    //         addOnCoverControl?.setValue(false);
    //       }
    //     }
    //     else {
    //       addOnCoverControl?.setValue(true);
    //     }

    //     if ((isSelfPresent && !zoneValidationRuleApplicable && !isPortabilityRuleAvailable) || isPortabilityRuleAvailable) {
    //       addOnCoverControl?.disable();
    //     }

    //   }
    //   else {
    //     addOnCoverControl?.setValue(false);
    //   }
    // }
    if (addOnCoverNameControl?.value.includes('Personal Accident')) {
      let shouldEnableAddOnCover = false; // Track if any member's checkbox is true
      let isSelfPresent = false;

      // Check for age validation rules
      const ageValidationRule = control.validationRules?.find((rule: any) => rule.type === 'ageValidation');
      if (ageValidationRule) {
        this.checkForAgeValidations(control); // Call the age validation method
      }

      const memberSumInsuredValidationRule = control.validationRules?.find((rule: any) => rule.type === 'memberLevelSumInsured');
      if (memberSumInsuredValidationRule) {
        this.memberSumInsuredValidationMethod(memberSumInsuredValidationRule);
      }

      console.log("After disabling based on member", this.form);

      const zoneValidationRule = control.validationRules?.find((rule: any) => rule.type === 'zoneWiseValidation');
      const portabilityValidationRule = control.validationRules?.find((rule: any) => rule.type === 'portability');
      const isPortabilityRuleAvailable = portabilityValidationRule && this.formData['typeOfBusiness'] === 'Roll Over';

      if (isPortabilityRuleAvailable) {
        this.setPortabilityValidationRule(portabilityValidationRule, control);
      }

      Object.keys(addOnDetailsControl.value).forEach((key: any) => {
        const memberArray = addOnDetailsControl.get(key) as FormArray;

        memberArray.controls.forEach((member: any) => {
          const memberControlCheckbox = member.get('memberCheckbox');
          const occupationControl = member.get('occupation');
          const occupationRiskControl = member.get('occupationRisk');
          const addOnSumInsuredControl = member.get('addOnSumInsured');

          if (memberControlCheckbox?.disabled) {
            console.log(`Skipping disabled member: ${key}`);
            return;
          }

          const matchingMember = this.formData.insuredMemberDetails.find(
            (insuredMember: any) => key === insuredMember.relation
          );

          // let minSumInsured = portabilityValidationRule?.minSumInsured;
          // let maxSumInsured = portabilityValidationRule?.maxSumInsured;

          // if (isPortabilityRuleAvailable && portabilityValidationRule?.policyRules) {
          //   const policyRule = portabilityValidationRule.policyRules.find(
          //     (rule: any) => rule.policyType === this.formData.memberPolicyType
          //   );

          //   if (policyRule?.ageBasedRules) {
          //     const ageThreshold = policyRule.ageBasedRules.ageThreshold;

          //     if (parseInt(matchingMember.memberAge) < ageThreshold) {
          //       const belowThresholdRules = policyRule.ageBasedRules.belowThreshold;
          //       if (belowThresholdRules) {
          //         // minSumInsured = belowThresholdRules.minSumInsured || minSumInsured;
          //         // maxSumInsured = belowThresholdRules.maxSumInsured || maxSumInsured;
          //         if (memberControlCheckbox) {
          //           memberControlCheckbox.setValue(belowThresholdRules.selected);
          //           if (belowThresholdRules.disabled) {
          //             memberControlCheckbox.disable();
          //           }

          //         }
          //       }
          //     } else {
          //       const aboveThresholdRules = policyRule.ageBasedRules.aboveThreshold;
          //       if (aboveThresholdRules) {
          //         console.log(memberControlCheckbox);

          //         if (memberControlCheckbox) {
          //           memberControlCheckbox.setValue(aboveThresholdRules.selected);
          //           if (aboveThresholdRules.disabled) {
          //             memberControlCheckbox.disable();
          //           }

          //         }
          //       }
          //     }
          //   }
          // }

          if (isPortabilityRuleAvailable && portabilityValidationRule?.policyRules) {
            const policyRule = portabilityValidationRule.policyRules.find(
              (rule: any) => rule.policyType === this.formData.memberPolicyType
            );

            if (policyRule?.ageBasedRules) {
              const minAgeThreshold = policyRule.ageBasedRules.minAgeThreshold;
              const maxAgeThreshold = policyRule.ageBasedRules.maxAgeThreshold;

              if (parseInt(matchingMember.memberAge) < minAgeThreshold) {
                const belowMinThresholdRules = policyRule.ageBasedRules.belowMinThreshold;
                if (belowMinThresholdRules && memberControlCheckbox) {
                  memberControlCheckbox.setValue(belowMinThresholdRules.selected);
                  if (belowMinThresholdRules.disabled) {
                    memberControlCheckbox.disable();
                  }
                }
              } else if (parseInt(matchingMember.memberAge) > maxAgeThreshold) {
                const aboveMaxThresholdRules = policyRule.ageBasedRules.aboveMaxThreshold;
                if (aboveMaxThresholdRules && memberControlCheckbox) {
                  memberControlCheckbox.setValue(aboveMaxThresholdRules.selected);
                  if (aboveMaxThresholdRules.disabled) {
                    memberControlCheckbox.disable();
                  }
                }
              } else {
                const withinThresholdRules = policyRule.ageBasedRules.withinThreshold;
                if (withinThresholdRules && memberControlCheckbox) {
                  memberControlCheckbox.setValue(withinThresholdRules.selected);
                  // No disable logic for withinThreshold, keeping it enabled
                  if (withinThresholdRules.disabled) {
                    memberControlCheckbox.disable();
                  }
                }
              }
            }
          }
          else if (!isPortabilityRuleAvailable && !portabilityValidationRule && memberControlCheckbox) {
            memberControlCheckbox.setValue(true);
            if (key === 'Self') {
              isSelfPresent = true;
              // Disable the checkbox for 'Self'
              memberControlCheckbox.disable();
            }
          }

          if (addOnCoverNameControl?.value.includes('Personal Accident')) {
            const innerControls = control.subControls[1].innerSubControls || [];
            const matchingInnerControl = innerControls.find((innerControl: any) => innerControl.name === key);
            const coreControls = matchingInnerControl?.coreControls || [];

            if (occupationControl) {
              coreControls.forEach((coreControl: any) => {
                if (coreControl.name === 'occupation' && occupationControl.value === '') {
                  const defaultOption = JSON.stringify(coreControl.options?.[0]);
                  if (defaultOption) {
                    occupationControl.setValue(defaultOption);
                  }
                }
              });
            }

            if (occupationRiskControl) {
              coreControls.forEach((coreControl: any) => {
                if (coreControl.name === 'occupationRisk' && occupationRiskControl.value === '') {
                  const defaultOption = JSON.stringify(coreControl.options?.[0]);
                  if (defaultOption) {
                    occupationRiskControl.setValue(defaultOption);
                  }
                }
              });
            }

            if (addOnSumInsuredControl) {
              coreControls.forEach((coreControl: any) => {
                if (coreControl.name === 'addOnSumInsured' && addOnSumInsuredControl.value === '') {
                  const defaultOption = coreControl.options?.[0]?.value;
                  if (defaultOption) {
                    addOnSumInsuredControl.setValue(defaultOption);
                  }
                }
              });
            }
          }

        });
        if (!portabilityValidationRule || isPortabilityRuleAvailable) {
          modifiedInsuredMemberDetails.forEach((insuredMember: any, index: number) => {
            if (insuredMember.relation === key) {
              const matchingMemberControl = memberArray.controls.find(
                (member: any) => member.get('memberCheckbox')?.value === true
              );

              // Only proceed if memberCheckbox is checked
              if (!matchingMemberControl) {
                console.log(`Skipping member ${key} as memberCheckbox is false`);
                return;
              }
              shouldEnableAddOnCover = true;
              const coverId = addOnIdControl?.value;
              const coverName = addOnCoverNameControl?.value || '';

              let addOnSumInsured = 0;
              let coverFound = false;

              const addOnDetails = addOnControl?.value.addOnDetails[key];
              addOnDetails.forEach((detail: any) => {
                if (detail.addOnSumInsured) {
                  addOnSumInsured = detail.addOnSumInsured;
                } else if (detail.roomType) {
                  addOnSumInsured = detail.roomType;
                }

                if (coverName.includes('Personal Accident') && detail.occupation) {
                  insuredMember.occupationCode = JSON.parse(detail.occupation).value;
                }

                if (coverName.includes('Personal Accident') && detail.occupationRisk) {
                  insuredMember.natureOfDutyCode = JSON.parse(detail.occupationRisk).value;
                }
              });

              if (!insuredMember.covers) {
                insuredMember.covers = [];
              }

              insuredMember.covers.forEach((cover: any) => {
                if (cover.coverId === coverId) {
                  cover.value = addOnSumInsured;
                  coverFound = true;
                }
              });

              if (!coverFound) {
                insuredMember.covers.push({
                  coverId,
                  value: addOnSumInsured,
                  coverName
                });
              }

              if (!this.covers[index]) {
                this.covers[index] = [];
              }

              const coverInCovers = this.covers[index].find((c: any) => c.coverId === coverId);
              if (coverInCovers) {
                coverInCovers.value = addOnSumInsured;
              } else {
                this.covers[index].push({
                  coverId,
                  value: addOnSumInsured,
                  coverName
                });
              }
            }
          });
        }
      });

      // if (shouldEnableAddOnCover) {
      //   let zoneValidationRuleApplicable = false;
      //   if (zoneValidationRule) {
      //     zoneValidationRuleApplicable = this.formData.insuredMemberDetails.some(
      //       (insuredMember: any) => insuredMember.zone === 'Zone I'
      //     );
      //   }

      //   if (isPortabilityRuleAvailable) {
      //     addOnCoverControl?.setValue(true);
      //   } else {
      //     addOnCoverControl?.setValue(false);
      //   }

      //   if ((isSelfPresent && !zoneValidationRuleApplicable && !isPortabilityRuleAvailable) || isPortabilityRuleAvailable) {
      //     addOnCoverControl?.disable();
      //   }
      // } else {
      //   addOnCoverControl?.setValue(false);
      // }

      if (shouldEnableAddOnCover) {
        console.log(shouldEnableAddOnCover);

        let zoneValidationRuleApplicable = false;
        if (zoneValidationRule) {
          zoneValidationRuleApplicable = this.formData.insuredMemberDetails.some(
            (insuredMember: any) => insuredMember.zone === 'Zone I'
          );
        }


        if (portabilityValidationRule) {

          if (isPortabilityRuleAvailable) {
            addOnCoverControl?.setValue(true);
          }
          else {
            addOnCoverControl?.setValue(false);
          }
        }
        else {
          addOnCoverControl?.setValue(true);
        }

        if ((isSelfPresent && !zoneValidationRuleApplicable && !isPortabilityRuleAvailable) || isPortabilityRuleAvailable) {
          addOnCoverControl?.disable();
        }

      }
      else {
        addOnCoverControl?.setValue(false);
      }
    }

    else {
      // New logic for validationRules
      const validationRules = control.validationRules || [];

      const ageValidationRule = control.validationRules?.find((rule: any) => rule.type === 'ageValidation');

      if (ageValidationRule) {
        this.checkForAgeValidations(control); // Call the age validation method
      }

      const matchingRule = validationRules.find(
        (rule: any) => rule.policyType === this.formData['memberPolicyType']
      );

      console.log(matchingRule);


      if (matchingRule) {
        const { allMemberSelected, allMemberDisabled } = matchingRule;

        if (allMemberSelected) {
          console.log(addOnCoverControl);

          addOnCoverControl?.setValue(true);
        }
        if (allMemberDisabled) {
          addOnCoverControl?.disable();
        }

        // Only start iteration if allMemberSelected or allMemberDisabled is true
        if (allMemberSelected || allMemberDisabled) {
          Object.keys(addOnDetailsControl.value).forEach((key: any) => {
            const memberArray = addOnDetailsControl.get(key) as FormArray;

            memberArray.controls.forEach((member: any) => {
              const memberControlCheckbox = member.get('memberCheckbox');
              const addOnSumInsuredControl = member.get('addOnSumInsured');
              let isDisabledByAgeValidation = false;
              if (ageValidationRule) {
                const matchingMember = this.formData.insuredMemberDetails.find(
                  (insuredMember: any) => key === insuredMember.relation
                );

                if (matchingMember.memberAge > ageValidationRule.maxAge || matchingMember.memberAge < ageValidationRule.minAge) {
                  isDisabledByAgeValidation = true;
                }
              }

              // Handle allMemberSelected
              if (allMemberSelected && memberControlCheckbox && !isDisabledByAgeValidation) {
                memberControlCheckbox.setValue(true);
              }

              // Handle allMemberDisabled
              if (allMemberDisabled) {
                if (memberControlCheckbox) {
                  memberControlCheckbox.disable();
                }
                // if (addOnSumInsuredControl) {
                //   addOnSumInsuredControl.disable(); // Add this line to disable addOnSumInsuredControl
                // }
              }

              // Set addOnSumInsured value logic if the control exists
              if (addOnSumInsuredControl && !isDisabledByAgeValidation) {
                const coreControls = control.subControls[1]?.innerSubControls?.[0]?.coreControls || [];
                let addOnSumInsured = '';

                coreControls.forEach((coreControl: any) => {
                  if (coreControl.name === 'addOnSumInsured') {
                    if (coreControl.options?.[0]?.value) {
                      addOnSumInsured = coreControl.options[0].value;
                    } else {
                      const memberDetail = modifiedInsuredMemberDetails.find(
                        (member: any) => member.relation === key
                      );
                      addOnSumInsured = memberDetail?.memberSumInsured || '';
                    }

                    if (addOnSumInsuredControl && addOnSumInsured !== '') {
                      addOnSumInsuredControl.setValue(addOnSumInsured);
                    }
                  }
                });

                // Update insuredMemberDetails logic
                modifiedInsuredMemberDetails.forEach((insuredMember: any, index: number) => {
                  if (insuredMember.relation === key) {
                    const coverId = addOnIdControl?.value;
                    const coverName = addOnCoverNameControl?.value || '';

                    if (!insuredMember.covers) {
                      insuredMember.covers = [];
                    }

                    const existingCover = insuredMember.covers.find((cover: any) => cover.coverId === coverId);
                    if (existingCover) {
                      existingCover.value = addOnSumInsured;
                    } else {
                      insuredMember.covers.push({ coverId, value: addOnSumInsured, coverName });
                    }

                    if (!this.covers[index]) {
                      this.covers[index] = [];
                    }

                    const existingCoverInCovers = this.covers[index].find((c: any) => c.coverId === coverId);
                    if (existingCoverInCovers) {
                      existingCoverInCovers.value = addOnSumInsured;
                    } else {
                      this.covers[index].push({ coverId, value: addOnSumInsured, coverName });
                    }
                  }
                });
              }
            });
          });
        }
      }
    }
  }



  checkForAgeValidations(control: any) {
    const addOnControl = this.dynamicFormGroup.get(control.name);
    const addOnCoverControl = addOnControl?.get('addOnCover');
    const addOnDetailsControl = addOnControl?.get('addOnDetails');

    // Initialize maxAge and minAge
    let maxAge: number | null = null;
    let minAge: number | null = null;

    // Retrieve ageValidationRule
    const ageValidationRule = control.validationRules?.find((rule: any) => rule.type === 'ageValidation');
    if (ageValidationRule) {
      // Handle maxAge
      if (typeof ageValidationRule.maxAge === 'number') {
        maxAge = ageValidationRule.maxAge;
      } else {
        console.warn('Invalid maxAge format:', ageValidationRule.maxAge);
      }

      // Handle minAge
      if (typeof ageValidationRule.minAge === 'number') {
        minAge = ageValidationRule.minAge;
      } else if (typeof ageValidationRule.minAge === 'string' && ageValidationRule.minAge.includes('days')) {
        const days = parseInt(ageValidationRule.minAge.replace('days', '').trim(), 10);
        minAge = days / 365; // Convert days to approximate years
      } else {
        console.warn('Invalid minAge format:', ageValidationRule.minAge);
      }
    }


    // Ensure maxAge and minAge are defined
    if (maxAge !== null && minAge !== null) {
      this.formData.insuredMemberDetails.forEach((member: any) => {
        console.log(member);

        let memberAge: number | null = null;
        if (typeof member.memberAge === 'string') {
          if (member.memberAge.includes('days')) {
            const days = parseInt(member.memberAge.replace('days', '').trim(), 10);
            memberAge = days / 365; // Convert days to approximate years
          }
          else {
            memberAge = parseInt(member.memberAge);
          }
        } else if (typeof member.memberAge === 'number') {
          memberAge = member.memberAge;
        }

        console.log(memberAge, maxAge, minAge);


        if (memberAge != null) {
          Object.keys(addOnDetailsControl?.value || {}).forEach((key: any) => {
            // Use explicit non-null assertion for maxAge and minAge
            if (member.relation === key && (memberAge! > maxAge! || memberAge! < minAge!)) {
              const memberArray = addOnDetailsControl?.get(key) as FormArray;

              memberArray.controls.forEach((formGroup: AbstractControl) => {
                if (formGroup instanceof FormGroup) {
                  Object.keys(formGroup.controls).forEach((controlName) => {
                    formGroup.get(controlName)?.disable();
                  });
                }
              });

              console.log('All controls in the FormGroup are disabled:', memberArray);
            }
          });
        }


      });
    } else {
      console.warn('MaxAge or MinAge not defined in validation rules.');
    }
  }



  memberSumInsuredValidationMethod(memberSumInsuredValidationRule: any) {
    console.log('Member Sum Insured Validation Rule Found:', memberSumInsuredValidationRule);
    console.log(this.form);

    this.form.formSections.forEach((section: any) => {
      if (section.sectionTitle == "Optional Covers") {
        section.formControls.forEach((control: any) => {
          if (control.name == 'accident') {
            control.subControls.forEach((subControl: any) => {
              if (subControl.name == 'addOnDetails') {
                subControl.innerSubControls.forEach((innerSubControl: any) => {
                  if (innerSubControl.name.includes('Son') || innerSubControl.name.includes('Daughter')) {
                    const memberRules = memberSumInsuredValidationRule.kids;
                    let maxSumInsured = memberRules.maxSumInsured;
                    let minSumInsured = memberRules.minSumInsured;
                    const matchingMember = this.formData.insuredMemberDetails.find(
                      (insuredMember: any) => innerSubControl.name === insuredMember.relation
                    );
                    if (memberRules.ageBasedRules) {
                      if (parseInt(matchingMember.memberAge) < memberRules.ageBasedRules.ageThreshold) {
                        maxSumInsured = memberRules.ageBasedRules.maxSumInsured;
                        minSumInsured = memberRules.ageBasedRules.minSumInsured;
                      }
                    }

                    innerSubControl.coreControls.forEach((coreControl: any) => {
                      if (coreControl.name == 'addOnSumInsured') {
                        coreControl.options = coreControl.options.filter((option: any) =>
                          option.value >= minSumInsured && option.value <= maxSumInsured
                        );
                      }
                    })
                  }
                  else if (innerSubControl.name != 'demoType' && innerSubControl.name != 'doneButton') {
                    console.log(memberSumInsuredValidationRule, innerSubControl);

                    const memberRules = memberSumInsuredValidationRule.adults;
                    console.log(memberRules);
                    let maxSumInsured = memberRules.maxSumInsured;
                    let minSumInsured = memberRules.minSumInsured;
                    const matchingMember = this.formData.insuredMemberDetails.find(
                      (insuredMember: any) => innerSubControl.name === insuredMember.relation
                    );


                    if (memberRules.proposerSIRule) {
                      if (matchingMember.relation === 'Self') {

                        if (matchingMember.relation === memberRules.proposerSIRule.memberName) {
                          maxSumInsured = memberRules.proposerSIRule.maxSumInsured;
                          minSumInsured = memberRules.proposerSIRule.minSumInsured;
                        }

                        console.log(matchingMember.relation)
                        innerSubControl.coreControls.forEach((coreControl: any) => {
                          console.log(coreControl);
                          if (coreControl.name == 'addOnSumInsured') {
                            coreControl.options = coreControl.options.filter((option: any) => {
                              return option.value >= minSumInsured && option.value <= maxSumInsured;
                            });
                            console.log(coreControl.options)
                          }
                        });
                      } else {
                        innerSubControl.coreControls.forEach((coreControl: any) => {
                          if (coreControl.name == 'addOnSumInsured') {
                            coreControl.options = coreControl.options.filter((option: any) =>
                              option.value >= minSumInsured && option.value <= maxSumInsured
                            );
                            console.log(coreControl.options)
                          }
                        });
                      }
                    }

                    if (memberRules.ageBasedRules) {
                      if (parseInt(matchingMember.memberAge) < memberRules.ageBasedRules.ageThreshold) {
                        maxSumInsured = memberRules.ageBasedRules.maxSumInsured;
                        minSumInsured = memberRules.ageBasedRules.minSumInsured;
                      }
                    }

                    innerSubControl.coreControls.forEach((coreControl: any) => {
                      if (coreControl.name == 'addOnSumInsured') {
                        coreControl.options = coreControl.options.filter((option: any) =>
                          option.value >= minSumInsured && option.value <= maxSumInsured
                        );
                      }
                    })
                    console.log(innerSubControl.coreControls);

                  }
                })
              }
            })
          }
        })
      }
    })
    // Proceed with applying the validation rules
    // Additional logic to be added based on further instructions
  }


  alterSumInsuredOptions(event: any, innerControl: any = null, control: any, parentControl: any = null, index: any = null, indexj: any = null, memberControl: any = null) {
    console.log("Inside alter", event, innerControl, control, parentControl, index, indexj, memberControl);
    console.log(this.dynamicFormGroup.get(parentControl.name), this.form);
    if (!memberControl.name.includes('Son') && !memberControl.name.includes('Daughter')) {
      if (innerControl.name == 'occupation') {
        const memberOccupation = (this.dynamicFormGroup.get(parentControl.name)?.get(control.name)?.get(memberControl.name) as FormArray).controls[indexj].get(innerControl.name)?.value;
        console.log(memberOccupation);
        if (JSON.parse(memberOccupation).name.toLowerCase().includes('house') || JSON.parse(memberOccupation).name == 'Retired') {
          memberControl.coreControls.forEach((coreControl: any) => {
            if (coreControl.name == 'occupationRisk') {
              const matchingOption = coreControl.options.find((option: any) =>
                option.name.toLowerCase() === JSON.parse(memberOccupation).name.toLowerCase()
              );

              if (matchingOption) {
                console.log('Found matching option:', matchingOption);
                const riskValue = JSON.stringify(matchingOption);
                console.log(riskValue);

                // You can now set the selected option or take further actions here
                const occupationRiskControl = (this.dynamicFormGroup.get(parentControl.name)
                  ?.get(control.name)?.get(memberControl.name) as FormArray).controls[indexj + 1].get('occupationRisk');

                console.log(occupationRiskControl);

                if (occupationRiskControl && riskValue) {
                  // Only proceed if the control exists
                  occupationRiskControl.setValue(riskValue);
                } else {
                  console.log('occupationRisk control does not exist!');
                }
              }
            }

            if (coreControl.name == 'addOnSumInsured') {
              // this.form.formSections.forEach((section: any) => {
              //   if (section.sectionTitle == "Optional Covers") {
              //     section.formControls.forEach((control: any) => {
              //       if (control.name == 'accident') {
              //         control.subControls.forEach((subControl: any) => {
              //           if (subControl.name == 'addOnDetails') {
              //           }
              //         })
              //       }
              //     })
              //   }
              // })
              coreControl.options = [];
              coreControl.options.push(
                {
                  "name": "3000000",
                  "label": "3000000",
                  "value": 3000000
                }
              )
            }
          })
        }
        else {
          const memberSumInsuredValidationRule = parentControl.validationRules?.find((rule: any) => rule.type === 'memberLevelSumInsured');
          const memberRules = memberSumInsuredValidationRule.adults;
          console.log(memberRules);
          let maxSumInsured = memberRules.maxSumInsured;
          let minSumInsured = memberRules.minSumInsured;
          const matchingMember = this.formData.insuredMemberDetails.find(
            (insuredMember: any) => memberControl.name === insuredMember.relation
          );
          if (memberRules.ageBasedRules) {
            if (parseInt(matchingMember.memberAge) < memberRules.ageBasedRules.ageThreshold) {
              maxSumInsured = memberRules.ageBasedRules.maxSumInsured;
              minSumInsured = memberRules.ageBasedRules.minSumInsured;
            }
          }

          memberControl.coreControls.forEach((coreControl: any) => {
            if (coreControl.name == 'addOnSumInsured') {
              coreControl.options = control.innerSubControls[0].coreControls[3].options.filter((option: any) =>
                option.value >= minSumInsured && option.value <= maxSumInsured
              );
            }
          })
          // memberControl.coreControls.forEach((coreControl: any) => {
          //   if (coreControl.name == 'addOnSumInsured') {
          //     coreControl.options = control.innerSubControls[0].coreControls[3].options;
          //   }
          // })
        }

      }
    }

  }
  mappingCoversAccordingtoMember(form: any) {
    let allCover: any = {
      covers: {}
    }
    this.formData.insuredMemberDetails.forEach((member: any, index: any) => {
      allCover.covers[member.relation] = {}
      form.formSections.forEach((section: any) => {
        section.formControls.forEach((formControl: any) => {
          if (formControl.type == "combinedCheckbox") {
            console.log(formControl);
            const optionalCoverControl = formControl.subControls?.find(
              (subControl: any) => subControl.name === "optionalCoverName"
            );

            if (optionalCoverControl && optionalCoverControl.value) {
              // Use the value of optionalCoverName as the key and assign false
              allCover.covers[member.relation][optionalCoverControl.value] = false;
            }
            console.log(this.covers, index);
            if (this.covers && this.covers[index]
              && this.covers[index].some(
                (cover: any) => cover.coverName === optionalCoverControl.value
              )) {
              allCover.covers[member.relation][optionalCoverControl.value] = true;
            }
          }
        });
      });
    })
    console.log(allCover);
    const reqData = {
      proposalNum: this.proposalNum,
      optionalCoversJson: JSON.stringify(allCover)
    }
    this.yatraService.insertoptionalcoversjson(reqData).subscribe({
      next: (res: any) => {
        if (res.isSuccess && res.data) {
          console.log(res);
        } else {
          console.error(res.message);
        }
      },
      error: (err: any) => {
        console.error(err.message, err);
      },
    });
  }
  @HostListener('document:click', ['$event.target'])
  onClickOutside(targetElement: HTMLElement): void {
    if (!this.clickedInside && this.showOptions) {
      // Close all dropdowns when clicking outside
      Object.keys(this.showOptions).forEach((controlName) => {
        Object.keys(this.showOptions[controlName]).forEach((key: any) => {
          this.showOptions[controlName][key] = false;
        });
      });
    }
    this.clickedInside = false;
  }
  stopPropagation(event: Event): void {
    // Prevent the click event from propagating to the document
    event.stopPropagation();
  }

  calculatePremium() {
    console.log(this.dynamicFormGroup.valid, this.dynamicFormGroup);
    if (!this.dynamicFormGroup.valid) {
      Object.keys(this.dynamicFormGroup.controls).forEach(field => {
        const control = this.dynamicFormGroup.get(field);
        if (control instanceof FormArray) {
          control.controls.forEach(arrayControl => {
            if (arrayControl instanceof FormGroup) {
              Object.keys(arrayControl.controls).forEach(nestedField => {
                const nestedControl = arrayControl.get(nestedField);
                if (nestedControl instanceof FormGroup) {
                  nestedControl?.markAsDirty({ onlySelf: true });
                  nestedControl?.markAsTouched({ onlySelf: true });
                  Object.keys(nestedControl.controls).forEach((innerField) => {
                    const innerControl = nestedControl.get(innerField);
                    innerControl?.markAsTouched({ onlySelf: true });
                  })
                } else if (nestedControl instanceof FormArray) {
                  Object.keys(nestedControl.controls).forEach((innerField) => {
                    const innerControl = nestedControl.get(innerField);

                    if (innerControl instanceof FormArray || innerControl instanceof FormGroup) {
                      // Recursively mark inner controls as touched
                      this.markNestedControlsAsTouched(innerControl);  // You'd need to implement this function
                    } else {
                      innerControl?.markAsTouched({ onlySelf: true });
                    }
                  });
                }

                else
                  nestedControl?.markAsTouched({ onlySelf: true });
              });
            } else {
              arrayControl?.markAsTouched({ onlySelf: true });
            }
          });
        }
        else if (control instanceof FormGroup) {
          control?.markAsDirty({ onlySelf: true });
          const controlKeys = Object.keys(control.controls);

          if (controlKeys.length > 0) {
            controlKeys.forEach(key => {
              const innerControl = control.controls[key];
              if (innerControl instanceof FormGroup) {
                Object.keys(innerControl.controls).forEach((innerField) => {
                  const innControl = innerControl.get(innerField);
                  innControl?.markAsTouched({ onlySelf: true });
                })
              }
              else {
                innerControl?.markAsDirty({ onlySelf: true });
              }
            });
          }
        }
        else {
          control?.markAsTouched({ onlySelf: true });
        }
      });
      if (this.dynamicFormGroup.invalid) {
        this.toast.warning({ detail: "Warning", summary: "Please fill the mandatory fields", duration: 3000 });

        this.scrollToFirstInvalidField();
      }
      return;
    }
    else {
      console.log(this.formData.productName);

      const policyType = this.dynamicFormGroup.get('memberPolicyType')?.value;
      const insuredMembers = this.dynamicFormGroup.get('numberOfInsuredMembers')?.value;

      if (insuredMembers < 2 && policyType == 'Family Floater') {
        this.toast.warning({ detail: "Warning", summary: "Minimum of two members are required for Family Family Floater policy", duration: 3000 });
        return;
      }

      // if (this.getFormIndexValue() == 0 && this.formData.productName.includes('Activ Care') && this.dynamicFormGroup.get('memberPolicyType')?.value == 'Multi Individual') {
      //   const insuredMemberDetails = this.dynamicFormGroup.get('insuredMemberDetails') as FormArray;
      //   const ageFlag = insuredMemberDetails.controls.every((person: any) => {
      //     return parseInt(this.calculateAge(person.get('memberdob').value)) >= 55;  // Compare to number 55, not string '55'
      //   });
      //   if (!ageFlag) {
      //     insuredMemberDetails.controls.forEach((control: any, i: number) => {
      //       const memberdobControl = control.get('memberdob');
      //       if (memberdobControl) {
      //         const age = this.calculateAge(memberdobControl.value);
      //         if (age > "55") {
      //           memberdobControl.setErrors(null);
      //         } else {
      //           memberdobControl.setValue('');
      //           memberdobControl.setErrors({ required: true });
      //           this.toast.warning({
      //             detail: 'Warning',
      //             summary: `All people are 55 years or older.`,
      //             duration: 3000
      //           });
      //         }
      //       }
      //     });
      //     return;

      //   }
      // }
      // if (this.getFormIndexValue() == 0 && this.formData.productName.includes('Activ Care') && this.dynamicFormGroup.get('memberPolicyType')?.value == 'Family Floater') {
      //   const insuredMemberDetails = this.dynamicFormGroup.get('insuredMemberDetails') as FormArray;
      //   const ageFlag = insuredMemberDetails.controls.some((person: any) => {
      //     return parseInt(this.calculateAge(person.get('memberdob').value)) >= 55;  // Compare to the number 55, not the string "55"
      //   });

      //   if (!ageFlag) {
      //     insuredMemberDetails.controls.forEach((control: any, i: number) => {
      //       const memberdobControl = control.get('memberdob');
      //       if (memberdobControl) {
      //         const age = this.calculateAge(memberdobControl.value);
      //         if (age > "55") {
      //           memberdobControl.setErrors(null);
      //         } else {
      //           memberdobControl.setValue('');
      //           memberdobControl.setErrors({ required: true });
      //           this.toast.warning({
      //             detail: 'Warning',
      //             summary: 'At least one person is 55 years or older.',
      //             duration: 3000
      //           });
      //         }
      //       }
      //     });
      //     //event.stopPropogation();
      //     return;
      //   }
      // }
      if (!this.pedWaitingPeriod && this.dynamicFormGroup.get('waitingPED') && (this.dynamicFormGroup.get('waitingPED') as FormGroup).get('waitingPeriodPED')?.value) {
        this.pedWaitingPeriod = (this.dynamicFormGroup.get('waitingPED') as FormGroup).get('waitingPeriodPED')?.value
      }
      this.formData = { ...this.formData, ...this.dynamicFormGroup.getRawValue() };
      this.changeRecalculate(false);
      this.getPremiumAmount();
    }

  }

  checkPolicyStartDate(event: any, innerControl: any, control: any, parentControl: any, index: any, indexj: any) {
    console.log(event, innerControl, control, parentControl, index, indexj);
    const formArray = this.dynamicFormGroup.get(parentControl.name) as FormArray;
    const memberGroup = formArray.at(index) as FormGroup;
    const memberGroupControlArray = memberGroup.get(control.name) as FormArray;
    const memberGroupInnerControlGroup = memberGroupControlArray.at(indexj) as FormGroup;
    console.log(memberGroupInnerControlGroup);

    const selectedYear = memberGroupInnerControlGroup.get('previousSelectYear')?.value;

    console.log(selectedYear.length);
    if (selectedYear.length == 0) {
      this.toast.warning({ detail: "Warning", summary: "Please select previous policy year", duration: 3000 });
      memberGroupInnerControlGroup.get(innerControl.name)?.setValue('');
      return;
    }
    else {
      const policyStartDate = memberGroupInnerControlGroup.get(innerControl.name)?.value;
      const currentYear = new Date().getFullYear();
      const selectedYearStart = parseInt(selectedYear.split('-')[0]);
      const selectedYearEnd = parseInt(selectedYear.split('-')[1]);

      // Convert policy start date to Date object
      const policyStartDateObj = new Date(policyStartDate);
      const policyStartYear = policyStartDateObj.getFullYear();

      console.log(policyStartYear.toString().length);

      if (policyStartYear.toString().length >= 4) {
        console.log(policyStartDateObj);

        // Check if policy start date is within the selected year range
        if (policyStartYear !== selectedYearStart) {
          this.toast.warning({
            detail: "Warning",
            summary: "Please enter a valid policy start date.",
            duration: 3000,
          });
          memberGroupInnerControlGroup.get(innerControl.name)?.setValue('');
          return;
        }

        // Check 59 days prior condition
        const today = new Date();
        const fiftyNineDaysPrior = new Date(today);
        fiftyNineDaysPrior.setDate(today.getDate() - 59); // Correctly subtract 59 days

        if (policyStartDateObj > fiftyNineDaysPrior) {
          this.toast.warning({
            detail: "Warning",
            summary: "Please enter a valid policy start date.",
            duration: 3000,
          });
          memberGroupInnerControlGroup.get(innerControl.name)?.setValue('');
          return;
        }
      }

      // If all validations pass, proceed with further processing
    }



  }

  checkPolicyEndDate(event: any, innerControl: any, control: any, parentControl: any, index: any, indexj: any) {
    const formArray = this.dynamicFormGroup.get(parentControl.name) as FormArray;
    const memberGroup = formArray.at(index) as FormGroup;
    const memberGroupControlArray = memberGroup.get(control.name) as FormArray;
    const memberGroupInnerControlGroup = memberGroupControlArray.at(indexj) as FormGroup;

    const selectedYear = memberGroupInnerControlGroup.get('previousSelectYear')?.value;

    if (!selectedYear || selectedYear.length === 0) {
      this.toast.warning({ detail: "Warning", summary: "Please select previous policy year", duration: 3000 });
      memberGroupInnerControlGroup.get(innerControl.name)?.setValue('');
      return;
    }

    const policyStartDate = memberGroupInnerControlGroup.get('previousPolicyStartDate')?.value;

    if (!policyStartDate || policyStartDate.length === 0) {
      this.toast.warning({ detail: "Warning", summary: "Please enter policy start date", duration: 3000 });
      memberGroupInnerControlGroup.get(innerControl.name)?.setValue('');
      return;
    }

    const policyEndDate = memberGroupInnerControlGroup.get(innerControl.name)?.value;

    const selectedYearStart = parseInt(selectedYear.split('-')[0]);
    const selectedYearEnd = parseInt(selectedYear.split('-')[1]);
    const currentYear = new Date().getFullYear();

    const policyStartDateObj = new Date(policyStartDate);
    const policyEndDateObj = new Date(policyEndDate);
    const policyStartYear = policyStartDateObj.getFullYear();
    const policyEndYear = policyEndDateObj.getFullYear();

    if (isNaN(policyEndDateObj.getTime())) {
      this.toast.warning({
        detail: "Warning",
        summary: "Please enter a valid policy end date.",
        duration: 3000
      });
      memberGroupInnerControlGroup.get(innerControl.name)?.setValue('');
      return;
    }

    const today = new Date();

    // Calculate the valid end date: one day before one year from the start date
    const oneDayBeforeNextYear = new Date(policyStartDateObj);
    oneDayBeforeNextYear.setFullYear(oneDayBeforeNextYear.getFullYear() + 1);
    oneDayBeforeNextYear.setDate(oneDayBeforeNextYear.getDate() - 1);

    if (policyEndYear.toString().length >= 4) {
      if (selectedYearEnd === currentYear) {
        // For current year, ensure the end date is a future date AND matches the one-day-before-one-year rule
        if (policyEndDateObj <= today) {
          this.toast.warning({
            detail: "Warning",
            summary: "Policy end date must be a future date.",
            duration: 3000
          });
          memberGroupInnerControlGroup.get(innerControl.name)?.setValue('');
          return;
        }

        if (policyEndDateObj.getTime() !== oneDayBeforeNextYear.getTime()) {
          this.toast.warning({
            detail: "Warning",
            summary: `Policy end date must be exactly one day less than one year from the start date.`,
            duration: 3000
          });
          memberGroupInnerControlGroup.get(innerControl.name)?.setValue('');
          return;
        }
      } else {
        // For non-current years, only the one-day-before-one-year rule applies
        if (policyEndDateObj.getTime() !== oneDayBeforeNextYear.getTime()) {
          this.toast.warning({
            detail: "Warning",
            summary: `Policy end date must be exactly one day less than one year from the start date.`,
            duration: 3000
          });
          memberGroupInnerControlGroup.get(innerControl.name)?.setValue('');
          return;
        }
      }
    }


  }

  setInsurerName(event: any, innerControl: any, control: any, parentControl: any, index: any, indexj: any) {
    const formArray = this.dynamicFormGroup.get(parentControl.name) as FormArray;
    const memberGroup = formArray.at(index) as FormGroup;
    const memberGroupControlArray = memberGroup.get(control.name) as FormArray;
    const memberGroupInnerControlGroup = memberGroupControlArray.at(indexj) as FormGroup;

    if (memberGroupInnerControlGroup.get(innerControl.name)?.value == 'Group') {
      memberGroupInnerControlGroup.get(innerControl.otherControlName)?.setValue('Aditya Birla Health Insurance Co. Ltd.');
      memberGroupInnerControlGroup.get(innerControl.otherControlName)?.disable();
    }
    else {
      memberGroupInnerControlGroup.get(innerControl.otherControlName)?.setValue('');
      memberGroupInnerControlGroup.get(innerControl.otherControlName)?.enable();
    }
  }

  addMoreDocument() {
    const formSections = this.form.formSections; // Assuming `formSections` is the structure of your form

    // Find the section with title "Previous Policy Documents"
    const previousPolicySection = formSections.find(
      (section: any) => section.sectionTitle === "Previous Policy Documents"
    );

    if (!previousPolicySection) {
      console.error("Previous Policy Documents section not found.");
      return;
    }

    // Traverse the formControls in the found section
    const formControls = previousPolicySection.formControls;
    if (formControls && Array.isArray(formControls)) {
      // Count the currently visible "previousPolicyDocument" controls
      const visibleDocumentsCount = formControls.filter(
        (control: any) => control.name.startsWith("previousPolicyDocument") && control.visible
      ).length;

      // Check if the limit of 8 is reached
      if (visibleDocumentsCount >= 8) {
        this.toast.warning({
          detail: "Warning",
          summary: "You cannot add more than 8 documents.",
          duration: 5000,
        });
        return;
      }

      // Find the next hidden "previousPolicyDocument" control
      const nextHiddenControl = formControls.find(
        (control: any) =>
          control.name.startsWith("previousPolicyDocument") && !control.visible
      );

      // If found, set its visibility to true
      if (nextHiddenControl) {
        nextHiddenControl.visible = true;
      } else {
        console.error("Unexpected state: No hidden control found, but limit not reached.");
      }
    } else {
      console.error("No formControls found in the section.");
    }
  }

  calculateAffiliateEmployeeDiscount(control: any) {
    const affiliateEmployeeIdValue = this.dynamicFormGroup.get('affiliateEmployeeId')?.value || null;

    this.formData = {
      ...this.formData,
      employeeId: null,
      affiliateEmployeeId: affiliateEmployeeIdValue,
    };

    this.getPremiumAmount();
    control.disabled = true;
  }


  //default addOn on portability
  // setPortabilityValidationRule(portabilityValidationRule: any, control: any) {

  //   const addOnControl = this.dynamicFormGroup.get(control.name);
  //   // const addOnCoverControl = addOnControl?.get('addOnCover');
  //   const addOnDetailsControl = addOnControl?.get('addOnDetails');

  //   this.form.formSections.forEach((section: any) => {
  //     if (section.sectionTitle == "Optional Covers") {
  //       section.formControls.forEach((control: any) => {
  //         if (control.name == 'accident') {
  //           control.subControls.forEach((subControl: any) => {
  //             if (subControl.name == 'addOnDetails') {
  //               subControl.innerSubControls.forEach((innerSubControl: any) => {
  //                 if (innerSubControl.name != 'demoType' && innerSubControl.name != 'doneButton') {
  //                   console.log(portabilityValidationRule, innerSubControl);

  //                   let maxSumInsured = portabilityValidationRule.maxSumInsured;
  //                   let minSumInsured = portabilityValidationRule.minSumInsured;
  //                   const matchingMember = this.formData.insuredMemberDetails.find(
  //                     (insuredMember: any) => innerSubControl.name === insuredMember.relation
  //                   );


  //                   // if (memberRules.proposerSIRule) {
  //                   //   if (matchingMember.relation === 'Self') {

  //                   //     if (matchingMember.relation === memberRules.proposerSIRule.memberName) {
  //                   //       maxSumInsured = memberRules.proposerSIRule.maxSumInsured;
  //                   //       minSumInsured = memberRules.proposerSIRule.minSumInsured;
  //                   //     }

  //                   //     console.log(matchingMember.relation)
  //                   //     innerSubControl.coreControls.forEach((coreControl: any) => {
  //                   //       console.log(coreControl);
  //                   //       if (coreControl.name == 'addOnSumInsured') {
  //                   //         coreControl.options = coreControl.options.filter((option: any) => {
  //                   //           return option.value >= minSumInsured && option.value <= maxSumInsured;
  //                   //         });
  //                   //         console.log(coreControl.options)
  //                   //       }
  //                   //     });
  //                   //   } else {
  //                   //     innerSubControl.coreControls.forEach((coreControl: any) => {
  //                   //       if (coreControl.name == 'addOnSumInsured') {
  //                   //         coreControl.options = coreControl.options.filter((option: any) =>
  //                   //           option.value >= minSumInsured && option.value <= maxSumInsured
  //                   //         );
  //                   //         console.log(coreControl.options)
  //                   //       }
  //                   //     });
  //                   //   }
  //                   // }

  //                   if (portabilityValidationRule.ageBasedRules) {
  //                     if (parseInt(matchingMember.memberAge) < portabilityValidationRule.ageBasedRules.ageThreshold) {
  //                       //disable the all the coreControls for that key
  //                       Object.keys(addOnDetailsControl?.value || {}).forEach((key: any) => {
  //                         // Use explicit non-null assertion for maxAge and minAge
  //                         if (matchingMember.relation === key) {
  //                           const memberArray = addOnDetailsControl?.get(key) as FormArray;

  //                           memberArray.controls.forEach((formGroup: AbstractControl) => {
  //                             if (formGroup instanceof FormGroup) {
  //                               Object.keys(formGroup.controls).forEach((controlName) => {
  //                                 formGroup.get(controlName)?.disable();
  //                               });
  //                             }
  //                           });

  //                           console.log('All controls in the FormGroup are disabled:', memberArray);
  //                         }
  //                       });
  //                     }
  //                   }

  //                   innerSubControl.coreControls.forEach((coreControl: any) => {
  //                     if (coreControl.name == 'addOnSumInsured') {
  //                       coreControl.options = coreControl.options.filter((option: any) =>
  //                         option.value >= minSumInsured && option.value <= maxSumInsured
  //                       );
  //                     }
  //                   })
  //                   console.log(innerSubControl.coreControls);

  //                 }
  //               })
  //             }
  //           })
  //         }
  //       })
  //     }
  //   })
  // }

  //default addOn on portability
  // setPortabilityValidationRule(portabilityValidationRule: any, control: any) {
  //   const addOnControl = this.dynamicFormGroup.get(control.name);
  //   const addOnDetailsControl = addOnControl?.get('addOnDetails');

  //   this.form.formSections.forEach((section: any) => {
  //     if (section.sectionTitle === "Optional Covers") {
  //       section.formControls.forEach((control: any) => {
  //         if (control.name === 'accident') {
  //           control.subControls.forEach((subControl: any) => {
  //             if (subControl.name === 'addOnDetails') {
  //               subControl.innerSubControls.forEach((innerSubControl: any) => {
  //                 if (innerSubControl.name !== 'demoType' && innerSubControl.name !== 'doneButton') {

  //                   const matchingMember = this.formData.insuredMemberDetails.find(
  //                     (insuredMember: any) => innerSubControl.name === insuredMember.relation
  //                   );

  //                   let minSumInsured = portabilityValidationRule.minSumInsured;
  //                   let maxSumInsured = portabilityValidationRule.maxSumInsured;

  //                   // Determine applicable policy rules
  //                   const policyRule = portabilityValidationRule.policyRules.find(
  //                     (rule: any) => rule.policyType === this.formData.memberPolicyType
  //                   );

  //                   if (policyRule && policyRule.ageBasedRules) {
  //                     const ageThreshold = policyRule.ageBasedRules.ageThreshold;

  //                     if (parseInt(matchingMember.memberAge) < ageThreshold) {
  //                       // Below age threshold handling
  //                       const belowThresholdRules = policyRule.ageBasedRules.belowThreshold;
  //                       if (belowThresholdRules) {
  //                         minSumInsured = belowThresholdRules.minSumInsured || minSumInsured;
  //                         maxSumInsured = belowThresholdRules.maxSumInsured || maxSumInsured;

  //                         // Disable or enable controls based on the rules
  //                         Object.keys(addOnDetailsControl?.value || {}).forEach((key: any) => {
  //                           if (matchingMember.relation === key) {
  //                             const memberArray = addOnDetailsControl?.get(key) as FormArray;

  //                             memberArray.controls.forEach((formGroup: AbstractControl) => {
  //                               if (formGroup instanceof FormGroup) {
  //                                 Object.keys(formGroup.controls).forEach((controlName) => {
  //                                   if (belowThresholdRules.disabled) {
  //                                     formGroup.get(controlName)?.disable();
  //                                   } else {
  //                                     formGroup.get(controlName)?.enable();
  //                                   }
  //                                 });
  //                               }
  //                             });
  //                           }
  //                         });
  //                       }
  //                     } else {
  //                       // Above age threshold handling
  //                       const aboveThresholdRules = policyRule.ageBasedRules.aboveThreshold;
  //                       // if (aboveThresholdRules && aboveThresholdRules.disabled) {
  //                       //   // Disable controls if applicable
  //                       //   Object.keys(addOnDetailsControl?.value || {}).forEach((key: any) => {
  //                       //     if (matchingMember.relation === key) {
  //                       //       const memberArray = addOnDetailsControl?.get(key) as FormArray;

  //                       //       memberArray.controls.forEach((formGroup: AbstractControl) => {
  //                       //         if (formGroup instanceof FormGroup) {
  //                       //           Object.keys(formGroup.controls).forEach((controlName) => {
  //                       //             formGroup.get(controlName)?.disable();
  //                       //           });
  //                       //         }
  //                       //       });
  //                       //     }
  //                       //   });
  //                       // }
  //                     }
  //                   }

  //                   // Update addOnSumInsured options based on min/max sum insured
  //                   innerSubControl.coreControls.forEach((coreControl: any) => {
  //                     if (coreControl.name === 'addOnSumInsured') {
  //                       coreControl.options = coreControl.options.filter((option: any) =>
  //                         option.value >= minSumInsured && option.value <= maxSumInsured
  //                       );
  //                     }
  //                   });
  //                 }
  //               });
  //             }
  //           });
  //         }
  //       });
  //     }
  //   });
  // }


  //updated default addOn for portability
  setPortabilityValidationRule(portabilityValidationRule: any, control: any) {
    const addOnControl = this.dynamicFormGroup.get(control.name);
    const addOnDetailsControl = addOnControl?.get('addOnDetails');

    this.form.formSections.forEach((section: any) => {
      if (section.sectionTitle === "Optional Covers") {
        section.formControls.forEach((control: any) => {
          if (control.name === 'accident') {
            control.subControls.forEach((subControl: any) => {
              if (subControl.name === 'addOnDetails') {
                subControl.innerSubControls.forEach((innerSubControl: any) => {
                  if (innerSubControl.name !== 'demoType' && innerSubControl.name !== 'doneButton') {

                    const matchingMember = this.formData.insuredMemberDetails.find(
                      (insuredMember: any) => innerSubControl.name === insuredMember.relation
                    );

                    let minSumInsured = portabilityValidationRule.minSumInsured;
                    let maxSumInsured = portabilityValidationRule.maxSumInsured;

                    // Determine applicable policy rules
                    const policyRule = portabilityValidationRule.policyRules.find(
                      (rule: any) => rule.policyType === this.formData.memberPolicyType
                    );

                    if (policyRule && policyRule.ageBasedRules) {
                      const minAgeThreshold = policyRule.ageBasedRules.minAgeThreshold;
                      const maxAgeThreshold = policyRule.ageBasedRules.maxAgeThreshold;

                      if (parseInt(matchingMember.memberAge) < minAgeThreshold) {
                        // Below min age threshold handling
                        const belowThresholdRules = policyRule.ageBasedRules.belowMinThreshold;
                        if (belowThresholdRules) {
                          minSumInsured = belowThresholdRules.minSumInsured || minSumInsured;
                          maxSumInsured = belowThresholdRules.maxSumInsured || maxSumInsured;

                          this.toggleControlState(addOnDetailsControl, matchingMember, belowThresholdRules.disabled);
                        }
                      } else if (parseInt(matchingMember.memberAge) > maxAgeThreshold) {
                        // Above max age threshold handling
                        const aboveThresholdRules = policyRule.ageBasedRules.aboveMaxThreshold;
                        if (aboveThresholdRules) {
                          this.toggleControlState(addOnDetailsControl, matchingMember, aboveThresholdRules.disabled);
                        }
                      }
                    }

                    // Update addOnSumInsured options based on min/max sum insured
                    innerSubControl.coreControls.forEach((coreControl: any) => {
                      if (coreControl.name === 'addOnSumInsured') {
                        coreControl.options = coreControl.options.filter((option: any) =>
                          option.value >= minSumInsured && option.value <= maxSumInsured
                        );
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  }

  private toggleControlState(addOnDetailsControl: any, matchingMember: any, disable: boolean) {
    Object.keys(addOnDetailsControl?.value || {}).forEach((key: any) => {
      if (matchingMember.relation === key) {
        const memberArray = addOnDetailsControl?.get(key) as FormArray;
        memberArray.controls.forEach((formGroup: AbstractControl) => {
          if (formGroup instanceof FormGroup) {
            Object.keys(formGroup.controls).forEach((controlName) => {
              if (disable) {
                formGroup.get(controlName)?.disable();
              } else {
                formGroup.get(controlName)?.enable();
              }
            });
          }
        });
      }
    });
  }



  getFlsCodeViaAgentCode(control: any) {
    const reqData = {
      agentCode: this.agentCode
    }
    console.log(reqData);
    this.yatraService.getFlsCodeViaAgentCode(reqData).subscribe({
      next: (res: any) => {
        console.log(res);
        if (res.data && Object.keys(res.data).length === 0) {
          this.toast.warning({
            detail: "Warning",
            summary: "No agentCode Found",
            duration: 5000,
          });
          return;
        }
        control.options = res.data;
      },
      error: (err: any) => {
        console.error(err);
      }
    });
  }

  //Previous Claims Information
  changePreviousCurrentPolicyDetails(dependentControl: any, visibility: any, controlName: string,
    parentControlName: string,
    controlIndex: number | null = null) {
    console.log("Changes inside current policy details", dependentControl, visibility, controlName, parentControlName, controlIndex);
    dependentControl.forEach((control: any) => {
      this.form.formSections.forEach((section: any) => {
        section.formControls.forEach((formControl: any) => {
          if (formControl.name == parentControlName && controlIndex) {
            let targetDynamicControl = JSON.parse(JSON.stringify(formControl.dynamicControls[controlIndex]));
            targetDynamicControl.forEach((innerControl: any) => {
              if (innerControl.name == control.name) {
                innerControl.visible = visibility;
                if (visibility) {
                  // let tempArrayControl = innerControl.innerArrayControl[0].map((element: any) => ({ ...element }));
                  let tempArrayControl = JSON.parse(JSON.stringify(innerControl.innerArrayControl[0]));
                  innerControl.innerArrayControl.push(tempArrayControl);

                  let formArray = this.dynamicFormGroup.get(parentControlName) as FormArray;
                  // let formArr;
                  // console.log(formArr);

                  const memberGroup = formArray.at(controlIndex - 1) as FormGroup;
                  let memberGroupControlArray = memberGroup.get(control.name) as FormArray;
                  // const memberGroupInnerControlGroup = memberGroupControlArray.at(innerSubControlIndex) as FormGroup;
                  // myFormControl = memberGroupInnerControlGroup.get(innerControl.name);
                  if (!memberGroupControlArray) {
                    let tempFormArray = this.fb.array([]);
                    memberGroup.addControl(innerControl.name, tempFormArray);
                    memberGroupControlArray = memberGroup.get(control.name) as FormArray;
                  }
                  memberGroupControlArray.push(this.initializeDynamicFormControls(tempArrayControl, 1, innerControl));
                  // if (formArr == null) {
                  //   let tempFormArray = this.fb.array([]);
                  //   this.dynamicFormGroup.addControl(formControl.name, tempFormArray);
                  //   formArr = this.dynamicFormGroup.get(formControl.name) as FormArray;
                  // }
                  // formArr.push(this.initializeDynamicFormControls(tempArrayControl, 1, formControl));
                }
                else {

                  while (innerControl.innerArrayControl.length > 1) {
                    innerControl.innerArrayControl.pop();
                  }

                  let formArray = this.dynamicFormGroup.get(parentControlName) as FormArray;
                  // let formArr;
                  // console.log(formArr);

                  const memberGroup = formArray.at(controlIndex - 1) as FormGroup;
                  memberGroup.removeControl(innerControl.name);

                  // Remove the entire FormArray from dynamicFormGroup
                  // if (this.dynamicFormGroup.contains(formControl.name)) {
                  //   this.dynamicFormGroup.removeControl(formControl.name);
                  // }
                }
              }
            })

            formControl.dynamicControls[controlIndex] = targetDynamicControl;



          }
        })
      })
    })
    console.log(this.form);

  }

  changeChronicCondition(eventValue: any, control: any) {
    console.log(eventValue);

    if (eventValue == 'Roll Over') {
      this.dynamicFormGroup.get(control.otherControlName)?.setValue('N');
      this.form.formSections.forEach((section: any) => {
        section.formControls.forEach((formControl: any) => {
          if (formControl.name == control.otherControlName) {
            formControl.visible = false;
          }
        })
      })
    }
    else {
      this.form.formSections.forEach((section: any) => {
        section.formControls.forEach((formControl: any) => {
          if (formControl.name == control.otherControlName) {
            formControl.visible = true;
          }
        })
      })
    }

  }

}
