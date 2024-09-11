import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private baseUrl: string = 'https://usp.monocept.ai/api/Banca/Admin/';
  // private baseUrl: string = 'http://20.235.250.168:8086/Banca/Admin/';

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
  getAllProductList() {
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
}
