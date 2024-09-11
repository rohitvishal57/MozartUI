import { Component,inject,Renderer2,Inject, ElementRef, Input, Output,EventEmitter } from '@angular/core';
import { FormArray, FormBuilder,FormControl,FormGroup, Validators } from '@angular/forms';
import { IDynamicControl, IForm, IFormControl, IFormSections, IValidator } from 'src/app/interface/form.interface';
import { DOCUMENT } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-admin-preview',
  templateUrl: './admin-preview.component.html',
  styleUrls: ['./admin-preview.component.scss']
})
export class AdminPreviewComponent {
  showHtmlContent:any;
  @Input() form!: IForm;
  @Output() modifedForm = new EventEmitter<any>();
  
  fb = inject(FormBuilder)
  dynamicFormGroup: FormGroup = this.fb.group({});

  private dynamicStyle! : HTMLLinkElement;

  constructor(private renderer: Renderer2,private el: ElementRef, @Inject(DOCUMENT) private document: Document,private spinner:NgxSpinnerService){}
  
  ngOnInit(){
    this.spinner.show();
    this.showHtmlContent = false;
    this.initializeForm();
  }
  initializeForm(){
    this.form.formSections.forEach((section:any) => {
      section.formControls.forEach((control:any) => {
        if(control.dynamicControls){
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
      this.form.formSections.forEach((section:IFormSections) => {
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
            this.dynamicFormGroup.addControl(control.name, new FormControl(control.value,controlValidators));
          }
        });
      });
      //dynamic css
      this.showHtmlContent=true;
      this.spinner.hide();
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
      formGroup.addControl(control.name, new FormControl(control.value, controlValidators));
    })
    return formGroup;
  }
  //Helper Method for dynamic Css
  // dynamciallyLoadCSS(form: IForm){
  //   let tf: string = "default.css";
  //   if(form.themeFile) tf = form.themeFile;
  //   this.dynamicStyle = this.renderer.createElement('link');
  //   this.renderer.setAttribute(this.dynamicStyle,'rel', 'stylesheet');
  //   this.renderer.setAttribute(this.dynamicStyle,'type', 'text/css');
  //   this.renderer.setAttribute(this.dynamicStyle,'href', 'assets/styles/dynamicForm/' + tf)
  //   this.renderer.appendChild(this.document.head, this.dynamicStyle)
  //   this.showHtmlContent=true;
  // }
  // ngOnDestroy():void{
  //   if(this.dynamicStyle){
  //     const linkElement= this.renderer.selectRootElement(`link[href="assets/styles/dynamicForm/${this.form.themeFile}"]`, true);
  //     if (linkElement) {
  //       this.renderer.removeChild(this.document.head, linkElement);
  //       this.renderer.removeChild(this.document.head, this.dynamicStyle);
  //     }
  //   }
  // }
  //Helper Method for dynamic Css
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
  //For adding and removing dynamic controls
  increment(controlName:any,childControlName:any){
    const currentValue=this.dynamicFormGroup.get(controlName)?.value;
    this.dynamicFormGroup.get(controlName)?.setValue(currentValue + 1);
    this.form.formSections.forEach((formsection: { formControls: any[]; }) => {
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
      this.form.formSections.forEach((formsection: { formControls: any[]; }) => {
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

  //For Drag and Drop
  dropSection(event: CdkDragDrop<any[]>): void {
    moveItemInArray(this.form.formSections, event.previousIndex,event.currentIndex);
    this.modifedForm.emit(this.form);
  }
  dropControl(event: CdkDragDrop<any[]>,section:any): void {
    const sectionIndex=this.form.formSections.findIndex((formSection:IFormSections)=>formSection.sectionTitle==section.sectionTitle);
    moveItemInArray(this.form.formSections[sectionIndex].formControls, event.previousIndex,event.currentIndex);
    this.modifedForm.emit(this.form);
  }

}
