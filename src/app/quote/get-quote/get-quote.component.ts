import { Component, AfterViewChecked, ViewChild, ElementRef, HostListener } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Options } from '@angular-slider/ngx-slider';
import { CommonService } from 'src/app/services/common.service';
import { NgToastService } from 'ng-angular-popup';
import { MatSnackBar } from '@angular/material/snack-bar';
import { QuoteService } from '../quote.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { LanguageService } from 'src/app/services/language.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-get-quote',
  templateUrl: './get-quote.component.html',
  styleUrls: ['./get-quote.component.scss']
})
export class GetQuoteComponent implements AfterViewChecked {

  quoteFormGroup!: FormGroup;
  selectedOptions: string[] = [];
  selectedPlan: string = "Family Floater";
  selectedRelationships: string[] = [];
  selectedRelation: string = "";
  minimumMembersRequired = 2;
  activeDropdown: number | null = null;
  showCard: boolean = false;
  showDropdownsFlag: boolean = false;
  showCustomDiv = false;
  selectedDropdown = '';
  upgradableZones: any[] = [];
  upgradedZone: string = '';
  currentZone: string = '';
  showErrors: any;
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
    { id: 'PTCA', value: 'PTCA', label: 'PTCA' },
    { id: 'hypertension', value: 'hypertension', label: 'Hypertension' },
    { id: 'diabetesMellitus', value: 'diabetes', label: 'Diabetes Mellitus' },
    { id: 'COPD', value: 'copd', label: 'COPD' },
    { id: 'Asthma', value: 'asthma', label: 'Asthma' },
    { id: 'hyperlipidemia', value: 'hyperlipidemia', label: 'Hyperlipidemia' },
    { id: 'highBMI', value: 'highBMI', label: 'High BMI' }

  ];
  proposerZone: any;
  proposerZoneValue: any = '';
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
  currentDate = new Date().toISOString().split('T')[0];
  addHide: boolean = false;
  numberOfChild: any = 0;
  relations: any[] = [
    {
      "id": "R001",
      "relationCode": 25,
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
      "relationCode": 24,
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
      "relationCode": 22,
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
      "relationCode": 20,
      "value": "Father",
      "name": "Father",
      "isIncrement": false,
      "imagePath": "assets/Img/icon_member_father.png",
      "age": null,
      "dob": "",
      "gender": "M"
    },
    {
      "id": "R003",
      "relationCode": 23,
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
      "relationCode": 19,
      "value": "Daughter1",
      "name": "Daughter1",
      "isIncrement": true,
      "imagePath": "assets/Img/icon_member_daughter.png",
      "age": null,
      "dob": "",
      "gender": "F"
    }
  ]
  anotherRelations = JSON.stringify(this.relations);
  anotherRelationCountMap: [string, number][] = [
    ["R003", 0],
    ["R004", 0],
  ];
  checkGender: boolean = false;
  pageName: string | undefined;
  formData: any;
  datePlaceholder: string = '';
  isDesktopView: boolean = false;
  isStandalone: boolean = false;
  constructor(private fb: FormBuilder, private encryptionService: EncryptionService,
    private route: Router, private snackBar: MatSnackBar, public service: CommonService, private toast: NgToastService, private languageService: LanguageService,
    private translateService: TranslateService, private router: Router, private quoteService: QuoteService) { }

  ngOnInit() {
    this.languageService.language$.subscribe(lang => {
      this.translateService.use(lang).subscribe({
        error: () => {
          this.translateService.use('en'); // Fallback to English if translation file is missing
        }
      });
    });
    this.loadSelectedDiseases();
    console.log(this.currentDate);
    console.log(this.relationCountMap, this.anotherRelationCountMap);
    // this.quoteForm = this.fb.group(formControls);
    this.selectedSumInsured = this.sliderOptions?.stepsArray?.[0]?.value;
        if (sessionStorage.getItem('formData') && sessionStorage.getItem('relations') && !this.router.url.includes('dashboard')) {
      this.formData = this.encryptionService.decrypt(sessionStorage.getItem('formData') as string);
      this.relations = this.encryptionService.decrypt(sessionStorage.getItem('relations') as string);
    }
    console.log(this.formData, this.relations);
    if (this.formData && (this.formData.currentZone || this.formData.zoneValue || this.formData.zone || this.formData.upgradableZones || this.formData.memberPolicyType)) {
      this.currentZone = this.formData.currentZone;
      this.proposerZoneValue = this.formData.zoneValue;
      this.proposerZone = this.formData.zone;
      this.upgradableZones = this.formData.upgradableZones;
      this.selectedPlan = this.formData.memberPolicyType;
    }
    this.quoteFormGroup = this.fb.group({
      proposerPincode: [null, [Validators.required, Validators.pattern('^[0-9]{6}$'), Validators.maxLength(6)]],
      proposerName: [null, [Validators.required, Validators.pattern('^[a-zA-Z ]*$'), Validators.maxLength(30)]],
      mobileNumber: [null, [Validators.required, Validators.pattern('^[6-9][0-9]{9}$'), Validators.maxLength(10)]],
      proposerGender: [null, [Validators.required]],
      typeOfBusiness: ["NB"],
      zoneValue: [this.proposerZoneValue],
      currentZone: [this.currentZone],
      upgradableZones: [this.upgradableZones],
      zone: [this.proposerZone],
      isEmployee: [false],
      sumInsured: [this.selectedSumInsured, [Validators.required]],
      numberOfInsuredMembers: [null],
      familySize: [null],
      memberPolicyType: [this.selectedPlan],
      memberDobProposer: [''],
      memberAgeProposer: [''],
      isPortability: [null],
      isChronicCare: ["N"],
      insuredMembers: this.fb.group({}),
      insuredMemberDetails: this.fb.array([]), // This will be initialized with dynamic members
    });
    if (this.route.url.includes('dashboard')) {
      this.onPlanTypeChange(this.selectedPlan)
    }
    if (this.formData) {
      this.quoteFormGroup.patchValue(this.formData);
      console.log(this.formData);
      // if (formData.memberPolicyType) {
      //   this.onPlanTypeChange(formData.memberPolicyType);
      // }
      if (this.formData.upgradableZones) {
        this.upgradableZones = this.formData.upgradableZones;
      }
      if (this.formData.sumInsured) {
        this.selectedSumInsured = this.formData.sumInsured;
      }
      // if(formData.proposerGender){
      //   this.onGenderChange();
      // }
      if (this.formData.insuredMembers && this.formData.insuredMemberDetails.length > 0) {
        // const currentMember:any = {};

        // Add members from `this.relations` in the exact sequence
        // this.relations.forEach(relation => {
        //   currentMember[relation.value] = formData.insuredMembers[relation.value] ?? false;
        //   if (relation.value.startsWith('Son') || relation.value.startsWith('Daughter')) {
        //     Object.keys(formData.insuredMembers).forEach(key => {
        //       if (key.startsWith('Son') || key.startsWith('Daughter')) {
        //         currentMember[key] = formData.insuredMembers[key] ?? false;
        //       }
        //     });
        //   }
        // });

        // Check for any "Son" or "Daughter" keys in formData.insuredMembers dynamically

        // Log the final result
        // console.log(JSON.stringify(currentMember, null, 2));
        this.checkGender = true;
        this.relations = this.encryptionService.decrypt(sessionStorage.getItem('relations') as string);
        console.log(this.relations);
        console.log(this.relationCountMap, this.anotherRelationCountMap);
        this.relations.forEach((item: any) => {
          Object.entries(this.formData.insuredMembers).forEach(([memberName, isIncluded], index) => {
            const mockEvent = { target: { checked: isIncluded } };
            if (item.name == memberName) {
              console.log(item, memberName);
              if (this.relationCountMap.has(item.id)) {
                let currentCount: any = this.relationCountMap.get(item.id) || 1;
                currentCount += 1;
                this.relationCountMap.set(item.id, currentCount);
              }
              this.formData.insuredMemberDetails.forEach((member: any) => {
                if (member.relation == memberName) {
                  item.age = member.memberAge;
                  item.dob = member.memberdob;
                  item.gender = member.memberGender;
                }
              })
              console.log(mockEvent, item, this.formData.insuredMemberDetails);

              this.onRelationChange(mockEvent, item);
            }
          });
        })
        // Object.entries(currentMember).forEach(([memberName, isIncluded],index) => {
        //   console.log(`${memberName}: ${isIncluded}`,this.selectedRelationships);
        //   console.log(memberName.includes("Son"),memberName.includes("Daughter"));
        //   const mockEvent = { target: { checked: isIncluded } };
        //   if (memberName.includes("Son") || memberName.includes("Daughter")) {
        //     const basename = memberName.replace(/\d+/g, '1');
        //     const newIndex = parseInt(memberName.replace(/\D/g, ''), 10) + 1;
        //     const newitem = memberName.replace(/\d+/g, `${newIndex}`);
        //     console.log(newIndex);
        //     console.log(basename, memberName);
        //     // const basemember = this.relations.find(relation => relation.name === basename);
        //     // if(basename){
        //     //   const newMember = { ...basemember };
        //     //   newMember.name = memberName;
        //     //   newMember.value = memberName;
        //     //   const matchingDetailIndex = formData.insuredMemberDetails.findIndex(
        //     //     (detail: any) => detail.relation === memberName
        //     //   );
        //       // if(newMember.name in formData.insuredMembers && formData.insuredMemberDetails[matchingDetailIndex] && formData.insuredMemberDetails[matchingDetailIndex].memberdob){
        //         const aindex = this.relations.find(relation => relation.name === memberName);
        //         // this.relations[aindex].name = newitem;
        //         // this.relations[aindex].value = newitem;
        //         // newMember.dob = formData.insuredMemberDetails[matchingDetailIndex].memberdob;
        //         // newMember.age = formData.insuredMemberDetails[matchingDetailIndex].memberAge;
        //         // newMember.isIncrement = false;
        //         // console.log(newMember);
        //         // this.relations.splice(index, 0, newMember); // Insert after the current relation
        //         // this.incrementMember(newMember);
        //         // this.onRelationChange(mockEvent, newMember);
        //         let currentCount:any = this.relationCountMap.get(aindex.id) || 1;
        //         currentCount += 1;

        //         // Update the count in the map
        //         this.relationCountMap.set(aindex.id, currentCount);
        //       // }
        //     // }
        //   }
        //   else {
        //     const member = this.relations.find(relation => relation.name === memberName);
        //     if(member){
        //       if(member.name in formData.insuredMembers && formData.insuredMemberDetails[index] && formData.insuredMemberDetails[index].memberdob){
        //         member.dob = formData.insuredMemberDetails[index].memberdob;
        //         member.age = formData.insuredMemberDetails[index].memberAge;
        //         console.log(member);
        //         // this.incrementMember(member);
        //         // let currentCount:any = this.relationCountMap.get(member.id) || 1;
        //         // // Update the count in the map
        //         // this.relationCountMap.set(member.id, currentCount);
        //       }
        //     }
        //   }
        //   this.onRelationChange(mockEvent, memberName);
        //   // this.DateCheck.push(true);
        console.log(this.selectedRelationships, this.relations, this.relationCountMap);
        // });
        // this.addInsuredMemberDetails();
        const insuredMembersGroup = this.fb.group({});
        this.quoteFormGroup.setControl('insuredMembers', insuredMembersGroup);

        // Reset the insuredMemberDetails array
        const insuredMemberDetailsArray = this.fb.array([]) as FormArray;
        this.quoteFormGroup.setControl('insuredMemberDetails', insuredMemberDetailsArray);

        // Add controls for the currently selected relationships
        const insured: any = [];
        if (this.formData.insuredMemberDetails) {
          const insured = this.formData.insuredMemberDetails;
          console.log(insured);
        }
        this.selectedRelationships.forEach((relation: any) => {
          insuredMembersGroup.addControl(relation.value, this.fb.control(true));

          const memberGroup = this.fb.group({
            relation: [relation.value],
            roomCategory: [""],
            memberAge: [relation.age, [Validators.required]],
            sumInsured: [this.quoteFormGroup.get('sumInsured')?.value, [Validators.required]],
            isChronic: ["No"],
            chronicDiseases: [this.diseaseNames],
            zone: [this.formData.insuredMemberDetails[0].zone || this.proposerZone],
            upgradableZones: [this.upgradableZones || this.formData.insuredMemberDetails[0].upgradableZones],
            memberGender: [relation.gender, [Validators.required]],
            memberdob: [relation.dob, [Validators.required]],
            memberRelationCode: [relation.relationCode, [Validators.required]],
            pincode: [this.quoteFormGroup.get('proposerPincode')?.value],
            city: [this.formData.insuredMemberDetails[0].city || this.proposerCity],
            zoneValue: [this.formData.insuredMemberDetails[0].zoneValue || this.proposerZone],
            state: [this.formData.insuredMemberDetails[0].state || this.proposerState]
          });
          console.log(memberGroup);
          insuredMemberDetailsArray.push(memberGroup);
        });
        console.log(insuredMemberDetailsArray);
        // Update selectedRelation string for display
        this.selectedRelation = this.selectedRelationships.length > 0
          ? this.selectedRelationships.map((relation: any) => relation.value).join(', ')
          : 'Please select members';

        console.log(this.selectedRelation);
      }
    }
    console.log(this.quoteFormGroup.value);
    // Object.keys(this.multiIndiReqData).forEach((key: string)=>{
    //   if(Array.isArray(this.multiIndiReqData[key])){

    //   }
    // })
    // this.loadStoredData();

    // Check if the app is installed as a PWA
    if (window.matchMedia('(display-mode: standalone)').matches) {
      this.isStandalone = true;  // Set to true if in standalone mode
      this.checkView();
    }else {
      this.isStandalone = false; // Set to false if not in standalone mode
      console.log("This app is not running in standalone mode.");
    }
  }


  toggleDropdown(index: number): void {
    this.activeDropdown = this.activeDropdown === index ? null : index;
  }

  onRelationChange(event: any, relation: any) {
    const isChecked = event.target.checked;
    const selectedValue = relation.value;
    console.log(this.relationCountMap, this.selectedPlan, this.relations, relation, isChecked, selectedValue, this.selectedRelationships);

    if (isChecked) {
      if (!this.selectedRelationships.some(
        (existingRelation: any) => existingRelation.name === relation.name
      )) {
        if (this.relationCountMap.has(relation.id)) {
          if (this.selectedPlan === 'Family Floater') {
            if (this.numberOfChild == 3) {
              this.addHide = true;
              this.numberOfChild += 1;
              this.selectedRelationships.push(relation);
            }
            else if (this.numberOfChild == 4) {
              // relation.value = false;
              event.target.checked = false; // Uncheck the checkbox in the DOM
              this.toast.warning({ detail: "Warning", summary: "Already 4 Child are Added.", duration: 2000 });
            }
            else {
              this.numberOfChild += 1;
              this.selectedRelationships.push(relation);
              this.addHide = false;
            }
            // else {
            //   relation.value = false;
            //   event.target.checked = false; // Uncheck the checkbox in the DOM
            //   this.toast.warning({detail: "Warning",summary: "Already 4 Child are Added.",duration: 2000});
            // }
          }
          else {
            this.selectedRelationships.push(relation);
            this.addHide = false;
          }
        }
        // else if (this.relationCountMap.has(relation.id)) {
        //   this.numberOfChild += 1;
        //   this.selectedRelationships.push(relation);
        //   this.addHide = false;
        // }
        else {
          this.selectedRelationships.push(relation);
          // this.addHide = false;
        }
      }
    } else {
      this.selectedRelationships = this.selectedRelationships.filter((r: any) => r.name !== relation.name);
      relation.age = null;
      relation.dob = null;
      if (this.relationCountMap.has(relation.id)) {
        if (this.selectedPlan === 'Family Floater') {
          // if(!relation.dob){
          this.numberOfChild -= 1;
          // }
          this.addHide = false;
        }
        else {
          this.addHide = false;
        }
      }
    }
    console.log(this.selectedRelationships, selectedValue, isChecked, this.numberOfChild);
    console.log(this.selectedRelationships, this.relations, this.relationCountMap);
    // this.saveDataToStorage();
  }

  onAgeChange(event: any, relation: any) {
    const dob = event.target.value;
    const dobArray = dob.split('-'); // Capture the entered age
    const year = parseInt(dobArray[0]);
    const currentYear = new Date().getFullYear();
    console.log(event.target.value);
    this.selectedRelationships.forEach((selectedRelation: any) => {
      if (selectedRelation.name == relation.name) {
        selectedRelation.dob = dob;
        console.log(dob.length, year as number, currentYear, year.toString().length);
        if (year.toString().length === 4) {
          if (year < 1800 || year > currentYear) {
            console.log(selectedRelation, dobArray);
            this.toast.error({
              detail: "Error",
              summary: "Please fill valid Date.",
              duration: 3000
            });
          }
          else {
            console.log(dobArray[0]);

            let age: any = this.calculateAge(dob);
            const currentDate: any = new Date();

            // Convert the birth date into a Date object
            const birthDateObj: any = new Date(selectedRelation.dob);

            // oneYearAgo.setFullYear(currentDate.getFullYear() - 1);
            // Calculate the difference in milliseconds
            // let daysOld: any
            // if (birthDateObj.getFullYear() + 1 == currentDate.getFullYear()) {
            //   daysOld = this.calculateAgeInDays(selectedRelation.dob);
            // }
            let isValid = true;
            if (selectedRelation.value.includes('Son') || selectedRelation.value.includes('Daughter')) {
              let days: any = age ? age.toString().includes("days") ? (parseInt(age) === 0 ? "0" : "1") : null : null;


              switch (this.selectedPlan) {

                case 'Family Floater':


                  // Check if age is greater than 25 years or if days are less than 91
                  if (age > 25 || (days != null && days < 91)) {
                    this.toast.error({
                      detail: "Error",
                      summary: "Member should be less than 25 years and Greater than 91 days",
                      duration: 3000
                    });
                    isValid = false;
                  }

                  break;

                case 'Multi Individual':

                  if (age < 4 || age > 25) {
                    this.toast.error({
                      detail: "Error",
                      summary: "Member should be less than 25 years and Greater than 4 years",
                      duration: 3000
                    });
                    isValid = false;
                  }

                  break;
                default:
                  break;
              }
            }
            else {
              if (birthDateObj.getFullYear() <= currentDate.getFullYear()) {
                age = age ? age.toString().includes("days") ? "1" : age : age;
                if (age < 18 || age > 120) {
                  this.toast.error({
                    detail: "Error",
                    summary: "Member should be less than 120 years and Greater than 18 years",
                    duration: 3000
                  });
                  isValid = false;
                }
              }
            }
            if (isValid) {
              selectedRelation.age = age;
              console.log("Age set successfully:", selectedRelation.age);
            }
          }
        }
        console.log(selectedRelation);
      }
    })

    // if (dobArray[0] as number >= 1800 && dobArray[0].toString().length === 4) {

    //   const age = this.calculateAge(dob);
    //   this.selectedRelationships.forEach((selectedRelation: any) => {
    //     if (selectedRelation.name == relation.name) {
    //       selectedRelation.age = age;
    //       console.log(selectedRelation);
    //     }
    //   })
    // }
    console.log(dob, dob.length, new Date(dob).getFullYear(), new Date(this.currentDate).getFullYear());
    if (dob.length == 10 && dobArray[0].length == 4 && new Date(dob).getFullYear() > new Date(this.currentDate).getFullYear()) {
      this.toast.error({
        detail: "Error",
        summary: "Please fill valid Date.",
        duration: 3000
      });
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

  calculateAgeInDays(birthDate: any): any | null {
    // Get the current date
    const currentDate: any = new Date();

    // Convert the birth date into a Date object
    const birthDateObj: any = new Date(birthDate);

    // oneYearAgo.setFullYear(currentDate.getFullYear() - 1);
    // Calculate the difference in milliseconds
    if (birthDateObj.getFullYear() + 1 == currentDate.getFullYear()) {
      const diffInMilliseconds = currentDate - birthDateObj;

      // Convert the difference from milliseconds to days
      const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));

      return diffInDays;
    }
    return null;
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
    console.log(label, index);
    if (this.activeDropdown === index) {
      this.activeDropdown = null;
    } else {
      console.log(label);
      this.selectedDropdown = label;
      this.activeDropdown = index;
    }
    console.log(this.selectedRelation, this.selectedPlan);
    this.shouldScroll = true;  // Set the flag to true
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
    },
    {
      label: 'Porting',
      options: []
    }
  ];


  getQuote() {
    this.showCard = true;
    this.showDropdownsFlag = true;
    console.log('showCard:', this.showCard);
    // this.saveDataToStorage();
  }

  createLead() {
    this.route.navigate(['/leads/createLead'], {
    });
  }


  continue() {
    console.log(this.quoteFormGroup.value);
    this.quoteFormGroup.get('insuredMemberDetails')?.value.forEach((item: any) => {
      if (item.relation == 'Self') {
        this.quoteFormGroup.get('memberDobProposer')?.setValue(item.memberdob);
        this.quoteFormGroup.get('memberAgeProposer')?.setValue(item.memberAge);
        console.log(item);
      }
    })
    this.quoteFormGroup.get('numberOfInsuredMembers')?.setValue(this.selectedRelationships.length);
    this.quoteFormGroup.get('familySize')?.setValue(this.selectedRelationships.length + "A");
    this.quoteFormGroup.get('currentZone')?.setValue(this.currentZone);
    this.quoteFormGroup.get('upgradableZones')?.setValue(this.upgradableZones);
    this.quoteFormGroup.get('zone')?.setValue(this.upgradedZone);
    this.quoteFormGroup.get('zoneValue')?.setValue(this.proposerZoneValue);
    console.log("quoteForm Group", this.quoteFormGroup.value);
    sessionStorage.setItem("formData", this.encryptionService.encrypt(this.quoteFormGroup.value));
    sessionStorage.setItem("relations", this.encryptionService.encrypt(this.relations));
    console.log(this.quoteFormGroup.get('insuredMemberDetails')?.value.length);
    if (this.quoteFormGroup.valid && this.quoteFormGroup.get('insuredMemberDetails')?.value.length > 0) {
      console.log(this.quoteFormGroup.value);
      // this.saveDataToStorage();
      if (this.route.url.includes('quoteProducts')) {
        location.reload();
      }
      else {
        this.route.navigate(['quote/quoteProducts']);
      }
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
    relation.isIncrement = false;
    let baseName = relation.name.replace(/\d+/g, ''); // No trim needed, as we don't want a space

    // Get the current count for the relation type (Son, Daughter, etc.)
    let currentCount = this.relationCountMap.get(relation.id) || 1; // Start count at 1 if not set
    console.log(relation, baseName, currentCount, this.relations, this.relationCountMap);
    let baseRelation = { ...relation }; // Deep copy the relation
    baseRelation.isIncrement = true; // Mark the cloned relation as a regular relation
    // baseRelation['deletable'] = true; // Mark it as deletable

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
    let currentCount = this.relationCountMap.get(relation.id) || 1;
    currentCount -= 1;
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

  loadSelectedDiseases() {
    const storedDiseases = sessionStorage.getItem('selectedDiseases');
    if (storedDiseases) {
      this.selectedDiseases = JSON.parse(storedDiseases);
      this.updateDiseaseNames();  // Update disease names based on stored diseases
    }
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

    // Update sessionStorage and diseaseNames
    this.saveSelectedDiseases();
    this.updateDiseaseNames();
    console.log('Selected Diseases:', this.selectedDiseases);
  }
  updateDiseaseNames() {
    if (this.selectedDiseases.length > 0) {
      this.diseaseNames = this.selectedDiseases.join(', ');  // Join selected diseases as a string
    } else {
      this.diseaseNames = 'No Diseases Selected';  // Default message when no diseases are selected
    }
  }
  saveSelectedDiseases() {
    sessionStorage.setItem('selectedDiseases', JSON.stringify(this.selectedDiseases));
  }

  diseaseSelection() {
    this.diseaseNames = this.selectedDiseases.length > 0 ? this.selectedDiseases.join(', ') : '';
    const insuredMembersArray = this.quoteFormGroup.get('insuredMemberDetails') as FormArray;
    this.quoteFormGroup.get('isChronicCare')?.setValue(this.diseaseNames !== "" ? "Y" : "N");
    insuredMembersArray.controls.forEach((control: AbstractControl) => {
      const memberGroup = control as FormGroup;
      memberGroup.get('chronicDiseases')?.setValue(this.diseaseNames !== "" ? this.diseaseNames : null);
      memberGroup.get('isChronic')?.setValue(this.diseaseNames !== "" ? "Yes" : "No");
    });

    this.activeDropdown = null;
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
    this.getrelationsviapolicytype(planType);
    console.log(this.quoteFormGroup)
    this.selectedPlan = planType;
    this.selectedRelation = "";
    this.selectedRelationships = [];
    this.quoteFormGroup.get('memberPolicyType')?.setValue(planType);
    this.quoteFormGroup.get('zoneValue')?.reset();
    this.quoteFormGroup.get('proposerPincode')?.reset();
    this.quoteFormGroup.get('proposerName')?.reset();
    this.quoteFormGroup.get('proposerGender')?.reset();
    this.quoteFormGroup.get('mobileNumber')?.reset();
    (this.quoteFormGroup.get('insuredMemberDetails') as FormArray).clear();
    Object.keys((this.quoteFormGroup.get('insuredMembers') as FormGroup).controls).forEach(key =>
      (this.quoteFormGroup.get('insuredMembers') as FormGroup).removeControl(key)
    );
    console.log(this.quoteFormGroup)
    // this.relations = JSON.parse(this.anotherRelations);
    // console.log(this.anotherRelationCountMap);
    // this.relationCountMap = new Map(this.anotherRelationCountMap);
    console.log(this.relations, this.relationCountMap);
    this.numberOfChild = 0;
    this.addHide = false;
    this.activeDropdown = null;
    this.checkGender = false;
    //window.scrollTo({ top: 0, behavior: 'smooth' });
    this.getQuoteFocusScroll();
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
    this.showErrors = false;
    console.log(this.selectedRelationships, this.quoteFormGroup,this.selectedPlan);
    if (this.selectedRelationships.length < 2 && this.selectedPlan === 'Family Floater') {
      this.toast.error({
        detail: "Error",
        summary: "At least 2 members must be selected.",
        duration: 3000
      });
      return; // Prevent proceeding if fewer than 2 members are selected
    }
    let isValid = false;
    this.selectedRelationships.forEach((member: any) => {
      console.log(member);
      if (member.dob == null || member.age == null || member.dob === '' || member.age === '') {
        this.toast.error({
          detail: 'Error',
          summary: 'Please fill valid Date.',
          duration: 3000,
        });
        isValid = true;
        return; // Stop further execution if validation fails
      }
    })

    const proposerFields = ['proposerName', 'mobileNumber', 'proposerPincode'];
    const fieldErrors: string[] = [];
    proposerFields.forEach(field => {
      const control = this.quoteFormGroup.get(field);
      if (control?.invalid && !control.touched) {
        fieldErrors.push(field);
        control.markAsTouched();
      }
    });

    if (fieldErrors.length > 0) {
      this.toast.error({
        detail: 'Error',
        summary: `Please fill Required Details: ${fieldErrors.join(', ')}`,
        duration: 3000
      });
      return;
    }
    // Check if the form is valid before proceeding
    if (this.quoteFormGroup.valid && !isValid) {
      // const insured:any=[];
      // if(this.quoteFormGroup.value.insuredMemberDetails){
      //   const insured = this.quoteFormGroup.value.insuredMemberDetails;
      //   console.log(insured);
      // }
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
          zone: [this.upgradedZone || this.formData.insuredMemberDetails[0].zone],
          upgradableZones: [this.upgradableZones || this.formData.insuredMemberDetails[0].upgradableZones],
          memberGender: [relation.gender, [Validators.required]],
          memberdob: [relation.dob, [Validators.required]],
          memberRelationCode: [relation.relationCode, [Validators.required]],
          pincode: [this.quoteFormGroup.get('proposerPincode')?.value],
          city: [this.proposerCity || this.formData.insuredMemberDetails[0].city],
          zoneValue: [this.proposerZoneValue],
          state: [this.proposerState || this.formData.insuredMemberDetails[0].state]
        });

        console.log(memberGroup.value);

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
    //window.scrollTo({ top: 0, behavior: 'smooth' });
    this.getQuoteFocusScroll();
    console.log(this.quoteFormGroup.value);
  }


  get insuredMemberDetails(): FormArray {
    return this.quoteFormGroup.get('insuredMemberDetails') as FormArray;
  }

  enforceMaxLength(event: any, maxLength: number) {
    const input = event.target;
    if (input.value.length > maxLength) {
      input.value = input.value.slice(0, maxLength);  // Truncate the input to maxLength
    }
  }

  onZoneChange(event: any) {
    const matchingZone = this.upgradableZones.find((zone: any) => zone.value === event.target.value);
    this.upgradedZone = matchingZone ? matchingZone.name : null;
    this.proposerZoneValue = event.target.value
    this.quoteFormGroup.get('zone')?.setValue(this.upgradedZone);
    console.log(event.target.value);
  }

  getProposerPincode(event: any): void {
    const pincode = event.target.value;

    if (!pincode) {
      this.upgradableZones = []; // Clear available zones
      this.quoteFormGroup.get('zoneValue')?.setValue(''); // Reset the zone field in the form
      return;
    }

    const isValidPincode = /^[0-9]{6}$/.test(pincode) && !/^(\d)\1{5}$/.test(pincode);

    if (!isValidPincode) {
      this.toast.error({
        detail: "Error",
        summary: "Invalid pincode. Please enter a valid 6-digit pincode.",
        duration: 3000
      });
      return;
    }

    const reqdata = {
      pincode: pincode
    };

    this.upgradableZones = [];
    this.service.getCommonPinCodeByCity(reqdata).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          console.log(res);

          this.currentZone = res.data.zone;
          this.upgradedZone = res.data.zone;
          this.proposerZone = res.data.zone;
          this.proposerCity = res.data.city;
          this.proposerState = res.data.state;
          this.proposerZoneValue = res.data.zoneValue;

          const upgradableZones = res.data.upgradableZones as any[];
          // this.availableZones = upgradableZones.map(zone => zone.zone);
          this.upgradableZones = upgradableZones
          this.quoteFormGroup.get('zoneValue')?.setValue(this.proposerZoneValue);

          console.log("City and State updated in service:", this.proposerCity, this.proposerState);
        } else {
          this.toast.error({
            detail: "Error",
            summary: res.message,
            duration: 3000
          });
        }
      },
      error: (err) => {
        console.error(err);
        const errorMessage = err?.error?.message || "An unexpected error occurred. Please try again.";
        this.toast.error({
          detail: "Error",
          summary: errorMessage,
          duration: 3000
        });
      }
    });
  }
  getrelationsviapolicytype(policyType: any) {
    const reqData = {
      "policyType": policyType
    }
    console.log(reqData);
    this.quoteService.getquoterelationsviapolicytype(reqData).subscribe({
      next: (res: any) => {
        console.log(res);
        this.relations = res.data;
        this.relationCountMap.clear();

        // Populate the relationCountMap based on isIncrement property
        this.relations.forEach(relation => {
          if (relation.isIncrement) {
            // Set initial count to 0 for each incremental relation
            this.relationCountMap.set(relation.id, 0);
          }
        });
        console.log(this.relationCountMap, this.relations);
      },
      error: (err) => {
        console.error(err);
      }
    })
  }
  onGenderChange(event: any = null) {
    console.log(event, event.target.value);
    this.relations.forEach(relation => {
      if (relation.id === "R001") {
        // Update gender and imagePath for "Self"
        relation.gender = this.quoteFormGroup.get('proposerGender')?.value;
        relation.imagePath = this.quoteFormGroup.get('proposerGender')?.value === "M" ? "assets/Self.png" : "assets/Spouse.png";
      } else if (relation.id === "R002" || relation.id === "110") {
        // Swap imagePath for "Spouse"
        relation.gender = this.quoteFormGroup.get('proposerGender')?.value === "M" ? "F" : "M";
        relation.imagePath = this.quoteFormGroup.get('proposerGender')?.value === "M" ? "assets/Spouse.png" : "assets/Self.png";
      }
    });
    this.checkGender = true;
    //delete this.scrollTarget?.nativeElement;
  }

  //GET QUOTE FOCUS CODE
  @ViewChild('scrollTarget') scrollTarget: ElementRef | undefined;
  shouldScroll: boolean = false; // Flag to trigger the scroll logic
  ngAfterViewChecked() {
    if (this.scrollTarget && this.scrollTarget.nativeElement && this.shouldScroll) {
      //if (this.activeDropdown !== null && this.activeDropdown != 2 && this.scrollTarget) {
      // Option 1: Scroll to an element using scrollIntoView
      //this.scrollTarget.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

      // Option 2: Scroll to a specific position on the page
      // window.scrollTo(0, this.scrollTarget.nativeElement.offsetTop);
      //window.scrollTo({ top: this.scrollTarget.nativeElement.offsetTop + 100, behavior: 'smooth' });

      const currentUrl = window.location.href;
      this.pageName = currentUrl.split('/').pop(); // Get last part of the URL
      //console.log('Full URL:', currentUrl);
      //console.log('Page Name:', this.pageName);
      if (this.pageName === 'dashboard') {
        window.scrollTo({ top: this.scrollTarget.nativeElement.offsetTop + 150, behavior: 'smooth' });
      } else {
        window.scrollTo({ top: this.scrollTarget.nativeElement.offsetTop - 100, behavior: 'smooth' });
      }
      // Reset the flag to prevent it from scrolling multiple times
      this.shouldScroll = false;
    }
  }
  //GET QUOTE FOCUS CODE FUNCTION
  getQuoteFocusScroll() {
    if (!this.activeDropdown && this.scrollTarget) {
      const currentUrl = window.location.href;
      this.pageName = currentUrl.split('/').pop(); // Get last part of the URL
      //console.log('Full URL:', currentUrl);
      //console.log('Page Name:', this.pageName);
      if (this.pageName === 'dashboard') {
        window.scrollTo({ top: this.scrollTarget.nativeElement.offsetTop + 150, behavior: 'smooth' });
      } else {
        window.scrollTo({ top: this.scrollTarget.nativeElement.offsetTop - 100, behavior: 'smooth' });
      }
    }
  }

  onPortingChange(value: string): void {
    this.quoteFormGroup.get('isPortability')?.setValue(value);
    this.closeCustomDiv()
  }
  @HostListener('window:resize', ['$event'])
  //Screen View check
  checkView() {
    this.isDesktopView = window.innerWidth <= 767;
    if (this.isDesktopView) {
      //this.datePlaceholder = ''; 
    }else {
      this.datePlaceholder= 'dd/mm/yyyy'; // PWA date placeholder
    }
  }
}
