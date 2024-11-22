export interface RenewCheckAPIResponse {
    error?: Error[];
    response?: Response;
    Renew_Info?: RenewInfo[];
  }
  
  export interface Error {
    ErrorCode?: string;
    ErrorMessage?: string;
  }
  
  export interface PolicyproductComponent {
    PlanCode?: string;
    SchemeCode?: string;
  }
  
  export interface RenewalTaxDetail {
    Tax_Type?: string;
    TaxRate?: string;
    Tax_Amount?: string;
  }
  
  export interface Premium {
    PA_Net: string;
    CI_Net: string;
    CA_Net: string;
    HCB_Net: string;
    Renewal_Net_Premium?: number;
    Renewal_Gross_Premium?: number;
    Renewal_Tax_Details: RenewalTaxDetail[];
    PA_NetU: string;
    CI_NetU: string;
    CA_NetU: string;
    HCB_NetU: string;
    Upsell_Net_Premium?: number;
    Upsell_Gross_Premium?: number;
    Upsell_Tax_Details: UpsellTaxDetail[];
  }
  
  export interface UpsellTaxDetail {
    Tax_Type: string;
    TaxRate: string;
    Tax_Amount: string;
  }
  
  export interface MemberproductComponent {
    PlanCode: string;
    CB: string;
    productComponent: ProductComponent[];
  }
  
  export interface ProductComponent {
    productComponentName: string;
    productComponentValue: string;
  }
  
  export interface Member {
    MemberproductComponents: MemberproductComponent[];
    Title: string;
    PremiumWaiverFlag: string;
    PremiumWaiverBenefit: string;
    PPN_Discount: string;
    Alternate_Mobile_Number: string;
    Alternate_Email_Id: string;
    Name: string;
    FirstName: string;
    MiddleName: string;
    LastName: string;
    GHDApplicable: string;
    GHDRemarks: string;
    Age: string;
    salutation: string;
    marital_status: string;
    AnnualIncome: string;
    IdProofNumber: string;
    IdProof: string;
    exactDiagnosis: string;
    LoanAccountNumber: string;
    EMI: string;
    LoanPrincipalOutstanding: string;
    Designation: string;
    PrimaryMember: string;
    NatureOfDuty: string;
    height: string;
    weight: string;
    occupation: string;
    Gender: string;
    DeductibleAmount: string;
    SumInsuredPerUnit: string;
    MobilePhone: string;
    WellnessPartyId: string;
    PreExistingDiseasesApplicable: string;
    ChronicManagementApplicable: string;
    Policy_Type: string;
    HealthReturn: string;
    FitnessAssessment: string;
    WellnesCoach: string;
    DRM: string;
    HealthAssessment: string;
    PanNo: string;
    AadharCradNo: string;
    AlternateMobile: string;
    SumInsured: string;
    Upsell_SumInsured: string;
    healthReturn: string;
    DoB?: Date;
    Email: string;
    Mobile_Number: string;
    Relation: string;
    Chronic: string;
    CB: string;
    MemberId: string;
    memberquestiondetails: Membquestion[];
    optionalCoverages: OptionalCoverage[];
    Zone: string;
    activpolicydetails: Activpolicydetails;
    upsellPropensityDetails?: UpsellPropensityDetails | UpsellPropensityDetails[];
  }
  
  export interface UpsellPropensityDetails {
    upsellSumInsured: string;
    upsellNetPremium: string;
    upsellGrossPremium: string;
    zone: string;
    tenure: string;
    recommended: string;
    withRenewalModification: string;
    upsellBucket: string;
    upsellSI1: string;
    upsellSI2: string;
    upsellSI3: string;
    upsellSI4: string;
    upsellSI5: string;
    maxUpsell: string;
    processed: string;
    processedDate: string;
    upsellSGSTAmount: string;
    upsellUTGSTAmount: string;
    upsellTAXAmount: string;
  }
  
  export interface MemberPEDs {
    PedCode: string;
    Remarks: string;
    Value: string;
  }
  
  export interface Membquestion {
    Qcode: string;
    ans: string;
    remarks: string;
  }
  
  export interface NomineeDetails {
      Nominee_Name: string;
      Nominee_Address: string;
      Nominee_Contact_No: string;
      Relationship: string;
      nominee_first_name: string;
      nominee_last_name: string;
      nominee_dob: string; 
      nominee_relationship_code: string;
    }
  
  export interface PolicyData {
    Tenure2?: string;
    Tenure3?: string;
    V3Indicator?: string;
    salutation?: string;
    educationalQualification?: string;
    SourceCode?: string;
    uidNo?: string;
    occupation?: string;
    familyMobileNo?: string;
    familyEmailID?: string;
    panNo?: string;
    passportNumber?: string;
    contactPerson?: string;
    annualIncome?: string;
    remarks?: string;
    IdProof?: string;
    ageProof?: string;
    residenceProof?: string;
    others?: string;
    Policy_number?: string;
    AutoDebitFlag?: string;
    Alternate_Mobile_Number?: string;
    Alternate_Email_Id?: string;
    Combi_Reference_Number?: string;
    RegistrationStatus?: string;
    OverwriteAutoDebit?: string;
    DebitDate?: string;
    healthReturn?: string;
    HealthReturn?: string;
    ProductCode?: string;
    PolicyStatus?: string;
    Policy_Sub_Status?: string;
    UWDependentEntitlement?: string;
    ApplicationDate?: string;
    ValidFrom?: string;
    ValidTo?: string;
    Tenure?: string;
    sameAsHomeAddress?: string;
    BusinessType?: string;
    ApplicationNo?: string;
    NumberofAdults?: string;
    NumberofChildren?: string;
    PolicyOwnerName?: string;
    PolicyOwnerFirstName?: string;
    PolicyOwnerMiddleName?: string;
    PolicyOwnerLastName?: string;
    CustomerCode?: string;
    ifAML?: string;
    ifFaceMatch?: string;
    ifPEP?: string;
    Hyper_verge_OPD_Status?: string;
    Digi_Locker_Verified?: string;
    CKYC_Flag?: string;
    KYC_Transition_Id?: string;
    CKYC_Number?: string;
    DateOfBirth?: string;
    ProposarAge?: string;
    Gender1?: string;
    MaritalStatus?: string;
    Nationality?: string;
    NonIndian?: string;
    Mobile?: string;
    Email?: string;
    internationalcontactno?: string;
    WhatsAppNo?: string;
    EmergencyContactNo?: string;
    SumInsured?: string;
    sumInsuredtype?: string;
    BasicPremium?: string;
    RiderAmount?: string;
    BasePremium?: string;
    UWLoading?: string;
    PremiumWaiverFlag?: string;
    Discounts?: string;
    NetPremium?: string;
    TAXDetails?: string;
    AnnualPremium?: string;
    agentCode?: string;
    agentName?: string;
    agentPhoneNo?: string;
    agentEmail?: string;
    channel?: string;
    Intermediary_Name?: string;
    Intermediary_Code?: string;
    smCode?: string;
    smName?: string;
    smPhoneNo?: string;
    Policy_Expired?: string;
    Sum_insured_type?: string;
    Policy_start_date?: string;
    Policy_renewal_date?: string;
    Policy_expiry_date?: string;
    Policy_lapsed_flag?: string;
    RefCode1?: string;
    RefCode2?: string;
    Upsell_Flag?: string;
    Renewable_Flag?: string;
    enumIsEmployeeDiscount?: string;
    EnumIsMandate?: string;
    Renewed_Flag?: string;
    Combi_Flag?: string;
    Combi_Policy_Number?: string;
    IsModified?: string;
    quoteDate?: string;
    NSTP_flag?: string;
    Name_of_the_proposer?: string;
    Name_of_product?: string;
    Plan_name?: string;
    IsEmployeeDiscount?: string;
    optionalCoverages?: object[];
    Discount_Amount?: string;
    PolicyproductComponents?: PolicyproductComponent[];
    premium?: Premium;
    uwRules?: UwRules[];
    Members?: Member[];
    Nominee_Details?: object;
    Nominee_DetailsList?: NomineeDetails[];
    HomeAddress?: HomeAddress;
    MailingAddress?: MailingAddress;
  }
  
  export interface Activpolicydetails {
    InsurerName: string;
    policyNo: string;
    Policy_expiry_Date: string;
    sum_Insured: string;
    Claim_in_Policy: string;
    Policy_status: string;
  }
  
  export interface OptionalCoverage {
    plancode: string;
    coverCode: string;
    coverSi: string;
    coverPartCode: string;
  }
  
  export interface Response {
    policyData: PolicyData[];
  }
  
  export interface RenewInfo {
    Renewed_Policy_Number: string;
    Renewed_Policy_Proposal_Number: string;
    Renewed_Policy_Start_Date: string;
    Renewed_Policy_Expiry_Date: string;
  }
  
  export interface HomeAddress {
    Home_Address_1: string;
    Home_Address_2: string;
    Home_Address_3: string;
    Home_State: string;
    Home_District: string;
    Home_City: string;
    Home_Pincode: string;
    homeArea: string;
    homeContactMobileNo: string;
    homeContactMobileNo2: string;
    homeSTDLandlineNo: string;
    homeSTDLandlineNo2: string;
    homeFaxNo: string;
  }
  
  export interface MailingAddress {
    Mailing_Address_1: string;
    Mailing_Address_2: string;
    Mailing_Address_3: string;
    Mailing_State: string;
    Mailing_City: string;
    mailingArea: string;
    mailingContactMobileNo: string;
    mailingContactMobileNo2: string;
    Mailing_PinCode: string;
  }
  
  export interface UwRules {
    Member_Name: string;
    PED: string;
  }