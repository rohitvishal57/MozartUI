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
  nomineeForm: FormGroup = this.fb.group({});
  formConfig: any;
  formId: number = 5001;
  mainCnt: number = 1;
  isEditingEmail = false;
  emailSaved: boolean = false;
  email = 'sujitp1@gmail.com';
  selectedButton: string = 'primary'; 
  selectedTenure: string = "tenure3";
  tenureDetails:any[]=[]; 
  coverages:any[]=[]
  selectedCoverages: any[] = []; 
  healthAddOns: any[] = [];
  selectedAddOns: any[] = []; 
  roomUpgradeBenefits: any[] = [];
  isRadioSelected = false;
  selectedPaymentType: string = '';
  selectedPaymentTypeLabel: string = '';
  isDropdownOpen: boolean = false;
  policySummarys : boolean=false
  planDetail : boolean = false;
  activeSection: string = 'primary';
  response: any;
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


  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private renewalService: RenewalServiceService
  ) {}

  ngOnInit() {
    this.fetchAddOns()
    this.fetchCoverages();
    this.fetchRoomUpgradeBenefits();
    this.fetchTenureDetails();
    this.planDetail = true;    this.renewalService.policy$.subscribe(policy => {
      // console.log('Policy Number:', policy.policyNo);
      this.policyNumber=policy.policyNo;
    });

    this.getRenewalInfo();
  }

  initializeForm() {
    this.nomineeForm = this.fb.group({});
  }

  populateFormControls() {
    if (this.formConfig && this.formConfig.formSections) {
      this.formConfig.formSections.forEach((section: any) => {
        section.formControls.forEach((control: any) => {
          let validatorsArray: any[] = [];
          if (control.validators) {
            control.validators.forEach((validator: any) => {
              if (validator.validatorName === 'required') {
                validatorsArray.push(Validators.required);
              } else if (validator.validatorName === 'pattern') {
                validatorsArray.push(Validators.pattern(validator.pattern));
              }
            });
          }
          this.nomineeForm.addControl(control.name, this.fb.control(control.value, validatorsArray));
        });
      });
    }
    console.log('Nominee form controls:', this.nomineeForm.controls);
  
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
          break;
        case 'addNominee':
          this.formId=5001;
          break;  
        default:
          console.warn('Unknown action:', event);
      }
    }

  onRadioChange(controlName: string, value: string): void {
    this.nomineeForm.get(controlName)?.setValue(value);
  }

rangeValue: { [key: string]: number } = { sumInsured: 500000 };

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

toggleEditEmail() {
  this.isEditingEmail = !this.isEditingEmail;
}

saveEmail() {
  if (this.email && this.email !== '') {
    this.isEditingEmail = false;
    this.emailSaved = true;
  }
}
selectButton(button: string, value?: any) {
  if (this.selectedButton === 'primary') {
    if (value == 5005) {
      this.planDetail=true
      this.formId = value;
    }else if (value == 5004) {
      this.planDetail=true
      this.formId = value;
    }else if (value == 5003) {
      this.planDetail=false
      this.formId = value;
    }else if (value == 5002) {
      this.planDetail=false
      this.formId = value;
    }else {
      this.formId = 5001;
      this.planDetail=true
    }
  }else if (this.selectedButton === 'additional') {
    this.policySummarys=false;
} 
else if (this.selectedButton == 'payment') {
  if(value == 'policySummary'){
     this.policySummarys=true
     this.planDetail=true
  }
  else{
    this.policySummarys=false;
    this.planDetail=false
  }
}
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


fetchTenureDetails(): void { 
  console.log("Fetching Tenure Details");
 
  this.http.get<any[]>('/assets/jsonValue/tenure-details.json').subscribe(tenureDetailsData => {
    this.tenureDetails = tenureDetailsData;
    console.log(this.tenureDetails);
  });    
}

fetchAddOns(): void { 
  console.log("Fetching health add-ons");
 
  this.http.get<any[]>('/assets/jsonValue/health-add-ons.json').subscribe(healthAddOnsData => {
    this.healthAddOns = healthAddOnsData;
    console.log(this.healthAddOns);
  });    
}


fetchCoverages(): void {
  console.log("Fetching coverages");
  
  this.http.get<any[]>('/assets/jsonValue/optional-coverages.json').subscribe(coveragesData => {
    this.coverages = coveragesData;
    console.log(this.coverages); // Log here after the data is fetched
  });
}

fetchRoomUpgradeBenefits(): void {
  console.log("Fetching room upgrade benefits");
  
  this.http.get<any[]>('/assets/jsonValue/rooms.json').subscribe(roomUpgradeBenefitsData => {
    this.roomUpgradeBenefits = roomUpgradeBenefitsData;
    console.log(this.roomUpgradeBenefits); // Log here after the data is fetched
  });
}

selectCoverage(coverage: any): void {
  const index = this.selectedCoverages.findIndex(c => c.id === coverage.id);
  if (index > -1) {
    this.selectedCoverages.splice(index, 1);
  } else {
    this.selectedCoverages.push(coverage);
  }
  console.log("Selected Coverages:", this.selectedCoverages);
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
  console.log("Selected Add-Ons:", this.selectedAddOns);
}

isHealthAddOnSelected(addOn: any): boolean {
  return this.selectedAddOns.some(a => a.id === addOn.id);
}

onRadioChanges() {
  this.isRadioSelected = true;
}
applyRoomUpgrade()
{
  this.isRadioSelected = false;

}

getSubquotes()
{
  this.router.navigate(['portal/agent/renewalList'],{ queryParams: { showSubQuotes: true } })
}

setSection(section: string) {
  this.activeSection = section;
}

proceed() {
  if (this.activeSection === 'primary') {
    this.setSection('additional');
  } else if (this.activeSection === 'additional') {
    this.setSection('payment');
  } else if (this.activeSection === 'payment') {
    console.log("finished");
  }
}

renewNow(){
  this.setSection('payment')
}

getRenewalInfo() {
  // const policyNumber = "asdfgh"; 
  // const requestBody = {}; 
  this.renewalService.getRenewalInfoApi(this.policyNumber, {}).subscribe(
    (res) => {
      this.renewalInfo= JSON.parse(res.data)
      console.log("response", this.policyNumber);
    },
    (err) => {
      console.log("Error", err);
    }
  );
}

}
