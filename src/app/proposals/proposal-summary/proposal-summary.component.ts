import { DOCUMENT } from '@angular/common';
import { Component, inject, Inject, Input, Renderer2 } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { IDynamicControl, IForm, IFormControl, IOptions, ISubControl, IValidator } from 'src/app/interface/form.interface';
import { YatraService } from 'src/app/yatra/yatra/yatra.service';
@Component({
  selector: 'app-proposal-summary',
  templateUrl: './proposal-summary.component.html',
  styleUrls: ['./proposal-summary.component.scss']
})
export class ProposalSummaryComponent {

  formConfig: any = {};
  fb = inject(FormBuilder)
  token: any;
  proposalNumber: any;
  sharecontentForm!: FormGroup;
  sharecontent!: IForm;
  isHtmlrender: any = false
  private dynamicStyle!: HTMLLinkElement;
  formData: any;
  selectedButton: any;
  isBBPlanDetailsVisible: boolean = false;
  isPlanDetailsVisible: boolean = false;
  @Input() formData1: any;


  constructor(
    private yatraService: YatraService, private route: ActivatedRoute, private formBuilder: FormBuilder,
    private renderer: Renderer2, @Inject(DOCUMENT) private document: Document, private toast: NgToastService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      this.proposalNumber = params['pNum'];
      if (this.token) {
        localStorage.setItem('token', this.token);
      }
    });
    this.getFormInfo();
  }

  inItForm() {
    console.log(this.formData, this.sharecontent);
    this.dynamciallyLoadCSS(this.sharecontent);
    this.sharecontent.formSections.forEach((section: any) => {
      section.formControls.forEach((control: any) => {
        // const policyindex = control.dynamicControls[0].findIndex((item:any) => item.value === this.formData.planType);
        if (control.dynamicControls) {

          if (this.formData[control.name] && (control.visible == true)) {
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
                // if (innerControl.name == 'covers') {
                //   innerControl.value = this.covers[index];
                // }
                if (innerControl.name == 'zoneValue') {
                  innerControl.options = member.upgradableZones;
                }
                if (innerControl.name == 'sumInsured') {
                  innerControl.options = member.upgradableSumInsured;
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
    if (this.sharecontent?.formSections) {
      this.sharecontentForm = this.formBuilder.group({});
      this.sharecontent.formSections.forEach((section: any) => {
        section.formControls.forEach((control: any) => {
          if (control.dynamicControls) {
            if (control.visible == true) {
              let tempFormArray = this.fb.array([]);
              for (let i = 1; i < control.dynamicControls.length; i++) {
                tempFormArray.push(this.initializeDynamicFormControls(control.dynamicControls[i], i, control));
              }
  
              this.sharecontentForm.addControl(control.name, tempFormArray);
            }
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
                if (val.validatorName === 'requiredTrue') {
                  // Custom validator for checkboxes
                  controlValidators.push((formControl: AbstractControl) => {
                    return formControl.value === true ? null : { requiredTrue: val.message || 'This field is required' };
                  });
                }
              })
            }
            if (['text', 'email', 'password', 'number', 'date', 'summary', 'displaycovers'].includes(control.type) && control.methodName) {
              if (control.otherControlName) {
                this.callMethod(control.methodName, control, section)
              }
              else {
                this.resolveMethod(control.methodName, control)
              }
            }
            this.sharecontentForm.addControl(control.name, new FormControl(control.value, controlValidators));
          }
        });
      });
      this.flattenObject(this.formData);
    }
    // this.dynamciallyLoadCSS(this.sharecontent);
    console.log(this.sharecontentForm);
  }

  async getFormInfo() {
    let reqBody: any = {};
    reqBody.formId = '2';
    const Data =
    {
      proposalNumber: this.proposalNumber
    }
    //  {
    //   partnerId: '19',
    //   productId: '1',
    //   formId: '4',
    //   proposalNum: this.proposalNumber,
    //   agentCode: 'ABH1101006',
    //   leadId: '',
    //   isLead: false,
    //   currentFormSequence: '5'
    // }

    await this.yatraService.getforminfobyproposalNum(Data).subscribe({
      next: (res: any) => {
        console.log(res);
        // this.form = JSON.parse(res.data.jsonFormData);
        this.formData = JSON.parse(res.data.formData);
        this.yatraService.getStaticForms(reqBody).subscribe(
          (response: any) => {
            console.log(response);
            if (response.isSuccess) {
              console.log(response);
              this.sharecontent = JSON.parse(JSON.parse(response.data.formJson));
              console.log(this.sharecontent);
              this.inItForm();
            }
          }, (error) => {
            console.error(error)
          });
      },
      error: (err) => {
        console.log(err);
      }
    });

  }

  dynamciallyLoadCSS(form: IForm) {
    let tf: string = "default.css";
    if (form.themeFile) tf = form.themeFile;
    this.dynamicStyle = this.renderer.createElement('link');
    this.renderer.setAttribute(this.dynamicStyle, 'rel', 'stylesheet');
    this.renderer.setAttribute(this.dynamicStyle, 'type', 'text/css');
    this.renderer.setAttribute(this.dynamicStyle, 'href', './assets/styles/dynamicForm/' + tf)
    this.renderer.appendChild(this.document.head, this.dynamicStyle);
    this.isHtmlrender = true;
  }

  handleAction(methodName: string) {
    if (methodName) {
      console.log(`Action triggered for method: ${methodName}`);
      // Add your custom logic for handling button clicks here.
    }
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
        return control; // Fallback if emailId is not available
      default:
        return control;
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
  getButtonClass(control: any): string {
    return this.selectedButton === control.name ? 'active-button' : '';
  }
  onConfirmClick(control: any) {
    console.log(control);
    let requestBody: any = {};
    requestBody.proposalNumber = this.proposalNumber;

    this.yatraService.confirmproposer(requestBody).subscribe(
      (res: any) => {
        if (res.isSuccess) {
          this.toast.success({ detail: "Success", summary: "Constent Successfully Done", duration: 3000 });
          control.visible = false;
        }
      },
      (error) => {
        console.error(error);
      });
  }
  openPlanSummary() {
    this.isPlanDetailsVisible = !this.isPlanDetailsVisible;
    this.isBBPlanDetailsVisible = !this.isBBPlanDetailsVisible;
  }
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
        } else {
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
  flattenObject(obj: any, prefix = '') {
    Object.keys(obj).forEach(key => {
      const value = obj[key];
      const newKey = prefix + key;
      if (typeof value === 'object' && value !== null && Object.keys(value).length > 0) {
        if (typeof value === 'object' && value !== null && 'id' in value) {
          this.sharecontentForm.get(newKey)?.patchValue(value);
        }
        else if (this.sharecontentForm.get(newKey) instanceof FormGroup) {
          const formGroup = this.sharecontentForm.get(newKey);
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
        if (this.sharecontentForm.get(newKey) && this.sharecontentForm.get(newKey)?.value == "") {
          this.sharecontentForm.get(newKey)?.patchValue(value);
        }
      }
    });
  }
  initializeDynamicFormControls(dynamicFormControls: any, index: any = null, parentControl: any = null) {
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
        else if (control.type == 'select' && control.methodName) {
          this.resolveMethod(control.methodName, control, index);
        }

        // if (control.type == 'select' && control.value === "") {
        //   // Set control value if any option is selected
        //   if (control.options && control.options.length > 0) {
        //     control.options.forEach((option: IOptions) => {
        //       if (option.selected) {
        //         control.value = option.id ? this.stringifyObject(option) : option.value;
        //       }
        //     });
        //   }
        // }


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
  getAllRelationship(control: any) {
    // this.spinner.show();
    // this.yatraService.getRelationship().subscribe({
    //   next: (res: any) => {
    //     control.selectCheckboxOptions.forEach((element: any) => {
    //       const index = res.RelationShip.findIndex((relation: any) => relation.value === element.label);
    //       element.id = res.RelationShip[index].id;
    //     })
    //   },
    //   error: (err) => {
    //     console.error(err);
    //   }
    // });
  }
  parseJson(value: string): any[] {
    try {
      return JSON.parse(value || "[]");
    } catch (e) {
      return [];
    }
  }
  hasAnyValue(
    control: IFormControl | IDynamicControl,
    parentControl: IFormControl | IDynamicControl | ISubControl | null = null,
    index: number | null = null,
    innerControl: any = null,
    indexj: any = null,
    subControl: any = null
  ): boolean {
    if (parentControl != null && index != null) {
      const parentFormArray = this.sharecontentForm.get(parentControl.name) as FormArray;
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
    const mainControl = this.sharecontentForm.get(control.name);
    if (innerControl != null) {
      return !!mainControl?.get(innerControl.name)?.value;
    }

    return !!mainControl?.value;
  }
}
