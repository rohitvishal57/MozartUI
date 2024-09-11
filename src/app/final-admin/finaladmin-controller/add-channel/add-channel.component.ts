import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { AdminService } from 'src/app/services/admin.service';
import ValidateForm from 'src/app/validation/validateForm';


@Component({
  selector: 'app-add-channel',
  templateUrl: './add-channel.component.html',
  styleUrls: ['./add-channel.component.scss']
})
export class AddChannelComponent {
  ChannelForm:any;

  allChannel:any[]=[]



  constructor(private toast:NgToastService
    ,private fb: FormBuilder,private adminService:AdminService,private route:Router) { }

  ngOnInit() {
    this.getAllChannel();
    this.initializeForm();

  }
  initializeForm(){
    this.ChannelForm=this.fb.group({
      verticalCode:['',Validators.required],
      channelName:['',Validators.required],
      channelStatus:[true,Validators.required]
    });
  }
  onSubmit(){
    if(this.ChannelForm.valid){
      this.adminService.insertChannel(this.ChannelForm.value).subscribe({
        next: (res)=>{
          this.toast.success({ detail: "SUCCESS", summary: "Channel Added Successfully.", duration: 4000 })
          this.getAllChannel();
          this.initializeForm();
        },
        error: (err => {
          this.toast.warning({ detail: "WARNING", summary:"Channel Already Added.!", duration: 4000 });
        })
      })
    }
    else{
      ValidateForm.validateAllFormFields(this.ChannelForm);
      this.toast.warning({ detail: "WARNING", summary:"Please Fill All Required Fields.!", duration: 4000 });
    }
    this.route.navigate(['/portal/finaladminDashboard']);
  }
  getAllChannel(){
    this.adminService.getAllChannelList()
    .subscribe({  
      next: (res)=>{
        this.allChannel=res;
      },
      error: (err => {
        console.error(err); 
      })
    })
  }
}
