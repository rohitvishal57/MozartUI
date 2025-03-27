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

 export interface DocSearchParam {
   docSearchParamId: string;
   value: string;
 }
 
 export interface SearchResult {
   globalId: string | null;
   omniDocImageIndex: string;
   omniDocIndex: string;
   vID: string;
   fileName: string;
   description: string;
   uploadedDate: string;
   dataClassParam: DocSearchParam[];
   error: Array<{
     code: string;
     description: string;
   }>;
 }
 
 export interface SearchDocumentRequest {
   AgentCode: string | null;
   ReferenceId: string| null;
   SearchOperator: string;
   isClaims: boolean;
   SearchRequest: Array<{
     CategoryID: string;
     DocumentID: string;
     ReferenceID: string;
     FileName: string;
     Description: string;
     DataClassParam: Array<{
       DocSearchParamId: string;
       Value: string;
     }>;
   }>;
    
 }   
 
 export interface DownloadRequest {
  agentCode:string | null;
  referenceId:string | null;
  eventName: any,
  proposalNumber: any;
  downloadRequest:any;
  sourceSystemName:any;
  identifier:any;
}
export interface FileDisplay {
  name: string;
  type: string;
  createdDateTime: string;
  base64?: string;
  fileBlob?: Blob;
  documentId: string;
}

export interface FileObject {
  documentId: string;
  name: string;
  type: string;
  size: number;
  uploadDateTime: Date;
  status: 'pending' | 'success' | 'failed';
  file: File;
}
export interface DocumentSection {
  id: string;
  label: string;
  uploadStatus: string;
  file: FileObject | null;
}

export interface Errors {
  policyNumberRequired: string;
  invalidFormat: boolean;
  requiredDocs: string;
  fileNotSelected: boolean;
  missingDocuments: boolean;
}