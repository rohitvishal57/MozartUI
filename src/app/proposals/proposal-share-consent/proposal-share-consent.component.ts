import { DOCUMENT } from '@angular/common';
import { Component, Inject, Renderer2 } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { error } from 'jquery';
import { NgToastService } from 'ng-angular-popup';
import { IForm, IFormControl, IValidator } from 'src/app/interface/form.interface';
import { YatraService } from 'src/app/yatra/yatra/yatra.service';

@Component({
  selector: 'app-proposal-share-consent',
  templateUrl: './proposal-share-consent.component.html',
  styleUrls: ['./proposal-share-consent.component.scss']
})
export class ProposalShareConsentComponent {

  formConfig : any ={};
  token : any ;
  proposalNumber : any ;
  sharecontentForm!: FormGroup;
  sharecontent!: IForm;
  isHtmlrender:any = false
  private dynamicStyle!: HTMLLinkElement;
  formData: any;
  selectedButton: any;

  constructor(
    private yatraService: YatraService, private route: ActivatedRoute, private formBuilder: FormBuilder,
    private renderer: Renderer2, @Inject(DOCUMENT) private document: Document,private toast: NgToastService){}

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
    this.sharecontentForm = this.formBuilder.group({});
    this.sharecontent.formSections.forEach((section: any) => {
      section.formControls.forEach((control: any) => {
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
        this.sharecontentForm.addControl(control.name, new FormControl(control.value, controlValidators));
      });
    });
    this.dynamciallyLoadCSS(this.sharecontent);
    console.log(this.sharecontentForm);  
  }

  getFormInfo() {
    let reqBody: any = {};
    reqBody.formId = '1';
    this.yatraService.getStaticForms(reqBody).subscribe(
      (response: any) => {
        if(response.isSuccess){
          this.sharecontent =JSON.parse(JSON.parse(response.data.formJson) );
          console.log(this.sharecontent);
          this.inItForm();
        }
        console.log(response);
      }, (error) => {
        console.error(error)
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
}
