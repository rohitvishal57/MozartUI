import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { MatSliderModule } from '@angular/material/slider';
import { Options } from '@angular-slider/ngx-slider';

@Component({
  selector: 'app-get-quote',
  templateUrl: './get-quote.component.html',
  styleUrls: ['./get-quote.component.scss']
})
export class GetQuoteComponent {

  quoteForm!: FormGroup;
  selectedOptions: string[] = [];
  activeDropdown: number | null = null;
  showCard: boolean = false;
  showDropdownsFlag: boolean = false;
  showCustomDiv = false;
  selectedDropdown = '';

  value: number = 25;
  options: Options = {
    floor: 5,
    ceil: 200,
    step: 5,
    showTicks: true,
    showTicksValues: true,
    ticksArray: [5, 7, 10, 15, 20, 25, 50, 100, 200],
    translate: (value: number): string => {
      return '';
    }
  };

  relations: any[] = [
    {
      "id": "R001",
      "value": "Self",
      "name": "Self",
      "isIncrement": false,
      "imagePath": "../../../../assets/images/icon_member_self.png"
    },
    {
      "id": "R002",
      "value": "Spouse",
      "name": "Spouse",
      "isIncrement": false,
      "imagePath": "../../../../assets/images/icon_member_spouse.png"
    },
    {
      "id": "R005",
      "value": "Mother",
      "name": "Mother",
      "isIncrement": false,
      "imagePath": "../../../../assets/images/icon_member_spouse.png"
    },
    {
      "id": "R006",
      "value": "Father",
      "name": "Father",
      "isIncrement": false,
      "imagePath": "../../../../assets/images/icon_member_father.png"
    },
    {
      "id": "R007",
      "value": "Mother-In-Law",
      "name": "Mother-In-Law",
      "isIncrement": false,
      "imagePath": "../../../../assets/images/icon_member_spouse.png"
    },
    {
      "id": "R008",
      "value": "Father-In-Law",
      "name": "Father-In-Law",
      "isIncrement": false,
      "imagePath": "../../../../assets/images/icon_member_father.png"
    },
    {
      "id": "R003",
      "value": "Son 1",
      "name": "Son 1",
      "isIncrement": true,
      "imagePath": "../../../../assets/images/icon_member_son.png"
    },
    {
      "id": "R004",
      "value": "Daughter 1",
      "name": "Daughter 1",
      "isIncrement": true,
      "imagePath": "../../../../assets/images/icon_member_daughter.png"
    }
  ]

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
    console.log(index, selectedOption);
    this.selectedOptions[index] = selectedOption;
  }

  openCustomDiv(label: string, index: number) {
    if (this.activeDropdown === index) {
      this.activeDropdown = null;
    } else {
      console.log(label);

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

  formatTickLabel(value: number): string {
    if (value >= 100) {
      return (value / 100).toFixed(0) + 'Cr';
    } else {
      return value + 'L';
    }
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
      label: 'Diseases',
      options: []
    }
  ];


  getQuote() {
    console.log("Clicked");
    this.showCard = true;
    this.showDropdownsFlag = true;
    console.log('showCard:', this.showCard);
  }

  continue() {
    this.route.navigate(['portal/abhi/quoteProducts'])
  }

  onSumInsuredSelect() {
    console.log('Selected Sum Insured: ₹', 'Lakhs');
  }

  onValueChange(newValue: number) {
    console.log('Slider value changed to:', newValue);
  }

}
