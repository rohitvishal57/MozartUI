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
    return this.http.get<any>(`${this.yatraUrl}api/agent/getpincodedetails?pincode=${response}`);
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
    return this.http.get<any>(`${this.yatraUrl}Agent/getOccupation`);
  }

  getAllOccupationRisk(){
    return this.http.get<any>(`${this.yatraUrl}Agent/getRiskOccupation`);
  }

  getAllBankDetails(){
    return this.http.get<any>(`${this.yatraUrl}Agent/getAllBankDetails`);
  }

  getBankCity(reqBody:any){
    return this.http.post<any>(`${this.yatraUrl}getBankCity`,reqBody);
  }

  getBranchDetails(reqBody:any){
    return this.http.post<any>(`${this.yatraUrl}getBranchDetails`,reqBody);
  }

  getAddOnPremium(reqData: any){
    return this.http.post<any>(`${this.yatraUrl}Agent/CalculateAddonValue`,reqData);
  }

  getIdentification(){
    return this.http.get<any>(`${this.yatraUrl}Agent/getId`);
  }

  getProposerOccupation(){
    return this.http.get<any>(`${this.yatraUrl}Agent/getProposerOccupation`);
  }

  // getProposerRelationships(reqData: any){
  //   return this.http.post<any>(`${this.baseUrl}Agent/getProposerRelationships`,reqData);
  // }
  
  getNatureOfOccupation(){
    return this.http.get<any>(`${this.baseUrl}Agent/GetNatureOfWork`);
  }

  getNationality(){
    return this.http.get<any>(`${this.baseUrl}Agent/getNationality`);
  }

  getGstRegistrationStatus(){
    return this.http.get<any>(`${this.baseUrl}Agent/getGstRegistrationStatus`);
  }

  getSalutation(){
    return this.http.get<any>(`${this.baseUrl}Agent/getSalutation`);
  }

  getMaritalStatus(){
    return this.http.get<any>(`${this.yatraUrl}Agent/getMaritalStatus`);
  }

  getEducationType(){
    return this.http.get<any>(`${this.yatraUrl}Agent/getEducationType`);
  }

  getNomineeRelationship(){
    return this.http.get<any>(`${this.yatraUrl}Agent/getNomineeRelationShip`);
  }

  getRelationship(){
    return this.http.get<any>(`${this.yatraUrl}Agent/getRelationship`);
  }

  getHalfQuotation(reqData: any){
    return this.http.post<any>(`${this.yatraUrl}getHalfQuote`,reqData);
  }
  getHalfQuote(reqData: any){
    return this.http.post<any>(`${this.yatraUrl}Agent/Agency/GetHalfQuote`,reqData);
  }
  getFullQuote(reqData: any){
    return this.http.post<any>(`${this.yatraUrl}Agent/Agency/GetHalfQuote`,reqData);
  }
  getInsurerData(){
    return this.http.get<any>(`${this.yatraUrl}Agent/GetInsurerData`);
  }
   //yatra
   Getform(reqData:any){
    return this.http.post<any>(`${this.yatraUrl}api/forms/getform`,reqData)
  }
  Getproductdetailsandfeatures(reqData:any){
    return this.http.post<any>(`${this.yatraUrl}api/product/getproductdetailsandfeatures`,reqData)
  }
  Insertorupdatejourneydetails(reqData:any){
    return this.http.post<any>(`${this.yatraUrl}api/forms/insertorupdatejourneydetails`,reqData)
  }
  Insertorupdateformconfig(reqData:any){
    return this.http.post<any>(`${this.yatraUrl}api/forms/insertorupdateformconfig`,reqData)
  }
  InsertOrUpdateForm(reqdata:any){
    return this.http.post<any>(`${this.yatraUrl}api/`,reqdata)
  }
  Insertorupdateformdata(reqdata:any){
    return this.http.post<any>(`${this.yatraUrl}api/forms/insertorupdateformdata`,reqdata)
  }
  GetProposerRelationships(reqData:any){
    return this.http.post<any>(`${this.yatraUrl}Agent/GetProposerRelationships`,reqData)
  }
  GetAllFormData(reqData: any) {
    return this.http.post<any>(`${this.yatraUrl}Banca/Forms/GetAllFormDataViaVerticalCode`, reqData);
  }

  getProposalNumber() {
    return this.http.get<any>(`${this.yatraUrl}api/product/getproposalnumber`);
  }
  Getproductlist(reqData:any){
    return this.http.post<any>(`${this.yatraUrl}api/product/getproductlist`,reqData)
  }
  Getproductlist2(reqData:any){
    return this.http.post<any>(`https://5765cf9e-4ee6-4c3d-80b9-1b4f14eb4794.mock.pstmn.io/abhi`,reqData)
  }
  Getproductlist3(reqData:any){
    return of(this.getproduct)
  }
  // Getproductlist3(reqData:any){
  //   return this.http.post<any>(`https://1762f1a5-b8b1-464d-bd9b-f0d6529b1304.mock.pstmn.io/Getproductlist3`,reqData)
  // }
  Getformsequence(reqData:any){
    return this.http.post<any>(`${this.yatraUrl}api/forms/getformsequence`,reqData)
  }
}
