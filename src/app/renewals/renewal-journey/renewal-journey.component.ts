import { DOCUMENT } from '@angular/common';
import { Component, Inject, inject, Renderer2 } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IDynamicControl, IForm, IFormControl, IOptions, ISubControl, IValidator } from 'src/app/interface/form.interface';
import { EncryptionService } from 'src/app/services/encryption.service';
import { renewals_lead } from 'src/assets/styles/renewals-forms/lead';

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

  constructor(private route: ActivatedRoute,private encryptionService: EncryptionService,private renderer: Renderer2,@Inject(DOCUMENT) private document: Document){

  }

  ngOnInit(){
    this.showHtmlContent = false;
    console.log("history.state");
    debugger;
    if (Object.keys(this.route.snapshot.queryParams).length) {
      this.route.queryParams.subscribe(async params => {
        const decryptedData = this.encryptionService.decrypt(params['formData']);
        this.formData = {...this.formData,...decryptedData};
        this.proposalNum = this.encryptionService.decrypt(params['proposalNum']);
        this.policyNumber = this.encryptionService.decrypt(params['policyNumber']);
      });
    }

    
    console.log(this.formData,this.proposalNum,this.policyNumber);
    
    this.getFormDataFromFormSequence();
  }

  async getFormDataFromFormSequence(){
    this.showHtmlContent = false;
    if (this.dynamicStyle) {
      this.renderer.removeChild(this.document.head, this.dynamicStyle)
      this.showHtmlContent = false;
    }

    this.form = renewals_lead;
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

    if (this.form?.formSections) {
      this.renewalFormGroup = this.fb.group({});
      this.form.formSections.forEach((section) => {
        section.formControls.forEach(async (control: IFormControl) => {
          if (control.dynamicControls) {
            if (control.visible == true) {
              let tempFormArray = this.fb.array([]);
              for (let i = 1; i < control.dynamicControls.length; i++) {
                tempFormArray.push(this.initializeDynamicFormControls(control.dynamicControls[i], i));
              }
              this.renewalFormGroup.addControl(control.name, tempFormArray);
            }
          }
          // else if (control.subControls) {
          //   if (control.type == 'questionnaire') {
          //     let demoMember: any;
          //     let demoTypeIndex: any;
          //     let doneButton: any;
          //     console.log(control);
          //     if (control.subControls) {
          //       demoMember = control.subControls.findIndex(control => control.name === 'demoMember')
          //       demoTypeIndex = control.subControls.findIndex(control => control.name === 'demoType');
          //       doneButton = control.subControls.find(control => control.name === 'doneButton');
          //       console.log(control);
          //       control.subControls = [
          //         ...control.subControls.slice(demoMember, demoMember + 1),
          //         ...control.subControls.slice(demoTypeIndex, demoTypeIndex + 1), // Retain demoType
          //       ]; // Keep the first control (or reset)
          //       console.log(control);
          //     }
          //     console.log(this.formData['insuredMemberDetails']);
          //     this.formData['insuredMemberDetails'].forEach((member: any, index: any) => {
          //       console.log(member, this.formData[control.name], control);
          //       if (control.subControls) {
          //         let tempMemberControl = JSON.parse(JSON.stringify(control.subControls[0]));
          //         let tempInnerControl = JSON.parse(JSON.stringify(control.subControls[1]));

          //         const tempRelationshipType = JSON.parse(member.relationshipType);
          //         tempMemberControl.label = tempRelationshipType.value;
          //         tempMemberControl.name = tempRelationshipType.value.toLowerCase();
          //         tempInnerControl.label = tempRelationshipType.value;
          //         tempInnerControl.name = tempRelationshipType.value;
          //         console.log(tempInnerControl);
          //         if (this.formData[control.name] && this.formData[control.name][tempMemberControl.name] == true) {
          //           for (const key in this.formData[control.name]) {
          //             const value = this.formData[control.name][key];
          //             if (key == tempRelationshipType.value.toLowerCase()) {
          //               if (typeof this.formData[control.name][key] === 'boolean' && this.formData[control.name][key] == true) {
          //                 // const arrayName = (key).charAt(0).toUpperCase() + (key).slice(1);
          //                 console.log(key, value);
          //                 tempMemberControl.value = true;
          //                 tempInnerControl.visible = true;
          //                 this.formData[control.name][tempRelationshipType.value].forEach((item: any) => {
          //                   tempInnerControl.innerArrayControl.push(tempInnerControl.innerArrayControl[0])
          //                 })
          //               }
          //             }
          //           }
          //         }
          //         else {
          //           tempInnerControl.innerArrayControl.push(tempInnerControl.innerArrayControl[0])
          //         }

          //         control.subControls?.push(tempMemberControl);
          //         control.subControls?.push(tempInnerControl);
          //         console.log(control);
          //       }
          //     });
          //     control.subControls?.push(doneButton);
          //     console.log(control);
          //     this.renewalFormGroup.addControl(control.name, this.initializeSubControls(control.subControls.slice(2)));
          //   }
          //   else {
          //     control.subControls.forEach((subControl: ISubControl) => {
          //       if (subControl.name == 'addOnDetails') {
          //         let demoTypeIndex: any;
          //         let doneButton: any;
          //         if (subControl.innerSubControls) {
          //           demoTypeIndex = subControl.innerSubControls.findIndex(control => control.name === 'demoType');
          //           doneButton = subControl.innerSubControls.find(control => control.name === 'doneButton');
          //           // Slice the array to retain demoType and doneButton only
          //           subControl.innerSubControls = [
          //             ...subControl.innerSubControls.slice(demoTypeIndex, demoTypeIndex + 1), // Retain demoType
          //             // ...subControl.innerSubControls.slice(doneButtonIndex, doneButtonIndex + 1) // Retain doneButton
          //           ]; // Keep the first control (or reset)
          //         }


          //         console.log(subControl.innerSubControls);


          //         this.formData['insuredMemberDetails'].forEach((member: any) => {
          //           if (subControl.innerSubControls) {
          //             let tempInnerControl = JSON.parse(JSON.stringify(subControl.innerSubControls[0]));
          //             console.log(tempInnerControl, member);

          //             const tempRelationshipType = JSON.parse(member.relationshipType);
          //             tempInnerControl.label = tempRelationshipType.value;
          //             tempInnerControl.name = tempRelationshipType.value;
          //             if (subControl.conditionCheck) {
          //               tempInnerControl.coreControls.forEach((corecontrol: any, index: any) => {
          //                 if (corecontrol.dependentControls && this.formData[control.name]) {
          //                   const newvalue = this.formData[control.name][subControl.name][tempRelationshipType.value][index][corecontrol.name];
          //                   corecontrol.dependentControls.forEach((question: any) => {
          //                     let newcontrol = tempInnerControl.coreControls.find((item: any) => item.name == question)
          //                     newcontrol.visible = newvalue;
          //                     console.log(corecontrol.name, question, newcontrol, newvalue);
          //                   })
          //                   console.log(this.formData[control.name][subControl.name][tempRelationshipType.value][index][corecontrol.name], control, subControl, tempRelationshipType.value, index, corecontrol);
          //                 }
          //               })
          //             }
          //             subControl.innerSubControls?.push(tempInnerControl);
          //           }
          //         });
          //         subControl.innerSubControls?.push(doneButton);
          //       }
          //     });
          //   }

          //   console.log(this.initializeSubControls(control.subControls));

          //   this.renewalFormGroup.addControl(control.name, this.initializeSubControls(control.subControls));
          // }
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
              this.renewalFormGroup.addControl(control.name, controlGroup);
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
                if (control.methodName) {
                  await this.resolveMethod(control.methodName, control);
                }
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
            const radioOptionsControl = this.renewalFormGroup.get('totalPremium');

            if (radioOptionsControl) {
              radioOptionsControl.valueChanges.subscribe((value: string) => {

                this.form.formSections.forEach((section: any) => {
                  section.formControls.forEach((formControl: any) => {
                    if (formControl.name == 'totalPremium' && formControl.type == 'custom-radio') {
                      this.selectedIndex = formControl.radioOptions.findIndex((option: any) => option.value === value);
                      // if (this.QuoteNumber.length > 0) {
                      //   this.formData.quoteId = this.QuoteNumber[this.selectedIndex];
                      // }
                      this.formData.tenure = this.selectedIndex + 1;
                      console.log(this.selectedIndex, this.formData);
                    }
                  });
                });
              })
            }

            if (control.name == 'totalPremium' && this.totalPremium != 0) {
              console.log(this.totalPremium);
              this.renewalFormGroup.addControl(control.name, new FormControl(this.totalPremium, controlValidators));
            }
            else
              this.renewalFormGroup.addControl(control.name, new FormControl(control.value, controlValidators));

            if (control.name == 'memberDobProposer') {
              console.log(control, this.renewalFormGroup.get(control.name));
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
    debugger;
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

  onInputChange(event: any, control: any, parentControl: any = null, index: any = null, subControl: any = null, innerControl: any = null, indexj: any = null) {
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
}
