import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';
import { AdminService } from 'src/app/services/admin.service';
import ValidateForm from 'src/app/validation/validateForm';

@Component({
  selector: 'app-finaladmin-tables',
  templateUrl: './finaladmin-tables.component.html',
  styleUrls: ['./finaladmin-tables.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class FinaladminTablesComponent implements OnInit{
  @ViewChild('topContainer') topContainer!: ElementRef;

  allChannel: any[] = []
  selectedTab: string = 'Partner';

  dropdownVisible: boolean = false;
  selectedOption: any;

  // visible: boolean = false;
  // visible1: boolean = false;
  // visible2: boolean = false;
  visible3: boolean = false;
  // visible4: boolean = false;
  visible5: boolean = false;
  // visible6: boolean = false;
  visible7: boolean = false;
  visible8: boolean = false;
  visible9: boolean = false;
  ChannelForm:any;
  BankForm:any;
  InsuranceForm:any;
  ProductForm:any;
  ChannelBankProductMapForm:any;
  UserDetailsForm:any;
  AgencyDetailsForm:any;
  AgentsDetailsForm:any;
  AgencyInsuranceProductMapForm:any;

  dropdownOptions: any[] = [
    // { name: 'Channel' },
    // { name: 'Bank' },
    // { name: 'Insurance Type' },
    { name: 'Add Partner' },
    { name: 'Add Product' },
    // { name: 'User' },
    // { name: 'Add Agents' },
    // { name: 'Add Form'},
    { name: 'Configure Journey'}
  ];
  allBank: any[] = []
  allInsuranceType: any[] = [];
  allProduct: any[] = [];
  allBankInsuranceMapData: any[] = [];
  allBankInsuranceProductMapData: any[] = [];
  allUserDetails: any[] = [];
  allAgency:any[]=[];
  allAgentDetails:any[]=[];
  allAgencyInsuranceProductMapData:any[]=[];

  constructor(private fb: FormBuilder, private toast: NgToastService,
    private router: Router, private adminService: AdminService,private datePipe: DatePipe,
    private confirmationService: ConfirmationService, private messageService: MessageService
  ) { }
  ngOnInit() {
    this.getAllChannel()
    this.getAllBank();
    this.getAllInsuranceType()
    this.getAllProduct();
    this.getAllBankInsuranceMapDetails();
    this.getAllBankInsuranceProductMapDetails();
    this.getAllUserDetails();
    this.getAllAgency();
    this.getAllAgentDetails();
    this.getAllAgencyInsuranceProductMapDetails();
    this.initializeForm();
  }

  initializeForm(){
    this.ChannelForm=this.fb.group({
      verticalCode:['',Validators.required],
      channelName:['',Validators.required],
      channelStatus:[true,Validators.required]
    });
    this.BankForm=this.fb.group({
      bankCode:['',Validators.required],
      bankName:['',Validators.required],
      status:[true,Validators.required],
      userId:[true,Validators.required],
      Otp:[true,Validators.required]
    });
    this.InsuranceForm=this.fb.group({
      insuranceTypeCode:['',Validators.required],
      insuranceType:['',Validators.required],
      status:[true,Validators.required]
    });
    this.ProductForm=this.fb.group({
      productId:['',Validators.required],
      productName:['',Validators.required],
      insuranceType:[''],
      productStartDate:['',Validators.required],
      productEndDate:['',Validators.required],
      productFamily:[''],
      familyPlan:['',Validators.required],
      status:[true,Validators.required],
      productdescription:['',Validators.required]
    });
    this.ChannelBankProductMapForm=this.fb.group({
      verticalCode:['',Validators.required],
      bankCode:['',Validators.required],
      insuranceTypeCode:['',Validators.required],
      productId:['',Validators.required],
      status:[true,Validators.required]
    });
    this.UserDetailsForm=this.fb.group({
      bancaUserName:['',Validators.required],
      bancaMobileNum:['',Validators.required],
      bankCode:['',Validators.required],
      rmid:['',Validators.required],
      bancaUserStatus:[true,Validators.required]
    });
    this.AgencyDetailsForm=this.fb.group({
      agencyName:['',Validators.required],
      agencyCode:['',Validators.required],
      status:[true,Validators.required],
      loginConfiguration:["string"]
    });
    this.AgentsDetailsForm=this.fb.group({
      agentUserName:['',Validators.required],
      agentMobileNum:['',Validators.required],
      agencyCode:['', Validators.required],
      agentUserStatus:[true,Validators.required],
      agentCode:['',Validators.required],
      agentUserDetailsSeq:['',Validators.required]
    });
    this.AgencyInsuranceProductMapForm = this.fb.group({
      agencyCode: ['',Validators.required],
      verticalCode: ['',Validators.required],
      insuranceTypeCode: ['',Validators.required],
      productId: ['',Validators.required],
      status: [true,Validators.required]
    })
  }
  selectTab(tabName: string) {
    this.selectedTab = tabName;
  }

  scrollLeft() {
    console.log('jadhav');
    this.topContainer.nativeElement.scrollLeft -= 100; // Adjust the scroll distance as needed
  }

  scrollRight() {
    console.log('pratik');
    this.topContainer.nativeElement.scrollLeft += 100; // Adjust the scroll distance as needed
  }
  getAllAgency(){
    this.adminService.getAllAgencyDetails().subscribe({  
      next: (res)=>{
        this.allAgency=res;
        console.log(this.allAgency);
        
      },
      error: (err => {
        console.error(err); 
      })
    })
  }

  getName(id:any){
    let data=this.allAgency.find(agency => agency.agencyCode === id);
    // console.log(data);
    return data;
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

  getAllChannel() {
    this.adminService.getAllChannelList()
      .subscribe({
        next: (res) => {
          this.allChannel = res;
        },
        error: (err => {
          console.error(err);
        })
      })
  }
  toggleDropdown() {
    this.dropdownVisible = !this.dropdownVisible;
  }
  getAllBank() {
    this.adminService.getAllBankList()
      .subscribe({
        next: (res) => {
          this.allBank = res;
        },
        error: (err => {
          console.error(err);
        })
      })
  }
  getAllInsuranceType() {
    this.adminService.getAllInsuranceTypeList()
      .subscribe({
        next: (res) => {
          this.allInsuranceType = res;
        },
        error: (err => {
          console.error(err);
        })
      })
  }
  getAllProduct() {
    return this.adminService.getAllProductList().subscribe({
      next: (res) => {
        this.allProduct = res;
      },
      error: (err => {
        console.error(err);
      })
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
  getBankName(id: any) {
    let data = this.allBank.find(bank => bank.bankCode == id);
    return data;
  }
  getChannelName(id: any) {
    let data = this.allChannel.find(channel => channel.verticalCode == id);
    return data;
  }
  getInsuranceTypeName(id: any) {
    let data = this.allInsuranceType.find(insurance => insurance.insuranceTypeCode == id);
    return data;
  }
  getProductName(id: any) {
    let data = this.allProduct.find(product => product.productId == id);
    return data;
  }
  getAgencyName(id: any) {
    let data = this.allAgencyInsuranceProductMapData.find(agency => agency.agencyCode == id); 
    return data;
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
  getAllAgencyInsuranceProductMapDetails() {
      return this.adminService.getAllAgencyChannelInsuranceProductMap().subscribe({
        next: (res) => {
          this.allAgencyInsuranceProductMapData = res;
          console.log(this.allAgencyInsuranceProductMapData);
        },
        error: (err) => {
          console.error(err);
        },
      });
  }
  getAllUserDetails() {
    return this.adminService.getAllUserDetailsList().subscribe({
      next: (res) => {
        this.allUserDetails = res;
      },
      error: (err => {
        console.error(err);
      })
    })
  }
  selectitem(option: any) {
    if (option != null) {
      console.log(option);
      if (option.name == 'Channel') {
        console.log(option);
        this.router.navigate(['portal/finaladminDashboard/addChannnel'])
      }
      else if (option.name == 'Bank') {
        console.log(option);
        this.router.navigate(['portal/finaladminDashboard/addBank'],{
          state: { isBankDetails: true }
        })
      }
      else if (option.name == 'Insurance Type') {
        console.log(option);
        this.router.navigate(['portal/finaladminDashboard/addInsuranceType'])
      }
      else if (option.name == 'Add Product') {
        console.log(option);
        this.router.navigate(['portal/finaladminDashboard/addProduct'])
      }
      else if (option.name == 'User') {
        console.log(option);
        this.router.navigate(['portal/finaladminDashboard/addUser'])
      }
      else if (option.name == 'Add Form') {
        console.log(option);
        this.router.navigate(['portal/finaladminDashboard/addBank'],{
          state: { isBankDetails: false }
        });
      }
      else if (option.name == 'Add Agents') {
        console.log(option);
        this.router.navigate(['portal/finaladminDashboard/addAgent'])
      }
      else if (option.name == 'Add Partner') {
        console.log(option);
        this.router.navigate(['portal/finaladminDashboard/addAgency'],{
          state: { isAgencyDetails: true }
        });
      }
      else if (option.name == 'Configure Journey') {
        console.log(option);
        this.router.navigate(['portal/finaladminDashboard/addAgency'],{
          state: { isAgencyDetails: false }
        });
      }
    }
  }
  showDialog(data:any,table:any) {
    console.log(data,table);
    // if(table == 'Channels'){
    //   this.visible = true;
    //   this.ChannelForm.get('verticalCode')?.setValue(data.verticalCode);
    //   this.ChannelForm.get('channelName')?.setValue(data.channelName);
    //   this.ChannelForm.get('channelStatus')?.setValue(data.channelStatus);
    // }
    // if(table == 'Banks'){
    //   this.visible1 = true;
    //   var loginConfiguration = JSON.parse(data.loginConfiguration);  
    //   this.BankForm.get('bankCode')?.setValue(data.bankCode);
    //   this.BankForm.get('bankName')?.setValue(data.bankName);
    //   this.BankForm.get('status')?.setValue(data.status);
    //   this.BankForm.get('userId')?.setValue(loginConfiguration['USERID']);
    //   this.BankForm.get('Otp')?.setValue(loginConfiguration['OTP']);
    // }
    // if(table == 'Insurance Type'){
    //   this.visible2 = true;
    //   this.InsuranceForm.get('insuranceTypeCode')?.setValue(data.insuranceTypeCode);
    //   this.InsuranceForm.get('insuranceType')?.setValue(data.insuranceType);
    //   this.InsuranceForm.get('status')?.setValue(data.status);
    // }
    if(table == 'Products'){
      this.visible3 = true;
      this.ProductForm.get('productId')?.setValue(data.productId);
      this.ProductForm.get('productName')?.setValue(data.productName);  
      this.ProductForm.get('insuranceType')?.setValue(data.insuranceType);
      this.ProductForm.get('productStartDate')?.setValue(this.datePipe.transform(data.productStartDate,'yyyy-MM-dd'));
      this.ProductForm.get('productEndDate')?.setValue(this.datePipe.transform(data.productEndDate,'yyyy-MM-dd'));
      this.ProductForm.get('productFamily')?.setValue(data.productFamily);
      this.ProductForm.get('familyPlan')?.setValue(data.familyPlan);
      this.ProductForm.get('status')?.setValue(data.status);
      this.ProductForm.get('productdescription')?.setValue(data.productDescription);
    }
    if(table == 'Products Map'){
      this.visible5 = true;
      this.ChannelBankProductMapForm.get('verticalCode')?.setValue(data.verticalCode);
      this.ChannelBankProductMapForm.get('bankCode')?.setValue(data.bankCode);
      this.ChannelBankProductMapForm.get('insuranceTypeCode')?.setValue(data.insuranceTypeCode);
      this.ChannelBankProductMapForm.get('productId')?.setValue(data.productId);
      this.ChannelBankProductMapForm.get('status')?.setValue(data.status);
    }
    if(table == 'Partner Product Map'){
      this.visible9 = true;
      this.AgencyInsuranceProductMapForm.get('agencyCode')?.setValue(data.agencyCode);
      this.AgencyInsuranceProductMapForm.get('verticalCode')?.setValue(data.verticalCode);
      this.AgencyInsuranceProductMapForm.get('insuranceTypeCode')?.setValue(data.insuranceTypeCode);
      this.AgencyInsuranceProductMapForm.get('productId')?.setValue(data.productId);
      this.AgencyInsuranceProductMapForm.get('status')?.setValue(data.status);
    }
    // if(table == 'Users'){
    //   this.visible6 = true;
    //   this.UserDetailsForm.addControl('bancaUserDetailsSeq',this.fb.control(data.bancaUserDetailsSeq));
    //   this.UserDetailsForm.get('bancaUserName')?.setValue(data.bancaUserName);
    //   this.UserDetailsForm.get('bancaMobileNum')?.setValue(data.bancaMobileNum);
    //   this.UserDetailsForm.get('bankCode')?.setValue(data.bankCode);
    //   this.UserDetailsForm.get('rmid')?.setValue(data.rmid);
    //   this.UserDetailsForm.get('bancaUserStatus')?.setValue(data.bancaUserStatus);
    // }
    if(table == 'Partner'){
      this.visible7 = true;
      this.AgencyDetailsForm.get('agencyName')?.setValue(data.agencyName);
      this.AgencyDetailsForm.get('agencyCode')?.setValue(data.agencyCode);
      this.AgencyDetailsForm.get('status')?.setValue(data.status);
    }
    if(table == 'Agents'){
      this.visible8 = true;
      this.AgentsDetailsForm.get('agentUserDetailsSeq')?.setValue(data.agentUserDetailsSeq);
      this.AgentsDetailsForm.get('agentUserName')?.setValue(data.agentUserName);
      this.AgentsDetailsForm.get('agentMobileNum')?.setValue(data.agentMobileNum);
      this.AgentsDetailsForm.get('agencyCode')?.setValue(data.agencyCode);
      this.AgentsDetailsForm.get('agentUserStatus')?.setValue(data.agentUserStatus);
      this.AgentsDetailsForm.get('agentCode')?.setValue(data.agentCode);
    }
  }
  
  onUpdate(form:any){
    // if(form == this.ChannelForm){
    //   if(this.ChannelForm.valid){
    //     this.adminService.updateChannel(this.ChannelForm.value)
    //     .subscribe({  
    //       next: (res)=>{
    //         this.toast.success({ detail: "SUCCESS", summary: "Channel Updated Successfully.", duration: 4000 })
    //         this.initializeForm();
    //         this.getAllChannel();
    //       },
    //       error: (err => {
    //         this.toast.warning({ detail: "WARNING", summary:"Channel Already Updated.!", duration: 4000 });
    //       })
    //     })
    //     this.visible=false;
    //   }
    //   else{
    //     ValidateForm.validateAllFormFields(this.ChannelForm);
    //     this.toast.warning({ detail: "WARNING", summary:"Please Fill All Required Fields.!", duration: 4000 });
    //   }
    // }

    // if(form == this.BankForm){
    //   if(this.BankForm.valid){
    //     const bankConfiguration={
    //       loginConfiguration: JSON.stringify({
    //           "OTP": this.BankForm.value.Otp,
    //           "USERID": this.BankForm.value.userId
    //       })
    //     };
    //     const updatedBankConfiguration = {
    //       ...this.BankForm.value,...bankConfiguration
    //     };
    //     this.adminService.updateBank(updatedBankConfiguration).subscribe({
    //       next: (res)=>{
    //         this.toast.success({ detail: "SUCCESS", summary: "Bank Updated Successfully.", duration: 4000 })
    //         this.initializeForm();
    //         this.getAllBank();
    //       },
    //       error: (err => {
    //         this.toast.warning({ detail: "WARNING", summary:"Bank Already Added.!", duration: 4000 });
    //       })
    //     });
    //     this.visible1=false;
    //   }
    //   else{
    //     ValidateForm.validateAllFormFields(this.BankForm);
    //     this.toast.warning({ detail: "WARNING", summary:"Please Fill All Required Fields.!", duration: 4000 });
    //   }
    // }

    // if(form == this.InsuranceForm){
    //   if(this.InsuranceForm.valid){
    //     this.adminService.updateInsuranceType(this.InsuranceForm.value).subscribe({
    //       next: (res)=>{
    //         this.toast.success({ detail: "SUCCESS", summary: "Insurance Type Updated Successfully.", duration: 4000 })
    //         this.getAllInsuranceType();
    //         this.initializeForm();
    //       },
    //       error: (err => {
    //         this.toast.warning({ detail: "WARNING", summary:"Insurance Type Already Added.!", duration: 4000 });
    //       })
    //     });
    //     this.visible2=false;
    //   }
    //   else{
    //     ValidateForm.validateAllFormFields(this.InsuranceForm);
    //     this.toast.warning({ detail: "WARNING", summary:"Please Fill All Required Fields.!", duration: 4000 });
    //   }
    // }

    if(form == this.ProductForm){
      if(this.ProductForm.valid){
        this.adminService.updateProduct(this.ProductForm.value).subscribe({
          next: (res)=>{
            this.toast.success({ detail: "SUCCESS", summary: "Product Updated Successfully.", duration: 4000 })
            this.getAllProduct();
            this.initializeForm();
          },
          error: (err => {
            this.toast.warning({ detail: "WARNING", summary:"Product Already Added.!", duration: 4000 });
          })
        });
        this.visible3=false;
      }
      else{
        ValidateForm.validateAllFormFields(this.ProductForm);
        this.toast.warning({ detail: "WARNING", summary:"Please Fill All Required Fields.!", duration: 4000 });
      }
    }

    if(form == this.ChannelBankProductMapForm){
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
                this.visible5=false;
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
            this.visible5=false;
          }
        });
      }
      else{
        ValidateForm.validateAllFormFields(this.ChannelBankProductMapForm);
        this.visible5=false;
        this.toast.warning({ detail: "WARNING", summary:"Please Fill All Required Fields.!", duration: 4000 });
      }
    }

    if(form == this.AgencyInsuranceProductMapForm){
      if(this.AgencyInsuranceProductMapForm.valid){
        this.confirmationService.confirm({
          message: 'Are you sure that you want to update?',
          header: 'Confirmation',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
            this.adminService.DeleteAgencyChannelInsuranceProductMap(this.AgencyInsuranceProductMapForm.value).subscribe({
              next: (res)=>{
                this.toast.success({ detail: "SUCCESS", summary: "Mapping Updated Successfully.", duration: 4000 })
                this.getAllAgencyInsuranceProductMapDetails();
                this.initializeForm();
                this.visible9=false;
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
            this.visible9=false;
          }
        });
      }
      else{
        ValidateForm.validateAllFormFields(this.ChannelBankProductMapForm);
        this.visible5=false;
        this.toast.warning({ detail: "WARNING", summary:"Please Fill All Required Fields.!", duration: 4000 });
      }
    }

    // if(form == this.UserDetailsForm){
    //   if(this.UserDetailsForm.valid){
    //     this.adminService.updateUser(this.UserDetailsForm.value).subscribe({
    //       next: (res)=>{
    //         this.toast.success({ detail: "SUCCESS", summary: "User Updated Successfully.", duration: 4000 })
    //         this.getAllUserDetails();
    //         this.initializeForm();  
    //       },
    //       error: (err => {
    //         this.toast.warning({ detail: "WARNING", summary:"User Already Added.!", duration: 4000 });
    //       })
    //     });
    //     this.UserDetailsForm.removeControl('bancaUserDetailsSeq');
    //     this.visible6=false;
    //   }
    //   else{
    //     ValidateForm.validateAllFormFields(this.UserDetailsForm);
    //     this.toast.warning({ detail: "WARNING", summary:"Please Fill All Required Fields.!", duration: 4000 });
    //   }
    // }
    if(form == this.AgencyDetailsForm){
      if(this.AgencyDetailsForm.valid){
        this.adminService.updateAgency(this.AgencyDetailsForm.value).subscribe({
          next: (res)=>{
            this.toast.success({ detail: "SUCCESS", summary: "Agency Updated Successfully.", duration: 4000 })
            this.getAllAgency();
            this.initializeForm();  
          },
          error: (err => {
            this.toast.warning({ detail: "WARNING", summary:"Agency Already Added.!", duration: 4000 });
          })
        });
        this.visible7=false;
      }
      else{
        ValidateForm.validateAllFormFields(this.AgencyDetailsForm);
        this.toast.warning({ detail: "WARNING", summary:"Please Fill All Required Fields.!", duration: 4000 });
      }
    }
    if(form == this.AgentsDetailsForm){
      if(this.AgentsDetailsForm.valid){
        console.log(this.AgentsDetailsForm.value);
        this.adminService.updateAgent(this.AgentsDetailsForm.value).subscribe({
          next: (res)=>{
            this.toast.success({ detail: "SUCCESS", summary: "Agent Updated Successfully.", duration: 4000 })
            this.getAllAgentDetails();
            this.initializeForm();  
          },
          error: (err => {
            this.toast.warning({ detail: "WARNING", summary:"Agent Already Added.!", duration: 4000 });
          })
        });
        this.visible8=false;
      }
      else{
        ValidateForm.validateAllFormFields(this.AgentsDetailsForm);
        this.toast.warning({ detail: "WARNING", summary:"Please Fill All Required Fields.!", duration: 4000 });
      }
    }
  }
}
