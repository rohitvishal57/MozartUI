import { Component, inject, Renderer2, Inject, ElementRef, ChangeDetectorRef, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { IDynamicControl, IForm, IFormControl, IFormSections, ISubControl, IValidator } from 'src/app/interface/form.interface';
import { DOCUMENT } from '@angular/common';
import { CommonService } from 'src/app/services/common.service';
import { LoginService } from 'src/app/services/login.service';
import { Router } from '@angular/router';
import { EncryptionService } from 'src/app/services/encryption.service';
import { HttpClient } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgToastService } from 'ng-angular-popup';
import { Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';
import { concatMap } from 'rxjs/operators';
import { of, forkJoin } from 'rxjs';


@Component({
  selector: 'app-agent-dynamic-form',
  templateUrl: './agent-dynamic-form.component.html',
  changeDetection: ChangeDetectionStrategy.Default
  // styleUrls: ['./agent-dynamic-form.component.scss']
})
export class AgentDynamicFormComponent implements OnDestroy {

  index: any;
  productName: any;
  selectedOptions: any;
  contactMethod: string = '';
  productStartDate: any;
  productEndDate: any;

  radioOptionsSubscription: Subscription | undefined;
  checkboxStateMap: String[] = [];

  allInsuranceType: any[] = [];
  form !: IForm;
  popUpForm !: IForm;

  fb = inject(FormBuilder)
  dynamicFormGroup: FormGroup = this.fb.group({});
  popupFormGroup: FormGroup = this.fb.group({});

  public showHtmlContent: any;
  public showPopup: any;
  allFormSequence: any[] = [];
  quoteFormSequence: any[] = [];
  formSequence: any[] = [];

  private formData: any = {}
  private allJsonFormData: any[] = [];

  insurancetypecode: any;
  productid: any;
  verticalCode: any;
  Code: any;
  proposalNum: any;

  private dynamicStyle!: HTMLLinkElement;
  selectedFile: any;
  formControls: IFormControl[] = [];
  parentControl: any;
  insuredMemberDetails: any = {};
  totalPremium: any;
  selectedIndex: number = -1;
  tenure1Total: number = 0;
  tenure2Total: number = 0;
  tenure3Total: number = 0;
  premiumAmountDetails: number[][] = [];
  addOnList: any[] = [];

  premiumDetails: any[][] = [];
  taxList: number[] = [];
  netPremiumList: number[] = [];
  totalPremiumList: any[] = [];
  indPremiumList: any[] = [];
  addOnPremiumValueList: number[][][] = [];
  addOnDetails: Array<any>[] = [new Array()];
  agentCode: any;
  agencyCode: any;
  bankName: any;
  bankCity: any;

  //lead and proposal variables
  leadId: any;
  proposalId: any;
  quoteId: any;
  tempData: any;
  pageId: number | undefined;
  quoteNumber: any;
  customerId: any;

  //AHPA addOn
  isAHPAAdded: boolean = false;
  AHPARiskValue: string = '';

  mainData: any;
  quoteNo: any;

  activeMemberTabIndex: number = 0;

  // leadCreated = false;
  // isLeadCreationPage = false;
  constructor(private renderer: Renderer2, private el: ElementRef, @Inject(DOCUMENT) private document: Document,
    private service: CommonService, private loginService: LoginService, private router: Router,
    private encryptionService: EncryptionService, private http: HttpClient, private spinner: NgxSpinnerService,
    private toast: NgToastService, private datePipe: DatePipe, private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.spinner.show();
    this.showHtmlContent = false;
    this.showPopup = false;
    this.formSequence = history.state.formSequence;
    this.allFormSequence = history.state.formSequence;

    this.Code = localStorage.getItem('code');
    this.verticalCode = localStorage.getItem('verticalCode');
    this.insurancetypecode = localStorage.getItem('insurancetypecode');
    this.productid = localStorage.getItem('productid');
    this.insurancetypecode = history.state.productData.insurancetypecode;
    this.productid = history.state.productData.productid;
    this.productName = history.state.productData.productName;
    this.productEndDate = history.state.productData.productEndDate;
    this.productStartDate = history.state.productData.productStartDate;
    this.proposalNum = history.state.productData.proposalNumber;
    this.agentCode = localStorage.getItem('agentCode');
    this.agencyCode = history.state.productData.agencyCode;

    this.formData = this.encryptionService.decrypt(sessionStorage.getItem('allFormData') as string)
    console.log(this.formData)
    this.formData = { ...this.formData, ...{ productName: this.productName } }
    this.allJsonFormData = this.encryptionService.decrypt(sessionStorage.getItem('allJsonFormData') as string)

    this.pageId = 0;
    this.getFormDataFromFormSequence(this.formSequence[this.getFormIndexValue()].formId);
    // Check for formId 25 or formName chronicDisease
    // const specialFormExists = this.formSequence.some(form => form.formId === 25 || form.formName.trim().toLowerCase() === 'chronic diseases');
    // console.log('Special form exists:', specialFormExists);
    // this.isLeadCreationPage = true;
  }


  initializeRequiredData() {

    if (sessionStorage.getItem('insuredMemberDetails') != null)
      this.insuredMemberDetails = this.encryptionService.decrypt(sessionStorage.getItem('insuredMemberDetails') as string)
    if (sessionStorage.getItem('addOnList') != null) {
      this.addOnList = this.encryptionService.decrypt(sessionStorage.getItem('addOnList') as string);
    }
    if (!this.addOnDetails || this.addOnDetails.length !== this.formData['numberOfInsuredMembers']) {
      this.addOnDetails = new Array();
      for (var i = 0; i < this.formData['numberOfInsuredMembers']; i++) {
        this.addOnDetails.push(new Array());
      }
    }

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

    if (sessionStorage.getItem('addOnDetails') != null) {
      this.addOnDetails = this.encryptionService.decrypt(sessionStorage.getItem('addOnDetails') as string)
    }


    if (sessionStorage.getItem('quoteNo') != null) {
      this.quoteNo = this.encryptionService.decrypt(sessionStorage.getItem('quoteNo') as string);
    }
  }

  getFormDataFromFormSequence(formSeq: any) {
    this.initializeRequiredData();
    if (this.dynamicStyle) {
      this.renderer.removeChild(this.document.head, this.dynamicStyle)
      this.showHtmlContent = false;
    }
    if (Object.keys(this.allJsonFormData[this.getFormIndexValue()]).length > 0) {
      this.form = this.allJsonFormData[this.getFormIndexValue()];
      console.log(this.form);
      this.initializeForm();
    }
    else {
      this.service.getJSONFormViaVerticalCode(this.verticalCode, this.Code, this.insurancetypecode, this.productid, formSeq).subscribe({
        next: (res) => {
          this.form = JSON.parse(res.jsonformdata);
          console.log(this.form);
          this.initializeForm();
        },
        error: (err) => {
          console.error(err);
        }
      })
    }
  }



  initializeForm() {
    console.log(this.allJsonFormData)
    console.log(this.formData)
    this.form.formSections.forEach((section: any) => {
      section.formControls.forEach((control: any) => {
        if (control.dynamicControls) {
          if (this.formData[control.name] && control.visible == true) {
            control.value = this.formData[control.name].length;
          }
          for (let i = 1; i <= control.value; i++) {
            if (!control.dynamicControls[i]) {
              let tempDynamicControl = control.dynamicControls[0].map((element: any) => ({ ...element }));
              control.dynamicControls.push(tempDynamicControl)
            }
          }
        }
        else {
          if ((this.formData[control.name]) || (this.formData[control.name] && !control.value)) {
            const value = this.formData[control.name];

            if (control.type == 'text' && (typeof value == 'string') && (value.startsWith('{') && value.endsWith('}'))) {
              control.value = JSON.parse(this.formData[control.name]).value;
            }
            else
              control.value = this.formData[control.name];
          }
        }
      });
    });
    if (this.form?.formSections) {
      this.dynamicFormGroup = this.fb.group({});
      this.form.formSections.forEach((section) => {
        section.formControls.forEach((control: IFormControl) => {
          if (control.dynamicControls) {
            if ((control.type == 'details' && control.visible == true) || (control.type != 'details')) {
              let tempFormArray = this.fb.array([]);
              for (let i = 1; i < control.dynamicControls.length; i++) {
                tempFormArray.push(this.initializeDynamicFormControls(control.dynamicControls[i], i));
              }
              this.dynamicFormGroup.addControl(control.name, tempFormArray);
            }
          }
          else if (control.subControls) {
            let tempFormArray = this.fb.array([]);
            for (let i = 0; i < control.subControls.length; i++) {
              tempFormArray.push(this.initializeSubControls(control.subControls[i].slice(1)))
            }
            this.dynamicFormGroup.addControl(control.name, tempFormArray);
          }
          else {
            let controlValidators: any = [];
            if (control.validators) {
              control.validators.forEach((val: IValidator) => {
                if (val.validatorName === 'required') controlValidators.push(Validators.required);
                if (val.validatorName === 'email') controlValidators.push(Validators.email);
                if (val.validatorName === 'minlength') controlValidators.push(Validators.minLength(val.minLength as number));
                if (val.validatorName === 'maxlength') controlValidators.push(Validators.maxLength(val.maxLength as number));
                if (val.validatorName === 'pattern') controlValidators.push(Validators.pattern(val.pattern as string));
              })
            }
            if (['text', 'email', 'password', 'number', 'date'].includes(control.type) && control.methodName) {
              this.callMethod(control.methodName, control, section);
            }
            if (control.type == 'select' && control.methodName && control.options?.length == 0) {
              this.callMethod(control.methodName, control);
            }

            if (control.type == 'radio' && control.method) {
              this.callMethod(control.method, control);
            }
            const radioOptionsControl = this.dynamicFormGroup.get('totalPremium');
            if (control.value == 'Multi Individual') {
              console.log('object');
              this.form.formSections.forEach((section: any) => {
                if (section.sectionTitle == "Insured Member Details") {
                  section.formControls[0].visible = true;
                  section.formControls[1].visible = true;
                  section.formControls[2].visible = false;
                }
              });
            }

            if (radioOptionsControl) {
              radioOptionsControl.valueChanges.subscribe((value: string) => {

                this.form.formSections.forEach((section: any) => {
                  section.formControls.forEach((formControl: any) => {
                    if (formControl.name == 'totalPremium' && formControl.type == 'radio') {
                      this.selectedIndex = formControl.radioOptions.findIndex((option: any) => option.value === value);

                      if (this.selectedIndex != -1)
                        section.sectionTitle = "<b>Total Premium: INR " + value + " pa</b>";

                      console.log(radioOptionsControl);

                    }
                  });
                });



                for (let i = 0; i < this.addOnDetails.length; i++) {
                  // Log the current index and member
                  this.addOnDetails[i].forEach((addOnData: any) => {
                    if (this.selectedIndex !== -1) {
                      const addOnIndex = this.addOnList.findIndex((addOn: any) => addOn.optionalId === addOnData.optionalId);
                      // Check if addOnIndex is within bounds
                      if (addOnIndex >= 0 && addOnIndex < this.addOnPremiumValueList.length) {
                        // Check if i is within bounds for accessing elements of this.addOnPremiumValueList[addOnIndex]
                        if (i >= 0 && i < this.addOnPremiumValueList[addOnIndex].length) {
                          addOnData.premium = this.addOnPremiumValueList[addOnIndex][i][this.selectedIndex];
                        } else {
                          console.error("Index", i, "out of bounds for this.addOnPremiumValueList[addOnIndex]");
                        }
                      } else {
                        console.error("Invalid addOnIndex:", addOnIndex);
                      }
                    }
                  });
                }
              });
            }

            if (control.type == 'radio' && this.formData[control.name]) {
              const radioControl = this.dynamicFormGroup.get(control.name);
              if (radioControl) {
                control.radioOptions?.forEach((option: any, index: number) => {
                  if (option.value == this.formData[control.name]) {
                    radioControl.setValue(option.value);
                    // this.selectedIndex = index;
                  }
                });
              }
            }
            this.dynamicFormGroup.addControl(control.name, new FormControl(control.value, controlValidators));


          }
        });
      });
      //dynamic css
      this.dynamciallyLoadCSS(this.form);
      this.showHtmlContent = true;
      this.spinner.hide();
      console.log(this.form);
      this.flattenObject(this.formData);
      console.log(this.dynamicFormGroup.value);
    }


  }


  initializeSubControls(subControls: any) {
    let formGroup: any = this.fb.group({});
    subControls.forEach((control: ISubControl) => {
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

      if (control.type == 'select' && control.method) {
        if (control.options?.length == 0) {
          this.callMethod(control.method, control);
        }
      }

      if (control.innerSubControls) {
        let tempFormArray = this.fb.array([]);
        tempFormArray.push(this.initializeSubControls(control.innerSubControls))
        formGroup.addControl(control.name, tempFormArray);
      }
      else
        formGroup.addControl(control.name, new FormControl(control.value, controlValidators));
    });


    return formGroup;
  }

  initializeDynamicFormControls(dynamicFormControls: any, index: any = null) {

    console.log(dynamicFormControls);
    
    let formGroup: any = this.fb.group({})
    dynamicFormControls.forEach((control: IDynamicControl) => {
      if (control.subControls) {
        let tempFormArray = this.fb.array([]);
        for (let i = 0; i < control.subControls.length; i++) {
          tempFormArray.push(this.initializeSubControls(control.subControls[i]))
        }
        formGroup.addControl(control.name, tempFormArray);
      }
      else {
        let controlValidators: any = [];
        if (control.validators) {
          control.validators.forEach((val: IValidator) => {
            if (val.validatorName === 'required') controlValidators.push(Validators.required);
            if (val.validatorName === 'email') controlValidators.push(Validators.email);
            if (val.validatorName === 'minlength') controlValidators.push(Validators.minLength(val.minLength as number));
            if (val.validatorName === 'maxlength') controlValidators.push(Validators.maxLength(val.maxLength as number));
            if (val.validatorName === 'pattern') controlValidators.push(Validators.pattern(val.pattern as string));
          })
        }
        if (control.type == 'select' && control.methodName) {
          if (control.options?.length == 0) {
            this.callMethod(control.methodName, control);
          }
        }

        if (control.name == 'memberIndex' && index != null) {
          control.value = index - 1;
        }

        if(control.type == 'multiSelectCheckbox'){
          if(this.formData.insuredMemberDetails){
            console.log(control,this.formData.insuredMemberDetails[0][control.name]);
            control.value = this.formData.insuredMemberDetails[0][control.name]
          }
        }

        if (control.type == 'radio' && control.radioOptions) {
          // let initialValue = control.radioOptions.find((option) => option.selected === true)?.value;
          formGroup.addControl(control.name, new FormControl(control.value, controlValidators));
          
          console.log(control.name,control.value);
        }
        else {
          // console.log(control.name,control.value );         
          formGroup.addControl(control.name, new FormControl(control.value, controlValidators));
        }
      }
    })

    return formGroup;
  }

  flattenObject(obj: any, prefix = '') {

    Object.keys(obj).forEach(key => {
      const value = obj[key];
      const newKey = prefix + key;
      if (typeof value === 'object' && value !== null && Object.keys(value).length > 0) {
        if (typeof value === 'object' && value !== null && 'id' in value) {
          this.dynamicFormGroup.get(newKey)?.patchValue(value);
        } else {
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
  //Helper Method for dynamic Css
  dynamciallyLoadCSS(form: IForm) {
    let tf: string = "default.css";
    if (form.themeFile) tf = form.themeFile;
    this.dynamicStyle = this.renderer.createElement('link');
    this.renderer.setAttribute(this.dynamicStyle, 'rel', 'stylesheet');
    this.renderer.setAttribute(this.dynamicStyle, 'type', 'text/css');
    this.renderer.setAttribute(this.dynamicStyle, 'href', 'assets/styles/dynamicForm/' + tf)
    this.renderer.appendChild(this.document.head, this.dynamicStyle)
  }
  ngOnDestroy(): void {
    if (this.dynamicStyle) {
      this.renderer.removeChild(this.document.head, this.dynamicStyle)
    }
  }
  // For api Method

  triggerFileInput(controlName: string) {
    // const fileInputControl = this.dynamicFormGroup.get(controlName) as FormControl;
    const fileInputControl = this.document.getElementById(controlName);
    fileInputControl?.click();
  }

  onFileSelected(inputName: string, event: any) {
    this.selectedFile = event.target.files[0];
  }

  async resolveMethod(methodName: string, ...args: any[]): Promise<void> {
    let filteredArgs = args.filter(arg => arg !== undefined && arg !== null);

    if (methodName == 'addOrRemoveAdditionalInsuredMember') {
      // Determine whether to pass 'add' or 'remove' based on the last argument
      filteredArgs = filteredArgs.slice(-1);

    } else if (filteredArgs[filteredArgs.length - 1] == 'add' || filteredArgs[filteredArgs.length - 1] == 'remove') {
      filteredArgs.pop();
    }
    const method = (this as any)[methodName] as Function;
    if (method && typeof method === 'function') {
      // method.bind(this)(...filteredArgs);
      await Promise.resolve(method.bind(this)(...filteredArgs));
    } else {
      console.error(`Method ${methodName} not found`);
    }
  }

  addOrRemoveAdditionalInsuredMember(changeType: string) {

    let numberOfInsuredMembers = this.formData['numberOfInsuredMembers'];
    let insuredMembers: any[] = this.formData['insuredMemberDetails'];

    if (changeType === 'add') {
      this.form.formSections.forEach((section: any) => {
        section.formControls.forEach((control: any) => {
          if (control.name == this.parentControl.name && control.subControls) {
            // console.log(tempFormControls);
            let index = 0;
            insuredMembers.forEach((member: any) => {
               /*control.subControls[0][0] */;
              let tempFormControls: any = null;
              control.subControls.forEach((subControl: any) => {
                subControl.forEach((formSubControl: any) => {
                  if (formSubControl.name == 'demoType') {
                    tempFormControls = JSON.parse(JSON.stringify(formSubControl));
                  }
                });
              });

              const tempRelationshipType = JSON.parse(member.relationshipType);
              tempFormControls.name = tempRelationshipType.value;
              tempFormControls.label = tempRelationshipType.value;
              control.subControls[0].push(tempFormControls);
            });

            control.subControls[0].at(1).value = true;

            let newSubControl = this.initializeSubControls(control.subControls[0].slice(1));

            let formArray = this.dynamicFormGroup.get(this.parentControl.name) as FormArray;
            formArray.setControl(0, newSubControl);

            // formArray.push(this.initializeSubControls(control.subControls[0]));
            console.log(this.dynamicFormGroup.value);
          }
        });
      });
    }
    else if (changeType === 'remove') {
      this.form.formSections.forEach((section: any) => {
        section.formControls.forEach((control: any) => {
          if (control.name == this.parentControl.name && control.subControls) {
            this.addOnRemoved(control);
            for (let i = 0; i < numberOfInsuredMembers; i++) {
              control.subControls[0].pop(); // Remove last element from subControls[0]
            }
            control.subControls[0].at(1).value = false;
            console.log(control.subControls[0]);
            let newSubControl = this.initializeSubControls(control.subControls[0].slice(1));

            let formArray = this.dynamicFormGroup.get(this.parentControl.name) as FormArray;
            formArray.setControl(0, newSubControl);
          }
        });
      });
    }
  }

  addOnAdded(event: any, control: any) {
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

    let addOnData = this.dynamicFormGroup.get(control.name)?.value.at(0);

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
        addOnListData.optionalSI.push(parseInt(member.sumInsured));
        if (member.occupationRisk) {
          var risk = JSON.parse(member.occupationRisk);
          addOnListData.riskClass.push(risk.value || null);
        }
      });
    }
    else {
      Object.keys(addOnData).forEach((key: string) => {
        if (Array.isArray(addOnData[key])) {
          addOnData[key].forEach((item: any) => {
            addOnListData.optionalSI.push(item.addOnSumInsured ? parseInt(item.addOnSumInsured) : null);
            if (item.occupationRisk) {
              var risk = JSON.parse(item.occupationRisk);
              addOnListData.riskClass.push(risk.value || null);
            }
          });
        }
      });

    }


    this.addOnList.push(addOnListData);

    reqData = {
      productType: this.formData['productType'],
      overAllSIAge: overAllSIAge,
      totalPremium: this.premiumAmountDetails,
      valueUnit: valueUnit,
      yearlyDiscount: [0, 7.5, 10],
      zoneDiscount: 9,
      memberDiscount: 0,
      addOnList: this.addOnList
    };

    if (this.formData['numberOfInsuredMembers'] > 1) {
      reqData.memberDiscount = 5;
    }

    this.service.getAddOnPremium(reqData).subscribe({
      next: (response) => {
        this.tenure1Total = Math.round(response.calculatedValuesList[0]);
        this.tenure2Total = Math.round(response.calculatedValuesList[1]);
        this.tenure3Total = Math.round(response.calculatedValuesList[2]);

        this.taxList = response.taxList;
        this.netPremiumList = response.netPremiumList;
        this.totalPremiumList = response.totalPremiumList;
        this.indPremiumList = response.indPremiumList;
        this.addOnPremiumValueList = response.totalPremiumValue;

        const roundedDiscountValues = response.discountValueList.map((value: number) => Math.round(value));

        this.form.formSections.forEach((section: any) => {
          section.formControls.forEach((formControl: any) => {
            if (formControl.name == 'totalPremium') {
              if (formControl.radioOptions) {
                formControl.radioOptions.forEach((option: any, index: number) => {
                  if (index === 0) {
                    this.totalPremium = this.tenure1Total;
                    option.label = `1 Yr <b>Rs - ${this.tenure1Total}</b>`;
                    option.value = this.tenure1Total;
                    if (index == this.selectedIndex) {
                      section.sectionTitle = "Total Premium: <b>" + this.tenure1Total + "</b> pa";
                      this.dynamicFormGroup.value.totalPremium = this.tenure1Total;
                    }
                  } else if (index === 1) {
                    option.label = `2 Yr <b>Rs - ${this.tenure2Total}</b> <span class="green">(7.5 off) </span><b>Saving</b> Rs ${roundedDiscountValues[1]}`;
                    option.value = this.tenure2Total;
                    if (index == this.selectedIndex) {
                      section.sectionTitle = "Total Premium: <b>" + this.tenure2Total + "</b> pa";
                      this.dynamicFormGroup.value.totalPremium = this.tenure2Total;
                    }
                  } else if (index === 2) {
                    option.label = `3 Yr <b>Rs - ${this.tenure3Total}</b> <span class="green">(10 off) </span><b>Saving</b> Rs ${roundedDiscountValues[2]}`;
                    option.value = this.tenure3Total;
                    if (index == this.selectedIndex) {
                      section.sectionTitle = "Total Premium: <b>" + this.tenure3Total + "</b> pa";
                      this.dynamicFormGroup.value.totalPremium = this.tenure3Total;
                    }
                  }
                });
              }

            }
          });
        });

        let index = 0; // Initialize the index variable here

        Object.keys(addOnData).forEach((key: string) => {
          if (Array.isArray(addOnData[key])) {
            const addOnDataArray = addOnData[key].at(0);

            if (addOnDataArray.hasOwnProperty('addOnSumInsured')) {
              var reqData = {
                "optionalId": addOnData.addOnId,
                "si": addOnDataArray.addOnSumInsured,
                "optionalCoverName": addOnData.optionalCoverName,
                "optionalCoverValue": addOnData.optionalCoverValue,
                "premium": 0,
                "riskClass": ""
              };

              if (addOnData.addOnId === 'AHPA') {
                this.isAHPAAdded = true;
                var occupationRisk = JSON.parse(addOnDataArray.occupationRisk);
                this.AHPARiskValue = occupationRisk['value'];
                reqData = { ...reqData, ...{ "riskClass": occupationRisk['value'] } }
              }


              if (this.selectedIndex !== -1) {
                const addOnIndex = this.addOnList.findIndex((addOn: any) => addOn.optionalId === addOnData.addOnId);
                reqData.premium = this.addOnPremiumValueList[addOnIndex][index][this.selectedIndex];
              }
              this.addOnDetails[index]?.push(reqData);

            }
            index++;
          }
        });


        if (this.isAHPAAdded) {
          this.addOnDetails.forEach((member: any) => {
            member.forEach((addOn: any) => {
              addOn.riskClass = this.AHPARiskValue;
            });
          });
        }
      },
      error: (err) => {
        console.error(err);
      }
    });

    const button = event.target;
    if (button) {
      button.classList.add('disable');
      button.disabled = true;
    }
  }

  addOnRemoved(control: any) {

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


    let addOnData = this.dynamicFormGroup.get(control.name)?.value.at(0);

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
      zoneDiscount: 9,
      memberDiscount: 0,
      addOnList: this.addOnList
    };

    if (this.formData['numberOfInsuredMembers'] > 1) {
      reqData.memberDiscount = 5;
    }

    this.service.getAddOnPremium(reqData).subscribe({
      next: (response) => {
        this.tenure1Total = Math.round(response.calculatedValuesList[0]);
        this.tenure2Total = Math.round(response.calculatedValuesList[1]);
        this.tenure3Total = Math.round(response.calculatedValuesList[2]);

        this.taxList = response.taxList;
        this.netPremiumList = response.netPremiumList;
        this.totalPremiumList = response.totalPremiumList;
        this.indPremiumList = response.indPremiumList;
        this.addOnPremiumValueList = response.totalPremiumValue;

        const roundedDiscountValues = response.discountValueList.map((value: number) => Math.round(value));

        this.form.formSections.forEach((section: any) => {
          section.formControls.forEach((formControl: any) => {
            if (formControl.name == 'totalPremium') {

              if (formControl.radioOptions) {

                formControl.radioOptions.forEach((option: any, index: number) => {
                  if (index === 0) {

                    this.totalPremium = this.tenure1Total;
                    option.label = `1 Yr <b>Rs - ${this.tenure1Total}</b>`;
                    option.value = this.tenure1Total;
                    // option.selected = true;
                    if (index == this.selectedIndex) {
                      section.sectionTitle = "Total Premium: <b>" + this.tenure1Total + "</b> pa";
                      this.dynamicFormGroup.value.totalPremium = this.tenure1Total;
                    }
                  } else if (index === 1) {
                    console.log("index 1 of radio changed");
                    option.label = `2 Yr <b>Rs - ${this.tenure2Total}</b> <span class="green">(7.5 off) </span><b>Saving</b> Rs ${roundedDiscountValues[1]}`;
                    option.value = this.tenure2Total;
                    // option.selected = false;
                    if (index == this.selectedIndex) {
                      section.sectionTitle = "Total Premium: <b>" + this.tenure2Total + "</b> pa";
                      this.dynamicFormGroup.value.totalPremium = this.tenure2Total;
                    }
                  } else if (index === 2) {
                    console.log("index 3 of radio changed");
                    option.label = `3 Yr <b>Rs - ${this.tenure3Total}</b> <span class="green">(10 off) </span><b>Saving</b> Rs ${roundedDiscountValues[2]}`;
                    option.value = this.tenure3Total;
                    // option.selected = false;
                    if (index == this.selectedIndex) {
                      section.sectionTitle = "Total Premium: <b>" + this.tenure3Total + "</b> pa";
                      this.dynamicFormGroup.value.totalPremium = this.tenure3Total;
                    }
                  }
                });
              }

            }
          });
        });


        this.addOnDetails.forEach((addOnDetail: any) => {
          const indexToRemove = addOnDetail.findIndex((addOn: any) => addOn.optionalId === addOnData.addOnId);

          if (indexToRemove !== -1) {
            addOnDetail.splice(indexToRemove, 1);
          }
        });

        if (!this.isAHPAAdded) {
          this.addOnDetails.forEach((member: any) => {
            member.forEach((addOn: any) => {
              addOn.riskClass = this.AHPARiskValue;
            });
          });
        }

      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  changeDependentControls(controlName: string, dependentControlNames: string[]) {

    console.log("changeDependentControls is getting called", controlName, dependentControlNames);

    // Find the section containing the specified control
    const section = this.popUpForm.formSections.find((sec) =>
      sec.formControls.some((ctrl) => ctrl.name === controlName)
    );


    if (section) {
      setTimeout(() => {
        // Find the specified control in the section
        const control = this.popupFormGroup.get(controlName) as unknown as IFormControl;

        if (control) {
          let controlValue: any;

          controlValue = control.value;


          // Iterate through the dependent control names
          dependentControlNames.forEach((dependentName) => {
            // Find the dependent control in the same section
            const dependentControl = section.formControls.find((ctrl) => ctrl.name === dependentName);

            if (dependentControl) {

              // Update the visibility of the dependent control
              dependentControl.visible = controlValue;
            }
          });
        }
      }, 0);
    }
  }

  changeMainFormDependentControls(dependentControlNames: string[], visibility: boolean, controlName: string | null = null, parentControlName: string | null = null, controlIndex: number | null = null) {
    const tempIndex = this.activeMemberTabIndex;
    setTimeout(() => {


      // Iterate through the dependent control names
      dependentControlNames.forEach((dependentName) => {
        this.form.formSections.forEach((section: IFormSections) => {
          section.formControls.forEach((control: IFormControl) => {
            if (control.dynamicControls && controlIndex != null && control.dynamicControls.length > controlIndex) {
              const targetDynamicControl = JSON.parse(JSON.stringify(control.dynamicControls[controlIndex]));
              targetDynamicControl.forEach((dynamicControl: IDynamicControl) => {
                if (dynamicControl.name == dependentName) {
                  dynamicControl.visible = visibility;
                } else if (dynamicControl.subControls && dynamicControl.name == parentControlName) {
                  dynamicControl.subControls.forEach((subControlArray: any) => {
                    subControlArray.forEach((subControl: ISubControl) => {
                      if (subControl.name == dependentName) {
                        subControl.visible = visibility;
                      }
                    });
                  });
                }
              });

              control.dynamicControls[controlIndex] = targetDynamicControl;

            } else if (control.name == dependentName) {
              control.visible = visibility;
            }
          });
        });
      });
      this.changeDetectorRef.detectChanges();
    }, 0);

    this.activeMemberTabIndex = tempIndex;
  }

  popUpDone() {
    this.showPopup = false;
  }

  onPopupHide() {

    if (this.checkboxStateMap.length <= 1) {
      this.dynamicFormGroup.get(this.checkboxStateMap[0] as string)?.setValue(false);
    }
    else {
      this.dynamicFormGroup.get(this.checkboxStateMap[0] as string)?.setValue(true);
    }
    this.checkboxStateMap.length = 0;
  }

  onCheckboxChange(event: any, control: any, parentControl: any = null, index: number | null = null) {

    if (parentControl != null && typeof parentControl === 'object') {
      this.parentControl = parentControl;
    }

    if ((event.target.type === 'checkbox' && event.target.checked) || (event.target.type === 'submit')) {
      this.checkboxStateMap.push(control.name);

      if (parentControl != null && typeof parentControl === 'object') {
        this.form.formSections.forEach((section: any) => {
          section.formControls.forEach((formControl: any) => {
            if (formControl.name == parentControl.name) {
              formControl.showDoneButton = true;
            }
          });
        });
      }
      // Call the method only if the 'method' key is present in the JSON and the checkbox is checked  this.resolveMethod(control.method, control?.popUpFormId, control?.name, control?.dependentControls, 'add');
      if (control.method)
        this.resolveMethod(control.method, control?.popUpFormId, control?.dependentControls, true, control?.name, parentControl?.name, index, 'add');
      // else
      //   this.resolveMethod(control.method, control?.popUpFormId, control?.name, control?.dependentControls, 'add');
    }
    else {

      if (parentControl != null && typeof parentControl === 'object') {
        this.form.formSections.forEach((section: any) => {
          section.formControls.forEach((formControl: any) => {
            if (formControl.name == parentControl.name) {
              formControl.showDoneButton = false;
            }
          });
        });
      }
      if (control.method)
        this.resolveMethod(control.method, control?.popUpFormId, control?.dependentControls, false, control?.name, parentControl?.name, index, 'remove');
      // else
      //   this.resolveMethod(control.method, control?.name, control?.dependentControls, 'remove');
      const indexOfMap = this.checkboxStateMap.indexOf(control.name);
      if (indexOfMap !== -1) {
        // Remove the control name from the array
        this.checkboxStateMap.splice(indexOfMap, 1);
      }
    }
  }

  isValidDate(dateString: string): boolean {
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    return datePattern.test(dateString);
  }

  onPhoneNumberInputChange(event: any, control: any) {
    const input = event.target;
    let value = input.value.replace(/\D/g, ''); // Remove non-digit characters
    if (value.length > 10) {
      value = value.slice(0, 10); // Trim to 10 digits
    }
    input.value = value;
    this.dynamicFormGroup.get(control.name)?.setValue(value);
  }

  onIdNumberInputChange(event: any, control: any): void {
    const input = event.target.value;
    if (input.length > 4) {
      this.dynamicFormGroup.get(control.name)?.setValue(input.slice(0, 4));
    }
  }


  onChangeRadioOption(control: any, event: any, parentControlName: string, index: any): void {
    const pedQuestion = this.dynamicFormGroup.get('insuredMemberDetails') as FormArray;
    console.log(pedQuestion);
    // console.log(pedQuestion.controls[index].get(controlName)?.value);

    this.form.formSections.forEach((section: any) => {
      section.formControls.forEach((formControl: any) => {
        if (formControl.name === parentControlName && formControl.visible == true) {
          console.log(formControl.dynamicControls[index + 1]);
          formControl.dynamicControls[index + 1].forEach((dynamicControl: IDynamicControl) => {
            if (control.dependentControls && dynamicControl.name == control.dependentControls[0]) {
              console.log(dynamicControl);
              if (pedQuestion.controls[index].get(control.name)?.value == 'yes') {
                dynamicControl.visible = true;
              }
              else {
                dynamicControl.visible = false;
              }
            }
            else if(control.name == dynamicControl.name){
              dynamicControl.value = pedQuestion.controls[index].get(control.name)?.value
            }
          });

        }
      });
    });

  }


  onInputChange(event: any, control: IFormControl, parentControl: any = null, index: any = null) {

    if(control.name === 'idProof') {
      const idProof = JSON.parse(event.target.value);
      console.log(idProof);
      const idNumberControl = this.dynamicFormGroup.get('idNo');

      if (idProof.value === 'Aadhar Card') {
        idNumberControl?.setValidators([Validators.required, Validators.minLength(4), Validators.maxLength(4)]);
      } 
    }

    if (control.name === "chequeNumber") {
      const chequeNumber = event.target.value;
      if (chequeNumber.length > 6) {
        event.target.value = chequeNumber.slice(0, 6);
        this.dynamicFormGroup.get(control.name)?.setValue(chequeNumber.slice(0, 6));
        return;
      }
    }

    if (control.name == "memberPolicyType") {
      this.handlePolicyTypeChange(event.target.value, control);
    }
    if (control.type == 'date' && control.dependentControls != null) {
      const dob = event.target.value;
      const dobArray = dob.split('-');

      if (parentControl != null && index != null) {

        if (dobArray[0] as number >= 1800) {
          const ageControl = this.dynamicFormGroup.get(parentControl.name);
          if (ageControl) {
            ageControl.value[index][control.dependentControls[0]] = this.calculateAge(dob);
            this.dynamicFormGroup.get(parentControl.name)?.patchValue(ageControl.value);

          }
        }
      }
      else {
        if (dobArray[0] as number >= 1800) {
          const ageControl = this.dynamicFormGroup.get(control.dependentControls[0]);

          if (dob && ageControl) {
            const age = this.calculateAge(dob);
            ageControl.setValue(age);
          }
        }
      }

    }

    if (control.name === 'gstDetails') {
      const gstType = JSON.parse(event.target.value);
      const gstinControl = this.dynamicFormGroup.get('gstinDetails');

      if (gstType.value === 'Consumers' && gstinControl) {
        gstinControl.disable();
        control.visible = true;
        const gstinField = this.formControls.find(c => c.name === 'gstinDetails');
        if (gstinField) {
          gstinField.visible = false;
        }
      } else if (gstinControl) {
        gstinControl.enable();
        gstinControl.setValidators([Validators.required]);
        gstinControl.updateValueAndValidity();
        control.visible = true;
        const gstinField = this.formControls.find(c => c.name === 'gstinDetails');
        if (gstinField) {
          gstinField.visible = true;
        }
      }
    }


    if (parentControl == null && control.name == 'pincode') {
      let reqData = event.target.value;
      console.log(reqData);
      this.service.getPinCodeByCity(reqData).subscribe({
        next: (res) => {
          console.log(res)
          this.dynamicFormGroup.get('city')?.setValue(res.strcity);
          this.dynamicFormGroup.get('state')?.setValue(res.strstate);
          this.dynamicFormGroup.get('zone')?.setValue(res.strzone);
        },
        error: (err) => {
          console.error(err)
        }
      });
    }
    else if (parentControl != null && parentControl.dynamicControls) {

      parentControl.dynamicControls.forEach((dynamicControls: IDynamicControl[]) => {
        dynamicControls.forEach((dynamicControl: IDynamicControl) => {
          if (dynamicControl.name == 'pincode' && dynamicControl.name == control.name) {

            console.log(event.target.value);
            const reqdata = event.target.value;
            this.spinner.show();
            this.service.getPinCodeByCity(reqdata).subscribe({
              next: (res) => {
                console.log(res)

                const patchObject: { [key: string]: any } = {};

                patchObject['city' as string] = res.strcity;
                patchObject['zone' as string] = res.strzone;
                patchObject['zoneValue' as string] = res.strzonemapping;
                patchObject['state' as string] = res.strstate;

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
                this.spinner.hide();
              }
            });
          }
        });
      });
    }

    if (control.method != null && control.otherControlName != null) {
      this.form.formSections.forEach((section: any) => {
        section.formControls.forEach((formControl: any) => {
          if (formControl.name == control.otherControlName) {
            this.callMethodForOtherControls(event, control.method, control, formControl);
            //this.callMethod(event,control.method, formControl,section);
          }
        });
      });
    }



    if (parentControl != null && control.name == 'relationshipType' && JSON.parse(event.target.value).value == 'Self') {
      (this.dynamicFormGroup.get(parentControl.name) as FormArray)?.controls[index].get('memberdob')?.setValue(this.dynamicFormGroup.get('memberDobProposer')?.value);
      (this.dynamicFormGroup.get(parentControl.name) as FormArray)?.controls[index].get('memberAge')?.setValue(this.dynamicFormGroup.get('memberAgeProposer')?.value);
      (this.dynamicFormGroup.get(parentControl.name) as FormArray)?.controls[index].get('memberGender')?.setValue(this.dynamicFormGroup.get('proposerGender')?.value);
    }
    else if (parentControl != null && control.name == 'relationshipType') {
      (this.dynamicFormGroup.get(parentControl.name) as FormArray)?.controls[index].get('memberdob')?.setValue('');
      (this.dynamicFormGroup.get(parentControl.name) as FormArray)?.controls[index].get('memberAge')?.setValue('');
      (this.dynamicFormGroup.get(parentControl.name) as FormArray)?.controls[index].get('memberGender')?.setValue('');
    }

  }

  async callMethod(methodName: string, control: IFormControl, section?: any) {
    if (control.otherControlName && section != undefined) {
      let otherControl = section.formControls.filter((formControl: IFormControl) => formControl.name == control.otherControlName)[0];
      const method = (this as any)[methodName];
      if (method && typeof method === 'function') {
        await (this as any)[methodName](otherControl)
      } else {
        console.error(`Method ${methodName} not found`);
      }
    }
    else if (control && section == undefined && methodName) {
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
  onPrevious() {
    if (this.getFormIndexValue() > 0) {
      this.decrementIndex()
      this.getFormDataFromFormSequence(this.formSequence[this.getFormIndexValue()].formId);
    }
  }
  async onSubmit() {
    console.log(this.dynamicFormGroup);
    if (this.dynamicFormGroup.valid) {


      // Flatten the form data
      this.flattenObjectInsert(this.dynamicFormGroup.value);
      this.formData = { ...this.formData, ...this.dynamicFormGroup.value };
      console.log(this.form);

      this.allJsonFormData[this.getFormIndexValue()] = this.form;
      console.log(this.allJsonFormData);

      sessionStorage.setItem("allFormData", this.encryptionService.encrypt(this.formData));
      sessionStorage.setItem("allJsonFormData", this.encryptionService.encrypt(this.allJsonFormData));
      console.log(this.formData);

      if (this.form.formTitle.includes("INSURED MEMBERS")) {

        this.insuredMemberDetails = { ...this.insuredMemberDetails, ...this.dynamicFormGroup.value };
        sessionStorage.setItem("insuredMemberDetails", this.encryptionService.encrypt(this.insuredMemberDetails));
        console.log(this.insuredMemberDetails);
      }

      if (this.form.formTitle.includes("Total Premium")) {
        sessionStorage.setItem("addOnList", this.encryptionService.encrypt(this.addOnList));
        sessionStorage.setItem("addOnDetails", this.encryptionService.encrypt(this.addOnDetails));
      }

      if (this.form.saveBtnFunction) {
        await this.resolveMethod(this.form.saveBtnFunction);
      }

      if (this.dynamicFormGroup.get('leadFirstName') && this.dynamicFormGroup.get('leadMiddleName') && this.dynamicFormGroup.get('leadLastName') && this.dynamicFormGroup.get('leadMobileNo') && this.dynamicFormGroup.get('leadEmailId')) {
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
        if (this.dynamicFormGroup.get('idNo')?.value) {
          const idNoControl = this.dynamicFormGroup.get('idNo');
          if (idNoControl) {
            const lastFourDigits = idNoControl.value;
            const maskedIdNo = `XXXXXXXX${lastFourDigits}`;
            console.log(maskedIdNo); 
          }
        }
      }

      // Now continue with the rest of the logic after resolveMethod
      // for Store Form Data in Database
      let reqData = {
        "proposalNum": this.proposalNum,
        "agentCode": this.agentCode,
        "code": this.Code,
        "verticalCode": this.verticalCode,
        "insuranceTypeCode": this.insurancetypecode,
        "formType": this.formSequence[this.getFormIndexValue()].formName,
        "formData": JSON.stringify(this.dynamicFormGroup.value),
        "formName": this.formSequence[this.getFormIndexValue()].formName,
        "formConfig": JSON.stringify(this.formSequence),
        "productId": this.productid
      };
      console.log(reqData);

      this.service.insertOrUpdateFormDataViaVertical(reqData).subscribe({
        next: (res) => {
          this.toast.success({ detail: "SUCCESS", summary: "Form Data Saved Successfully.", duration: 3000 });
        },
        error: (err) => {
          console.error(err);
        }
      });

      if (this.getFormIndexValue() < this.formSequence.length - 1) {

        this.incrementIndex();
        this.getFormDataFromFormSequence(this.formSequence[this.getFormIndexValue()].formId);
      }
    }
    else {
      this.toast.warning({ detail: "WARNING", summary: "Please fill the mandatory fields", duration: 3000 })
    }
  }

  resetForm() {
    this.dynamicFormGroup.reset()
  }
  getValidationErrors(control: IFormControl | IDynamicControl, parentControl: IFormControl | null = null, index: number | null = null): string {

    const myFormControl = parentControl != null && index != null ? (this.dynamicFormGroup.get(parentControl.name) as FormArray).controls[index].get(control.name) : this.dynamicFormGroup.get(control.name)


    let errorMessage = ''
    control.validators?.forEach((val) => {
      if (myFormControl?.hasError(val.validatorName as string)) {
        errorMessage = val.message as string
      }
    })
    return errorMessage;
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

  increment(controlName: any, childControlName: any) {
    const currentValue = this.dynamicFormGroup.get(controlName)?.value;
    this.dynamicFormGroup.get(controlName)?.setValue(currentValue + 1);
    this.form.formSections.forEach(formsection => {
      formsection.formControls.forEach(formControl => {
        if (formControl.dynamicControls && formControl.name == childControlName && formControl.visible == true) {
          let tempDynamicControl = formControl.dynamicControls[0].map((element: any) => ({ ...element }));
          formControl.dynamicControls.push(tempDynamicControl)
          let formArr = this.dynamicFormGroup.get(childControlName) as FormArray;
          formArr.push(this.initializeDynamicFormControls(tempDynamicControl, currentValue + 1));
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
          if (formControl.dynamicControls && formControl.name == childControlName && formControl.visible == true) {
            formControl.dynamicControls.pop();
          }
        });
      });
      let formArr = this.dynamicFormGroup.get(childControlName) as FormArray;
      formArr.removeAt(formArr.length - 1);
    }
  }

  // For Progress Bar & Dynamically Go to any Page
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
  setFormIndex(index: any) {

    this.setFormIndexValue(index);
    this.getFormDataFromFormSequence(this.formSequence[this.getFormIndexValue()].formId);
  }


  getPopupFormDataFromFormSequence(formSeq: any) {
    this.service.getJSONFormViaVerticalCode(this.verticalCode, this.Code, this.insurancetypecode, this.productid, formSeq).subscribe({
      next: (res) => {
        console.log(res);
        this.popUpForm = JSON.parse(res.jsonformdata);
        this.initializaPopupForm();
        this.showPopup = true;
      },
      error: (err) => {
        console.error(err);
      }
    })
  }

  initializaPopupForm() {
    if (this.popUpForm?.formSections) {
      let formGroup: any = {};
      this.popUpForm.formSections.forEach((section) => {
        section.formControls.forEach((control: IFormControl) => {
          let controlValidators: any = [];
          if (control.validators) {
            control.validators.forEach((val: IValidator) => {
              if (val.validatorName === 'required') controlValidators.push(Validators.required);
              if (val.validatorName === 'email') controlValidators.push(Validators.email);
              if (val.validatorName === 'minlength') controlValidators.push(Validators.minLength(val.minLength as number));
              if (val.validatorName === 'maxlength') controlValidators.push(Validators.maxLength(val.maxLength as number));
              if (val.validatorName === 'pattern') controlValidators.push(Validators.pattern);
            })
          }
          if (control.type === 'radio' && control.radioOptions) {
            this.selectedOptions = control.radioOptions.find(option => option.selected === true);
            const initialValue = this.selectedOptions ? this.selectedOptions.value : null;
            this.contactMethod = initialValue;
            formGroup[control.name] = [initialValue, controlValidators];
          } else {
            formGroup[control.name] = ['', controlValidators];
          }
        });
        this.popupFormGroup = this.fb.group(formGroup)
      });
      this.dynamciallyLoadCSS(this.popUpForm)
      const radioOptionsControl = this.popupFormGroup.get('contact');

      if (radioOptionsControl) {
        this.radioOptionsSubscription = radioOptionsControl.valueChanges.subscribe((value: string) => {
          console.log(value);

          this.contactMethod = value;
        });
      }

    }
  }


  calculateAge(dob: string): number {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  handlePolicyTypeChange(memberPolicyType: string, control: any): void {
    console.log('Policy Type:', memberPolicyType, control, this.dynamicFormGroup.value);
    const sumInsuredControl = this.dynamicFormGroup.get('memberSumInsured');
    console.log(sumInsuredControl);
    const pincodeControl = this.dynamicFormGroup.get('pincode');
    console.log(pincodeControl);
    if (sumInsuredControl || pincodeControl) {
      setTimeout(() => {
        this.dynamicFormGroup.removeControl('insuredMemberDetails');
        if (memberPolicyType === 'Multi Individual' || memberPolicyType === 'Individual') {

          if (control.method)
            this.resolveMethod(control.method, control.dependentControls, false, control.name);


          this.form.formSections.forEach((section: any) => {
            if (section.sectionTitle == "Insured Member Details") {
              section.formControls[0].visible = true;
              section.formControls[1].visible = true;
              section.formControls[2].visible = false;

              const prevInsuredValue = this.dynamicFormGroup.get(section.formControls[0].name)?.value;

              for (let i = 0; i < prevInsuredValue - 1; i++) {
                section.formControls[2].dynamicControls.pop();
              }
              this.dynamicFormGroup.get(section.formControls[0].name)?.setValue(1);
              let tempFormArray = this.fb.array([]);
              // console.log(control.dynamicControls.length);

              for (let i = 1; i < section.formControls[1].dynamicControls.length; i++) {
                tempFormArray.push(this.initializeDynamicFormControls(section.formControls[1].dynamicControls[i], i));
              }
              this.dynamicFormGroup.addControl(section.formControls[1].name, tempFormArray);
            }
          });

        } else if (memberPolicyType === 'Family Floater') {
          if (control.method)
            this.resolveMethod(control.method, control.dependentControls, true, control.name);

          this.form.formSections.forEach((section: any) => {
            if (section.sectionTitle == "Insured Member Details") {
              section.formControls[0].visible = true;
              section.formControls[1].visible = false;
              section.formControls[2].visible = true;

              const prevInsuredValue = this.dynamicFormGroup.get(section.formControls[0].name)?.value;

              for (let i = 0; i < prevInsuredValue - 1; i++) {
                section.formControls[1].dynamicControls.pop();
              }
              this.dynamicFormGroup.get(section.formControls[0].name)?.setValue(1);

              let tempFormArray = this.fb.array([]);
              // console.log(control.dynamicControls.length);

              for (let i = 1; i < section.formControls[2].dynamicControls.length; i++) {
                tempFormArray.push(this.initializeDynamicFormControls(section.formControls[2].dynamicControls[i], i));
              }
              this.dynamicFormGroup.addControl(section.formControls[2].name, tempFormArray);
            }
          });
        }
        else {
          if (control.method)
            this.resolveMethod(control.method, control.dependentControls, false, control.name);
          this.form.formSections.forEach((section: any) => {
            if (section.sectionTitle == "Insured Member Details") {
              section.formControls[0].visible = false;
              section.formControls[1].visible = false;
              section.formControls[2].visible = false;

            }
          });
        }
      }, 0);


    }
    else {
      console.error('Sum Insured Control or Pincode Control not found in dynamicFormGroup.');
    }
  }

  async getPremiumAmount(control: IFormControl) {
    console.log("getPremiumAmount is getting called");
    this.tenure1Total = 0;
    this.tenure2Total = 0;
    this.tenure3Total = 0;

    this.premiumDetails = [];
    this.premiumAmountDetails = [];

    console.log(this.insuredMemberDetails);
    var relationShip: string = '';
    var maxAge: number = 0;

    if (this.formData.memberPolicyType === 'Multi Individual' || this.formData.memberPolicyType === 'Individual') {
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
        // const memberGender = JSON.parse(member.memberGender)
        // member.memberGender = memberGender.value;
        member['relationShip'] = relationShip;
        member['prodCd'] = ''
        if (this.formData.memberPolicyType == 'Family Floater') {
          member['sumInsured'] = this.formData.memberSumInsured;
          member['zone'] = this.formData.zone;
          member['city'] = this.formData.city;
          member.prodCd = this.formData.memberPlan;
          member.memberAge = maxAge;
          member['pincode'] = this.formData.pincode;
          member['preExistingDisease'] = "no";
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


      try {

        let quoteResponse: any;

        if (this.formData.productType == 'AF') {
          quoteResponse = await new Promise((resolve, reject) => {
            this.service.getActiveFitQoute(reqData).subscribe({
              next: (res) => {
                console.log(res);
                resolve(res)
                console.log(res);
              },
              error: (err) => { reject(err) }
            });
          });
        }
        else {
          quoteResponse = await new Promise((resolve, reject) => {
            this.service.getQoute(reqData).subscribe({
              next: (res) => {
                console.log(res);
                resolve(res)
                console.log(res);
              },
              error: (err) => { reject(err) }
            });
          });
        }
        console.log(quoteResponse);

        if (this.formData.memberPolicyType == 'Multi Individual' || this.formData.memberPolicyType == 'Individual') {
          quoteResponse.forEach((element: any) => {
            element.prmMemDtlSecureEntity.forEach((member: any) => {
              let tempArray: number[] = [];
              member.premium.forEach((premium: any) => {
                if (premium.tenure === 1) {
                  this.tenure1Total += premium.premium || 0;
                } else if (premium.tenure === 2) {
                  this.tenure2Total += premium.premium || 0;
                } else if (premium.tenure === 3) {
                  this.tenure3Total += premium.premium || 0;
                }
                tempArray.push(premium.premium);
              });
              this.premiumDetails.push(member.premium);
              this.premiumAmountDetails.push(tempArray);
            });
          });
        }
        else {
          quoteResponse.forEach((element: any) => {
            let tempArray: number[] = [];
            element.prmMemDtlSecureEntity[0].premium.forEach((premium: any) => {
              if (premium.tenure === 1) {
                this.tenure1Total = premium.premium || 0;
              } else if (premium.tenure === 2) {
                this.tenure2Total = premium.premium || 0;
              } else if (premium.tenure === 3) {
                this.tenure3Total = premium.premium || 0;
              }
              tempArray.push(premium.premium);
            });

            this.premiumAmountDetails.push(tempArray);
          })

          for (let i = 0; i < this.formData.numberOfInsuredMembers - 1; i++) {
            this.premiumAmountDetails.push([0, 0, 0]);
          }
        }



        console.log(this.tenure1Total, this.tenure2Total, this.tenure3Total);
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
          zoneDiscount: this.formData.productType == 'AF' || this.formData.productType == 'AC' || this.formData.productType == 'GHS' || this.formData.productType == 'AGS' || this.formData.productType == 'STUB' ? 0 : 9,
          memberDiscount: 0,
          addOnList: this.addOnList
        };

        if (this.formData['numberOfInsuredMembers'] > 1 && this.formData['memberPolicyType'] == 'Multi Individual') {
          reqData2.memberDiscount = 5;
          console.log(reqData2);
        }

        console.log(reqData2);
        this.spinner.show();

        const addOnPremiumResponse: any = await new Promise((resolve, reject) => {
          this.service.getAddOnPremium(reqData2).subscribe({
            next: (response) => resolve(response),
            error: (err) => reject(err)
          });
        });

        console.log(addOnPremiumResponse);

        this.tenure1Total = Math.round(addOnPremiumResponse.calculatedValuesList[0]);
        this.tenure2Total = Math.round(addOnPremiumResponse.calculatedValuesList[1]);
        this.tenure3Total = Math.round(addOnPremiumResponse.calculatedValuesList[2]);

        this.taxList = addOnPremiumResponse.taxList;
        this.netPremiumList = addOnPremiumResponse.netPremiumList;
        this.totalPremiumList = addOnPremiumResponse.totalPremiumList;
        this.indPremiumList = addOnPremiumResponse.indPremiumList;
        this.addOnPremiumValueList = addOnPremiumResponse.totalPremiumValue;

        const roundedDiscountValues = addOnPremiumResponse.discountValueList.map((value: number) => Math.round(value));
        const displayTaxValues = this.taxList.map((value: number) => Math.round(value));
        console.log(displayTaxValues);

        this.form.formSections.forEach((section: any) => {
          section.formControls.forEach((formControl: any) => {
            if (formControl.name == 'totalPremium') {
              if (formControl.radioOptions) {
                formControl.radioOptions.forEach((option: any, index: number) => {
                  if (index === 0) {
                    this.totalPremium = this.tenure1Total;
                    option.label = `1 Yr <b>Rs - ${this.tenure1Total}</b>`;
                    formControl.value = this.tenure1Total;
                    section.sectionTitle = "<b>Total Premium: INR " + this.tenure1Total + " pa</b>";
                    option.value = this.tenure1Total;
                    this.dynamicFormGroup.value.totalPremium = this.tenure1Total;
                    this.selectedIndex = index;
                  } else if (index === 1) {
                    console.log("index 1 of radio changed");
                    option.label = `2 Yr <b>Rs - ${this.tenure2Total}</b> <span class="green">(7.5 off) </span><b>Saving</b> Rs ${roundedDiscountValues[1]}`;
                    option.value = this.tenure2Total;
                  } else if (index === 2) {
                    console.log("index 3 of radio changed");
                    option.label = `3 Yr <b>Rs - ${this.tenure3Total}</b> <span class="green">(10 off) </span><b>Saving</b> Rs ${roundedDiscountValues[2]}`;
                    option.value = this.tenure3Total;
                  }
                });
              }
            }
          });
        });
        this.changeDetectorRef.detectChanges();
        this.spinner.hide();
        console.log("updated the values");
        console.log(this.form.formSections[3].formControls[3].subControls?.[0]?.[3].innerSubControls?.[1].options?.[0]);
      } catch (err) {
        console.error(err);
        this.spinner.hide();
      }
    }
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

  getAllOccupationRisk(control: any) {
    this.service.getAllOccupationRisk().subscribe({
      next: (res) => {
        console.log(res);
        control.options = res.RiskOccupation;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  calculatePremiumPerype(insuredMembers: any): String {
    var premiumPerype = "";
    premiumPerype = insuredMembers.length + "A";
    console.log(premiumPerype);
    return premiumPerype;
  }
  stringifyObject(obj: any): string {
    return JSON.stringify(obj);
  }

  getAllRelationship(control: any) {
    this.spinner.show();
    this.service.getRelationship().subscribe({
      next: (res) => {
        console.log(res);
        control.options = res.RelationShip;
        console.log(control);
        this.spinner.hide();
      },
      error: (err) => {
        this.spinner.hide();
        console.error(err);
      }
    });
  }

  getNomineeRelationShip(control: any) {
    this.service.getNomineeRelationship().subscribe({
      next: (res) => {
        console.log(res);
        control.options = res.nomineeRelationShip;;
        console.log(control);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  getAllBankDetails(control: any) {
    this.service.getAllBankDetails().subscribe({
      next: (res) => {
        control.options = res.allBanksData;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }


  getBankCity(event: any, otherControl: any) {
    const data = JSON.parse(event.target.value);
    this.bankName = data.id as string;
    const reqData = {
      "bankName": this.bankName
    }
    this.service.getBankCity(reqData).subscribe({
      next: (res) => {
        otherControl.options = res.AllBankCity;
      },
      error: (err) => {
        console.error(err);
      }
    })
  }

  getBranchDetails(event: any, otherControl: any) {
    const data = JSON.parse(event.target.value);
    this.bankCity = data.id as string;
    const reqData = {
      "bankName": this.bankName,
      "city": this.bankCity
    }
    this.service.getBranchDetails(reqData).subscribe({
      next: (res) => {
        otherControl.options = res.BranchDetails;
      },
      error: (err) => {
        console.error(err);
      }
    })
  }

  setIfscCode(event: any, otherControl: any) {
    const data = JSON.parse(event.target.value);
    this.dynamicFormGroup.get('ifscCode')?.setValue(data.id);
    this.dynamicFormGroup.get('micrCode')?.setValue(data.value);
  }

  generateLeadAndProposalId() {
    if(this.dynamicFormGroup.valid) {

      console.log(this.dynamicFormGroup.value);
    }
    const reqData = {
      "proposalNum": this.proposalNum,
      "productId": this.productid,
      "agencyCode": this.agencyCode,
      "agentCode": this.agentCode,
      "insuranceTypeCode": this.insurancetypecode,
      "leadFirstName": this.dynamicFormGroup.get('leadFirstName')?.value,
      "leadLastName": this.dynamicFormGroup.get('leadLastName')?.value,
      "leadMobileNo": this.dynamicFormGroup.get('leadMobileNo')?.value,
      "leadEmailId": this.dynamicFormGroup.get('leadEmailId')?.value
    }
    console.log("HELLO",reqData);

    this.service.insertLeadDetails(reqData).subscribe({
      next: (res) => {
        this.leadId = res.leadId;
        this.proposalId = res.proposalId;
        this.quoteId = res.quoteId;
        sessionStorage.setItem("leadId", this.encryptionService.encrypt(this.leadId));
        sessionStorage.setItem("proposalId", this.encryptionService.encrypt(this.proposalId));
        sessionStorage.setItem("quoteId", this.encryptionService.encrypt(this.quoteId));
        this.form.formSections[0].formControls[5].visible = false;
        // this.leadCreated = true;
        this.toast.success({ detail: "SUCCESS", summary: "Proposal Created Successfully.", duration: 3000 });
      },
      error: (err) => {
        console.error(err);
      }
    });
    console.log(this.form);
  }

  memberDetailsOption(control: any) {
    if (sessionStorage.getItem("insuredMemberDetails")) {
      const selectedValue = this.encryptionService.decrypt(sessionStorage.getItem("insuredMemberDetails") as string);
      // control.options = this.encryptionService.decrypt(selectedValue as string).insuredMemberDetails;
      // console.log(control.options);
      selectedValue?.insuredMemberDetails.forEach((element: any) => {
        control.options.push(JSON.parse(element.relationshipType));
      });
    }
  }


  getEncryptedPremiumAmount(tempData: any) {
    // Get encrypted premium amount and add it to tempData
    return this.service.getTotalPremiumEncrypted(this.formData['totalPremium']).pipe(
      concatMap((encryptedPremium) => {
        return of({
          ...tempData,
          encryptedPremiumAmount: encryptedPremium
        });
      })
    );
  }

  leadCreationAndUpdateDate() {
    const currentTimestamp = Date.now();
    const currentTimestampInSeconds = Math.floor(currentTimestamp / 1000);
    return currentTimestampInSeconds;
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

  async halfQuotation() {
    this.spinner.show();

    let reqData = JSON.parse(JSON.stringify(this.formData));

    console.log(reqData);

    Object.keys(reqData).forEach(key => {
      const value = reqData[key];

      if (Array.isArray(value)) {
        value.forEach((element: any) => {

          Object.keys(element).forEach((key: any) => {
            const value = element[key];
            // console.log(key, value);
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
          // If parsing fails, log an error
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

    reqData['selectedIndex'] = this.selectedIndex + 1;
    reqData['quoteDate'] = new Date().toISOString().split('T')[0];
    reqData['preIssuanceDate'] = new Date().toISOString().split('T')[0];
    reqData['customerSignatureDate'] = new Date().toISOString().split('T')[0];
    reqData['agentSignatureDate'] = new Date().toISOString().split('T')[0];
    reqData['leadId'] = this.leadId;
    reqData['pinCode'] = reqData.insuredMemberDetails[0].pincode;
    reqData['preIssuranceTime'] = new Date().toISOString().split('T')[1].split('.')[0];
    console.log(reqData);
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
      console.log(res);

      const response = res as any;

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
    console.log(this.mainData);
    var reqData: any = {
      code: this.Code,
      insuranceTypeCode: this.insurancetypecode,
      productId: this.productid,
      configuration_Json: JSON.stringify(this.mainData),
      fullQuote: true,
      productType: this.mainData.productType
    };
    console.log(reqData);
    // this.spinner.show();

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

        console.log(key, response[key]);
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
      console.log(this.dynamicFormGroup.value);

      this.formData = { ...this.formData, ...this.dynamicFormGroup.value };
      console.log(this.formData);
      sessionStorage.setItem("allFormData", this.encryptionService.encrypt(this.formData));

      this.toast.success({ detail: "SUCCESS", summary: `Full Quotation Generated Successfully.${this.customerId}`, duration: 3000 });
    } catch (err) {
      console.error(err);
      this.spinner.hide();
    }

  }

  getNatureOfDuties(control: any) {
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

  modifyInsuredMemberDetails() {
    const tempInsuredMember = [];

  }

  checkValidations(control: IFormControl | IDynamicControl, parentControl: IFormControl | null = null, index: number | null = null): boolean {
    const myFormControl = parentControl != null && index != null ? (this.dynamicFormGroup.get(parentControl.name) as FormArray).controls[index].get(control.name) : this.dynamicFormGroup.get(control.name)
    return myFormControl?.invalid as boolean && myFormControl?.markAsDirty as unknown as boolean;
  }

  lastPageRedirect() {
    this.router.navigate(['/portal/agent/viewproducts']);
  }
}
