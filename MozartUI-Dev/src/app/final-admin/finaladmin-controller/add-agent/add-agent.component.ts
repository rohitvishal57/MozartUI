import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { AdminService } from 'src/app/services/admin.service';
import ValidateForm from 'src/app/validation/validateForm';

@Component({
  selector: 'app-add-agent',
  templateUrl: './add-agent.component.html',
  styleUrls: ['./add-agent.component.scss']
})
export class AddAgentComponent {

  AgentDetailsForm:any;
  allAgency:any[]=[]
  allAgentDetails:any[]=[]
  channel:any[]=[]

  constructor(private adminService:AdminService,private toast:NgToastService,
    private fb: FormBuilder,private route:Router){}

  ngOnInit(){
    this.initializeForm();
    this.getAllAgency();
    this.getAllAgentDetails();
    this.getAllChannel();
  }
  initializeForm(){
    this.AgentDetailsForm=this.fb.group({
      agentUserName:['',Validators.required],
      agentMobileNum:['',Validators.required],
      agencyCode:['', Validators.required],
      agentUserStatus:[true,Validators.required],
      verticalCode:['',Validators.required],
      role:['Agent']
    });
  }
  getAllAgency() {
    return this.adminService.getAllAgencyDetails().subscribe({
      next: (res)=>{
        this.allAgency=res;
        console.log(this.allAgency);
      },
      error: (err => {
        console.error(err); 
      })
    });
  }
  getAllAgentDetails() {
    return this.adminService.getAllAgentDetailsList().subscribe({
      next: (res)=>{
        this.allAgentDetails=res;
        console.log(this.allAgentDetails);
      },
      error: (err => {
        console.error(err); 
      })
    })
  }
  getAllChannel(){
    this.adminService.getAllChannelList().subscribe({
      next: (res)=>{
        this.channel=res;
      },
      error: (err => {
        console.error(err); 
      })
    });
  }
  onSubmit(){
    if(this.AgentDetailsForm.valid){
      console.log(this.AgentDetailsForm.value);
      this.adminService.insertAgent(this.AgentDetailsForm.value).subscribe({
        next: (res)=>{
          this.toast.success({ detail: "SUCCESS", summary: "Agent Added Successfully.", duration: 4000 })
          this.AgentDetailsForm.reset();
          this.getAllAgentDetails();
          this.route.navigate(['/portal/finaladminDashboard']);
        },
        error: (err => {
          this.toast.warning({ detail: "WARNING", summary:"Agent Already Added.!", duration: 4000 });
        })
      });
    }
    else{
      ValidateForm.validateAllFormFields(this.AgentDetailsForm);
      this.toast.warning({ detail: "WARNING", summary:"Please Fill All Required Fields.!", duration: 4000 });
    }
  }
}
