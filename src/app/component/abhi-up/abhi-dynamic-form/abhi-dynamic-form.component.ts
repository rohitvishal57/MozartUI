import { ChangeDetectorRef, ViewEncapsulation, Component, ElementRef, Inject, Renderer2, ViewChild, inject } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { IDynamicControl, IForm, IFormControl, IFormSections, IOptions, ISubControl, IValidator } from 'src/app/interface/form.interface';
import { CommonService } from 'src/app/services/common.service';
import { DOCUMENT, DatePipe } from '@angular/common';
import { NgToastService } from 'ng-angular-popup';
import { HttpClient } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { EncryptionService } from 'src/app/services/encryption.service';
import { Router } from '@angular/router';
import { concatMap, of, tap } from 'rxjs';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-abhi-dynamic-form',
  templateUrl: './abhi-dynamic-form.component.html',
  // styleUrls: ['./abhi-dynamic-form.component.scss']
  encapsulation: ViewEncapsulation.None,
})
export class AbhiDynamicFormComponent {
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
  bankName: any;
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

  agencyCode: any;
  premiumDetails: any[][] = [];
  taxList: number[] = [];
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
  productStartDate: any;
  productEndDate: any;
  parentControl: any;
  isAHPAAdded: boolean = false;
  AHPARiskValue: any;
  showPopup: boolean = false;
  showDoneButton = true;

  partnerId: any
  productId: any

  displayTaxList: any[] = [];
  currentDate = new Date().toISOString().split('T')[0];
  selectedButton: string | null = null;
  collapsedSections: { [key: string]: boolean } = {};
  isOverlayVisible = false;
  isQuote: any;

  constructor(private renderer: Renderer2, private el: ElementRef,
    public service: CommonService,private adminService: AdminService, private router: Router, private http: HttpClient, private spinner: NgxSpinnerService,
    private toast: NgToastService, private datePipe: DatePipe, private changeDetectorRef: ChangeDetectorRef,
    private encryptionService: EncryptionService, @Inject(DOCUMENT) private document: Document) { }

  ngOnInit() {
    this.spinner.show();
    this.showHtmlContent = false;
    this.formSequence = history.state.formSequence;
    console.log(this.formSequence);
    this.Code = localStorage.getItem('code');
    // this.verticalCode = localStorage.getItem('verticalCode');
    // this.insurancetypecode = history.state.productData.insurancetypecode;
    // this.productid = history.state.productData.productid;
    // this.productName = history.state.productData.productName;
    // this.productEndDate = history.state.productData.productEndDate;
    // this.productStartDate = history.state.productData.productStartDate;
    // this.proposalNum = history.state.productData.proposalNumber;
    this.agentCode = localStorage.getItem('agentCode');
    // this.agencyCode = history.state.productData.agencyCode;
    this.productId = history.state.productData.productId;
    this.partnerId = history.state.productData.partnerId;
    this.isQuote = history.state.productData.isQuote;

    this.formData = this.encryptionService.decrypt(sessionStorage.getItem('allFormData') as string)
    console.log(this.formData)
    // this.formData = { ...this.formData, ...{ productName: this.productName } }
    this.allJsonForm = this.encryptionService.decrypt(sessionStorage.getItem('allJsonForm') as string)
    this.getFormDataFromFormSequence(this.formSequence[this.getFormIndexValue()].formId);
  }

  initializeRequiredData() {

    if (sessionStorage.getItem('insuredMemberDetails') != null)
      this.insuredMemberDetails = this.encryptionService.decrypt(sessionStorage.getItem('insuredMemberDetails') as string)

    if (sessionStorage.getItem('leadId') != null) {
      this.leadId = this.encryptionService.decrypt(sessionStorage.getItem('leadId') as string);
    }
    else {
      this.leadId = "";
    }

    if (sessionStorage.getItem('proposalId') != null) {
      this.proposalId = this.encryptionService.decrypt(sessionStorage.getItem('proposalId') as string);
    }
    else {
      this.proposalId = "";
    }

    if (sessionStorage.getItem('quoteId') != null) {
      this.quoteId = this.encryptionService.decrypt(sessionStorage.getItem('quoteId') as string);
    }
    else {
      this.quoteId = "";
    }


    if (sessionStorage.getItem('quoteNo') != null) {
      this.quoteNo = this.encryptionService.decrypt(sessionStorage.getItem('quoteNo') as string);
    }

    if (sessionStorage.getItem('displayTaxList') != null) {
      this.displayTaxList = this.encryptionService.decrypt(sessionStorage.getItem('displayTaxList') as string);
    }

    if (sessionStorage.getItem('tenureAmount')) {
      this.tenureAmount = this.encryptionService.decrypt(sessionStorage.getItem('tenureAmount') as string)
      console.log(this.tenureAmount);

    }

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
  }
  getFormDataFromFormSequence(formId: any) {
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
    //   this.service.getAllFormDataViaVerticalCode(reqdata).subscribe({
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
    if (Object.keys(this.allJsonForm[this.getFormIndexValue()]).length > 0) {
      this.form = this.allJsonForm[this.getFormIndexValue()];
      console.log(this.form);
      this.initializeForm();
    }

    else {
      let reqData = {
        "partnerId": this.partnerId,
        "productId": this.productId,
        "formId": formId
      }
      console.log(reqData);
      this.service.Getform(reqData).subscribe({
        next: (res) => {
          console.log(res);
          this.form = JSON.parse(res.data.jsonFormData);
          // this.form = totalpremium;
          this.initializeForm();
        },
        error: (err) => {
          console.error(err);
        }
      })

    }
    console.log(this.form);
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
          console.log(control.name, control,this.formData);

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
        else {
          if ((this.formData[control.name]) || (this.formData[control.name] && !control.value)) {
            control.value = this.formData[control.name];
            if (control.name == 'accident') {
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
                    subControl.innerSubControls?.push(tempInnerControl);
                  }
                });
                subControl.innerSubControls?.push(doneButton);
              }
            });


            console.log(this.initializeSubControls(control.subControls));

            this.dynamicFormGroup.addControl(control.name, this.initializeSubControls(control.subControls));
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
            // if(control.type=='select' && control.methodName && control.options?.length==0){
            //   this.callMethod(control.methodName,control);
            // }
            if (control.type === 'multiSelectCheckbox' && control.selectCheckboxOptions) {
              // Only call resolveMethod if selectCheckboxOptions is empty
              if (control.selectCheckboxOptions.length === 0) {
                await this.resolveMethod(control.methodName, control);

              }
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

              console.log(this.form, control.value, this.isQuote, control.name);

              // If the control's value is empty, set it based on the selected options
              if (control.value === "") {
                // Set control value if any option is selected
                if (control.options.length > 0) {
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
              else if (control.value != "" && this.isQuote === true) {
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

            if (control.type == 'radio' && control.method) {
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
                      console.log(this.selectedIndex);
                    }
                  });
                });
              })
            }

            this.dynamicFormGroup.addControl(control.name, new FormControl(control.value, controlValidators));
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
      //dynamic css
      // this.showHtmlContent = true;
      console.log(this.form);
      console.log(this.dynamicFormGroup);



      this.flattenObject(this.formData);
      this.spinner.hide();
    }
  }

  initializeSubControls(subControls: any) {
    console.log(subControls);

    let formGroup: any = this.fb.group({});
    if (Array.isArray(subControls)) {
      subControls.forEach((control: any) => {
        let controlValidators: any = [];
        if (control.validators) {
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

        if (control.innerSubControls) {
          formGroup.addControl(control.name, this.initializeSubControls(control.innerSubControls.slice(1)));
        }
        else if (control.coreControls) {
          let tempFormArray = this.fb.array([]);
          for (let i = 0; i < control.coreControls.length; i++) {
            tempFormArray.push(this.initializeSubControls(control.coreControls[i]))
          }
          formGroup.addControl(control.name, tempFormArray);
        }
        else if (!control.displayOnly || control.displayOnly === false)
          formGroup.addControl(control.name, new FormControl(control.value, controlValidators));
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
          control.tabs.forEach(element => {
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
    this.renderer.setAttribute(this.dynamicStyle, 'href', 'assets/styles/dynamicForm/' + tf)
    this.renderer.appendChild(this.document.head, this.dynamicStyle);
    this.showHtmlContent = true;
  }
  ngOnDestroy(): void {
    if (this.dynamicStyle) {
      this.renderer.removeChild(this.document.head, this.dynamicStyle)
    }
  }

  getValidationErrors(control: IFormControl | IDynamicControl, parentControl: IFormControl | null = null, index: number | null = null): string {
    const myFormControl = parentControl != null && index != null ? (this.dynamicFormGroup.get(parentControl.name) as FormArray).controls[index].get(control.name) : this.dynamicFormGroup.get(control.name)
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
    index: number | null = null
  ): boolean {
    let myControl: AbstractControl | null;

    if (parentControl != null && index != null) {
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

  triggerFileInput(controlName: string) {
    const fileInputControl = this.document.getElementById(controlName);
    fileInputControl?.click();
  }

  onFileSelected(inputName: string, event: any) {
    const file = event.target.files[0];
    const maxSizeInBytes = 3 * 1024 * 1024; // 3MB
    const allowedFileTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];
    const control = this.dynamicFormGroup.get(inputName);

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

  addNavbar(index: number) {
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
    this.service.getSalutation().subscribe({
      next: (res) => {
        console.log(res);
        control.options = res.Salutation;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  getAllOccupationRisk(control: any) {
    this.service.getNatureOfOccupation().subscribe({
      next: (res: any) => {
        control.options = res.NatureOfDuty;
      },
      error: (err: any) => {
        console.error(err);
      }
    });
  }

  getAllInsureData(control: any) {
    this.spinner.show();
    this.service.getInsurerData().subscribe({
      next: (res) => {
        console.log(res);
        control.options = res.InsurerName;
        this.spinner.hide();
      },
      error: (err) => {
        console.error(err);
      }
    });
  }


  getAllOccupation(control: any) {
    this.service.getAllOccupation().subscribe({
      next: (res) => {
        console.log(res);

        control.options = res.Occupation;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  getIdentityProof(control: any) {
    this.service.getIdentification().subscribe({
      next: (res) => {
        console.log(res);
        control.options = res.IdType;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  getProposerOccupation(control: any) {
    this.service.getProposerOccupation().subscribe({
      next: (res) => {
        console.log(res);
        control.options = res.ProposerOccupation;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  getNationality(control: any) {
    this.service.getNationality().subscribe({
      next: (res) => {
        console.log(res);
        control.options = res.Nationality;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  getGstRegistrationStatus(control: any) {

    this.service.getGstRegistrationStatus().subscribe({
      next: (res) => {
        console.log(res);
        control.options = res.Registration;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  getMaritalStatus(control: any) {
    this.service.getMaritalStatus().subscribe({
      next: (res) => {
        console.log(res);
        control.options = res.MaritalStatus;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  getEducationType(control: any) {
    this.service.getEducationType().subscribe({
      next: (res) => {
        console.log(res);
        control.options = res.EducationType;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  getNomineeRelationShip(control: any) {
    this.service.getNomineeRelationship().subscribe({
      next: (res) => {
        console.log(res);
        control.options = res.nomineeRelationShip;
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

      this.service.getAllBankDetails().subscribe({
        next: (res) => {
          control.options = res.allBanksData;
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
    this.bankName = data.id as string;
    const reqData = {
      "bankName": this.bankName
    };

    this.service.getBankCity(reqData).subscribe({
      next: (res) => {
        otherControl.options = [...res.AllBankCity]; // Create a new array to trigger change detection
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
      "bankName": this.bankName,
      "city": this.bankCity
    };

    this.service.getBranchDetails(reqData).subscribe({
      next: (res) => {
        otherControl.options = [...res.BranchDetails]; // Create a new array to trigger change detection
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
    this.spinner.show();
    this.service.getRelationship().subscribe({
      next: (res) => {
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


  onInputChange(event: any, control: any, parentControl: any = null, index: any = null) {
    // console.log(event.target.value,event);
    let eventValue = event.target.value;
    if (control.name === "chequeNumber") {
      const chequeNumber = event.target.value;
      if (chequeNumber.length > 6) {
        event.target.value = chequeNumber.slice(0, 6);
        this.dynamicFormGroup.get(control.name)?.setValue(chequeNumber.slice(0, 6));
        return;
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
          break;

        case 'Passport':
          idNumberControl?.setValidators([
            Validators.required,
            Validators.pattern('^[A-Z][0-9]{2}(?:\\s?[0-9]{5})?$')
          ]);
          break;

        case 'Voter ID':
          idNumberControl?.setValidators([
            Validators.required,
            Validators.pattern('^[A-Z]{3}[0-9]{7}$')
          ]);
          break;

        case 'Driving License':
          idNumberControl?.setValidators([
            Validators.required,
            Validators.pattern('^[A-Z]{2}[0-9]{2}[0-9]{4}[0-9]{7}$')
          ]);
          break;

        case '10th (SSC) Mark sheet':
          idNumberControl?.setValidators([
            Validators.required,
            Validators.pattern('^[0-9]{7}$')
          ]);
          break;

        default:
          idNumberControl?.clearValidators();
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
      } else {
        // If not a radio control, just resolve using the control
        this.resolveMethod(control.onChangeMethod, control, eventValue);
      }
    }



    if (parentControl !== null && parentControl.type == 'combinedCheckbox') {
      this.changeOverLayDone(control, parentControl, false);
    }

    if (control.type == 'date' && control.dependentControls != null) {
      const dob = event.target.value;
      const dobArray = dob.split('-');

      if (parentControl != null && index != null) {

        if (dobArray[0] as number >= 1800) {
          const ageControl = this.dynamicFormGroup.get(parentControl.name);
          if (ageControl) {
            ageControl.value[index][control.dependentControls[0]] = this.calculateAge(dob);
            (ageControl as FormArray).controls[index].get(control.dependentControls[0])?.markAsTouched();
            this.dynamicFormGroup.get(parentControl.name)?.patchValue(ageControl.value);

          }
        }
      }
      else {
        if (dobArray[0] as number >= 1800) {
          const ageControl = this.dynamicFormGroup.get(control.dependentControls[0]);

          if (dob && ageControl) {
            ageControl.markAsTouched();
            const age = this.calculateAge(dob);
            ageControl.setValue(age);
          }
        }
      }

    }


    if (parentControl == null && control.name == 'pincode') {
      let reqData = event.target.value;
      console.log(event.target.value.length, reqData);
      this.service.getPinCodeByCity(reqData).subscribe({
        next: (res) => {
          console.log(res)
          this.dynamicFormGroup.get('city')?.setValue(res.data.strcity);
          this.dynamicFormGroup.get('state')?.setValue(res.data.strstate);
          this.dynamicFormGroup.get('zone')?.setValue(res.data.strzone);
        },
        error: (err) => {
          console.error(err)
          this.dynamicFormGroup.get('city')?.setValue('');
          this.dynamicFormGroup.get('state')?.setValue('');
          this.dynamicFormGroup.get('zone')?.setValue('');
        }
      });
    }
    else if (parentControl != null && parentControl.dynamicControls) {

      parentControl.dynamicControls.forEach((dynamicControls: IDynamicControl[]) => {
        dynamicControls.forEach((dynamicControl: IDynamicControl) => {
          if (dynamicControl.name == 'pincode' && dynamicControl.name == control.name) {
            const reqdata = event.target.value;
            this.spinner.show();
            this.service.getPinCodeByCity(reqdata).subscribe({
              next: (res) => {
                console.log(res)

                const patchObject: { [key: string]: any } = {};

                patchObject['city' as string] = res.data.strcity;
                patchObject['zone' as string] = res.data.strzone;
                patchObject['zoneValue' as string] = res.data.strzonemapping;
                patchObject['state' as string] = res.data.strstate;

                let formArray: any = this.dynamicFormGroup.get(parentControl.name)?.value;

                for (let i = 0; i < formArray.length; i++) {
                  if (i == index)
                    formArray[i] = { ...formArray[i], ...patchObject }
                }


                this.dynamicFormGroup.get(parentControl.name)?.patchValue(formArray);
                this.spinner.hide();
              },
              error: (err) => {
                console.error(err);
                const patchObject: { [key: string]: any } = {};

                patchObject['city' as string] = '';
                patchObject['zone' as string] = '';
                patchObject['zoneValue' as string] = '';
                patchObject['state' as string] = '';

                let formArray: any = this.dynamicFormGroup.get(parentControl.name)?.value;

                for (let i = 0; i < formArray.length; i++) {
                  if (i == index)
                    formArray[i] = { ...formArray[i], ...patchObject }
                }


                this.dynamicFormGroup.get(parentControl.name)?.patchValue(formArray);
                this.spinner.hide();
              }
            });
          }
        });
      });
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
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    if (age < 1) {
      const diffInMs = today.getTime() - birthDate.getTime();
      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
      return `${diffInDays}days`;
    }

    return age;
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
    // this.dynamicFormGroup.removeControl('insuredMemberDetails');
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

  getProposerRelationship(control: IFormControl): Promise<any> {
    // Showing the spinner before making the API call
    this.spinner.show();

    // Wrapping the asynchronous operation in a promise
    return new Promise((resolve, reject) => {
      const reqData = {
        agencyCode: this.partnerId,
        insuranceTypeCode: 101,
        productId: this.productId,
        policyType: this.dynamicFormGroup.get('memberPolicyType')?.value,
      };

      console.log(reqData);

      // Calling the API service
      this.service.GetProposerRelationships(reqData).subscribe({
        next: (res) => {
          console.log(res, "API Response Received");

          // Prepare form group
          const controlGroup = this.fb.group({});

          // For each relationship option, add a control
          res.relationShip.forEach((option: any) => {
            controlGroup.addControl(option.value, new FormControl(false));
          });

          // Remove previous insuredMembers control
          this.dynamicFormGroup.removeControl('insuredMembers');

          // Add validators
          let controlValidators: any = [];
          control.validators?.forEach((val: IValidator) => {
            if (val.validatorName === 'required') controlValidators.push(Validators.required);
            if (val.validatorName === 'email') controlValidators.push(Validators.email);
            if (val.validatorName === 'minlength') controlValidators.push(Validators.minLength(val.minLength as number));
            if (val.validatorName === 'maxlength') controlValidators.push(Validators.maxLength(val.maxLength as number));
            if (val.validatorName === 'pattern') controlValidators.push(Validators.pattern(val.pattern as string));
          });

          // controlGroup.setValidators([...controlValidators, this.addCustomValidation()]);
          // controlGroup.updateValueAndValidity();
          // controlGroup.setErrors({ required: true });

          // Add the new insuredMembers control
          this.dynamicFormGroup.addControl(control.name, controlGroup);


          // Update control with the fetched options
          control.selectCheckboxOptions = res.relationShip;

          if(this.isQuote){
            this.form.formSections.forEach((section: any) => {
                section.formControls.forEach((control: any) => {
                  if (control.name == 'insuredMembers') {
                    //loop the options and see if the option has value true in the insuredMembers in formData and the call the log selection
                    control.selectCheckboxOptions.forEach((option: any) => {
                      if (this.formData.insuredMembers[option.value] === true) {
                        // Call logSelection function (pass null for event if not triggering through UI)
                        this.logSelection(null, option, control);
                      }
                    })
                  }
                })
    
              })
          }
          // Hide the spinner once the response is processed
          this.spinner.hide();
          this.flattenObject(this.formData);
          console.log(this.formData, this.form);



          // Resolve the promise when API response is processed successfully
          resolve(res);
        },
        error: (err) => {
          console.error(err);
          this.spinner.hide();

          // Reject the promise on error
          reject(err);
        }
      });
    });
  }



  //   async getProposerRelationship(control: IFormControl) {
  //     this.spinner.show();
  //     const reqData = {
  //         agencyCode: this.partnerId,
  //         insuranceTypeCode: 101,
  //         productId: this.productId,
  //         policyType: this.dynamicFormGroup.get('planType')?.value,
  //     };

  //     try {
  //         const res = await this.service.GetProposerRelationships(reqData).toPromise();
  //         console.log("being human",res);

  //         const controlGroup = this.fb.group({});

  //         res.relationShip.forEach((option: any) => {
  //             controlGroup.addControl(option.value, new FormControl(false));
  //         });

  //         this.dynamicFormGroup.removeControl('insuredMembers');
  //         controlGroup.setValidators([...this.getValidators(control)]);
  //         controlGroup.updateValueAndValidity();
  //         controlGroup.setErrors({ required: true });

  //         this.dynamicFormGroup.addControl(control.name, controlGroup);
  //         control.selectCheckboxOptions = res.relationShip;
  //     } catch (err) {
  //         console.error(err);
  //     } finally {
  //         this.spinner.hide();
  //     }
  // }

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
    const checkbox = event ? (event.target as HTMLInputElement) : { checked: true };
    this.form.formSections.forEach(formsection => {
      formsection.formControls.forEach(formControl => {
        // if (checkbox.checked == true) {
        //   if (formControl.name == controls.idProperty && formControl.dynamicControls && formControl.visible == true) {
        //     formsection.visible = true;
        //     let tempControl = formControl.dynamicControls[0].map((element: any) => ({ ...element }));
        //     tempControl[1].value = option.value;
        //     tempControl[0].value = JSON.stringify(option);

        //     let formArr = this.dynamicFormGroup.get(controls.idProperty) as FormArray;

        //     console.log(formArr, this.dynamicFormGroup.value, this.form);

        //     // Check if the form group already exists in the FormArray
        //     let existingIndex = formArr.controls.findIndex((control: AbstractControl) => {
        //       const group = control as FormGroup; // Cast the control to FormGroup
        //       return group.get('relation')?.value === option.value;
        //     });

        //     // if (existingIndex !== -1 && existingIndex !== undefined) {
        //     //   // Update existing form group with the new controls/values
        //     //   let existingGroup = formArr.controls[existingIndex] as FormGroup;

        //     //   // Iterate through tempControl and update the existingGroup
        //     //   tempControl.forEach((control: any) => {
        //     //     if (existingGroup.contains(control.name)) {
        //     //       // If the control exists, update the value
        //     //       existingGroup.get(control.name)?.setValue(control.value);
        //     //     } else {
        //     //       // If the control doesn't exist, add the control
        //     //       existingGroup.addControl(control.name, this.fb.control(control.value));
        //     //     }
        //     //   });

        //     // } 
        //     // else {
        //     //   // If the form group doesn't exist, create a new one
        //     //   if (!formArr) {
        //     //     formArr = this.fb.array([]);
        //     //     this.dynamicFormGroup.addControl(controls.idProperty, formArr);
        //     //   }

        //     //   // Initialize the new form group and add it to the array
        //     //   let newFormGroup = this.initializeDynamicFormControls(tempControl, formControl.dynamicControls.length - 1);
        //     //   formArr.push(newFormGroup);
        //     // }

        //     // Special handling for the 'Self' option
        //     // if (option.value === 'Self') {
        //     //   let index = formArr.controls.findIndex((control: AbstractControl) => {
        //     //     const group = control as FormGroup; // Cast the control to FormGroup
        //     //     return group.get('relation')?.value === option.value;
        //     //   });

        //     //   if (index !== -1) {
        //     //     let selfGroup = formArr.controls[index] as FormGroup;
        //     //     selfGroup.get('memberdob')?.setValue(this.dynamicFormGroup.get('memberDobProposer')?.value);
        //     //     selfGroup.get('memberAge')?.setValue(this.dynamicFormGroup.get('memberAgeProposer')?.value);
        //     //     selfGroup.get('memberGender')?.setValue(this.dynamicFormGroup.get('proposerGender')?.value);
        //     //     selfGroup.get('emailId')?.setValue(this.dynamicFormGroup.get('emailId')?.value);
        //     //     selfGroup.get('firstName')?.setValue(this.dynamicFormGroup.get('firstName')?.value);
        //     //     selfGroup.get('middleName')?.setValue(this.dynamicFormGroup.get('middleName')?.value);
        //     //     selfGroup.get('lastName')?.setValue(this.dynamicFormGroup.get('lastName')?.value);
        //     //     selfGroup.get('mobileNumber')?.setValue(this.dynamicFormGroup.get('mobileNumber')?.value);
        //     //     selfGroup.get('height')?.setValue(this.dynamicFormGroup.get('height')?.value);
        //     //     selfGroup.get('weight')?.setValue(this.dynamicFormGroup.get('weight')?.value);
        //     //     selfGroup.get('heightInches')?.setValue(this.dynamicFormGroup.get('heightInches')?.value);
        //     //     selfGroup.get('sumInsured')?.setValue(this.dynamicFormGroup.get('sumInsured')?.value);
        //     //   }
        //     // }

        //     // Handle 'Family Floater' plan type by setting 'sumInsured' for all insured members
        //     // if (this.dynamicFormGroup.get('memberPolicyType')?.value == 'Family Floater') {
        //     //   formArr.controls.forEach((control: any) => {
        //     //     control.get('sumInsured')?.setValue(this.dynamicFormGroup.get('sumInsured')?.value);
        //     //   });
        //     // }

        //     // this.dynamicFormGroup.get('numberOfInsuredMembers')?.setValue(formArr.length);
        //   }
        // }
        if (checkbox.checked == true) {
          if (formControl.name == controls.idProperty && formControl.dynamicControls && formControl.visible == true) {
            formsection.visible = true;
            let tempControl = formControl.dynamicControls[0].map((element: any) => ({ ...element }));
            tempControl[1].value = option.value;
            tempControl[0].value = JSON.stringify(option);
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
              if (formControl.dynamicControls) {
                for (let i = 0; i < formControl.dynamicControls.length; i++) {
                  let element = formControl.dynamicControls[i];
                  try {
                    console.log(element[0]);

                    let parsedValue = JSON.parse(element[0].value);
                    if (parsedValue.value === option.value) {
                      element.forEach((control: any) => {
                        if (control.name == 'memberdob' || control.name == 'memberAge' || control.name == 'memberGender' || control.name == 'emailId' || control.name == 'firstName' || control.name == 'lastName') {
                          control.disabled = true
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
              (this.dynamicFormGroup.get(controls.idProperty) as FormArray)?.controls[index - 1].get('emailId')?.setValue(this.dynamicFormGroup.get('emailId')?.value);
              (this.dynamicFormGroup.get(controls.idProperty) as FormArray)?.controls[index - 1].get('firstName')?.setValue(this.dynamicFormGroup.get('firstName')?.value);
              (this.dynamicFormGroup.get(controls.idProperty) as FormArray)?.controls[index - 1].get('middleName')?.setValue(this.dynamicFormGroup.get('middleName')?.value);
              (this.dynamicFormGroup.get(controls.idProperty) as FormArray)?.controls[index - 1].get('lastName')?.setValue(this.dynamicFormGroup.get('lastName')?.value);
              (this.dynamicFormGroup.get(controls.idProperty) as FormArray)?.controls[index - 1].get('mobileNumber')?.setValue(this.dynamicFormGroup.get('mobileNumber')?.value);
              (this.dynamicFormGroup.get(controls.idProperty) as FormArray)?.controls[index - 1].get('height')?.setValue(this.dynamicFormGroup.get('height')?.value);
              (this.dynamicFormGroup.get(controls.idProperty) as FormArray)?.controls[index - 1].get('weight')?.setValue(this.dynamicFormGroup.get('weight')?.value);
              (this.dynamicFormGroup.get(controls.idProperty) as FormArray)?.controls[index - 1].get('heightInches')?.setValue(this.dynamicFormGroup.get('heightInches')?.value);
              (this.dynamicFormGroup.get(controls.idProperty) as FormArray)?.controls[index - 1].get('sumInsured')?.setValue(this.dynamicFormGroup.get('sumInsured')?.value);

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
        else if (checkbox.checked == false) {
          if (formControl.name == controls.idProperty && formControl.dynamicControls && formControl.visible == true) {
            let index = formControl.dynamicControls?.findIndex((element: any) =>
              element[1].value == option.value);
            if (index !== undefined && index !== -1) {
              formControl.dynamicControls?.splice(index, 1);
              let formArr = this.dynamicFormGroup.get(controls.idProperty) as FormArray;
              formArr.removeAt(index - 1);
              if (formArr.length == 0) {
                formsection.visible = false;
              }
              Object.keys(this.formData).forEach(key => {
                if (key.startsWith(`${controls.idProperty}.${index - 1}.`)) {
                  delete this.formData[key];
                }
                if (key.includes(option.value)) {
                  delete this.formData[key]
                }
              });
            }
            console.log(this.formData);
            this.dynamicFormGroup.get('numberOfInsuredMembers')?.setValue(this.dynamicFormGroup.get('numberOfInsuredMembers')?.value - 1);
          }
          // else if(formControl){
          //   Object.keys(this.formData).forEach(key => {
          //     if (key.startsWith(`${controls.idProperty}.${index - 1}.`)) {
          //       delete this.formData[key];
          //     }
          //   });
          // }

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
  }
  // In your template, you can bind the class dynamically
  getButtonClass(control: any): string {
    return this.selectedButton === control.name ? 'active-button' : '';
  }
  async onSubmit() {

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
            element.memberIndex = index;
          });
        }
        this.flattenObjectInsert(this.dynamicFormGroup.value);
        this.formData = { ...this.formData, ...this.dynamicFormGroup.value };
        console.log(this.formData);


        this.allJsonForm[this.getFormIndexValue()] = this.form;

        sessionStorage.setItem("allFormData", this.encryptionService.encrypt(this.formData));
        sessionStorage.setItem("allJsonForm", this.encryptionService.encrypt(this.allJsonForm));

        if (this.form.formTitle.includes("Total Premium")) {
          sessionStorage.setItem("addOnList", this.encryptionService.encrypt(this.addOnList));
          sessionStorage.setItem("addOnDetails", this.encryptionService.encrypt(this.addOnDetails));
          sessionStorage.setItem('tenureAmount', this.encryptionService.encrypt(this.tenureAmount));
        }


        if (this.form.saveBtnFunction) {
          await this.resolveMethod(this.form.saveBtnFunction);
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
          "proposalNum": this.proposalNum,
          "partnerId": this.partnerId,
          "agentCode": this.agentCode,
          "code": this.Code,
          "verticalCode": this.verticalCode,
          "insuranceTypeCode": this.insurancetypecode,
          "formType": this.formSequence[this.getFormIndexValue()].formName,
          "formData": JSON.stringify(this.dynamicFormGroup.value),
          "formName": this.formSequence[this.getFormIndexValue()].formName,
          "formConfig": JSON.stringify(this.formSequence),
          "productId": this.productId,
          "formId": this.formSequence[this.getFormIndexValue()].formId,
          "jsonForm": JSON.stringify(this.form),
          "formSequence": this.getFormIndexValue()
        };

        this.service.Insertorupdateformdata(reqData).subscribe({
          next: (res) => {
            // this.toast.success({ detail: "SUCCESS", summary: "Form Data Saved Successfully.", duration: 3000 });
            console.log(res);

          },
          error: (err) => {
            console.error(err);
          }
        });
        const reqdata = {
          "verticalCode": this.verticalCode,
          "partnerId": this.partnerId,
          "proposalNum": this.proposalNum,
          "code": this.Code,
          "agentCode": this.agentCode,
          "insuranceTypeCode": this.insurancetypecode,
          "productId": this.productId,
          "formName": this.formSequence[this.getFormIndexValue()].formName,
          "formData": JSON.stringify(this.formData),
          "formId": this.formSequence[this.getFormIndexValue()].formId,
          "formSequence": this.getFormIndexValue()
        }
        this.service.Insertorupdatejourneydetails(reqdata).subscribe({
          next: (response) => {
            console.log(response);
          },
          error: (error) => {
            console.log(error);
          }
        });

        if (this.getFormIndexValue() < this.formSequence.length - 1) {
          this.incrementIndex();
          this.getFormDataFromFormSequence(this.formSequence[this.getFormIndexValue()].formId);
        }
      }
      else {
        console.log('Form is invalid', this.dynamicFormGroup);
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
        if (this.dynamicFormGroup.invalid)
          this.toast.warning({ detail: "WARNING", summary: "Please fill the mandatory fields", duration: 3000 })
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
    controlIndex: number | null = null
  ) {
    console.log(dependentControlNames, visibility);

    const tempIndex = this.activeMemberTabIndex;
    setTimeout(() => {
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

            } else if (control.name === dependentName) {
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
              } else {
                this.dynamicFormGroup.get(control.name)?.clearValidators();
                this.dynamicFormGroup.get(control.name)?.reset();
              }
            }
          });
        });
      });
      this.changeDetectorRef.detectChanges();
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
        "agencyCode": this.agencyCode,
        "agentCode": this.agencyCode,
        "insuranceTypeCode": this.insurancetypecode,
        "leadFirstName": this.dynamicFormGroup.get('leadFirstName')?.value,
        "leadLastName": this.dynamicFormGroup.get('leadLastName')?.value,
        "leadMobileNo": this.dynamicFormGroup.get('leadMobileNo')?.value,
        "leadEmailId": this.dynamicFormGroup.get('leadEmailId')?.value,
      }
      this.adminService.insertLeadDetails(reqData).subscribe({
        next: (res) => {
          this.leadId = res.leadId;
          this.proposalId = res.proposalId;
          this.quoteId = res.quoteId;
          sessionStorage.setItem("leadId", this.encryptionService.encrypt(this.leadId));
          this.dynamicFormGroup.addControl("leadId", this.fb.control(this.leadId));
          sessionStorage.setItem("proposalId", this.encryptionService.encrypt(this.proposalId));
          this.dynamicFormGroup.addControl("proposalId", this.fb.control(this.proposalId));
          sessionStorage.setItem("quoteId", this.encryptionService.encrypt(this.quoteId));
          this.dynamicFormGroup.addControl("quoteId", this.fb.control(this.quoteId));
          this.toast.success({ detail: "SUCCESS", summary: "Lead Created Successfully.", duration: 3000 });

        },
        error: (err) => {
          console.error(err);
        }
      });
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

  async getPremiumAmount(control: IFormControl) {
    this.spinner.show();
    // this.tenureAmount.forEach((element) => {
    //   element = 0;
    // })
    for (let i = 0; i < this.tenureAmount.length; i++) {
      this.tenureAmount[i] = 0;
    }
    console.log(this.tenureAmount);


    this.premiumDetails = [];
    this.premiumAmountDetails = [];
    var relationShip: string = '';
    var maxAge: number = 0;

    if (this.formData.planType === 'Multi Individual' || this.formData.planType === 'Individual') {
      relationShip = 'Multi Individual'
    }
    else {
      this.formData.insuredMemberDetails.forEach((member: any) => {
        if (relationShip.length > 0)
          relationShip += ','

        relationShip += JSON.parse(member.relationshipType).value;

        if (member.memberAge > maxAge) {
          maxAge = member.memberAge;
        }

      })
    }

    if (Object.keys(this.formData).length > 0) {
      const modifiedInsuredMemberDetails = JSON.parse(JSON.stringify(this.formData));
      modifiedInsuredMemberDetails.insuredMemberDetails.forEach((member: any) => {
        const relationshipValue = JSON.parse(member.relationshipType);
        member.relationshipType = relationshipValue.value;
        member['relationShip'] = relationShip;
        member['prodCd'] = ''
        if (this.formData.memberPolicyType == 'Family Floater') {
          member['sumInsured'] = this.formData.memberSumInsured;
          member['zone'] = this.formData.zone;
          member['city'] = this.formData.city;
          member.prodCd = this.formData.memberPlan;
          member.memberAge = maxAge;
          member['pincode'] = this.formData.pincode;
          // member['preExistingDisease'] = "no";
        }
      });


      if (modifiedInsuredMemberDetails.productType == 'AS') {
        const transformedInsuredMemberDetails: any[] = [];

        modifiedInsuredMemberDetails.insuredMemberDetails.forEach((member: any) => {

          var commonDetails = {};
          Object.keys(member).forEach((key: string) => {
            if (!Array.isArray(member[key])) {
              if (key === "isEarning") {
                if (member[key])
                  commonDetails = { ...commonDetails, "isEarning": 1 };
                else
                  commonDetails = { ...commonDetails, "isEarning": 0 };
              }
              else
                commonDetails = { ...commonDetails, [key]: member[key] };
            }
          });



          Object.keys(member).forEach((key: string) => {

            if (Array.isArray(member[key]) && member[key].length > 0) {

              const addOn = member[key][0];
              const firstKey = Object.keys(addOn)[0];

              if (addOn[firstKey]) {
                if (addOn.coverType == "PA") {
                  addOn['riskClass'] = JSON.parse(addOn.natureOfDuties).value;
                }
                transformedInsuredMemberDetails.push({ ...commonDetails, ...addOn });
              }
            }
          });
        });
        modifiedInsuredMemberDetails.insuredMemberDetails = transformedInsuredMemberDetails;
      }
      var reqData = {
        code: this.Code,
        insuranceTypeCode: this.insurancetypecode,
        productId: this.productid,
        configuration_Json: JSON.stringify(modifiedInsuredMemberDetails)
      };

      console.log(reqData);


      try {

        let quoteResponse: any;

        if (this.formData.productType == 'AF') {
          quoteResponse = await new Promise((resolve, reject) => {
            this.service.getActiveFitQoute(reqData).subscribe({
              next: (res) => {
                resolve(res)
              },
              error: (err) => { reject(err) }
            });
          });
        }
        else {
          quoteResponse = await new Promise((resolve, reject) => {
            this.service.getQoute(reqData).subscribe({
              next: (res) => {
                resolve(res)
              },
              error: (err) => { reject(err) }
            });
          });
        }

        if (this.formData.planType == 'Multi Individual' || this.formData.planType == 'Individual') {
          quoteResponse.forEach((element: any) => {
            element.prmMemDtlSecureEntity.forEach((member: any) => {
              let tempArray: number[] = [];
              member.premium.forEach((premium: any) => {
                // if (premium.tenure === 1) {
                //   this.tenureAmount[premium.te] += premium.premium || 0;
                // } else if (premium.tenure === 2) {
                //   this.tenure2Total += premium.premium || 0;
                // } else if (premium.tenure === 3) {
                //   this.tenure3Total += premium.premium || 0;
                // }
                this.tenureAmount[premium.tenure - 1] += premium.premium || 0;
                tempArray.push(premium.premium);
              });
              console.log(this.tenureAmount);

              this.premiumDetails.push(member.premium);
              this.premiumAmountDetails.push(tempArray);
            });
          });
          // console.log(this.premiumAmountDetails);
          sessionStorage.setItem("premiumAmountDetails", this.encryptionService.encrypt(this.premiumAmountDetails));
        }
        else {
          quoteResponse.forEach((element: any) => {
            let tempArray: number[] = [];
            element.prmMemDtlSecureEntity[0].premium.forEach((premium: any) => {
              this.tenureAmount[premium.tenure - 1] += premium.premium || 0;
              tempArray.push(premium.premium);
            });

            this.premiumAmountDetails.push(tempArray);
          })

          for (let i = 0; i < this.formData.numberOfInsuredMembers - 1; i++) {
            this.premiumAmountDetails.push([0, 0, 0]);
          }
        }



        this.tenureAmount.forEach(member => {
          console.log(member);

        })
        console.log(this.premiumAmountDetails);
        console.log(this.premiumDetails);

        // Second API Call
        let reqData2: {
          productType: any;
          overAllSIAge: number[];
          totalPremium: number[][];
          valueUnit: any[];
          yearlyDiscount: number[];
          zoneDiscount: number;
          memberDiscount: number;
          addOnList: any[];
        };

        var overAllSIAge: number[] = [];
        var valueUnit: any[] = [];


        this.formData['insuredMemberDetails'].forEach((member: any) => {
          overAllSIAge.push(parseInt(member.memberAge));
          valueUnit.push(null);
        });

        reqData2 = {
          productType: this.formData['productType'],
          overAllSIAge: overAllSIAge,
          totalPremium: this.premiumAmountDetails,
          valueUnit: valueUnit,
          yearlyDiscount: [0, 7.5, 10],
          zoneDiscount: this.formData.productType == 'AF' || this.formData.productType == 'AA' || this.formData.productType == 'AO' || this.formData.productType == 'AC' || this.formData.productType == 'AGS' || this.formData.productType == 'STUB' || this.formData.productType == 'GHS' ? 0 : 9,
          memberDiscount: 0,
          addOnList: this.addOnList
        };

        if (this.formData['numberOfInsuredMembers'] > 1 && this.formData['planType'] == 'Multi Individual') {
          reqData2.memberDiscount = 5;
        }
        this.spinner.show();

        console.log(reqData2);


        const addOnPremiumResponse: any = await new Promise((resolve, reject) => {
          this.service.getAddOnPremium(reqData2).subscribe({
            next: (response) => resolve(response),
            error: (err) => reject(err)
          });
        });

        addOnPremiumResponse.calculatedValuesList.forEach((member: number, index: number) => {
          this.tenureAmount[index] = Math.round(member)
        })

        console.log(this.tenureAmount);

        this.taxList = addOnPremiumResponse.taxList;
        this.netPremiumList = addOnPremiumResponse.netPremiumList;
        this.totalPremiumList = addOnPremiumResponse.totalPremiumList;
        this.indPremiumList = addOnPremiumResponse.indPremiumList;
        this.addOnPremiumValueList = addOnPremiumResponse.totalPremiumValue;

        const roundedDiscountValues = addOnPremiumResponse.discountValueList.map((value: number) => Math.round(value));
        this.displayTaxList = addOnPremiumResponse.taxList.map((value: number) => Math.round(value));

        // this.dynamicFormGroup.get('premiumAmount')?.setValue(this.tenure1Total);

        sessionStorage.setItem('displayTaxList', this.encryptionService.encrypt(this.displayTaxList))
        sessionStorage.setItem('tenureAmount', this.encryptionService.encrypt(this.tenureAmount))
        this.changeDetectorRef.detectChanges();
        this.spinner.hide();
      } catch (err) {
        console.error(err);
        this.spinner.hide();
      }
    }
    this.setPremiumAmount();
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
          this.formData[newKey] = value;
        }
      });
    } else {
      this.formData[prefix] = obj;
    }
  }

  flattenObject(obj: any, prefix = '') {
    console.log(obj);

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
            console.log(value[key2]);

            formGroup?.get(key2)?.setValue(value[key2]);
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

  async halfQuotation() {
    this.spinner.show();

    let reqData = JSON.parse(JSON.stringify(this.formData));

    Object.keys(reqData).forEach(key => {
      const value = reqData[key];

      if (Array.isArray(value)) {
        value.forEach((element: any) => {

          Object.keys(element).forEach((key: any) => {
            const value = element[key];
            if (typeof value === 'string' && value.startsWith('{') && value.endsWith('}')) {
              try {
                const parsedValue = JSON.parse(value);
                element[key] = parsedValue.value;
                element[key + 'Code'] = parsedValue.id;
              } catch (error) {
                console.error(`Error parsing JSON for key '${key}':`, error);
              }
            }
          });

        });
      }
      // Check if the value is a string and starts with "{" and ends with "}"
      else if (typeof value === 'string' && value.startsWith('{') && value.endsWith('}')) {
        try {
          // Attempt to parse the stringified JSON value
          const parsedValue = JSON.parse(value);

          reqData = { ...reqData, [key]: parsedValue.value };
          reqData = { ...reqData, [key + 'Code']: parsedValue.id };
        } catch (error) {
          console.error(`Error parsing JSON for key '${key}':`, error);
        }
      }
    });

    reqData.insuredMemberDetails.forEach((element: any) => {

      element['memberNo'] = element['memberIndex'] + 1;
      element['productComponents'] = [
        {
          "productComponentName": "SumInsured",
          "productComponentValue": element['sumInsured']
        },
        {
          "productComponentName": "Zone",
          "productComponentValue": element['zoneValue']
        }
      ];
      element['optionalCovers'] = this.addOnDetails[element['memberIndex']];
    });
    this.spinner.show();
    reqData['selectedIndex'] = 1;
    reqData['quoteDate'] = new Date().toISOString().split('T')[0];
    reqData['preIssuanceDate'] = new Date().toISOString().split('T')[0];
    reqData['customerSignatureDate'] = new Date().toISOString().split('T')[0];
    reqData['agentSignatureDate'] = new Date().toISOString().split('T')[0];
    reqData['leadId'] = this.leadId;
    reqData['pinCode'] = reqData.insuredMemberDetails[0].pincode;
    reqData['preIssuranceTime'] = new Date().toISOString().split('T')[1].split('.')[0];
    this.mainData = reqData
    var reqData1 = {
      code: this.Code,
      insuranceTypeCode: this.insurancetypecode,
      productId: this.productid,
      configuration_Json: JSON.stringify(reqData),
      halfQuote: true,
      productType: reqData.productType
    };

    this.spinner.show();

    console.log(reqData1);

    try {
      const res = await new Promise((resolve, reject) => {
        this.service.getHalfQuote(reqData1).subscribe({
          next: (res) => {
            resolve(res);
          },
          error: (err) => {
            reject(err);
          }
        });
      });

      const response = res as any;
      console.log(response);

      Object.keys(response).forEach(key => {

        if (key === 'ns0:SuperHealthTopUpRes') {
          this.quoteNo = response[key].quoteNumber
        }
        else {
          this.quoteNo = response[key].PolCreationRespons.quoteNumber
        }

      });

      this.toast.success({ detail: "SUCCESS", summary: `Half Quotation Generated Successfully.${this.quoteNo}`, duration: 3000 });
      sessionStorage.setItem("mainData", this.encryptionService.encrypt(JSON.stringify(this.mainData)));
      this.spinner.hide();
    } catch (err) {
      console.error(err);
      this.spinner.hide();
    }
  }

  async fullQuotation() {
    this.spinner.show();
    this.mainData = { ...this.mainData, ...this.dynamicFormGroup.value };
    this.mainData['quotationNumber'] = 'QSP' + this.quoteNo;
    this.mainData['KYC_Transition_Id'] = 'SP' + new Date().getTime();
    this.mainData['collectionRcvdDate'] = new Date().toISOString().split('T')[0];
    var reqData: any = {
      code: this.Code,
      insuranceTypeCode: this.insurancetypecode,
      productId: this.productid,
      configuration_Json: JSON.stringify(this.mainData),
      fullQuote: true,
      productType: this.mainData.productType
    };

    try {
      const res: any = await new Promise((resolve, reject) => {
        this.service.getFullQuote(reqData).subscribe({
          next: (res) => {
            resolve(res);
          },
          error: (err) => {
            reject(err);
          }
        });
      });

      const response = res as any;

      Object.keys(response).forEach(key => {
        if (key === 'ns0:SuperHealthTopUpRes') {
          this.quoteNo = response[key].quoteNumber;
          this.customerId = response[key].customerId;
          this.dynamicFormGroup.addControl('customerId', this.fb.control(response[key].customerId));
          this.dynamicFormGroup.addControl('receiptNumber', this.fb.control(response[key].ReceiptCreationResponse.ReceiptNumber));
          this.dynamicFormGroup.addControl('quotationNumber', this.fb.control(response[key].quoteNumber));
        }
        else {
          this.quoteNo = response[key].PolCreationRespons.quoteNumber
          this.customerId = res[key].PolCreationRespons.customerId;
          this.dynamicFormGroup.addControl('customerId', this.fb.control(res[key].PolCreationRespons.customerId));
          this.dynamicFormGroup.addControl('receiptNumber', this.fb.control(res[key].ReceiptCreationResponse.ReceiptNumber));
          this.dynamicFormGroup.addControl('quotationNumber', this.fb.control(res[key].PolCreationRespons.quoteNumber));
        }
      });
      this.dynamicFormGroup.get('totalPremium')?.setValue(this.formData.totalPremium);

      this.formData = { ...this.formData, ...this.dynamicFormGroup.value };
      sessionStorage.setItem("allFormData", this.encryptionService.encrypt(this.formData));
      this.toast.success({ detail: "SUCCESS", summary: `Full Quotation Generated Successfully.${this.customerId}`, duration: 3000 });
      this.spinner.hide();

    } catch (err) {
      console.error(err);
      this.spinner.hide();
    }

  }

  /* AddOn Related Method */

  onCheckboxChange(event: any, control: any, parentControl: any = null, index: number | null = null) {
    console.log(event.target, control, parentControl, index, this.dynamicFormGroup);

    if (parentControl != null && typeof parentControl === 'object') {
      this.parentControl = parentControl;
    }

    if ((event.target.type === 'checkbox' && event.target.checked)) {
      if (parentControl != null && typeof parentControl === 'object' && parentControl.type == 'combinedCheckbox') {
        const firstKey = Object.keys((this.dynamicFormGroup.get(parentControl.name) as FormGroup)?.controls)[0];
        (this.dynamicFormGroup.get(parentControl.name) as FormGroup)?.controls[firstKey].setValue(false);
        this.showOverlay(parentControl);
      }

      // Call the method only if the 'method' key is present in the JSON and the checkbox is checked  this.resolveMethod(control.method, control?.popUpFormId, control?.name, control?.dependentControls, 'add');
      if (control.onChangeMethod)
        this.resolveMethod(control.onChangeMethod, control?.popUpFormId, control?.dependentControls, true, control?.name, parentControl?.name, index, 'add');
    }
    else {

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
                  if (this.dynamicFormGroup.get(`${parentControl.name}.${subControl.name}.${subControl.innerSubControls[i].name}.${j}.${subControl.innerSubControls[i].coreControls[j].name}`)?.value == true) {

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

        this.addOnRemoved(control, parentControl);
      }
      if (control.onChangeMethod)
        this.resolveMethod(control.onChangeMethod, control?.popUpFormId, control?.dependentControls, false, control?.name, parentControl?.name, index, 'remove');
    }
  }

  addOnAdded(control: any, parentControl: any = null) {
    let reqData: {
      productType: any;
      overAllSIAge: number[];
      totalPremium: number[][];
      valueUnit: any[];
      yearlyDiscount: number[];
      zoneDiscount: number;
      memberDiscount: number;
      addOnList: any[];
    };

    var overAllSIAge: number[] = [];
    var valueUnit: any[] = [];
    var premiumPerype: any;
    this.formData['insuredMemberDetails'].forEach((member: any) => {
      overAllSIAge.push(parseInt(member.memberAge));
      valueUnit.push(null);
    });

    console.log(control);

    let addOnData = this.dynamicFormGroup.get(parentControl.name)?.value;
    console.log(addOnData);


    if (addOnData.premiumPerype == undefined) {
      premiumPerype = null;
    }
    else if (addOnData['premiumPerype'] == '') {
      premiumPerype = this.calculatePremiumPerype(this.formData['insuredMemberDetails']);
    }
    else if (addOnData.premiumPerype) {
      premiumPerype = addOnData.premiumPerype;
    }

    let addOnListData: any = {
      "optionalId": addOnData.addOnId,
      "optionalSI": [],
      "riskClass": [],
      "premiumPerype": premiumPerype
    };

    if (premiumPerype != null && premiumPerype != 'NULL') {
      var insuredMembers = this.formData['insuredMemberDetails'];

      insuredMembers.forEach((member: any) => {
        console.log(member);

        addOnListData.optionalSI.push(parseInt(member.sumInsured));
        if (member.occupationRisk) {
          var risk = JSON.parse(member.occupationRisk);
          addOnListData.riskClass.push(risk.value || null);
        }
      });
    }
    else {
      Object.keys(addOnData).forEach((key: string) => {
        console.log(addOnData[key], typeof addOnData[key]);
        if (typeof addOnData[key] == 'object') {
          Object.keys(addOnData[key]).forEach((key2: string) => {

            if (Array.isArray(addOnData[key][key2])) {
              console.log(key2);

              // addOnListData.optionalSI.push(item.addOnSumInsured ? parseInt(item.addOnSumInsured) : null);
              console.log(addOnData[key][key2]);
              addOnData[key][key2].forEach((obj: any) => {
                if (obj.addOnSumInsured) {
                  addOnListData.optionalSI.push(obj.addOnSumInsured ? parseInt(obj.addOnSumInsured) : null);
                }
                if (obj.occupationRisk) {
                  var risk = JSON.parse(obj.occupationRisk);
                  addOnListData.riskClass.push(risk.value || null);
                }
              })

            }
          })
        }
      });

    }
    console.log(addOnListData);
    let existingItem = this.addOnList.find((item: any) => item.optionalId === addOnListData.optionalId);

    if (existingItem) {
      Object.assign(existingItem, addOnListData);
      // existingItem = addOnListData;
    } else {
      this.addOnList.push(addOnListData);
    }

    reqData = {
      productType: this.formData['productType'],
      overAllSIAge: overAllSIAge,
      totalPremium: this.premiumAmountDetails,
      valueUnit: valueUnit,
      yearlyDiscount: [0, 7.5, 10],
      zoneDiscount: this.formData.productType == 'AF' || this.formData.productType == 'AA' || this.formData.productType == 'AO' || this.formData.productType == 'AC' || this.formData.productType == 'AGS' || this.formData.productType == 'STUB' || this.formData.productType == 'GHS' ? 0 : 9,
      memberDiscount: 0,
      addOnList: this.addOnList
    };

    if (this.formData['numberOfInsuredMembers'] > 1) {
      reqData.memberDiscount = 5;
    }

    console.log(reqData);

    this.service.getAddOnPremium(reqData).pipe(
      // 1. Step: First process the API response
      tap((response) => {
        console.log(response);

        // Update tenure amounts
        for (let i = 0; i < response.calculatedValuesList.length; i++) {
          this.tenureAmount[i] = Math.round(response.calculatedValuesList[i]);
        }
        console.log('Updated tenureAmount:', this.tenureAmount, this.selectedIndex);

        // Set other lists
        this.taxList = response.taxList;
        this.netPremiumList = response.netPremiumList;
        this.totalPremiumList = response.totalPremiumList;
        this.indPremiumList = response.indPremiumList;
        this.addOnPremiumValueList = response.totalPremiumValue;

        // Set discount values
        const roundedDiscountValues = response.discountValueList.map((value: number) => Math.round(value));
      }),
      // 2. Step: Process the form controls after updating the tenureAmount
      tap(() => {
        this.form.formSections.forEach((section: any) => {
          section.formControls.forEach((formControl: any) => {
            if (formControl.name === 'totalPremium' && formControl.radioOptions) {
              formControl.radioOptions.forEach((option: any, index: number) => {
                const tenureAmount = this.tenureAmount[index];
                option.label = `<b>Rs - ${tenureAmount}</b>`;
                option.value = tenureAmount;

                if (index === 0) {
                  option.year = '1 year';
                } else if (index === 1) {
                  option.year = '2 years';
                  option.discount = '7.5% off';
                } else if (index === 2) {
                  option.year = '3 years';
                  option.discount = '10% off';
                }

                if (index === this.selectedIndex) {
                  this.dynamicFormGroup.value.totalPremium = tenureAmount;
                }
              });
            }
          });
        });
      }),
      // 3. Step: Process the add-on data
      concatMap(() => {

        let index = 0; // Initialize the index variable
        const addOnProcessing = Object.keys(addOnData).map((key: string) => {
          if (Array.isArray(addOnData[key])) {
            const addOnDataArray = addOnData[key].at(0);
            if (addOnDataArray.hasOwnProperty('addOnSumInsured')) {
              let reqData = {
                "optionalId": addOnData.addOnId,
                "si": addOnDataArray.addOnSumInsured,
                "optionalCoverName": addOnData.optionalCoverName,
                "optionalCoverValue": addOnData.optionalCoverValue,
                "premium": 0,
                "riskClass": ""
              };

              if (addOnData.addOnId === 'AHPA') {
                this.isAHPAAdded = true;
                const occupationRisk = JSON.parse(addOnDataArray.occupationRisk);
                this.AHPARiskValue = occupationRisk['value'];
                reqData = { ...reqData, riskClass: occupationRisk['value'] };
              }

              if (this.selectedIndex !== -1) {
                const addOnIndex = this.addOnList.findIndex((addOn: any) => addOn.optionalId === addOnData.addOnId);
                reqData.premium = this.addOnPremiumValueList[addOnIndex][index][this.selectedIndex];
              }

              if (this.addOnDetails[index]) {
                this.addOnDetails[index].push(reqData);
              }

              index++;
            }
          }
          return of(null); // Map to observable
        });
        return of(...addOnProcessing); // Return observables as a pipeline
      }),
      // 4. Step: Finalize AHPA if it's added
      tap(() => {
        if (this.isAHPAAdded) {
          this.addOnDetails.forEach((member: any) => {
            member.forEach((addOn: any) => {
              addOn.riskClass = this.AHPARiskValue;
            });
          });
        }
      })
    ).subscribe({
      next: () => {
        console.log('All operations completed successfully.');
      },
      error: (err) => {
        console.error(err);
      }
    });

    // const button = event.target;
    // if (button) {
    //   button.classList.add('disable');
    //   button.disabled = true;
    // }
  }

  addOnRemoved(control: any, parentControl: any) {

    console.log(parentControl);

    let reqData: {
      productType: any;
      overAllSIAge: number[];
      totalPremium: number[][];
      valueUnit: any[];
      yearlyDiscount: number[];
      zoneDiscount: number;
      memberDiscount: number;
      addOnList: any[];
    };

    var overAllSIAge: number[] = [];
    var valueUnit: any[] = [];


    this.formData['insuredMemberDetails'].forEach((member: any) => {
      overAllSIAge.push(parseInt(member.memberAge));
      valueUnit.push(null);
    });


    let addOnData = this.dynamicFormGroup.get(parentControl.name)?.value;
    console.log(this.addOnList);

    const indexToRemove = this.addOnList.findIndex((addOn: any) => addOn.optionalId === addOnData.addOnId);

    if (addOnData.addOnId === 'AHPA' && indexToRemove !== -1) {
      this.isAHPAAdded = false;
      this.AHPARiskValue = '';
    }

    if (indexToRemove !== -1) {
      this.addOnList.splice(indexToRemove, 1);
    }


    reqData = {
      productType: this.formData['productType'],
      overAllSIAge: overAllSIAge,
      totalPremium: this.premiumAmountDetails,
      valueUnit: valueUnit,
      yearlyDiscount: [0, 7.5, 10],
      zoneDiscount: this.formData.productType == 'AF' || this.formData.productType == 'AA' || this.formData.productType == 'AO' || this.formData.productType == 'AC' || this.formData.productType == 'AGS' || this.formData.productType == 'STUB' || this.formData.productType == 'GHS' ? 0 : 9,
      memberDiscount: 0,
      addOnList: this.addOnList
    };

    if (this.formData['numberOfInsuredMembers'] > 1) {
      reqData.memberDiscount = 5;
    }

    console.log(reqData);


    this.service.getAddOnPremium(reqData).pipe(
      // 1. Step: First process the API response
      tap((response) => {
        console.log(response);

        // Update tenure amounts
        for (let i = 0; i < response.calculatedValuesList.length; i++) {
          this.tenureAmount[i] = Math.round(response.calculatedValuesList[i]);
        }
        console.log('Updated tenureAmount:', this.tenureAmount, this.selectedIndex);

        // Set other lists
        this.taxList = response.taxList;
        this.netPremiumList = response.netPremiumList;
        this.totalPremiumList = response.totalPremiumList;
        this.indPremiumList = response.indPremiumList;
        this.addOnPremiumValueList = response.totalPremiumValue;

        // Set discount values
        const roundedDiscountValues = response.discountValueList.map((value: number) => Math.round(value));
      }),
      // 2. Step: Process the form controls after updating the tenureAmount
      tap(() => {
        this.form.formSections.forEach((section: any) => {
          section.formControls.forEach((formControl: any) => {
            if (formControl.name === 'totalPremium' && formControl.radioOptions) {
              formControl.radioOptions.forEach((option: any, index: number) => {
                const tenureAmount = this.tenureAmount[index];
                option.label = `<b>Rs - ${tenureAmount}</b>`;
                option.value = tenureAmount;

                if (index === 0) {
                  option.year = '1 year';
                } else if (index === 1) {
                  option.year = '2 years';
                  option.discount = '7.5% off';
                } else if (index === 2) {
                  option.year = '3 years';
                  option.discount = '10% off';
                }

                if (index === this.selectedIndex) {
                  this.dynamicFormGroup.value.totalPremium = tenureAmount;
                }
              });
            }
          });
        });
      }),
      // 3. Step: Process the add-on data
      concatMap(() => {
        let index = 0; // Initialize the index variable
        const addOnProcessing = Object.keys(addOnData).map((key: string) => {
          if (Array.isArray(addOnData[key])) {
            const addOnDataArray = addOnData[key].at(0);
            if (addOnDataArray.hasOwnProperty('addOnSumInsured')) {
              let reqData = {
                "optionalId": addOnData.addOnId,
                "si": addOnDataArray.addOnSumInsured,
                "optionalCoverName": addOnData.optionalCoverName,
                "optionalCoverValue": addOnData.optionalCoverValue,
                "premium": 0,
                "riskClass": ""
              };

              if (addOnData.addOnId === 'AHPA') {
                this.isAHPAAdded = true;
                const occupationRisk = JSON.parse(addOnDataArray.occupationRisk);
                this.AHPARiskValue = occupationRisk['value'];
                reqData = { ...reqData, riskClass: occupationRisk['value'] };
              }

              if (this.selectedIndex !== -1) {
                const addOnIndex = this.addOnList.findIndex((addOn: any) => addOn.optionalId === addOnData.addOnId);
                reqData.premium = this.addOnPremiumValueList[addOnIndex][index][this.selectedIndex];
              }

              if (this.addOnDetails[index]) {
                this.addOnDetails[index].push(reqData);
              }

              index++;
            }
          }
          return of(null); // Map to observable
        });
        return of(...addOnProcessing); // Return observables as a pipeline
      }),
      // 4. Step: Finalize AHPA if it's added
      tap(() => {
        if (this.isAHPAAdded) {
          this.addOnDetails.forEach((member: any) => {
            member.forEach((addOn: any) => {
              addOn.riskClass = this.AHPARiskValue;
            });
          });
        }
      })
    ).subscribe({
      next: () => {
        console.log('All operations completed successfully.');
      },
      error: (err) => {
        console.error(err);
      }
    });
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
        this.service.getPinCodeByCity(this.dynamicFormGroup.get('proposerPincode')?.value).subscribe({
          next: (res) => {
            console.log(res)
            this.dynamicFormGroup.get('proposerCity')?.setValue(res.strcity);
            this.dynamicFormGroup.get('proposerState')?.setValue(res.strstate);
          },
          error: (err) => {
            console.error(err)
          }
        });

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
    this.router.navigate(['/portal/agent/viewproducts']);
  }

  setPremiumAmount() {
    console.log(this.displayTaxList);
    this.tenureAmount.forEach(member => {
      console.log(member);

    })

    this.form.formSections.forEach((section: any) => {
      section.formControls.forEach((formControl: any) => {
        if (formControl.name == 'totalPremium') {
          if (formControl.radioOptions) {
            formControl.radioOptions.forEach((option: any, index: number) => {
              if (index === 0) {
                // this.totalPremium = this.tenure1Total;
                option.label = `<b>Rs - ${this.tenureAmount[index]}</b>`;
                formControl.value = this.tenureAmount[index];
                option.year = "1 year"
                section.toolTipText = `Tax: Rs ${this.displayTaxList[0]}`;
                option.value = this.tenureAmount[index];
                this.dynamicFormGroup.value.totalPremium = this.tenureAmount[index];
                this.selectedIndex = index;
                console.log(this.selectedIndex);
              } else if (index === 1) {
                option.label = `<b>Rs - ${this.tenureAmount[index]}</b>`;
                section.toolTipText = `Tax: Rs ${this.displayTaxList[0]}`;
                option.value = this.tenureAmount[index];
                option.year = "2 years"
                option.discount = "7.5% off"
              } else if (index === 2) {
                option.label = `<b>Rs - ${this.tenureAmount[index]}</b>`;
                section.toolTipText = `Tax: Rs ${this.displayTaxList[0]}`;
                option.value = this.tenureAmount[index];
                option.year = "3 years"
                option.discount = "10% off"
              }
            });
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
                        innerSubControl.coreControls?.forEach((coreControl: ISubControl) => {
                          if (breakFlag) return;
                          if (coreControl.name == 'memberCheckbox' && coreControl.dependentControls) {
                            dependentControls = coreControl.dependentControls;
                          }
                          console.log(dependentControls);

                          let memberFormGroup = tempControlArray.controls.find((group: AbstractControl) => {
                            return (group as FormGroup).get(coreControl.name)
                          }) as FormGroup;
                          console.log(memberFormGroup);

                          let memberFormGroupControl = memberFormGroup.get(coreControl.name);
                          if (memberFormGroupControl?.value == '') {

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


                          // if{

                          // }
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
    this.closeOverlay(subControl);




  }

  closeOverlay(subControl: any) {

    this.isOverlayVisible = false;
    subControl.visible = false;
  }

  changeOverLayDone(control: any, parentControl: any, changeValue: boolean = false) {

    this.form.formSections.forEach((section) => {
      section.formControls.forEach((controls: any) => {
        if (controls.name == parentControl.name) {
          if (parentControl.subControls) {
            parentControl.subControls.forEach((subControl: any) => {
              if (subControl.innerSubControls) {
                subControl.innerSubControls.forEach((innerSubControl: any) => {
                  if (innerSubControl.name == 'doneButton') {
                    innerSubControl.disabled = changeValue;
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

    this.isOverlayVisible = true;
  }

  verifyKYC() {
    const proposerDOB = this.dynamicFormGroup.get('memberDobProposer')?.value;
    const panNumber = this.dynamicFormGroup.get('panNo')?.value; 
  
    const reqData = {
      dateOfBirth: proposerDOB,
      panNumber: panNumber
    };
    console.log(reqData);

    this.spinner.show();
  
    this.service.GetKycDetails(reqData).subscribe({
      next: (response:any) => {
        console.log('KYC details:', response);
        this.toast.success({detail:"SUCCESS", summary:"KYC Details Fetched Successfully", duration:3000});
        this.spinner.hide();
        if (typeof response.data === 'object' && response.data !== null) {
          Object.keys(response.data).forEach((key:any)=>{
              this.dynamicFormGroup.get(key)?.setValue(response.data[key])
          })
        } else {
          console.error('Expected response.data to be an object, but received:', response.data);
        }
      },
      error: (error) => {
        this.spinner.hide();
        this.toast.warning({ detail: "WARNING", summary: "Failed to fetch KYC Details", duration: 3000 });
        console.error('Error fetching KYC details:', error);
      }
    });
  }

  getPolicyDetails() {
    const policyNumberDetails = this.dynamicFormGroup.get('policyNumber')?.value;
  
    const reqData = {
      policyNumber: policyNumberDetails
    };
    console.log(reqData);

    this.spinner.show();
  
    this.service.GetCustomerDetailsViaPolicyNumber(reqData).subscribe({
      next: (response:any) => {
        console.log('Policy details:', response);
        this.toast.success({detail:"SUCCESS", summary:"Policy Details Fetched Successfully", duration:3000});
        this.spinner.hide();
        if (typeof response.data === 'object' && response.data !== null) {
          Object.keys(response.data).forEach((key:any)=>{
              this.dynamicFormGroup.get(key)?.setValue(response.data[key])
          })
        } else {
          console.error('Expected response.data to be an object, but received:', response.data);
        }
      },
      error: (error) => {
        this.spinner.hide();
        this.toast.warning({ detail: "WARNING", summary: "Failed to fetch Policy Details", duration: 3000 });
        console.error('Error fetching Policy details:', error);
      }
    });
  }
  
}
