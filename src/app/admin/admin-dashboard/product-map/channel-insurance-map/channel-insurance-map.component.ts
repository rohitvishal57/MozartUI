import { Component } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { NgToastService } from 'ng-angular-popup';
import {FormBuilder,Validators} from '@angular/forms';
import ValidateForm from 'src/app/validation/validateForm';
import { ConfirmationService, MessageService, ConfirmEventType } from 'primeng/api';

@Component({
  selector: 'app-channel-insurance-map',
  templateUrl: './channel-insurance-map.component.html',
  styleUrls: ['../../bank-controller/add-bank/add-bank.component.scss','../../bank-controller/add-bank/table.scss'],
  providers: [MessageService, ConfirmationService]
})
export class ChannelInsuranceMapComponent {
  visible: boolean = false;
  ChannelBankMapForm:any;
  allBankInsuranceMapData:any[]=[]
  allBank:any[]=[]
  allChannel:any[]=[]
  allInsuranceType:any[]=[]

  bankOptions:any[]=[]  
  channelOptions:any[]=[]
  insuranceTypeOptions:any[]=[]

  constructor(private adminService:AdminService,private toast:NgToastService,private fb: FormBuilder,
    private confirmationService: ConfirmationService, private messageService: MessageService){}
  ngOnInit(){
    this.getAllBankInsuranceMapDetails();
    this.getAllChannel();
    this.getAllBank();
    this.getAllInsuranceType();
    this.initializeForm();
  }
  initializeForm(){
    this.ChannelBankMapForm=this.fb.group({
      verticalCode:['',Validators.required],
      bankCode:['',Validators.required],
      insuranceTypeCode:['',Validators.required],
      status:[true,Validators.required]
    });
  }
  getAllBankInsuranceMapDetails() {
    return this.adminService.getAllInsuranceMap().subscribe({
      next: (res) => {
        this.allBankInsuranceMapData = res;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
  getAllBank(){
    this.adminService.getAllBankList()
      .subscribe({  
        next: (res)=>{
          this.allBank=res.filter((bank:any)=>bank.status==true);
          this.bankOptions=this.allBank;
        },
        error: (err => {
          console.error(err); 
        })
      })
  }
  getAllChannel(){ 
    this.adminService.getAllChannelList()
      .subscribe({  
        next: (res)=>{
          this.allChannel=res.filter((channel:any)=>channel.channelStatus==true);
          this.channelOptions=this.allChannel;
        },
        error: (err => {
          console.error(err); 
        })
      }) 
  }
  getAllInsuranceType(){
    this.adminService.getAllInsuranceTypeList()
      .subscribe({  
        next: (res)=>{
          this.allInsuranceType=res.filter((insurance:any)=>insurance.status==true);
        },
        error: (err => {
          console.error(err); 
        })
      })
  }
  getBankName(id:any){
    let data=this.allBank.find(bank => bank.bankCode==id);
    return data;
  }
  getChannelName(id:any){
    let data=this.allChannel.find(channel => channel.verticalCode==id);
    return data;
  }
  getInsuranceTypeName(id:any){
    let data=this.allInsuranceType.find(insurance => insurance.insuranceTypeCode==id);
    return data;
  }
  onselectBank(event:any){
    const excludedInsuranceTypeCodes = this.allBankInsuranceMapData
    .filter(map => {
      const verticalCodeMatch = map.verticalCode == this.ChannelBankMapForm.get('verticalCode')?.value;
      const bankCodeMatch = map.bankCode == this.ChannelBankMapForm.get('bankCode')?.value;
      return verticalCodeMatch && bankCodeMatch;
    })
    .map(filteredMap => filteredMap.insuranceTypeCode);

    const filteredInsurance =this.allInsuranceType.filter(insurance => {
      return !excludedInsuranceTypeCodes.includes(insurance.insuranceTypeCode);
    });
    this.insuranceTypeOptions=filteredInsurance;
  }
  onSubmit(){
    if(this.ChannelBankMapForm.valid){
      this.adminService.insertBancaChannelInsuranceMap(this.ChannelBankMapForm.value).subscribe({
        next: (res)=>{
          this.toast.success({ detail: "SUCCESS", summary: "Map Added Successfully.", duration: 4000 })
          this.getAllBankInsuranceMapDetails();
          this.initializeForm();
        },
        error: (err => {
          this.toast.warning({ detail: "WARNING", summary:"Map Already Exist.!", duration: 4000 });
        })
      });      
    }
    else{
      ValidateForm.validateAllFormFields(this.ChannelBankMapForm);
      this.toast.warning({ detail: "WARNING", summary:"Please Fill All Required Fields.!", duration: 4000 });
    }
  }
  showDialog(data:any) {
    this.visible = true;
    this.ChannelBankMapForm.get('verticalCode')?.setValue(data.verticalCode);
    this.ChannelBankMapForm.get('bankCode')?.setValue(data.bankCode);
    this.ChannelBankMapForm.get('insuranceTypeCode')?.setValue(data.insuranceTypeCode);
    this.ChannelBankMapForm.get('status')?.setValue(data.status);
  }
  onUpdate(){
    if(this.ChannelBankMapForm.valid){
      this.confirmationService.confirm({
        message: 'Are you sure that you want to update?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.adminService.deleteBancaChannelInsuranceMap(this.ChannelBankMapForm.value).subscribe({
            next: (res)=>{
              this.toast.success({ detail: "SUCCESS", summary: "Map Updated Successfully.", duration: 4000 })
              this.getAllBankInsuranceMapDetails();
              this.initializeForm();
              this.visible=false;
            },
            error: (err => {
              this.toast.warning({ detail: "WARNING", summary:"Map Already Exist.!", duration: 4000 });
            })
          });
        },
        reject: (type: any) => {
          switch (type) {
            case ConfirmEventType.REJECT:
              this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
              break;
            case ConfirmEventType.CANCEL:
              this.messageService.add({ severity: 'warn', summary: 'Cancelled', detail: 'You have cancelled' });
              break;
          }
          this.visible=false;
        }
      });
    }
    else{
      ValidateForm.validateAllFormFields(this.ChannelBankMapForm);
      this.visible=false;
      this.toast.warning({ detail: "WARNING", summary:"Please Fill All Required Fields.!", duration: 4000 });
    }
  }
}
