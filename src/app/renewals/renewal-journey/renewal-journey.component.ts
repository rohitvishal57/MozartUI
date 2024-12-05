import { DOCUMENT } from '@angular/common';
import { Component, Inject, inject, Renderer2 } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { tap } from 'rxjs';
import { IDynamicControl, IForm, IFormControl, IFormSections, IOptions, ISubControl, IValidator } from 'src/app/interface/form.interface';
import { EncryptionService } from 'src/app/services/encryption.service';
import { YatraService } from 'src/app/yatra/yatra/yatra.service';
import { combinedForms } from 'src/assets/styles/renewals-forms/combined_forms';
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
  selectedButton: string | null = null;

  constructor(private route: ActivatedRoute, private encryptionService: EncryptionService, private renderer: Renderer2, @Inject(DOCUMENT) private document: Document, private yatraService: YatraService, private toast: NgToastService) {

  }

  ngOnInit() {
    this.showHtmlContent = false;
    console.log("history.state");
    if (Object.keys(this.route.snapshot.queryParams).length) {
      this.route.queryParams.subscribe(async params => {
        const decryptedData = this.encryptionService.decrypt(params['formData']);
        this.formData = { ...this.formData, ...decryptedData };
        this.proposalNum = this.encryptionService.decrypt(params['proposalNum']);
        this.policyNumber = this.encryptionService.decrypt(params['policyNumber']);
      });
    }


    console.log(this.formData, this.proposalNum, this.policyNumber);

    this.getFormDataFromFormSequence();
  }

  async getFormDataFromFormSequence() {
    this.showHtmlContent = false;
    if (this.dynamicStyle) {
      this.renderer.removeChild(this.document.head, this.dynamicStyle)
      this.showHtmlContent = false;
    }

    // this.form = renewals_lead;
    this.form = combinedForms;
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
            // if (['text', 'email', 'password', 'number', 'date', 'summary'].includes(control.type) && control.methodName) {
            //   if (control.otherControlName) {
            //     this.callMethod(control.methodName, control, section)
            //   }
            //   else {
            //     this.resolveMethod(control.methodName, control)
            //   }
            // }
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

            // if (control.type == 'radio') {

            //   control.value = control.radioOptions?.find(option => option.selected)?.value || "";

            //   if (control.methodName)
            //     this.callMethod(control.methodName, control);
            // }

            // if (control.type == 'custom-radio' && control.methodName) {
            //   this.resolveMethod(control.methodName, control);
            // }
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

  async resolveMethod(methodName: string, control: any, ...args: any[]): Promise<any> {
    console.log(`Resolving method: ${methodName}`);

    // Filter valid arguments
    let filteredArgs = args.filter(arg => arg !== undefined && arg !== null);

    const method = (this as any)[methodName] as Function;
    if (method && typeof method === 'function') {
      try {
        const result = method.bind(this)(control, ...filteredArgs);

        if (result && typeof result.then === 'function') {
          await result; // If result is a Promise
        } else {
          await Promise.resolve(result); // Wrap non-Promise results
        }

        // Return control or updated state
        return control;
      } catch (error) {
        console.error(`Error in method ${methodName}`, error);
        throw error;
      }
    } else {
      console.warn(`Method ${methodName} not found.`);
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

  onInputChange(event: any, control: any, parentControl: any = null, index: any = null, subControl: any = null, innerControl: any = null, indexj: any = null) {
    console.log('still working');

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

          this.form.formSections.forEach((section: any) => {
            section.formControls.forEach((control: any) => {
              if (control.name === 'insuredMembers') {
                // Loop the options and see if the option has value true in the insuredMembers in formData
                control.selectCheckboxOptions.forEach((option: any) => {
                  if (this.formData.insuredMembers[option.value] === true) {
                    // Call memberSelected function (pass null for event if not triggering through UI)
                    this.memberSelected(null, option, control);
                  }
                });
              }
            });
          });
          this.flattenObject(this.formData);


          console.log(this.formData, this.form);
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

  onSubmit() {
    console.log(this.renewalFormGroup.value);

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
    this.renewalFormGroup.removeControl('insuredMemberDetails');
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
                  let controlValidators: any = [];
                  control.validators?.forEach((val: IValidator) => {
                    if (val.validatorName === 'required') controlValidators.push(Validators.required);
                    if (val.validatorName === 'email') controlValidators.push(Validators.email);
                    if (val.validatorName === 'minlength') controlValidators.push(Validators.minLength(val.minLength as number));
                    if (val.validatorName === 'maxlength') controlValidators.push(Validators.maxLength(val.maxLength as number));
                    if (val.validatorName === 'pattern') controlValidators.push(Validators.pattern(val.pattern as string));
                  });
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
              tempControl[0].value = JSON.stringify(option);
              // if (this.isQuote) {
              //   tempControl.forEach((temp) => {
              //     if (temp.name == 'zoneValue') {
              //       temp.options = this.formData['upgradableZones'];
              //     }
              //   })
              // }
              formControl.dynamicControls?.push(tempControl);
              console.log(this.formData);

              let formArr = this.renewalFormGroup.get(controls.idProperty) as FormArray;
              // let formArr;

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

}
