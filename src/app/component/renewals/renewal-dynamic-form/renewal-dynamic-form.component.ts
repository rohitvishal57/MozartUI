import { HttpClient } from '@angular/common/http';
import { Component, HostListener, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IDynamicControl, IFormControl } from 'src/app/interface/form.interface';

@Component({
  selector: 'app-renewal-dynamic-form',
  templateUrl: './renewal-dynamic-form.component.html',
  styleUrls: ['./renewal-dynamic-form.component.scss']
})
export class RenewalDynamicFormComponent implements OnInit {
  @Input() section: any;
  nomineeForm: FormGroup = this.fb.group({});
  formConfig: any;
  formId: number = 1;
  mainCnt: number =1;
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
  planDetail : boolean = false

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.fetchAddOns()
    this.fetchCoverages();
    this.fetchRoomUpgradeBenefits();
    this.fetchTenureDetails();
    // this.handleForms(5002);
    this.planDetail = true
    // this.selectButton('payment','policySummary');
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

  addNominee() {
    // Logic to add another nominee
  }

  onRadioChange(controlName: string, value: string): void {
    this.nomineeForm.get(controlName)?.setValue(value);
  }

  toggleSelect(option: any) {
    option.selected = !option.selected;
  }

  hasAnyValue(control: IFormControl | IDynamicControl, parentControl: IFormControl | null = null): boolean {
    let controlValue: any;
    if (parentControl != null) {
        const formArray = this.nomineeForm.get(parentControl.name) as FormArray;
        controlValue = formArray.get(control.name)?.value;
    } else {
        controlValue = this.nomineeForm.get(control.name)?.value;
    }
    return controlValue != null && controlValue !== '';
}
 
rangeValue: { [key: string]: number } = { sumInsured: 500000 };

updateRangeValue(event: any, controlName: string) {
  const value = event.target.value;
  // if(value == 3000000){
  //   this.rangeValue[controlName] = (this.rangeValue[controlName]+value)-500000
  // }
  // else if(value > 2500000){
  //   this.rangeValue[controlName] = (this.rangeValue[controlName]+value)
  // }
    // const value = event.target.value;
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
  this.selectedButton = button; 

  if (this.selectedButton === 'primary') {
      this.mainCnt = 1;
      this.formConfig = [];
      this.policySummarys=false;
      if (value == 5005) {
        this.planDetail=true
        this.formId = value;
        this.initializeForm();
        this.http.get<any[]>('/assets/jsonValue/renewEditAddress.json').subscribe(data => {
          this.formConfig = data;
          this.populateFormControls();
        });
  
      } else if (value == 5004) {
        this.planDetail=true
        this.formId = value;
        this.initializeForm();
        this.http.get<any[]>('/assets/jsonValue/renewalForms.json').subscribe(data => {
          this.formConfig = data;
          this.populateFormControls();
        });
  
      } else if (value == 5003) {
        this.planDetail=false
        this.formId = value;
        this.initializeForm();
        this.http.get<any[]>('/assets/jsonValue/editMemberDetail.json').subscribe(data => {
          this.formConfig = data;
          this.populateFormControls();
        });
  
      } else if (value == 5002) {
        this.planDetail=false
        this.formId = value;
        this.initializeForm();
        this.http.get<any[]>('/assets/jsonValue/addNewMember.json').subscribe(data => {
          this.formConfig = data;
          this.populateFormControls();
        });
  
      } else {
        this.formId = 1;
        this.planDetail=true
      }
  } 
  else if (this.selectedButton === 'additional') {
      this.mainCnt = 3;
      this.policySummarys=false;
  } 
  else if (this.selectedButton == 'payment') {
    if(value == 'policySummary'){
       this.policySummarys=true
       this.planDetail=true
    }
    else{
      this.policySummarys=false;
      this.mainCnt = 2;
      this.planDetail=false
    }
  }
}


updatePrimarycnt(btnControl : any){
  if(btnControl == 'Add Member'){
          this.selectButton('primary',5002)
  }
  else if(btnControl == 'Save Updates'){
    this.selectButton('primary',1)
}

}
// loadPageContent(mainCnt:any) {

// }
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
  // Check if the coverage is already selected
  const index = this.selectedCoverages.findIndex(c => c.id === coverage.id);
  if (index > -1) {
    // If already selected, remove it
    this.selectedCoverages.splice(index, 1);
  } else {
    // Otherwise, add it to the list
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

}
