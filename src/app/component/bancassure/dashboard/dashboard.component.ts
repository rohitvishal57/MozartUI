import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  proposalNum: any;
  verticalCode = localStorage.getItem('verticalCode');
  
  code = localStorage.getItem('code');
  displayNoProductsMessage: boolean = false;
  ProductList: any[] = [];
  products: any[] = []
  isDropdownModalOpen = false;
  selectedDropdownIndex: number = 0;
  selectedDropdown: any;

  quoteForm!: FormGroup;

  selectedOptions: { [key: number]: string } = {};
  activeDropdown: number | null = null;

  constructor(private fb: FormBuilder, private loginService: LoginService,@Inject(DOCUMENT) private document: Document,
                private route:Router) {}

  ngOnInit() {
    console.log(this.verticalCode);
    console.log(this.code);
    const formControls: { [key: string]: FormControl } = {};
    this.dropdownOptions.forEach((dropdown, index) => {
      const defaultValue = dropdown.options.length > 0 ? dropdown.options[0].value : '';
      formControls[`dropdown${index}`] = new FormControl(defaultValue);
    });

    this.quoteForm = this.fb.group(formControls);
  }

  openDropdownModal(index: number) {
    this.selectedDropdownIndex = index;
    this.selectedDropdown = this.dropdownOptions[index];
    this.isDropdownModalOpen = true;
  }

  closeDropdownModal() {
    this.isDropdownModalOpen = false;
  }

  toggleDropdown(index: number): void {
    console.log(index,this.activeDropdown);
    this.activeDropdown = this.activeDropdown === index ? null : index;
    console.log(index,this.activeDropdown);

  }

  selectOption(option: any) {
    this.selectedDropdown.selectedValue = option.label;
    this.closeDropdownModal();
  }

  saveOption(value: string, index: number): void {
    this.selectedOptions[index] = value;
    this.activeDropdown = null;
  }
  
  dropdownOptions = [
    {
      label: 'Policy Type',
      options: [
        { label: 'Family Floater', value: 'Family Floater' },
        { label: 'Multi Individual', value: 'Multi Individual' },
      ]
    },
    {
      label: 'Select Relationship',
      options: [
        { label: 'Self', value: 'Self' },
      ]
    },
    {
      label: 'Select Sum Insured',
      options: [
        { label: '5 Lakhs', value: '5 Lakhs' },
        { label: '10 Lakhs', value: '10 Lakhs' },
        { label: '15 Lakhs', value: '15 Lakhs' },
      ]
    },
    {
      label: 'Chronic',
      options: [
        { label: 'Hypertension', value: 'Hypertension' },
        { label: 'Hyperlipidaemia', value: 'Hyperlipidaemia' },
        { label: 'Diabetes', value: 'Diabetes' },
        {label:'Asthma',value:'Asthma'},
        {label:'PTCA', value:'PTCA'},
        {label:'COPD', value:'COPD'},
        {label:'HighBMI', value:'HighBMI'}
      ]
    },
    {
      label: 'Product',
      options: []
    }
  ];

  populateProductDropdown() {
    const productDropdown = this.dropdownOptions.find(option => option.label === 'Product');
    if (productDropdown) {
      productDropdown.options = this.ProductList.map(product => ({
        label: product.productname,
        value: product.productid  
      }));
      this.quoteForm.get('dropdown4')?.setValue(productDropdown.options[0]?.value);
    }
  }


  async getProposalNum() {
    try {
      const res = await firstValueFrom(this.loginService.getProposalNumber());
      this.proposalNum = res;
    } catch (error) {
      console.error(error);
    }
  }


  onSubmit() {
    // Implement API logic here
  }

  continue(){
    this.route.navigate(['portal/abhi/quoteProducts'])
  }
  
}
