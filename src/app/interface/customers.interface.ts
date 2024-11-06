export interface CustomerList {
  policyNumber: string | null;
  policyStartDate: string | null;
  policyEndDate: string | null;
  noOfInsured: number | null;
  policyStatus: string | null;
  policyType: string | null;
  customerID: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  mobileNumber: string;
  emailID: string;
  pincode: string | null;
  receiptNo: string | null;
  planName: string | null;
  productVariantName: string | null;
  proposalNumber: string | null;
  noOfPolicy: number;
  policyDetails: PolicyDetail[];
}

export interface PolicyDetail {
  productVariantName: string;
  planName: string;
  policyNumber: string;
  proposalNumber: string;
  noOfInsured: number;
  sumInsured:number;
  totalPremium:number;
  policyStartDate: string;
  policyEndDate: string;
  policyStatus: string;
  policyType: string;
  id: number;
  isEnable: boolean;
  isVisible: boolean;
}
