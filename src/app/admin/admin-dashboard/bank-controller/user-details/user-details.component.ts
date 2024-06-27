import { Component } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { NgToastService } from 'ng-angular-popup';
import {FormBuilder,Validators} from '@angular/forms';
import ValidateForm from 'src/app/validation/validateForm';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['../../bank-controller/add-bank/add-bank.component.scss','../../bank-controller/add-bank/table.scss']
})
export class UserDetailsComponent {
  visible: boolean = false;
  UserDetailsForm:any;
  allBank:any[]=[]
  allUserDetails:any[]=[]

  constructor(private adminService:AdminService,private toast:NgToastService,
    private fb: FormBuilder){}

  ngOnInit(){
    this.getAllBank();
    this.getAllUserDetails();
    this.initializeForm();
  }
  initializeForm(){
    this.UserDetailsForm=this.fb.group({
      bancaUserName:['',Validators.required],
      bancaMobileNum:['',Validators.required],
      bankCode:['',Validators.required],
      rmid:['',Validators.required],
      bancaUserStatus:[true,Validators.required]
    });
  }
  getName(id:any){
    let data=this.allBank.find(bank => bank.bankCode === id);
    return data;
  }
  getAllBank() {
    return this.adminService.getAllBankList().subscribe({
      next: (res)=>{
        this.allBank=res;
      },
      error: (err => {
        console.error(err); 
      })
    });
  }
  getAllUserDetails() {
    return this.adminService.getAllUserDetailsList().subscribe({
      next: (res)=>{
        this.allUserDetails=res;
      },
      error: (err => {
        console.error(err); 
      })
    })
  }
  onSubmit(){
    if(this.UserDetailsForm.valid){
      this.adminService.insertUser(this.UserDetailsForm.value).subscribe({
        next: (res)=>{
          this.toast.success({ detail: "SUCCESS", summary: "User Added Successfully.", duration: 4000 })
          this.getAllUserDetails();
          this.initializeForm();
        },
        error: (err => {
          this.toast.warning({ detail: "WARNING", summary:"User Already Added.!", duration: 4000 });
        })
      });
    }
    else{
      ValidateForm.validateAllFormFields(this.UserDetailsForm);
      this.toast.warning({ detail: "WARNING", summary:"Please Fill All Required Fields.!", duration: 4000 });
    }
  }
  showDialog(data:any) {
    this.visible = true;
    this.UserDetailsForm.addControl('bancaUserDetailsSeq',this.fb.control(data.bancaUserDetailsSeq));
    this.UserDetailsForm.get('bancaUserName')?.setValue(data.bancaUserName);
    this.UserDetailsForm.get('bancaMobileNum')?.setValue(data.bancaMobileNum);
    this.UserDetailsForm.get('bankCode')?.setValue(data.bankCode);
    this.UserDetailsForm.get('rmid')?.setValue(data.rmid);
    this.UserDetailsForm.get('bancaUserStatus')?.setValue(data.bancaUserStatus);
  }
  onUpdate(){
    if(this.UserDetailsForm.valid){
      this.adminService.updateUser(this.UserDetailsForm.value).subscribe({
        next: (res)=>{
          this.toast.success({ detail: "SUCCESS", summary: "User Updated Successfully.", duration: 4000 })
          this.getAllUserDetails();
          this.initializeForm();  
        },
        error: (err => {
          this.toast.warning({ detail: "WARNING", summary:"User Already Added.!", duration: 4000 });
        })
      });
      this.UserDetailsForm.removeControl('bancaUserDetailsSeq');
      this.visible=false;
    }
    else{
      ValidateForm.validateAllFormFields(this.UserDetailsForm);
      this.toast.warning({ detail: "WARNING", summary:"Please Fill All Required Fields.!", duration: 4000 });
    }
  }
}
