import { ChangeDetectorRef, Component, ElementRef, Inject, Renderer2, inject } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { IDynamicControl, IForm, IFormControl, IFormSections, IOptions, ISubControl, IValidator } from 'src/app/interface/form.interface';
import { CommonService } from 'src/app/services/common.service';
import { DatePipe, DOCUMENT } from '@angular/common';
import { NgToastService } from 'ng-angular-popup';
import { EncryptionService } from 'src/app/services/encryption.service';
import { ActivatedRoute, Router } from '@angular/router';
import { tap } from 'rxjs';
import { YatraService } from './yatra.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { Root } from 'src/app/interface/FullQuote_Mapping.interface';
import { LoadingService } from 'src/app/services/loading.service';
import { LanguageService } from 'src/app/services/language.service';
declare var bootstrap: any;
import { TranslateService } from '@ngx-translate/core';
import { LeadsService } from 'src/app/leads/leads.service';
import { AesEncryptionService } from 'src/app/services/AESEncrypt.service';

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
  selectedFile: any;
  expandedCardIndex: number | null = null;
  i!: number;
  activeTab: string = 'chronic';
  expandedItem: string = '';
  selectedItem: string = '';
  bankCode: any;
  bankCity: any;
  formControls: IFormControl[] = [];

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

  premiumDetails: any[][] = [];
  taxList: number[] = [];
  discountList: number[] = [];
  netPremiumList: number[] = [];
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
  documentId: any;

  tooltipMessage: string = '';
  currentLanguage = 'en';

  constructor(private renderer: Renderer2, private el: ElementRef,
    public commonService: CommonService, private yatraService: YatraService, private router: Router, private spinner: LoadingService,
    private toast: NgToastService, private changeDetectorRef: ChangeDetectorRef,
    private encryptionService: EncryptionService, @Inject(DOCUMENT) private document: Document, private clipboard: Clipboard,
    private route: ActivatedRoute, private languageService: LanguageService, private aesEncryptService: AesEncryptionService,
    private translateService: TranslateService, private leadsService: LeadsService, private datepipe: DatePipe) {
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
    console.log(this.formSequence);

    if (localStorage.getItem('code'))
      this.Code = localStorage.getItem('code');


    if (localStorage.getItem('agentCode'))
      this.agentCode = localStorage.getItem('agentCode');
    // this.agencyCode = history.state.productData.agencyCode;
    if (history.state && history.state.productData) {
      console.log(history.state.productData);

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
      console.log(this.formData);


      if (history.state.productData.selectedAddons) {
        this.selectedAddons = history.state.productData.selectedAddons
      }

    }
    // this.getFormDataFromFormSequence(this.formSequence[this.getFormIndexValue()].formId);
    if (Object.keys(this.route.snapshot.queryParams).length) {
      this.route.queryParams.subscribe(async params => {
        console.log(params);

        const decryptedData = this.encryptionService.decrypt(params['data']);
        if (decryptedData) {
          console.log(decryptedData);

          this.agentCode = decryptedData.agentCode;
          this.partnerId = decryptedData.partnerId;
          this.productId = decryptedData.productId;
          // this.formData.proposalNumber = decryptedData.proposalNum;
          this.proposalNum = decryptedData.proposalNum;

          decryptedData.currentFormSequence = this.getFormIndexValue().toString();
          await this.yatraService.Getform(decryptedData).subscribe({
            next: (res: any) => {
              console.log(res);
              this.formSequence = JSON.parse(res.data.formConfig) || [];
              this.form = JSON.parse(res.data.jsonFormData);
              this.formData = JSON.parse(res.data.formData);

              if (this.formData) {
                const proposalRequiredDetails: {
                  totalPremium: any;
                  proposalNumber: any;
                  covers?: any;  // Make covers an optional property
                } = {
                  totalPremium: this.formData.totalPremium,
                  proposalNumber: this.proposalNum
                };

                console.log(this.formData);

                if (this.formData.covers) {
                  proposalRequiredDetails.covers = this.formData.covers;
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
                sessionStorage.setItem("proposalRequiredDetails", this.encryptionService.encrypt(proposalRequiredDetails));

              }
              console.log(this.form, this.formSequence, this.formData);

              this.initializeForm();
            },
            error: (err) => {
              console.log(err);
            }
          });
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
    console.log(this.formData)

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

    // if (sessionStorage.getItem('displayTaxList') != null) {
    //   this.displayTaxList = this.encryptionService.decrypt(sessionStorage.getItem('displayTaxList') as string);
    // }

    // if (sessionStorage.getItem('tenureAmount')) {
    //   this.tenureAmount = this.encryptionService.decrypt(sessionStorage.getItem('tenureAmount') as string)
    //   console.log(this.tenureAmount);

    // }

    if (sessionStorage.getItem('premiumAmountDetails')) {
      this.premiumAmountDetails = this.encryptionService.decrypt(sessionStorage.getItem('premiumAmountDetails') as string)
      console.log(this.premiumAmountDetails);

    }

    if (sessionStorage.getItem('addOnList')) {
      this.addOnList = this.encryptionService.decrypt(sessionStorage.getItem('addOnList') as string);
    }
    else {
      this.addOnList = [];
    }
    if (sessionStorage.getItem('proposalRequiredDetails')) {
      const proposalRequiredDetails = this.encryptionService.decrypt(sessionStorage.getItem('proposalRequiredDetails') as string);
      console.log(proposalRequiredDetails);

      // Check if proposalNumber matches
      if (proposalRequiredDetails.proposalNumber === this.formData.proposalNumber) {
        this.totalPremium = proposalRequiredDetails.totalPremium;
        this.covers = proposalRequiredDetails.covers;
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
    //   console.log(this.form);
    //   this.initializeForm();
    // }
    // else {
    //   let reqData = {
    //     "partnerId": this.partnerId,
    //     "productId": this.productId,
    //     "formId": formId
    //   }
    //   console.log(reqData);
    //   this.yatraService.Getform(reqData).subscribe({
    //     next: (res: any) => {
    //       console.log(res);
    //       this.form = JSON.parse(res.data.jsonFormData);
    //       // this.form = totalpremium;
    //       this.initializeForm();
    //     },
    //     error: (err) => {
    //       console.error(err);
    //     }
    //   })

    // }
    console.log(this.formData);
    console.log(this.partnerId, this.productId, this.formSequence);
    const reqData = {
      partnerId: this.partnerId.toString(),
      productId: this.productId.toString(),
      formId: this.formSequence.length == 0 ? "0" : this.formSequence[this.getFormIndexValue()].formId.toString(),
      proposalNum: this.proposalNum,
      agentCode: this.agentCode,
      leadId: this.quickQuoteRedirect == false ? null : this.leadNumber,
      isLead: this.quickQuoteRedirect == false ? false : true,
      currentFormSequence: this.getFormIndexValue().toString()
    }

    console.log(reqData);

    await this.yatraService.Getform(reqData).subscribe({
      next: (res: any) => {
        console.log(res);
        this.formSequence = JSON.parse(res.data.formConfig) || [];
        this.form = JSON.parse(res.data.jsonFormData);
        console.log(this.formData);

        this.formData = {
          ...this.formData,  // existing form data
          ...JSON.parse(res.data.formData)  // parsed response data
        };
        console.log(this.form, this.formSequence, this.formData);

        this.initializeForm();
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  async initializeForm() {
    console.log(this.form, this.formData);
    this.showHtmlContent = false;
    this.dynamciallyLoadCSS(this.form);
    this.form.formSections.forEach((section: any) => {
      section.formControls.forEach((control: any) => {
        // const policyindex = control.dynamicControls[0].findIndex((item:any) => item.value === this.formData.planType);
        // console.log(policyindex);
        if (control.dynamicControls) {
          console.log(control.name, control, this.formData);

          if (this.formData[control.name] && control.visible == true) {
            console.log(control.dynamicControls[0], this.formData.planType);
            if (this.formData[control.name]) {
              control.value = this.formData[control.name].length;
            }
            console.log(control.value);
            control.dynamicControls = control.dynamicControls.slice(0, 1)
            this.formData[control.name].forEach((member: any, index: number) => {
              let tempDynamicControl = control.dynamicControls[0].map((element: any) => ({ ...element }));
              console.log(tempDynamicControl);
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
        // else if (control.subControls && this.formData[control.name]) {
        //   console.log(this.formData[control.name], control);
        //   control.subControls.forEach((subControl: ISubControl) => {
        //     if (subControl.name == 'addOnDetails') {
        //       subControl.innerSubControls = subControl.innerSubControls?.slice(0, 1)
        //       this.formData['insuredMemberDetails'].forEach((member: any) => {
        //         if (subControl.innerSubControls) {
        //           let tempInnerControl = JSON.parse(JSON.stringify(subControl.innerSubControls[0]));
        //           console.log(tempInnerControl, member);
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
            if (control.name == 'proposerPincode') {
              console.log(control.value);
            }
          }
        }
      });
    });

    console.log(this.form, this.formData);
    if (this.form?.formSections) {
      this.dynamicFormGroup = this.fb.group({});
      this.form.formSections.forEach((section) => {
        section.formControls.forEach(async (control: IFormControl) => {
          if (control.dynamicControls) {
            if (control.visible == true) {
              let tempFormArray = this.fb.array([]);
              for (let i = 1; i < control.dynamicControls.length; i++) {
                tempFormArray.push(this.initializeDynamicFormControls(control.dynamicControls[i], i));
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
            //         console.log(tempInnerControl, member);
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
              console.log(control);
              if (control.subControls) {
                demoMember = control.subControls.findIndex(control => control.name === 'demoMember')
                demoTypeIndex = control.subControls.findIndex(control => control.name === 'demoType');
                doneButton = control.subControls.find(control => control.name === 'doneButton');
                console.log(control);
                control.subControls = [
                  ...control.subControls.slice(demoMember, demoMember + 1),
                  ...control.subControls.slice(demoTypeIndex, demoTypeIndex + 1), // Retain demoType
                ]; // Keep the first control (or reset)
                console.log(control);
              }
              console.log(this.formData['insuredMemberDetails']);
              this.formData['insuredMemberDetails'].forEach((member: any, index: any) => {
                console.log(member, this.formData[control.name], control);
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
                          // const arrayName = (key).charAt(0).toUpperCase() + (key).slice(1);
                          console.log(key, value);
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
                  console.log(control);
                }
              });
              control.subControls?.push(doneButton);
              console.log(control);
              this.dynamicFormGroup.addControl(control.name, this.initializeSubControls(control.subControls.slice(2)));
            }
            else {
              control.subControls.forEach((subControl: ISubControl) => {
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


                  console.log(subControl.innerSubControls);


                  this.formData['insuredMemberDetails'].forEach((member: any) => {
                    if (subControl.innerSubControls) {
                      let tempInnerControl = JSON.parse(JSON.stringify(subControl.innerSubControls[0]));
                      console.log(tempInnerControl, member);

                      const tempRelationshipType = JSON.parse(member.relationshipType);
                      tempInnerControl.label = tempRelationshipType.value;
                      tempInnerControl.name = tempRelationshipType.value;
                      if (subControl.conditionCheck) {
                        tempInnerControl.coreControls.forEach((corecontrol: any, index: any) => {
                          if (corecontrol.dependentControls && this.formData[control.name]) {
                            const newvalue = this.formData[control.name][subControl.name][tempRelationshipType.value][index][corecontrol.name];
                            corecontrol.dependentControls.forEach((question: any) => {
                              let newcontrol = tempInnerControl.coreControls.find((item: any) => item.name == question)
                              newcontrol.visible = newvalue;
                              console.log(corecontrol.name, question, newcontrol, newvalue);
                            })
                            console.log(this.formData[control.name][subControl.name][tempRelationshipType.value][index][corecontrol.name], control, subControl, tempRelationshipType.value, index, corecontrol);
                          }
                        })
                      }
                      subControl.innerSubControls?.push(tempInnerControl);
                    }
                  });
                  subControl.innerSubControls?.push(doneButton);
                }
              });
            }

            console.log(this.initializeSubControls(control.subControls));

            this.dynamicFormGroup.addControl(control.name, this.initializeSubControls(control.subControls));
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
            if (['text', 'email', 'password', 'number', 'date', 'summary'].includes(control.type) && control.methodName) {
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
              }

              console.log(this.form, control.value, this.isQuote, control.name);

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
              else if (control.value != "" && this.isQuote === true && control.methodName) {
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

            if (control.type == 'radio') {

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
                      console.log(this.selectedIndex, this.formData);
                    }
                  });
                });
              })
            }

            if (control.name == 'totalPremium' && this.totalPremium != 0) {
              console.log(this.totalPremium);
              this.dynamicFormGroup.addControl(control.name, new FormControl(this.totalPremium, controlValidators));
            }
            else
              this.dynamicFormGroup.addControl(control.name, new FormControl(control.value, controlValidators));

            if (control.name == 'memberDobProposer') {
              console.log(control, this.dynamicFormGroup.get(control.name));
            }
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
      this.dynamicFormGroup.addControl('leadNumber', new FormControl(this.leadnumber));
      //dynamic css
      // this.showHtmlContent = true;
      console.log(this.form);
      console.log(this.dynamicFormGroup.value, this.formData);



      this.flattenObject(this.formData);
      this.spinner.hide();
    }
    console.log(this.dynamicFormGroup, this.formData);


    if (this.formSequence[this.getFormIndexValue()].formName == "Confirmation") {
      //this.customerFeedbackModule.show();
      this.isFeedBackModalVisible = true;
    }

    // if (this.quickQuoteRedirect) {
    //   this.getLeadInformation();
    // }

  }

  initializeSubControls(subControls: any, controlGroup: any = null) {
    console.log(subControls, controlGroup);
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
            console.log(control.innerArrayControl);
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
          this.callMethod(subControls.getAllOption, subControls);
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
      // return new FormControl(subControls.value,controlValidators);
    }



    return formGroup;
  }

  initializeDynamicFormControls(dynamicFormControls: any, index: any = null) {

    let formGroup: any = this.fb.group({})
    dynamicFormControls.forEach((control: IDynamicControl) => {
      if (control.subControls) {
        let tempFormArray = this.fb.array([]);
        // for (let i = 0; i < control.subControls.length; i++) {
        //   tempFormArray.push(this.initializeSubControls(control.subControls[i]))
        // }
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

        if (control.name == 'memberIndex' && index != null) {
          control.value = index - 1;
        }

        if (control.type == 'text' && control.methodName) {
          this.resolveMethod(control.methodName, control, index);
          console.log(control.methodName, this.form);

        }
        if (control.type == 'radio' && control.radioOptions) {
          let initialValue = control.radioOptions.find((option) => option.selected === true)?.value;
          formGroup.addControl(control.name, new FormControl(initialValue, controlValidators));
        }
        else {
          formGroup.addControl(control.name, new FormControl(control.value, controlValidators));
        }
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

  getValidationErrors(control: IFormControl | IDynamicControl | ISubControl, parentControl: IFormControl | ISubControl | null = null, index: number | null = null,
    subControl: any | null = null,
    innerControl: any | null = null,
    innerSubControl: any | null = null
  ): string {
    let myFormControl: any;
    if (innerControl != null && innerSubControl != null) {
      myFormControl = parentControl != null && index != null ? ((((this.dynamicFormGroup.get(innerSubControl.name) as FormGroup)?.controls[parentControl.name] as FormGroup)
        .controls[subControl.name] as FormArray).controls[index] as FormGroup)
        .controls[innerControl.name].get(control.name) : this.dynamicFormGroup.get(innerSubControl.name);
    }
    else if (subControl != null && index != null) {
      myFormControl = parentControl != null && index != null ? ((this.dynamicFormGroup.get(subControl.name) as FormGroup)?.controls[parentControl.name] as FormArray).controls[index].get(control.name)
        : this.dynamicFormGroup.get(control.name);
    }
    else {
      myFormControl = parentControl != null && index != null ? (this.dynamicFormGroup.get(parentControl.name) as FormArray).controls[index].get(control.name) : this.dynamicFormGroup.get(control.name)
    }
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
    parentControl: IFormControl | null = null,
    index: number | null = null, subControl: any | null = null,
    innerControl: any | null = null,
    innerSubControl: any | null = null
  ): boolean {
    // console.log(control, parentControl, index, subControl, innerControl, innerSubControl);
    let myControl: AbstractControl | null;
    if (innerControl != null && innerSubControl != null && parentControl != null && index != null) {
      const parentArray = this.dynamicFormGroup.get(control.name) as FormGroup;
      const parentArray1 = parentArray.controls[parentControl.name] as FormGroup;
      const parentArray2 = parentArray1.controls[subControl.name] as FormArray;
      const parentArray3 = parentArray2.controls[index] as FormGroup;

      myControl = parentArray3.controls[innerControl.name].get(innerSubControl.name);
    }
    else if (subControl != null && parentControl != null && index != null) {
      const parentArray = this.dynamicFormGroup.get(control.name) as FormGroup;
      const parentArray1 = parentArray.controls[parentControl.name] as FormArray;
      const parentArray2 = parentArray1.controls[index] as FormGroup;

      myControl = parentArray2.get(subControl.name);
    }
    else if (parentControl != null && index != null) {
      const parentArray = this.dynamicFormGroup.get(parentControl.name) as FormArray;
      myControl = parentArray.controls[index].get(control.name);
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

  onCheckboxSelect(controlName: string) {
    const control = this.dynamicFormGroup.get(controlName);
    console.log(control);
    if (control) {
      control.markAsTouched();
      control.updateValueAndValidity();
    }
  }

  hasAnyValue(control: IFormControl | IDynamicControl, parentControl: IFormControl | null = null, index: number | null = null): boolean {
    return parentControl != null && index != null ? (this.dynamicFormGroup.get(parentControl.name) as FormArray).controls[index].get(control.name)?.value : this.dynamicFormGroup.get(control.name)?.value
  }
  hasInnerValue(control: any, parentControl: any | null = null, innerControl: any | null = null, index: any | null = null) {
    const formControl = parentControl != null && index != null ?
      ((this.dynamicFormGroup.get(control.name) as FormGroup)?.controls[parentControl.name] as FormArray).controls[index].get(innerControl.name)?.value
      : this.dynamicFormGroup.get(control.name);
    return formControl;
  }
  hasSubValue(control: any, parentControl: any | null = null, innerControl: any | null = null, innerSubControl: any | null = null, index: any | null = null) {
    console.log(control, parentControl, innerControl, innerSubControl, index, this.dynamicFormGroup);
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

  triggerFileInput(controlName: string) {
    console.log("getting called");

    const fileInputControl = this.document.getElementById(controlName);
    fileInputControl?.click();
  }

  onFileSelected(inputName: string, event: any) {
    const file = event.target.files[0];
    console.log(file);

    const maxSizeInBytes = 3 * 1024 * 1024; // 3MB
    const allowedFileTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];
    const control = this.dynamicFormGroup.get(inputName);
    console.log(control);
    if (file) {
      // Clear previous errors
      control?.setErrors(null);

      // Validate file type
      if (!allowedFileTypes.includes(file.type)) {
        console.log(allowedFileTypes);
        control?.setErrors({ fileType: true });
      }

      // Validate file size
      if (file.size > maxSizeInBytes) {
        control?.setErrors({ fileSize: true });
      }

      // If no errors, proceed to set the selected file
      if (!control?.errors) {
        this.selectedFile = file;
        control?.setValue(file.name);
      } else {
        control?.markAsTouched();
        this.selectedFile = null;
      }


    }
  }

  uploadSelectedDocument(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      if(this.selectedButton){
      try {
        const policyNum = this.proposalNum.replace(/-/g, "");
        const formData = new FormData();
        formData.append("Files", this.selectedFile);
        formData.append("UniqueNumber", policyNum);
        this.commonService.uploadDocument(formData).subscribe(
          async (res: any) => {
            if (res.isSuccess) {
              console.log("response after success", res);
              console.log("unique id", res.data.uploadResponse[0].globalId);
              this.documentId = res.data.uploadResponse[0].globalId;

              try {
                // Await the getFullQuoteViaOfflinePayment call to ensure completion before resolving
                await this.getFullQuoteViaOfflinePayment();
                resolve(); // Resolve the promise once everything completes
              } catch (error) {
                console.error("Error in full quote generation:", error);
                reject(error); // Reject the promise to prevent further flow
              }
            } else {
              const errorMessage = "Document upload failed.";
              console.error(errorMessage, res);
              this.toast.error({
                detail: "ERROR",
                summary: errorMessage,
                duration: 3000,
              });
              reject(new Error(errorMessage));
            }

          },
          (err) => {
            console.error("Error during upload:", err);
            this.toast.error({
              detail: "Error",
              summary: err.message || "Document upload failed.",
              duration: 1500,
            });
            reject(err); // Reject the promise on upload error
          }
        );
      } catch (error) {
        console.error("Error preparing upload:", error);
        this.toast.error({
          detail: "Error",
          summary: "An unexpected error occurred while preparing the upload.",
          duration: 3000,
        });
        reject(error); // Reject the promise on preparation error
      }
    }else{
      this.toast.warning({
        detail: "WARNING",
        summary: "Please select Payment Mode.",
        duration: 3000,
      });
    }
    });
  }



  uploadPolicyDocument() {
    const insurerControl = this.dynamicFormGroup.get('getInsurerDetails');
    console.log(insurerControl?.value);


    if (this.selectedFile && insurerControl && insurerControl.value) {
      const formData = new FormData();
      formData.append('Files', this.selectedFile);
      formData.append('NameOfInsuranceCompany', insurerControl.value); // Dynamic value from the form control

      // this.spinner.show();

      this.yatraService.fetchPolicyDetailsFromFile(formData).subscribe({
        next: (response: any) => {
          console.log('File uploaded and policy details fetched:', response);
          this.toast.success({ detail: "SUCCESS", summary: response.message, duration: 3000 });
          this.spinner.hide();

          this.isPolicyDetailsFetch = true;

          if (response.data['insuredMemberDetails'].length > 0) {
            this.formData['insuredMemberDetails'] = response.data['insuredMemberDetails'];
            const insuredMembers: { [key: string]: boolean } = {};

            response.data['insuredMemberDetails'].forEach((member: any) => {
              insuredMembers[member.relation] = true;
            });

            this.formData['insuredMembers'] = insuredMembers;
            console.log(insuredMembers);

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

          console.log(this.formData);
        },
        error: (error) => {
          this.spinner.hide();
          this.toast.warning({ detail: "WARNING", summary: "Failed to fetch Policy Details", duration: 3000 });
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
    console.log(value);

    if (value.length > 10) {
      value = value.slice(0, 10);
    }

    input.value = value;
    console.log(value, subControl, control, i);
    if (subControl) {
      this.dynamicFormGroup.get(`${control.name}.${i}.${subControl.name}`)?.setValue(value);
    } else {
      this.dynamicFormGroup.get(control.name)?.setValue(value);
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
        console.log(res);
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
        console.log(res);
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
        console.log(res);
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
        console.log(res);
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
        console.log(res);
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
        console.log(res);
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
        console.log(res);
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
        console.log(res);
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
        console.log(res);
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
        console.log(res);
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
        console.log(res);
        control.options = res.data;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  getAllBankDetails(control: any) {
    if (control.options.length <= 0) {

      // }
      // else{

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
      "cityCode": "",
      "bankCode": this.bankCode
    };
    this.yatraService.getBankCity(reqData).subscribe({
      next: (res: any) => {
        console.log(res);
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
    console.log(event.target.value, data, data.id);
    this.bankCity = data.id as string;
    console.log(this.bankCity);

    const reqData = {
      "bankCode": this.bankCode,
      "cityCode": this.bankCity
    };

    console.log(reqData);
    this.yatraService.getBranchDetails(reqData).subscribe({
      next: (res: any) => {
        console.log(res);
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
  }

  memberDetailsOption(control: any) {
    if (this.formData.insuredMemberDetails) {
      const selectedValue = this.formData.insuredMemberDetails;
      // control.options = this.encryptionService.decrypt(selectedValue as string).insuredMemberDetails;
      // console.log(control.options);
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
        console.log(res);
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
    if (!/^\d{6}$/.test(enteredNumber)) {
      return false;
    }

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


  onInputChange(event: any, control: any, parentControl: any = null, index: any = null, subControl: any = null, innerControl: any = null, indexj: any = null) {
    console.log(event.target.checked, control, parentControl, index, subControl, innerControl, indexj);

    this.changesMade = true;
    let eventValue = event.target.value;
    if (["chequeNumber", "demandDraftNumber", "payOrderNumber"].includes(control.name)) {
      const enteredNumber = event.target.value;

      // Check if the cheque number is longer than 6 digits
      if (enteredNumber.length > 6) {
        event.target.value = enteredNumber.slice(0, 6);
        this.dynamicFormGroup.get(control.name)?.setValue(enteredNumber.slice(0, 6));
        this.toast.error({ detail: "ERROR", summary: "Number cannot exceed 6 digits", duration: 3000 });
      }

      // Check if the cheque number is less than 6 digits
      else if (enteredNumber.length < 6) {
        this.toast.error({ detail: "ERROR", summary: "Number must be exactly 6 digits", duration: 3000 });
      }

      // Check if the cheque number is sequential
      else if (this.isSequential(enteredNumber)) {
        this.toast.error({
          detail: "ERROR",
          summary: "Sequential or repetitive numbers are not allowed",
          duration: 3000
        });
        this.dynamicFormGroup.get(control.name)?.setValue('');
      }
    }

    if (control.name === 'idProof') {
      const idProof = JSON.parse(event.target.value);
      console.log("id proof", idProof);
      this.idProofType = idProof.value;

      const idNumberControl = this.dynamicFormGroup.get('idNo');

      switch (this.idProofType) {
        case 'Aadhar Card':
          idNumberControl?.setValidators([
            Validators.required,
            Validators.pattern('[0-9]{4}')
          ]);
          this.tooltipMessage = 'Please enter the last 4 digits of your Aadhar ID.';
          break;

        case 'Passport':
          idNumberControl?.setValidators([
            Validators.required,
            Validators.pattern('^[A-Z][0-9]{2}(?:\\s?[0-9]{5})?$')
          ]);
          this.tooltipMessage = 'Please specify Passport Number in the format: First character from (A-Z), followed by 2 numbers, an optional space, and 5 numbers.';
          break;

        case 'Voter ID':
          idNumberControl?.setValidators([
            Validators.required,
            Validators.pattern('^[A-Z]{3}[0-9]{7}$')
          ]);
          this.tooltipMessage = 'Please enter a valid Voter ID, e.g., WED1234567.';
          break;

        case 'Driving License':
          idNumberControl?.setValidators([
            Validators.required,
            Validators.pattern('^[A-Z]{2}[0-9]{2}[0-9]{4}[0-9]{7}$')
          ]);
          this.tooltipMessage = 'The first two characters should be upper-case alphabets representing the state code, followed by two digits representing the RTO code, four digits for the year, and seven digits.';
          break;

        case '10th (SSC) Mark sheet':
          idNumberControl?.setValidators([
            Validators.required,
            Validators.pattern('^[0-9]{7}$')
          ]);
          this.tooltipMessage = 'Please enter a valid SSC Marksheet number with 7 digits.';
          break;

        default:
          idNumberControl?.clearValidators();
          this.tooltipMessage = '';
      }

      idNumberControl?.updateValueAndValidity();
    }

    if (control.onChangeMethod) {

      if (control.type === 'radio') {
        const selectedValue = this.dynamicFormGroup.get(control.name)?.value;
        console.log(selectedValue);

        eventValue = selectedValue === 'yes' ? true : false;

        // Find the selected option by value
        const selectedOption = control.radioOptions.find((option: any) => option.value === selectedValue);

        // Check if the control or the selected option has dependentControls
        const dependent = control.dependentControls
          ? control.dependentControls
          : selectedOption?.dependentControls ?? control;

        // Call the resolveMethod with the found dependent controls
        this.resolveMethod(control.onChangeMethod, dependent, eventValue);
      }
      // else {
      //   // If not a radio control, just resolve using the control
      //   this.resolveMethod(control.onChangeMethod, control, eventValue);
      // }


      if (control.type === 'select') {
        const selectedValue = this.dynamicFormGroup.get(control.name)?.value;
        console.log(selectedValue);
        if (control.dependentControls) {
          this.resolveMethod(control.onChangeMethod, control, eventValue);
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

    if (parentControl == null && control.name == 'ifscCode') {
      const ifscCodeDetails = this.dynamicFormGroup.get('ifscCode')?.value.length || 0;
      console.log(ifscCodeDetails);

      if (ifscCodeDetails == 11) {
        const reqData = {
          "ifscCode": event.target.value
        }
        console.log(reqData);

        this.yatraService.getBankDetailsViaIFSC(reqData).subscribe({
          next: (response: any) => {
            if (response.isSuccess && response.data) {
              this.dynamicFormGroup.get('bankName')?.setValue(response.data.bankName || '');
              this.dynamicFormGroup.get('micrCode')?.setValue(response.data.micrCode || '');
            } else {
              // Handle error, you can show a message if required
              this.toast.warning({ detail: "WARNING", summary: 'Failed to Fetch Bank Details', duration: 3000 });
            }
          },
          error: (err) => {
            this.toast.error({ detail: "ERROR", summary: 'Failed to Fetch Bank Details', duration: 3000 });
          }
        });
      }
    }


    if (parentControl !== null && parentControl.type == 'combinedCheckbox') {
      console.log(innerControl.dependentControls, event.target.checked, control, parentControl, index, innerControl);
      this.changeMainFormDependentControls(innerControl.dependentControls, event.target.checked, control.name, parentControl.name, index, innerControl.name);
      this.changeOverLayDone(control, parentControl, false);
    }


    if (control.type === 'date' && control.dependentControls != null) {
      const dob = event.target.value;

      console.log(dob, dob.length, this.dynamicFormGroup.get(control.name));

      // Parse the DOB into a date object
      const dobArray = dob.split('-'); // [YYYY, MM, DD]
      const year = parseInt(dobArray[0]);
      const inputDate = new Date(`${dobArray[0]}-${dobArray[1]}-${dobArray[2]}`);
      const currentDate = new Date();

      let age = currentDate.getFullYear() - inputDate.getFullYear() -
        (currentDate.getMonth() < inputDate.getMonth() ||
          (currentDate.getMonth() === inputDate.getMonth() && currentDate.getDate() < inputDate.getDate()) ? 1 : 0);

      if (age < 0 && control.name === 'memberAgeProposer') {
        this.form.formSections.forEach((section: any) => {
          section.formControls.forEach((control: any) => {
            control.visible = true;
          });
        });
        this.toast.error({
          detail: 'Error',
          summary: 'Invalid Date: Age cannot be negative. Please enter a valid date.',
          duration: 3000
        });

        if (control.dependentControls) {
          control.dependentControls.forEach((depControlName: string) => {
            this.form.formSections.forEach((section: any) => {
              section.formControls.forEach((formControl: any) => {
                if (formControl.name === depControlName) {
                  formControl.visible = false; // Hide control
                  formControl.value = ''; // Clear value
                }
              });
            });
          });
        }

        return;
      }

      // Validate year range and prevent future dates
      if ((year < 1800 || inputDate > currentDate) && year.toString().length === 4) {
        this.toast.error({
          detail: 'Error',
          summary: 'Invalid Year: Please enter a valid year between 1800 and the current year',
          duration: 3000
        });

        // Clear dependent controls' values if DOB is invalid
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

        if (control.dependentControls) {
          control.dependentControls.forEach((depControlName: string) => {
            this.form.formSections.forEach((section: any) => {
              section.formControls.forEach((formControl: any) => {
                if (formControl.name === depControlName) {
                  formControl.visible = false; // Hide control
                  formControl.value = ''; // Clear value
                }
              });
            });
          });
        }

        return;
      }

      if (control.dependentControls && control.name !== 'memberAgeProposer') {
        control.dependentControls.forEach((depControlName: string) => {
          this.form.formSections.forEach((section: any) => {
            section.formControls.forEach((formControl: any) => {
              if (formControl.name === depControlName) {
                if (age < 18) {
                  formControl.visible = true;
                } else {
                  // formControl.visible = false;
                  formControl.value = '';
                }
              }
            });
          });
        });
      }

      if (control.name === 'nomineeDob' && control.dependentControls) {
        this.form.formSections.forEach((section: any) => {
          section.formControls.forEach((formControl: any) => {
            if (control.dependentControls.includes(formControl.name)) {
              if (age < 18) {
                formControl.visible = true;
              } else {
                formControl.visible = false;
              }
            }
          });
        });
      }
      if (parentControl != null && index != null) {
        const ageControl = this.dynamicFormGroup.get(parentControl.name);
        if (ageControl) {
          ageControl.value[index][control.dependentControls[0]] = age;
          (ageControl as FormArray).controls[index].get(control.dependentControls[0])?.markAsTouched();
          this.dynamicFormGroup.get(parentControl.name)?.patchValue(ageControl.value);
        }
      } else {
        const ageControl = this.dynamicFormGroup.get(control.dependentControls[0]);
        if (dob && ageControl) {
          ageControl.markAsTouched();
          ageControl.setValue(age); // Set the calculated age value directly
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
      }
    }


    if (parentControl == null && control.name == 'proposerPincode') {

      const pinCodeLength = this.dynamicFormGroup.get('proposerPincode')?.value.length || 0;

      if (pinCodeLength === 6) {
        const reqData = {
          "pincode": event.target.value
        }

        this.commonService.getPinCodeByCity(reqData).subscribe({
          next: (res) => {
            console.log(res);
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
                      control.options = [];
                      res.data.upgradableZones?.forEach((zoneOption: any) => {
                        control.options.push({
                          name: zoneOption.zone,
                          value: zoneOption.zoneCode
                        });
                      });
                      // control.visible = true;
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

      console.log(parentControl.dynamicControls);


      // parentControl.dynamicControls.forEach((dynamicControls: IDynamicControl[]) => {
      parentControl.dynamicControls[index + 1].forEach((dynamicControl: IDynamicControl) => {
        if (dynamicControl.name == 'pincode' && dynamicControl.name == control.name) {
          const reqdata = {
            "pincode": event.target.value
          }
          // this.spinner.show();
          this.commonService.getPinCodeByCity(reqdata).subscribe({
            next: (res: any) => {
              console.log(res, res.data)

              if (res.isSuccess && res.data) {

                if (res.data.upgradableZones.length > 0) {
                  const zoneOptions = res.data.upgradableZones.map((zone: any) => ({
                    name: zone.zone,   // Zone name
                    value: zone.zoneCode, // Zone code
                  }));

                  parentControl.dynamicControls[index + 1].forEach((dynamicControl: IDynamicControl) => {
                    if (dynamicControl.name == 'zoneValue') {
                      dynamicControl.options = zoneOptions;
                    }
                  });
                  (this.dynamicFormGroup.get(parentControl.name) as FormArray).controls[index].get('upgradableZones')?.setValue(zoneOptions);
                }

                console.log(this.dynamicFormGroup.get(parentControl.name));

                (this.dynamicFormGroup.get(parentControl.name) as FormArray).controls[index].get('zoneValue')?.setValue(res.data.zoneValue);
                (this.dynamicFormGroup.get(parentControl.name) as FormArray).controls[index].get('zone')?.setValue(res.data.zone);



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
              this.toast.warning({ detail: "WARNING", summary: err, duration: 3000 });
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
  }


  // calculateAge(dob: string): number {
  //   const today = new Date();
  //   const birthDate = new Date(dob);
  //   if (isNaN(birthDate.getTime())) {
  //     console.error('Invalid date format');
  //     return 0; // Or handle it according to your application's needs
  //   }
  //   let age = today.getFullYear() - birthDate.getFullYear();
  //   const monthDifference = today.getMonth() - birthDate.getMonth();
  //   if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
  //     age--;
  //   }
  //   return age;
  // }

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
        return 'invalid'; // Less than 91 days is not valid
      }
      return `${diffInDays}days`; // Return age in 'days' format
    }

    return `${age}`;
  }

  // async resolveMethod(methodName: string, ...args: any[]): Promise<void> {
  //   console.log(methodName);
  //   let filteredArgs = args.filter(arg => arg !== undefined && arg !== null);

  //   if (methodName == 'addOrRemoveAdditionalInsuredMember') {
  //     filteredArgs = filteredArgs.slice(-1);

  //   } else if (filteredArgs[filteredArgs.length - 1] == 'add' || filteredArgs[filteredArgs.length - 1] == 'remove') {
  //     filteredArgs.pop();
  //   }

  //   console.log(filteredArgs);

  //   const method = (this as any)[methodName] as Function;
  //   if (method && typeof method === 'function') {
  //     // method.bind(this)(...filteredArgs);
  //     await Promise.resolve(method.bind(this)(...filteredArgs));
  //     if (methodName == 'getProposerRelationship') {
  //       console.log("blehhhh");

  //     }
  //   } else {
  //     console.error(`Method ${methodName} not found`);
  //   }
  // }

  async resolveMethod(methodName: string, ...args: any[]): Promise<void> {
    console.log(methodName);

    // Filter out undefined and null arguments
    let filteredArgs = args.filter(arg => arg !== undefined && arg !== null);

    // Specific logic for handling certain method names
    if (methodName === 'addOrRemoveAdditionalInsuredMember') {
      filteredArgs = filteredArgs.slice(-1);
    } else if (filteredArgs[filteredArgs.length - 1] === 'add' || filteredArgs[filteredArgs.length - 1] === 'remove') {
      filteredArgs.pop();
    }

    console.log(filteredArgs);

    // Resolve the method dynamically
    const method = (this as any)[methodName] as Function;
    if (method && typeof method === 'function') {
      try {
        // Call the method with filtered arguments
        const result = method.bind(this)(...filteredArgs);
        if (methodName == 'uploadSelectedDocument')
          console.log("ansjnjasnj");


        // If the result is a Promise, await it; otherwise, wrap it in Promise.resolve()
        if (result && typeof result.then === 'function') {
          await result; // It's already a Promise, so await it
        } else {
          await Promise.resolve(result); // Wrap non-Promise results into a Promise
        }

        // Example logic specific to 'getProposerRelationship'
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



  handlePolicyTypeChange(control: any, planType: string | null = null): void {
    // const sumInsuredControl = this.dynamicFormGroup.get('memberSumInsured');
    // const pincodeControl = this.dynamicFormGroup.get('pincode');
    // if (sumInsuredControl || pincodeControl) {
    console.log(this.form);
    console.log(planType, control);

    if (planType == null)
      planType = control.value;
    console.log(control);
    setTimeout(() => {

      this.form.formSections.forEach((section: any) => {
        section.formControls.forEach((formControl: any) => {
          if (formControl.name == 'insuredMembers') {
            console.log(this.formData, this.form);

            if (((this.formData.productType == 'GHS' || this.formData.productType == 'AS') && formControl.selectCheckboxOptions?.length == 0) || (this.formData.productType != 'GHS' && this.formData.productType != 'AS')) {
              console.log(planType);

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
    console.log(this.form, control, planType);

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
      console.log(this.form);

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

  setupRelationshipTypeValidation(childControl: IFormControl, index: any) {
    console.log("inside setupRelationshipTypeValidation");
    const eventValue = childControl.value;
    console.log(eventValue, index);

    this.form.formSections.forEach((section: any) => {
      section.formControls.forEach((formControl: any) => {
        if (formControl.dynamicControls && formControl.visible) {
          console.log(formControl);

          // Check if dynamicControls[index] exists
          if (formControl.dynamicControls[index]) {
            formControl.dynamicControls[index].forEach((control: any) => {
              if (control.name == childControl.otherControlName) {
                if (control.validators && childControl.validationRules) {
                  // Create a new array for validators to avoid mutating the original
                  const newValidators: IValidator[] = control.validators.filter(
                    (val: IValidator) => val.validatorName === 'required'
                  );

                  // Determine the appropriate validation rule based on eventValue
                  let rule;
                  if (/^son\d*$/i.test(eventValue) || /^daughter\d*$/i.test(eventValue)) {
                    rule = childControl.validationRules.find((rule: any) => rule.type === 'child');
                  } else {
                    rule = childControl.validationRules.find((rule: any) => rule.type === 'adult');
                  }

                  console.log(rule);
                  if (rule) {
                    newValidators.push(rule);
                  }

                  // Assign the new validators array to the control
                  control.validators = newValidators;
                }
              }
            });
          }

          console.log(formControl);
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
    index += 1;
    if ((index <= 4 && this.dynamicFormGroup.get('memberPolicyType')?.value == 'Family Floater') || this.dynamicFormGroup.get('memberPolicyType')?.value == 'Multi Individual' || this.dynamicFormGroup.get('memberPolicyType')?.value == 'Individual') {
      const baseName = option.value.replace(/\d+$/, '');
      const newControlName = baseName + index;

      // Add the new control with a unique name
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

  //     console.log(reqData);

  //     // Calling the API service
  //     this.service.GetProposerRelationships(reqData).subscribe({
  //       next: (res) => {
  //         console.log(res, "API Response Received");

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
  //         console.log(this.isQuote);

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
  //         console.log(this.formData, this.form);



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

      console.log(reqData);

      // API call wrapped in pipe
      this.yatraService.GetProposerRelationships(reqData).pipe(
        tap((res: any) => {
          console.log(res, "API Response Received");

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
          console.log(this.isQuote, this.isPolicyDetailsFetch, control);

          if (this.isQuote || this.isPolicyDetailsFetch) {

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

            console.log(formDataRelations);

            // Merge API and formData relations
            const mergedOptions = [...res.data.relationShip, ...formDataRelations];

            console.log(mergedOptions)

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

            console.log(groupedRelations);


            // Ensure each option has a unique `id` and update `isIncrement` logic
            Object.values(groupedRelations).forEach((group) => {
              group.forEach((relation, idx) => {
                // Only the last member in the group gets the increment button
                relation.isIncrement = idx === group.length - 1;
              });
            });

            console.log(mergedOptions);


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

            console.log(control);

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

          console.log(this.formData, this.form);
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
        console.log(hasAtLeastOneSelected);

        return hasAtLeastOneSelected ? null : { required: true };
      }
      else if (controlGroup && this.dynamicFormGroup.get('memberPolicyType')?.value == 'Family Floater') {
        const selectedCount = Object.keys(controlGroup.controls).filter(
          key => controlGroup.controls[key].value === true
        ).length;
        console.log(selectedCount);

        if (selectedCount < 2) {
          return { required: true };
        }
      }
      return null;
    };
  }

  logSelection(event: Event | null, option: any, controls: any) {
    // const checkbox = event.target as HTMLInputElement;
    // console.log(this.kidCount,option);
    if (event != null) {
      this.isQuote = false;
    }
    const checkbox = event ? (event.target as HTMLInputElement) : { checked: true };
    console.log(checkbox);

    if (this.kidCount >= 4 && checkbox.checked && this.dynamicFormGroup.get('memberPolicyType')?.value == 'Family Floater') {
      this.toast.warning({ detail: "WARNING", summary: "Cannot select more than 4 childrens", duration: 3000 });
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
              console.log(option);

              if (option.value.includes('Son') || option.value.includes('Daughter')) {
                this.kidCount++;
              }
              formsection.visible = true;
              if (this.isQuote == true && this.isPolicyDetailsFetch) {
                formControl.dynamicControls = formControl.dynamicControls.slice(0, 1);
                console.log(this.form, this.dynamicFormGroup.value);
                this.isQuote = false;
              }
              let tempControl = formControl.dynamicControls[0].map((element: any) => ({ ...element }));
              tempControl[1].value = option.value;
              tempControl[0].value = JSON.stringify(option);
              if (this.isQuote) {
                tempControl.forEach((temp) => {
                  if (temp.name == 'zoneValue') {
                    temp.options = this.formData['upgradableZones'];
                  }
                })
              }
              formControl.dynamicControls?.push(tempControl);
              console.log(this.formData);

              let formArr = this.dynamicFormGroup.get(controls.idProperty) as FormArray;
              // let formArr;

              if (formArr != null) {
                formArr = this.dynamicFormGroup.get(controls.idProperty) as FormArray;
                formArr.push(this.initializeDynamicFormControls(tempControl, formControl.dynamicControls.length - 1));
              }
              else {
                formArr = this.fb.array([]);
                formArr.push(this.initializeDynamicFormControls(tempControl, formControl.dynamicControls.length - 1));
                this.dynamicFormGroup.addControl(controls.idProperty, formArr);
              }



              if (checkbox.checked == true && option.value == 'Self') {
                // let index = formControl.dynamicControls?.findIndex((element:any) => JSON.parse(element[0].value)?.value == option.value);
                let index = -1;
                let memberupgradableZones: IOptions[] = [];
                if (formControl.dynamicControls) {
                  for (let i = 0; i < formControl.dynamicControls.length; i++) {
                    let element = formControl.dynamicControls[i];
                    try {
                      console.log(element[0]);

                      let parsedValue = JSON.parse(element[0].value);
                      if (parsedValue.value === option.value) {
                        element.forEach((control: any) => {
                          if (control.name == 'memberdob' || control.name == 'memberAge' || control.name == 'memberGender' || control.name == 'emailId' || control.name == 'firstName' || control.name == 'lastName' || control.name == 'sumInsured') {
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
                (this.dynamicFormGroup.get(controls.idProperty) as FormArray)?.controls[index - 1].get('memberGender')?.setValue(this.dynamicFormGroup.get('proposerGender')?.value);
                (this.dynamicFormGroup.get(controls.idProperty) as FormArray)?.controls[index - 1].get('pincode')?.setValue(this.dynamicFormGroup.get('proposerPincode')?.value);
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
                console.log(memberupgradableZones);

                (this.dynamicFormGroup.get(controls.idProperty) as FormArray)?.controls[index - 1].get('upgradableZones')?.setValue(memberupgradableZones);

                console.log(this.dynamicFormGroup.value);


              }
              console.log(this.dynamicFormGroup.get('memberPolicyType')?.value);

              if (this.dynamicFormGroup.get('memberPolicyType')?.value == 'Family Floater') {
                console.log((this.dynamicFormGroup.get(controls.idProperty) as FormArray));

                (this.dynamicFormGroup.get(controls.idProperty) as FormArray)?.controls.forEach((control: any) => {
                  control.get('sumInsured')?.setValue(this.dynamicFormGroup.get('sumInsured')?.value);
                })
              }
              console.log(typeof this.dynamicFormGroup.get('numberOfInsuredMembers')?.value, this.dynamicFormGroup.get('numberOfInsuredMembers')?.value);

              this.dynamicFormGroup.get('numberOfInsuredMembers')?.setValue(this.dynamicFormGroup.get('numberOfInsuredMembers')?.value + 1);
            }

          }
          // else if (checkbox.checked == false) {

          //   if (formControl.name == controls.idProperty && formControl.dynamicControls && formControl.visible == true) {
          //     if (option.value.includes('Son') || option.value.includes('Daughter')) {
          //       this.kidCount--;
          //     }
          //     let index = formControl.dynamicControls?.findIndex((element: any) =>
          //       element[1].value == option.value);
          //     if (index !== undefined && index !== -1) {
          //       formControl.dynamicControls?.splice(index, 1);
          //       let formArr = this.dynamicFormGroup.get(controls.idProperty) as FormArray;
          //       formArr.removeAt(index - 1);
          //       if (formArr.length == 0) {
          //         formsection.visible = false;
          //       }
          //       Object.keys(this.formData).forEach(key => {
          //         if (key.startsWith(`${controls.idProperty}.${index - 1}.`)) {
          //           delete this.formData[key];
          //         }
          //         if (key.includes(option.value)) {
          //           delete this.formData[key]
          //         }
          //       });
          //     }
          //     console.log(this.formData);
          //     this.dynamicFormGroup.get('numberOfInsuredMembers')?.setValue(this.dynamicFormGroup.get('numberOfInsuredMembers')?.value - 1);
          //   }
          //   // else if(formControl){
          //   //   Object.keys(this.formData).forEach(key => {
          //   //     if (key.startsWith(`${controls.idProperty}.${index - 1}.`)) {
          //   //       delete this.formData[key];
          //   //     }
          //   //   });
          //   // }

          // }
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

                console.log(this.formData);

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
        // console.log(this.addCustomValidation());

        insuredMembersFormGroup.updateValueAndValidity();
        console.log(this.dynamicFormGroup.get('insuredMembers'));

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
    console.log(this.selectedButton);

    const paymentModeControl = this.dynamicFormGroup.get('paymentMode');
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
                controlToHide.visible = false; // Hide dependent controls for offline
              }
            });
          }
        });
      });
    }
    // Handle the Juspay redirection for buttons other than Offline
    if (this.selectedButton !== 'offline') {
      const reqData = {
        agentcode: this.agentCode,
        proposalNumber: this.proposalNum,
        paymentMethod: this.selectedButton,
        source: 'Retail',
        policyType: 'New Business',
        policyNumber: '',
        quoteNumber: '',
        OrderID: ''
      };
      this.yatraService.justPayRedirection(reqData).subscribe({
        next: (response: any) => {
          console.log('Juspay API Response:', response);

          if (response.data.paymentURL && response.data.paymentURL !== null && response.data.paymentURL !== '') {
            if (this.selectedButton == 'sendLinkButton') {
              console.log(response);
              this.dynamicFormGroup.get(control.dependentControls[0])?.setValue(response.data.paymentURL);
              // res = response.data.paymentURL;
            }
            else {
              window.location.href = response.data.paymentURL; // Redirect to Juspay Payment URL
            }
          } else {
            this.toast.warning({ detail: "WARNING", summary: "Invalid payment link received", duration: 3000 });
            console.error('Invalid payment link received:', response);
          }
        },
        error: (error) => {
          this.toast.error({ detail: "ERROR", summary: "Failed to generate payment link", duration: 3000 });
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
              control.disabled = true;
              const formControl = this.dynamicFormGroup.get(controls.name);
              if (formControl) {
                formControl.enable();
                if (controls.validators) {
                  const validators = controls.validators.map((val: any) => {
                    if (val.validatorName === 'required') {
                      return Validators.required;
                    }
                    return null;
                  }).filter(Boolean);
                  formControl.setValidators(validators);
                  formControl.updateValueAndValidity();
                }
              }
            }
          });
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

  // In your template, you can bind the class dynamically
  getButtonClass(control: any): string {
    return this.selectedButton === control.name ? 'active-button' : '';
  }
  async onSubmit() {
    this.changesMade = false;
    console.log(this.dynamicFormGroup.value, this.dynamicFormGroup, this.form);

    if (this.dynamicFormGroup.get('numberOfInsuredMembers')?.value < 2 && this.dynamicFormGroup.get('memberPolicyType')?.value == 'Family Floater') {
      this.toast.warning({ detail: "WARNING", summary: "Minimum of two members are required for Family Family Floater policy", duration: 3000 });
      return;
    }
    else {
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
              (this.dynamicFormGroup.get('insuredMemberDetails') as FormArray)?.controls[index].get('productMemberDesignation')?.setValue(JSON.parse(this.dynamicFormGroup.get('occupation')?.value).value);
            }
          })
        }
        console.log(this.dynamicFormGroup.value);

        const proposalRequiredDetails = {
          totalPremium: this.dynamicFormGroup.value.totalPremium,
          proposalNumber: this.proposalNum,
          covers: this.covers
        };

        console.log(proposalRequiredDetails, this.dynamicFormGroup.value);

        sessionStorage.setItem("proposalRequiredDetails", this.encryptionService.encrypt(proposalRequiredDetails));
        const tempPremiumAmount = this.dynamicFormGroup.value.totalPremium;
        console.log(tempPremiumAmount);

        this.dynamicFormGroup.get('totalPremium')?.setValue(tempPremiumAmount);
        this.dynamicFormGroup.get('covers')?.setValue(this.covers);
        this.dynamicFormGroup.get('tenureAmount')?.setValue(this.tenureAmount);
        this.dynamicFormGroup.get('tenure')?.setValue(this.formData.tenure);
        this.dynamicFormGroup.get('quoteIdDetails')?.setValue(this.QuoteNumber);
        this.dynamicFormGroup.get('quoteId')?.setValue(this.formData.quoteId);
        this.dynamicFormGroup.get('displayTaxList')?.setValue(this.displayTaxList);

        // console.log((this.dynamicFormGroup.get('insuredMemberDetails') as FormArray)?.controls);

        // (this.dynamicFormGroup.get('insuredMemberDetails') as FormArray)?.controls.forEach((memberGroup:any,index: number)=>{
        //   memberGroup.get('covers')?.setValue(this.covers[index]);
        // })

        console.log(this.dynamicFormGroup.value);


        // if(this.dynamicFormGroup.value.tenureAmount){
        //   this.dynamicFormGroup.value.tenureAmount = this.tenureAmount;
        // }
        // if(this.dynamicFormGroup.value.displayTaxList){
        //   this.dynamicFormGroup.value.displayTaxList = this.displayTaxList;
        // }
        // this.saveData = JSON.parse(JSON.stringify(this.dynamicFormGroup.value));
        // this.flattenObjectInsert(this.saveData);
        // console.log(this.dynamicFormGroup.value,this.saveData);

        this.formData = { ...this.formData, ...this.dynamicFormGroup.value };
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
          this.mappingForQuestionnaire(this.form);
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
          //   console.log('Waiting for fullQuote API response before proceeding...');
          //   await this.uploadSelectedDocument();
          // } else {
          console.log('Proceeding without waiting for fullQuote API');
          await this.resolveMethod(this.form.saveBtnFunction);
          // }
        }
        console.log(this.formData);
        sessionStorage.setItem("allFormData", this.encryptionService.encrypt(this.formData));
        sessionStorage.setItem("allJsonForm", this.encryptionService.encrypt(this.allJsonForm));

        if (this.form.formTitle.includes("Total Premium")) {
          sessionStorage.setItem("addOnList", this.encryptionService.encrypt(this.addOnList));
          sessionStorage.setItem("addOnDetails", this.encryptionService.encrypt(this.addOnDetails));
          sessionStorage.setItem('tenureAmount', this.encryptionService.encrypt(this.tenureAmount));

          console.log(this.QuoteNumber, this.selectedIndex);
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
              console.log(this.form, this.formData);


            }
          }
        }
        //   // for Store Form Data in Database
        let reqData = {
          "proposalNum": this?.formData?.proposalNumber,
          "partnerId": this.partnerId,
          "agentCode": this.agentCode,
          "formData": JSON.stringify(this.dynamicFormGroup.value),
          "formName": this.formSequence[this.getFormIndexValue()].formName,
          "formConfig": JSON.stringify(this.formSequence),
          "productId": this.productId.toString(),
          "formId": this.formSequence[this.getFormIndexValue()].formId,
          "jsonForm": JSON.stringify(this.form),
          "formSequence": this.getFormIndexValue(),
          "leadNumber": this.leadnumber,
          "quoteNumber": this.formData.quoteId ? this.formData.quoteId : ""
        };

        console.log(reqData, this.dynamicFormGroup.value);

        await this.yatraService.Insertorupdateformdata(reqData).subscribe({
          next: (res: any) => {
            console.log(res);
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
            console.log(this.isQuote);
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
                  console.log(formGroup);
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
        if (this.dynamicFormGroup.invalid) {
          this.toast.warning({ detail: "WARNING", summary: "Please fill the mandatory fields", duration: 3000 });
          if (firstInvalidTabIndex !== null) {
            // Navigate to the first invalid tab
            this.activeMemberTabIndex = firstInvalidTabIndex;
            // this.changeDetectorRef.detectChanges(); // Ensure change detection syncs the tab
          }
        }
        else if (this.dynamicFormGroup.get('nationality') && this.dynamicFormGroup.get('nationality')?.value !== 'Indian')
          this.toast.warning({ detail: "WARNING", summary: "Indian residency is required", duration: 3000 })
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
    console.log(dependentControlNames, visibility, controlName, parentControlName, innerControl);

    const tempIndex = this.activeMemberTabIndex;
    setTimeout(() => {
      if (dependentControlNames) {
        dependentControlNames.forEach((dependent) => {
          // Extract control name and visibility from either string or object
          const dependentName = typeof dependent === 'string' ? dependent : dependent.name;
          const dependentVisibility = typeof dependent === 'string' ? visibility : dependent.visibility;
          console.log(dependentName, dependentVisibility);
          this.form.formSections.forEach((section: IFormSections) => {
            section.formControls.forEach((control: IFormControl) => {
              console.log(section, control);
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
                // console.log(dependentControlNames, visibility,controlName,parentControlName,controlIndex,innerControl);
                control.subControls.forEach((subControl: any) => {
                  if (subControl.name == controlName && controlIndex != null) {
                    // console.log(subControl,controlName,controlIndex);
                    subControl.innerSubControls[controlIndex].coreControls.forEach((innerControl: any, zindex: any) => {
                      console.log(innerControl, dependentName);
                      if (innerControl.name == dependentName) {
                        innerControl.visible = visibility;
                        let dparentControl = this.dynamicFormGroup.get(control.name) as FormGroup;
                        let dcontrol = dparentControl.get(subControl.name) as FormGroup;
                        let dsubControl = dcontrol.get(subControl.innerSubControls[controlIndex].name) as FormArray;
                        let dindexj = dsubControl.at(zindex) as FormGroup;
                        let dinnercontrol = dindexj.get(innerControl.name) as FormGroup;
                        if (innerControl.visible == false && innerControl.dependentControls && innerControl.dependentControls.length > 0) {
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
                              console.log('Dependent Control:', dependentControl);
                            } else {
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
                        console.log(this.dynamicFormGroup);
                      }
                    })
                    // console.log(subControl.innerSubControls[controlIndex],this.dynamicFormGroup); 
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
                  console.log(control);
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
    console.log(this.form);
  }



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
      //     this.toast.success({ detail: "SUCCESS", summary: "Lead Created Successfully.", duration: 3000 });

      //   },
      //   error: (err) => {
      //     console.error(err);
      //   }
      // });
    }
    else {
      console.log('Form is invalid');
      Object.keys(this.dynamicFormGroup.controls).forEach(field => {
        const control = this.dynamicFormGroup.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
      this.toast.warning({ detail: "WARNING", summary: "Please fill the mandatory fields", duration: 3000 })
    }
  }

  // async getPremiumAmount() {
  //   console.log(this.tenureAmount, this.formData.insuredMemberDetails, this.isQuote, Object.keys(this.formData).length);

  //   if (this.changesMade) {
  //     this.changeRecalculate(false);
  //   }

  //   if (this.isQuote == false) {
  //     if (Object.keys(this.formData).length > 0) {
  //       // const modifiedInsuredMemberDetails = JSON.parse(JSON.stringify(this.formData));
  //       this.formData.insuredMemberDetails.forEach((member: any) => {
  //         console.log(member);

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

  //       console.log(this.formData.insuredMemberDetails);

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

  //       console.log(this.formData.insuredMemberDetails, this.productId, this.agentCode);

  //       let reqData = {
  //         "agentCode": this.agentCode,
  //         "productId": this.productId,
  //         "quoteData": JSON.stringify(this.formData)
  //       }

  //       console.log(reqData);

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
  //             console.log(res.data[premiumKey], res.data[discountKey]);

  //             this.tenureAmount[i - 1] = Math.round(res.data[premiumKey]);
  //             this.discountList[i - 1] = res.data[discountKey] ? res.data[discountKey] : 0;
  //           }
  //           console.log(this.QuoteNumber, this.selectedIndex,this.tenureAmount,this.discountList);
  //           this.formData.quoteId = this.QuoteNumber[this.selectedIndex];
  //           // this.formData.tenure = this.selectedIndex;
  //           console.log(this.form);

  //           if(this.form.formTitle =='Total Premium'){
  //             console.log("haleluya");

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
  //           console.log("Error while fetching product tenure", err);
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

  //   //   console.log(reqData);


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
  //   //           console.log(this.tenureAmount);

  //   //           this.premiumDetails.push(member.premium);
  //   //           this.premiumAmountDetails.push(tempArray);
  //   //         });
  //   //       });
  //   //       // console.log(this.premiumAmountDetails);
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
  //   //       console.log(member);

  //   //     })
  //   //     console.log(this.premiumAmountDetails);
  //   //     console.log(this.premiumDetails);

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

  //   //     console.log(reqData2);


  //   //     const addOnPremiumResponse: any = await new Promise((resolve, reject) => {
  //   //       this.service.getAddOnPremium(reqData2).subscribe({
  //   //         next: (response) => resolve(response),
  //   //         error: (err) => reject(err)
  //   //       });
  //   //     });

  //   //     addOnPremiumResponse.calculatedValuesList.forEach((member: number, index: number) => {
  //   //       this.tenureAmount[index] = Math.round(member)
  //   //     })

  //   //     console.log(this.tenureAmount);

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
    console.log(this.tenureAmount, this.formData.insuredMemberDetails, this.isQuote, Object.keys(this.formData).length);

    if (this.changesMade) {
      this.changeRecalculate(false);
    }
    console.log(this.isQuote);

    if (this.isQuote === false) {
      if (Object.keys(this.formData).length > 0) {

        // this.formData.insuredMemberDetails.forEach((member: any) => {
        //   member['covers'] = member['covers'] ?? [];
        //   member['isChronic'] = member['isChronic'] ?? "No";
        //   member['chronicDiseases'] = member['chronicDiseases'] ?? null;
        //   member['roomCategory'] = member['roomCategory'] ?? "";

        //   if (!member.hasOwnProperty('memberRelationCode')) {
        //     const relationCodeMap: { [key: string]: number } = {
        //       'Self': 24,
        //       'Spouse': 22,
        //       'Son': 23,
        //       'Daughter': 19
        //     };
        //     member['memberRelationCode'] = relationCodeMap[member.relation] ?? null;
        //   }
        // });

        this.formData.insuredMemberDetails.forEach((member: any, index: number) => {
          // Initialize member's properties with default values if undefined
          member['covers'] = this.covers[index] ?? [];
          member['isChronic'] = member['isChronic'] ?? "No";
          member['chronicDiseases'] = member['chronicDiseases'] ?? null;
          member['roomCategory'] = member['roomCategory'] ?? "";

          // Set memberRelationCode based on a predefined mapping, if it doesn't already exist
          if (!member.hasOwnProperty('memberRelationCode')) {
            const relationCodeMap: { [key: string]: number } = {
              'Self': 24,
              'Spouse': 22,
              'Son': 23,
              'Daughter': 19
            };
            member['memberRelationCode'] = relationCodeMap[member.relation] ?? null;
          }
        });


        this.formData['sumInsured'] = this.formData['sumInsured'] ?? this.formData.insuredMemberDetails[0].sumInsured;
        this.formData['familySize'] = this.formData.insuredMemberDetails.length + 'A';
        this.formData['proposerName'] = this.formData['firstName'] + this.formData['lastName'];

        if (this.formData.memberPolicyType === 'Family Floater') {
          const pincode = this.formData.memberPolicyType === 'Family Floater'
            ? this.formData['proposerPincode']
            : this.formData.insuredMemberDetails[0].pincode;
          const zone = this.formData['zone'];
          const zoneValue = this.formData['zoneValue'];
          this.formData.insuredMemberDetails.forEach((member: any) => {
            member.pincode = pincode
            member.zone = zone;
            member.zoneValue = zoneValue;
          });
        }


        console.log(this.formData);

        let reqData = {
          "agentCode": this.agentCode,
          "productId": this.productId,
          "quoteData": JSON.stringify(this.formData)
        };

        console.log(reqData);

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
            const discountKey = `t${i}DiscountPercentage`;
            const Quote = `tenure${i}QuoteNumber`;
            this.QuoteNumber.push(res.data[Quote]);

            this.tenureAmount[i - 1] = Math.round(res.data[premiumKey]);
            this.discountList[i - 1] = res.data[discountKey] ? res.data[discountKey] : 0;
          }

          this.formData.quoteId = this.QuoteNumber[this.selectedIndex];
          if (this.form.formTitle === 'Leads') {
            // this.formData.tenureAmount = this.tenureAmount;
            // this.formData.displayTaxList = this.displayTaxList;
            this.dynamicFormGroup.get('tenureAmount')?.setValue(this.tenureAmount);
            this.dynamicFormGroup.get('displayTaxList')?.setValue(this.displayTaxList);
          }

          console.log(this.formData, this.form, this.dynamicFormGroup.value);

          sessionStorage.setItem("allFormData", this.encryptionService.encrypt(this.formData));

          // After setting tenureAmount and discountList, call setPremiumAmount()
          this.setPremiumAmount();

        } catch (error) {
          console.error("Error while fetching product tenure", error);
        } finally {
          this.spinner.hide();
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
    console.log(obj);
    Object.keys(obj).forEach(key => {
      const value = obj[key];
      const newKey = prefix + key;
      // console.log(newKey);
      if (key == 'criticalIllness') {
        console.log(this.formData[key], this.dynamicFormGroup.get(key), typeof this.dynamicFormGroup.get(key));

      }
      if (typeof value === 'object' && value !== null && Object.keys(value).length > 0) {
        if (typeof value === 'object' && value !== null && 'id' in value) {
          this.dynamicFormGroup.get(newKey)?.patchValue(value);
        }
        else if (this.dynamicFormGroup.get(newKey) instanceof FormGroup) {
          const formGroup = this.dynamicFormGroup.get(newKey);
          Object.keys(value).forEach((key2) => {
            console.log(value[key2], key2);
            if (key2 == 'covers') {
              console.log(formGroup?.get(key2), typeof formGroup?.get(key2));
              console.log(formGroup?.get(key2) instanceof FormArray);

            }
            if (formGroup?.get(key2) instanceof FormArray) {
              const formArray = formGroup?.get(key2) as FormArray;

              console.log(formArray);

              // Clear any existing controls if needed
              // formArray.clear();

              // Array of objects that you want to set in the FormArray
              const arrayOfObject = value[key2];
              // Loop through the array and create FormGroups for each object
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
                //   console.log(group);
                //   formArray.push(group)
                // }
              });
            }
            // else if(!(formGroup?.get(key2) instanceof FormGroup)){
            // //   console.log(key2,formGroup?.get(key2));
            // formGroup?.get(key2)?.setValue(value[key2]);
            // }
            else if (formGroup?.get(key2) instanceof FormGroup) {
              console.log(key2, this.formData.insuredMembers);
              Object.keys(value[key2]).forEach((member: any) => {
                console.log(formGroup?.get(key2)?.get(member) instanceof FormArray, formGroup?.get(key2)?.get(member), value[key2][member]);
                if (formGroup?.get(key2)?.get(member) instanceof FormArray) {
                  const addOnMemberDetails = formGroup?.get(key2)?.get(member) as FormArray;
                  addOnMemberDetails.controls.forEach((control, index) => {
                    // Set value only if the index exists in newValues
                    if (value[key2][member][index]) {
                      control.patchValue(value[key2][member][index]);
                    }
                  });
                }

              })

              //   console.log(typeof value[key2]);

              // }

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
    console.log(this.dynamicFormGroup.value);

  }


  async fullQuotation(): Promise<void> {
    return new Promise((resolve, reject) => {
      // this.spinner.show();
      console.log(this.formData);

      this.mappedFormDataFullQuote(this.formData)
        .then((data) => {
          console.log(data);

          const reqData: any = {
            agentCode: this.agentCode,
            productId: this.productId.toString(),
            productType: this.formData.productType,
            fullQuoteRequestJson: JSON.stringify(data)
          }
          console.log(reqData);


          this.yatraService.getFullQuote(reqData).subscribe({
            next: (response: any) => {
              console.log(response);

              if (response?.isSuccess) {
                const responseData = response.data;

                // Setting response data to formData
                this.formData.policyNumber = responseData.policyNumber || null;
                this.formData.policyStatus = responseData.policyStatus || null;
                this.formData.quoteValidFromDate = responseData.policyStartDate || null;
                this.formData.quoteValidToDate = responseData.policyEndDate || null;
                this.formData.ReceiptNumber = responseData.receiptNumber || null;
                this.formData.customerId = responseData.customerId || null;

                console.log(this.dynamicFormGroup.value);

                // Merging updated formData with dynamicFormGroup values
                this.formData = { ...this.formData, ...this.dynamicFormGroup.value };

                // Encrypting and saving formData to session storage
                sessionStorage.setItem("allFormData", this.encryptionService.encrypt(this.formData));

                // Showing success toast
                this.toast.success({
                  detail: "SUCCESS",
                  summary: `Full Quotation Generated Successfully. Customer ID: ${this.formData.customerId}`,
                  duration: 3000,
                });

                resolve(); // Allow navigation
              } else {
                const errorMessage =
                  response.message
                console.log(errorMessage);
                // Showing error toast
                this.toast.error({
                  detail: "ERROR",
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
                detail: "ERROR",
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
            detail: "ERROR",
            summary: "Failed to map form data",
            duration: 3000,
          });

          reject(err);
        });
    });
  }





  /* AddOn Related Method */

  onCheckboxChange(event: any, control: any, parentControl: any = null, index: number | null = null) {
    console.log(event, event.target, control, parentControl, index, this.dynamicFormGroup);

    this.changesMade = true;
    if (parentControl != null && typeof parentControl === 'object') {
      this.parentControl = parentControl;
    }
    if ((event.target.type === 'button')) {
      if (parentControl != null && typeof parentControl === 'object' && parentControl.type == 'questionnaire') {
        console.log(event.target.type, event.target.checked);
        console.log(control, parentControl);
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
        const arrayName = (control.name).charAt(0).toUpperCase() + (control.name).slice(1);
        console.log('questionnaire', arrayName, event.target.checked);
        parentControl.subControls.forEach((subControl: any) => {
          if (subControl.name === arrayName) {
            subControl.visible = event.target.checked;
            console.log(subControl, event.target.value);
            let parentCode = this.dynamicFormGroup.get(parentControl.name) as FormGroup;
            let controlCode = parentCode.get(subControl.name) as FormArray;
            if (event.target.checked == true) {
              if (index) {
                const newForm = this.initializeSubControls(subControl.innerArrayControl[0]);
                controlCode.push(newForm);
                console.log(parentCode, controlCode, subControl.innerArrayControl, newForm, parentCode);
              }
            }
          }
          if (subControl.name === 'doneButton') {
            subControl.disabled = !event.target.checked;
            console.log(subControl, event.target.value);
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
        // console.log(parentControl,this.dynamicFormGroup.get(parentControl.name),this.dynamicFormGroup);

        parentControl.subControls.forEach((subControl: any) => {
          if (subControl.innerSubControls) {
            for (let i = 1; i < subControl.innerSubControls.length; i++) {
              console.log(subControl.innerSubControls[i]);

              if (subControl.innerSubControls[i].coreControls) {
                for (let j = 0; j < subControl.innerSubControls[i].coreControls.length; j++) {
                  console.log(subControl.innerSubControls[i].coreControls[j], this.dynamicFormGroup.get(`${parentControl.name}.${subControl.name}.${subControl.innerSubControls[i].name}.${j}.${subControl.innerSubControls[i].coreControls[j].name}`));
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
                    console.log(newcontrol);
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
        const arrayName = (control.name).charAt(0).toUpperCase() + (control.name).slice(1);
        console.log('questionnaire', arrayName, event.target.checked);
        parentControl.subControls.forEach((subControl: any) => {
          if (subControl.name === arrayName) {
            subControl.visible = event.target.checked;
            if (event.target.checked == false) {
              subControl.innerArrayControl = subControl.innerArrayControl?.slice(0, 2);

              let formArray = (this.dynamicFormGroup.get(parentControl.name) as FormGroup)?.controls[arrayName] as FormArray;
              console.log(formArray);
              // Remove all items from the FormArray
              // while (formArray.length > 1) {
              //   formArray.removeAt(1);
              // }

              formArray.clear();
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
              console.log(this.formData, this.dynamicFormGroup.value, this.form);
            }
            console.log(subControl, event.target.value);
          }

          if (subControl.name === 'doneButton') {
            subControl.disabled = false;
            console.log(subControl, event.target.value);
          }
        });
        this.openPopUp();
        // this.showOverlay(parentControl);
      }
      if (control.onChangeMethod)
        this.resolveMethod(control.onChangeMethod, control?.popUpFormId, control?.dependentControls, false, control?.name, parentControl?.name, index, 'remove');
    }
    console.log(this.dynamicFormGroup, this.form);
  }

  // addOnAdded(control: any, parentControl: any = null) {

  //   let addOnData = this.dynamicFormGroup.get(parentControl.name)?.value;
  //   console.log(addOnData);

  //   let modifiedInsuredMemberDetails = this.formData.insuredMemberDetails;
  //   console.log(modifiedInsuredMemberDetails);

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
    let addOnData = this.dynamicFormGroup.get(parentControl.name)?.value;
    let modifiedInsuredMemberDetails = this.formData.insuredMemberDetails;

    Object.keys(addOnData.addOnDetails).forEach((key) => {
      if (addOnData.addOnDetails[key][0].memberCheckbox === true) {
        modifiedInsuredMemberDetails.forEach((member: any, index: number) => {
          if (member.relation === key) {
            let addOnSumInsured: any = 0;
            const coverId = addOnData.addOnId;
            const coverName = addOnData.additionalCoverName;
            let coverFound = false;

            if (!member.covers) {
              member.covers = [];
            }

            addOnData.addOnDetails[key].forEach((addOnDetail: any) => {
              if (addOnDetail.addOnSumInsured) {
                addOnSumInsured = addOnDetail.addOnSumInsured;
              }
              if (addOnData.addOnId === 'PA' && addOnDetail.occupation) {
                member.occupationCode = JSON.parse(addOnDetail.occupation).value;
              }
              if (addOnData.addOnId === 'PA' && addOnDetail.occupationRisk) {
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
                coverName: coverName
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
                coverName: coverName
              });
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

  //   console.log(parentControl);

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
  //   console.log(this.addOnList);

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

  //   console.log(reqData);


  //   this.yatraService.getAddOnPremium(reqData).pipe(
  //     // 1. Step: First process the API response
  //     tap((response:any) => {
  //       console.log(response);

  //       // Update tenure amounts
  //       for (let i = 0; i < response.calculatedValuesList.length; i++) {
  //         this.tenureAmount[i] = Math.round(response.calculatedValuesList[i]);
  //       }
  //       console.log('Updated tenureAmount:', this.tenureAmount, this.selectedIndex);

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
  //                 this.dynamicFormGroup.value.totalPremium = tenureAmount;
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
  //       console.log('All operations completed successfully.');
  //     },
  //     error: (err) => {
  //       console.error(err);
  //     }
  //   });
  // }
  // addOnRemoved(control: any, parentControl: any = null) {
  //   let addOnData = this.dynamicFormGroup.get(parentControl.name)?.value;
  //   console.log(addOnData);

  //   let modifiedInsuredMemberDetails = this.formData.insuredMemberDetails;
  //   console.log(modifiedInsuredMemberDetails);

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
        //     console.log(res)
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
    console.log(control);

    const value = this.formData[control.dependentControls[0]];

    console.log(value);


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
    console.log(this.dynamicFormGroup.value, this.form, this.displayTaxList, this.selectedIndex, this.formData, this.QuoteNumber);
    this.tenureAmount.forEach(member => {
      console.log(member);

    })
    if (this.selectedIndex == -1) {
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
                //   this.dynamicFormGroup.value.totalPremium = this.tenureAmount[index];
                //   this.selectedIndex = index;
                //   this.formData.tenure = this.selectedIndex + 1;
                // }
                console.log(this.selectedIndex);
              } else if (index === 1) {
                option.label = `<b>Rs - ${this.tenureAmount[index]}</b>`;
                section.toolTipText = `Tax: Rs ${this.displayTaxList[0]}`;
                option.value = this.tenureAmount[index];
                option.year = "2 years"
                option.discount = "7.5% off"
                // if (this.selectedIndex == index) {
                //   this.dynamicFormGroup.value.totalPremium = this.tenureAmount[index];
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
                //   this.dynamicFormGroup.value.totalPremium = this.tenureAmount[index];
                //   this.selectedIndex = index;
                //   this.formData.tenure = this.selectedIndex + 1;
                // }
              }
              console.log(this.selectedIndex, index);

              if (this.selectedIndex === index) {
                let radioOptionsControl = this.dynamicFormGroup.get('totalPremium');
                if (!radioOptionsControl) {
                  // Add control if it doesn't exist
                  this.dynamicFormGroup.addControl(formControl.name, new FormControl(this.tenureAmount[index]));
                  // radioOptionsControl = this.dynamicFormGroup.get('totalPremium');
                }

                // if (radioOptionsControl) {
                //   radioOptionsControl.setValue(this.tenureAmount[this.selectedIndex], { emitEvent: true });
                //   // this.dynamicFormGroup.value.totalPremium = this.tenureAmount[this.selectedIndex];
                // }
                option.selected = true;
                if (this.dynamicFormGroup.value.totalPremium) {

                  this.dynamicFormGroup.value.totalPremium = this.tenureAmount[this.selectedIndex];
                }
                console.log(this.dynamicFormGroup.value);

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
        }
      });
    });
    console.log(this.dynamicFormGroup.value, this.formData);
  }

  mergeMember(control: any) {
    const a = Object.keys(this.formData.insuredMembers).filter(
      key => this.formData.insuredMembers[key] === true
    );
    control.value = a;
    console.log(control, this.formData, a);
  }

  selectEditField(control: any) {
    this.form.formSections.forEach((section: any) => {
      section.formControls.forEach((controls: any) => {
        if (controls.name == control.name) {
          controls.disabled = false
          console.log(controls);
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
    // console.log(this.formData[control.name][i-1].relationshipType,control,i);
    const imagePath = JSON.parse(this.formData[control.name][i - 1].relationshipType)?.imagePath;
    // console.log(i,imagePath);
    return imagePath;
  }

  addOnMemberAdded(subControl: any, parentControl: any = null) {
    console.log(subControl, parentControl);

    if (parentControl != null) {
      let count = 0;
      let memberDetails = this.dynamicFormGroup.get(parentControl.name)?.get(subControl.name)?.value;
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
                  console.log((this.dynamicFormGroup.get(parentControl.name)?.get(subControl.name)?.get(key)) as FormArray);
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
          console.log(subControl, parentControl);
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

      console.log(memberDetails, count);

      console.log((this.dynamicFormGroup.get(parentControl.name) as FormGroup)?.controls)
      // ?.controls[0].setValue(false);
      let control = this.dynamicFormGroup.get(parentControl.name) as FormGroup;
      if (control) {
        const firstKey = Object.keys((this.dynamicFormGroup.get(parentControl.name) as FormGroup)?.controls)[0];
        console.log(firstKey, count);
        // Get the first key
        if (count == 0) {
          control.controls[firstKey].setValue(false);
          this.addOnRemoved(subControl, parentControl)
        }
        else {
          control.controls[firstKey].setValue(true);
          this.changeOverLayDone(subControl, parentControl, true);
          this.addOnAdded(subControl, parentControl);
        }
      }

    }
    this.closeOverlay(subControl, parentControl);




  }

  closeOverlay(subControl: any, control: any = null) {
    if (subControl.conditionCheck && (this.dynamicFormGroup.get(control.name) as FormGroup).invalid) {
      console.log(subControl);
      this.toast.warning({ detail: "WARNING", summary: "Please fill the mandatory fields", duration: 3000 })
    }
    else {
      this.closePopUp();
      subControl.visible = false;
    }
  }
  closePopUp(control: any = null) {
    console.log(control, this.dynamicFormGroup);
    if (this.dynamicFormGroup.invalid) {
      let dynamicControl = this.dynamicFormGroup.get(control.name);
      this.traverseFormGroup(dynamicControl as FormGroup);
      if (dynamicControl instanceof FormGroup) {
        Object.keys(dynamicControl.controls).forEach(arrayControl => {
          console.log(arrayControl);
        })
      }
      console.log(this.dynamicFormGroup, dynamicControl);
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
  verifyKYC(control: any) {
    const proposerDOB = this.dynamicFormGroup.get('memberDobProposer')?.value;
    const panNumber = this.dynamicFormGroup.get('panNo')?.value;

    const dobDate = new Date(proposerDOB);
    const formattedDOB = dobDate.getFullYear() + '-' +
      String(dobDate.getMonth() + 1).padStart(2, '0') + '-' +
      String(dobDate.getDate()).padStart(2, '0');

    const reqData = {
      dateOfBirth: formattedDOB,
      panNumber: panNumber
    };
    console.log(reqData, this.dynamicFormGroup.value);

    if (panNumber && formattedDOB) {
      this.yatraService.GetKycDetails(reqData).subscribe({
        next: (response: any) => {
          console.log('KYC details:', response);
          if (response.isSuccess == true) {
            this.toast.success({ detail: "SUCCESS", summary: response.message, duration: 3000 });
            // this.spinner.hide();
            console.log(response.data);

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
                      else
                        control.get(key)?.setValue(fieldValue);

                      console.log(index);


                      if (response.data.upgradableZones) {
                        this.form.formSections.forEach((section: any) => {
                          if (section.sectionTitle == 'Insured Member Details') {
                            section.formControls.forEach((control: any) => {
                              if (control.dynamicControls && control.visible == true) {
                                control.dynamicControls[index + 1].forEach((dynamicControl: any) => {
                                  if (dynamicControl.name == 'zoneValue') {
                                    dynamicControl.options = []; // Clear any existing options
                                    response.data.upgradableZones.forEach((zoneOption: any) => {
                                      console.log(zoneOption);
                                      dynamicControl.options.push({
                                        name: zoneOption.zone.toString(), // Display name
                                        value: zoneOption.zoneCode.toString() // Corresponding value
                                      });
                                    });
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
                      control.value = response.data.zoneCode; // Set the default value
                      control.options = []; // Clear any existing options
                      response.data.upgradableZones.forEach((zoneOption: any) => {
                        console.log(zoneOption);
                        control.options.push({
                          name: zoneOption.zone.toString(), // Display name
                          value: zoneOption.zoneCode.toString() // Corresponding value
                        });
                      });
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
            this.toast.warning({ detail: "WARNING", summary: "No Record Found", duration: 3000 });
          }
          // else {
          //   console.error('Expected response.data to be an object, but received:', response.data);
          // }
          // this.dynamicFormGroup.get('ckycNo')?.setValue(response.data.ckycNo);
        },
        error: (error) => {
          this.spinner.hide();
          this.toast.warning({ detail: "WARNING", summary: "Failed to fetch KYC Details", duration: 3000 });
          console.error('Error fetching KYC details:', error);
        }
      });
    }
    else {
      this.toast.warning({ detail: "WARNING", summary: "Please fill Pan Card and Date of Birth", duration: 3000 });
    }
  }

  getPolicyDetails(control: any) {
    const policyNumberDetails = this.dynamicFormGroup.get('getPolicyNumber')?.value;
    const reqData = {
      policyNumber: policyNumberDetails
    };
    console.log(reqData);

    // this.spinner.show();

    this.yatraService.GetCustomerDetailsViaPolicyNumber(reqData).subscribe({
      next: (response: any) => {
        console.log('Policy details:', response);
        this.toast.success({ detail: "SUCCESS", summary: response.message, duration: 3000 });
        this.spinner.hide();
        control.disabled = true;

        this.isPolicyDetailsFetch = true;
        console.log(this.dynamicFormGroup.value, this.form);

        console.log(this.dynamicFormGroup.get('insuredMembers'));

        if (response.data['insuredMemberDetails'].length > 0) {
          this.formData['insuredMemberDetails'] = response.data['insuredMemberDetails'];
          const insuredMembers: { [key: string]: boolean } = {};

          response.data['insuredMemberDetails'].forEach((member: any) => {
            insuredMembers[member.relation] = true; // Set as true
          });

          this.formData['insuredMembers'] = insuredMembers;
        }


        console.log(this.formData);


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
        this.toast.warning({ detail: "WARNING", summary: "Failed to fetch Policy Details", duration: 3000 });
        console.error('Error fetching Policy details:', error);
      }
    });
  }


  addDiseaseList(subControl?: any, control?: any) {
    console.log(this.dynamicFormGroup.value, this.form);
    if (this.isOverlayVisible) {
      this.isOverlayVisible = false;
    }
    else {
      this.isOverlayVisible = true;
    }
    console.log(subControl, control, this.form);
  }
  addNewDisease(subControl: any, control: any) {
    console.log(subControl, control, this.dynamicFormGroup.value);
    // if (subControl.innerArrayControl.length < 2) {
    //   const innerarrayControl = subControl.innerArrayControl[0]
    //   const firstKey = innerarrayControl.shift();  // This is the checkbox object
    //   console.log(innerarrayControl, firstKey);
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
      console.log(subName);
      // console.log(abc, (this.dynamicFormGroup.get(control.name) as FormGroup)?.controls[abc]);
      // const formArr = (this.dynamicFormGroup.get(control.name) as FormGroup)?.controls[abc] as FormArray;
      let formArr = (this.dynamicFormGroup.get(control.name) as FormGroup)?.controls[subName] as FormArray;
      formArr.push(this.initializeDynamicFormControls(tempControl, subControl.innerArrayControl.length - 1));
      // formArr.push(this.initializeDynamicFormControls(subControl.innerArrayControl[0], subControl.innerArrayControl.length - 1));
    }
    console.log(this.dynamicFormGroup, this.dynamicFormGroup.get(control.name) as FormGroup);
    console.log(this.form);
  }
  removeDisease(subControl: any, control: any, index: any) {
    console.log(subControl, control, index, this.form, this.dynamicFormGroup.value);
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
    console.log(control, this.dynamicFormGroup.value, this.form);
  }
  copyText(control: any) {
    console.log(control);
    this.clipboard.copy(this.dynamicFormGroup.get(control.name)?.value);
    this.toast.success({ detail: "SUCCESS", summary: `Text copied to clipboard!`, duration: 3000 });
    // this.messageService.add({severity:'success', summary: 'Success', detail: 'Text copied to clipboard!'});
  }


  async mappedFormDataFullQuote(formData: any): Promise<Partial<Root>> {
    const nomineeAge: any = await this.calculateAge(formData?.nomineeDob);
    console.log(formData, this.covers);

    const mappedData: Partial<Root> = {
      agentCode: this.agentCode || '',
      productName: formData?.productName || '',
      productCode: formData?.productId || '',
      planCode: formData?.planCode || '',
      planName: formData?.productVariant || '',
      proposalNum: this.proposalNum || '',
      policyType: formData?.memberPolicyType || '',
      businessType: formData?.typeOfBusiness || '',
      insuredMemberDetails: formData?.insuredMemberDetails?.map((member: any, index: any) => {
        return {
          relation: member?.relation || '',
          memberrelationCode: this.jsonParse(member.relationshipType, 'id') || '',
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
          memberIndex: member.memberIndex || '',
          zone: member?.zone || '',
          zoneValue: member?.zoneValue || '',
          state: member?.state || '',
          city: member?.city || '',
          memberType: member?.memberType || '',
          memberSumInsured: member?.sumInsured || '',
          // memberZone: member?.zoneValue || '',
          memberNatureOfDuty: member?.memberNatureOfDuty || '',
          memberDesignation: formData[`insuredMemberDetails.${index}.productMemberDesignation`] || '',
          memberOccupation: formData[`insuredMemberDetails.${index}.productMemberOccupation`] || '',
          covers: this.covers[index] || [],
          productQuestionnaire: formData[`insuredMemberDetails.${index}.productQuestionnaire`] || '',
          memberRoomCategory: member?.memberRoomCategory || ''
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
      idNo: formData?.idNo || '',
      proposerAnnualIncome: formData?.annualIncome || '',
      proposerOccupation: this.jsonParse(formData?.occupation, 'name') || '',
      proposerEducation: this.jsonParse(formData?.educationDetails, 'id') || '',
      proposerPANNo: formData?.panNo || '',
      gstDetails: formData?.gstDetails || '',
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
      accountType: formData?.accountType || '',
      bankCity: this.jsonParse(formData?.bankCity, 'name') || '',
      bankBranch: this.jsonParse(formData?.bankBranch, 'name') || '',
      paymentMode: this.selectedButton || '',
      chequeNumber: formData?.chequeNumber || '',
      chequeDate: formData?.chequeDate || '',
      bankName: this.formData?.bankName || '',
      ifscCode: formData?.ifscCode || '',
      micrNo: formData?.micrCode || '',
      premiumAmount: formData?.totalPremium || '',
      selectedTenure: (parseInt(formData?.tenure)).toString() || '',
      paymentDate: new Date().toISOString().split("T")[0] as any || '',
      paymentCollectionMode: formData.paymentOption || '',
      paymentByRelationship: 'Self',
      payerName: formData?.accountHolderName || '',
      paymentBy: 'customer',
      PaymentGatewayName: formData?.PaymentGatewayName || ''
    };

    return mappedData;
  }

  async getFullQuoteViaOfflinePayment(): Promise<void> {
    return new Promise((resolve, reject) => {
      const data = this.dynamicFormGroup.value;
      const formData = {
        policyType: 'New Business',
        paymentMethod: (this.selectedButton || '').toString(),
        premiumAmount: (this.formData?.totalPremium || '').toString(),
        instrumentNo: (this.formData?.chequeNumber || '').toString(),
        instrumentDate: (this.formData?.chequeDate || '').toString(),
        policyNumber: "".toString(),
        agentCode: (this.agentCode || '').toString(),
        bankName: (this.formData?.bankName).toString(),
        IFSC: (this.formData?.ifscCode || '').toString(),
        micrNo: (this.formData?.micrCode || '').toString(),
        instrumentType: (this.formData.paymentOption || '').toString(),
        source: "Retail".toString(),
        documentId: (this.documentId || '').toString(),
        proposalNum: this.proposalNum.toString(),
      };

      console.log(formData);

      this.yatraService.getFullQuoteViaOfflinePayment(formData).subscribe({
        next: (res: any) => {
          console.log(res);
          if (res?.isSuccess) {
            this.formData.policyNumber = res.data.policyNumber || null;
            this.formData.policyStatus = res.data.policyStatus || null;
            this.formData.quoteValidFromDate = res.data.policyStartDate || null;
            this.formData.quoteValidToDate = res.data.policyEndDate || null;
            this.formData.ReceiptNumber = res.data.receiptNumber || null;
            this.formData.customerId = res.data.customerId || null;

            this.toast.success({
              detail: "SUCCESS",
              summary: `Full Quotation Generated Successfully. Customer ID: ${this.formData.customerId}`,
              duration: 3000,
            });
            resolve();
          }
          else {
            const errorMessage = res.message || "Full Quote generation failed.";
            console.error(errorMessage);
            this.toast.error({
              detail: "ERROR",
              summary: errorMessage,
              duration: 5000,
            });
            reject(new Error(errorMessage));
          }
        },
        error: (err) => {
          console.error(err);
          this.toast.error({
            detail: "ERROR",
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
        console.log(data);
        const req = {
          proposalNum: this.proposalNum,
          fullQuoteJson: JSON.stringify(data)
        }
        this.yatraService.insertFullQuoteJson(req).subscribe({
          next: (res: any) => {
            console.log(res);
            // this.toast.success({ detail: "SUCCESS", summary: `Full Quotation Generated Successfully.`, duration: 3000 });
            resolve();
          },
          error: (err) => {
            console.error(err);
            reject(err);
          }
        });
      }).catch((err) => {
        this.toast.error({ detail: "ERROR", summary: "Failed to map form data", duration: 3000 });
        reject(err);
      });
    });
  }

  jsonParse(string: any, extract: any) {
    const value = JSON.parse(string);
    return value[extract];
  }

  changeRecalculate(visiblility: boolean) {
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
      this.toast.success({ detail: 'Feedback submitted successfully! Thank you for your input.' });
    }, (error) => {
      this.toast.error({ detail: 'Failed to submit feedback. Please try again later.' });
    });
    // this.customerFeedbackModule.hide();
    this.isFeedBackModalVisible = false;
  }

  closeIsFeedBackModalVisible() {
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
    // console.log(controls);
    // let productQuestionnaire:any=[];
    console.log(this.formData, this.dynamicFormGroup.value, form);
    const dynamicValue = this.dynamicFormGroup.value;
    console.log(dynamicValue);
    // Iterate through each member in the insuredMemberDetails
    await this.formData.insuredMemberDetails.forEach((member: any) => {
      delete member.productQuestionnaire;
    })
    console.log(this.formData);
    await form.formSections.forEach((section: any) => {

      section.formControls.forEach((controls: any) => {
        if (controls.type == 'questionnaire') {
          this.formData.insuredMemberDetails.forEach((member: any, index: any) => {
            // Initialize the optionsArray for each member
            const productQuestionnaire: any[] = [];

            console.log(this.formData.insuredMemberDetails[index], member);

            const optionsArray: any[] = [];
            let questionId: any;
            let questionName: any
            // Find the matching control based on member's relation
            const matchingControl = controls.subControls.find((subControl: any) =>
              subControl.name === member.relation
            );
            questionId = controls.idProperty;
            questionName = controls.name;
            console.log(matchingControl);
            // If a matching control is found
            if (matchingControl) {
              // Iterate through innerArrayControl to find the control with name 'dName'
              matchingControl.innerArrayControl[0].forEach((innerControl: any) => {
                // Check if innerControl has a dName property
                console.log(innerControl);
                // innerControl.forEach((inner:any) => {
                if (innerControl && innerControl.name === 'diseaseName') {
                  // Check if options exist in innerControl
                  if (innerControl.options) {
                    // Push options into the optionsArray
                    optionsArray.push(...innerControl.options);
                  }
                }
                // })
              });
            }
            console.log(optionsArray);
            // Initialize the productQuestionnaire array for the current member

            // Iterate through the dynamicValue object
            Object.keys(dynamicValue).forEach((item: any) => {
              if (questionName == item && dynamicValue[item] != null && typeof dynamicValue[item] === 'object') {
                const innerValue = dynamicValue[item];

                // Iterate through the keys of the inner object
                Object.keys(innerValue).forEach((subItem: any) => {
                  // Check if the member's relation matches the current subItem
                  if (member.relation === subItem) {
                    console.log(subItem, innerValue[subItem]);

                    // Iterate through the array related to the matched subItem
                    innerValue[subItem].forEach((innerArray: any) => {
                      console.log(typeof (Number(innerArray.subQuestionCode)), typeof (innerArray.subQuestionCode));
                      // innerArray.parentQuestionCode = questionId;
                      if (!innerArray.hasOwnProperty('subQuestionCode')) {
                        innerArray.subQuestionCode = "";
                      }
                      console.log(innerArray);

                      if (innerArray.diseaseName) {
                        // If optionsArray is not empty, find the corresponding option
                        if (optionsArray.length > 0) {
                          const newOption = optionsArray.find((option: any) => option.value === innerArray.diseaseName);
                          console.log(innerArray, newOption);

                          // Set subQuestionCode and dName based on the found option
                          if (newOption) {
                            innerArray.subQuestionCode = newOption.value;
                            innerArray.diseaseName = newOption.name;
                          }
                        }
                        // else {
                        //     // If optionsArray is empty, set subQuestionCode to an empty string
                        //     innerArray.subQuestionCode = "";
                        // }
                        // Push the innerArray to productQuestionnaire
                      }
                      // else {
                      //     // If no dName, push the innerArray as is
                      //     productQuestionnaire.push(innerArray);
                      // }
                      const filteredInnerArray = innerArray;
                      // const filteredInnerArray = Object.fromEntries(
                      //   Object.entries(innerArray).filter(([key, value]) => value !== "")
                      // );
                      const allValuesEmpty = Object.values(filteredInnerArray).every(value => value === "");

                      console.log(innerArray, filteredInnerArray, allValuesEmpty);
                      if (filteredInnerArray['diseaseName'] !== "" && !allValuesEmpty) {
                        innerArray.parentQuestionCode = questionId;
                        productQuestionnaire.push(filteredInnerArray);
                      }
                      // productQuestionnaire.push(filteredInnerArray);
                      console.log(productQuestionnaire);
                    });
                  }
                });

                console.log(item, dynamicValue[item], typeof item, typeof dynamicValue[item]);
              }
            });

            // Assign the populated productQuestionnaire to the member
            console.log(this.formData.insuredMemberDetails[index], member);
            if (member.productQuestionnaire) {
              member.productQuestionnaire = member.productQuestionnaire.concat(productQuestionnaire);
            }
            else {
              member.productQuestionnaire = productQuestionnaire;
            }
            // Log the final productQuestionnaire for debugging
            console.log(member.productQuestionnaire);
          });
        }
      })
    })
    this.formData.insuredMemberDetails.forEach((member: any) => {
      member.productQuestionnaire = JSON.stringify(member.productQuestionnaire);
      this.flattenObjectInsert(this.formData);
    })
    console.log(this.formData, this.dynamicFormGroup.value, this.form);
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

  getLeadInformation() {
    this.leadsService.getLeadInformationByLeadID(this.leadNumber).subscribe(
      (response) => {
        console.log(response);
        if (response?.data?.leadList) {
          this.quoteLeadInformation = response.data.leadList[0];
          this.dynamicFormGroup.patchValue({
            proposalNumber: this.proposalNum,
            productName: this.quoteLeadInformation.interestedProductName,
            memberDobProposer: this.datepipe.transform(this.quoteLeadInformation.dob, 'yyyy-MM-dd'),
            firstName: this.quoteLeadInformation.firstName,
            middleName: this.quoteLeadInformation.middleName,
            lastName: this.quoteLeadInformation.lastName,
            memberAgeProposer: this.quoteLeadInformation.age,
            emailId: this.quoteLeadInformation.email,
            proposerAddress1: this.quoteLeadInformation.address1,
            proposerAddress2: this.quoteLeadInformation.address2,
            proposerAddress3: this.quoteLeadInformation.address3,
            city: this.quoteLeadInformation.city,
            state: this.quoteLeadInformation.state,
            mobileNumber: this.quoteLeadInformation.phoneNumber,
            educationDetails: this.quoteLeadInformation.education,
            memberPolicyType: this.quoteLeadInformation.policyType,
            occupation: this.quoteLeadInformation.occupation,
            proposerPincode: this.quoteLeadInformation.pincode,
            zoneValue: this.quoteLeadInformation.zone

          });
          this.patchDropDownValues();

          // Object.keys(this.dynamicFormGroup.controls).forEach(controlName => {
          //   const control = this.dynamicFormGroup.get(controlName);
          //   if (control?.value) {
          //     control.disable();
          //   }
          // });
        }
        else { console.error("API request was not successful."); }
      },
      (error) => {
        console.error("Error from getRenewalsList API:", error);
      }
    );
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

}

