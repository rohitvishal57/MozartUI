import { Component } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { NgToastService } from 'ng-angular-popup';
import {FormBuilder,Validators} from '@angular/forms';
import ValidateForm from 'src/app/validation/validateForm';

@Component({
  selector: 'app-add-bank',
  templateUrl: './add-bank.component.html',
  styleUrls: ['./add-bank.component.scss','./table.scss']
})
export class AddBankComponent {
  visible: boolean = false;
  BankForm:any;
  allBank:any[]=[]
  Userid: any[]=[];
  Otp: any[]=[];

  constructor(private adminService:AdminService,private toast:NgToastService,
    private fb: FormBuilder){}

  ngOnInit(){
    this.getAllBank();
    this.initializeForm();
  }
  initializeForm(){
    this.BankForm=this.fb.group({
      bankCode:['',Validators.required],
      bankName:['',Validators.required],
      status:[true,Validators.required],
      userId:[true,Validators.required],
      Otp:[true,Validators.required]
    });
  }
  getAllBank(){
    this.adminService.getAllBankList()
    .subscribe({  
      next: (res)=>{
        this.allBank=res;
      },
      error: (err => {
        console.error(err); 
      })
    })
  }
  onSubmit(){
    if(this.BankForm.valid){
      const bankConfiguration={
        loginConfiguration: JSON.stringify({
          "USERID": true,
          "OTP": true
        })
      };
      const updatedBankConfiguration = {
        ...this.BankForm.value,...bankConfiguration
      };
      this.adminService.insertBank(updatedBankConfiguration)
      .subscribe({  
        next: (res)=>{
          this.toast.success({ detail: "SUCCESS", summary: "Bank Added Successfully.", duration: 4000 })
          this.getAllBank();
          this.initializeForm();
        },
        error: (err => {
          this.toast.warning({ detail: "WARNING", summary:"Bank Already Added.!", duration: 4000 });
        })
      })
    }
    else{
      ValidateForm.validateAllFormFields(this.BankForm);
      this.toast.warning({ detail: "WARNING", summary:"Please Fill All Required Fields.!", duration: 4000 });
    }
  }
  showDialog(data:any) {
    this.visible = true;
    const loginConfiguration = JSON.parse(data.loginConfiguration);  
    this.BankForm.get('bankCode')?.setValue(data.bankCode);
    this.BankForm.get('bankName')?.setValue(data.bankName);
    this.BankForm.get('status')?.setValue(data.status);
    this.BankForm.get('userId')?.setValue(loginConfiguration['USERID']);
    this.BankForm.get('Otp')?.setValue(loginConfiguration['OTP']);
  }
  onUpdate(){
    if(this.BankForm.valid){
      const bankConfiguration={
        loginConfiguration: JSON.stringify({
            "OTP": this.BankForm.value.Otp,
            "USERID": this.BankForm.value.userId
        })
      };
      const updatedBankConfiguration = {
        ...this.BankForm.value,...bankConfiguration
      };
      this.adminService.updateBank(updatedBankConfiguration).subscribe({
        next: (res)=>{
          this.toast.success({ detail: "SUCCESS", summary: "Bank Updated Successfully.", duration: 4000 })
          this.initializeForm();
          this.getAllBank();
        },
        error: (err => {
          this.toast.warning({ detail: "WARNING", summary:"Bank Already Added.!", duration: 4000 });
        })
      });
      this.visible=false;
    }
    else{
      ValidateForm.validateAllFormFields(this.BankForm);
      this.toast.warning({ detail: "WARNING", summary:"Please Fill All Required Fields.!", duration: 4000 });
    }
  }
}
