import { Injectable } from '@angular/core';
import { ConfigService } from 'src/app/services/config.service';
import { HttpService } from 'src/app/services/http.service';

@Injectable({
  providedIn: 'root'
})
export class ClaimsViewService {
  constructor(private configService: ConfigService, private httpService: HttpService) { }

  getClaimsList(data: any) {
    const getClaimsList = this.configService.config.baseUrl + this.configService.config.getClaimsList;
    return this.httpService.post(getClaimsList, data);
  }
  getProposalDetails(agentCode: string) {
    const url = `${this.configService.config.baseUrl}${this.configService.config.getProposalDetails}=${agentCode}`;
    return this.httpService.get<any>(url);
  }
  saveClaims(saveData: any) {
    const saveClaims = this.configService.config.baseUrl + this.configService.config.saveClaims;
    return this.httpService.post(saveClaims, saveData);

  }
  uploadFiles(formData: FormData) {
   const uploadFiles = this.configService.config.baseUrl + this.configService.config.uploadFiles;
    return this.httpService.post(uploadFiles, formData);

  }
  getStates(statesReqBody: any){
    const getStates = this.configService.config.baseUrl + this.configService.config.getStates;
    return this.httpService.post(getStates, statesReqBody);
  }

  getCitiesByState(citiesReqBody:any){
    const getCitiesByState = this.configService.config.baseUrl + this.configService.config.getCities;
    return this.httpService.post(getCitiesByState, citiesReqBody);
  }

  getHospitalsByCities(hospitalsReqBody:any){
    const getHospitalsByCities = this.configService.config.baseUrl + this.configService.config.getHospitals;
    return this.httpService.post(getHospitalsByCities, hospitalsReqBody);
  }

  getClaimDetailsView(claimDetailsReqBody:any){
    const getClaimDetailsView = this.configService.config.baseUrl + this.configService.config.getClaimsDetails;
    return this.httpService.post(getClaimDetailsView, claimDetailsReqBody);
  }

  getClaimsHistory(claimHistoryReqBody:any, policyNo:any){
    const getClaimsHistory = this.configService.config.baseUrl + this.configService.config.getClaimHistory+`=${policyNo}`;
   return this.httpService.post(getClaimsHistory, claimHistoryReqBody);
   // return this.httpService.post('https://localhost:7026/api/getclaimHistory?policynumber='+policyNo, claimHistoryReqBody);
  }

  getBlackListedhospitals(claimsBlackListHspReqBody:any){
    const getBlackListedhospitals = this.configService.config.baseUrl + this.configService.config.blackListedHospitals;
    return this.httpService.post(getBlackListedhospitals, claimsBlackListHspReqBody)
  }

  getClaimStatus(claimsReqBody: any) {
    const getClaimStatus = this.configService.config.baseUrl + this.configService.config.getClaimStatus
    return this.httpService.post(getClaimStatus, claimsReqBody)
  }

  getClaimTracker(claimsReqBody: any) {
    const getClaimTracker = this.configService.config.baseUrl + this.configService.config.getClaimTracker
    return this.httpService.post(getClaimTracker, claimsReqBody)
  }

  getUploadedFiles(claimsFilesReqBody:any){
    const getUploadedFiles = this.configService.config.baseUrl + this.configService.config.getUploadedFiles
    return this.httpService.post(getUploadedFiles, claimsFilesReqBody)
   // return this.httpService.post('https://localhost:7026/api/getclaimsdocument', claimsFilesReqBody);
  }

  deleteFile(ClaimsDelBody:any){
    const deleteFile = this.configService.config.baseUrl + this.configService.config.deleteFile
    return this.httpService.post(deleteFile, ClaimsDelBody)

  }
}
