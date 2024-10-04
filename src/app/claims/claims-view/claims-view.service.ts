import { Injectable } from '@angular/core';
import { ConfigService } from 'src/app/config.service';
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
  // Method to upload files
  uploadFiles(formData: FormData) {
    const uploadFiles = this.configService.config.baseUrl + this.configService.config.uploadFiles;
    return this.httpService.post(uploadFiles, formData);
  }
}
