import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable, of } from 'rxjs';
import { ConfigService } from '../config.service';
@Injectable({
  providedIn: 'root',
})
export class CommonService {
  private baseUrl: string = 'https://usp.monocept.ai/api/';
  private yatraUrl: string = 'https://usp.monocept.ai/yatra/';
  // private baseUrl: string = 'http://20.235.250.168:8086/';

  public baseCssUrl= 	'https://usp.monocept.ai/ABHI/' 
  getproduct = {
    "success": true,
    "message": "Quote Generated Successfully",
    "data": {
      "partnerId": 1,
      "partnerName": "HDFC Bank",
      "partnerCode": null,
      "products": [
        {
          "productId": 1,
          "productName": "Activ One Max",
          "productCode": "7200",
          "planCode": "MassMarket",
          "subPlanCode": "MassMarket",
          "productDescription": "The Active One Max plan offers exceptional health coverage with a range of robust features designed to provide maximum protection and financial flexibility. Earn up to 100% HealthReturns™ by maintaining a healthy lifestyle, rewarding you for prioritizing your well-being. The plan includes Claim Protect, which waives non-medical expenses, ensuring that unexpected costs are covered. Benefit from Super Reload, which automatically restores your sum insured up to 100% after a claim, ensuring continuous coverage",
          "keyFeatures": "[\"No restrictions on the type of hospital room you choose\",\"Covers non-medical expenses or the cost of consumables such as gloves, oxygen masks, nebulization kits, etc.\",\"100% discount on renewal premiums\"]",
          "imageUrl": "../../../../assets/logo/activeOne.svg",
          "tenure1Premium": "24379.83",
          "tenure2Premium": "45102.68",
          "tenure3Premium": "65825.53",
          "t2DiscountAmount": "3099.13",
          "t3DiscountAmount": "6198.26",
          "t2DiscountPercentage": 7.50,
          "t3DiscountPercentage": 10.00,
          "productFeatures": [
            {
              "featureName": "Vaccine Cover",
              "categoryName": "Health Add On",
              "featureDescription": null
            },
            {
              "featureName": "Tele-OPD Consultation",
              "categoryName": "Health Add On",
              "featureDescription": null
            },
            {
              "featureName": "Personal Accident",
              "categoryName": "Optional Covers",
              "featureDescription": null
            },
            {
              "featureName": "Critical Illness",
              "categoryName": "Optional Covers",
              "featureDescription": null
            },
            {
              "featureName": "Durable Equipment Cover",
              "categoryName": "Optional Covers",
              "featureDescription": null
            },
            {
              "featureName": "Second Medical Opinion for listed Major Illness",
              "categoryName": "Optional Covers",
              "featureDescription": null
            },
            {
              "featureName": "Annual Screening Package for Cancer Diagnosed Patients",
              "categoryName": "Optional Covers",
              "featureDescription": null
            },
            {
              "featureName": "Per Claim Deductable",
              "categoryName": "Optional Covers",
              "featureDescription": null
            },
            {
              "featureName": "Preferred Provider Network",
              "categoryName": "Optional Covers",
              "featureDescription": null
            },
            {
              "featureName": "Compassionate Visit",
              "categoryName": "Optional Covers",
              "featureDescription": null
            },
            {
              "featureName": "Room Rent Type Options",
              "categoryName": "Optional Covers",
              "featureDescription": null
            },
            {
              "featureName": "Cancer Booster",
              "categoryName": "Optional Covers",
              "featureDescription": null
            },
            {
              "featureName": "HLTH Meter",
              "categoryName": "Optional Covers",
              "featureDescription": null
            }
          ]
        },
        {
          "productId": 2,
          "productName": "Activ One Max Plus",
          "productCode": "7200",
          "planCode": "MassMarket_Plus",
          "subPlanCode": "MassMarket_Plus",
          "productDescription": "The Active One Max + plan offers exceptional health coverage with a range of robust features designed to provide maximum protection and financial flexibility. Earn up to 100% HealthReturns™ by maintaining a healthy lifestyle, rewarding you for prioritizing your well-being. The plan includes Claim Protect, which waives non-medical expenses, ensuring that unexpected costs are covered. Benefit from Super Reload, which automatically restores your sum insured up to 100% after a claim, ensuring continuous coverage",
          "keyFeatures": "[\"Unlimited Restoration Benifit\",\"Day Care treatments are covered\",\"Full Coverage even if you are hospitalize at home\"]",
          "imageUrl": "../../../../assets/logo/activeOne.svg",
          "tenure1Premium": "28239.76",
          "tenure2Premium": "52243.56",
          "tenure3Premium": "76247.35",
          "t2DiscountAmount": "3589.80",
          "t3DiscountAmount": "7179.60",
          "t2DiscountPercentage": 7.50,
          "t3DiscountPercentage": 10.00,
          "productFeatures": [
            {
              "featureName": "Vaccine Cover",
              "categoryName": "Health Add On",
              "featureDescription": null
            },
            {
              "featureName": "Tele-OPD Consultation",
              "categoryName": "Health Add On",
              "featureDescription": null
            },
            {
              "featureName": "Personal Accident",
              "categoryName": "Optional Covers",
              "featureDescription": null
            },
            {
              "featureName": "Critical Illness",
              "categoryName": "Optional Covers",
              "featureDescription": null
            },
            {
              "featureName": "Second Medical Opinion for listed Major Illness",
              "categoryName": "Optional Covers",
              "featureDescription": null
            },
            {
              "featureName": "Annual Screening Package for Cancer Diagnosed Patients",
              "categoryName": "Optional Covers",
              "featureDescription": null
            },
            {
              "featureName": "Reduction In Specific Disease Waiting Period",
              "categoryName": "Optional Covers",
              "featureDescription": null
            },
            {
              "featureName": "Reduction In Pre-Existing Disease Waiting Period",
              "categoryName": "Optional Covers",
              "featureDescription": null
            },
            {
              "featureName": "Per Claim Deductable",
              "categoryName": "Optional Covers",
              "featureDescription": null
            },
            {
              "featureName": "Preferred Provider Network",
              "categoryName": "Optional Covers",
              "featureDescription": null
            },
            {
              "featureName": "Compassionate Visit",
              "categoryName": "Optional Covers",
              "featureDescription": null
            },
            {
              "featureName": "Room Rent Type Options",
              "categoryName": "Optional Covers",
              "featureDescription": null
            },
            {
              "featureName": "Cancer Booster",
              "categoryName": "Optional Covers",
              "featureDescription": null
            },
            {
              "featureName": "HLTH Meter",
              "categoryName": "Optional Covers",
              "featureDescription": null
            }
          ]
        },
        {
          "productId": 3,
          "productName": "Activ One VIP",
          "productCode": "7200",
          "planCode": "VIP",
          "subPlanCode": "VIP",
          "productDescription": "The Active One VIP Plan is a premium health insurance plan designed to offer comprehensive coverage with a range of exclusive benefits for those seeking top-tier healthcare protection. This plan provides extensive coverage with high sum insured options and additional features tailored to meet the needs of discerning policyholders.",
          "keyFeatures": "[\"Option to cover costs of durable equipments like wheelchair, ventilator, etc.\",\"Covers expenses incurred for undergoing HIV / AIDS treatment\",\"Covers expenses associated with pregnancy\"]",
          "imageUrl": "../../../../assets/logo/activeOne.svg",
          "tenure1Premium": "30219.80",
          "tenure2Premium": "55906.63",
          "tenure3Premium": "81593.46",
          "t2DiscountAmount": "3841.50",
          "t3DiscountAmount": "7683.00",
          "t2DiscountPercentage": 7.50,
          "t3DiscountPercentage": 10.00,
          "productFeatures": [
            {
              "featureName": "Vaccine Cover",
              "categoryName": "Health Add On",
              "featureDescription": null
            },
            {
              "featureName": "Tele-OPD Consultation",
              "categoryName": "Health Add On",
              "featureDescription": null
            },
            {
              "featureName": "Personal Accident",
              "categoryName": "Optional Covers",
              "featureDescription": null
            },
            {
              "featureName": "Critical Illness",
              "categoryName": "Optional Covers",
              "featureDescription": null
            },
            {
              "featureName": "Durable Equipment Cover",
              "categoryName": "Optional Covers",
              "featureDescription": null
            },
            {
              "featureName": "Second Medical Opinion for listed Major Illness",
              "categoryName": "Optional Covers",
              "featureDescription": null
            },
            {
              "featureName": "Annual Screening Package for Cancer Diagnosed Patients",
              "categoryName": "Optional Covers",
              "featureDescription": null
            },
            {
              "featureName": "Reduction In Specific Disease Waiting Period",
              "categoryName": "Optional Covers",
              "featureDescription": null
            },
            {
              "featureName": "Reduction In Pre-Existing Disease Waiting Period",
              "categoryName": "Optional Covers",
              "featureDescription": null
            },
            {
              "featureName": "Compassionate Visit",
              "categoryName": "Optional Covers",
              "featureDescription": null
            },
            {
              "featureName": "Cancer Booster",
              "categoryName": "Optional Covers",
              "featureDescription": null
            },
            {
              "featureName": "\"Geographical extension to include USA and Canada\" for Global Cover (Emergency Only)",
              "categoryName": "Optional Covers",
              "featureDescription": null
            },
            {
              "featureName": "HLTH Meter",
              "categoryName": "Optional Covers",
              "featureDescription": null
            }
          ]
        }
      ]
    }
  }
  constructor(private http: HttpClient,private configService: ConfigService) { }


  // For All PartnerApi
   getQoute(reqData: any) {
    console.log(reqData);

    return this.http.post<any>(`${this.baseUrl}getHealthQuote`, reqData);
  }

  getActiveFitQoute(reqData: any) {
    return this.http.post<any>(`${this.baseUrl}getHealthQuoteForAF`, reqData);
  }
  getAllStates() {
    return this.http.post<any>(`${this.yatraUrl}getStates`, {});
  }
  getAllRelationship(){
    return this.http.post<any>(`${this.yatraUrl}getRelationShip`,{});
  }
  getCityByPinCode(pinCode: any) {
    const headers = { 'content-type': 'application/json' };
    return this.http.post<any>(`${this.yatraUrl}getPinCode`, pinCode, { 'headers': headers });
  }
  getPinCodeByCity(response: any) {
    const PinCodeByCity = this.configService.config.baseUrl + this.configService.config.pinCodeDetails;
    return this.http.get<any>(`${PinCodeByCity}?pincode=${response}`);
  }

  // getHealthPlans(year: any, adultCount: any, childCount: any) {
  //   return this.http.get<any>(`${this.apiUrl}`);
  // }

  // CreateProposal(reqData: any) {
  //   return this.http.post<any>(`${this.baseUrl}Banca/PartnerApi/CreateProposal`, reqData);
  // }
  // convertToRDBMS(data: any) {
  //   const data1 = JSON.stringify(data);
  //   const headers = { 'content-type': 'application/json' }
  //   return this.http.post(`${this.baseUrl}Banca/Forms/ConvertToRDBMS`, data1, { 'headers': headers });
  // }
  //For ICICI
  // getOccupations() {
  //   return this.http.get<any>(`${this.apiUrl1}`);
  // }

  //For ABHI
  getAllOccupation(){
    const getOccupation = this.configService.config.baseUrl + this.configService.config.getOccupation;
    return this.http.get<any>(getOccupation);
  }

  getAllOccupationRisk(){
    return this.http.get<any>(`${this.yatraUrl}Agent/getRiskOccupation`);
  }

  getAllBankDetails(){
    const  getAllBankDetails = this.configService.config.baseUrl + this.configService.config.getAllBankDetails;
    return this.http.get<any>(getAllBankDetails);
  }

  getBankCity(reqBody:any){
    return this.http.post<any>(`${this.yatraUrl}getBankCity`,reqBody);
  }

  getBranchDetails(reqBody:any){
    return this.http.post<any>(`${this.yatraUrl}getBranchDetails`,reqBody);
  }

  getAddOnPremium(reqData: any){
    const  CalculateAddonValue = this.configService.config.baseUrl + this.configService.config.calculateAddOnValue;
    return this.http.post<any>(CalculateAddonValue,reqData);
  }

  getIdentification(){
    const getId = this.configService.config.baseUrl + this.configService.config.getId;
    return this.http.get<any>(getId);
  }

  getProposerOccupation(){
    const getProposerOccupation = this.configService.config.baseUrl + this.configService.config.getProposerOccupation;
    return this.http.get<any>(getProposerOccupation);
  }

  // getProposerRelationships(reqData: any){
  //   return this.http.post<any>(`${this.baseUrl}Agent/getProposerRelationships`,reqData);
  // }
  
  getNatureOfOccupation(){
    const Occupation = this.configService.config.baseUrl + this.configService.config.getNatureOfWork;
    return this.http.get<any>(Occupation);
  }

  getNationality(){
    const getNationality = this.configService.config.baseUrl + this.configService.config.getNationality;
    return this.http.get<any>(getNationality);
  }

  getGstRegistrationStatus(){
    const getGstRegistrationStatus = this.configService.config.baseUrl + this.configService.config.getGstRegistrationStatus;
    return this.http.get<any>(getGstRegistrationStatus);
  }

  getSalutation(){
    const  Salutation = this.configService.config.baseUrl + this.configService.config.getSalutation;
    console.log(Salutation);
    return this.http.get<any>(Salutation);
  }

  getMaritalStatus(){
    const  getMaritalStatus = this.configService.config.baseUrl + this.configService.config.getMaritalStatus;
    return this.http.get<any>(getMaritalStatus);
  }

  getEducationType(){
    const  getEducationType = this.configService.config.baseUrl + this.configService.config.getEducationType;
    return this.http.get<any>(getEducationType);
  }

  getNomineeRelationship(){
    const  getNomineeRelationShip = this.configService.config.baseUrl + this.configService.config.getNomineeRelationShip;
    return this.http.get<any>(getNomineeRelationShip);
  }

  getRelationship(){
    const  getRelationship = this.configService.config.baseUrl + this.configService.config.getRelationship;
    return this.http.get<any>(getRelationship);
  }

  getHalfQuote(reqData: any){
    const  GetHalfQuote = this.configService.config.baseUrl + this.configService.config.getHalfQuote;
    return this.http.post<any>(GetHalfQuote,reqData);
  }
  getFullQuote(reqData: any){
    const  GetHalfQuote = this.configService.config.baseUrl + this.configService.config.getHalfQuote;
    return this.http.post<any>(GetHalfQuote,reqData);
  }
  getInsurerData(){
    const getInsurerData = this.configService.config.baseUrl + this.configService.config.getInsurerData;
    return this.http.get<any>(getInsurerData);
  }
   //yatra
   Getform(reqData:any){
    const getform = this.configService.config.baseUrl + this.configService.config.getForm
    return this.http.post<any>(getform,reqData)
  }
  Getproductdetailsandfeatures(reqData:any){
    const  getproductdetailsandfeatures = this.configService.config.baseUrl + this.configService.config.getProductDetailsAndFeatures;
    return this.http.post<any>(getproductdetailsandfeatures,reqData)
  }
  Insertorupdatejourneydetails(reqData:any){
    const  insertorupdatejourneydetails = this.configService.config.baseUrl + this.configService.config.insertOrUpdateJourneyDetails;
    return this.http.post<any>(insertorupdatejourneydetails,reqData)
  }
  Insertorupdateformconfig(reqData:any){
    return this.http.post<any>(`${this.yatraUrl}api/forms/insertorupdateformconfig`,reqData)
  }
  InsertOrUpdateForm(reqdata:any){
    return this.http.post<any>(`${this.yatraUrl}api/`,reqdata)
  }
  Insertorupdateformdata(reqdata:any){
    const  insertorupdateformdata = this.configService.config.baseUrl + this.configService.config.insertOrUpdateFormData;
    return this.http.post<any>(insertorupdateformdata,reqdata)
  }
  GetProposerRelationships(reqData:any){
    const  GetProposerRelationships = this.configService.config.baseUrl + this.configService.config.getProposerRelationships;
    return this.http.post<any>(GetProposerRelationships,reqData)
  }

  getProposalNumber() {
    const proposalnumber = this.configService.config.baseUrl + this.configService.config.proposalNumber;
    return this.http.get<any>(proposalnumber);
  }
  Getproductlist(reqData:any){
    const productList = this.configService.config.baseUrl + this.configService.config.productList;
    return this.http.post<any>(productList,reqData)
  }
  Getproductlist2(reqData:any){
    return this.http.post<any>(`https://localhost:7188/api/getquotefortopsellingproducts`,reqData)
  }
  Getproductlist3(reqData:any){
    return of(this.getproduct)
  }
  // Getproductlist3(reqData:any){
  //   return this.http.post<any>(`https://1762f1a5-b8b1-464d-bd9b-f0d6529b1304.mock.pstmn.io/Getproductlist3`,reqData)
  // }
  Getformsequence(reqData:any){
    const formSequence = this.configService.config.baseUrl + this.configService.config.formSequence;
    return this.http.post<any>(formSequence,reqData)
  }

  GetSingleProductQuote(reqData:any){
    const singleProductQuote=this.configService.config.baseUrl+this.configService.config.getSingleProductQuote;
    return this.http.post<any>(singleProductQuote,reqData);
  }

  GetKycDetails(reqData:any){
    // const kycDetails=this.configService.config.baseUrl+this.configService.config.GetKycDetails;
    return this.http.post<any>(`https://localhost:7188/api/getkycdetails`,reqData);
  }

  GetCustomerDetailsViaPolicyNumber(reqData:any){
    const policyNumber=this.configService.config.baseUrl+this.configService.config.getPolicyNumberDetails;
    return this.http.post<any>(policyNumber,reqData);
  }
}
