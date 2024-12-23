import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { error } from 'jquery';
import { IForm, IValidator } from 'src/app/interface/form.interface';
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
  sharecontent : any ={};
  isHtmlrender:any = false
  renderer: any;
  dynamicStyle: any;
  document: any;

  


  constructor(
    private yatraService: YatraService,private route: ActivatedRoute,private formBuilder: FormBuilder
  ) { }

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
          this.inItForm();

        }
        console.log(response);
      }, (error) => {
        console.error(error)
      }
    );

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

}
