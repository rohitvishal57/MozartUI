import { Component } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Options } from '@angular-slider/ngx-slider';
import { CommonService } from 'src/app/services/common.service';
import { NgToastService } from 'ng-angular-popup';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-get-quote',
  templateUrl: './get-quote.component.html',
  styleUrls: ['./get-quote.component.scss']
})
export class GetQuoteComponent {

  quoteFormGroup!: FormGroup;
  selectedOptions: string[] = [];
  selectedPlan: string = "Family Floater";
  selectedRelationships: string[] = [];
  selectedRelation: string = "";
  activeDropdown: number | null = null;
  showCard: boolean = false;
  showDropdownsFlag: boolean = false;
  showCustomDiv = false;
  selectedDropdown = '';
  relationCountMap: Map<string, number> = new Map([
    ["R003", 0],
    ["R004", 0]
  ]);
  sliderOptions: Options = {
    showTicks: true,
    showTicksValues: false,
    stepsArray: [
      { value: 500000 },   // 5L
      { value: 700000 },   // 7L
      { value: 1000000 },  // 10L
      { value: 1500000 },  // 15L
      { value: 2500000 },  // 25L
      { value: 5000000 },  // 50L
      { value: 10000000 },  // 1Cr
      { value: 20000000 } // 2Cr
    ],
    translate: (value: number): string => {
      return '';
    }
  };

  diseases = [
    { id: 'hypertension', value: 'hypertension', label: 'Hypertension' },
    { id: 'bloodpressure', value: 'bloodpressure', label: 'Blood-Pressure' },
    { id: 'cholesterol', value: 'cholesterol', label: 'Cholesterol' },
    { id: 'diabetes', value: 'diabetes', label: 'Diabetes' }
  ];

  proposerZone: any;
  proposerZoneValue: any;
  proposerCity: any;
  proposerState: any;
  selectedSumInsured: any;
  selectedDiseases: string[] = [];
  diseaseNames: string | null = null;

  multiIndiReqData: any = {
    proposerPincode: "",
    typeOfBusiness: "",
    isEmpoyee: false,
    sumInsured: "",
    noOfMembers: "",
    familySize: "1A",
    insuredMemberDetails: [
    ]
  }

  insuredMember: any = {
    relation: "",
    roomCategory: "",
    memberAge: "",
    sumInsured: "",
    isChronic: "",
    chronicDiseases: "",
    zone: "",
    memberGender: "",
    memberdob: "",
    memberRelationCode: "",
    pincode: "",
    city: "",
    zoneValue: "",
    state: ""
  }


  value: number = 5;


  relations: any[] = [
    {
      "id": "R001",
      "value": "Self",
      "name": "Self",
      "isIncrement": false,
      "imagePath": "assets/Img/icon_member_self.png",
      "age": null,
      "dob": "",
      "gender": "M"
    },
    {
      "id": "R002",
      "value": "Spouse",
      "name": "Spouse",
      "isIncrement": false,
      "imagePath": "assets/Img/icon_member_spouse.png",
      "age": null,
      "dob": "",
      "gender": "F"
    },
    {
      "id": "R005",
      "value": "Mother",
      "name": "Mother",
      "isIncrement": false,
      "imagePath": "assets/Img/icon_member_spouse.png",
      "age": null,
      "dob": "",
      "gender": "F"
    },
    {
      "id": "R006",
      "value": "Father",
      "name": "Father",
      "isIncrement": false,
      "imagePath": "assets/Img/icon_member_father.png",
      "age": null,
      "dob": "",
      "gender": "M"
    },
    {
      "id": "R007",
      "value": "Mother-In-Law",
      "name": "Mother-In-Law",
      "isIncrement": false,
      "imagePath": "assets/Img/icon_member_spouse.png",
      "age": null,
      "dob": "",
      "gender": "F"
    },
    {
      "id": "R008",
      "value": "Father-In-Law",
      "name": "Father-In-Law",
      "isIncrement": false,
      "imagePath": "assets/Img/icon_member_father.png",
      "age": null,
      "dob": "",
      "gender": "M"
    },
    {
      "id": "R003",
      "value": "Son1",
      "name": "Son1",
      "isIncrement": true,
      "imagePath": "assets/Img/icon_member_son.png",
      "age": null,
      "dob": "",
      "gender": "M"
    },
    {
      "id": "R004",
      "value": "Daughter1",
      "name": "Daughter1",
      "isIncrement": true,
      "imagePath": "assets/Img/icon_member_daughter.png",
      "age": null,
      "dob": "",
      "gender": "F"
    }
  ]

  constructor(private fb: FormBuilder,
    private route: Router, private snackBar: MatSnackBar, public service: CommonService, private toast: NgToastService) { }

  ngOnInit() {
    // this.quoteForm = this.fb.group(formControls);
    this.selectedSumInsured = this.sliderOptions?.stepsArray?.[0]?.value;
    this.quoteFormGroup = this.fb.group({
      proposerPincode: [null, [Validators.required, Validators.pattern('^[0-9]{6}$')]],
      proposerName: [null, [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
      mobileNumber: [null, [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      typeOfBusiness: ["NB"],
      isEmployee: [false],
      sumInsured: [this.selectedSumInsured, [Validators.required]],
      numberOfInsuredMembers: [null],
      familySize: [null],
      memberPolicyType: [this.selectedPlan],
      memberDobProposer:[''],
      memberAgeProposer:[''],
      insuredMembers: this.fb.group({}),
      insuredMemberDetails: this.fb.array([]) // This will be initialized with dynamic members
    });
    // Object.keys(this.multiIndiReqData).forEach((key: string)=>{
    //   if(Array.isArray(this.multiIndiReqData[key])){

    //   }
    // })
    // this.loadStoredData();
  }


  toggleDropdown(index: number): void {
    this.activeDropdown = this.activeDropdown === index ? null : index;
  }

  onRelationChange(event: any, relation: any) {
    const selectedValue = relation.value;

    if (event.target.checked) {
      if (!this.selectedRelationships.some(
        (existingRelation: any) => existingRelation.name === relation.name
      )) {
        this.selectedRelationships.push(relation);
      }
    } else {
      this.selectedRelationships = this.selectedRelationships.filter((r: any) => r.name !== relation.name);
      relation.age = null;
    }

    // this.saveDataToStorage();
  }

  onAgeChange(event: any, relation: any) {
    const dob = event.target.value;
    const dobArray = dob.split('-'); // Capture the entered age

    console.log(event.target.value);

    if (dobArray[0] as number >= 1800) {

      const age = this.calculateAge(dob);
      this.selectedRelationships.forEach((selectedRelation: any) => {
        if (selectedRelation.name == relation.name) {
          selectedRelation.age = age;
          selectedRelation.dob = dob;
          console.log(selectedRelation);
        }
      })
    }
    // this.saveDataToStorage(); // Save after updating the age
  }

  calculateAge(dob: Date): number | string {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    if (age < 1) {
      const diffInMs = today.getTime() - birthDate.getTime();
      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
      return `${diffInDays}days`;
    }

    return age;
  }

  onRelationshipNext() {
    this.selectedRelation = this.selectedRelationships.length > 0
      ? this.selectedRelationships.map((relation: any) => relation.value).join(', ')
      : 'Please select members';

    console.log(this.selectedRelation);
    // this.saveDataToStorage();
    this.activeDropdown = null;

    console.log('Selected Relationships:', this.selectedRelationships);
  }

  selectOption(option: string, index: number): void {
    this.selectedOptions[index] = option;
    this.showCustomDiv = false;
    // this.saveDataToStorage();
  }

  continueSelection(index: number, selectedOption: string) {
    console.log(index, selectedOption);
    this.selectedOptions[index] = selectedOption;
    // this.saveDataToStorage();
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

  formatTickLabel(value: number, forSlider: boolean): string {
    if (value >= 10000000) {
      return forSlider == true ? (value / 10000000) + 'Cr' : '₹' + (value / 10000000) + ' Crores';
    } else if (value >= 100000) {
      return forSlider == true ? (value / 100000) + 'L' : '₹' + (value / 100000) + ' Lakhs';
    }
    return value.toString();
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
    // this.saveDataToStorage();
  }

  continue() {
    console.log(this.quoteFormGroup);
    this.quoteFormGroup.get('insuredMemberDetails')?.value.forEach((item:any)=>{
      if(item.relation == 'Self'){
        this.quoteFormGroup.get('memberDobProposer')?.setValue(item.memberdob);
        this.quoteFormGroup.get('memberAgeProposer')?.setValue(item.memberAge);
        console.log(item);
      }
    })
    this.quoteFormGroup.get('numberOfInsuredMembers')?.setValue(this.selectedRelationships.length);
    this.quoteFormGroup.get('familySize')?.setValue(this.selectedRelationships.length + "A");
    console.log(this.quoteFormGroup.value);
    if (this.quoteFormGroup.valid) {
      console.log(this.quoteFormGroup.value);
      // this.saveDataToStorage();
      this.route.navigate(['quote/quoteProducts'], {
        state: { formData: this.quoteFormGroup.value }
      });
    } else {
      this.quoteFormGroup.markAllAsTouched();
      console.log('Form is invalid. Please correct the errors.', this.quoteFormGroup);
      this.showErrorMessage('Please complete all required fields correctly before proceeding.');
    }
  }

  showErrorMessage(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
    });
  }

  onSumInsuredSelect() {
    const sumInsuredValue = this.value;
    this.selectedOptions[2] = `${sumInsuredValue} Lakhs`;
    this.activeDropdown = null; // Close the dropdown
    // this.saveDataToStorage();
    console.log('Selected Sum Insured: ₹', this.selectedOptions[2]);
  }

  // incrementMember(relation: any) {
  //   let index = this.relations.length - 2;
  //   let baseRelation = JSON.parse(JSON.stringify(relation));

  //   baseRelation.isIncrement = false;
  //   baseRelation['deletable'] = true;
  //   baseRelation.name = relation.name + " " + (this.relationCountMap.get(relation.id) as number + 1);
  //   baseRelation.value = relation.name + " " + (this.relationCountMap.get(relation.id) as number + 1);
  //   this.relations.splice(index, 0, baseRelation);
  //   this.relationCountMap.set(relation.id, ((this.relationCountMap.get(relation.id) as number) + 1));
  // }

  incrementMember(relation: any) {
    // console.log(relation);
    // let index = this.relations.findIndex((rel) => rel.isIncrement === true);
    // let baseRelation = JSON.parse(JSON.stringify(relation));
    // baseRelation.isIncrement = false;
    // baseRelation['deletable'] = true;
    // let currentCount = this.relationCountMap.get(relation.id) as number;
    // currentCount += 1;
    // baseRelation.name = `${relation.name} ${currentCount}`;
    // baseRelation.value = `${relation.name} ${currentCount}`;
    // this.relations.splice(index, 0, baseRelation);
    // this.relationCountMap.set(relation.id, currentCount);

    let baseName = relation.name.replace(/\d+/g, ''); // No trim needed, as we don't want a space

    // Get the current count for the relation type (Son, Daughter, etc.)
    let currentCount = this.relationCountMap.get(relation.id) || 1; // Start count at 1 if not set

    let baseRelation = { ...relation }; // Deep copy the relation
    baseRelation.isIncrement = false; // Mark the cloned relation as a regular relation
    baseRelation['deletable'] = true; // Mark it as deletable

    currentCount += 1; // Increment the count
    baseRelation.name = `${baseName}${currentCount}`; // Set new name (e.g., Son2, Daughter2)
    baseRelation.value = `${baseName}${currentCount}`; // Update value accordingly

    // Insert the new relation at the correct index (right after the current one)
    let index = this.relations.indexOf(relation) + 1;
    this.relations.splice(index, 0, baseRelation); // Insert after the current relation

    // Update the count in the map
    this.relationCountMap.set(relation.id, currentCount);

  }

  removeMember(relation: any) {
    console.log(relation);
    console.log(this.relations);
    this.relations = this.relations.filter((element: any) => element.name !== relation.name);
    console.log(this.relations);
    this.selectedRelationships = this.selectedRelationships.filter((element: any) => element.name !== relation.name);
    this.selectedRelation = this.selectedRelationships.length > 0
      ? this.selectedRelationships.map((rel: any) => rel.value).join(', ')
      : 'Please select members';

    // Decrease the count of this particular relation in the map
    // const count = this.relationCountMap.get(relation.id) as number;
    // if (count > 1) {
    //   this.relationCountMap.set(relation.id, count - 1); // Decrement the count
    // }
  }


  onValueChange(newValue: number) {
    this.value = newValue;
    // this.saveDataToStorage();
    console.log('Slider value changed to:', newValue);
  }

  onDiseaseChange(event: any) {
    const selectedValue = event.target.value;
    console.log(selectedValue);

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
    // this.saveDataToStorage();
  }

  diseaseSelection() {
    this.diseaseNames = this.selectedDiseases.length > 0 ? this.selectedDiseases.join(', ') : '';
    const insuredMembersArray = this.quoteFormGroup.get('insuredMemberDetails') as FormArray;

    console.log(insuredMembersArray);

    insuredMembersArray.controls.forEach((control: AbstractControl) => {
      const memberGroup = control as FormGroup;
      memberGroup.get('chronicDiseases')?.setValue(this.diseaseNames != "" ? this.diseaseNames : null);
      memberGroup.get('isChronic')?.setValue(this.diseaseNames != "" ? "Yes" : "No");
    });
    this.activeDropdown = null;
    // this.saveDataToStorage();
  }

  isDiseaseSelected(disease: string): boolean {
    return this.selectedDiseases.includes(disease);
  }

  // saveDataToStorage() {
  //   const data = {
  //     selectedOptions: this.selectedOptions,          // Store selected options (array of strings)
  //     selectedPolicy: this.selectedPolicy,            // Store the selected policy type (e.g., Family Floater)
  //     selectedRelationships: this.selectedRelationships, // Store selected relationships
  //     selectedRelation: this.selectedRelation,         // Store currently selected dropdown
  //     relationCountMap: Array.from(this.relationCountMap.entries()),  // Convert Map to array of key-value pairs for storage
  //     proposerZone: this.proposerZone,                // Store proposer zone
  //     selectedSumInsured: this.selectedSumInsured,    // Store selected sum insured value
  //     selectedDiseases: this.selectedDiseases         // Store selected diseases (array of strings)
  //   };

  //   console.log(data);  // Log data object to check the contents before saving

  //   // Save the data object to localStorage
  //   localStorage.setItem('quoteFormData', JSON.stringify(data));
  //   console.log('Data saved to LocalStorage:', data);
  // }


  // Load stored data from LocalStorage
  // loadStoredData() {
  //   const storedData = localStorage.getItem('quoteFormData');
  //   if (storedData) {
  //     const parsedData = JSON.parse(storedData);

  //     this.selectedOptions = parsedData.selectedOptions || [];
  //     this.selectedPolicy = parsedData.selectedPolicy || "Family Floater";
  //     this.selectedRelationships = parsedData.selectedRelationships || [];
  //     this.selectedRelation = parsedData.selectedRelation || "";
  //     this.relationCountMap = new Map(parsedData.relationCountMap);  // Convert back to Map
  //     this.proposerZone = parsedData.proposerZone || null;
  //     this.selectedSumInsured = parsedData.selectedSumInsured || this.sliderOptions?.stepsArray?.[0]?.value;
  //     this.selectedDiseases = parsedData.selectedDiseases || [];

  //     console.log('Data loaded from LocalStorage:', parsedData);
  //   }
  // }

  //my-changes

  onPlanTypeChange(planType: string) {
    this.selectedPlan = planType;
    this.quoteFormGroup.get('memberPolicyType')?.setValue(planType);
    this.activeDropdown = null;
  }

  onSumInsuredChange(eventValue: any) {
    this.selectedSumInsured = eventValue;
  }

  updateSumInsured() {
    this.quoteFormGroup.get('sumInsured')?.setValue(this.selectedSumInsured);

    const insuredMembersArray = this.quoteFormGroup.get('insuredMemberDetails') as FormArray;
    if (insuredMembersArray) {
      insuredMembersArray.controls.forEach((control: AbstractControl) => {
        const memberGroup = control as FormGroup;
        memberGroup.get('sumInsured')?.setValue(this.selectedSumInsured);
      });
      // this.saveDataToStorage();

      this.activeDropdown = null;
    }
  }

  // Add new member details
  addInsuredMemberDetails(): void {
    // Mark required fields as touched
    // this.quoteFormGroup.get('proposerName')?.markAsTouched();
    // this.quoteFormGroup.get('proposerPincode')?.markAsTouched();
    // this.quoteFormGroup.get('mobileNumber')?.markAsTouched();

    // Check if the form is valid before proceeding
    if (this.quoteFormGroup.valid) {
      this.quoteFormGroup.markAllAsTouched();
      const insuredMembersGroup = this.fb.group({});
      this.quoteFormGroup.setControl('insuredMembers', insuredMembersGroup);

      // Reset the insuredMemberDetails array
      const insuredMemberDetailsArray = this.fb.array([]) as FormArray;
      this.quoteFormGroup.setControl('insuredMemberDetails', insuredMemberDetailsArray);

      // Add controls for the currently selected relationships
      this.selectedRelationships.forEach((relation: any) => {
        insuredMembersGroup.addControl(relation.value, this.fb.control(true));

        const memberGroup = this.fb.group({
          relation: [relation.value],
          roomCategory: [""],
          memberAge: [relation.age, [Validators.required]],
          sumInsured: [this.quoteFormGroup.get('sumInsured')?.value, [Validators.required]],
          isChronic: ["No"],
          chronicDiseases: [this.diseaseNames],
          zone: [this.proposerZone],
          memberGender: [relation.gender, [Validators.required]],
          memberdob: [relation.dob, [Validators.required]],
          memberRelationCode: [24, [Validators.required]],
          pincode: [this.quoteFormGroup.get('proposerPincode')?.value],
          city: [this.proposerCity],
          zoneValue: [this.proposerZone],
          state: [this.proposerState]
        });

        insuredMemberDetailsArray.push(memberGroup);
      });

      // Update selectedRelation string for display
      this.selectedRelation = this.selectedRelationships.length > 0
        ? this.selectedRelationships.map((relation: any) => relation.value).join(', ')
        : 'Please select members';

      console.log(this.selectedRelation);
      // Optionally save data to storage
      // this.saveDataToStorage();
      this.activeDropdown = null;
    } else {
      // Show error toast if form is invalid
      this.toast.error({
        detail: "Error",
        summary: "Please fill all the details before proceeding.",
        duration: 3000
      });
    }
  }


  get insuredMemberDetails(): FormArray {
    return this.quoteFormGroup.get('insuredMemberDetails') as FormArray;
  }


  // getProposerPincode(event: any) {

  //   console.log(event.target.value, typeof event)
  //   const reqdata = {
  //     "pincode": event.target.value
  //   }
  //   this.service.getPinCodeByCity(reqdata).subscribe({
  //     next: (res) => {
  //       console.log(res)
  //       this.proposerZone = res.data.zone;
  //       this.proposerCity = res.data.city;
  //       this.proposerState = res.data.state;
  //       this.proposerZoneValue = res.data.zoneCode;
  //     },
  //     error: (err) => {
  //       console.error(err)
  //       this.toast.warning({ detail: "WARNING", summary: "Could not fetch pincode details.", duration: 1000 });
  //     }
  //   });

  // }

}
