import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { event } from 'jquery';
import { NgToastService } from 'ng-angular-popup';
import { RugService } from 'src/app/rug/rug.service';

@Component({
  selector: 'app-hdfc-create-bata-leads',
  templateUrl: './hdfc-create-bata-leads.component.html',
  styleUrls: ['./hdfc-create-bata-leads.component.scss']
})
export class HdfcCreateBataLeadsComponent {
  createBataLeads!: FormGroup;
  action: String = '';
  submitted: boolean = false;
  today: string = '';
  AllManageLOB: any[] = [];
  PatchAllAv: any;
  joy: any;
  allAxisLocations: any[] = [];
  allAxisVendors: any[] = [];
  filteredVendors: any[] = [];
  selectedLocationId: any = '';
  selectedLocation: any;
  selectedUserId: any | null = null;
  isUpdate: boolean = false;
  filteredAxisVendors: any;
  dataToModify!: any;
  EmployeeDetails: any;
  AllProductDetails: any;
  isGroupJourney!: boolean;
  isRetailsJourney!: boolean;
  JourneyType: any[] = ["Retail", "Group"]
  SumInsured: any;
  showProduct1: boolean = false;
  showProduct2: boolean = false;
  campaignName: any;
  productType: any;
  selectedCampaignCode: string = '';
  bbcustometype: any[] = [
    {
      "name": "Imperia",
      "value": "imperia"
    },
    {
      "name": "Preferred",
      "value": "preferred"
    },
    {
      "name": "Classic",
      "value": "classic"
    },
    {
      "name": "Prime",
      "value": "prime"
    },
    {
      "name": "Non Managed",
      "value": "non_managed"
    }
  ];
  language: any[] = [{
    "name": "English",
    "value": "En"
  },
  {
    "name": "Hindi",
    "value": "Hi"
  },
  {
    "name": "Marathi",
    "value": "Mh"
  },
  {
    "name": "Bengali",
    "value": "Be"
  },
  {
    "name": "Gujarati",
    "value": "Gj"
  },
  {
    "name": "Tamil",
    "value": "Tn"
  },
  {
    "name": "Telugu",
    "value": "Tl"
  },
  {
    "name": "Malayalam",
    "value": "Kl"
  },
  {
    "name": "Kanada",
    "value": "Ka"
  }
  ];

  salutations: any[] = [{
    "value": "Mr",
    "name": "Mr"
  },
  {
    "value": "Mrs",
    "name": "Mrs"
  },
  {
    "value": "Ms",
    "name": "Ms"
  },
  {
    "value": "Dr",
    "name": "Dr"
  },
  {
    "value": "Mx",
    "name": "Mx"
  },
  {
    "value": "Miss",
    "name": "Miss"
  },
  {
    "value": "Others",
    "name": "Others"
  }
  ]

  selectedProductCode: string | null = null;
  subProducts: any[] = []; // Second dropdown ke liye data store karne ke liye
  constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private rugService: RugService, private toast: NgToastService) {

  }
  ngOnInit(): void {
    this.inItForm();
    this.getProductDetails();
    this.getCampaignName();
  }

  inItForm() {
    this.createBataLeads = this.formBuilder.group({
      caseStatus: ['BATA', [Validators.required, Validators.pattern('^[a-zA-Z]*$')]],
      employeeCode: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
      employeeName: ['', Validators.required],
      certifacateNo: ['', Validators.required],
      branchName: ['', Validators.required],
      branch_code: ['', Validators.required],
      rmContactNo: ['', [Validators.required, Validators.pattern('^[6-9]\\d{9}$'), Validators.maxLength(10)]],
      bbCustomerType: ['', [Validators.required, Validators.pattern('^[a-zA-Z]*$')]],
      languagePreference: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
      salutation: ['', Validators.required],
      customer_name: ['', [Validators.required, Validators.pattern('^[a-zA-Z]*$')]],
      dob: ['', Validators.required],
      customer_mob_no: ['', [Validators.required, Validators.pattern('^[6-9]\\d{9}$'), Validators.maxLength(10)]],
      emailId: ['', Validators.required],
      productType: ['', Validators.required],
      sumInsured: ['', Validators.required],
      premium: ['', Validators.required],
      comment: ['', Validators.required],
      campaignName: ['', Validators.required],
      smName: ['', Validators.required],
      smMobileNo: ['', [Validators.required, Validators.pattern('^[6-9]\\d{9}$'), Validators.maxLength(10)]],
      campaignIMDCode: ['', Validators.required],
      journeyType: ['', Validators.required]
    });

    this.createBataLeads.get('journeyType')?.valueChanges.subscribe((value) => {
      this.showProduct1 = value === 'Retail';
      this.showProduct2 = value === 'Group';
    });
  }

  onSubmit() {
    this.submitted = true;
    console.log(this.createBataLeads.value);

    if (this.createBataLeads.invalid) {
      const firstInvalidControl = Object.keys(this.createBataLeads.controls).find(
        control => this.createBataLeads.get(control)?.invalid
      );
      if (firstInvalidControl) {
        const invalidElement = document.getElementById(firstInvalidControl);
        invalidElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    console.log(this.createBataLeads.value);
    const reqData = {
      caseStatus: this.createBataLeads.get('caseStatus')?.value,
      employeeCode: this.createBataLeads.get('employeeCode')?.value,
      salutation: this.createBataLeads.get('salutation')?.value,
      employeeName: this.createBataLeads.get('employeeName')?.value,
      certifacateNo: this.createBataLeads.get('certifacateNo')?.value,
      branchName: this.createBataLeads.get('branchName')?.value,
      mobileNumber: this.createBataLeads.get('customer_mob_no')?.value,
      emailId: this.createBataLeads.get('emailId')?.value,
      dob: this.createBataLeads.get('dob')?.value,
      createdBy: "QC",
      productCode: "7200",
      productName: "Active Max",
      branchCode: this.createBataLeads.get('branch_code')?.value,
      rmContactNo: this.createBataLeads.get('rmContactNo')?.value,
      bbCustomerType: this.createBataLeads.get('bbCustomerType')?.value,
      languagePreference: this.createBataLeads.get('languagePreference')?.value,
      productType: this.createBataLeads.get('productType')?.value,
      sumInsured: this.createBataLeads.get('sumInsured')?.value,
      comment: this.createBataLeads.get('comment')?.value,
      premium: this.createBataLeads.get('premium')?.value,
      campaignName: this.createBataLeads.get('campaignName')?.value,
      smName: this.createBataLeads.get('smName')?.value,
      smMobileNo: this.createBataLeads.get('smMobileNo')?.value,
      campaignIMDCode: this.createBataLeads.get('campaignIMDCode')?.value
    }
    this.rugService.createBataLeads(reqData).subscribe((response: any) => {
      console.log('create Bata Av successfully:', response);
      this.toast.success({ detail: "Success", summary: "Successful..", duration: 3000 })
    });
  }

  getEmployeeDetails() {
    const reqData = {
      imdCode: "2120594"
    };

    this.rugService.getEMployeeDetails(reqData).subscribe((res: any) => {
      const resData = JSON.parse(res.data);
      this.EmployeeDetails = resData.data;
      console.log('EmployeeDetails:', this.EmployeeDetails);

      const enteredEmployeeCode = this.createBataLeads.get('employeeCode')?.value;
      if (this.EmployeeDetails?.employeeCode === enteredEmployeeCode) {
        this.createBataLeads.patchValue({
          employeeName: this.EmployeeDetails.employeeName || '',
          certifacateNo: this.EmployeeDetails.certificationNo || '',
          branchName: this.EmployeeDetails.branchName || '',
          branch_code: String(this.EmployeeDetails.branchCode || ''),
          rmContactNo: String(this.EmployeeDetails.mobileNo || ''),
          smName: this.EmployeeDetails.smName || '',
          smMobileNo: this.EmployeeDetails.smContactNo || ''
        });
      } else {
        this.createBataLeads.patchValue({
          employeeName: '',
          certifacateNo: '',
          branchName: '',
          branch_code: ''
        });
        this.toast.error({
          detail: "Error",
          summary: "Please use the correct RM ID for Lead Generation",
          duration: 5000,
        });
      }
      this.createBataLeads.updateValueAndValidity();
    });
  }

  validateEmployeeCode() {
    const employeeCode = this.createBataLeads.get('employeeCode')?.value;
    if (!employeeCode) {
      this.toast.error({
        detail: "Error",
        summary: "Employee Code is required",
        duration: 5000,
      });
      return;
    }
    this.getEmployeeDetails();
  }

  getProductDetails() {
    this.rugService.getProdcutDetails().subscribe((res: any) => {
      const response = JSON.parse(res.data)
      this.productType = response.data.productCombinationModel;
      this.productType = this.productType.slice(-4);
      console.log('Product Details', this.productType);
    })
  }
  onProductSelect(event: any) {
    this.selectedProductCode = event.target.value;
    console.log('Selected Product Code:', this.selectedProductCode);
    if (this.selectedProductCode) {
      this.getProductDetailsByCode();
    }
  }

  getProductDetailsByCode() {
    const req = {
      productCode: this.selectedProductCode
    }

    this.rugService.getSumInsuredByProduct(req).subscribe(
      (response: any) => {
        const res = JSON.parse(response.data);
        console.log('Details for Selected Product:', res.data.productSIDetails);
        this.SumInsured = res.data.productSIDetails;
      },
      (error: any) => {
        console.error('Error fetching product details:', error);
      }
    );
  }

  getCampaignName() {
    const req = {
      agent: "BATARM",
      pageNumber: 0,
      pageSize: 10,
      name: "",
      filterType: ""
    };

    this.rugService.getCampaignName(req).subscribe((res: any) => {
      const response = typeof res.data === "string" ? JSON.parse(res.data) : res.data;

      this.campaignName = response.campaignlist;
      console.log('Campaign Names', this.campaignName);
    },
      (error: any) => {
        console.error('Error fetching campaign names:', error);
      });
  }

  onCampaignChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const selectedName = target.value; 
    console.log('Selected Campaign Name:', selectedName);

    const selectedCampaign = this.campaignName?.find((camp: any) => camp.name === selectedName);
    this.selectedCampaignCode = selectedCampaign.campaignNo; 
    console.log('Mapped Campaign No:', this.selectedCampaignCode);

    this.createBataLeads.patchValue({ campaignIMDCode: this.selectedCampaignCode });
}

  backToJourneySelection() {
    this.router.navigate(['rug/hdfc_bataLeadsList']);
  }

  isNumber(event: KeyboardEvent) {
    const pattern = /[0-9]/; // Only allow digits
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault(); // Block non-numeric input
    }
  }


  isCharacter(event: KeyboardEvent) {
    const char = String.fromCharCode(event.which);
    if (!/[a-zA-Z ]/.test(char)) {
      event.preventDefault();
    }
  }

}
