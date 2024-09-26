import { HttpClient } from '@angular/common/http';
import { Component, HostListener, Input, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IDynamicControl, IFormControl } from 'src/app/interface/form.interface';
import { RenewalServiceService } from 'src/app/services/renewal/renewal-service.service';

@Component({
  selector: 'app-renewal-dynamic-form',
  templateUrl: './renewal-dynamic-form.component.html',
  styleUrls: ['./renewal-dynamic-form.component.scss']
})
export class RenewalDynamicFormComponent implements OnInit {
  @Input() section: any;
  form: FormGroup = this.fb.group({});
  formConfig: any;
  formId: number = 5001;
  mainCnt: number = 1;
  isEditingEmail = false;
  emailSaved: boolean = false;
  email = 'sujitp1@gmail.com';
  selectedButton: string = 'primary'; 
  selectedTenure: string = "tenure3";
  tenureDetails:any[]=[]; 
  // coverages:any[]=[]
  selectedCoverages: any[] = []; 
  // healthAddOns: any[] = [];
  selectedAddOns: any[] = []; 
  roomUpgradeBenefits: any[] = [];
  isRadioSelected = false;
  selectedPaymentType: string = '';
  selectedPaymentTypeLabel: string = '';
  isDropdownOpen: boolean = false;
  policySummarys : boolean=false
  planDetail : boolean = false;
  activeSection: string = 'primary';
  response: any = [];
  policyNumber:string=''; 

  value: number = 25;
  control = {
    name: 'sumInsured',
    label: 'Sum Insured',
    type: 'range',
    min: 500000,
    max: 20000000,
    step: 500000,
    value: 500000,
    class: 'col-md-12'
  };
  renewalInfo: any;
  formObject: any = {};
  rangeValue: { [key: string]: number } = { sumInsured: 500000 };



  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private renewalService: RenewalServiceService
  ) {}

  ngOnInit() {
    // this.fetchAddOns()
    // this.fetchCoverages();
    this.fetchRoomUpgradeBenefits();
    this.fetchTenureDetails();
     this.renewalService.policy$.subscribe(policy => {
      if(policy.policyNo){
      this.policyNumber=policy.policyNo;
    }
    });
    this.getRenewalInfo();
    this.initializeForm();
    console.log("tenure",this.renewalInfo?.response?.policyData[0]?.Tenure);
    
  }

  //render forms
  initializeForm() {
    const group: { [key: string]: any } = {}; 
  
    Object.keys(this.formObject).forEach((key: string) => {
      const controlValue = this.formObject[key];
  
      if (controlValue instanceof Object && !(controlValue instanceof Array)) {
        group[key] = this.fb.group(
          Object.keys(controlValue).reduce((acc: { [nestedKey: string]: any }, nestedKey: string) => {
            acc[nestedKey] = [controlValue[nestedKey]]; 
            return acc;
          }, {})
        );
      } else {
        group[key] = [controlValue];
      }
    });
      this.form = this.fb.group(group);
    console.log('Dynamic form:', this.form.value);
  }
  
  
  
  proposerObject(){
    this.renewalService.getRenewalInfo().subscribe((info) => {
      if (info) {this.renewalInfo=info;}
    }); 
  }

  handleAction(event: string,item?: any) {
      switch (event) {
        case 'addMember':
          this.formId=5001;
          break;
        case 'editMember':
          this.formId=5001;
          break;
        case 'editAddress':
          this.formId=5001;
          if (event === 'editAddress') {
            const updatedAddress = { ...this.form.value };
            Object.keys(updatedAddress).forEach((key) => {
              if (updatedAddress[key] !== null && updatedAddress[key] !== undefined && updatedAddress[key] !== '') {
                this.renewalInfo.response.policyData[0].HomeAddress[key] = updatedAddress[key];
              }
          });
          } else {
            console.log('Form is invalid');
          }          
          break;
        case 'addNominee':
          this.formId=5001;
          if (event === 'addNominee') {
            const nominee = { ...this.form.value };
            const nomineeDetails = this.renewalInfo.response.policyData[0].Nominee_Details;
            Object.keys(nominee).forEach((key) => {nomineeDetails[key] = nominee[key];});
            const additionalKeys = {
                nominee_middle_name: nomineeDetails.nominee_middle_name || '',
                nominee_mobile_number: nomineeDetails.nominee_mobile_number || '',
                nominee_emergency_phone_number: nomineeDetails.nominee_emergency_phone_number || '',
                nominee_email_address: nomineeDetails.nominee_email_address || ''
            };
            Object.assign(nomineeDetails, additionalKeys);
            this.renewalInfo.response.policyData[0].Nominee_Details = nomineeDetails;
          } else {
            console.log('Form is invalid');
          } 
          break;  
        default:
          console.warn('Unknown action:', event);
      }
      // this.proposerObject()
    }
//range
  onRadioChange(controlName: string, value: string): void {
    this.form.get(controlName)?.setValue(value);
  }

updateRangeValue(event: any, controlName: string) {
  const value = event.target.value;
    this.rangeValue[controlName] = +value;
}

getBackground(value: number, min: number, max: number): string {
    const percentage = ((value - min) / (max - min)) * 100;
    return `linear-gradient(to right, #ffcc00 0%, #ffcc00 ${percentage}%, #f0f0f0 ${percentage}%, #f0f0f0 100%)`;
}

formatValue(value: number): string {
    return new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(value);
}

//payment
toggleEditEmail() {
  this.isEditingEmail = !this.isEditingEmail;
}

saveEmail() {
  if (this.email && this.email !== '') {
    this.isEditingEmail = false;
    this.emailSaved = true;
  }
}
selectButton(button: string, value?: any,content? : any) {
  if (this.selectedButton === 'primary') {
    if (value == 5005) {//edit address
      if (this.renewalInfo?.response?.policyData?.length > 0) {
        this.formObject = { ...this.renewalInfo.response.policyData[0].HomeAddress };
        console.log('Existing address loaded:', this.formObject);
      } this.initializeForm();
      this.formId = value;
    }else if (value == 5004) {//add nominee
      if (this.renewalInfo?.response?.policyData?.length > 0 && content == 'editNominee') {
        const nomineeDetails = this.renewalInfo.response.policyData[0].Nominee_Details;
        this.formObject = {...nomineeDetails,
          nominee_middle_name: nomineeDetails.nominee_middle_name || '',
          nominee_mobile_number: nomineeDetails.nominee_mobile_number || '',
          nominee_emergency_phone_number: nomineeDetails.nominee_emergency_phone_number || '',
          nominee_email_address: nomineeDetails.nominee_email_address || ''
        };
        console.log('Existing address loaded:', this.formObject);
      } else if (content === 'addNominee') {
        this.formObject = Object.keys(this.renewalInfo.response.policyData[0].Nominee_Details)
          .reduce((acc:any, key:any) => { acc[key] = ''; return acc; }, {});
          this.formObject.nominee_middle_name = '';
          this.formObject.nominee_mobile_number = '';
          this.formObject.nominee_emergency_phone_number = '';
          this.formObject.nominee_email_address = '';  
      }
      this.initializeForm();
      this.formId = value;
    }else if (value == 5003) {//edit member detail
      this.formId = value;
    }else if (value == 5002) {// add memeber
      this.formObject = {
        name: [''],
        weight: [''],
        heightft: [''],
        heightin: [''],
        gender: [''],
        dob: [''],
        idtype: [''],
        air: [''],
        occupation: [''],
        education: [''],
        
        conditions: this.fb.group({
          alcohol: [false],
          tobacco: [false],
          panmasala: [false],
          smoking: [false],
          other: [false],
        }),
      
        healthConditions: this.fb.group({
          highblood: [false],
          asthma: [false],
          diabetes: [false],
        })
      };
      
      this.initializeForm();
      
      this.formId = value;
    }else {
      this.formId = 5001; //main
    }
  }else if (this.selectedButton === 'additional') {
    this.policySummarys=false;
  } 
  else if (this.selectedButton == 'payment') {
    if(value == 'policySummary'){
      this.policySummarys=true
    }
    else{
      this.policySummarys=false;
    }
  }
  this.proposerObject();
}

resendLink() {
  console.log('Resending payment link...');
}

paymentTypes = [
  { value: 'e-nach', label: 'E - Nach', isFasterProcess: true },
  { value: 'e-mandate', label: 'E - Mandate', isFasterProcess: true },
  { value: 'auto-debit', label: 'Auto Debit', isFasterProcess: false }
];

toggleDropdown() {
  this.isDropdownOpen = !this.isDropdownOpen;
}

selectPaymentType(option: any) {
  this.selectedPaymentType = option.value;
  this.selectedPaymentTypeLabel = option.label;
  this.isDropdownOpen = false; // Close dropdown after selection
}
 @HostListener('document:click', ['$event'])
 onDocumentClick(event: Event) {
   const target = event.target as HTMLElement;
   const dropdown = document.querySelector('.custom-dropdown');

   if (dropdown && !dropdown.contains(target)) {
     this.isDropdownOpen = false;
   }
 }

 // Function to fetch Tenure Details
 fetchTenureDetails(): void { 
  this.http.get<any[]>('/assets/jsonValue/tenure-details.json').subscribe(
    (tenureDetailsData) => {
      this.tenureDetails = tenureDetailsData;
    },
    (error) => {
      console.error('Error fetching Tenure Details:', error);
    }
  );    
}

  // Function to fetch Add-Ons Data
  // fetchAddOns(): void {  
  //   this.http.get<any[]>('/assets/jsonValue/health-add-ons.json').subscribe(
  //     (healthAddOnsData) => {
  //       this.healthAddOns = healthAddOnsData;
  //     },
  //     (error) => {
  //       console.error('Error fetching Health Add-Ons:', error);
  //     }
  //   );    
  // }


 // Function to fetch Coverages Data
//  fetchCoverages(): void {  
//   this.http.get<any[]>('/assets/jsonValue/optional-coverages.json').subscribe(
//     (coveragesData) => {
//       this.coverages = coveragesData;
//     },
//     (error) => {
//       console.error('Error fetching Coverages:', error);
//     }
//   );
// }

fetchRoomUpgradeBenefits(): void {  
  this.http.get<any[]>('/assets/jsonValue/rooms.json').subscribe(
    (roomUpgradeBenefitsData) => {
      this.roomUpgradeBenefits = roomUpgradeBenefitsData;
    },
    (error) => {
      console.error('Error fetching Room Upgrade Benefits:', error);
    }
  );
}


//Additinal page related methods
selectCoverage(coverage: any): void {
  const index = this.selectedCoverages.findIndex(c => c.id === coverage.id);
  if (index > -1) {
    this.selectedCoverages.splice(index, 1);
  } else {
    this.selectedCoverages.push(coverage);
  }
}

isCoverageSelected(coverage: any): boolean {
  return this.selectedCoverages.some(c => c.id === coverage.id);
}

selectAddOn(addOn: any): void {
  const index = this.selectedAddOns.findIndex(a => a.id === addOn.id);
  if (index > -1) {
    this.selectedAddOns.splice(index, 1);
  } else {
    this.selectedAddOns.push(addOn);
  }
}

isHealthAddOnSelected(addOn: any): boolean {
  return this.selectedAddOns.some(a => a.id === addOn.id);
}

onRadioChanges() {
  this.isRadioSelected = true;
}
applyRoomUpgrade() {
  this.isRadioSelected = false;

}

getSubquotes() {
  this.router.navigate(['portal/agent/renewalList'],{ queryParams: { showSubQuotes: true } })
}

setSection(section: string) {
  this.activeSection = section;
}

proceed() {
  if (this.activeSection === 'primary') {
    this.setSection('additional');
    // this.proposerObject();
  } else if (this.activeSection === 'additional') {
    this.setSection('payment');
  } else if (this.activeSection === 'payment') {
  }
}

renewNow() {
  this.setSection('payment')
}

getRenewalInfo() {
  //  '21-24-0002334-00'
  this.renewalService.getRenewalInfoApi(this.policyNumber, {}).subscribe(
    (res) => {
      this.renewalInfo = JSON.parse(res.data);
      this.renewalService.setRenewalInfo( this.renewalInfo);        
    },
    (err) => {
      console.log("Error", err);
    }
  );
}


}
