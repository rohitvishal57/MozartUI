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
    Mobile_Number: [],
    Email: [],
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
  };
  
  export const searchValidationConfig: { [key: string]: ValidatorFn[] } = {
    mobileNumber: [Validators.required,Validators.pattern(/^\s*[6-9][0-9]{9}\s*$/),],
    policyNumber: [Validators.required,Validators.pattern("^\\s*[0-9-]+\\s*$"),],
    proposerName: [Validators.required,Validators.pattern(/^\s*[a-zA-Z]{1,20}(\s+[a-zA-Z]{1,20}){0,2}\s*$/),],
    emailID: [Validators.required,Validators.pattern(/^\s*[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\s*$/) ],
    name: [Validators.required,Validators.pattern(/^\s*[a-zA-Z]{1,20}(\s+[a-zA-Z]{1,20}){0,2}\s*$/) ],
    leadId: [Validators.required,Validators.pattern(/^\s*UPL\d{12}\s*$/) ],
    proposalNumber: [Validators.required, Validators.pattern(/^\s*UPP\d{12}\s*$/) ],
    claimInfoId: [Validators.required,Validators.pattern("^\\s*[A-Z0-9-]+\\s*$")],
    memberId: [Validators.required,Validators.pattern("^\\s*[A-Z0-9-]+\\s*$"),],
    memberName: [Validators.required,Validators.pattern(/^\s*[a-zA-Z]{1,20}(\s+[a-zA-Z]{1,20}){0,2}\s*$/),],
    caseId: [Validators.required,Validators.pattern("^\\s*[A-Z0-9-]+\\s*$"),],
    
  };
    