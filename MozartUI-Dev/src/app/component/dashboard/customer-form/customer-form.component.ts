import { DOCUMENT } from '@angular/common';
import { Component, Inject, Renderer2, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { IDynamicControl, IForm, IFormControl, IFormSections, IValidator } from 'src/app/interface/form.interface';
import { CommonService } from 'src/app/services/common.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.scss']
})
export class CustomerFormComponent {
  private formData:any={}
  private allJsonFormData:any[]=[]

  showPopup: boolean = false;
  selectedOptions: any;
  popUpForm !: IForm;
  contactMethod: string = '';
  public showHtmlComponent: any;
  form !: IForm;
  fb = inject(FormBuilder)
  dynamicFormGroup: FormGroup = this.fb.group({});
  popupFormGroup: FormGroup = this.fb.group({});
  expandedCardIndex: number | null = null;

  productDetails: any;
  selectedCover: any;
  formSequence: any[] = [];
  allformSequence: any[] = [];
  bankCode:any= localStorage.getItem('bankCode');
  insuranceTypeCode: any;
  productId: any;
  proposalNum: any;
  index: number = 0;
  verticalCode:any;

  private dynamicStyle!: HTMLLinkElement;
  private dynamicStylePopup!: HTMLLinkElement;
  controls: any;


  private radioOptionsSubscription: Subscription | undefined;

  constructor(private renderer: Renderer2, @Inject(DOCUMENT) private document: Document,
    private service: CommonService, private loginService: LoginService, private toast: NgToastService,
    private router: Router,private encryptionService:EncryptionService,private spinner:NgxSpinnerService) { }

  ngOnInit(): void {
    this.showHtmlComponent = false;
    this.showPopup = false;
    this.formSequence=history.state.formSequence;
    this.proposalNum = history.state.proposalNumber;
    this.allformSequence = history.state.formSequence;
    this.insuranceTypeCode=history.state.insuranceTypeCode;
    this.productId=history.state.productId;
    this.verticalCode=history.state.verticalCode;
    //this.dynamicFormGroup = history.state.dynamicFormGroup;
    this.formData = history.state.dynamicFormGroup;
    console.log(this.formSequence);
    console.log(this.proposalNum);
    console.log(this.allformSequence);
    console.log(this.insuranceTypeCode);
    console.log(this.productId);
    console.log(this.formData);
    this.allformSequence.forEach(element => {
      if (element.formName == 'Payment') {
        this.index = this.allformSequence.indexOf(element);
      }
    });
    
    this.formSequence = this.allformSequence.slice(this.index+2,this.index+4);
    
    //this.formData=this.encryptionService.decrypt(sessionStorage.getItem('allFormData')as string)
    this.allJsonFormData=this.encryptionService.decrypt(sessionStorage.getItem('allJsonFormData')as string)
    // this.formData=this.encryptionService.decrypt(sessionStorage.getItem('formData')as string)
    // this.allJsonFormData=this.encryptionService.decrypt(sessionStorage.getItem('allJsonFormData')as string)
    this.getFormDataFromFormSequence(this.allformSequence[this.getFormIndexValue()].formId);
  }
  getFormDataFromFormSequence(formSeq: any) {
    if (this.dynamicStyle) {
      this.renderer.removeChild(this.document.head, this.dynamicStyle)
      this.showHtmlComponent = false;
    }
    if(Object.keys(this.allJsonFormData[this.getFormIndexValue()]).length>0){
      this.form=this.allJsonFormData[this.getFormIndexValue()];
      console.log(this.form);
      this.initializeForm();
    }
    else{
      this.service.getJSONFormViaVerticalCode(this.verticalCode,this.bankCode,this.insuranceTypeCode,this.productId,formSeq).subscribe({
        next :(res)=>{
          this.form = JSON.parse(res.jsonformdata);
          this.initializeForm();
        },
        error:(err) =>{
          console.error(err);
        }
      })
    }
  }
  getPopupFormDataFromFormSequence(formSeq: any) {
    console.log(this.bankCode, this.insuranceTypeCode, formSeq);
    let formId = this.allformSequence[formSeq].formId
    this.service.getJSONFormViaVerticalCode(this.verticalCode,this.bankCode, this.insuranceTypeCode,this.productId, formId).subscribe({
      next: (res) => {
        this.popUpForm = JSON.parse(res.jsonformdata);
        this.initializaPopupForm();
      },
      error: (err) => {
        console.error(err);
      }
    })
  }
  initializaPopupForm() {
    console.log(this.popUpForm);
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
          // this.popupFormGroup.addControl(control.name,this.fb.control(control.value,controlValidators))  
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
      //dynamic css
      this.dynamicCssForPopup(this.popUpForm);
      this.dynamciallyLoadCSS(this.form)
      const radioOptionsControl = this.popupFormGroup.get('contact');
      if (radioOptionsControl) {
        this.radioOptionsSubscription = radioOptionsControl.valueChanges.subscribe((value: string) => {
          console.log(value);
          this.contactMethod = value;
        });
      }
    }
  }
  onDialogHide() {
    console.log("manju",new Date());
    this.initializeForm();
    if(this.dynamicStylePopup){
      const linkElement= this.renderer.selectRootElement(`link[href="assets/styles/dynamicForm/payment-popup.css"]`, true);
      if (linkElement) {
        this.renderer.removeChild(this.document.head, linkElement);
        this.renderer.removeChild(this.document.head, this.dynamicStylePopup);
      }
    }
  }

  dynamicCssForPopup(form:IForm){
    let tf: string = "default.css";
    if(form.themeFile) tf = form.themeFile;
    this.dynamicStylePopup = this.renderer.createElement('link');
    this.renderer.setAttribute(this.dynamicStylePopup,'rel', 'stylesheet');
    this.renderer.setAttribute(this.dynamicStylePopup,'type', 'text/css');
    this.renderer.setAttribute(this.dynamicStylePopup,'href', 'assets/styles/dynamicForm/' + tf)
    this.renderer.appendChild(this.document.head, this.dynamicStylePopup)
  }

  initializeForm(){
    console.log(this.form,new Date());

    this.form.formSections.forEach((section:any) => {
      section.formControls.forEach((control:any) => {
        if(control.dynamicControls){
          if(this.formData[control.name]){
            control.value=this.formData[control.name].length;
          }
          for(let i=1;i<=control.value;i++){
            if(!control.dynamicControls[i]){
              let tempDynamicControl=control.dynamicControls[0].map((element: any) => ({ ...element }));
              control.dynamicControls.push(tempDynamicControl)
            }
          }
        }
        else{
          if(this.formData[control.name]){
            control.value=this.formData[control.name];
          }
          
        }
      });
    });

    if(this.form?.formSections){
      this.dynamicFormGroup=this.fb.group({});
      this.form.formSections.forEach((section) => {
        section.formControls.forEach((control: IFormControl) => {
          if(control.dynamicControls){
            let tempFormArray= this.fb.array([]);
            for(let i=1;i<control.dynamicControls.length;i++){
              tempFormArray.push(this.initializeDynamicFormControls(control.dynamicControls[i]))
            }
            this.dynamicFormGroup.addControl(control.name, tempFormArray);
          }
          else{
            let controlValidators : any = [];
            if(control.validators){
              control.validators.forEach((val:IValidator)=> {
                if(val.validatorName === 'required') controlValidators.push(Validators.required);
                if(val.validatorName === 'email') controlValidators.push(Validators.email);
                if(val.validatorName === 'minlength') controlValidators.push(Validators.minLength(val.minLength as number));
                if(val.validatorName === 'maxlength') controlValidators.push(Validators.maxLength(val.maxLength as number));
                if(val.validatorName === 'pattern') controlValidators.push(Validators.pattern(val.pattern as string));
              })
            }
            if(control.method && control.controlTypeName && control.type==='text'){
              this.forMethod(section,control);
            }
            if(this.formData[control.name]){
              control.value=this.formData[control.name];
            }
            this.dynamicFormGroup.addControl(control.name, new FormControl(control.value, controlValidators));
          }
        });
      });
      //dynamic css
      this.dynamciallyLoadCSS(this.form);
      this.flattenObject(this.formData);
      this.showHtmlComponent=true;
      this.spinner.hide();
    }
  }
  // updateFormValueWithExistingData() {
  //   this.allFormData.forEach(element => {
  //     this.flattenObject(element);
  //   });
  // }
  forMethod(section:IFormSections,control:IFormControl){
    this.spinner.show();
    let subControl = section.formControls.find((subControl: IFormControl) => subControl.name === control.controlTypeName);
    if(subControl?.type === 'select'){
      const method = (this as any)[control?.method] as () => any;
      if (typeof method === 'function') {
        const observable = method.call(this);
        observable.subscribe(
          (result: any) => {
            if(subControl?.options?.length==0 && control.type==='text'){
              subControl.options = result;
            }
            else if(subControl?.options && control.type==='select'){
              subControl.options = result;
            }
            this.spinner.hide();
          },
          (error: any) => {
            console.error(error);
          }
        );
      } 
      else {}
    }
  }
  flattenObject(obj: any, prefix = '') {
    Object.keys(obj).forEach(key => {
      const value = obj[key];
      const newKey = prefix + key;
      if (typeof value === 'object' && value !== null && Object.keys(value).length > 0) {
        this.flattenObject(value, newKey + '.');
      }
      else {
        if (this.dynamicFormGroup.get(newKey)) {
          this.dynamicFormGroup.get(newKey)?.patchValue(value);
        }
      }
    });
  }
  initializeDynamicFormControls(dynamicFormControls:any){
    let formGroup:any=this.fb.group({})
    dynamicFormControls.forEach((control: IDynamicControl) => {
      let controlValidators: any = [];
      if(control.validators){
        control.validators.forEach((val:IValidator)=>{
          if(val.validatorName === 'required') controlValidators.push(Validators.required);            
          if(val.validatorName === 'email') controlValidators.push(Validators.email);
          if(val.validatorName === 'minlength') controlValidators.push(Validators.minLength(val.minLength as number));
          if(val.validatorName === 'maxlength') controlValidators.push(Validators.maxLength(val.maxLength as number));
          if(val.validatorName === 'pattern') controlValidators.push(Validators.pattern(val.pattern as string));
        })
      }
      formGroup.addControl(control.name, new FormControl(control.value, controlValidators));
    })
    return formGroup;
  }
  // //Helper Method for dynamic Css
  dynamciallyLoadCSS(form: IForm) {
    console.log(form,new Date());
    let tf: string = "default.css";
    if (form.themeFile) tf = form.themeFile;
    this.dynamicStyle = this.renderer.createElement('link');
    this.renderer.setAttribute(this.dynamicStyle, 'rel', 'stylesheet');
    this.renderer.setAttribute(this.dynamicStyle, 'type', 'text/css');
    this.renderer.setAttribute(this.dynamicStyle, 'href', 'assets/styles/dynamicForm/' + tf)
    this.renderer.appendChild(this.document.head, this.dynamicStyle)
  }
  ngOnDestroy(): void {
    if(this.dynamicStyle){
      const linkElement= this.renderer.selectRootElement(`link[href="assets/styles/dynamicForm/${this.form.themeFile}"]`, true);
      if (linkElement) {
        this.renderer.removeChild(this.document.head, linkElement);
        this.renderer.removeChild(this.document.head, this.dynamicStyle);
      }
    }
  }

  //Helper method for Dynamic Form

  onPrevious() {
    if (this.getFormIndexValue() > 0) {
      this.decrementIndex()
      this.getFormDataFromFormSequence(this.formSequence[this.getFormIndexValue()].formId);
    }
  }
  onSubmit() {
    this.formData={...this.formData,...this.dynamicFormGroup.value};
    // this.updateFormValueWithExistingData();
    this.allJsonFormData[this.getFormIndexValue()]=this.form;
    sessionStorage.setItem("formData",this.encryptionService.encrypt(this.formData));
    sessionStorage.setItem("allJsonFormData",this.encryptionService.encrypt(this.allJsonFormData));
 
    if (this.getFormIndexValue() < this.allformSequence.length - 1) {
      this.incrementIndex()
      this.getFormDataFromFormSequence(this.allformSequence[this.getFormIndexValue()].formId);
    }

  }
  getValidationErrors(control: IFormControl): string {
    const myFormControl = this.dynamicFormGroup.get(control.name)
    let errorMessage = ''
    control.validators?.forEach((val) => {
      if (myFormControl?.hasError(val.validatorName as string)) {
        errorMessage = val.message as string
      }
    })
    return errorMessage;
  }

  onSendLink() {
    // this.popUpForm = paymentPopupConfig2 as IForm
    // this.initializaPopupForm();
    // // this.toggleBlurBackground(true);
    // this.showPopup = true;
  }

  // //motor customer form 
  getQuote() {
    const secondSectionIndex = 1;
    if (this.form.formSections[secondSectionIndex] && this.form.formSections[secondSectionIndex].isVisible === false) {
      this.form.formSections[secondSectionIndex].isVisible = true;
    }
  }


  //Helper Methods for extracting form sequence
  // flattenObject(obj: any, prefix = '') {
  //   Object.keys(obj).forEach(key => {
  //     const value = obj[key];
  //     const newKey = prefix + key;
  //     if (typeof value === 'object' && value !== null && Object.keys(value).length > 0) {
  //       this.flattenObject(value, newKey + '.');
  //     }
  //     else {
  //       if (this.dynamicFormGroup.get(newKey)) {
  //         this.dynamicFormGroup.get(newKey)?.patchValue(value);
  //       }
  //     }
  //   });
  // }

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
    // this.setFormIndexValue(index - 1);
    // this.getFormDataFromFormSequence(this.allformSequence[this.getFormIndexValue()].formId);
  }
  toggleContent(index: number): void {
    this.expandedCardIndex = this.expandedCardIndex === index ? null : index;
  }

  isContentVisible(index: number): boolean {
    return this.expandedCardIndex === index;
  }
  onCoverChange(cover: any): void {
    this.selectedCover = cover;
    if (cover.additionalQuestions && cover.additionalQuestions.length > 0) {
      this.dynamicFormGroup.removeControl('additionalQuestions');
      const additionalQuestionsControl = this.fb.group({});
      cover.additionalQuestions.forEach((question: any) => {
        additionalQuestionsControl.addControl(question.name, this.fb.control(''));
      });
      this.dynamicFormGroup.addControl('additionalQuestions', additionalQuestionsControl);
    } else {
      this.dynamicFormGroup.removeControl('additionalQuestions');
    }
  }
  sendLink() {
    this.showPopup = false;
    setTimeout(() => {
      alert("Payment Successful");
      this.router.navigate(['portal/dashboard/products'])
    }, 10);
  }
  handlePayment(id: number) {
    console.log("id:", id);
    id = Number(id)
    if (this.getFormIndexValue() + id > this.getFormIndexValue()) {
      console.log(this.getFormIndexValue())
      console.log(id)
      this.getPopupFormDataFromFormSequence(this.getFormIndexValue() + id);
      this.showPopup = true;
      //this.ngOnDestroy();
    }
  }
  
}
