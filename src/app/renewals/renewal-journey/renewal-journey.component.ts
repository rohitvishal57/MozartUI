import { DOCUMENT } from '@angular/common';
import { Component, Inject, inject, Renderer2 } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { firstValueFrom, tap } from 'rxjs';
import { IDynamicControl, IForm, IFormControl, IFormSections, IOptions, ISubControl, IValidator } from 'src/app/interface/form.interface';
import { CommonService } from 'src/app/services/common.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { YatraService } from 'src/app/yatra/yatra/yatra.service';
import { combinedForms, thankYou, renewals_summary } from 'src/assets/styles/renewals-forms/combined_forms';
import { renewals_lead } from 'src/assets/styles/renewals-forms/lead';
import { new_combinedForms } from 'src/assets/styles/renewals-forms/new_combined';
import { payment } from 'src/assets/styles/renewals-forms/payment';
import { totalPremium } from 'src/assets/styles/renewals-forms/totalPremium';
import { RenewalsService } from '../renewals.service';
import { active_health_covers } from 'src/assets/styles/renewals-forms/active_Health_covers';
import { IFullQuoteMapping } from 'src/app/interface/FullQuote_Mapping.interface';
import { customer_payment } from 'src/assets/styles/renewals-forms/customer_payment';
import { Clipboard } from '@angular/cdk/clipboard';

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
  rowData:any;
  formSequence: any[] = [payment, thankYou];
  // formSequence: any[] = [];
  journeyProcess: any;
  currentDate = new Date().toISOString().split('T')[0];
  futureDate = new Date(new Date().setFullYear(new Date().getFullYear() + 10)).toISOString().split('T')[0];
  activeSection: string = "primary";
  // activeSection: string = "primary";
  formIndex: number = 0;
  existingRelations: any[] = [];
  QuoteNumber: any = [];
  tenureAmount: any[] = [0, 0, 0];
  discountList: number[] = [];
  displayTaxList: any[] = [];
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
  isFeedBackModalVisible: Boolean = false; 

  constructor(private route: ActivatedRoute, private encryptionService: EncryptionService, private renderer: Renderer2, @Inject(DOCUMENT) private document: Document, private yatraService: YatraService, private toast: NgToastService, public commonService: CommonService, private renewalService: RenewalsService, private router: Router, private clipboard: Clipboard) {}
 
  async ngOnInit() {
    this.showHtmlContent = false;

    // Fetch agentCode from localStorage if present
    if (localStorage.getItem('agentCode')) {
      this.agentCode = localStorage.getItem('agentCode');
    }

    // Extract data from history state
    const stateData = history.state;

    if (stateData && Object.keys(stateData).length > 0) {
      console.log('State Data:', stateData);

      // Decrypt and assign each piece of data if present
      if (stateData.formData) {
        console.log(stateData.formData,"formData");
        
        const decryptedFormData = this.encryptionService.decrypt(stateData.formData);
        if ('isFullQuoteSuccess' in decryptedFormData) {
          this.rowData = decryptedFormData;
        }        
        console.log(decryptedFormData);
        if(decryptedFormData.policyNumber){
          const renewalInfoRequestBody = {
            policy_Number: decryptedFormData.policyNumber
          };
          const response:any = await firstValueFrom(this.renewalService.getRenewalInfoApi(renewalInfoRequestBody));

          this.formData = { ...this.formData, ...response.data };
        }
        
        this.formData = { ...this.formData, ...decryptedFormData };
        console.log(this.formData);

        // if (decryptedFormData.errorObject.errorMessage) {
        //   console.log("testing");
          
        //   this.toast.warning({detail: "SUCCESS",summary:decryptedFormData.errorObject.errorMessage || "payment",duration: 5000});
        // }

      }
      if (stateData.formSequence) {
        // this.formSequence = [];
        this.formSequence = this.encryptionService.decrypt(stateData.formSequence);
        console.log(this.formSequence);

      }
      if (stateData.journeyProcess) {
        this.journeyProcess = this.encryptionService.decrypt(stateData.journeyProcess);
        console.log(this.journeyProcess);
      }
      if (stateData.formIndex) {
        // const decryptedFormIndex = this.encryptionService.decrypt(stateData.formIndex);
        localStorage.setItem('formIndex', stateData.formIndex);
        console.log(stateData.formIndex);
        
      }

      if (stateData.proposalNum) {
        this.proposalNum = this.encryptionService.decrypt(stateData.proposalNum);
        console.log(this.proposalNum);
      }
      // else{
      //   try {
      //     const res = await firstValueFrom(this.commonService.getProposalNumber());
      //     this.proposalNum = res.data.proposalNumber;
      //   } catch (error) {
      //     console.error(error);
      //   }
      // }
      try{
        if (stateData.policyNumber) {
          this.policyNumber = this.encryptionService.decrypt(stateData.policyNumber);
          console.log(this.policyNumber);
      }
      }catch (error){
          console.error(error);

      }
     
      // if (stateData.paymentStatus) {
      //     const paymentStatus = this.encryptionService.decrypt(stateData.paymentStatus);
      //     if(paymentStatus == "SUCCESS"){
      //       this.toast.success({detail: "SUCCESS",summary: "payment SUCCESS",duration: 5000});
      //     }else if(paymentStatus == "INTIATED"){
      //       this.toast.success({detail: "SUCCESS",summary: "payment INTIATED",duration: 5000});
      //     }
      // }
      // if (stateData.kycStatus) {
      //   const kycStatus = this.encryptionService.decrypt(stateData.kycStatus);
      //   if(kycStatus){
      //     this.toast.success({detail: "SUCCESS",summary: "KYC SUCCESS",duration: 5000});
      //   }else if(!kycStatus){
      //     this.toast.error({detail: "FAILED",summary: "KYC FAILED",duration: 5000});
      //   }
      // }

      // Set formSequence if provided in state; otherwise, use default
      // else {
      //   console.log('inside else');

      //   this.formSequence = [new_combinedForms, active_health_covers, payment, thankYou];
      // }

      // Set formIndex in localStorage if present in state

      // Process insuredMemberDetails if present in the formData
      if (this.formData?.insuredMemberDetails?.length > 0) {
        this.formData.insuredMemberDetails.forEach((member: any, index: number) => {
          if (member.covers) {
            this.covers[index] = member.covers;
          }
          if (member.relation) {
            this.existingRelations.push(member.relation);
          }
        });
      }

      console.log('Covers:', this.covers);
    } else {
      // If no data is present in the history state, use default configurations
      console.warn("No data found in history state.");
      this.formSequence = [payment, thankYou];
    }

    console.log(this.formData, this.proposalNum, this.policyNumber);

    // Call the function to handle form data and sequence
    this.getFormDataFromFormSequence();

    this.customerFeedbackForm = this.fb.group({
      message: [''],
      rating: [null, Validators.required], // Add rating to the form
    });
  }


  async getFormDataFromFormSequence() {
    console.log(this.formSequence, this.getFormIndexValue(), this.form);
    this.showHtmlContent = false;
    if (this.dynamicStyle) {
      this.renderer.removeChild(this.document.head, this.dynamicStyle)
      this.showHtmlContent = false;
    }

    // this.form = totalPremium;
    // this.form = new_combinedForms;
    // this.form = payment;
    // this.form = active_health_covers;

    this.form = JSON.parse(JSON.stringify(this.formSequence[this.getFormIndexValue()]));
    console.log(this.form);

    if (this.journeyProcess == 0) {
      this.form.formSections.forEach((section: any) => {
        section.formControls.forEach((control: any) => {
          if (control.name == 'back') {
            control.visible = false;
          }
        })
      })
    }

    this.initializeForm();
  }

  async initializeForm() {
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
        else {
          if ((this.formData[control.name]) || (this.formData[control.name] && !control.value)) {
            control.value = this.formData[control.name];
          }
        }
      });
    });

    console.log(this.form, this.formData);


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
              this.renewalFormGroup.addControl(control.name, this.initializeSubControls(control.subControls.slice(2)));
            }
            else if (control.type == 'combinedCheckbox') {
              console.log(control.name);

              control.subControls.forEach((subControl: ISubControl) => {
                if (subControl.name == 'addOnDetails') {
                  const addOnId = control.subControls?.find(sub => sub.name === 'addOnId')?.value;


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
                    let matchingCover;
                    if (member.covers)
                      matchingCover = member.covers.find((cover: any) => cover.coverId === addOnId);


                    if (matchingCover) {
                      // Update addOnCover to true
                      const addOnCoverControl = control.subControls?.find(sub => sub.name === 'addOnCover');
                      if (addOnCoverControl) {
                        addOnCoverControl.value = true;
                      }
                    }
                    if (subControl.innerSubControls) {
                      let tempInnerControl = JSON.parse(JSON.stringify(subControl.innerSubControls[0]));
                      console.log(tempInnerControl, member);

                      // const tempRelationshipType = JSON.parse(member.relationshipType);
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
                              console.log(corecontrol.name, question, newcontrol, newvalue);
                            })
                            console.log(this.formData[control.name][subControl.name][tempRelationshipType.value][index][corecontrol.name], control, subControl, tempRelationshipType.value, index, corecontrol);
                          }
                        })
                      }

                      if (matchingCover) {
                        // Update sumInsured value
                        const sumInsuredControl = tempInnerControl.coreControls.find(
                          (core: any) => core.name === 'addOnSumInsured'
                        );
                        if (sumInsuredControl) {
                          sumInsuredControl.value = matchingCover.value;
                        }

                        // Update memberCheckbox to true
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

            console.log(this.initializeSubControls(control.subControls));

            this.renewalFormGroup.addControl(control.name, this.initializeSubControls(control.subControls));
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
            // if (control.type === 'multiSelectCheckbox' && control.selectCheckboxOptions) {
            //   // Only call resolveMethod if selectCheckboxOptions is empty
            //   // if (control.selectCheckboxOptions.length === 0) {
            //   //   await this.resolveMethod(control.methodName, control);

            //   // }
            //   // After resolving, add the control to the dynamic form group
            //   const controlGroup = this.fb.group({});
            //   control.selectCheckboxOptions.forEach(option => {
            //     controlGroup.addControl(option.value, new FormControl(false));
            //   });
            //   this.renewalFormGroup.addControl(control.name, controlGroup);
            // }
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

              // console.log(this.form, control.value, this.isQuote, control.name);

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

              }
              if (control.methodName) {
                await this.resolveMethod(control.methodName, control);
                // this.handlePolicyTypeChange(control,control.value);
              }
            }
            if (control.type == 'button' && control.methodName == "checkKycDetail") {
              this.resolveMethod(control.methodName, control);
            }

            // if (control.type == 'radio') {

            //   control.value = control.radioOptions?.find(option => option.selected)?.value || "";

            //   if (control.methodName)
            //     this.callMethod(control.methodName, control);
            // }

            if (control.type == 'custom-radio' && control.methodName) {
              this.resolveMethod(control.methodName, control);
            }
            // const radioOptionsControl = this.renewalFormGroup.get('totalPremium');

            // if (radioOptionsControl) {
            //   radioOptionsControl.valueChanges.subscribe((value: string) => {

            //     this.form.formSections.forEach((section: any) => {
            //       section.formControls.forEach((formControl: any) => {
            //         if (formControl.name == 'totalPremium' && formControl.type == 'custom-radio') {
            //           this.selectedIndex = formControl.radioOptions.findIndex((option: any) => option.value === value);
            //           // if (this.QuoteNumber.length > 0) {
            //           //   this.formData.quoteId = this.QuoteNumber[this.selectedIndex];
            //           // }
            //           this.formData.tenure = this.selectedIndex + 1;
            //           console.log(this.selectedIndex, this.formData);
            //         }
            //       });
            //     });
            //   })
            // }

            if (control.name == 'totalPremium' && this.totalPremium != 0) {
              console.log(this.totalPremium);
              this.renewalFormGroup.addControl(control.name, new FormControl(this.totalPremium, controlValidators));
            }
            else {
              console.log(control);

              this.renewalFormGroup.addControl(control.name, new FormControl(control.value, controlValidators));
              console.log(this.renewalFormGroup.value);

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
        });
      });
      // this.renewalFormGroup.addControl('leadNumber', new FormControl(this.leadnumber));
      //dynamic css
      // this.showHtmlContent = true;
      console.log(this.form);
      console.log(this.renewalFormGroup.value, this.formData);



      // this.flattenObject(this.formData);
      // this.spinner.hide();
    }

    if (this.formSequence[this.getFormIndexValue()].formTitle === 'thankYou') {
      this.isFeedBackModalVisible = true;
    }
    
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

  // async resolveMethod(methodName: string, ...args: any[]): Promise<void> {
  //   if(methodName == 'handlePolicyTypeChange')
  //   console.log(methodName);

  //   // Filter out undefined and null arguments
  //   let filteredArgs = args.filter(arg => arg !== undefined && arg !== null);

  //   // Specific logic for handling certain method names
  //   if (methodName === 'addOrRemoveAdditionalInsuredMember') {
  //     filteredArgs = filteredArgs.slice(-1);
  //   } else if (filteredArgs[filteredArgs.length - 1] === 'add' || filteredArgs[filteredArgs.length - 1] === 'remove') {
  //     filteredArgs.pop();
  //   }

  //   console.log(filteredArgs);

  //   // Resolve the method dynamically
  //   const method = (this as any)[methodName] as Function;
  //   if (method && typeof method === 'function') {
  //     try {
  //       // Call the method with filtered arguments
  //       const result = method.bind(this)(...filteredArgs);
  //       if (methodName == 'uploadSelectedDocument')
  //         console.log("ansjnjasnj");


  //       // If the result is a Promise, await it; otherwise, wrap it in Promise.resolve()
  //       if (result && typeof result.then === 'function') {
  //         console.log(methodName,"inside if");

  //         await result; // It's already a Promise, so await it
  //       } else {
  //         console.log(methodName,"inside else");
  //         await Promise.resolve(result); // Wrap non-Promise results into a Promise
  //       }

  //       // Example logic specific to 'getProposerRelationship'
  //       if (methodName === 'getProposerRelationship') {
  //         console.log("Proposer Relationship");
  //       }
  //     } catch (error) {
  //       console.error(`Error in method ${methodName}:`, error);
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
    console.log('still working');


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


    if (parentControl !== null && parentControl.type == 'combinedCheckbox') {
      console.log(innerControl.dependentControls, event.target.checked, control, parentControl, index, innerControl);
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
            console.log(res);
            if (res.isSuccess && res.data) {
              // Update city and state fields
              this.renewalFormGroup.get('city')?.setValue(res.data.city || '');
              this.renewalFormGroup.get('state')?.setValue(res.data.state || '');

              const zoneControl = this.renewalFormGroup.get('zone');
              const zoneControlValue = this.renewalFormGroup.get('zoneValue');
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

    if (control.onChangeMethod && control.type == 'date') {
      await this.resolveMethod(control.methodName, control, event.target.value);
    }

  }

  // otherMethodControl
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
    console.log(value);

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

  incrementMember(event: any, control: IFormControl, option: any) {
    // Prevent event propagation to the checkbox
    event.stopPropagation();
    const formGroup = this.renewalFormGroup.get(control.name) as FormGroup;
    let index = parseInt(option.value.slice(-1), 10);
    index += 1;
    if ((index <= 4 && this.renewalFormGroup.get('memberPolicyType')?.value == 'Family Floater') || this.renewalFormGroup.get('memberPolicyType')?.value == 'Multi Individual' || this.renewalFormGroup.get('memberPolicyType')?.value == 'Individual') {
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

  getProposerRelationship(control: IFormControl): Promise<any> {

    console.log("member proposer called");


    // Wrapping the asynchronous operation in a promise
    return new Promise((resolve, reject) => {
      const reqData = {
        productId: "1",
        policyType: this.renewalFormGroup.get('memberPolicyType')?.value,
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
          // this.renewalFormGroup.removeControl('insuredMembers');

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
          // this.renewalFormGroup.addControl(control.name, controlGroup);

          // Update control with the fetched options
          // control.selectCheckboxOptions = res.data.relationShip;

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
          this.renewalFormGroup.removeControl('insuredMembers');

          // Add the new insuredMembers control
          this.renewalFormGroup.addControl(control.name, controlGroup);

          console.log(control);

          // this.form.formSections.forEach((section: any) => {
          //   section.formControls.forEach((control: any) => {
          //     if (control.name === 'insuredMembers') {
          //       // Loop the options and see if the option has value true in the insuredMembers in formData
          //       control.selectCheckboxOptions.forEach((option: any) => {
          //         if (this.formData.insuredMembers[option.value] === true) {
          //           // Call memberSelected function (pass null for event if not triggering through UI)
          //           console.log(this.renewalFormGroup.get('insuredMemberDetails'));
          //           (this.renewalFormGroup.get('insuredMemberDetails') as FormArray).controls.forEach((member : any)=>{
          //             if(member.get('relation')== option.value){
          //               member.get('relationshipType')?.setValue(JSON.stringify(option));
          //             }
          //           })

          //         }
          //       });
          //     }
          //   });
          // });
          console.log(this.formData, this.form, this.renewalFormGroup);

          this.flattenObject(this.formData);


        }),
        tap(() => {
          // Hide the spinner once the response is processed
          // this.spinner.hide();
        })
      ).subscribe({
        next: (res) => {
          // Resolve the promise when API response is processed successfully
          resolve(res);
        },
        error: (err) => {
          // Hide the spinner and handle error
          console.error(err);
          // this.spinner.hide();

          // Reject the promise on error
          reject(err);
        }
      });
    });
  }

  async onSubmit(control: any) {
    console.log(this.renewalFormGroup.value, this.form, this.renewalFormGroup);
    if (this.renewalFormGroup.valid) {
      this.formData = { ...this.formData, ...this.renewalFormGroup.getRawValue() };
      console.log("formData", this.formData);



      this.formData = { ...this.formData, ...this.renewalFormGroup.getRawValue() };

      if (this.form.saveBtnFunction) {
        await this.resolveMethod(this.form.saveBtnFunction);
      } else if (control != null && control.onClickMethod) {
        await this.resolveMethod(control.onClickMethod);
      }

      if (this.getFormIndexValue() < this.formSequence.length - 1) {
        this.incrementIndex();
        this.getFormDataFromFormSequence();
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
        // if (firstInvalidTabIndex !== null) {
        //   // Navigate to the first invalid tab
        //   this.activeMemberTabIndex = firstInvalidTabIndex;
        //   // this.changeDetectorRef.detectChanges(); // Ensure change detection syncs the tab
        // }
      }
    }

  }

  handlePolicyTypeChange(control: any, planType: string | null = null): void {
    // const sumInsuredControl = this.renewalFormGroup.get('memberSumInsured');
    // const pincodeControl = this.renewalFormGroup.get('pincode');
    // if (sumInsuredControl || pincodeControl) {
    console.log(this.form);
    console.log(planType, control, this.renewalFormGroup.value);

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
    //   console.error('Sum Insured Control or Pincode Control not found in renewalFormGroup.');
    // }

  }




  resetInsuredMembers(control: any, planType: any) {
    console.log(this.form, control, planType);

    this.renewalFormGroup.get('numberOfInsuredMembers')?.setValue(0);
    // this.renewalFormGroup.removeControl('insuredMemberDetails');
    if (planType === 'Multi Individual') {

      if (control.dependentControls)
        this.changeMainFormDependentControls(control.dependentControls, false, control.name);


      // this.form.formSections.forEach((section: any) => {
      //   if (section.sectionTitle == "Insured Member Details") {
      //     section.formControls[0].visible = true;
      //     if (section.formControls[1]) {
      //       section.formControls[1].visible = false;
      //       while (section.formControls[1].dynamicControls.length > 1) {
      //         section.formControls[1].dynamicControls.pop();
      //       }
      //     }
      //     section.visible = false;
      //   }
      // });
    }
    else if (planType === 'Family Floater') {
      if (control.dependentControls)
        this.changeMainFormDependentControls(control.dependentControls, true, control.name);
      console.log(this.form);

      // this.form.formSections.forEach((section: any) => {
      //   if (section.sectionTitle == "Insured Member Details") {
      //     section.formControls[0].visible = false;
      //     section.formControls[1].visible = true;
      //     while (section.formControls[0].dynamicControls.length > 1) {
      //       section.formControls[0].dynamicControls.pop();
      //     }
      //     section.visible = false;
      //   }
      // });
    }
    else {
      if (control.dependentControls)
        this.changeMainFormDependentControls(control.dependentControls, false, control.name);
      // this.form.formSections.forEach((section: any) => {
      //   if (section.sectionTitle == "Insured Member Details") {
      //     section.formControls[0].visible = false;
      //     section.formControls[1].visible = false;

      //     while (section.formControls[0].dynamicControls.length > 1) {
      //       section.formControls[0].dynamicControls.pop();
      //     }

      //     while (section.formControls[1].dynamicControls.length > 1) {
      //       section.formControls[1].dynamicControls.pop();
      //     }

      //   }
      // });
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

    // const tempIndex = this.activeMemberTabIndex;
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
                        let dparentControl = this.renewalFormGroup.get(control.name) as FormGroup;
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
                          // this.initializeSubControls(innerControl.innerControls, dinnercontrol)
                        }
                        else if (innerControl.innerControls && innerControl.visible == false) {
                          Object.keys(dinnercontrol.controls).forEach((element: any) => {
                            dinnercontrol.removeControl(element);
                          });
                        }
                        console.log(this.renewalFormGroup);
                      }
                    })
                    // console.log(subControl.innerSubControls[controlIndex],this.renewalFormGroup); 
                  }
                })
              }
              else if (control.name === dependentName) {
                control.visible = dependentVisibility;
                if (dependentVisibility) {
                  console.log(control.name);

                  let controlValidators: any = [];
                  control.validators?.forEach((val: IValidator) => {
                    if (val.validatorName === 'required') controlValidators.push(Validators.required);
                    if (val.validatorName === 'email') controlValidators.push(Validators.email);
                    if (val.validatorName === 'minlength') controlValidators.push(Validators.minLength(val.minLength as number));
                    if (val.validatorName === 'maxlength') controlValidators.push(Validators.maxLength(val.maxLength as number));
                    if (val.validatorName === 'pattern') controlValidators.push(Validators.pattern(val.pattern as string));
                  });
                  console.log(controlValidators);

                  this.renewalFormGroup.get(control.name)?.setValidators(controlValidators);
                  console.log(control);
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
        // this.changeDetectorRef.detectChanges();
      }
    }, 0);

    // this.activeMemberTabIndex = tempIndex;
    console.log(this.form);
  }

  addCustomValidation(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const controlGroup = this.renewalFormGroup.get('insuredMembers') as FormGroup;
      if (controlGroup && this.renewalFormGroup.get('planType')?.value == 'Multi Individual') {
        const hasAtLeastOneSelected = Object.keys(controlGroup.controls).some(
          key => controlGroup.controls[key].value === true
        );
        console.log(hasAtLeastOneSelected);

        return hasAtLeastOneSelected ? null : { required: true };
      }
      else if (controlGroup && this.renewalFormGroup.get('memberPolicyType')?.value == 'Family Floater') {
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

  memberSelected(event: Event | null, option: any, controls: any) {
    // const checkbox = event.target as HTMLInputElement;
    // console.log(this.kidCount,option);
    // if (event != null) {
    //   this.isQuote = false;
    // }
    console.log(option, this.existingRelations);

    if (event != null) {
      if (this.existingRelations.some(relation => relation.includes(option.value))) {
        const selectedCheckbox = event.target as HTMLInputElement;
        selectedCheckbox.checked = true;
        return;
      }
    }

    const checkbox = event ? (event.target as HTMLInputElement) : { checked: true };
    // console.log(checkbox);
    // this.kidCount >= 4 &&
    if (checkbox.checked && this.renewalFormGroup.get('memberPolicyType')?.value == 'Family Floater') {
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
            //   this.renewalFormGroup.get("totalPremium")?.setValue("");
            // }

            if (formControl.name == controls.idProperty && formControl.dynamicControls && formControl.visible == true) {
              console.log(option);

              // if (option.value.includes('Son') || option.value.includes('Daughter')) {
              //   this.kidCount++;
              // }
              formsection.visible = true;
              // if (this.isQuote == true && this.isPolicyDetailsFetch) {
              //   formControl.dynamicControls = formControl.dynamicControls.slice(0, 1);
              //   console.log(this.form, this.renewalFormGroup.value);
              //   this.isQuote = false;
              // }
              let tempControl = formControl.dynamicControls[0].map((element: any) => ({ ...element }));

              tempControl[1].value = option.value;
              tempControl[0].value = option;
              console.log(tempControl);
              // if (this.isQuote) {
              //   tempControl.forEach((temp) => {
              //     if (temp.name == 'zoneValue') {
              //       temp.options = this.formData['upgradableZones'];
              //     }
              //   })
              // }
              formControl.dynamicControls?.push(tempControl);
              console.log(this.form);

              let formArr = this.renewalFormGroup.get(controls.idProperty) as FormArray;
              // let formArr;
              console.log(formArr, formControl.dynamicControls);


              if (formArr != null) {
                formArr = this.renewalFormGroup.get(controls.idProperty) as FormArray;
                formArr.push(this.initializeDynamicFormControls(tempControl, formControl.dynamicControls.length - 1));
              }
              else {
                formArr = this.fb.array([]);
                formArr.push(this.initializeDynamicFormControls(tempControl, formControl.dynamicControls.length - 1));
                this.renewalFormGroup.addControl(controls.idProperty, formArr);
              }



              // if (checkbox.checked == true && option.value == 'Self') {
              //   // let index = formControl.dynamicControls?.findIndex((element:any) => JSON.parse(element[0].value)?.value == option.value);
              //   let index = -1;
              //   let memberupgradableZones: IOptions[] = [];
              //   console.log(formControl.dynamicControls);

              //   if (formControl.dynamicControls) {
              //     for (let i = 0; i < formControl.dynamicControls.length; i++) {
              //       let element = formControl.dynamicControls[i];
              //       console.log(element);

              //       try {
              //         console.log(element[0]);

              //         let parsedValue = JSON.parse(element[0].value);
              //         if (parsedValue.value === option.value) {
              //           element.forEach((control: any) => {
              //             if (control.name == 'memberdob' || control.name == 'memberAge' || control.name == 'memberGender' || control.name == 'emailId' || control.name == 'firstName' || control.name == 'lastName' || control.name == 'sumInsured') {
              //               control.disabled = true
              //             }
              //             if (control.name == 'zoneValue') {
              //               this.form.formSections.forEach(formSection => {
              //                 formSection.formControls.forEach(formcontrol => {
              //                   if (formcontrol.name == control.name) {
              //                     control.options = formcontrol.options;
              //                     memberupgradableZones = formcontrol.options || [];
              //                   }
              //                 });
              //               });
              //             }
              //           })
              //           index = i;
              //           break;
              //         }
              //       } catch (e) {
              //         console.error('Error parsing JSON:', e);
              //       }
              //     }
              //   }

              //   console.log(this.renewalFormGroup.value, this, this.renewalFormGroup);

              //   // if ((this.renewalFormGroup.get(controls.idProperty) as FormArray)?.controls[index - 1]) {
              //     (this.renewalFormGroup.get(controls.idProperty) as FormArray)?.controls[index - 1].get('memberdob')?.setValue(this.renewalFormGroup.get('memberDobProposer')?.value);
              //     (this.renewalFormGroup.get(controls.idProperty) as FormArray)?.controls[index - 1].get('memberAge')?.setValue(this.renewalFormGroup.get('memberAgeProposer')?.value);
              //     (this.renewalFormGroup.get(controls.idProperty) as FormArray)?.controls[index - 1].get('memberGender')?.setValue(this.renewalFormGroup.get('proposerGender')?.value);
              //     (this.renewalFormGroup.get(controls.idProperty) as FormArray)?.controls[index - 1].get('pincode')?.setValue(this.renewalFormGroup.get('proposerPincode')?.value);
              //     (this.renewalFormGroup.get(controls.idProperty) as FormArray)?.controls[index - 1].get('zone')?.setValue(this.renewalFormGroup.get('zone')?.value);
              //     (this.renewalFormGroup.get(controls.idProperty) as FormArray)?.controls[index - 1].get('zoneValue')?.setValue(this.renewalFormGroup.get('zoneValue')?.value);
              //     (this.renewalFormGroup.get(controls.idProperty) as FormArray)?.controls[index - 1].get('emailId')?.setValue(this.renewalFormGroup.get('emailId')?.value);
              //     (this.renewalFormGroup.get(controls.idProperty) as FormArray)?.controls[index - 1].get('firstName')?.setValue(this.renewalFormGroup.get('firstName')?.value);
              //     (this.renewalFormGroup.get(controls.idProperty) as FormArray)?.controls[index - 1].get('middleName')?.setValue(this.renewalFormGroup.get('middleName')?.value);
              //     (this.renewalFormGroup.get(controls.idProperty) as FormArray)?.controls[index - 1].get('lastName')?.setValue(this.renewalFormGroup.get('lastName')?.value);
              //     (this.renewalFormGroup.get(controls.idProperty) as FormArray)?.controls[index - 1].get('mobileNumber')?.setValue(this.renewalFormGroup.get('mobileNumber')?.value);
              //     (this.renewalFormGroup.get(controls.idProperty) as FormArray)?.controls[index - 1].get('preFix')?.setValue(this.renewalFormGroup.get('preFix')?.value);
              //     (this.renewalFormGroup.get(controls.idProperty) as FormArray)?.controls[index - 1].get('height')?.setValue(this.renewalFormGroup.get('height')?.value);
              //     (this.renewalFormGroup.get(controls.idProperty) as FormArray)?.controls[index - 1].get('weight')?.setValue(this.renewalFormGroup.get('weight')?.value);
              //     (this.renewalFormGroup.get(controls.idProperty) as FormArray)?.controls[index - 1].get('heightInches')?.setValue(this.renewalFormGroup.get('heightInches')?.value);
              //     console.log(memberupgradableZones);

              //     (this.renewalFormGroup.get(controls.idProperty) as FormArray)?.controls[index - 1].get('upgradableZones')?.setValue(memberupgradableZones);

              //     console.log(this.renewalFormGroup.value);
              //   // }


              // }
              console.log(this.renewalFormGroup.get('memberPolicyType')?.value);

              if (this.renewalFormGroup.get('memberPolicyType')?.value == 'Family Floater') {
                console.log((this.renewalFormGroup.get(controls.idProperty) as FormArray));

                (this.renewalFormGroup.get(controls.idProperty) as FormArray)?.controls.forEach((control: any) => {
                  control.get('sumInsured')?.setValue(this.renewalFormGroup.get('sumInsured')?.value);
                })
              }
              console.log(typeof this.renewalFormGroup.get('numberOfInsuredMembers')?.value, this.renewalFormGroup.get('numberOfInsuredMembers')?.value);

              this.renewalFormGroup.get('numberOfInsuredMembers')?.setValue(this.renewalFormGroup.get('numberOfInsuredMembers')?.value + 1);
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
          //       let formArr = this.renewalFormGroup.get(controls.idProperty) as FormArray;
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
          //     this.renewalFormGroup.get('numberOfInsuredMembers')?.setValue(this.renewalFormGroup.get('numberOfInsuredMembers')?.value - 1);
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
              // if (option.value.includes('Son') || option.value.includes('Daughter')) {
              //   this.kidCount--;
              // }

              // Find the index of the dynamic control to be removed
              let index = formControl.dynamicControls?.findIndex((element: any) => element[1].value == option.value);

              if (index !== undefined && index !== -1) {
                // Remove the dynamic control from formControl.dynamicControls
                formControl.dynamicControls?.splice(index, 1);

                // Remove the corresponding FormArray element
                let formArr = this.renewalFormGroup.get(controls.idProperty) as FormArray;
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
                this.renewalFormGroup.get('numberOfInsuredMembers')?.setValue(
                  this.renewalFormGroup.get('numberOfInsuredMembers')?.value - 1
                );
              }
            }
          }

        });
      })
      // const numberOfInsuredMembersControl = this.renewalFormGroup.get('numberOfInsuredMembers');
      // if (numberOfInsuredMembersControl) {
      //   const numberOfInsuredMembers = numberOfInsuredMembersControl.value;

      const insuredMembersFormGroup = this.renewalFormGroup.get('insuredMembers') as FormGroup;
      if (insuredMembersFormGroup) {
        insuredMembersFormGroup.setValidators(this.addCustomValidation());
        // console.log(this.addCustomValidation());

        insuredMembersFormGroup.updateValueAndValidity();
        console.log(this.renewalFormGroup.get('insuredMembers'));

      }
      // }

      // this.updateValueAndGroupError(this.renewalFormGroup.get(controls.name) as FormGroup);
    }
  }

  flattenObject(obj: any, prefix = '') {
    console.log(obj);
    Object.keys(obj).forEach(key => {
      const value = obj[key];
      const newKey = prefix + key;
      // console.log(newKey);
      if (key == 'criticalIllness') {
        console.log(this.formData[key], this.renewalFormGroup.get(key), typeof this.renewalFormGroup.get(key));

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
        if (this.renewalFormGroup.get(newKey) && this.renewalFormGroup.get(newKey)?.value == "") {
          this.renewalFormGroup.get(newKey)?.patchValue(value);
        }
      }
    });
    console.log(this.renewalFormGroup.value);

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

  /* AddOn Related Method */

  onCheckboxChange(event: any, control: any, parentControl: any = null, index: number | null = null) {
    console.log(event, event.target, control, parentControl, index, this.renewalFormGroup);

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
        const firstKey = Object.keys((this.renewalFormGroup.get(parentControl.name) as FormGroup)?.controls)[0];
        (this.renewalFormGroup.get(parentControl.name) as FormGroup)?.controls[firstKey].setValue(false);
        this.showOverlay(parentControl);
      }

      if (parentControl != null && parentControl.type == 'questionnaire') {
        const arrayName = (control.name).charAt(0).toUpperCase() + (control.name).slice(1);
        console.log('questionnaire', arrayName, event.target.checked);
        parentControl.subControls.forEach((subControl: any) => {
          if (subControl.name === arrayName) {
            subControl.visible = event.target.checked;
            console.log(subControl, event.target.value);
            let parentCode = this.renewalFormGroup.get(parentControl.name) as FormGroup;
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
        // console.log(parentControl,this.renewalFormGroup.get(parentControl.name),this.renewalFormGroup);

        parentControl.subControls.forEach((subControl: any) => {
          if (subControl.innerSubControls) {
            for (let i = 1; i < subControl.innerSubControls.length; i++) {
              console.log(subControl.innerSubControls[i]);

              if (subControl.innerSubControls[i].coreControls) {
                for (let j = 0; j < subControl.innerSubControls[i].coreControls.length; j++) {
                  console.log(subControl.innerSubControls[i].coreControls[j], this.renewalFormGroup.get(`${parentControl.name}.${subControl.name}.${subControl.innerSubControls[i].name}.${j}.${subControl.innerSubControls[i].coreControls[j].name}`));
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

              let formArray = (this.renewalFormGroup.get(parentControl.name) as FormGroup)?.controls[arrayName] as FormArray;
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
              console.log(this.formData, this.renewalFormGroup.value, this.form);
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
    console.log(this.renewalFormGroup, this.form);
  }

  //new add On added
  addOnAdded(control: any, parentControl: any = null) {
    let addOnData = this.renewalFormGroup.get(parentControl.name)?.value;
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

  //New Remove addOn
  addOnRemoved(control: any, parentControl: any = null) {
    let addOnData = this.renewalFormGroup.get(parentControl.name)?.value;
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

      console.log(memberDetails, count);

      console.log((this.renewalFormGroup.get(parentControl.name) as FormGroup)?.controls)
      // ?.controls[0].setValue(false);
      let control = this.renewalFormGroup.get(parentControl.name) as FormGroup;
      if (control) {
        const firstKey = Object.keys((this.renewalFormGroup.get(parentControl.name) as FormGroup)?.controls)[0];
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
    // formControl?.markAsTouched();
    return formControl ? formControl.value : null;
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
    console.log(control, this.renewalFormGroup);

    // console.log(this.formData[control.name][i-1].relationshipType,control,i);
    // const imagePath = JSON.parse(this.formData[control.name][i - 1].relationshipType)?.imagePath;
    console.log((this.renewalFormGroup.get(control.name) as FormArray)?.controls[i - 1].value);

    const imagePath = (this.renewalFormGroup.get(control.name) as FormArray)?.controls[i - 1].value['relationshipType'].imagePath;
    console.log(imagePath);

    // console.log(this.formData[control.name],control,i,imagePath);
    return imagePath;
  }

  selectTab(tabName: string) {
    this.activeTab = tabName;
    this.expandedItem = '';
  }

  toggleContent(index: number): void {
    this.expandedCardIndex = this.expandedCardIndex === index ? null : index;
  }

  //payment methods
  onButtonClick(control: any) {
    this.selectedButton = control.name;
    console.log(this.selectedButton);

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
                controlToHide.visible = false; // Hide dependent controls for offline
              }
            });
          }
        });
      });
    } else {
      this.form.formSections.forEach((section: any) => {
        section.formControls.forEach((controls: any) => {
          if (controls.name !== 'offline' && controls.dependentControls) {
            controls.dependentControls.forEach((item: any) => {
              const controlToHide = this.form.formSections
                .flatMap((sec: any) => sec.formControls)
                .find((ctrl: any) => ctrl.name === item);
              if (controlToHide) {
                controlToHide.visible = false; // Hide dependent controls for other buttons
              }
            });
          }
        });
      });
    }


    console.log(control);


    // Handle showing dependent controls if any are specified for the clicked button
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

  // getall bank details
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
    this.renewalFormGroup.get('ifscCode')?.setValue(data.id);
    this.renewalFormGroup.get('micrCode')?.setValue(data.value);
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
    const control = this.renewalFormGroup.get(inputName);
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
      if (this.selectedButton) {
        try {
          // const policyNum = this.proposalNum.replace(/-/g, "");
          const policyNum = this.formData.policyNumber.replace(/-/g, "");
          console.log("kjsdajlkda", policyNum);

          const formData = new FormData();
          formData.append("Files", this.selectedFile);
          formData.append("UniqueNumber", policyNum);

          console.log(formData, this.selectedFile, this.policyNumber);

          this.commonService.uploadDocument(formData).subscribe(
            async (res: any) => {
              if (res.isSuccess) {
                console.log("response after success", res);
                console.log("unique id", res.data.uploadResponse[0].globalId);
                this.documentId = res.data.uploadResponse[0].globalId;

                try {
                  console.log(this.journeyProcess ? "await this.fullQuotation()" : "await this.getFullQuoteViaOfflinePayment()");

                  this.journeyProcess ? await this.fullQuotation() : await this.getFullQuoteViaOfflinePayment();

                  // Await the getFullQuoteViaOfflinePayment call to ensure completion before resolving
                  // await this.getFullQuoteViaOfflinePayment();
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
      } else {
        this.toast.warning({
          detail: "WARNING",
          summary: "Please select Payment Mode.",
          duration: 3000,
        });
      }
    });
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
      this.decrementIndex()
      this.getFormDataFromFormSequence();
    }
  }
  async getFullQuoteViaOfflinePayment(): Promise<void> {
    return new Promise((resolve, reject) => {
      const data = this.renewalFormGroup.value;
      console.log(data);

      const offlinePaymentRequestBody = {
        "policyType": "Renewal",
        "paymentMethod": "Offline",
        "source": "Retail",
        "instrumentType": data.paymentOption,
        "premiumAmount": data.totalPremium,
        "instrumentNo": data.chequeNumber,
        "instrumentDate": data.chequeDate,
        "policyNumber": this.policyNumber,
        "proposalNum": this.proposalNum,
        "agentCode": this.agentCode,
        "bankName": JSON.parse(data.paymentBankName).value,
        "ifsc": data.ifscCode,
        "micrNo": data.micrCode,
        "bankAccountNumber": data.accountNumber,
        "documentId": this.documentId,
        "productName": this.formData.productName
      };
      console.log("offlinePaymentRequestBody", offlinePaymentRequestBody);
      this.renewalService.getFullQuoteApi(offlinePaymentRequestBody).subscribe(
        (res: any) => {
          if (res.isSuccess) {
            this.formData.status = res.data.status || null;
            this.formData.policyStartDate = res.data.policyStartDate || null;
            this.formData.policyEndDate = res.data.policyEndDate || null;
            this.formData.receiptID = res.data.receiptID || null;
            this.formData.customerId = res.data.customerId || null;
            this.formData.premiumPaid = res.data.premiumPaid || null;
            this.incrementIndex();
            this.getFormDataFromFormSequence();

            // this.fullQuoteResponse=res.data;          
            // this.setSection('thankyou')
            // this.hideSection=false
            // this.isFeedBackModalVisible = true;
            console.log(res.data);

          }
          else {
            this.toast.error({ detail: '', summary: res.message || "Failed to do Payment", duration: 3000 });
          }
        },
        (err) => {
          this.toast.error({ detail: '', summary: 'Failed to do offline payment.', duration: 3000 });
          console.log("error is coming from fullquote api");
        })
    });
  }

  mergeMember(control: any) {
    const a = Object.keys(this.formData.insuredMembers).filter(
      key => this.formData.insuredMembers[key] === true
    );
    control.value = a;
    console.log(control, this.formData, a);
  }

  getNomineeRelationShip(control: any) {
    this.yatraService.getNomineeRelationship().subscribe({
      next: (res: any) => {
        console.log(res);
        control.options = res.data;
        control.options.forEach((option: any) => {
          // if(option.name == this.formData)
        })
      },
      error: (err) => {
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

  //get-Premium
  async getPremiumAmount() {
    // console.log(this.tenureAmount, this.formData.insuredMemberDetails, this.isQuote, Object.keys(this.formData).length);

    console.log(this.renewalFormGroup.getRawValue());

    // if (this.changesMade) {
    //   this.changeRecalculate(false);
    // }
    this.changeRecalculate(false);

    const data = this.formData;
    console.log(data);


    const requestPayload = {
      productId: data.productId,
      agentCode: this.agentCode.toString(), // Fill in agent code manually if available
      proposerPincode: data.proposerPincode || "",
      productCode: data.planCode || "", // Assuming planCode maps to productCode
      memberPolicyType: data.memberPolicyType || "",
      typeOfBusiness: data.typeOfBusiness || "",
      isEmployee: data.isEmployee || false,
      sumInsured: data.insuredMemberDetails?.[0]?.sumInsured || "",
      numberOfInsuredMembers: data.numberOfInsuredMembers || "",
      insuredMemberDetails: data.insuredMemberDetails.map((member: any, index: number) => ({
        roomCategory: "", // If roomCategory is determined dynamically, set it here
        memberAge: this.calculateAge(member.memberDob), // Calculate age from DOB
        sumInsured: member.sumInsured || "",
        isChronic: member.isChronic || "N", // Assuming default as 'N'
        chronicDiseases: member.chronicDiseases || "",
        zone: data.zoneValue || "", // Assuming `zoneValue` is the zone
        memberGender: member.memberGender || "",
        memberDob: member.memberDob || "",
        relation: member.relation || "",
        memberRelationCode: member.relationshipType?.relationCode || "",
        natureOfDuty: member.productMemberNatureWork || "",
        riskClass: "", // Risk class not provided in the input data
        designation: member.productMemberDesignation || "",
        covers: this.covers[index] || []
      }))
    };
    console.log("fdgfhjkhgg", requestPayload);

    let reqData = {
      "agentCode": this.agentCode,
      "productId": this.formData.productId,
      "quoteData": JSON.stringify(requestPayload)
    };

    console.log(reqData);


    try {
      const res: any = await new Promise((resolve, reject) => {
        this.commonService.GetSingleProductQuote(reqData).subscribe({
          next: (response) => resolve(response),
          error: (error) => reject(error)
        });
      });

      console.log(res);


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
        this.renewalFormGroup.get('tenureAmount')?.setValue(this.tenureAmount);
        this.renewalFormGroup.get('displayTaxList')?.setValue(this.displayTaxList);
      }

      console.log(this.formData, this.form, this.renewalFormGroup.value);

      sessionStorage.setItem("allFormData", this.encryptionService.encrypt(this.formData));

      // After setting tenureAmount and discountList, call setPremiumAmount()
      this.setPremiumAmount();

    } catch (error) {
      console.error("Error while fetching product tenure", error);
    } finally {
      // this.spinner.hide();
    }

    // if (this.isQuote === false) {
    //   if (Object.keys(this.formData).length > 0) {

    //     // this.formData.insuredMemberDetails.forEach((member: any) => {
    //     //   member['covers'] = member['covers'] ?? [];
    //     //   member['isChronic'] = member['isChronic'] ?? "No";
    //     //   member['chronicDiseases'] = member['chronicDiseases'] ?? null;
    //     //   member['roomCategory'] = member['roomCategory'] ?? "";

    //     //   if (!member.hasOwnProperty('memberRelationCode')) {
    //     //     const relationCodeMap: { [key: string]: number } = {
    //     //       'Self': 24,
    //     //       'Spouse': 22,
    //     //       'Son': 23,
    //     //       'Daughter': 19
    //     //     };
    //     //     member['memberRelationCode'] = relationCodeMap[member.relation] ?? null;
    //     //   }
    //     // });

    //     this.formData.insuredMemberDetails.forEach((member: any, index: number) => {
    //       // Initialize member's properties with default values if undefined
    //       member['covers'] = this.covers[index] ?? [];
    //       member['isChronic'] = member['isChronic'] ?? "No";
    //       member['chronicDiseases'] = member['chronicDiseases'] ?? null;
    //       member['roomCategory'] = member['roomCategory'] ?? "";

    //       // Set memberRelationCode based on a predefined mapping, if it doesn't already exist
    //       if (!member.hasOwnProperty('memberRelationCode')) {
    //         const relationCodeMap: { [key: string]: number } = {
    //           'Self': 24,
    //           'Spouse': 22,
    //           'Son': 23,
    //           'Daughter': 19
    //         };
    //         member['memberRelationCode'] = relationCodeMap[member.relation] ?? null;
    //       }
    //     });


    //     this.formData['sumInsured'] = this.formData['sumInsured'] ?? this.formData.insuredMemberDetails[0].sumInsured;
    //     this.formData['familySize'] = this.formData.insuredMemberDetails.length + 'A';
    //     this.formData['proposerName'] = this.formData['firstName'] + this.formData['lastName'];

    //     if (this.formData.memberPolicyType === 'Family Floater') {
    //       const pincode = this.formData.memberPolicyType === 'Family Floater'
    //         ? this.formData['proposerPincode']
    //         : this.formData.insuredMemberDetails[0].pincode;
    //       const zone = this.formData['zone'];
    //       const zoneValue = this.formData['zoneValue'];
    //       this.formData.insuredMemberDetails.forEach((member: any) => {
    //         member.pincode = pincode
    //         member.zone = zone;
    //         member.zoneValue = zoneValue;
    //       });
    //     }


    //     console.log(this.formData);

    //     let reqData = {
    //       "agentCode": this.agentCode,
    //       "productId": this.productId,
    //       "quoteData": JSON.stringify(this.formData)
    //     };

    //     console.log(reqData);

    //     try {
    //       const res: any = await new Promise((resolve, reject) => {
    //         this.commonService.GetSingleProductQuote(reqData).subscribe({
    //           next: (response) => resolve(response),
    //           error: (error) => reject(error)
    //         });
    //       });

    //       // Update tenureAmount and discountList after receiving the response
    //       this.QuoteNumber = [];
    //       for (let i = 1; i <= 3; i++) {
    //         const premiumKey = `tenure${i}Premium`;
    //         const discountKey = `t${i}DiscountPercentage`;
    //         const Quote = `tenure${i}QuoteNumber`;
    //         this.QuoteNumber.push(res.data[Quote]);

    //         this.tenureAmount[i - 1] = Math.round(res.data[premiumKey]);
    //         this.discountList[i - 1] = res.data[discountKey] ? res.data[discountKey] : 0;
    //       }

    //       this.formData.quoteId = this.QuoteNumber[this.selectedIndex];
    //       if (this.form.formTitle === 'Leads') {
    //         // this.formData.tenureAmount = this.tenureAmount;
    //         // this.formData.displayTaxList = this.displayTaxList;
    //         this.renewalFormGroup.get('tenureAmount')?.setValue(this.tenureAmount);
    //         this.renewalFormGroup.get('displayTaxList')?.setValue(this.displayTaxList);
    //       }

    //       console.log(this.formData, this.form, this.renewalFormGroup.value);

    //       sessionStorage.setItem("allFormData", this.encryptionService.encrypt(this.formData));

    //       // After setting tenureAmount and discountList, call setPremiumAmount()
    //       this.setPremiumAmount();

    //     } catch (error) {
    //       console.error("Error while fetching product tenure", error);
    //     } finally {
    //       this.spinner.hide();
    //     }
    //   }
    // }
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
        return 'invalid'; // Less than 91 days is not valid
      }
      return `${diffInDays}days`; // Return age in 'days' format
    }

    return `${age}`;
  }

  setPremiumAmount(control?: any) {
    if (this.form.formTitle == 'Total Premium') {
      console.log("Hello world");

    }
    if (this.formData.tenure) {
      this.selectedIndex = this.formData.tenure - 1;
    }
    console.log(this.renewalFormGroup.value, this.form, this.displayTaxList, this.selectedIndex, this.formData, this.QuoteNumber);
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
                //   this.renewalFormGroup.value.totalPremium = this.tenureAmount[index];
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
                //   this.renewalFormGroup.value.totalPremium = this.tenureAmount[index];
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
                //   this.renewalFormGroup.value.totalPremium = this.tenureAmount[index];
                //   this.selectedIndex = index;
                //   this.formData.tenure = this.selectedIndex + 1;
                // }
              }
              console.log(this.selectedIndex, index);

              if (this.selectedIndex === index) {
                let radioOptionsControl = this.renewalFormGroup.get('totalPremium');
                if (!radioOptionsControl) {
                  // Add control if it doesn't exist
                  this.renewalFormGroup.addControl(formControl.name, new FormControl(this.tenureAmount[index]));
                  // radioOptionsControl = this.renewalFormGroup.get('totalPremium');
                }

                // if (radioOptionsControl) {
                //   radioOptionsControl.setValue(this.tenureAmount[this.selectedIndex], { emitEvent: true });
                //   // this.renewalFormGroup.value.totalPremium = this.tenureAmount[this.selectedIndex];
                // }
                option.selected = true;
                if (this.renewalFormGroup.value.totalPremium) {

                  this.renewalFormGroup.value.totalPremium = this.tenureAmount[this.selectedIndex];
                }
                console.log(this.renewalFormGroup.value);

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
    console.log(this.renewalFormGroup.value, this.formData);
  }
  jsonParse(string: any, extract: any) {
    const value = JSON.parse(string);
    return value[extract];
  }

  async mappedFormDataFullQuote(formData: any): Promise<Partial<IFullQuoteMapping>> {
    const nomineeAge: any = await this.calculateAge(formData?.nomineeDob);
    console.log(formData, this.covers);

    const mappedData: Partial<IFullQuoteMapping> = {
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
          // memberrelationCode: this.jsonParse(member.relationshipType, 'id') || '',
          memberSalutation: member?.preFix || '',
          firstName: member?.firstName || '',
          middleName: member?.middleName || '',
          lastName: member?.lastName || '',
          height: member?.height || '',
          heightInInches: member?.heightInches || '',
          weight: member?.weight || '',
          memberdob: member?.memberDob || '',
          emailId: member?.emailId || '',
          mobileNumber: member?.mobileNumber || '',
          // memberNationality: this.jsonParse(formData.nationality, 'name') || '',
          relationshipType: member.relation || '',
          memberAge: this.calculateAge(member?.memberDob) || '',
          memberGender: member?.memberGender || '',
          // memberPincode: member?.pincode || '',
          // preExistingDisease: member?.preExistingDisease || '',
          // memberIndex: member.memberIndex || '',
          // zone: member?.zone || '',
          // zoneValue: member?.zoneValue || '',
          // state: member?.state || '',
          // city: member?.city || '',
          memberType: member?.memberType || '',
          memberSumInsured: member?.sumInsured || '',
          // memberZone: member?.zoneValue || '',
          memberNatureOfDuty: member?.natureOfDuty || '',
          memberDesignation: member?.designation || '',
          memberOccupation: member?.occupation || '',
          covers: this.covers[index] || [],
          // memberRoomCategory: member?.memberRoomCategory || ''
        };
      }) || [],
      CKYCNo: this.formData?.ckycNo || '',
      // QuoteId: formData?.quoteId || '',
      // LeadId: formData?.leadNumber || '',
      proposerSalutation: formData?.preFix || '',
      proposerFirstName: formData?.firstName || '',
      proposerMiddleName: formData?.middleName || '',
      proposerLastName: formData?.lastName || '',
      proposerDob: formData?.memberDobProposer || '',
      proposerAge: formData?.memberAgeProposer || '',
      proposerGender: formData?.proposerGender || '',
      proposerMobileNumber: formData?.mobileNumber || '',
      proposerWhatsAppNo: formData?.whatsappNo || formData?.mobileNumber,
      proposerAddress1: formData?.proposerAddress1 || '',
      proposerAddress2: formData?.proposerAddress2 || '',
      proposerCity: formData?.city || '',
      proposerState: formData?.state || '',
      proposerEmailId: formData?.emailId || '',
      proposerPincode: formData?.proposerPincode || '',
      // idProof: this.jsonParse(formData?.idProof, 'value') || '',
      // idNo: formData?.idNo || '',
      proposerAnnualIncome: formData?.annualIncome || '',
      proposerOccupation: formData?.occupation || '',
      // proposerEducation: this.jsonParse(formData?.educationDetails, 'id') || '',
      // proposerPANNo: formData?.panNo || '',
      // gstDetails: formData?.gstDetails || '',
      // proposerMaritalStatus: this.jsonParse(formData?.maritalStatus, 'value') || '',
      // ifPEP: formData?.isPep || '',
      // proposerNationality: this.jsonParse(formData.nationality, 'name') || '',
      nomineeFirstName: formData?.nomineeFirstName || '',
      nomineeMidleName: formData?.nomineeMiddleName || '',
      nomineeLastName: formData?.nomineeLastName || '',
      nomineeRelation: formData?.nomineeRelationWithProposer || '',
      nomineeRelationCode: formData?.nomineeRelationWithProposer || '',
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
      PaymentGatewayName: formData?.PaymentGatewayName || '',
      // tenure: formData?.tenure,
    };

    return mappedData;
  }

  async fullQuotation(): Promise<void> {
    return new Promise((resolve, reject) => {
      // this.spinner.show();
      console.log("beforeMap", this.formData);

      this.mappedFormDataFullQuote(this.formData)
        .then((data) => {
          console.log("mapped Data", data);

          const reqData: any = {
            agentCode: this.agentCode,
            productId: this.formData.productId,
            productType: this.formData.productType,
            fullQuoteRequestJson: JSON.stringify(data)
          }
          console.log("reqData", reqData);


          this.yatraService.getFullQuote(reqData).subscribe({
            next: (response: any) => {
              console.log(response);

              if (response?.isSuccess) {
                const responseData = response.data;

                // Setting response data to formData
                // this.formData.policyNumber = responseData.policyNumber || null;
                this.formData.policyStatus = responseData.policyStatus || null;
                this.formData.quoteValidFromDate = responseData.policyStartDate || null;
                this.formData.quoteValidToDate = responseData.policyEndDate || null;
                this.formData.ReceiptNumber = responseData.receiptNumber || null;
                this.formData.customerId = responseData.customerId || null;

                console.log(this.renewalFormGroup.value);

                // Merging updated formData with dynamicFormGroup values
                this.formData = { ...this.formData, ...this.renewalFormGroup.value };

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
              // this.spinner.hide();
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
          // this.spinner.hide();

          // Showing error toast for mapping failure
          this.toast.error({
            detail: "ERROR",
            summary: "Failed to map form data",
            duration: 3000,
          });

          reject(err);
        }); console.log("afterMap", this.formData);

    });
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
    console.log("inside sendPaymentLink",control);
    const sendPaymentRequestBody={
      firstName: this.formData?.firstName,
      lastName: this.formData?.lastName,
      agentcode: this.agentCode,
      emailId: "saisatya@monocept.com",
      productName: this.formData?.productName,
      businessType:"REN",
      pNumber: this.formData?.policyNumber,
      productCode: this.formData?.productCode,
      premiumAmount: this.formData?.totalPremium,
      mobilenumber: "7396201298"
    };
    this.renewalService.sharePaymentLinkApi(sendPaymentRequestBody).subscribe({
      next: (response: any) => {
        console.log("sharePaymentLinkApi",response);
        if (response.data) {
          this.toast.success({detail: "SUCCESS",summary: response.data.message ||"Link has been sent successfully",duration: 3000});
            this.changeMainFormDependentControls(control.dependentControls, true);
            this.renewalFormGroup.get(control.dependentControls[0])?.setValue(response.data.paymentLink);
        } else {
          this.toast.warning({ detail: "WARNING", summary: "Invalid payment link received", duration: 3000 });
        }
      },
      error: (error) => {
        this.toast.error({ detail: "ERROR", summary: "Failed to generate payment link", duration: 3000 });
      }
    });
    

    // this.router.navigate(['renewal/customerRenewalJourney'], {
    //   state: {
    //     formData: this.encryptionService.encrypt(this.formData),
    //     proposalNum: this.encryptionService.encrypt(this.proposalNum),
    //     policyNumber: this.encryptionService.encrypt(this.policyNumber),
    //     journeyProcess: this.encryptionService.encrypt(this.journeyProcess),
    //     formSequence: this.encryptionService.encrypt([customer_payment, thankYou]),
    //     formIndex:"0"
    //   }
    // });
  }

  redirectToJustPay(control: any) {
    console.log(control, "redirectToJustPay");
      if ( this.rowData != null &&!this.rowData.isFullQuoteSuccess) {
        this.toast.warning({detail: "Warning",summary: "Payment was successful, but policy issuance failed. Please wait some time.",duration: 5000});
        return;
      }
    
    // Handle the Juspay redirection for buttons other than Offline
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
        userType:"Agent",
      };
      this.renewalService.justPayRedirection(reqData).subscribe({
        next: (response: any) => {
          console.log('Juspay API Response:', response);

          if (response.data.paymentURL && response.data.paymentURL !== null && response.data.paymentURL !== '') {
            if (this.selectedButton == 'sendLinkButton') {
              console.log(response);
              this.renewalFormGroup.get(control.dependentControls[0])?.setValue(response.data.paymentURL);
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
  checkKycDetail(control: any): void {
    const isVisible = !(this.formData.isKycCompleted);
    // const isVisible=true;
    this.form.formSections.forEach((section) => {
      section.formControls.forEach((formControl: IFormControl) => {
        if (formControl.name === control.name) {
          section.visible = isVisible;
          this.form.formSections[1].visible = !isVisible;
        }
      });
    });
  }

  initiateKycURL() {
    const kycRequestBody = {
      policyNumber: this.policyNumber,
      fullName: this.formData.proposerName,
      panNumber: this.formData.panNo || "", 
      dob: this.formatDate(this.formData.memberDobProposer) || "",
      pepCheck: "No", 
      businessType: "REN",
      userType:"Agent"
    };
    this.renewalService.getkycURL(kycRequestBody).subscribe(
      (res: any) => {
        console.log("kycRequestBody", res);
        window.open(res.data.kycUrl, '_blank');
      },
      (err) => {
        console.log(err);
      }
    );
  }

  shareKycURL(control: any) {
    console.log(control);
    
    const kycRequestBody = {
      policyNumber: this.policyNumber, 
      proposerNumber: "",
      fullName: this.formData.proposerName,
      panNumber: this.formData.panNo || "", 
      dob: this.formatDate(this.formData.memberDobProposer) || "",
      pepCheck: "No",
      businessType: "REN",
      emailId:this.formData.emailId,
      agentCode:this.agentCode,
      MobileNumber:this.formData.mobileNumber,
      ProductName:this.formData.productName,
      ProductCode:this.formData.productCode
    };
    this.renewalService.sharekyclinkApi(kycRequestBody).subscribe(
      (res: any) => {
        console.log("kycResponseBody", res);
        // this.toast.success({
        //   detail: "SUCCESS",
        //   summary: res.message,
        //   duration: 3000,
        // });
        if(res.data.isShareKyc){
          this.toast.success({detail: "SUCCESS",summary: "Link has been sent successfully",duration: 3000});
        }
        this.changeMainFormDependentControls(control.dependentControls,true);
        this.renewalFormGroup.get(control.dependentControls[0])?.setValue(res.data.kycLink);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getDate(dateType: any): string {
    if (dateType === 'currentDate') {
      return this.currentDate;
    } else if (dateType === 'futureDate') {
      return this.futureDate;
    } else if (dateType === 'pastDate') {
      // return this.pastDate;
    }
    return '';
  }
  formatDate(dateString: string | Date): string {
    if (!dateString) return "";

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return ""; // Return empty string if invalid date

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  }

  copyText(control: any) {
    console.log(control);
    this.clipboard.copy(this.renewalFormGroup.get(control.name)?.value);
    this.toast.success({ detail: "SUCCESS", summary: `Text copied to clipboard!`, duration: 3000 });
    // this.messageService.add({severity:'success', summary: 'Success', detail: 'Text copied to clipboard!'});
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

    // console.log(reqData, this.dynamicFormGroup.getRawValue());

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
  
}
