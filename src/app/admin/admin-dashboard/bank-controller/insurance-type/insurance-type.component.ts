import { Component } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { NgToastService } from 'ng-angular-popup';
import {FormBuilder,Validators} from '@angular/forms';
import ValidateForm from 'src/app/validation/validateForm';

@Component({
  selector: 'app-insurance-type',
  templateUrl: './insurance-type.component.html',
  styleUrls: ['../add-bank/add-bank.component.scss','../add-bank/table.scss']
})
export class InsuranceTypeComponent {
  visible: boolean = false;
  InsuranceForm:any;
  allInsuranceType:any[]=[];

  constructor(private adminService:AdminService,private toast:NgToastService
    ,private fb: FormBuilder){}

  ngOnInit(){
    this.getAllInsuranceType()
    this.initializeForm();
  }
  initializeForm(){
    this.InsuranceForm=this.fb.group({
      insuranceTypeCode:['',Validators.required],
      insuranceType:['',Validators.required],
      status:[true,Validators.required]
    });
  }
  getAllInsuranceType(){
    this.adminService.getAllInsuranceTypeList()
    .subscribe({  
      next: (res)=>{
        this.allInsuranceType=res;
      },
      error: (err => {
        console.error(err); 
      })
    })
  }
  onSubmit(){
    if(this.InsuranceForm.valid){
      this.adminService.insertInsuranceType(this.InsuranceForm.value).subscribe({
        next: (res)=>{
          this.toast.success({ detail: "SUCCESS", summary: "Insurance Type Added Successfully.", duration: 4000 })
          this.getAllInsuranceType();
          this.initializeForm();
        },
        error: (err => {
          this.toast.warning({ detail: "WARNING", summary:"Insurance Type Already Added.!", duration: 4000 });
        })
      });
    }
    else{
      ValidateForm.validateAllFormFields(this.InsuranceForm);
      this.toast.warning({ detail: "WARNING", summary:"Please Fill All Required Fields.!", duration: 4000 });
    }
  }
  showDialog(data:any) {
    this.visible = true;
    this.InsuranceForm.get('insuranceTypeCode')?.setValue(data.insuranceTypeCode);
    this.InsuranceForm.get('insuranceType')?.setValue(data.insuranceType);
    this.InsuranceForm.get('status')?.setValue(data.status);
  }
  onUpdate(){
    if(this.InsuranceForm.valid){
      this.adminService.updateInsuranceType(this.InsuranceForm.value).subscribe({
        next: (res)=>{
          this.toast.success({ detail: "SUCCESS", summary: "Insurance Type Updated Successfully.", duration: 4000 })
          this.getAllInsuranceType();
          this.initializeForm();
        },
        error: (err => {
          this.toast.warning({ detail: "WARNING", summary:"Insurance Type Already Added.!", duration: 4000 });
        })
      });
      this.visible=false;
    }
    else{
      ValidateForm.validateAllFormFields(this.InsuranceForm);
      this.toast.warning({ detail: "WARNING", summary:"Please Fill All Required Fields.!", duration: 4000 });
    }
  }
}
