import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private baseUrl: string = 'https://usp.monocept.ai/ABHIUPAPI/Banca/Admin/';
  private baseUrl1: string = 'https://usp.monocept.ai/api/';
  // private baseUrl: string = 'http://20.235.250.168:8086/Banca/Admin/';
  private apiUrl = './assets/health-plans.json';
  private apiUrl1 = './assets/occupations.json';
  constructor(private http: HttpClient) {}

  getAllChannelList() {
    return this.http.get<any>(`${this.baseUrl}GetAllChannel`);
  }
  getAllBankList() {
    return this.http.get<any>(`${this.baseUrl}GetAllBank`);
  }
  getAllInsuranceTypeList() {
    return this.http.get<any>(`${this.baseUrl}GetAllInsuranceType`);
  }
  getAllUserDetailsList() {
    return this.http.get<any>(`${this.baseUrl}GetAllUserDetails`);
  }
  insertChannel(channelDetails: any) {
    return this.http.post<any>(`${this.baseUrl}InsertChannel`, channelDetails);
  }
  updateChannel(channelDetails: any) {
    return this.http.post<any>(`${this.baseUrl}UpdateChannel`, channelDetails);
  }
  insertBank(bankDetails: any) {
    return this.http.post<any>(`${this.baseUrl}InsertBank`, bankDetails);
  }
  updateBank(bankDetails: any) {
    return this.http.post<any>(`${this.baseUrl}UpdateBank`, bankDetails);
  }
  insertInsuranceType(insuranceTypeDetails: any) {
    return this.http.post<any>(
      `${this.baseUrl}InsertInsuranceType`,
      insuranceTypeDetails
    );
  }
  updateInsuranceType(insuranceTypeDetails: any) {
    return this.http.post<any>(
      `${this.baseUrl}UpdateInsuranceType`,
      insuranceTypeDetails
    );
  }
  insertUser(userDetails: any) {
    return this.http.post<any>(`${this.baseUrl}InsertUser`, userDetails);
  }
  updateUser(userDetails: any) {
    return this.http.post<any>(`${this.baseUrl}UpdateUser`, userDetails);
  }
  getAllProductsList() {
    return this.http.get<any>(`${this.baseUrl}GetAllProduct`);
  }
  addProduct(productDetails: any) {
    return this.http.post<any>(`${this.baseUrl}AddProduct`, productDetails);
  }
  updateProduct(productDetails: any) {
    return this.http.post<any>(`${this.baseUrl}UpdateProduct`, productDetails);
  }
  insertBancaChannelInsuranceMap(mapDetails: any) {
    return this.http.post<any>(
      `${this.baseUrl}InsertBancaChannelInsuranceMap`,
      mapDetails
    );
  }
  deleteBancaChannelInsuranceMap(mapDetails: any) {
    return this.http.post<any>(
      `${this.baseUrl}DeleteBancaChannelInsuranceMap`,
      mapDetails
    );
  }
  insertBancaChannelInsuranceProductMap(productMapDetails: any) {
    return this.http.post<any>(
      `${this.baseUrl}InsertBancaChannelInsuranceProductMap`,
      productMapDetails
    );
  }
  deleteBancaChannelInsuranceProductMap(addonsMapDetails: any) {
    return this.http.post<any>(
      `${this.baseUrl}DeleteBancaChannelInsuranceProductMap`,
      addonsMapDetails
    );
  }
  getAllChannelBankMap() {
    return this.http.get<any>(`${this.baseUrl}GetAllBankMap`);
  }
  getAllInsuranceMap() {
    return this.http.get<any>(`${this.baseUrl}GetAllInsuranceMap`);
  }
  getAllProductMap() {
    return this.http.get<any>(`${this.baseUrl}GetAllProductMap`);
  }
  //Agent Api's
  getAllAgentDetailsList() {
    return this.http.get<any>(`${this.baseUrl}GetAllAgentDetails`);
  }

  getAllAgencyDetails() {
    return this.http.get<any>(`${this.baseUrl}GetAllAgencyDetails`);
  }
  insertAgent(agentDetails: any) {
    return this.http.post<any>(`${this.baseUrl}InsertAgent`, agentDetails);
  }

  updateAgent(agentDetails: any) {
    return this.http.post<any>(`${this.baseUrl}UpdateAgent`, agentDetails);
  }

  insertAgency(agencyDetails: any) {
    return this.http.post<any>(`${this.baseUrl}InsertAgency`, agencyDetails);
  }

  updateAgency(agencyDetails: any) {
    return this.http.post<any>(`${this.baseUrl}UpdateAgency`, agencyDetails);
  }

  getAgencyChannelInsuranceMap() {
    return this.http.get<any>(`${this.baseUrl}GetAllAgencyChannelInsuranceMap`);
  }

  getAllAgencyChannelInsuranceProductMap() {
    return this.http.get<any>(
      `${this.baseUrl}GetAllAgencyChannelInsuranceProductMap`
    );
  }

  insertAgencyChannelInsuranceProductMap(productMapDetails: any) {
    return this.http.post<any>(
      `${this.baseUrl}InsertAgencyChannelInsuranceProductMap`,
      productMapDetails
    );
  }
  DeleteAgencyChannelInsuranceProductMap(addonsMapDetails: any) {
    return this.http.post<any>(
      `${this.baseUrl}DeleteAgencyChannelInsuranceProductMap`,
      addonsMapDetails
    );
  }
  InsertAgencyChannelInsuranceMap(mapDetails: any) {
    return this.http.post<any>(`${this.baseUrl}InsertAgencyChannelInsuranceMap`, mapDetails);
  }
  GetMasterFormByFormName(formName:any){
    return this.http.get<any>(`${this.baseUrl}GetMasterFormByFormName?formName=${formName}`)
  }
  GetMasterFormNames(){
    return this.http.get<any>(`${this.baseUrl}GetMasterFormNames`)
  }
  convertData(reqData: any,reqType: number){
    return this.http.post<any>(`${this.baseUrl1}Agent/ConvertData?dataType=${reqType}`,reqData);

  }

  draftSave(reqData: any){
    return this.http.post<any>(`${this.baseUrl1}draftSave`,reqData);
  }

  saveLeadDetails(reqData: any){
    return this.http.post<any>(`${this.baseUrl1}saveLeadDetails`,reqData);
  }
  insertLeadDetails(reqData: any) {
    return this.http.post<any>(`${this.baseUrl1}Agent/Agency/InsertLeadDetails`, reqData);
  }

  commonDraftSave(reqData:any){
    return this.http.post<any>(`${this.baseUrl1}commonDraftSave`,reqData);
  }

  getTotalPremiumEncrypted(reqData: number){
    console.log(reqData);
    let res = this.http.post<any>(`${this.baseUrl1}encrypt`,reqData,{responseType: 'text' as 'json'});
    console.log(res);
    
    return res;
    
  }
  getFormConfig(bankCode: number, insuranceTypeCode: number, productId: any) {
    return this.http.get<any>(`${this.baseUrl1}Banca/Forms/GetFormConfig?bankCode=${bankCode}&insuranceTypeCode=${insuranceTypeCode}&productId=${productId}`);
  }
  getJSONForm(bankCode: any, insuranceTypeCode: number, productId: any, formId: number) {
    return this.http.get<any>(`${this.baseUrl1}Banca/Forms/GetJSONForm?bankCode=${bankCode}&insuranceTypeCode=${insuranceTypeCode}&productId=${productId}&formId=${formId}`);
  }
  insertFormConfig(formConfig: any) {
    return this.http.post<any>(`${this.baseUrl1}Banca/Forms/InsertFormConfigViaVerticalCode`, formConfig);
  }
  insertJSONForm(jsonForm: any) {
    return this.http.post<any>(`${this.baseUrl1}Banca/Forms/InsertJSONFormViaVerticalCode`, jsonForm);
  }
  insertOrUpdateFormData(formData: any) {
    return this.http.post<any>(`${this.baseUrl1}Banca/Forms/InsertOrUpdateFormData`, formData);
  }
  getFormData(bankCode: any, insuranceTypeCode: number, productId: any, formId: number, proposalNumber: any) {
    return this.http.get<any>(`${this.baseUrl1}Banca/Forms/GetFormData?bankCode=${bankCode}&insuranceTypeCode=${insuranceTypeCode}&productId=${productId}&formId=${formId}&proposalNumber=${proposalNumber}`);
  }
  getAllFormData(bankCode: any) {
    return this.http.get<any>(`${this.baseUrl1}Banca/Forms/GetAllFormData?bankCode=${bankCode}`);
  }
  //Agents

  getFormConfigViaVerticalCode(verticalCode: number, Code: number, insuranceTypeCode: number, productId: string) {
    return this.http.get<any>(`${this.baseUrl1}Banca/Forms/GetFormConfigViaVerticalCode?verticalCode=${verticalCode}&Code=${Code}&insuranceTypeCode=${insuranceTypeCode}&productId=${productId}`);
  }

  getJSONFormViaVerticalCode(verticalCode: any, Code: number, insuranceTypeCode: number, productId: string, formId: number) {
    return this.http.get<any>(`${this.baseUrl1}Banca/Forms/GetJSONFormViaVerticalCode?verticalCode=${verticalCode}&Code=${Code}&insuranceTypeCode=${insuranceTypeCode}&productId=${productId}&formId=${formId}`);
  }

  insertOrUpdateFormDataViaVertical(formData: any) {
    return this.http.post<any>(`${this.baseUrl1}Banca/Forms/InsertOrUpdateFormDataViaVerticalCode`, formData);
  }

  getAllFormDataViaVerticalCode(reqData: any) {
    return this.http.post<any>(`${this.baseUrl1}Banca/Forms/GetAllFormDataViaVerticalCode`, reqData);
  }

  insertOrUpdateJourneyDetailsViaVerticalCode(reqData: any) {
    return this.http.post<any>(`${this.baseUrl1}Banca/Forms/InsertOrUpdateJourneyDetailsViaVerticalCode`, reqData);
  }
  getJourneyDetailsByProposalNum(reqData: any) {
    return this.http.post<any>(`${this.baseUrl1}Banca/Forms/GetJourneyDetailsByProposalNum`, reqData);
  }
  getJourneyDetailsViaVerticalCode(verticalCode:any,code:any,agentCode:any){
    return this.http.get<any>(`${this.baseUrl1}Banca/Forms/GetJourneyDetailsViaVerticalCode?verticalCode=${verticalCode}&Code=${code}&AgentCode=${agentCode}`);
  }
  resumeJourneyViaFormName(reqData: any){
    return this.http.post<any>(`${this.baseUrl1}Banca/Forms/ResumeJourneyViaFormName`,reqData);
  }
  getAllBankDetails() {
    return this.http.get<any>(`${this.baseUrl1}Banca/User/GetAllBankDetails`);
  }
  sendLoginRequest(loginData: any) {
    return this.http.post<any>(`${this.baseUrl1}Banca/User/Login`, loginData);
  }
  sendAdminLoginRequest(loginData: any) {
    return this.http.post<any>(`${this.baseUrl1}yatra/Banca/Admin/Login`, loginData);
  }

  getAllProductsViaBankCode(bankCode: any) {
    return this.http.get<any>(
      `${this.baseUrl1}Banca/Product/GetAllProductsViaBankCode?bankCode=${bankCode}`
    );
  }
  getAllProductListViaBankCode(bankCode: number, insuranceTypeCode: number) {
    return this.http.get<any>(
      `${this.baseUrl1}Banca/Product/GetAllProductListViaBankCode?bankCode=${bankCode}&insuranceTypeCode=${insuranceTypeCode}`
    );
  }
  getAllProducts(verticalCode: any, code: any) {
    return this.http.get<any>(
      `${this.baseUrl1}Banca/Product/GetProduct?verticalCode=${verticalCode}&code=${code}`
    );
  }

  getAllProductList(verticalCode: any, code: any, insuranceTypeCode: any) {
    return this.http.get<any>(
      `${this.baseUrl1}Banca/Product/GetProductList?verticalCode=${verticalCode}&code=${code}&insuranceTypeCode=${insuranceTypeCode}`
    );
  }
  getHealthPlans(year: any, adultCount: any, childCount: any) {
    return this.http.get<any>(`${this.apiUrl}`);
  }

  CreateProposal(reqData: any) {
    return this.http.post<any>(`${this.baseUrl1}Banca/PartnerApi/CreateProposal`, reqData);
  }
  convertToRDBMS(data: any) {
    const data1 = JSON.stringify(data);
    const headers = { 'content-type': 'application/json' }
    return this.http.post(`${this.baseUrl1}Banca/Forms/ConvertToRDBMS`, data1, { 'headers': headers });
  }
  // For ICICI
  getOccupations() {
    return this.http.get<any>(`${this.apiUrl1}`);
  }
}
