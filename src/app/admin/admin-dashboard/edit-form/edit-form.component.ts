import { Component, ViewChild } from '@angular/core';
import { JsonEditorComponent, JsonEditorOptions } from 'ang-jsoneditor';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {

} from '../../../interface/form.interface';
import { LoginService } from 'src/app/services/login.service';
import { CommonService } from 'src/app/services/common.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { NgToastService } from 'ng-angular-popup';
import { ConfirmationService, MessageService, ConfirmEventType } from 'primeng/api';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-edit-form',
  templateUrl: './edit-form.component.html',
  styleUrls: ['./edit-form.component.scss'],
  providers: [ConfirmationService, MessageService],
})
export class EditFormComponent {
  showPreview = false;
  form: any;
  public editorOptions: JsonEditorOptions;
  @ViewChild(JsonEditorComponent, { static: false }) editor:
    | JsonEditorComponent
    | undefined;

    jsonForm:any;
    selectedBank:any
    selectedInsuranceType:any
    selectedProduct:any
    allBank: any[] = [];
    allInsuranceType: any[] = []; 
    allProducts: any[] = [];
    formSequence:any[] = [] 
    jsonFormData:any;
    allAgency:any[]=[];
    agencyOptions:any[]=[];
    allChannel:any[]=[];
    channelOptions:any[]=[];
    AgencyInsuranceMapForm:any;
    allAgencyInsuranceMapData:any[]=[]
    insuranceTypeOptions:any[]=[]

    channelcode:any;
    agencycode:any;
    productid:any;

    constructor(private fb: FormBuilder,private loginService: LoginService,private adminService:AdminService,
        private commonService: CommonService,private toast:NgToastService,
        private confirmationService: ConfirmationService, private messageService: MessageService){
        this.editorOptions = new JsonEditorOptions()
        this.editorOptions.modes = ['code', 'text', 'tree', 'view'];
        this.editorOptions.mode = 'code'
    }
    ngOnInit(){
        this.jsonForm = this.fb.group({
            bankCode: ['', Validators.required],
            insuranceTypeCode: ['', Validators.required],
            productId: ['', Validators.required],
            formName: ['', Validators.required],    
            formId: ['', Validators.required],
            jsonFormData: ['', Validators.required],
            verticalCode:['',Validators.required],
            agencyCode:['',Validators.required],
        });
        this.getAllBankDetails();
        this.getAllChannel();
        this.getAllAgency();
        
    }

    getAllAgency(){
      console.log(this.jsonForm.value);
      this.adminService.getAllAgencyDetails()
        .subscribe({  
          next: (res)=>{
            this.allAgency=res.filter((agency:any)=>agency.status==true);
            this.agencyOptions=this.allAgency;
          },
          error: (err => {
            console.error(err); 
          })
        })
    }

    getAllChannel(){ 
      this.adminService.getAllChannelList()
        .subscribe({  
          next: (res)=>{
            this.allChannel=res.filter((channel:any)=>channel.channelStatus==true);
            this.channelOptions=this.allChannel;
          },
          error: (err => {
            console.error(err); 
          })
        }) 
    }

    getAllBankDetails(){
      this.loginService.getAllBankDetails().subscribe({
        next: (res: any) => {
          this.allBank = res;
        },
        error: (error: any) => {
            console.error(error);
        }
      })
    }
    onSelectedChannel(event: any){
      this.channelcode = event;
      this.selectedBank=this.channelOptions.find((agency) => agency.verticalCode == parseInt(event));
      console.log(this.selectedBank);
      
  }

  onselectAgency(event:any){
    this.agencycode = event;

    this.loginService.getAllProducts(this.channelcode,this.agencycode).subscribe({
      next: (res) => {
        console.log(res);
        this.allInsuranceType = res;  
      },
      error: (err) => {
        console.error(err);
      },
  });
  }
    onSelectedBank(event: any){
        this.agencycode = event;
        this.selectedBank=this.allBank.find((bank) => bank.bankCode == event);
        console.log(this.selectedBank);
        
        this.loginService.getAllProducts(this.channelcode,this.agencycode).subscribe({
            next: (res) => {
              console.log(res);
              this.allInsuranceType = res;  
            },
            error: (err) => {
              console.error(err);
            },
        });
    }
    onSelectInsuranceType(event: any){
        this.formSequence=[];
        let insuranceTypeCode = event;
        this.selectedInsuranceType=this.allInsuranceType.find((insurancetype) => insurancetype.insurancetypecode == insuranceTypeCode);
        console.log(this.selectedInsuranceType);
        

        this.loginService.getAllProductList(this.channelcode,this.agencycode,event).subscribe({
          next: (res) => {
            this.allProducts = res;
          },
          error: (err) => {
            console.error(err);
          }
        });
    }
    onSelectProduct(event: string){
      this.productid = event;
      
      this.commonService.getFormConfigViaVerticalCode(this.channelcode,this.agencycode,this.selectedInsuranceType.insurancetypecode,event).subscribe({
        next: (res) => {
          this.formSequence = JSON.parse(res.insureformconfiguration);
          this.allAgencyInsuranceMapData=res;          
        },
        error:(err)=>{
          this.formSequence=[];
        }
      });
    }
    getFormDataFromFormSequence(formSeq: any) {
      this.commonService.getJSONFormViaVerticalCode(this.channelcode,this.agencycode,this.selectedInsuranceType.insurancetypecode,this.productid,formSeq.formId).subscribe({
        next: (res) => {
          this.jsonFormData =JSON.parse(res.jsonformdata);
          this.jsonForm.get('formName').setValue(formSeq.formName);
          this.jsonForm.get('formId').setValue(formSeq.formId);
          this.jsonForm.get('jsonFormData').setValue(this.jsonFormData);
        },
        error: (err) => {
          console.error(err);
        },
      });
  }
  drop(event: CdkDragDrop<any[]>): void {
    moveItemInArray(this.formSequence, event.previousIndex, event.currentIndex);
  }
  onSaveForm() {
    if (this.jsonForm.valid) {
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
          this.commonService.insertJSONForm(this.jsonForm.value).subscribe({
            next: (res)=>{
            },
            error: (err) =>{
              console.error(err);
            }
          })
          this.jsonForm.removeControl('jsonFormData');
          this.jsonForm.removeControl('insuranceTypeCode');
          this.jsonForm.removeControl('bankCode');
          this.jsonForm.removeControl('productId');
          this.jsonForm.addControl(
            'formName',
            new FormControl(formName, Validators.required)
          );

          let data = this.jsonForm.value;
          const isDataPresent = this.formSequence.some(
            (form) =>
              form.formId == data.formId && form.formName == data.formName
          );
          if (!isDataPresent) {
            this.formSequence.push(data);
            this.saveFormSequence();
          }
          this.jsonForm.addControl(
            'jsonFormData',
            new FormControl('', Validators.required)
          );
          this.jsonForm.addControl(
            'insuranceTypeCode',
            new FormControl(
              this.selectedInsuranceType.insuranceTypeCode,
              Validators.required
            )
          );
          this.jsonForm.addControl(
            'bankCode',
            new FormControl(this.selectedBank.bankCode, Validators.required)
          );
          this.jsonForm.addControl(
            'productId',
            new FormControl(this.selectedProduct.productId, Validators.required)
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
      bankCode: this.selectedBank.bankCode,
      insuranceTypeCode: this.selectedInsuranceType.insuranceTypeCode,
      productId: this.selectedProduct.productId,
      insureFormConfiguration: JSON.stringify(this.formSequence),
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
  }
  deleteFormConfiguration(index: any) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.formSequence.splice(index, 1);
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
  modifedJson(modifedForm: any) {
    this.jsonForm.get('jsonFormData').setValue(modifedForm);
  }

  // Initialize From Interface
  FormConfig: any;
  itemName: any;

  createJsonForm(itemName: any) {
    this.itemName = itemName;
    if (this.itemName.toUpperCase() == 'FORM') {
      this.FormConfig = this.createForm();
    }
  }
  saveFormConfig() {
    if (this.FormConfig.valid) {
      if (
        this.itemName.toUpperCase() == 'FORM' &&
        this.jsonForm.jsonFormData != null
      ) {
        console.log(this.FormConfig.value);
      }
    } else {
      this.toast.warning({
        detail: 'WARNING',
        summary: 'fill all details!!',
        duration: 4000,
      });
    }
  }
  // Initialize All Forms
  createForm(): FormGroup {
    return this.fb.group({
      formTitle: [''],
      saveBtnTitle: [''],
      resetBtnTitle: [''],
      calculateBtnTitle: [''],
      prevBtnTitle: [''],
      themeFile: [''],
      formSections: this.fb.array([]),
      class: [''],
    });
  }
  createFormSection(): FormGroup {
    return this.fb.group({
      sectionTitle: ['', Validators.required],
      visible: [false],
      apiEndpoint: [''],
      controlTypeName: [''],
      method: [''],
      formControls: this.fb.array([]),
      isVisible: [false],
      sectionButton: this.fb.group({}),
    });
  }
  createSectionButton(): FormGroup {
    return this.fb.group({
      label: [''],
      class: [''],
      name: [''],
      visible: [false],
      apiEndpoint: [''],
      method: [''],
      controlTypeName: [''],
      formControls: this.fb.array([]),
      isVisible: [false],
    });
  }
  createFormControl(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      label: [''],
      visibleLabel: [false],
      bigFont: [false],
      content: this.fb.array([]),
      text: [''],
      value: [''],
      apiEndpoint: [''],
      method: [''],
      controlTypeName: [''],
      options: this.fb.array([]),
      idProperty: [''],
      nameProperty: [''],
      class: [''],
      showBorder: [false],
      type: [''],
      subType: [''],
      variableName: [''],
      validators: this.fb.array([]),
      disabled: [false],
      dynamicControls: this.fb.array([]),
      bannerText: [''],
      image: this.fb.group({}),
      additionalCovers: this.fb.array([]),
      secondarylabel: [''],
      placeholder: [''],
      radioOptions: this.fb.array([]),
      images: this.fb.array([]),
      otherControlName: [''],
      methodName: [''],
      visible: [false],
    });
  }
  createImage(): FormGroup {
    return this.fb.group({
      id: [''],
      src: [''],
      alt: [''],
      width: [''],
      height: [''],
      label: [''],
    });
  }
  createRadioOption(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      label: [''],
      value: [''],
      selected: [false],
    });
  }
  createAdditionalCover(): FormGroup {
    return this.fb.group({
      id: [''],
      value: [''],
      class: [''],
      selected: [false],
      description: [''],
      additionalQuestions: this.fb.array([]),
    });
  }
  createAdditionalQuestion(): FormGroup {
    return this.fb.group({
      id: [''],
      label: ['', Validators.required],
      type: [''],
      options: this.fb.array([]),
      selectedOption: [''],
    });
  }
  createAdditionalQuestionOption(): FormGroup {
    return this.fb.group({
      label: ['', Validators.required],
      value: [false],
      type: [''],
    });
  }
  createDynamicControl(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      label: [''],
      visibleLabel: [false],
      type: [''],
      value: [''],
      apiEndpoint: [''],
      disabled: [false],
      class: [''],
      methodName: [''],
      visible: [false],
      options: this.fb.array([]),
      validators: this.fb.array([]),
    });
  }
  createValidator(): FormGroup {
    return this.fb.group({
      validatorName: [''],
      message: [''],
      required: [false],
      pattern: [''],
      minLength: [0],
      maxLength: [0],
      email: [''],
    });
  }
  createOption(): FormGroup {
    return this.fb.group({
      id: [''],
      name: [''],
      other: [''],
      value: [''],
    });
  }
}
