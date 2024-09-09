import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';
import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';
import { AdminService } from 'src/app/services/admin.service';
import ValidateForm from 'src/app/validation/validateForm';

@Component({
  selector: 'app-agency-insurance-product-map',
  templateUrl: './agency-insurance-product-map.component.html',
  styleUrls: ['../../bank-controller/add-bank/add-bank.component.scss','../../bank-controller/add-bank/table.scss'],
  providers: [MessageService, ConfirmationService]
})
export class AgencyInsuranceProductMapComponent {

  visible: boolean = false;
  ChannelAgencyProductMapForm:any;
  allAgencyInsuranceProductMapData:any[]=[]
  allAgency:any[]=[]
  allChannel:any[]=[]
  allInsuranceType:any[]=[]
  allProduct:any[]=[]

  agencyOptions:any[]=[]  
  channelOptions:any[]=[]
  insuranceTypeOptions:any[]=[]
  productOptions:any[]=[]

  constructor(private adminService:AdminService,private toast:NgToastService,private fb: FormBuilder,
    private confirmationService: ConfirmationService, private messageService: MessageService){}
  
    ngOnInit(){
      this.ChannelAgencyProductMapForm=this.fb.group({
        verticalCode:['',Validators.required],
        agencyCode:['',Validators.required],
        insuranceTypeCode:['',Validators.required],
        productId:['',Validators.required],
        status:[true,Validators.required]
      });
      this.getAllAgencyInsuranceProductMapDetails();
      this.getAllAgency();
      this.getAllChannel();
      this.getAllInsuranceType();
      this.getAllProduct();
  }
  getAllAgencyInsuranceProductMapDetails() {
    return this.adminService.getAllAgencyChannelInsuranceProductMap().subscribe({
      next: (res) => {
        this.allAgencyInsuranceProductMapData = res;
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
          this.allAgency=res.filter((agent:any)=>agent.status==true);
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
          this.insuranceTypeOptions=this.allInsuranceType;
        },
        error: (err =>{
          console.error(err); 
        })
      })
  }
  getAllProduct(){
    this.adminService.getAllProductList()
      .subscribe({  
        next: (res)=>{
          this.allProduct=res.filter((product:any)=>product.status==true);
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
  getProductName(id:any){
    let data=this.allProduct.find(product => product.productId==id);
    return data;
  }
  onselectInsuranceType(event:any){
    const excludedProduct = this.allAgencyInsuranceProductMapData
    .filter(map => {
      const verticalCodeMatch = map.verticalCode == this.ChannelAgencyProductMapForm.get('verticalCode')?.value;
      const agencyCodeMatch = map.agencyCode == this.ChannelAgencyProductMapForm.get('agencyCode')?.value;
      const insuranceTypeCodeMatch = map.insuranceTypeCode == this.ChannelAgencyProductMapForm.get('insuranceTypeCode')?.value;
      return verticalCodeMatch && agencyCodeMatch && insuranceTypeCodeMatch;
    })
    .map(filteredMap => filteredMap.productId);

    let filteredProduct =this.allProduct.filter(product => {
      const insuranceTypeName=this.allInsuranceType.filter(insurance => insurance.insuranceTypeCode==event)[0].insuranceType;
      return !excludedProduct.includes(product.productId) && product.insuranceType==insuranceTypeName;
    });
    this.productOptions=filteredProduct;
  }
  onSubmit(){
    if(this.ChannelAgencyProductMapForm.valid){
      this.adminService.insertAgencyChannelInsuranceProductMap(this.ChannelAgencyProductMapForm.value).subscribe({
        next: (res)=>{
          this.toast.success({ detail: "SUCCESS", summary: "Mapping Added Successfully.", duration: 4000 })
          this.ChannelAgencyProductMapForm.reset();
          this.getAllAgencyInsuranceProductMapDetails();
        },
        error: (err => {
          this.toast.warning({ detail: "WARNING", summary:"Mapping Already Exists!", duration: 4000 });
        })
      });
    }
    else{
      ValidateForm.validateAllFormFields(this.ChannelAgencyProductMapForm);
      this.toast.warning({ detail: "WARNING", summary:"Please Fill All Required Fields.!", duration: 4000 });
    }
  }
  showDialog(data:any) {
    this.visible = true;
    this.ChannelAgencyProductMapForm.get('verticalCode')?.setValue(data.verticalCode);
    this.ChannelAgencyProductMapForm.get('agencyCode')?.setValue(data.bankCode);
    this.ChannelAgencyProductMapForm.get('insuranceTypeCode')?.setValue(data.insuranceTypeCode);
    this.ChannelAgencyProductMapForm.get('productId')?.setValue(data.productId);
    this.ChannelAgencyProductMapForm.get('status')?.setValue(data.status);
  }
  onUpdate(){
    if(this.ChannelAgencyProductMapForm.valid){
      this.confirmationService.confirm({
        message: 'Are you sure that you want to update?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.adminService.deleteBancaChannelInsuranceProductMap(this.ChannelAgencyProductMapForm.value).subscribe({
            next: (res)=>{
              this.toast.success({ detail: "SUCCESS", summary: "Mapping Updated Successfully.", duration: 4000 })
              this.ChannelAgencyProductMapForm.reset();
              this.getAllAgencyInsuranceProductMapDetails();
              this.visible=false;
            },
            error: (err => {
              this.toast.warning({ detail: "WARNING", summary:"Mapping Does not Exists!", duration: 4000 });
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
      ValidateForm.validateAllFormFields(this.ChannelAgencyProductMapForm);
      this.visible=false;
      this.toast.warning({ detail: "WARNING", summary:"Please Fill All Required Fields.!", duration: 4000 });
    }
  }

}
