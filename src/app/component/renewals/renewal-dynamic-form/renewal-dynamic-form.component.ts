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
  homeAddress: any = {};


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
     this.renewalService.policy$.subscribe(policy => {
      if(policy.policyNo){
      this.policyNumber=policy.policyNo;
    }
    });
    this.getRenewalInfo();
    this.initializeForm();
  }

  initializeForm() {
    this.form = this.fb.group(this.homeAddress);
    console.log(this.form);
  }

  initForm() {
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
          this.form.addControl(control.name, this.fb.control(control.value, validatorsArray));
        });
      });
    }
    console.log('Nominee form controls:', this.form.controls);
  }
  
  proposerObject(){
    this.renewalService.getRenewalInfo().subscribe((info) => {
      if (info) {
        this.renewalInfo=info;
      }
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
          console.log(this.form.value);
          
          break;
        case 'addNominee':
          this.formId=5001;
          break;  
        default:
          console.warn('Unknown action:', event);
      }
      this.proposerObject()
    }

  onRadioChange(controlName: string, value: string): void {
    this.form.get(controlName)?.setValue(value);
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
    if (value == 5005) {//edit address
      // this.loadAddressDetails();
      this.formId = value;
    }else if (value == 5004) {//add nominee
      this.formId = value;
    }else if (value == 5003) {//edit detail
      this.formId = value;
    }else if (value == 5002) {// add memeber
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

fetchTenureDetails(): void { 
  this.http.get<any[]>('/assets/jsonValue/tenure-details.json').subscribe(tenureDetailsData => {
    this.tenureDetails = tenureDetailsData;
  });    
}

fetchAddOns(): void {  
  this.http.get<any[]>('/assets/jsonValue/health-add-ons.json').subscribe(healthAddOnsData => {
    this.healthAddOns = healthAddOnsData;
  });    
}


fetchCoverages(): void {  
  this.http.get<any[]>('/assets/jsonValue/optional-coverages.json').subscribe(coveragesData => {
    this.coverages = coveragesData;
  });
}

fetchRoomUpgradeBenefits(): void {  
  this.http.get<any[]>('/assets/jsonValue/rooms.json').subscribe(roomUpgradeBenefitsData => {
    this.roomUpgradeBenefits = roomUpgradeBenefitsData;
  });
}

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
    this.proposerObject();
  } else if (this.activeSection === 'additional') {
    this.setSection('payment');
  } else if (this.activeSection === 'payment') {
  }
}

renewNow(){
  this.setSection('payment')
}

getRenewalInfo() {
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

loadAddressDetails() {
  if (this.renewalInfo?.response?.policyData?.length > 0) {
    this.homeAddress = { ...this.renewalInfo.response.policyData[0].HomeAddress };
    console.log(this.homeAddress);
    
  }
}


}
