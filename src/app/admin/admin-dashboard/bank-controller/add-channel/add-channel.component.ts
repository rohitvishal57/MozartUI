import { Component } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { NgToastService } from 'ng-angular-popup';
import {FormBuilder,Validators} from '@angular/forms';
import ValidateForm from 'src/app/validation/validateForm';

@Component({
  selector: 'app-add-channel',
  templateUrl: './add-channel.component.html',
  styleUrls: ['../../bank-controller/add-bank/add-bank.component.scss','../../bank-controller/add-bank/table.scss']
})
export class AddChannelComponent {
  visible: boolean = false;
  ChannelForm:any;
  allChannel:any[]=[]
  constructor(private adminService:AdminService,private toast:NgToastService
    ,private fb: FormBuilder){}

  ngOnInit(){
    this.getAllChannel()
    this.initializeForm();
  }
  initializeForm(){
    this.ChannelForm=this.fb.group({
      verticalCode:['',Validators.required],
      channelName:['',Validators.required],
      channelStatus:[true,Validators.required]
    });
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
  }
  showDialog(data:any) {
    this.visible = true;
    this.ChannelForm.get('verticalCode')?.setValue(data.verticalCode);
    this.ChannelForm.get('channelName')?.setValue(data.channelName);
    this.ChannelForm.get('channelStatus')?.setValue(data.channelStatus);
  }
  onUpdate(){
    if(this.ChannelForm.valid){
      this.adminService.updateChannel(this.ChannelForm.value)
      .subscribe({  
        next: (res)=>{
          this.toast.success({ detail: "SUCCESS", summary: "Channel Updated Successfully.", duration: 4000 })
          this.initializeForm();
          this.getAllChannel();
        },
        error: (err => {
          this.toast.warning({ detail: "WARNING", summary:"Channel Already Updated.!", duration: 4000 });
        })
      })
      this.visible=false;
    }
    else{
      ValidateForm.validateAllFormFields(this.ChannelForm);
      this.toast.warning({ detail: "WARNING", summary:"Please Fill All Required Fields.!", duration: 4000 });
    }
  }
}
