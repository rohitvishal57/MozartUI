export interface ClaimsInterface {    
        id: string;
        policyNumber: string;
        productName: string;
        memberName: string;
        memberRelation: string;
        requestType: string;
        claimStatus: string;
        raisedDate: Date;
        mobileNumber: string
      
}

export interface ClaimData {
    id: number;
    policyNumber: string;
    productName: string;
    memberName: string;
    memberRelation: string | null;
    requestType: string;
    claimStatus: string | null;
    raisedDate: string;
    hospitalName: string;
    isFileUploadRequired: boolean;
    claimedAmount: string;
    approvedAmount: string | null;
    deductedAmount: string | null;
    deductionReason: string | null;
    coPayAmount: string | null;
    reasonForCoPay: string | null;
    coverName: string | null;
    sellerId: string;
    claimType: string;
    notes: string | null;
    proposerName: string | null;
  }

  export interface CoverDetail {
        member_Code: string;
        cover_Code: string;
        cover_Name: string;
        loss_Type_Code: string;
        policy_Number: string;
        member_Name: string;
        date_of_Birth: string;
        gender: string;
        relation: string;
      }
  export interface UploadErrors {
        policyNumberRequired: any;
        fileNotSelected: boolean;
        invalidFormat: boolean;
        requiredDocs: string;
        duplicateDocs: string;
      }