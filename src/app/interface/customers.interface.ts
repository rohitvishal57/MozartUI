export interface CustomerList {
    id: number;
    policyNumber: string;
    policyStartDate: string;  // Consider using Date if you plan to work with dates
    policyEndDate: string;    // Same as above
    noOfInsured: number;
    policyTerm: string;
    policyStatus: string;
    sumInsured: number;
    totalPremium: number;
    policyType: string;
    nstp: string;
    zone: string | null;
    customerID: string;
    firstName: string;
    middleName: string | null;
    lastName: string;
    dateOfBirth: string;      // Consider using Date if needed
    mobileNumber: string;
    emailID: string;
    city: string;
    addressLine1: string | null;
    addressLine2: string | null;
    state: string;
    pincode: string;
    source: string;
    businessType: string;
    receiptNo: string;
    issuanceDate: string;     // Consider using Date if needed
    oldPolicyNo: string | null;
    planName: string;
    productVarientName: string;
    leadId: string;
    quotationNumber: string;
    proposalNumber: string;
    agentCode: string;
    agentName: string;
  }
  