import { Component } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { NgToastService } from 'ng-angular-popup';
import {FormBuilder,Validators} from '@angular/forms';
import ValidateForm from 'src/app/validation/validateForm';
import { ConfirmationService, MessageService, ConfirmEventType } from 'primeng/api';

@Component({
  selector: 'app-channel-insurance-product',
  templateUrl: './channel-insurance-product.component.html',
  styleUrls: ['../../bank-controller/add-bank/add-bank.component.scss','../../bank-controller/add-bank/table.scss'],
  providers: [MessageService, ConfirmationService]
})
export class ChannelInsuranceProductComponent {
  visible: boolean = false;
  ChannelBankProductMapForm:any;
  allBankInsuranceProductMapData:any[]=[]
  allBank:any[]=[]
  allChannel:any[]=[]
  allInsuranceType:any[]=[]
  allProduct:any[]=[]

  bankOptions:any[]=[]  
  channelOptions:any[]=[]
  insuranceTypeOptions:any[]=[]
  productOptions:any[]=[]

  constructor(private adminService:AdminService,private toast:NgToastService,private fb: FormBuilder,
    private confirmationService: ConfirmationService, private messageService: MessageService){}
  
    ngOnInit(){
      this.getAllBankInsuranceProductMapDetails();
      this.getAllBank();
      this.getAllChannel();
      this.getAllInsuranceType();
      this.getAllProduct();
      this.initializeForm();
  }
  initializeForm(){
    this.ChannelBankProductMapForm=this.fb.group({
      verticalCode:['',Validators.required],
      bankCode:['',Validators.required],
      insuranceTypeCode:['',Validators.required],
      productId:['',Validators.required],
      status:[true,Validators.required]
    });
  }
  getAllBankInsuranceProductMapDetails() {
    return this.adminService.getAllProductMap().subscribe({
      next: (res) => {
        this.allBankInsuranceProductMapData = res;
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
  getProductName(id:any){
    let data=this.allProduct.find(product => product.productId==id);
    return data;
  }
  onselectInsuranceType(event:any){
    const excludedProduct = this.allBankInsuranceProductMapData
    .filter(map => {
      const verticalCodeMatch = map.verticalCode == this.ChannelBankProductMapForm.get('verticalCode')?.value;
      const bankCodeMatch = map.bankCode == this.ChannelBankProductMapForm.get('bankCode')?.value;
      const insuranceTypeCodeMatch = map.insuranceTypeCode == this.ChannelBankProductMapForm.get('insuranceTypeCode')?.value;
      return verticalCodeMatch && bankCodeMatch && insuranceTypeCodeMatch;
    })
    .map(filteredMap => filteredMap.productId);

    let filteredProduct =this.allProduct.filter(product => {
      const insuranceTypeName=this.allInsuranceType.filter(insurance => insurance.insuranceTypeCode==event)[0].insuranceType;
      return !excludedProduct.includes(product.productId) && product.insuranceType==insuranceTypeName;
    });
    this.productOptions=filteredProduct;
  }
  onSubmit(){
    if(this.ChannelBankProductMapForm.valid){
      this.adminService.insertBancaChannelInsuranceProductMap(this.ChannelBankProductMapForm.value).subscribe({
        next: (res)=>{
          this.toast.success({ detail: "SUCCESS", summary: "Mapping Added Successfully.", duration: 4000 })
          this.getAllBankInsuranceProductMapDetails();
          this.initializeForm();
        },
        error: (err => {
          this.toast.warning({ detail: "WARNING", summary:"Mapping Already Exists!", duration: 4000 });
        })
      });
    }
    else{
      ValidateForm.validateAllFormFields(this.ChannelBankProductMapForm);
      this.toast.warning({ detail: "WARNING", summary:"Please Fill All Required Fields.!", duration: 4000 });
    }
  }
  showDialog(data:any) {
    this.visible = true;
    this.ChannelBankProductMapForm.get('verticalCode')?.setValue(data.verticalCode);
    this.ChannelBankProductMapForm.get('bankCode')?.setValue(data.bankCode);
    this.ChannelBankProductMapForm.get('insuranceTypeCode')?.setValue(data.insuranceTypeCode);
    this.ChannelBankProductMapForm.get('productId')?.setValue(data.productId);
    this.ChannelBankProductMapForm.get('status')?.setValue(data.status);
  }
  onUpdate(){
    if(this.ChannelBankProductMapForm.valid){
      this.confirmationService.confirm({
        message: 'Are you sure that you want to update?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.adminService.deleteBancaChannelInsuranceProductMap(this.ChannelBankProductMapForm.value).subscribe({
            next: (res)=>{
              this.toast.success({ detail: "SUCCESS", summary: "Mapping Updated Successfully.", duration: 4000 })
              this.getAllBankInsuranceProductMapDetails();
              this.initializeForm();
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
      ValidateForm.validateAllFormFields(this.ChannelBankProductMapForm);
      this.visible=false;
      this.toast.warning({ detail: "WARNING", summary:"Please Fill All Required Fields.!", duration: 4000 });
    }
  }
}
