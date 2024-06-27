import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';
import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';
import { AdminService } from 'src/app/services/admin.service';
import ValidateForm from 'src/app/validation/validateForm';

@Component({
  selector: 'app-agency-insurance-map',
  templateUrl: './agency-insurance-map.component.html',
  styleUrls: ['../../bank-controller/add-bank/add-bank.component.scss','../../bank-controller/add-bank/table.scss'],
  providers: [MessageService, ConfirmationService]
})
export class AgencyInsuranceMapComponent {

  visible: boolean = false;
  AgencyInsuranceMapForm:any;
  allAgencyInsuranceMapData:any[]=[]
  allAgency:any[]=[]
  allChannel:any[]=[]
  allInsuranceType:any[]=[]

  agencyOptions:any[]=[]  
  channelOptions:any[]=[]
  insuranceTypeOptions:any[]=[]

  constructor(private adminService:AdminService,private toast:NgToastService,private fb: FormBuilder,
    private confirmationService: ConfirmationService, private messageService: MessageService){}
  ngOnInit(){
    this.AgencyInsuranceMapForm=this.fb.group({
      verticalCode:['',Validators.required],
      agencyCode:['',Validators.required],
      insuranceTypeCode:['',Validators.required],
      status:[true,Validators.required]
    });
    this.getAllAgencyInsuranceMapDetails();
    this.getAllChannel();
    this.getAllAgency();
    this.getAllInsuranceType();
  }
  getAllAgencyInsuranceMapDetails() {
    return this.adminService.getAgencyChannelInsuranceMap().subscribe({
      next: (res) => {
        this.allAgencyInsuranceMapData = res;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
  getAllAgency(){
    this.adminService.getAllAgencyDetails()
      .subscribe({  
        next: (res)=>{
          this.allAgency=res.filter((agency:any)=>agency.status==true);
          this.agencyOptions=this.allAgency;
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
  getAgencyName(id:any){
    let data=this.allAgency.find(agency => agency.agencyCode==id);
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
  onselectAgency(event:any){
    const excludedInsuranceTypeCodes = this.allAgencyInsuranceMapData
    .filter(map => {
      const verticalCodeMatch = map.verticalCode == this.AgencyInsuranceMapForm.get('verticalCode')?.value;
      const bankCodeMatch = map.bankCode == this.AgencyInsuranceMapForm.get('bankCode')?.value;
      return verticalCodeMatch && bankCodeMatch;
    })
    .map(filteredMap => filteredMap.insuranceTypeCode);

    const filteredInsurance =this.allInsuranceType.filter(insurance => {
      return !excludedInsuranceTypeCodes.includes(insurance.insuranceTypeCode);
    });
    this.insuranceTypeOptions=filteredInsurance;
  }
  onSubmit(){
    if(this.AgencyInsuranceMapForm.valid){
      this.adminService.insertBancaChannelInsuranceMap(this.AgencyInsuranceMapForm.value).subscribe({
        next: (res)=>{
          this.toast.success({ detail: "SUCCESS", summary: "Map Added Successfully.", duration: 4000 })
          this.AgencyInsuranceMapForm.reset();
          this.getAllAgencyInsuranceMapDetails();
        },
        error: (err => {
          this.toast.warning({ detail: "WARNING", summary:"Map Already Exist.!", duration: 4000 });
        })
      });      
    }
    else{
      ValidateForm.validateAllFormFields(this.AgencyInsuranceMapForm);
      this.toast.warning({ detail: "WARNING", summary:"Please Fill All Required Fields.!", duration: 4000 });
    }
  }
  showDialog(data:any) {
    this.visible = true;
    this.AgencyInsuranceMapForm.get('verticalCode')?.setValue(data.verticalCode);
    this.AgencyInsuranceMapForm.get('agencyCode')?.setValue(data.agencyCode);
    this.AgencyInsuranceMapForm.get('insuranceTypeCode')?.setValue(data.insuranceTypeCode);
    this.AgencyInsuranceMapForm.get('status')?.setValue(data.status);
  }
  onUpdate(){
    if(this.AgencyInsuranceMapForm.valid){
      this.confirmationService.confirm({
        message: 'Are you sure that you want to update?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.adminService.deleteBancaChannelInsuranceMap(this.AgencyInsuranceMapForm.value).subscribe({
            next: (res)=>{
              this.toast.success({ detail: "SUCCESS", summary: "Map Updated Successfully.", duration: 4000 })
              this.AgencyInsuranceMapForm.reset();
              this.getAllAgencyInsuranceMapDetails();
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
      ValidateForm.validateAllFormFields(this.AgencyInsuranceMapForm);
      this.visible=false;
      this.toast.warning({ detail: "WARNING", summary:"Please Fill All Required Fields.!", duration: 4000 });
    }
  }

}
