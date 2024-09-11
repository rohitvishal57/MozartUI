import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';
import { AdminService } from 'src/app/services/admin.service';
import ValidateForm from 'src/app/validation/validateForm';

@Component({
  selector: 'app-add-agent',
  templateUrl: './add-agent.component.html',
  styleUrls: ['../../bank-controller/add-bank/add-bank.component.scss','../../bank-controller/add-bank/table.scss']

})
export class AddAgentComponent {

  visible: boolean = false;
  AgentForm:any;
  allAgency:any[]=[]
  constructor(private adminService:AdminService,private toast:NgToastService,
    private fb: FormBuilder){}

  ngOnInit(){
    this.AgentForm=this.fb.group({
      agencyCode:['',Validators.required],
      agencyName:['',Validators.required],
      status:[true,Validators.required]
    });
    this.getAllAgency();
  }
  getAllAgency(){
    this.adminService.getAllAgencyDetails().subscribe({  
      next: (res)=>{
        this.allAgency=res;
      },
      error: (err => {
        console.error(err); 
      })
    })
  }
  onSubmit(){
    if(this.AgentForm.valid){
      const agentConfiguration={
        loginConfiguration: JSON.stringify({
            "OTP": true,
            "USERID": true
        })
      };
      const updatedBankConfiguration = {
        ...this.AgentForm.value,...agentConfiguration
      };
      this.adminService.insertAgency(updatedBankConfiguration)
      .subscribe({  
        next: (res)=>{
          this.toast.success({ detail: "SUCCESS", summary: "Agency Added Successfully.", duration: 4000 })
          this.AgentForm.reset();
          this.getAllAgency();
        },
        error: (err => {
          this.toast.warning({ detail: "WARNING", summary:"Agency Already Added.!", duration: 4000 });
        })
      })
    }
    else{
      ValidateForm.validateAllFormFields(this.AgentForm);
      this.toast.warning({ detail: "WARNING", summary:"Please Fill All Required Fields.!", duration: 4000 });
    }
  }
  showDialog(data:any) {
    this.visible = true;
    this.AgentForm.get('agencyCode')?.setValue(data.agencyCode);
    this.AgentForm.get('agencyName')?.setValue(data.agencyName);
    this.AgentForm.get('status')?.setValue(data.status);
  }
  onUpdate(){
    if(this.AgentForm.valid){
      const bankConfiguration={
        loginConfiguration: JSON.stringify({
            "OTP": true,
            "USERID": true
        })
      };
      const updatedBankConfiguration = {
        ...this.AgentForm.value,...bankConfiguration
      };
      this.adminService.updateAgency(updatedBankConfiguration).subscribe({
        next: (res)=>{
          this.toast.success({ detail: "SUCCESS", summary: "Agency Updated Successfully.", duration: 4000 })
          this.getAllAgency();
        },
        error: (err => {
          this.toast.warning({ detail: "WARNING", summary:"Agency Already Added.!", duration: 4000 });
        })
      });
      this.AgentForm.reset();
      this.visible=false;
    }
    else{
      ValidateForm.validateAllFormFields(this.AgentForm);
      this.toast.warning({ detail: "WARNING", summary:"Please Fill All Required Fields.!", duration: 4000 });
    }
  }

}
