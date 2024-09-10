import { Component,inject,Renderer2,Inject, ElementRef, OnDestroy } from '@angular/core';
import { FormArray, FormBuilder,FormControl,FormGroup, Validators } from '@angular/forms';
import { IDynamicControl, IForm, IFormControl, IValidator } from 'src/app/interface/form.interface';
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

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html'
  // styleUrls: ['./dynamic-form.component.scss']
})
export class DynamicFormComponent implements OnDestroy{
  showPremiumDetails:boolean=false;
  selectedAnnualSumInsured:any;
  premiumAmount: any;
  gstAmount: any;
  basicPremium: any;
  index:any;
  resumeIndex:any;
  productName:any;
  proposalNum:any;
  selectedOptions:any;
  contactMethod: string = '';
  productStartDate: any;
  productEndDate: any;
  generetedProposalNum:any;

  radioOptionsSubscription: Subscription | undefined;



  allInsuranceType:any[]=[];
  form !: IForm;
  popUpForm !: IForm;

  fb = inject(FormBuilder)
  dynamicFormGroup: FormGroup = this.fb.group({});
  popupFormGroup: FormGroup = this.fb.group({});

  public showHtmlContent: any;   
  public showPopup: any;
  allFormSequence: any[]=[];
  quoteFormSequence: any[]=[]; 
  formSequence: any[]=[];
  
  public formData:any={}
  private allJsonFormData: any[]=[];

  bankCode:any;
  insuranceTypeCode:any;
  productId:any;
  verticalCode:any;
  finelcss:boolean=false;

  stylesList:any[]=[];


  private dynamicStyle! : HTMLLinkElement;
  private dynamicStylePopup! : HTMLLinkElement;

  visible:any;

  expandedCardIndex: number | null = null;
  selectedCover: any;



  constructor(private renderer: Renderer2,private el: ElementRef, @Inject(DOCUMENT) private document: Document,
  private service:CommonService,private loginService:LoginService, private router:Router,
  private encryptionService:EncryptionService,private http:HttpClient,private spinner:NgxSpinnerService,
  private toast:NgToastService,private datePipe: DatePipe) {}

  ngOnInit(): void {
    this.spinner.show();
    this.showPremiumDetails=false;
    this.showHtmlContent = false;
    this.showPopup = false;
    
    this.formSequence=history.state.formSequence;
    this.allFormSequence = history.state.formSequence;
    this.quoteFormSequence=history.state.quoteFormSequence;
    this.verticalCode =localStorage.getItem('verticalCode');
    this.insuranceTypeCode=localStorage.getItem('insurancetypecode');
    this.resumeIndex=this.getFormIndexValue();

    this.allFormSequence.forEach(element => {
      if (element.formName == 'Payment') {
        this.index = this.allFormSequence.indexOf(element);
        this.formSequence = this.allFormSequence.slice(0, this.index + 1)
      }
    });
    this.bankCode=localStorage.getItem('bankCode');
    this.stylesList=[{bankCode:'1001',style:'#EFF8FA'},{bankCode:'1002',style:'#f7eaf0'},{bankCode:'1003',style:'#fff7eb'},{bankCode:'1004',style:'#F3F3F3'},{bankCode:'1005',style:'#ececed'},{bankCode:'1006',style:'indusindbank-product.css'},{bankCode:'1007',style:'rblbank-product.css'},{bankCode:'1008',style:'idfcfirstbank-product.css'},{bankCode:'1009',style:'dbsbank-product.css'}];
    const bodystyle =this.stylesList.filter((style)=>style.bankCode==this.bankCode)[0].style  || '#ecadad';
    this.renderer.setStyle(this.el.nativeElement.ownerDocument.body, 'background', bodystyle);

    
    this.insuranceTypeCode=history.state.productData.insuranceTypeCode;
    this.proposalNum=history.state.productData.proposalNumber;
    this.productId=history.state.productData.productId;
    this.productEndDate = history.state.productData.productEndDate;
    this.productStartDate = history.state.productData.productStartDate;

    this.formData=this.encryptionService.decrypt(sessionStorage.getItem('allFormData')as string)
    this.allJsonFormData=this.encryptionService.decrypt(sessionStorage.getItem('allJsonFormData')as string)

    this.getFormDataFromFormSequence(this.formSequence[this.getFormIndexValue()].formId)
  }
  getFormDataFromFormSequence(formSeq:any){
    if(Object.keys(this.allJsonFormData[this.getFormIndexValue()]).length>0){
      this.form=this.allJsonFormData[this.getFormIndexValue()];
      this.initializeForm();
      this.dynamciallyLoadCSS(this.form);
    }
    else{
      this.service.getJSONFormViaVerticalCode(this.verticalCode,this.bankCode,this.insuranceTypeCode,this.productId,formSeq).subscribe({
        next :(res)=>{
          this.form = JSON.parse(res.jsonformdata);
          this.initializeForm();
          this.dynamciallyLoadCSS(this.form);
        },
        error:(err) =>{ 
          console.error(err);
        }
      })
    }
  }
  initializeForm(){
    console.log(this.formData);
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
            if(control.type=='select' && control.methodName && control.options?.length==0){
              this.callMethod(control.methodName,control);
            }
            this.dynamicFormGroup.addControl(control.name, new FormControl(control.value,controlValidators));
          }
        });
      });
      //dynamic css
      this.spinner.hide();
      this.showHtmlContent = true;
      this.flattenObject(this.formData);
    }
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
      if(control.type=='select' && control.methodName && control.options?.length==0){
        this.callMethod(control.methodName,control);
      }
      formGroup.addControl(control.name, new FormControl(control.value, controlValidators));
    })
    return formGroup;
  }
  getQuote(){
    const secondSectionIndex = 1;
  // Check if the second section exists and isVisible is false
  if (this.form.formSections[secondSectionIndex] && this.form.formSections[secondSectionIndex].isVisible === false) {
    // Update the visibility to true
    this.form.formSections[secondSectionIndex].isVisible = true;
  }
  }

  flattenObject(obj: any, prefix = ''){
    Object.keys(obj).forEach(key =>{
      const value = obj[key];
      const newKey = prefix + key;
      if (typeof value === 'object' && value !== null && Object.keys(value).length > 0) {
        this.flattenObject(value, newKey + '.');
      }
      else {
        if(this.dynamicFormGroup.get(newKey)) {
          this.dynamicFormGroup.get(newKey)?.patchValue(value);
        }
      }
    });
  }
  //Helper Method for dynamic Css
  dynamciallyLoadCSS(form: IForm){
    this.spinner.show();
    let tf: string = "default.css";
    if(form.themeFile) tf = form.themeFile;
    this.dynamicStyle = this.renderer.createElement('link');
    this.renderer.setAttribute(this.dynamicStyle,'rel', 'stylesheet');
    this.renderer.setAttribute(this.dynamicStyle,'type', 'text/css');
    this.renderer.setAttribute(this.dynamicStyle,'href', 'assets/styles/dynamicForm/' + tf)
    this.renderer.appendChild(this.document.head, this.dynamicStyle)
    this.showHtmlContent=true;
    this.finelcss=true;
    this.spinner.hide();
  }
  ngOnDestroy():void{
    if(this.dynamicStyle){
      const linkElement= this.renderer.selectRootElement(`link[href="assets/styles/dynamicForm/${this.form.themeFile}"]`, true);
      if (linkElement) {
        this.renderer.removeChild(this.document.head, linkElement);
        this.renderer.removeChild(this.document.head, this.dynamicStyle);
      }
    }
  }
  // For api Method
  getAllState(otherControl:IFormControl){
    this.spinner.show();
    this.service.getAllStates().subscribe({
      next:(res)=>{
        otherControl.options=res.AllState;
        this.spinner.hide();
      },
      error:(err)=>{
        console.error(err);
        this.spinner.hide();
      }
    })
  }
  getRelationshipType(otherControl:IFormControl){
    this.service.getAllRelationship().subscribe({
      next:(res)=>{
        otherControl.options=res.InsuredRelationship;
      },
      error:(err)=>{
        console.error(err)
      }
    });
  }
  getNomineeRelationshipType(otherControl:IFormControl){
    this.service.getAllRelationship().subscribe({
      next:(res)=>{
        otherControl.options=res.NomineeAppointeeRelationship;
      },
      error:(err)=>{
        console.error(err)
      }
    });
  }
  calculatePremium(){
    console.log(this.dynamicFormGroup);
    if(this.dynamicFormGroup.valid){
      this.spinner.show();
      let ageOfEldestMember=0;
      if(this.insuranceTypeCode==101){
        this.dynamicFormGroup.value["detailsOfAdults"].forEach((element: { AdultDob: any; },i:any)=> {
          this.dynamicFormGroup.get(`detailsOfAdults.${i}.age`)!.setValue(this.calculateAge(element.AdultDob));
          if(ageOfEldestMember<this.calculateAge(element.AdultDob)){
            ageOfEldestMember=this.calculateAge(element.AdultDob);
          }
        });
        this.dynamicFormGroup.value["detailsofChild"].forEach((element: { ChildDob: any; },i:any)=> {
          this.dynamicFormGroup.get(`detailsofChild.${i}.age`)!.setValue(this.calculateAge(element.ChildDob));
          if(ageOfEldestMember<this.calculateAge(element.ChildDob)){
            ageOfEldestMember=this.calculateAge(element.ChildDob);
          }
        });
        this.dynamicFormGroup.addControl('AgeOfEldestMember', this.fb.control(ageOfEldestMember));
        const policyTenureControl = this.dynamicFormGroup.get("policyTenure");
        const policyTenureValueAsInt = parseInt(policyTenureControl?.value, 10);
        this.dynamicFormGroup.get("policyTenure")?.setValue(policyTenureValueAsInt);
        // this.dynamicFormGroup.addControl('productStartDate', this.fb.control(this.datePipe.transform(this.productStartDate, 'dd-MM-yyyy')));
        // this.dynamicFormGroup.addControl('productEndDate', this.fb.control(this.datePipe.transform(this.productEndDate, 'dd-MM-yyyy')));
        this.dynamicFormGroup.addControl('ProposerDOB', this.dynamicFormGroup.get('detailsOfAdults.0.AdultDob'));
        console.log(this.dynamicFormGroup.get('detailsOfAdults.0.AdultDob'));
 
        // this.dynamicFormGroup.setControl('productStartDate', this.fb.control(this.datePipe.transform(new Date(), 'yyyy-MM-dd')));
        // this.dynamicFormGroup.setControl('productEndDate', this.fb.control(this.datePipe.transform(new Date(new Date().setDate(new Date().getDate() + 364)), 'yyyy-MM-dd')));
 
        this.dynamicFormGroup.addControl('productStartDate', this.fb.control(this.datePipe.transform(new Date(), 'yyyy-MM-dd')));
        this.dynamicFormGroup.addControl('productEndDate', this.fb.control(this.datePipe.transform(new Date(new Date().setFullYear(new Date().getFullYear() + 1)).setDate(new Date().getDate() - 1), 'yyyy-MM-dd')));
        console.log(this.dynamicFormGroup.value)
        this.getPlanCode(() => {
          console.log(this.dynamicFormGroup.value)
          var reqData={
            verticalCode:this.verticalCode,
            code:this.bankCode,
            insuranceTypeCode:this.insuranceTypeCode,
            productId:this.productId,
            configuration_Json:JSON.stringify(this.dynamicFormGroup.value)  
          }
          console.log(reqData);
          this.service.getQoute(reqData).subscribe({
              next: (res) => {
                console.log(res);
                this.basicPremium=res.basicPremium;
                this.premiumAmount=res.totalPremium;
                this.gstAmount=res.totalTax;
                this.showPremiumDetails=true;
                let premiumData={
                  "basicAmount":Number(this.basicPremium).toFixed(2),
                  "gstAmount":Number(this.gstAmount).toFixed(2),
                  "yearlyPremiumAmount":Number(this.premiumAmount)
                }
                this.dynamicFormGroup.addControl('yearlyPremiumAmount', this.fb.control(Number(this.premiumAmount).toFixed(2)));
                this.dynamicFormGroup.addControl('gstAmount', this.fb.control(Number(this.gstAmount).toFixed(2)));
                this.dynamicFormGroup.addControl('basicAmount', this.fb.control(Number(this.basicPremium).toFixed(2)));

                this.formData={...this.formData,...premiumData};
                this.spinner.hide();
              },
              error: (err) => {
                console.error(err);
                this.spinner.hide();
              }
          });  
        });
      }
    }
    else{
      this.toast.warning({detail:"WARNING",summary:"Please fill all the mandatory fields",duration:3000})
    }
  }

  calculateAge(dateOfBirth: string): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    const age = today.getFullYear() - birthDate.getFullYear();
    if (today.getMonth()<birthDate.getMonth() || (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())) {
      return age - 1;
    }
    return age;
  }
  getPlanCode(callback: () => void) {
    const productName = this.dynamicFormGroup.get('productName')?.value;
    const healthAdvantageKey = productName ? productName.replace(/\s+/g, '') : '';
    const selectedYear = 'Year_'+this.dynamicFormGroup.get('policyTenure')?.value.toString();
    const adultCount = this.dynamicFormGroup.get('numberOfAdults')?.value.toString();
    const childCount = this.dynamicFormGroup.get('numberOfChildren')?.value.toString();

    this.service.getHealthPlans(selectedYear, adultCount, childCount).subscribe({
      next: (res: any) => {
        const yearData = res[healthAdvantageKey][selectedYear] || {};
        const subProductCode = yearData.subProductCode || '';
        const plans = yearData.Plans || [];
        if (plans.length === 0) {
          console.error('No plans available for the selected criteria.');
          return;
        }
        const filteredPlans = plans.filter((plan: any) => {
          return (
            plan.Adult === adultCount &&
            plan.Child === childCount
          );
        });
        if (filteredPlans.length === 0) {
          console.error('No plans match the selected criteria.');
          return;
        }
        filteredPlans.forEach((plan: any) => {
          const { PlanCode,PlanName } = plan;
          this.dynamicFormGroup.removeControl('planCode');
          this.dynamicFormGroup.removeControl('subProductCode');
          this.dynamicFormGroup.removeControl('planName');
          this.dynamicFormGroup.addControl("planName",this.fb.control(PlanName));
          this.dynamicFormGroup.addControl('planCode', this.fb.control(PlanCode));
          this.dynamicFormGroup.addControl('subProductCode', this.fb.control(subProductCode));
        });
        callback(); 
      },
      error: (err) => {
        console.error(err);
        callback(); 
      }
    });
  }
  //Helper method for Dynamic Form
  onInputChange(event:any,control:IFormControl){
    console.log(control)
    console.log(event.target.value) 
    if(control.name=='applicantPincode'){
        this.service.getCityByPinCode(event.target?.value).subscribe({
        next:(res)=>{
          console.log(res)
          this.dynamicFormGroup.get('applicantCity')?.setValue(res.CityList[0].CityName);
          this.dynamicFormGroup.get('applicantState')?.setValue(res.StateName);
          this.dynamicFormGroup.addControl('CityCode', this.fb.control(res.CityList[0].CityID));
          this.dynamicFormGroup.addControl('StateCode', this.fb.control(res.StateId));
        },
        error:(err)=>{
          console.error(err)
        }
      });
    }
  }
  callMethod(methodName: string,control: IFormControl,section?:any){
    if(control.otherControlName && section!=undefined){
      let otherControl=section.formControls.filter((formControl:IFormControl)=>formControl.name==control.otherControlName)[0];
      const method=(this as any)[methodName];
      if (method && typeof method==='function') {
         (this as any)[methodName](otherControl)
      }
      else {
        console.error(`Method ${methodName} not found`);
      }
    }
    else if(control && section==undefined && methodName){
      console.log(methodName);
      console.log(control);
       (this as any)[methodName](control)
    }
  }
  onPrevious(){
    if(this.getFormIndexValue()>0)
    {
      this.decrementIndex()
      this.getFormDataFromFormSequence(this.formSequence[this.getFormIndexValue()].formId);
    }
  }
  onSubmit(){
    if(this.dynamicFormGroup.valid){

      this.formData=this.updateNestedData(this.formData,this.dynamicFormGroup.value);
      console.log(this.dynamicFormGroup.value)
      this.flattenObjectInsert(this.dynamicFormGroup.value);
      this.formData={...this.formData,...this.dynamicFormGroup.value};
      this.allJsonFormData[this.getFormIndexValue()]=this.form;
      sessionStorage.setItem("allFormData",this.encryptionService.encrypt(this.formData));
      sessionStorage.setItem("allJsonFormData",this.encryptionService.encrypt(this.allJsonFormData));

      // for Store Form Data in Database

      let reqData={
        "proposalNum":this.proposalNum,
        "code": this.bankCode,
        "verticalCode": this.verticalCode,
        "insuranceTypeCode": this.insuranceTypeCode,
        "formType":this.formSequence[this.getFormIndexValue()].formName,
        "formData":JSON.stringify(this.dynamicFormGroup.value),  
        "formName":this.formSequence[this.getFormIndexValue()].formName,
        "formConfig":JSON.stringify(this.formSequence),
        "productId":this.productId
      }
      console.log(reqData);
      console.log(JSON.stringify(reqData));
      this.service.insertOrUpdateFormDataViaVertical(reqData).subscribe({
        next :(res) =>{  
          this.toast.success({detail:"SUCCESS",summary:"Form Data Saved Successfully.",duration:3000})
        },
        error:(err) =>{
          console.error(err);
        }
      })

      
      if(this.getFormIndexValue()<this.formSequence.length-1)
      {
        this.incrementIndex()
        this.getFormDataFromFormSequence(this.formSequence[this.getFormIndexValue()].formId);
      }
    }
    else{
      this.toast.warning({detail:"WARNING",summary:"Please fill all the mandatory fields",duration:3000})
    }
  }
  resetForm(){
    this.dynamicFormGroup.reset();
    this.showPremiumDetails=false;

  }
  getValidationErrors(control:IFormControl): string{
    const myFormControl = this.dynamicFormGroup.get(control.name)
    let errorMessage = ''
    control.validators?.forEach((val)=>{
      if(myFormControl?.hasError(val.validatorName as string)){
        errorMessage = val.message as string
      }
    })
    return errorMessage;
  }
  updateNestedData(originalData: any,newData: any){
    for(const key in newData) {
      if (newData.hasOwnProperty(key)) {
        if (typeof newData[key]==='object' && !Array.isArray(newData[key])) {
          originalData[key] = this.updateNestedData(originalData[key] || {}, newData[key]);
        } 
        else if(Array.isArray(newData[key]) && Array.isArray(originalData[key])) {
          originalData[key] = originalData[key].map((item: any, index: number) => {
            if (index < newData[key].length) {
              return this.updateNestedData(item || {}, newData[key][index]);
            }
            return item;
          });
          if (originalData[key].length<newData[key].length) {
            for(let index = originalData[key].length;index<newData[key].length;index++) {
              originalData[key].push(newData[key][index]);
            }
          }
          else if (originalData[key].length>newData[key].length){
            originalData[key].splice(newData[key].length, originalData[key].length - newData[key].length);
          }
        } 
        else {
          originalData[key] = newData[key];
        }
      }
    }
    return originalData;
  }

  //For adding and removing dynamic controls
  increment(controlName:any,childControlName:any){
    const currentValue=this.dynamicFormGroup.get(controlName)?.value;
    this.dynamicFormGroup.get(controlName)?.setValue(currentValue + 1);
    this.form.formSections.forEach(formsection => {
      formsection.formControls.forEach(formControl => {
        if(formControl.dynamicControls && formControl.name==childControlName){
          let tempDynamicControl=formControl.dynamicControls[0].map((element: any) => ({ ...element }));
          formControl.dynamicControls.push(tempDynamicControl)
          let formArr=this.dynamicFormGroup.get(childControlName) as FormArray;
          formArr.push(this.initializeDynamicFormControls(tempDynamicControl)); 
        }
      });
    });
  }
  decrement(controlName:any,childControlName:any){
    const currentValue = this.dynamicFormGroup.get(controlName)?.value;
    if(currentValue>0){
      this.dynamicFormGroup.get(controlName)?.setValue(currentValue - 1);
      this.form.formSections.forEach(formsection => {
        formsection.formControls.forEach(formControl => {
          if(formControl.dynamicControls && formControl.name==childControlName){
            formControl.dynamicControls.pop();
          }
        });
      });
      let formArr=this.dynamicFormGroup.get(childControlName) as FormArray;
      formArr.removeAt(formArr.length-1);
    }
  }

  // For Progress Bar & Dynamically Go to any Page
  getFormIndexValue(){
    const formIndex = localStorage.getItem("formIndex") as string;
    return formIndex ? parseInt(formIndex, 10) : 0;
  }
  setFormIndexValue(value: number){
    localStorage.setItem("formIndex", value.toString());
  }
  incrementIndex(){
    const currentIndex = this.getFormIndexValue();
    this.setFormIndexValue(currentIndex + 1);
  }
  decrementIndex(){
    const currentIndex = this.getFormIndexValue();
    this.setFormIndexValue(currentIndex - 1);
  }
  setFormIndex(index:any){
    this.setFormIndexValue(index);
    this.getFormDataFromFormSequence(this.formSequence[this.getFormIndexValue()].formId);
    if(this.resumeIndex<this.getFormIndexValue()){
      this.resumeIndex=this.getFormIndexValue();
    }
    if(index<=this.resumeIndex){
      this.setFormIndexValue(index);
      this.getFormDataFromFormSequence(this.formSequence[this.getFormIndexValue()].formId);
    }
  }

  // For Popup Method
  sendLink(){
    this.spinner.show();  
    const reqdata={
        verticalCode:this.verticalCode,
        code : this.bankCode,
        insuranceTypeCode:this.insuranceTypeCode,
        productId:this.productId,
        configuration_Json:JSON.stringify(this.formData)  
    }
    console.log(JSON.stringify(this.formData));
    // this.spinner.hide();
    //this.visible=true;
    this.service.CreateProposal(reqdata).subscribe({
      next:(res)=>{
        console.log(res);
        this.visible=true;
        this.showPopup = false;
        this.generetedProposalNum=res.proposalNumber;
        this.dynamicFormGroup.addControl('proposalNum', this.fb.control(res.proposalNumber));
        this.formData={...this.formData,...this.dynamicFormGroup.value};
        console.log("proposalNum added to json",this.formData);
        console.log(this.formData.toString());
        this.spinner.hide();
      },
      error:(err)=>{
        console.error(err);
        this.spinner.hide();
        this.visible=false;
        this.showPopup=false;
        this.toast.warning({detail:"WARNING",summary:"Something went wrong",duration:3000})
      }
    });
    // const currentIndex = this.getFormIndexValue();
    // this.setFormIndexValue(currentIndex + 2);
    // this.showPopup = false;
    // setTimeout(() => {
    //   alert("Payment Link Sent Successfully");
    //   this.router.navigate(['portal/dashboard/customerForm'],{
    //     state:{proposalNumber:this.proposalNum,insuranceTypeCode:this.insuranceTypeCode,
    //       productId:this.productId,formSequence:this.allFormSequence,dynamicFormGroup:this.formData, verticalCode:this.verticalCode}
    //   }); 
    // }, 10);
  }
  onSendLink(){
    console.log("allFormSequence", this.allFormSequence);
    console.log(this.getFormIndexValue()+1);
    console.log(this.allFormSequence.length - 1);
    
    if (this.getFormIndexValue()+1 < this.allFormSequence.length) {
      this.getPopupFormDataFromFormSequence(this.allFormSequence[this.getFormIndexValue()+1].formId);
      this.showPopup = true;
    }
  }
  sendCustomer(){
    this.spinner.show();
    this.service.convertToRDBMS(JSON.stringify(this.formData)).subscribe({
      next:(res)=>{
        console.log(res);
        this.spinner.hide();
      },
      error:(err)=>{
        console.error(err);
        this.spinner.hide();
      }
    });
    const currentIndex = this.getFormIndexValue();
    this.setFormIndexValue(currentIndex + 2);
    this.showPopup = false;
    this.visible=false;
    this.router.navigate(['portal/dashboard/customerForm'],{
      state:{proposalNumber:this.proposalNum,insuranceTypeCode:this.insuranceTypeCode,
        productId:this.productId,formSequence:this.allFormSequence,dynamicFormGroup:this.formData,verticalCode:this.verticalCode}
    });
  }

  getPopupFormDataFromFormSequence(formSeq: any) {
    console.log(this.bankCode, this.insuranceTypeCode, formSeq);
    this.service.getJSONFormViaVerticalCode(this.verticalCode,this.bankCode, this.insuranceTypeCode,this.productId,formSeq).subscribe({
      next: (res) => {
        console.log(res);
        this.popUpForm = JSON.parse(res.jsonformdata);
        this.initializaPopupForm();
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
      this.dynamicCssForPopup(this.popUpForm);
      this.dynamciallyLoadCSS(this.form);
      const radioOptionsControl = this.popupFormGroup.get('contact');
 
      if (radioOptionsControl) {
        this.radioOptionsSubscription = radioOptionsControl.valueChanges.subscribe((value: string) => {
          console.log(value);
          this.contactMethod = value;
        });
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

  onDialogHide() {
    this.initializeForm();
    if(this.dynamicStylePopup){
      const linkElement= this.renderer.selectRootElement(`link[href="assets/styles/dynamicForm/payment-popup.css"]`, true);
      if (linkElement) {
        this.renderer.removeChild(this.document.head, linkElement);
        this.renderer.removeChild(this.document.head, this.dynamicStylePopup);
      }
    }
  }
  getAllOccupations(otherControl:IFormControl){
    this.spinner.show();
    if(otherControl.options?.length==0){
      this.service.getOccupations().subscribe({
        next:(res)=>{
          console.log(res);
          otherControl.options=Object.keys(res).map((key) => ({
          name: key,
          value: res[key],
        }));
          this.spinner.hide();
        },
        error:(err)=>{
          console.error(err);
          this.spinner.hide();
        }
      })
    }
  }

  toggleSi(control:any){
    console.log(control.name);
    console.log(this.dynamicFormGroup.get('annualSumInsured')?.value);
    const name = control.name + 'SI';
    console.log(name);
    const value = this.dynamicFormGroup.get('annualSumInsured')?.value;
    console.log(value);
    this.dynamicFormGroup.addControl(name,this.fb.control(value));
    console.log(this.dynamicFormGroup.value);
  }
  onCoverChange(cover: any): void {
    this.selectedCover = cover;
    if (cover.additionalQuestions && cover.additionalQuestions.length > 0) {
      // Clear previous questions
      this.dynamicFormGroup.removeControl('additionalQuestions');
 
      // Create and add additionalQuestions control to the form
      const additionalQuestionsControl = this.fb.group({});
      cover.additionalQuestions.forEach((question: any) => {
        additionalQuestionsControl.addControl(question.name, this.fb.control(''));
      });
      this.dynamicFormGroup.addControl('additionalQuestions', additionalQuestionsControl);
    } else {
      // Remove additionalQuestions control if no additional questions
      this.dynamicFormGroup.removeControl('additionalQuestions');
    }
  }

  toggleContent(index: number): void {
    this.expandedCardIndex = this.expandedCardIndex === index ? null : index;
  }
  isContentVisible(index: number): boolean {
    return this.expandedCardIndex === index;
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
}
