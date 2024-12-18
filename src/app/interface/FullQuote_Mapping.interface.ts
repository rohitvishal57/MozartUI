export interface IFullQuoteMapping {
    agentCode: string
    productName: string
    productCode: string
    planCode: string
    planName:string
    proposalNum:string
    policyType: string
    businessType: string
    insuredMemberDetails: InsuredMemberDetail[]
	CKYCNo:string
	QuoteId:string
	LeadId:string
    proposerSalutation: string
    proposerFirstName: string
    proposerMiddleName: string
    proposerLastName: string
    proposerDob: string
    proposerAge: string
    proposerGender: string
    proposerMobileNumber: string
    proposerWhatsAppNo: string
    proposerAddress1: string
    proposerAddress2: string
    proposerCity: string
    proposerState: string
    proposerEmailId: string
    proposerPincode: string
    idProof: string
    idNo: string
    proposerAnnualIncome: string
    proposerOccupation: string
    proposerEducation: string
    proposerPANNo: string
    gstDetails: string
    proposerMaritalStatus: string
    ifPEP: string
    proposerNationality: string
    nomineeFirstName: string
    nomineeMidleName: string
    nomineeLastName: string
    nomineeRelation: string
    nomineeRelationCode: string
    nomineeContactNumber: string
    nomineeAddress: string
    nomineeDob: string
    nomineeAge: string
    NameofAccountHolder: string
    accountNumber: string
    accountType: string
    bankCity: string
    bankBranch: string
    paymentMode: string
    chequeNumber: string
    chequeDate: string
    bankName: string
    ifscCode: string
    micrNo: string
    premiumAmount: string
	selectedTenure: string
    paymentDate: number
    paymentCollectionMode: string
    paymentByRelationship: string
    payerName: string
    paymentBy: string
    PaymentGatewayName: string
    tenure:string
    bankAccountType:string
    familySize:string
    appointeeName:string
    appointeeMobileNumber:string
    appointeeRelationCode:string
}

export interface InsuredMemberDetail {
    relation: string
    memberrelationCode: string
    memberSalutation: string
    firstName: string
    middleName: string
    lastName: string
    height: string
    heightInInches: string
    weight: string
    memberdob: string
    emailId: string
    mobileNumber: string
    memberNationality: string
    relationshipType: string
    memberAge: number
    memberGender: string
    memberPincode: string
    preExistingDisease: string
    memberIndex: number
    zone: string
    state: string
    city: string
    memberType: string
    memberSumInsured: string
    memberZone: string
    memberNatureOfDuty: string
    memberDesignation: string
    memberOccupation: string
    covers: Cover[]
    memberRoomCategory:string
    pedWaitingPeriod:string
}

export interface Cover {
    coverId: string
    coverName: string
    value: string
}