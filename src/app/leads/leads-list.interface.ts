export interface LeadsList {
    id?: number | null;
    agentCode?: string | null;
    leadNumber?: string | null;
    firstName?: string | null;
    middleName?: string | null;
    lastName?: string | null;
    email?: string | null;
    phoneNumber?: string | null;
    dateOfBirth?: string | null;
    age?: number | null;
    gender?: string | null;
    interestedInPlan?: string | null;
    leadSource?: string | null;
    leadStatus?: string | null;
    campaignName?: string | null;
    maritalStatus?: string | null;
    occupation?: string | null;
    education?: string | null;
    addressLine1?: string | null;
    addressLine2?: string | null;
    city?: string | null;
    stateProvince?: string | null;
    zipCode?: string | null;
    isConverted?: boolean | null;
    notes?: string | null;
    createdOn?: string | null;
    isAssign?: boolean | null;
    campaignNumber?:string
  }
  