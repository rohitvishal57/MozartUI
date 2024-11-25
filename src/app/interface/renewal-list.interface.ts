import { ValidatorFn, Validators } from '@angular/forms';

export interface RenewalList {
    proposerFirstName: string;
    proposerLastName: string;
    rating: number;
    productName: string;
    policyType: string;
    policyNumber: string;
    renewalStatus:string;
    renewalStatusDescription: string;
    renewalPremiumAmount: number;
    healthReturn: number;
    proposerMobileNumber: string;
    policyEndDate: string;
    policyStartDate?:string,
    modification: string;
  }

  export const validationConfig: { [key: string]: ValidatorFn[] } = {
    Home_Address_1: [Validators.required],
    Home_Address_2: [],
    Home_Address_3: [],
    Home_State: [Validators.required],
    Home_City: [Validators.required],
    Home_Pincode: [Validators.required, Validators.pattern('^[0-9]{6}$')],
    nominee_first_name: [Validators.required],
    nominee_last_name: [Validators.required],
    nominee_dob: [],
    Nominee_Name: [Validators.required],
    Nominee_Contact_No: [Validators.required, Validators.pattern('^[0-9]{10}$')],
    Relationship: [Validators.required]  ,
    Relation: [Validators.required],
    Name: [],
    FirstName: [Validators.required],
    MiddleName: [],
    LastName: [Validators.required],
    height: [Validators.required],
    weight: [Validators.required],
    Gender: [Validators.required],
    DoB: [Validators.required],
    Mobile_Number: [Validators.required],
    Email: [Validators.required],
    SumInsured: [Validators.required],
    occupation: [Validators.required],
    Designation: [],
    AnnualIncome: [Validators.required],
    paymentOption: [Validators.required],
    premiumAmount: [],
    instrumentNumber: [Validators.required, Validators.pattern('^[0-9]{6}$')],
    instrumentDate: [Validators.required],
    ifscCode: [Validators.required, Validators.pattern('^[A-Z]{4}[0]{1}[A-Z0-9]{6}$')],
    bankNameControl: [Validators.required],
    file: [Validators.required] ,
    accountHolderName:[Validators.required],
    accountNo:[Validators.required,Validators.pattern(/^[0-9]{9,18}$/)],
    accountType:[Validators.required],
    bankName:[Validators.required],
    bankCity:[Validators.required],
    bankBranch:[Validators.required], 

  };

  export const coverageDetails: any[] = [
    {
      "featureName": "Personal Accident",
      "categoryName": "Optional Covers",
      "member": [
        {
          "memberType": "",
          "isSelected": false,
          "fields": [
            {
              "coverAmount": null,
              "options": [1000000, 1500000, 2000000, 2500000, 5000000]
            },
            {
              "occupationValue": null,
              "options": ["Architects", "Doctors", "Employee", "Student"]
            },
            {
              "designationValue": null,
              "options": ["Manager", "Team Lead", "Software Engineer", "Senior Engineer", "Analyst", "Consultant", "Intern"]
            }
          ]
        }
      ]
    },
    {
      "featureName": "Critical Illness",
      "categoryName": "Optional Covers",
      "member": [
        {
          "memberType": "",
          "isSelected": false,
          "fields": [
            {
              "coverAmount": null,
              "options": [1000000, 1500000, 2000000, 2500000, 5000000]
            }
          ]
        }
      ]
    },
    {
      "featureName": "Second Medical Opinion for listed Major Illness",
      "categoryName": "Optional Covers",
      "member": [
        {
          "memberType": "",
          "isSelected": false,
          "fields": []
        }
      ]
    },
    {
      "featureName": "Annual Screening Package for Cancer Diagnosed Patients",
      "categoryName": "Optional Covers",
      "member": [
        {
          "memberType": "",
          "isSelected": false,
          "fields": []
        }
      ]
    },
    {
      "featureName": "Reduction In Specific Disease Waiting Period",
      "categoryName": "Optional Covers",
      "member": [
        {
          "memberType": "",
          "isSelected": false,
          "fields": []
        }
      ]
    },
    {
      "featureName": "Reduction In Pre-Existing Disease Waiting Period",
      "categoryName": "Optional Covers",
      "member": [
        {
          "memberType": "",
          "isSelected": false,
          "fields": []
        }
      ]
    },
    {
      "featureName": "Per Claim Deductable",
      "categoryName": "Optional Covers",
      "member": [
        {
          "memberType": "",
          "isSelected": false,
          "fields": [
            {
              "coverAmount": null,
              "options": [15000, 25000]
            }
          ]
        }
      ]
    },
    {
      "featureName": "Preferred Provider Network",
      "categoryName": "Optional Covers",
      "member": [
        {
          "memberType": "",
          "isSelected": false,
          "fields": []
        }
      ]
    },
    {
      "featureName": "Compassionate Visit",
      "categoryName": "Optional Covers",
      "member": [
        {
          "memberType": "",
          "isSelected": false,
          "fields": []
        }
      ]
    },
    {
      "featureName": "Room Rent Type Options",
      "categoryName": "Optional Covers",
      "member": [
        {
          "memberType": "",
          "isSelected": false,
          "fields": [
            {
              "roomType": null,
              "options": ["Single Private Room", "Shared Accommodation"]
            }
          ]
        }
      ]
    },
    {
      "featureName": "Cancer Booster",
      "categoryName": "Optional Covers",
      "member": [
        {
          "memberType": "",
          "isSelected": false,
          "fields": []
        }
      ]
    },
    {
      "featureName": "HLTH Meter",
      "categoryName": "Optional Covers",
      "member": [
        {
          "memberType": "",
          "isSelected": false,
          "fields": []
        }
      ]
    },
    {
      "featureName": "Vaccine Cover",
      "categoryName": "Health Add On",
      "member": [
        {
          "memberType": "",
          "isSelected": false,
          "fields": [
            {
              "coverAmount": null,
              "options": [500, 750, 1000]
            }
          ]
        }
      ]
    },
    {
      "featureName": "Tele-OPD Consultation",
      "categoryName": "Health Add On",
      "member": [
        {
          "memberType": "",
          "isSelected": false,
          "fields": []
        }
      ]
    },
  ];