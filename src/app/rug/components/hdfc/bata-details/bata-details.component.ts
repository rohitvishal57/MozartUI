import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { RugService } from 'src/app/rug/rug.service';

@Component({
  selector: 'app-bata-details',
  templateUrl: './bata-details.component.html',
  styleUrls: ['./bata-details.component.scss']
})
export class BataDetailsComponent {
  BATADetails!: FormGroup;
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
  SumInsured: any = [];
  sumInsuredOptionsRetail:any = [];
  showProduct1: boolean = false;
  showProduct2: boolean = false;
  campaignName: any;
  productType: any;
  selectedCampaignCode: string = '';
  products:any = [];
  retailProducts:any = [];
  groupProducts:any = [];
  isSummery:boolean = false;
  leadId: string | null = null;
  bataDetails:any = [];
  bataData:any = [];
  agentCode = localStorage.getItem('agentCode');
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
  constructor(private datePipe: DatePipe, private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private rugService: RugService, private toast: NgToastService) {

  }
  ngOnInit(): void {
    const isSummeryStored = sessionStorage.getItem('isSummery');
    this.leadId = sessionStorage.getItem('leadId');
    if (isSummeryStored === 'true') {
        this.isSummery = true;
    }
    this.inItForm();
 
    if (this.leadId) {
      this.getBataDetailsbyLeadId();
    }
  }

  inItForm() {
    this.BATADetails = this.formBuilder.group({
      caseStatus: ['BATA', [Validators.required, Validators.pattern('^[a-zA-Z]*$')]],
      employeeCode: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
      employeeName: ['', Validators.required],
      certifacateNo: ['', Validators.required],
      branchName: ['', Validators.required],
      branch_code: ['', Validators.required],
      rmContactNo: ['', [Validators.required, Validators.pattern('^[6-9]\\d{9}$'), Validators.maxLength(10)]],
      bbCustomerType: [''],
      languagePreference: [''],
      salutation: ['', Validators.required],
      customer_name: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
      dob: ['', Validators.required],
      customer_mob_no: ['', [Validators.required, Validators.pattern('^[6-9]\\d{9}$'), Validators.maxLength(10)]],
      emailId: ['', Validators.required],
      productType: ['', Validators.required],
      sumInsured: ['', Validators.required],
      premium: [''],
      comment: [''],
      campaignName: ['', Validators.required],
      smName: ['', Validators.required],
      smMobileNo: ['', [Validators.required, Validators.pattern('^[6-9]\\d{9}$'), Validators.maxLength(10)]],
      campaignIMDCode: ['', Validators.required],
      journeyType: ['', Validators.required],
      LeadAssignee:['BATAAV', Validators.required],
      av_userName:[''],
      av_userId:[''],
      region:['']

    });

  
  }

  
  backToLeadPage() {
   if(this.agentCode == 'BATAAV'){
    this.router.navigate(['rug/view_leads_list']);
   }else{
    this.router.navigate(['rug/view_leads_list']);
   }
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


  getBataDetailsbyLeadId() {
    const req = {
      leadId: this.leadId
    };
  
    this.rugService.getBataDetailsbyLeadId(req).subscribe((res: any) => {
      try {
        const response = JSON.parse(res.data);
        this.bataData = response.data[0];
  
        console.log("BATAData", this.bataData);
  
        let employeeData = this.bataData?.employeeData
          ? JSON.parse(this.bataData.employeeData)
          : null;
  
        this.BATADetails.patchValue({
          caseStatus: employeeData?.caseStatus || '',
          employeeCode: employeeData?.employeeCode || '',
          employeeName: employeeData?.employeeName || '',
          certifacateNo: employeeData?.certificationCode || '',
          branchName: employeeData?.branchName || '',
          branch_code: employeeData?.branchLocationCode || '',
          rmContactNo: employeeData?.RMMobileNumber || '',
          bbCustomerType: employeeData?.BBCustomerType || '',
          languagePreference: employeeData?.languagePreference || '',
          customer_name: this.bataData?.customerName + ' ' + this.bataData?.customerLastName || '',
          dob: this.bataData?.customerDOB 
          ? this.datePipe.transform(this.bataData.customerDOB, 'dd-MM-yyyy') 
          : '',
          customer_mob_no: this.bataData?.customerNumber || '',
          emailId: this.bataData?.customerEmail || '',
          productType: this.bataData?.productName || '',
          sumInsured: this.bataData?.suminsured || '',
          premium: this.bataData?.premium || '',
          comment: this.bataData?.remarks || '',
          campaignName: this.bataData?.campaignName || '',
          smName: employeeData?.SMName || '',
          smMobileNo: employeeData?.SMMobileNumber || '',
          campaignIMDCode: this.bataData?.campaignCode || '',
          journeyType: '',
          LeadAssignee: this.bataData?.leadAssignee || '',
          av_userName: this.bataData?.avUserName || '',
          av_userId: this.bataData?.avusercode || '',
          region: this.bataData?.region || ''
        });
  
        console.log("Form Updated with API Data", this.BATADetails.value);
        this.BATADetails.updateValueAndValidity();
      } catch (error) {
        console.error("Error parsing API response: ", error);
      }
    });
  }
  
  
  onSubmit() {
    this.submitted = true;
    console.log(this.BATADetails.value);

    if (this.BATADetails.invalid) {
      const firstInvalidControl = Object.keys(this.BATADetails.controls).find(
        control => this.BATADetails.get(control)?.invalid
      );
      if (firstInvalidControl) {
        const invalidElement = document.getElementById(firstInvalidControl);
        invalidElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    console.log(this.BATADetails.value);
    
  }

}
