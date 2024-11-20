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
    occupation: [Validators.required],
    Designation: [],
    AnnualIncome: [Validators.required],
    paymentOption: [Validators.required],
    chequeAmount: [],
    chequeNumber: [Validators.required, Validators.pattern('^[0-9]{6}$')],
    chequeDate: [Validators.required],
    ifscCode: [Validators.required, Validators.pattern('^[A-Z]{4}[0]{1}[A-Z0-9]{6}$')],
    bankNameControl: [Validators.required],
    file: [] ,
    accountHolderName:[Validators.required],
    accountNo:[Validators.required,Validators.pattern(/^[0-9]{9,18}$/)],
    accountType:[Validators.required],
    bankName:[Validators.required],
    bankCity:[Validators.required],
    bankBranch:[Validators.required],    
  };
  
    