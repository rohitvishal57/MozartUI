import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
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
  relationCountMap: Map<string, number> = new Map([
    ["R003",0],
    ["R004",0]
  ]);  
  selectedSumInsured: number | null = null;
  selectedDiseases: string[] = [];

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
      "value": "Son",
      "name": "Son",
      "isIncrement": true,
      "imagePath": "../../../../assets/images/icon_member_son.png"
    },
    {
      "id": "R004",
      "value": "Daughter",
      "name": "Daughter",
      "isIncrement": true,
      "imagePath": "../../../../assets/images/icon_member_daughter.png"
    }
  ]

  constructor(private fb: FormBuilder, private loginService: LoginService, @Inject(DOCUMENT) private document: Document,
    private route: Router) { }

  ngOnInit() {
    const formControls: { [key: string]: FormControl } = {};
    this.quoteForm = this.fb.group(formControls);
    this.loadStoredData();
  }

  toggleDropdown(index: number): void {
    this.activeDropdown = this.activeDropdown === index ? null : index;
  }

  selectOption(option: string, index: number): void {
    this.selectedOptions[index] = option;
    this.showCustomDiv = false;
    this.saveDataToStorage();
  }

  continueSelection(index: number, selectedOption: string) {
    console.log(index,selectedOption);
    this.selectedOptions[index] = selectedOption; 
    this.saveDataToStorage();
  }

  openCustomDiv(label: string, index: number) {
    if (this.activeDropdown === index) {
      this.activeDropdown = null;
    } else {
      console.log(label);
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
    this.showCard = true;
    this.showDropdownsFlag = true;
    console.log('showCard:', this.showCard);
    this.saveDataToStorage();
  }

  continue() {
    this.saveDataToStorage();
    this.route.navigate(['portal/abhi/quoteProducts'])
  }

  onSumInsuredSelect() {
    const sumInsuredValue = this.value; // Get the current slider value
    this.selectedOptions[2] = `${sumInsuredValue} Lakhs`; // Assuming 'Sum Insured' is the third option (index 2)
    this.activeDropdown = null; // Close the dropdown
    this.saveDataToStorage();
    console.log('Selected Sum Insured: ₹', this.selectedOptions[2]);
  }

  incrementMember(relation : any){
    let index = this.relations.length-2;
    let baseRelation = JSON.parse(JSON.stringify(relation));

    baseRelation.isIncrement = false;
    baseRelation['deletable'] = true;
    baseRelation.name = relation.name + " " + (this.relationCountMap.get(relation.id) as number + 1);
    baseRelation.value = relation.name + " " + (this.relationCountMap.get(relation.id) as number + 1);
    this.relations.splice(index,0,baseRelation);
    this.relationCountMap.set(relation.name,((this.relationCountMap.get(relation.id) as number) + 1));
  }

  removeMember(relation: any) {
    console.log(relation);
    console.log(this.relations);
  
    // Filter out the relation that matches the name and value of the provided relation
    this.relations = this.relations.filter((element: any) => element.name !== relation.name);
  
    console.log(this.relations);
  
    // Decrease the count of this particular relation in the map
    const count = this.relationCountMap.get(relation.value) as number;
    if (count > 1) {
      this.relationCountMap.set(relation.value, count - 1); // Decrement the count
    }
  }

   onValueChange(newValue: number) {
    this.value = newValue; 
    this.saveDataToStorage();
    console.log('Slider value changed to:', newValue);
  }

  onDiseaseChange(event: any) {
    const selectedValue = event.target.value;
  
    if (event.target.checked) {
      // Add the value to the array if the checkbox is checked and not already present
      if (!this.selectedDiseases.includes(selectedValue)) {
        this.selectedDiseases.push(selectedValue);
      }
    } else {
      // Remove the value from the array if the checkbox is unchecked
      this.selectedDiseases = this.selectedDiseases.filter(disease => disease !== selectedValue);
    }
    console.log('Selected Diseases:', this.selectedDiseases);
    this.saveDataToStorage();
  }

  diseaseSelection() {
    this.selectedOptions[3] = this.selectedDiseases.length > 0 ? this.selectedDiseases.join(', ') : 'No Diseases Selected';
    this.activeDropdown = null;
    this.saveDataToStorage();
  }

  isDiseaseSelected(disease: string): boolean {
    return this.selectedDiseases.includes(disease);
  }

  saveDataToStorage() {
    const data = {
      selectedOptions: this.selectedOptions,
      value: this.value,
      selectedDiseases: this.selectedDiseases,
      showCard: this.showCard 
    };
    console.log(data);
    localStorage.setItem('quoteFormData', JSON.stringify(data));
    console.log('Data saved to LocalStorage:', data);
  }

  // Load stored data from LocalStorage
  loadStoredData() {
    const storedData = localStorage.getItem('quoteFormData');
    console.log(storedData);
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      this.selectedOptions = parsedData.selectedOptions || [];
      this.value = parsedData.value || this.value;
      this.selectedDiseases = parsedData.selectedDiseases || [];
      this.showCard = parsedData.showCard || false;
      this.showDropdownsFlag = this.showCard;
      console.log('Data loaded from LocalStorage:', parsedData);
    }
  }

}
