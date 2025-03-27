import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ConfigService } from 'src/app/services/config.service';
import { HttpService } from 'src/app/services/http.service';
import { YatraService } from '../yatra/yatra/yatra.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RugService {

  private isHeadersD2CShow = new BehaviorSubject<boolean>(false);
  currentStatus = this.isHeadersD2CShow.asObservable();
  currentDate = new Date().toISOString().split('T')[0];
  occupationDetails: any;
  nomineeRelationsData: any;
  nomineeRelations:any;
  constructor(private configService: ConfigService, private http: HttpClient,
    private httpService: HttpService, private yatraService: YatraService) { }

    changeStatus(flag: boolean) {
      this.isHeadersD2CShow.next(flag);
    }

    createLeadTS(reqData:any){
      const  createLead = this.configService.config.baseUrl + this.configService.config.tsCreateLead;
      return this.httpService.post(createLead,reqData)
    }
    getLobDetails(){
      const  getAllManageLOB = this.configService.config.baseUrl + this.configService.config.getAllManageLob;
      console.log(getAllManageLOB);
      return this.httpService.get(getAllManageLOB);
    }
    getDispositions(){
      const  getAllDispositions = this.configService.config.baseUrl + this.configService.config.getAllDispositions;
      return this.httpService.get(getAllDispositions);
    }
    getAllSubDispositions(reqData:any){
      const  getSubDispositions = this.configService.config.baseUrl + this.configService.config.getAllSubDispositions;
      return this.httpService.post(getSubDispositions,reqData)
    }
    getDataPincodeDetails(reqData:any){
      const  getPincodeDetails = this.configService.config.baseUrl + this.configService.config.getPincodeDetails;
      return this.httpService.post(getPincodeDetails,reqData)
    }
    saveTsCommonDraft(reqData:any){
      const saveTsCommonDraftData = this.configService.config.baseUrl + this.configService.config.saveTSCommonDraft;
      return this.httpService.post(saveTsCommonDraftData,reqData);
    }
    postTsHalfQuote(reqData:any){
      const tsHalfQuoteData = this.configService.config.baseUrl + this.configService.config.postTSHalfQuote;
      return this.httpService.post(tsHalfQuoteData,reqData);
    }
    getTsPolicyInfoByLeadId(reqData:any){
      const policyInfoByLeadIdData = this.configService.config.baseUrl + this.configService.config.getTSPolicyInfoByLeadId;
      return this.httpService.post(policyInfoByLeadIdData,reqData);
    }
    getBBPolicyInfoByLeadId(reqData: any) {
      const suminsuredDetails = this.configService.config.baseUrl + this.configService.config.getBBPolicyInfoByLeadId;
      return this.httpService.post(suminsuredDetails, reqData);
    }
    bbHalfQuote(reqData: any) {
      const halfQuoteData = this.configService.config.baseUrl + this.configService.config.bbHalfQuote;
      return this.httpService.post(halfQuoteData, reqData);
    }
    getBaseCallerDetails(reqData: any){
      const baseCallerData = this.configService.config.baseUrl + this.configService.config.getBaseCallerDetails;
      return this.httpService.post(baseCallerData, reqData);
    }
    getAllLeads(reqData: any) {
      const halfQuoteData = this.configService.config.baseUrl + this.configService.config.GetLeads;
      return this.httpService.post(halfQuoteData, reqData);
    }
    getMasterData() {
      const getProposerOccupation = this.configService.config.baseUrl + this.configService.config.getMasterData;
      return this.httpService.get(getProposerOccupation);
    }

    checkGroupRenewalData(reqData: any) {
      const halfQuoteData = this.configService.config.baseUrl + this.configService.config.checkGroupRenewalData;
      return this.httpService.post(halfQuoteData, reqData);
    }

    getProfileDetails(reqData : any) {
      const req = this.configService.config.baseUrl + this.configService.config.profileDetails;
      return this.httpService.post(req,reqData);
    }
    SaveRenewalProposalData(reqData : any) {
      const req = this.configService.config.baseUrl + this.configService.config.SaveRenewalProposalData;
      return this.httpService.post(req,reqData);
    }
    getRetailRenewalRedirectUrl(reqData : any) {
      const req = this.configService.config.baseUrl + this.configService.config.getRetailRenewalRedirectUrl;
      return this.httpService.post(req,reqData);
    }
    sendLinkToCustomer(reqData : any) {
      const req = this.configService.config.baseUrl + this.configService.config.sendLinkToCustomer;
      return this.httpService.post(req,reqData);
    }
    sendRetailLinkToCustomer(reqData : any) {
      const req = this.configService.config.baseUrl + this.configService.config.sendRetailLinkToCustomer;
      return this.httpService.post(req,reqData);
    }
    getRetailRenewalPhaseTwoLeads(reqData : any) {
      const req = this.configService.config.baseUrl + this.configService.config.getRetailRenewalPhaseTwoLeads;
      return this.httpService.post(req,reqData);
    }
    getRenewalPolicyData(reqData : any) {
      const req = this.configService.config.baseUrl + this.configService.config.getRenewalPolicyData;
      return this.httpService.post(req,reqData);
    }
    getGroupRenewalPhaseTwoLeads(reqData : any) {
      const req = this.configService.config.baseUrl + this.configService.config.getGroupRenewalPhaseTwoLeads;
      return this.httpService.post(req,reqData);
    }

    getDispositionsRenewal(){
      const  getAllDispositions = this.configService.config.baseUrl + this.configService.config.getAllDispositionsRenewal;
      return this.httpService.get(getAllDispositions);
    }

    sendHdfcOTP(reqData : any){
      const  sendOtpRequestURL = this.configService.config.baseUrl + this.configService.config.sendOtpHdfc;
      return this.httpService.post(sendOtpRequestURL,reqData);
    }

    validateHdfcOTP(reqData : any){
      const  validateRequestURL = this.configService.config.baseUrl + this.configService.config.validateHdfcOTP;
      return this.httpService.post(validateRequestURL,reqData);
    }

    sendCommunication(reqData : any){
      const  sendCommunicationURL = this.configService.config.baseUrl + this.configService.config.sendCommunication;
      return this.httpService.post(sendCommunicationURL,reqData);
    }
    
    
    generateProposal(reqData : any){
      const  generateProposalURL = this.configService.config.baseUrl  + this.configService.config.generateProposal;
      return this.httpService.post(generateProposalURL,reqData);
    }
    

    createBataLeads(reqdata: any) {
      const createBatalead = this.configService.config.baseUrl + this.configService.config.createBataleads;
      return this.httpService.post(createBatalead, reqdata)
    }

    getEMployeeDetails(reqdata:any){
      const req = this.configService.config.baseUrl + this.configService.config.getEmployeeDetails;
      return this.httpService.post(req, reqdata);
    }

    getProdcutDetails(){
      const  getProduct = this.configService.config.baseUrl + this.configService.config.gethdfcProductDetails;
      return this.httpService.get(getProduct);
    }

    getSumInsuredByProduct(reqdata:any){
      const req = this.configService.config.baseUrl + this.configService.config.getSumInsuredByProductSelection;
      return this.httpService.post(req, reqdata);
    }

    getCampaignName(reqdata:any){
      const req = this.configService.config.baseUrl + this.configService.config.getCampaignName;
      return this.httpService.post(req, reqdata);
    }

    getLeadDetailsBata(reqdata:any){
      const req = this.configService.config.baseUrl + this.configService.config.getLeadDetailsBata;
      return this.httpService.post(req, reqdata);
    }
    getEnquirePaymentDetails(reqdata:any){
      const req = this.configService.config.baseUrl + this.configService.config.enquirePaymentDetails;
      return this.httpService.post(req, reqdata);
    }
    getCapturePaymentDetails(reqdata:any){
      const req = this.configService.config.baseUrl + this.configService.config.capturePayment;
      return this.httpService.post(req, reqdata);
    }
    hdfcCallQuote(reqData : any){
      const  generatePremiumURL = this.configService.config.baseUrl  + this.configService.config.hdfcCallQuote;
      return this.httpService.post(generatePremiumURL,reqData);
    }
    sendHdfcShortenLink(reqData : any){
      const  sendShortenUrl = this.configService.config.baseUrl  + this.configService.config.sendHdfcShortenUrl;
      return this.httpService.post(sendShortenUrl,reqData);
    }
    getHdfcPolicyInfoByLeadId(reqData:any){
      const hdfcPolicyInfoByLeadId = this.configService.config.baseUrl + this.configService.config.getHdfcPolicyInfoByLeadId;
      return this.httpService.post(hdfcPolicyInfoByLeadId,reqData);
    }

    generatePayload(savedData: any, formData: any, isSummary: boolean): any {
      let selectedOccupationCode;
      let selectedNomineeRelationCode;
      console.log(savedData);
      console.log(formData);
      console.log(isSummary);
        selectedOccupationCode = this.occupationDetails.filter(
          (item: any) => item.occupationName === (isSummary === true ? savedData.insuredMemberDetails[0].occupation : formData.insuredMemberDetails[0].occupation)
        );
        console.log(this.nomineeRelationsData);
        console.log(typeof this.nomineeRelationsData);
        selectedNomineeRelationCode = this.nomineeRelationsData.filter((relation: any) => relation.relationName === savedData.relationWithProposer);
      return {
        proposerDetails: {
          // leadId: isSummary ? savedData.leadId || "" : formData.leadId || "",
            leadId: savedData.leadId || "",
            customerId: formData.customerId || "",
            salutation: savedData.salutation || "",
            customerFirstName: savedData.customerFirstName || "",
            customerMiddleName: savedData.customerMiddleName || "",
            customerLastName: savedData.customerLastName || "",
            proposerDob: savedData.dob || "1985-06-15",
            gender: savedData.gender || "Male",
            mobileNumber: savedData.proposerMobileNumber || "",
            mobileNumber1: savedData.alternatemobileNumber || "",
            email: savedData.proposerEmailAddress || "",
            addressLine1: savedData.permanentAddress1 || "",
            addressLine2: savedData.permanentAddress2 || "",
            addressLine3: savedData.permanentAddress3 || "",
            city: savedData.permanentCity || "",
            state: savedData.permanentState || "",
            pinCode: savedData.permanentPincode || "",
            panNumber: savedData.proposerPanNumber || "",
            maritalStatus: formData.maritalStatus || "",
            isNri: formData.isNri || "N",
            nationality: formData.nationality || "Indian",
            annualIncome: isSummary ? savedData.insuredMemberDetails[0].annualIncome : formData.insuredMemberDetails[0].annualIncome || "",
            sameAsHomeAddress: savedData.sameAsPermanent == true ? "1" : "0" || "",
            tenure: isSummary ? savedData.policyTenure.toString() : formData.policyTenure.toString() || "",
            loanTenure: isSummary ? savedData?.loanTenure?.toString() : formData?.loanTenure?.toString() || "",
            sumInsured: isSummary ? savedData.sumInsured :  formData.sumInsured || "",
            premium: isSummary ? savedData.totalPremium : formData.premium  || "",
            familyConstructId: isSummary ? savedData.familyConstructId : formData.familyConstructId || "",
            familyConstruct: isSummary ? savedData.familyConstruct : formData.familyConstruct|| "",
            occupation: isSummary ? savedData.insuredMemberDetails[0]?.occupation || "" : formData.insuredMemberDetails[0]?.occupation || "",
            occupationCode: isSummary ? selectedOccupationCode[0]?.occupationCode :  selectedOccupationCode[0]?.occupationCode || "",
            productCode: isSummary ? savedData.productCode :  formData.productCode|| "",
            productName: savedData.productName || "",
            productPlanName: isSummary ? savedData.productPlanName : formData.productPlanName|| "",
            productPlanCode: isSummary ? savedData.productPlanCode : formData.productPlanCode || "",
            combiId: isSummary ? savedData.combiId : formData.combiId || "",
            combiName: isSummary ? savedData.combiName : formData.combiName|| "",
            ghiPremium: isSummary ? savedData.ghiPremium : formData.ghiPremium || "",
            gfbPremium: isSummary ? savedData.gfbPremium : formData.gfbPremium || "",
            gpPremium: isSummary ? savedData.gpPremium : formData.gpPremium || "",
            deductibleAmount: isSummary ? savedData.deductibleAmount : formData.deductibleAmount || "",
            accountNumber: savedData.accountNumber || "",
            ifscCode: savedData.ifscCode || "",
            bankName: savedData.bankName || "",
            micrCode: savedData.micrCode || "",
            branchName: savedData.branchName || "",
            bankAccountType: savedData.bankAccountType || "",
            accountType: savedData.accType || "",
            isGoGreen: "1",
            isRider: isSummary ? savedData.optionalRiders : formData.optionalRiders || "no",
            teleOpd: isSummary 
    ? (savedData.teleOpd === "no" ? "0" : savedData.teleOpd === "yes" ? "1" : "1") 
    : (formData.teleOpd === "no" ? "0" : formData.teleOpd === "yes" ? "1" : "1"),
        },
        insuredDetails: (isSummary ? savedData.insuredMemberDetails : formData.insuredMemberDetails).map((member: any) => ({
          leadId: isSummary ? savedData.leadId || "" : formData.leadId || "",
          salutation: isSummary ? member.gender == "M" ? "Mr" : "Ms" : formData.salutation || "",
          firstName: member.firstName || "",
          middleName: member.middleName || "",
          lastName: member.lastName == "" ? "." : member.lastName || "",
          gender: member.gender || "",
          dob: member.dob || "",
          age: member.age.toString(),
          relationWithProposer: member.relation,
          relationCode:
            member.relation !== "Son2" && member.relation !== "Daughter2"
              ? JSON.parse(member.relationshipType)?.id
              : member.relation === "Son2"
              ? "R003"
              : "R004" || "",
          maritalStatus: member.maritalStatus || "",
          email: member.emailId || "",
          mobileNumber: member.mobileNumber || "",
          memberQuestions: [
            {
              questionCode: "",
              answer: "",
              remarks: ""
            }
          ],
          memberPEDDetails: [
            {
              pEDCode: "",
              remarks: ""
            }
          ],
        })) || [],
          nomineeDetails: {
            leadId: savedData.leadId || "",
            nomineeSalutation: savedData.nomineeGender == "M" ? "Mr" : "Ms" || "",
            nomineeFirstName: savedData.nomineeFirstName || "",
            nomineeMiddleName: formData.nomineeMiddleName || "",
            nomineeLastName: savedData.nomineeLastName || "",
            nomineeRelation: savedData.relationWithProposer || "",
            nomineeRelationCode: selectedNomineeRelationCode[0].relationCode  || "",
            nomineeGender: savedData.nomineeGender || "",
            nomineeDob: savedData.nomineeDob || "",
            nomineeAge: this.calculateAge(savedData.nomineeDob).toString() || "",
            nomineeContactNumber: savedData.nomineeMobileNumber || "",
            nomineeEmail: formData.nomineeEmail || "",
            nomineeAddress: savedData.nomineeAddress || "",
            appointeeName: savedData.appointeeName || "",
            appointeeDob: savedData.appointeeDob || "",
            appointeeAge: this.calculateAge(savedData.appointeeDob).toString() || "",
            appointeeContactNo: savedData.appointeeContactNo || "",
            relationshipOfAppointeeCode: savedData.relationshipOfAppointeeCode || "",
            nomineeShare: "100"
          }
      };
    }
    
    convertToCentimeters(feet: number, inches: number): number {
      const feetToCentimeters = feet * 30.48;
      const inchesToCentimeters = inches * 2.54;
      const totalCentimeters = feetToCentimeters + inchesToCentimeters;
      return totalCentimeters;
    }
    calculateAge(dob: Date): number | string {
      const today = new Date();
      const birthDate = new Date(dob);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDifference = today.getMonth() - birthDate.getMonth();
      if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      if (age < 1) {
        const diffInMs = today.getTime() - birthDate.getTime();
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
        return `${diffInDays}days`;
      }
  
      return age;
    }

    getHdfcDispositions(){
      const  getAllDispositions = this.configService.config.baseUrl + this.configService.config.getAllHdfcDispositions;
      return this.httpService.get(getAllDispositions);
    }
    getHdfcSMCodes(){
      const  getAllSMCodes = this.configService.config.baseUrl + this.configService.config.getHDFCSMCodes;
      return this.httpService.get(getAllSMCodes);
    }

    getProdcutList(reqdata:any){
      const  getProductList = this.configService.config.baseUrl + this.configService.config.getProductList;
      return this.httpService.post(getProductList, reqdata);
    }
    uploadBBDocument(reqData:any){
      const uploadDocument= this.configService.config.baseUrl+this.configService.config.uploadBBDocument;
      return this.httpService.post(uploadDocument,reqData);
    }
    getSumInsured(reqData:any){
      const  getsumInsured = this.configService.config.baseUrl + this.configService.config.getSumInsured;
      return this.httpService.post(getsumInsured, reqData);
    }
    getTcPolicyInfoByLeadId(reqData: any) {
      const suminsuredDetails = this.configService.config.baseUrl + this.configService.config.getTcPolicyInfoByLeadId;
      return this.httpService.post(suminsuredDetails, reqData);
    }
    getBataDetailsbyLeadId(reqData: any){
      const getBataDetails = this.configService.config.baseUrl + this.configService.config.getBataDetailsbyLeadId;
      return this.httpService.post(getBataDetails, reqData);
    }
  }
