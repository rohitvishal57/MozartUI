import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AdminService } from 'src/app/services/admin.service';
import ValidateForm from 'src/app/validation/validateForm';

@Component({
  selector: 'app-add-agency',
  templateUrl: './add-agency.component.html',
  styleUrls: ['./add-agency.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class AddAgencyComponent {

  AgentForm: any;
  isAgencyDetails: boolean = true;
  selectedOption: any;
  AgencyInsuranceMapForm: any;
  allAgencyInsuranceMapData:any[]=[]
  allAgency:any[]=[]
  allChannel:any[]=[]
  allInsuranceType:any[]=[]
  allAgencyInsuranceProductMapData:any[]=[]
  allProduct: any[] = []

  productOptions: any[] = []

  agencyOptions:any[]=[]  
  channelOptions:any[]=[]
  insuranceTypeOptions:any[]=[]
  constructor(private fb: FormBuilder, private adminService: AdminService,
    private toast: NgToastService, private router: Router, private messageService: MessageService) { }

  ngOnInit() {
    // this.getAllInsuranceType();
    // this.getAllChannel();
    // this.getAllBank();
    // this.getAllBankInsuranceMapDetails();
    // this.selectedOption = 'option1';
    this.isAgencyDetails = history.state.isAgencyDetails;
    this.selectedOption = 'option1';
    this.getAllProduct();
    this.initializeForm();
    this.getAllAgencyInsuranceMapDetails();
    this.getAllAgencyInsuranceProductMapDetails();
    this.getAllChannel();
    this.getAllAgency();
    this.getAllInsuranceType();
    console.log(this.isAgencyDetails);
    console.log(this.agencyOptions,this.channelOptions,this.insuranceTypeOptions);
    console.log(this.allAgencyInsuranceMapData,this.allAgency,this.allChannel,this.allInsuranceType);
    // this.onselectAgency(101);
  }

  initializeForm() {
   this.AgentForm=this.fb.group({
      agencyCode:['',{ validators: [Validators.required, this.validateAgencyCode.bind(this)], updateOn: 'blur' }],
      agencyName:['',Validators.required],
      status:[true,Validators.required]
    });
    this.AgencyInsuranceMapForm=this.fb.group({
      // verticalCode:['',Validators.required],
      agencyCode:[this.AgentForm.get('agencyCode').value, Validators.required],
      // insuranceTypeCode:['',Validators.required],
      productId: ['', Validators.required],
      status:[true,Validators.required]
    });
    this.AgentForm.get('agencyCode').valueChanges.subscribe((value: any) => {
      this.AgencyInsuranceMapForm.patchValue({
        agencyCode: value
      });
    });
  }
  async getAllAgencyInsuranceProductMapDetails() {
    return await this.adminService.getAllAgencyChannelInsuranceProductMap().subscribe({
      next: (res) => {
        this.allAgencyInsuranceProductMapData = res;
        console.log(this.allAgencyInsuranceProductMapData);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
  async getAllAgencyInsuranceMapDetails() {
    return await this.adminService.getAgencyChannelInsuranceMap().subscribe({
      next: (res) => {
        this.allAgencyInsuranceMapData = res;
        
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
  async getAllAgency(){
    await this.adminService.getAllAgencyDetails()
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
  async getAllChannel(){ 
    await this.adminService.getAllChannelList()
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
  async getAllInsuranceType(){
    await this.adminService.getAllInsuranceTypeList()
      .subscribe({  
        next: (res)=>{
          this.allInsuranceType=res.filter((insurance:any)=>insurance.status==true);
          this.insuranceTypeOptions = this.allInsuranceType;
          // this.onselectAgency(101);
        },
        error: (err => {
          console.error(err); 
        })
      })
  }
  async getAllProduct() {
    await this.adminService.getAllProductList()
      .subscribe({
        next: (res) => {
          this.allProduct = res.filter((product: any) => product.status == true);
          console.log(this.allProduct);

        },
        error: (err => {
          console.error(err);
        })
      })
  }

  validateAgencyCode(control: any) {
    const agencyCode = control.value;
    const isValid = this.agencyOptions.some(option => option.agencyCode === agencyCode);
    return isValid ? { invalidAgencyCode: true } : null;
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
          // this.AgentForm.reset();
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
    this.mappingChannel();
  }
  mappingChannel(){
    console.log(this.AgencyInsuranceMapForm.value);
    console.log(this.AgentForm.value);
    
    if (this.AgencyInsuranceMapForm.valid) {
      this.adminService.InsertAgencyChannelInsuranceMap(this.AgencyInsuranceMapForm.value).subscribe({
        next: (res)=>{
          console.log(res);
          
          this.toast.success({ detail: "SUCCESS", summary: "Map Added Successfully.", duration: 4000 })
          this.getAllAgencyInsuranceMapDetails();
          this.initializeForm();
        },
        error: (err => {
          this.toast.warning({ detail: "WARNING", summary:"Map Already Exist.!", duration: 4000 });
        })
      });
      this.adminService.insertAgencyChannelInsuranceProductMap(this.AgencyInsuranceMapForm.value).subscribe({
        next: (res) => {
          this.toast.success({ detail: "SUCCESS", summary: "Mapping Added Successfully.", duration: 4000 })
          // this.AgencyInsuranceMapForm.reset();
          // this.BankForm.reset();
          console.log(res);
          
          this.getAllAgencyInsuranceProductMapDetails();
          this.initializeForm();
        },
        error: (err => {
          this.toast.warning({ detail: "WARNING", summary: "Mapping Already Exists!", duration: 4000 });
        })
      });
      
      
    }
    else {
      ValidateForm.validateAllFormFields(this.AgencyInsuranceMapForm);
      this.toast.warning({ detail: "WARNING", summary: "Please Fill All Required Fields.!", duration: 4000 });
    }
    this.isAgencyDetails = false;
  }

  onselectAgency(event:any){
    console.log(event.target.value);
    
    // const excludedInsuranceTypeCodes = this.allAgencyInsuranceMapData
    // .filter(map => {
    //   const verticalCodeMatch = map.verticalCode == this.AgencyInsuranceMapForm.get('verticalCode')?.value;
    //   const bankCodeMatch = map.bankCode == this.AgencyInsuranceMapForm.get('agencyCode')?.value;
    //   return verticalCodeMatch && bankCodeMatch;
    // })
    // .map(filteredMap => filteredMap.insuranceTypeCode);
    // console.log(excludedInsuranceTypeCodes);
    // const filteredInsurance =this.allInsuranceType.filter(insurance => {
    //   return !excludedInsuranceTypeCodes.includes(insurance.insuranceTypeCode);
    // });
    // this.insuranceTypeOptions=filteredInsurance;
    console.log(this.allAgencyInsuranceMapData,this.allAgency,this.allChannel,this.allInsuranceType);
    console.log(this.allAgencyInsuranceProductMapData,this.allProduct);
 
    // const excludedProduct = this.allAgencyInsuranceProductMapData
    //   .filter(map => {
    //     const verticalCodeMatch = map.verticalCode == this.AgencyInsuranceMapForm.get('verticalCode')?.value;
    //     const bankCodeMatch = map.bankCode == this.AgencyInsuranceMapForm.get('agencyCode')?.value;
    //     const insuranceTypeCodeMatch = map.insuranceTypeCode == this.AgencyInsuranceMapForm.get('insuranceTypeCode')?.value;
    //     return verticalCodeMatch && bankCodeMatch && insuranceTypeCodeMatch;
    //   })
    //   .map(filteredMap => filteredMap.productId);
    //   console.log(excludedProduct);
    // let filteredProduct = this.allProduct.filter(product => {
    //   const insuranceTypeName = this.allInsuranceType.filter(insurance => insurance.insuranceTypeCode == event)[0].insuranceType;
    //   return !excludedProduct.includes(product.productId) && product.insuranceType == insuranceTypeName;
    // });
    let agencyCode = event.target.value;
    let mappedProductIds = new Set(this.allAgencyInsuranceProductMapData.filter(product => product.agencyCode == agencyCode)
    .map(product => product.productId));

// Filter allproducts to include only those not in agencymappedproducts
  let filteredProducts = this.allProduct.filter(product => !mappedProductIds.has(product.productId));
    this.productOptions = filteredProducts;
    console.log(this.productOptions,filteredProducts,mappedProductIds);
  }
  

  selectType(option: any) {
    this.selectedOption = option;
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
  getProductName(id: any) {
    let data = this.allProduct.find(product => product.productId == id);
    return data;
  }
  clickedit(data: any) {
    console.log(data.bankCode, data.verticalCode, data.insuranceTypeCode, data.productId);
    this.router.navigate(['/portal/finaladminDashboard/editForm'],
      {
        state: {
          bankCode: data.agencyCode,
          verticalCode: data.verticalCode,
          insuranceTypeCode: data.insuranceTypeCode,
          productId: data.productId
        }
      });
  }

}
