import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import {MatSliderModule} from '@angular/material/slider';

@Component({
  selector: 'app-get-quote',
  templateUrl: './get-quote.component.html',
  styleUrls: ['./get-quote.component.scss']
})
export class GetQuoteComponent {

  displayNoProductsMessage: boolean = false;
  ProductList: any[] = [];
  products: any[] = []
  isDropdownModalOpen = false;
  selectedDropdownIndex: number = 0;

  quoteForm!: FormGroup;

  selectedOptions:string[]= [];
  activeDropdown: number | null = null;
  showCard: boolean = false;
  showDropdownsFlag: boolean = false;
  showCustomDiv = false;
  selectedDropdown = '';

  sumInsuredValues: number[] = [200000, 300000, 400000, 500000, 700000, 1000000, 1500000, 2000000, 2500000, 5000000, 7500000, 10000000, 20000000, 30000000, 40000000, 50000000, 60000000];
  selectedSumInsured: number = this.sumInsuredValues[0];

  constructor(private fb: FormBuilder, private loginService: LoginService, @Inject(DOCUMENT) private document: Document,
    private route: Router) { }

  ngOnInit() {
    const formControls: { [key: string]: FormControl } = {};
    this.quoteForm = this.fb.group(formControls);
  }

  toggleDropdown(index: number): void {
    this.activeDropdown = this.activeDropdown === index ? null : index;
  }

  selectOption(option: string, index: number): void {
    this.selectedOptions[index] = option;
    this.showCustomDiv = false;
  }

  selectSumInsured(event: any): void {
    const index = event.value;
    console.log(index,event);
    
    if (index >= 0 && index < this.sumInsuredValues.length) {
      this.selectedSumInsured = this.sumInsuredValues[index];
    }
  }

  continueSelection(index: number, selectedOption: string) {
    console.log(index,selectedOption);
    this.selectedOptions[index] = selectedOption; 
  }

  openCustomDiv(label: string, index: number) {
    if (this.activeDropdown === index) {
      // If the dropdown is already open, close it
      this.activeDropdown = null;
    } else {
      // Otherwise, set the active dropdown and show its content
      this.selectedDropdown = label;
      this.activeDropdown = index;
    }
  }

  showDropdowns() {
    this.showDropdownsFlag = true;
  }

  closeCustomDiv() {
    this.activeDropdown = null;
  }


  dropdownOptions = [
    {
      label: 'Policy Type',
      options: []
    },
    {
      label: 'Relationship',
      options: []
    },
    {
      label: 'Sum Insured',
      options: []
    },
    {
      label: 'Chronic',
      options: []
    }
  ];

  // formatLabel(value: number): string {
  //   if (value < 0 || value >= this.sumInsuredValues.length) {
  //     return '';
  //   }
  //   const insuredValue = this.sumInsuredValues[value];
  //   console.log(insuredValue);
  //   return insuredValue >= 100000 ? `${insuredValue / 100000}L` : `${insuredValue}`;
  // }

   formatLabel(value: number): string {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }

    return `${value}`;
  }


  onSubmit() {
    // Implement API logic here
  }

  getQuote() {
    console.log("Clicked");
    this.showCard = true;
    this.showDropdownsFlag = true;
    console.log('showCard:', this.showCard);
  }

  continue() {
    this.route.navigate(['portal/abhi/quoteProducts'])
  }

}
