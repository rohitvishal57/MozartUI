import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';

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
