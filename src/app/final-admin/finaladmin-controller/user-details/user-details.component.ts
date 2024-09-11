import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { AdminService } from 'src/app/services/admin.service';
import ValidateForm from 'src/app/validation/validateForm';


@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent {
  visible: boolean = false;
  UserDetailsForm:any;
  allBank:any[]=[]
  allUserDetails:any[]=[]

  constructor(private adminService:AdminService,private toast:NgToastService,
    private fb: FormBuilder,private route:Router){}

  ngOnInit(){
    this.getAllUserDetails();
    this.getAllBank();
    this.initializeForm();
  }
  initializeForm(){
    this.UserDetailsForm=this.fb.group({
      bancaUserName:['',Validators.required],
      bancaMobileNum:['',Validators.required],
      bankCode:['',Validators.required],
      rmid:['',Validators.required],
      bancaUserStatus:[true],
      userRole:['BancaUser']
    });
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
      console.log(this.UserDetailsForm.value);
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
    this.route.navigate(['/portal/finaladminDashboard']);
  }
}
