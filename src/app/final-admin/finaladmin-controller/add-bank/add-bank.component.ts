import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';
import { AdminService } from 'src/app/services/admin.service';
import ValidateForm from 'src/app/validation/validateForm';

@Component({
  selector: 'app-add-bank',
  templateUrl: './add-bank.component.html',
  styleUrls: ['./add-bank.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class AddBankComponent {
  BankForm: any;
  ChannelBankProductMapForm: any;

  allBank: any[] = []
  allBankInsuranceProductMapData: any[] = []
  allInsuranceType: any[] = []
  allProduct: any[] = []
  productOptions: any[] = []
  insuranceTypeOptions: any[] = []
  channelOptions: any[] = []
  allChannel: any[] = []
  bankOptions: any[] = []
  allBankInsuranceMapData:any[]=[]


  visible1: boolean = false;


  isBankDetails: boolean = true;

  selectedOption: any

  constructor(private fb: FormBuilder, private adminService: AdminService,
    private toast: NgToastService, private router: Router,
    private confirmationService: ConfirmationService,private messageService: MessageService) { }

  ngOnInit() {
    this.initializeForm();
    this.getAllProduct();
    this.getAllInsuranceType();
    this.getAllChannel();
    this.getAllBank();
    this.getAllBankInsuranceProductMapDetails();
    this.getAllBankInsuranceMapDetails();
    this.selectedOption = 'option1';
    this.isBankDetails = history.state.isBankDetails;
    console.log(this.isBankDetails);
  }
  initializeForm() {
    this.BankForm = this.fb.group({
      bankCode: ['', { validators: [Validators.required, this.validateBankCode.bind(this)], updateOn: 'blur' }],
      bankName: ['', Validators.required],
      status: [true, Validators.required],
      userId: [true, Validators.required],
      Otp: [true, Validators.required]
    });
    this.ChannelBankProductMapForm = this.fb.group({
      verticalCode: ['', Validators.required],
      bankCode: [this.BankForm.get('bankCode').value, Validators.required],
      insuranceTypeCode: ['', Validators.required],
      productId: ['', Validators.required],
      status: [true, Validators.required]
    });
    this.BankForm.get('bankCode').valueChanges.subscribe((value: any) => {
      this.ChannelBankProductMapForm.patchValue({
        bankCode: value
      });
    });
  }

  validateBankCode(control: any) {
    const bankCode = control.value;
    const isValid = this.bankOptions.some(option => option.bankCode === bankCode);
    return isValid ? { invalidBankCode: true } : null;
  }

  getAllProduct() {
    this.adminService.getAllProductList()
      .subscribe({
        next: (res) => {
          this.allProduct = res.filter((product: any) => product.status == true);
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
          this.allInsuranceType = res.filter((insurance: any) => insurance.status == true);
          this.insuranceTypeOptions = this.allInsuranceType;
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
          this.allChannel = res.filter((channel: any) => channel.channelStatus == true);
          this.channelOptions = this.allChannel;
        },
        error: (err => {
          console.error(err);
        })
      })
  }

  getAllBank() {
    this.adminService.getAllBankList()
      .subscribe({
        next: (res) => {
          this.allBank = res.filter((bank: any) => bank.status == true);
          this.bankOptions = this.allBank;
        },
        error: (err => {
          console.error(err);
        })
      })
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
  onSubmit() {
    if (this.BankForm.valid) {
      const bankConfiguration = {
        loginConfiguration: JSON.stringify({
          "USERID": true,
          "OTP": true
        })
      };
      const updatedBankConfiguration = {
        ...this.BankForm.value, ...bankConfiguration
      };
      console.log(updatedBankConfiguration);
      
      this.adminService.insertBank(updatedBankConfiguration)
        .subscribe({
          next: (res) => {
            this.toast.success({ detail: "SUCCESS", summary: "Bank Added Successfully.", duration: 4000 })
            this.mappingChannel();
            this.getAllBank();
            this.initializeForm();
          },
          error: (err => {
            this.toast.warning({ detail: "WARNING", summary: "Bank Already Added.!", duration: 4000 });
          })
        })
    }
    else {
      ValidateForm.validateAllFormFields(this.BankForm);
      this.toast.warning({ detail: "WARNING", summary: "Please Fill All Required Fields.!", duration: 4000 });
    }
    this.mappingChannel();
  }
    mappingChannel(){
      console.log(this.ChannelBankProductMapForm.value);
      console.log(this.BankForm.value);
      
      if (this.ChannelBankProductMapForm.valid) {
        this.adminService.insertBancaChannelInsuranceMap(this.ChannelBankProductMapForm.value).subscribe({
          next: (res)=>{
            console.log(res);
            
            this.toast.success({ detail: "SUCCESS", summary: "Map Added Successfully.", duration: 4000 })
            this.getAllBankInsuranceMapDetails();
            this.initializeForm();
          },
          error: (err => {
            this.toast.warning({ detail: "WARNING", summary:"Map Already Exist.!", duration: 4000 });
          })
        });
        this.adminService.insertBancaChannelInsuranceProductMap(this.ChannelBankProductMapForm.value).subscribe({
          next: (res) => {
            this.toast.success({ detail: "SUCCESS", summary: "Mapping Added Successfully.", duration: 4000 })
            // this.ChannelBankProductMapForm.reset();
            // this.BankForm.reset();
            console.log(res);
            
            this.getAllBankInsuranceProductMapDetails();
            this.initializeForm();
          },
          error: (err => {
            this.toast.warning({ detail: "WARNING", summary: "Mapping Already Exists!", duration: 4000 });
          })
        });
        
        
      }
      else {
        ValidateForm.validateAllFormFields(this.ChannelBankProductMapForm);
        this.toast.warning({ detail: "WARNING", summary: "Please Fill All Required Fields.!", duration: 4000 });
      }
      this.isBankDetails = false;
    }

  onselectInsuranceType(event: any) {
    const excludedProduct = this.allBankInsuranceProductMapData
      .filter(map => {
        const verticalCodeMatch = map.verticalCode == this.ChannelBankProductMapForm.get('verticalCode')?.value;
        const bankCodeMatch = map.bankCode == this.ChannelBankProductMapForm.get('bankCode')?.value;
        const insuranceTypeCodeMatch = map.insuranceTypeCode == this.ChannelBankProductMapForm.get('insuranceTypeCode')?.value;
        return verticalCodeMatch && bankCodeMatch && insuranceTypeCodeMatch;
      })
      .map(filteredMap => filteredMap.productId);

    let filteredProduct = this.allProduct.filter(product => {
      const insuranceTypeName = this.allInsuranceType.filter(insurance => insurance.insuranceTypeCode == event)[0].insuranceType;
      return !excludedProduct.includes(product.productId) && product.insuranceType == insuranceTypeName;
    });
    this.productOptions = filteredProduct;
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

  // toggleState() {
  //   this.isBankDetails = true;
  // }
  // toggleState1() {
  //   this.isBankDetails = false;
  // }

  selectType(option: any) {
    this.selectedOption = option;
  }

  clickedit(data: any) {
    console.log(data.bankCode, data.verticalCode, data.insuranceTypeCode, data.productId);
    this.router.navigate(['/portal/finaladminDashboard/editForm'],
      {
        state: {
          bankCode: data.bankCode,
          verticalCode: data.verticalCode,
          insuranceTypeCode: data.insuranceTypeCode,
          productId: data.productId
        }
      });
  }
}
