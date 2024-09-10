import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { JsonEditorComponent, JsonEditorOptions } from 'ang-jsoneditor';
import { NgToastService } from 'ng-angular-popup';
import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';
import { IDynamicControl, IFormControl, IFormSections, IValidator } from 'src/app/interface/form.interface';
import { AdminService } from 'src/app/services/admin.service';
import { CommonService } from 'src/app/services/common.service';


@Component({
  selector: 'app-edit-form',
  templateUrl: './edit-form.component.html',
  styleUrls: ['./edit-form.component.scss'],
  providers: [ConfirmationService, MessageService]
})
export class EditFormComponent {
  form: any;
  dynamicFormGroup: FormGroup = this.fb.group({});

  bankCode: any;
  verticalCode: any;
  insuranceTypeCode: any;
  productId: any;
  showFormJson: boolean = false;

  Control: any;
  indexI: any = 0;
  indexJ: any = 0;
  indexK: any = 0;
  Section: any;
  DynamicControl: any;
  jsonFormData: any;


  // For JSON Editor
  public editorOptions: JsonEditorOptions;
  @ViewChild(JsonEditorComponent, { static: false }) editor:
    | JsonEditorComponent
    | undefined;

  // For Drag And Drop
  draggedField: any = null;
  draggedFieldIndex: any = null;
  visibleFormEdit: boolean = false;
  visibleSection: boolean[] = [];
  visibleControl: boolean[][] = [[]];
  visibleDynamicControl: boolean[][][] = [[[]]];

  formSequence: any[] = [];

  jsonForm: any;
  classList: string[] = [''];
  selectedClass: string = '';

  masterFormList: any = []
  formName: any;
  formId: any;

  formJson: any = null
  formModels: any[] = [
    {
      "formTitle": "Form Title",
      "themeFile": "temp.css",
      "cancelBtnTitle": "CANCEL",
      "resetBtnTitle": "",
      "calculateBtnTitle": "",
      "saveBtnTitle": "SUBMIT",
      "class": "",
      "isPopup": true,
      "formSections": []
    },
    {
      "sectionTitle": "Section Title",
      "visible": true,
      "class": "col-md-12",
      "formControls": []
    },
    {
      "name": "Details",
      "label": "Details Label",
      "visibleLabel": false,
      "type": "details",
      "value": 1,
      "class": "col-md-12",
      "dynamicControls": [[]]
    },
    {
      "name": "tabview",
      "label": "Tabview Label",
      "visibleLabel": false,
      "type": "tabview",
      "value": 1,
      "class": "col-md-12",
      "placeholder": "",
      "dynamicControls": [[]]
    },
    {
      "name": "text",
      "label": "Text Label",
      "visibleLabel": true,
      "type": "text",
      "value": "",
      "class": "col-md-4 control",
      "disabled": false,
      "otherControlName": "",
      "subType": "",
      "methodName": "",
      "controlName": "",
      "bigFont": false,
      "placeholder": "",
      "showBorder": false,
      "validators": [
        {
          "validatorName": "required",
          "required": true,
          "message": "Name is required field."
        },
        {
          "validatorName": "minlength",
          "minlength": 3,
          "message": "Name should be atleast 3 characters."
        },
        {
          "validatorName": "maxlength",
          "maxlength": 20,
          "message": "Name should be atmost 20 characters."
        },
        {
          "validatorName": "pattern",
          "pattern": "^[a-zA-Z ]*$",
          "message": "Name should contain only alphabets."
        }
      ]
    },
    {
      "name": "password",
      "label": "Password Label",
      "visibleLabel": true,
      "type": "password",
      "value": "",
      "class": "col-md-4 control",
      "validators": [
        {
          "validatorName": "required",
          "required": true,
          "message": "Password is a required field."
        },
        {
          "validatorName": "minlength",
          "minlength": 8,
          "message": "Password should be at least 8 characters."
        },
        {
          "validatorName": "maxlength",
          "maxlength": 20,
          "message": "Password should be at most 20 characters."
        }
      ]
    },
    {
      "name": "email",
      "label": "Email Label",
      "visibleLabel": true,
      "type": "email",
      "value": "",
      "class": "col-md-4 control",
      "validators": [
        {
          "validatorName": "required",
          "required": true,
          "message": "Email is a required field."
        },
        {
          "validatorName": "pattern",
          "pattern": "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}",
          "message": "Please enter a valid email address."
        },
        {
          "validatorName": "email",
          "email": "true",
          "message": "Please enter a valid email address."
        }
      ]
    },
    {
      "name": "number",
      "label": "Number Label",
      "visibleLabel": true,
      "type": "number",
      "value": "",
      "class": "col-md-4 control",
      "visible": false,
      "validators": [
        {
          "validatorName": "required",
          "required": true,
          "message": "Number is a required field."
        },
        {
          "validatorName": "minlength",
          "minlength": 0,
          "message": "Number should be greater than or equal to 0."
        },
        {
          "validatorName": "maxlength",
          "maxlength": 100,
          "message": "Number should be less than or equal to 100."
        },
        {
          "validatorName": "pattern",
          "pattern": "^[0-9]*$",
          "message": "Number should contain only digits."
        }
      ]
    },
    {
      "name": "date",
      "label": "Date Label",
      "visibleLabel": true,
      "type": "date",
      "class": "col-md-4 control",
      "value": "",
      "visible": false,
      "disabled": false,
      "validators": [
        {
          "validatorName": "required",
          "required": true,
          "message": "Date is a required field."
        }
      ]
    },
    {
      "name": "datetime",
      "label": "Date and Time Label",
      "visibleLabel": true,
      "type": "datetime-local",
      "value": "",
      "class": "col-md-4 control",
      "validators": [
        {
          "validatorName": "required",
          "required": true,
          "message": "Date and time is a required field."
        }
      ]
    },
    {
      "name": "textarea",
      "label": "Textarea Label",
      "visibleLabel": true,
      "type": "textarea",
      "value": "",
      "class": "col-md-4 control",
      "validators": [
        {
          "validatorName": "required",
          "required": true,
          "message": "Textarea is a required field."
        },
        {
          "validatorName": "minlength",
          "minlength": 10,
          "message": "Textarea should be at least 10 characters."
        },
        {
          "validatorName": "maxlength",
          "maxlength": 200,
          "message": "Textarea should be at most 200 characters."
        }
      ]
    },
    {
      "name": "checkbox",
      "label": "Checkbox Label",
      "visibleLabel": true,
      "type": "checkbox",
      "class": "col-md-4 control",
      "value": false,
      "validators": [
        {
          "validatorName": "required",
          "required": true,
          "message": "Checkbox is a required field."
        }
      ]
    },
    {
      "name": "toggle",
      "label": "Toggle Label",
      "visibleLabel": true,
      "type": "toggle",
      "class": "col-md-4 control",
      "value": false,
      "validators": [
        {
          "validatorName": "required",
          "required": true,
          "message": "Toggle is a required field."
        }
      ]
    },
    {
      "name": "radio",
      "label": "Radio Label",
      "visibleLabel": true,
      "type": "radio",
      "class": "col-md-4 control",
      "value": "Option1",
      "options": [
        {
          "id": 1,
          "name": "Option 1",
          "value": "Option1"
        },
        {
          "id": 2,
          "name": "Option 2",
          "value": "Option2"
        }
      ],
      "validators": [
        {
          "validatorName": "required",
          "required": true,
          "message": "Please select a radio option."
        }
      ]
    },
    {
      "name": "select",
      "label": "Select Label",
      "visibleLabel": true,
      "type": "select",
      "class": "col-md-4 control",
      "value": "",
      "methodName": "",
      "subType": "",
      "otherControlName": "",
      "disabled": false,
      "visible": true,
      "options": [
        {
          "id": 1,
          "name": "Option 1",
          "value": "Value1"
        },
        {
          "id": 2,
          "name": "Option 2",
          "value": "Value2"
        }
      ],
      "validators": [
        {
          "validatorName": "required",
          "required": true,
          "message": "Select is a required field."
        }
      ]
    },
    {
      "name": "Increment",
      "label": "Increment Label",
      "visibleLabel": false,
      "type": "increment",
      "text": "",
      "value": 1,
      "class": "col-md-2",
      "validators": [
        {
          "validatorName": "required",
          "required": true,
          "message": "increment is required field."
        }
      ]
    },
    {
      "name": "sendlink",
      "label": "Send Link Label",
      "class": "col-md-12 center-img",
      "visibleLabel": false,
      "type": "sendlink",
      "value": "Send Payment Link"
    },
    {
      "name": "button",
      "type": "button",
      "label": "Button Label",
      "class": "col-md-3 my-btn-class1"
    },
    {
      "name": "boldText",
      "label": "Bold Text Name",
      "visibleLabel": true,
      "visible": true,
      "type": "boldtext",
      "class": "col-md-3",
      "value": "",
      "text": ""
    },
    {
      "name": "paragraph",
      "label": "Paragraph",
      "visible": true,
      "visibleLabel": true,
      "type": "paragraph",
      "value": "",
      "class": "col-md-6"
    },
    {
      "name": "multiSelectCheckbox",
      "label": "Multi-Select Checkbox",
      "visibleLabel": true,
      "visible": true,
      "type": "multiSelectCheckbox",
      "methodName": "getProposerRelationship",
      "class": "",
      "idProperty": "insuredMemberDetails",
      "value": "",
      "selectCheckboxOptions": [
        {
          "id": 1,
          "name": "Option 1",
          "value": "Value1",
          "isIncrement": true,
          "imagePath": ""
        },
        {
          "id": 2,
          "name": "Option 2",
          "value": "Value2",
          "isIncrement": true,
          "imagePath": ""
        }
      ]
    },
    {
      "name": "MobileNo",
      "label": "Mobile Number",
      "visibleLabel": true,
      "visible": true,
      "type": "phonenumber",
      "value": "",
      "class": "col-md-6",
      "validators": [
        {
          "validatorName": "required",
          "required": true,
          "message": "Mobile No is required field."
        },
        {
          "validatorName": "pattern",
          "pattern": "^[6-9]\\d{0,10}$",
          "message": "Mobile No is not valid"
        }
      ]
    }
  ]
  // "button":"bigFont","banner":"expandable","checkbox-group":"bigLabel","image":
  formControlsIcons: any[] = [
    { "iconClass": "fa pull-left fa-font" },
    { "iconClass": "fa-solid fa-lock" },
    { "iconClass": "fa pull-left fa-envelope" },
    { "iconClass": "fa pull-left fa-phone" },
    { "iconClass": "fa pull-left fa-calendar" },
    { "iconClass": "fa pull-left fa-clock" },
    { "iconClass": "fa pull-left fa-text-width" },
    { "iconClass": "fa pull-left fa-square-check" },
    { "iconClass": "fa-solid fa-toggle-on" },
    { "iconClass": "fa pull-left fa-list-ul" },
    { "iconClass": "fa pull-left fa-bars" },
    { "iconClass": "fa pull-left fa-plus" },
    { "iconClass": "fa pull-left fa-link" },
    { "iconClass": "fa pull-left fa-stop" },
    { "iconClass": "fa-solid fa-bold" },
    { "iconClass": "fa-solid fa-paragraph" },
    { "iconClass": "fa fa-thin fa-xmark" },
    { "iconClass": "fa pull-left fa-phone" },
    { "iconClass": "fa pull-left fa-bars" },
    { "iconClass": "fa pull-left fa-phone" }
  ]


  constructor(private fb: FormBuilder, private confirmationService: ConfirmationService, private toast: NgToastService,
    private messageService: MessageService, private commonService: CommonService, private router: Router,
    private http: HttpClient, private adminService: AdminService) {
    this.editorOptions = new JsonEditorOptions();
    this.editorOptions.modes = ['code', 'text', 'tree', 'view'];
    this.editorOptions.mode = 'code';
  }

  ngOnInit() {
    this.visibleFormEdit = false;
    this.visibleSection = [];
    this.visibleControl = [[]]
    this.visibleDynamicControl = [[[]]];
    this.draggedField = null;
    this.draggedFieldIndex = null;
    // this.formJson = null

    this.showFormJson = false;
    this.bankCode = history.state.bankCode;
    this.verticalCode = history.state.verticalCode;
    this.insuranceTypeCode = history.state.insuranceTypeCode;
    this.productId = history.state.productId;
    console.log(history.state);

    this.jsonForm = this.fb.group({
      Code: [this.bankCode, Validators.required],
      insuranceTypeCode: [this.insuranceTypeCode, Validators.required],
      productId: [this.productId, Validators.required],
      formName: ['', Validators.required],
      formId: ['', Validators.required],
      jsonFormData: ['', Validators.required],
    });
    if (history.state.form) {
      console.log('anekant');
      this.formJson = history.state.form;
      this.jsonForm.get('formName')?.setValue(history.state.formName);
      this.jsonForm.get('formId')?.setValue(history.state.formId);
      this.formName = history.state.formName;
      this.formId = history.state.formId;
    }
    else {
      this.formJson = this.jsonForm.jsonFormData;
    }
    this.masterFormSequence();
    // this.formJson = this.jsonForm.jsonFormData;
    console.log(this.formJson);
    this.initializeJsonEditorForm();
    this.getFormSequence();
    const cssUrl = 'assets/styles/dynamicForm/ABHI.css';
    this.loadCssFile(cssUrl);
    console.log(this.classList);
  }
  navigateBack(verticalCode: any) {
    if (verticalCode == 12) {
      this.router.navigate(['/portal/finaladminDashboard/addBank']);
    } else if (verticalCode == 13) {
      this.router.navigate(['/portal/finaladminDashboard/addAgency']);
    }
  }
  initializeJsonEditorForm() {
    this.form = this.fb.group({
      myJson: [this.formJson]
    });

    if (this.formJson == null) {
      this.form.get('myJson')?.valueChanges.subscribe((newValue: any) => {
        if (newValue != null) {
          this.formJson = newValue;
          if (this.formJson.formSections != null) {
            this.initializeVisibility();
          }
        }
      });
    }
    else {
      this.initializeForm();
    }

  }
  initializeVisibility() {
    console.log(this.formJson);
    this.visibleSection = [];
    this.visibleControl = [[]];
    this.visibleDynamicControl = [[[]]];
    this.formJson.formSections.forEach((section: any, i: number) => {
      this.visibleSection.push(false);
      this.visibleControl.push([]);
      section.formControls.forEach((control: any, j: number) => {
        this.visibleControl[i].push(false);
        this.visibleDynamicControl[i].push([]);
        control.dynamicControls.forEach((dynamicControl: any, k: number) => {
          this.visibleDynamicControl[i][j].push(false);
        });
      });
    });
    console.log(this.visibleSection, this.visibleControl, this.visibleDynamicControl);
  }

  initializeForm() {
    console.log("hell", this.formJson);
    this.visibleSection = [];
    this.visibleControl = [[]];
    this.visibleDynamicControl = [[[]]];
    // this.formJson.formSections.forEach((section:any,i:any) => {
    //   console.log(i);
    //   this.visibleSection.push(false);
    //   this.visibleControl.push([]);
    //   // this.visibleDynamicControl.push([]);
    //   section.formControls.forEach((control:any,j:any) => {
    //     console.log(j);
    //     this.visibleControl[i].push(false);
    //     if(control.dynamicControls){
    //       this.visibleDynamicControl.push([]);
    //       control.dynamicControls.forEach((dynamicControl:any,k:any) => {
    //         console.log(k);
    //         this.visibleDynamicControl[i][j].push(false);
    //       });
    //     }
    //   });
    // });
    this.formJson.formSections.forEach((section: any, i: number) => {
      this.visibleSection.push(false);
      this.visibleControl.push([]);
      this.visibleDynamicControl.push([]);
      section.formControls.forEach((control: any, j: number) => {
        this.visibleControl[i].push(false);
        this.visibleDynamicControl[i].push([]);
        if (control.dynamicControls) {
          for (let k = 1; k <= control.dynamicControls.length; k++) {
            console.log(control.dynamicControls);
            this.visibleDynamicControl[i][j].push(false);
          }
        }
      });
    });
    console.log(this.visibleFormEdit);
    console.log(this.visibleSection);
    console.log(this.visibleControl);
    console.log(this.visibleDynamicControl);
    if (this.formJson?.formSections) {
      this.dynamicFormGroup = this.fb.group({});
      this.formJson.formSections.forEach((section: IFormSections) => {
        section.formControls.forEach((control: IFormControl) => {
          if (control.dynamicControls) {
            let tempFormArray = this.fb.array([]);
            for (let i = 1; i < control.dynamicControls.length; i++) {
              tempFormArray.push(this.initializeDynamicFormControls(control.dynamicControls[i]))
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

            this.dynamicFormGroup.addControl(control.name, new FormControl(control.value, controlValidators));
          }
        });
      });
    }

  }
  initializeDynamicFormControls(dynamicFormControls: any) {
    let formGroup: any = this.fb.group({})
    dynamicFormControls.forEach((control: IDynamicControl) => {
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
      formGroup.addControl(control.name, new FormControl(control.value, controlValidators));
    })
    return formGroup;
  }
  increment(controlName: any, childControlName: any) {
    const currentValue = this.dynamicFormGroup.get(controlName)?.value;
    this.dynamicFormGroup.get(controlName)?.setValue(currentValue + 1);
    this.formJson.formSections.forEach((formsection: { formControls: any[]; }) => {
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
      this.formJson.formSections.forEach((formsection: { formControls: any[]; }) => {
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
  // Drag And Drop By NGX-Drag-Drop

  onDragStart(event: DragEvent, index: number) {
    this.draggedFieldIndex = index;
  }
  onDragEnd(event: DragEvent) {
    this.draggedFieldIndex = null;
  }
  onDragover(event: DragEvent) {
    console.log("dragover");
  }
  onDrop(event: any) {
    console.log(event, this.draggedFieldIndex);
    if (this.formJson == null && this.draggedFieldIndex == 0 && (event.dropEffect === "copy" || event.dropEffect === "move")) {
      if (event.dropEffect === "copy") {
        this.formJson = event.data;
      }
    }
    else if (this.formJson != null && this.draggedFieldIndex == 1 && (event.dropEffect === "copy" || event.dropEffect === "move")) {
      if (event.dropEffect === "copy") {
        this.formJson.formSections.push(event.data);
        this.visibleSection.push(false);
        this.visibleControl.push([]);
        this.visibleDynamicControl.push([]);
      }
    }
  }
  onDropControl(event: any, index: number) {
    console.log(event, index, this.draggedFieldIndex);
    if (this.draggedFieldIndex == 1 && (event.dropEffect === "copy" || event.dropEffect === "move")) {
      if (event.dropEffect === "copy") {
        this.formJson.formSections.push(event.data);
        this.visibleSection.push(false);
        this.visibleControl.push([]);
        this.visibleDynamicControl.push([]);
      }
    }
    else if (this.draggedFieldIndex > 1 && (event.dropEffect === "copy" || event.dropEffect === "move")) {
      if (event.dropEffect === "copy") {
        this.formJson.formSections[index].formControls.push(event.data);
        this.visibleControl[index].push(false);
        this.visibleDynamicControl[index].push([]);
      }
    }
  }
  onDropDynamicControl(event: any, i: number, j: number) {
    console.log(event, i, j, this.draggedFieldIndex);
    if ((this.draggedFieldIndex == 2 || this.draggedFieldIndex == 3) && (event.dropEffect === "copy" || event.dropEffect === "move")) {
      if (event.dropEffect === "copy") {
        this.formJson.formSections[i].formControls.push(event.data);
        this.visibleControl[i].push(false);
        this.visibleDynamicControl.push([]);
      }
    }
    else if (this.draggedFieldIndex > 3 && (event.dropEffect === "copy" || event.dropEffect === "move")) {
      if (event.dropEffect === "copy") {
        this.formJson.formSections[i].formControls[j].dynamicControls[0].push(event.data);
        this.visibleDynamicControl[i][j].push(false);
      }
    }
  }
  // Helper Method
  onFormEdit() {
    this.visibleFormEdit = true;
    console.log(this.visibleFormEdit);
    this.visibleSection[this.indexI] = false;
    this.visibleControl[this.indexI][this.indexJ] = false;
    this.visibleDynamicControl[this.indexI][this.indexJ][this.indexK] = false;
  }
  onSectionEdit(i: number, section: any) {
    console.log(i, section);
    this.visibleSection[i] = true;
    console.log(this.visibleSection);
    this.Section = section;
    this.indexI = i;
    this.visibleFormEdit = false;
    this.visibleControl[this.indexI][this.indexJ] = false;
    this.visibleDynamicControl[this.indexI][this.indexJ][this.indexK] = false;
  }
  onControlEdit(i: number, j: number, control: any) {
    console.log(i, j, control);
    this.visibleControl[i][j] = true;
    console.log(this.visibleControl);
    this.Control = control;
    this.indexI = i;
    this.indexJ = j;
    this.visibleFormEdit = false;
    this.visibleSection[this.indexI] = false;
    this.visibleDynamicControl[this.indexI][this.indexJ][this.indexK] = false;
  }
  onDynamicControlEdit(i: number, j: number, k: number, control: any) {
    console.log(i, j, k, control, this.visibleDynamicControl);
    this.visibleDynamicControl[i][j][k] = true;
    this.DynamicControl = control;
    this.indexI = i;
    this.indexJ = j;
    this.indexK = k;
    this.visibleFormEdit = false;
    this.visibleSection[this.indexI] = false;
    this.visibleControl[this.indexI][this.indexJ] = false;
  }
  removeForm() {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.formJson = null;
        this.Section = null;
        this.Control = null;
        this.DynamicControl = null;
      },
      reject: (type: any) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: 'error',
              summary: 'Rejected',
              detail: 'You have rejected',
            });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({
              severity: 'warn',
              summary: 'Cancelled',
              detail: 'You have cancelled',
            });
            break;
        }
      },
    });

  }
  removeSection(i: number, section: any) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.formJson.formSections.splice(i, 1);
        this.visibleSection.splice(i, 1);
        this.visibleControl.splice(i, 1);
        this.visibleDynamicControl.splice(i, 1);
        this.Section = section;
        this.Control = null;
        this.DynamicControl = null;
      },
      reject: (type: any) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: 'error',
              summary: 'Rejected',
              detail: 'You have rejected',
            });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({
              severity: 'warn',
              summary: 'Cancelled',
              detail: 'You have cancelled',
            });
            break;
        }
      },
    });
    console.log(this.visibleFormEdit);
    console.log(this.visibleSection);
    console.log(this.visibleControl);
    console.log(this.visibleDynamicControl);
  }
  removeControl(i: number, j: number, control: any) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.formJson.formSections[i].formControls.splice(j, 1);
        this.visibleControl[i].splice(j, 1);
        this.visibleDynamicControl[i].splice(j, 1);
        this.Control = control;
        this.DynamicControl = null;
      },
      reject: (type: any) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: 'error',
              summary: 'Rejected',
              detail: 'You have rejected',
            });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({
              severity: 'warn',
              summary: 'Cancelled',
              detail: 'You have cancelled',
            });
            break;
        }
      },
    });
    console.log(this.visibleFormEdit);
    console.log(this.visibleSection);
    console.log(this.visibleControl);
    console.log(this.visibleDynamicControl);
  }
  removeDynamicControl(i: number, j: number, k: number, control: any) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.formJson.formSections[i].formControls[j].dynamicControls[0].splice(k, 1);
        this.visibleDynamicControl[i][j].splice(k, 1);
        this.DynamicControl = control;
      },
      reject: (type: any) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: 'error',
              summary: 'Rejected',
              detail: 'You have rejected',
            });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({
              severity: 'warn',
              summary: 'Cancelled',
              detail: 'You have cancelled',
            });
            break;
        }
      },
    });
    console.log(this.visibleFormEdit);
    console.log(this.visibleSection);
    console.log(this.visibleControl);
    console.log(this.visibleDynamicControl);
  }
  getFirstLetterCappital(word: any) {
    if (!word) return word;
    return word[0].toUpperCase() + word.substr(1);
  }

  onSubmit() {
  }

  //For Drag and Drop Using Angular CDK
  dropSection(event: CdkDragDrop<any[]>): void {
    moveItemInArray(this.formJson.formSections, event.previousIndex, event.currentIndex);
  }
  dropControl(event: CdkDragDrop<any[]>, index: any): void {
    moveItemInArray(this.formJson.formSections[index].formControls, event.previousIndex, event.currentIndex);
  }
  dropDynamicControl(event: CdkDragDrop<any[]>, i: any, j: any): void {
    moveItemInArray(this.formJson.formSections[i].formControls[j].dynamicControls, event.previousIndex, event.currentIndex);
  }

  drop(event: CdkDragDrop<any[]>): void {
    moveItemInArray(this.formSequence, event.previousIndex, event.currentIndex);
  }

  // For Validators 
  getErrorMessage(errors: any, control: any): string {
    for (const validator of control.validators) {
      if (errors[validator.validatorName]) {
        return validator.message;
      }
    }
    return '';
  }

  // For Options
  deleteOptions(i: number, j: number, k: number) {
    if (k > 0)
      this.formJson.formSections[i].formControls[j].options.splice(k, 1);
  }
  addOptions(i: number, j: number, k: number) {
    let id = this.formJson.formSections[i].formControls[j].options[this.formJson.formSections[i].formControls[j].options.length - 1].id;
    this.formJson.formSections[i].formControls[j].options.push({ id: id + 1, name: "", value: "" });
  }
  deleteDynamicOptions(i: number, j: number, k: number, l: number) {
    if (l > 0)
      this.formJson.formSections[i].formControls[j].dynamicControls[k].options.splice(l, 1);
  }
  addDynamicOptions(i: number, j: number, k: number, l: number) {
    let id = this.formJson.formSections[i].formControls[j].dynamicControls[k].options[this.formJson.formSections[i].formControls[j].dynamicControls[k].options.length - 1].id;
    this.formJson.formSections[i].formControls[j].dynamicControls[k].options.push({ id: id + 1, name: "", value: "" });
  }

  gotoFormSequence() {
    location.reload();
    // this.router.navigate(['portal/finaladminDashboard/formSequence'],
    //   {
    //     state: {
    //       bankCode: history.state.bankCode,
    //       verticalCode: history.state.verticalCode,
    //       insuranceTypeCode: history.state.insuranceTypeCode,
    //       productId: history.state.productId
    //     }
    //   });
  }
  getFormSequence() {
    this.commonService
      .getFormConfigViaVerticalCode(
        this.verticalCode,
        this.bankCode,
        this.insuranceTypeCode,
        this.productId,
      )
      .subscribe({
        next: (res) => {
          console.log(res);

          this.formSequence = JSON.parse(res.insureFormConfiguration);
        },
        error: (err) => {
          this.formSequence = [];
        },
      });
  }
  onSaveForm() {
    this.jsonForm.get('jsonFormData').setValue(this.formJson);
    console.log(this.jsonForm.value);
    if (this.jsonForm.valid) {
      this.jsonForm.addControl('verticalCode', new FormControl(this.verticalCode));
      console.log(this.jsonForm.value);
      this.confirmationService.confirm({
        message: 'Are you sure that you want to proceed?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          let formName = this.jsonForm.value.formName;
          this.jsonForm.removeControl('formName');
          this.jsonForm.value.jsonFormData = JSON.stringify(
            this.jsonForm.value.jsonFormData
          );
          console.log(this.jsonForm.value);
          this.commonService.insertJSONForm(this.jsonForm.value).subscribe({
            next: (res) => {
              console.log(res);
            },
            error: (err) => {
              console.error(err);
            }
          })
          this.jsonForm.removeControl('jsonFormData');
          this.jsonForm.removeControl('insuranceTypeCode');
          this.jsonForm.removeControl('Code');
          this.jsonForm.removeControl('productId');
          this.jsonForm.addControl(
            'formName',
            new FormControl(formName, Validators.required)
          );

          let data = this.jsonForm.value;
          console.log(data, this.formSequence);
          const isDataPresent = this.formSequence.some(
            (form) =>
              form.formId == data.formId && form.formName == data.formName
          );
          console.log(isDataPresent);
          if (!isDataPresent) {
            console.log(this.formSequence);
            this.formSequence.push(data);
            console.log(this.formSequence);
            this.saveFormSequence();
          }
          this.jsonForm.addControl(
            'jsonFormData',
            new FormControl('', Validators.required)
          );
          this.jsonForm.addControl(
            'insuranceTypeCode',
            new FormControl(
              this.insuranceTypeCode,
              Validators.required
            )
          );
          this.jsonForm.addControl(
            'Code',
            new FormControl(this.bankCode, Validators.required)
          );
          this.jsonForm.addControl(
            'productId',
            new FormControl(this.productId, Validators.required)
          );
        },
        reject: (type: any) => {
          switch (type) {
            case ConfirmEventType.REJECT:
              this.messageService.add({
                severity: 'error',
                summary: 'Rejected',
                detail: 'You have rejected',
              });
              break;
            case ConfirmEventType.CANCEL:
              this.messageService.add({
                severity: 'warn',
                summary: 'Cancelled',
                detail: 'You have cancelled',
              });
              break;
          }
        },
      });
    } else {
      this.toast.warning({
        detail: 'WARNING',
        summary: 'fill all details!!',
        duration: 4000,
      });
    }
  }
  saveFormSequence() {
    let req = {
      Code: this.bankCode,
      insuranceTypeCode: this.insuranceTypeCode,
      productId: this.productId,
      insureFormConfiguration: JSON.stringify(this.formSequence),
      verticalCode: this.verticalCode
    };
    this.commonService.insertFormConfig(req).subscribe({
      next: (res) => {
        this.messageService.add({
          severity: 'info',
          summary: 'Confirmed',
          detail: 'Form Sequence Updated Successfully.',
        });
      },
      error: (err) => {
        console.error(err);
      },
    });
    // this.getFormSequence();
  }

  selectradio(inputcontrol: any, event: any) {
    console.log(inputcontrol, this.indexI, this.indexJ, this.indexK);
    let index = this.formModels.findIndex((control) => control.type === inputcontrol.type);
    console.log(index);
    if (event.target.value === 'hide') {
      console.log('hide');
      delete this.formJson.formSections[this.indexI].formControls[this.indexJ].dynamicControls[0][this.indexK].validators;
      console.log(this.formJson.formSections[this.indexI].formControls[this.indexJ].dynamicControls[0][this.indexK]);
    }
    else if (event.target.value === 'view') {
      console.log('show');
      this.formJson.formSections[this.indexI].formControls[this.indexJ].dynamicControls[0][this.indexK].validators = this.formModels[index].validators;
      console.log(this.formJson.formSections[this.indexI].formControls[this.indexJ].dynamicControls[0][this.indexK]);

    }
  }
  updateValidators() {
    if (this.Control.visible == false || this.Control.disabled == true) {
      // Automatically select "hide" validation
      this.Control.validators = false;
      this.selectcontrolradio(this.Control, { target: { value: 'hide' } });
    } else {
      // Automatically select "view" validation
      this.Control.validators = true;
      this.selectcontrolradio(this.Control, { target: { value: 'view' } });
    }
  }
  selectcontrolradio(inputcontrol: any, event: any) {
    console.log(inputcontrol, this.indexI, this.indexJ, this.indexK);
    let index = this.formModels.findIndex((control) => control.type === inputcontrol.type);
    console.log(index);
    if (event.target.value === 'hide') {
      console.log('hide');
      delete this.formJson.formSections[this.indexI].formControls[this.indexJ].validators;
      console.log(this.formJson.formSections[this.indexI].formControls[this.indexJ]);
    }
    else if (event.target.value === 'view') {
      console.log('show');
      this.formJson.formSections[this.indexI].formControls[this.indexJ].validators = this.formModels[index].validators;
      console.log(this.formJson.formSections[this.indexI].formControls[this.indexJ]);

    }
  }
  deleteFormConfiguration(index: any) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.formSequence.splice(index, 1);
        this.saveFormSequence();
      },
      reject: (type: any) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: 'error',
              summary: 'Rejected',
              detail: 'You have rejected',
            });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({
              severity: 'warn',
              summary: 'Cancelled',
              detail: 'You have cancelled',
            });
            break;
        }
      },
    });
  }
  async getPreview(form: any) {
    console.log(form, this.formJson);
    // try {
    //   console.log(form);
    //   await this.getFormDataFromFormSequence(form);
    //   console.log(this.jsonForm.value.jsonFormData);
    // const jsonFormData = JSON.stringify(this.jsonForm.value.jsonFormData);
    // const url = `/portal/finaladminDashboard/finalAdminPreview?form=${jsonFormData}?bankCode=${this.bankCode}?verticalCode=${this.verticalCode}?insuranceTypeCode=${this.insuranceTypeCode}?productId=${this.productId}`;
    // window.open(url, '_blank');
    if (this.formJson) {
      this.router.navigate(['/portal/finaladminDashboard/formPreview'],
        {
          state: {
            form: this.formJson,
            formName: this.jsonForm.get('formName').value,
            formId: this.jsonForm.get('formId').value,
            bankCode: history.state.bankCode,
            verticalCode: history.state.verticalCode,
            insuranceTypeCode: history.state.insuranceTypeCode,
            productId: history.state.productId
          }
        });
    }
    else {
      this.toast.warning({
        detail: 'WARNING',
        summary: 'Select The Form',
        duration: 4000,
      });
    }

    // } catch (error) {
    //   console.error(error);
    // }
  }

  getEditForm(form: any) {
    console.log(form);
    console.log(this.bankCode, this.verticalCode, this.insuranceTypeCode, this.productId);
    console.log(form.formId, form.formName);
    this.commonService.getJSONFormViaVerticalCode(
      this.verticalCode,
      this.bankCode,
      this.insuranceTypeCode,
      this.productId,
      form.formId
    ).subscribe({
      next: (res) => {
        console.log(res);
        this.jsonForm.get('jsonFormData').setValue(res.jsonFormData);
        this.formJson = JSON.parse(res.jsonFormData);
        this.jsonForm.get('formName').setValue(form.formName);
        this.jsonForm.get('formId').setValue(form.formId);
        this.initializeJsonEditorForm();
        // this.router.navigate(['/portal/finaladminDashboard/editForm'],
        //   {
        //     state: {
        //       bankCode: this.bankCode,
        //       verticalCode: this.verticalCode,
        //       insuranceTypeCode: this.insuranceTypeCode,
        //       productId: this.productId,
        //       formId: form.formId,
        //       formName: form.formName,
        //       jsonFormData: res.jsonFormData
        //     }
        //   });
      },
      error: (err) => {
        console.error(err);
      },
    })
  }
  async getFormDataFromFormSequence(formSeq: any) {
    try {
      const res = await this.commonService.getJSONFormViaVerticalCode(
        this.verticalCode,
        this.bankCode,
        this.insuranceTypeCode,
        this.productId,
        formSeq.formId
      ).toPromise();

      console.log(res);
      this.jsonFormData = JSON.parse(res.jsonformdata);
      console.log(this.jsonFormData);
      this.jsonForm.get('formName').setValue(formSeq.formName);
      this.jsonForm.get('formId').setValue(formSeq.formId);
      this.jsonForm.get('jsonFormData').setValue(this.jsonFormData);
      console.log(this.jsonForm.value);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  loadCssFile(url: string): void {
    this.http.get(url, { responseType: 'text' })
      .subscribe(
        (cssContent: string) => {
          this.extractClassNames(cssContent);
        },
        (error) => {
          console.error('Failed to load CSS file:', error);
        }
      );
  }

  extractClassNames(cssContent: string): void {
    const classRegex = /\.([a-zA-Z][\w-]*)/g;
    let matches;
    while ((matches = classRegex.exec(cssContent)) !== null) {
      this.classList.push(matches[1]);
    }
  }
  concatenateClasses(event: any) {
    console.log(event.target.value);
    this.selectedClass = event.target.value;
  }
  async masterFormSequence() {
    return await this.adminService.GetMasterFormNames().subscribe({
      next: (res) => {
        this.masterFormList = res
        console.log(this.masterFormList);
      },
      error: (err) => {
        console.error(err)
      }
    })
  }
  async GetMasterFormByFormName(event: any) {
    console.log(event.target.value);
    return await this.adminService.GetMasterFormByFormName(event.target.value).subscribe({
      next: (res) => {
        console.log(res);
        console.log(res.formName, res.formId);
        this.jsonForm.get('formName')?.setValue(res.formName);
        this.jsonForm.get('formId')?.setValue(res.formId);
        this.formName = res.formName;
        this.formId = res.formId;
        this.formJson = JSON.parse(res.jsonFormData)
        this.initializeForm();
      },
      error: (err) => {
        console.error(err)
      }
    })
  }
}
