import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../../config.service';


@Injectable({
  providedIn: 'root'
})
export class ClaimsService {

  constructor(private http: HttpClient,private configService: ConfigService) {}

  getClaimsList(data: any) { 
    const getClaimsList = this.configService.config.baseUrl + this.configService.config.getClaimsList;
    return this.http.post<any>(getClaimsList, data);
  }

  // getProposalDetails(){
  //   const getProposalDetails = this.configService.config.baseUrl + this.configService.config.getProposalDetails;
  //   return this.http.get<any>(getProposalDetails)
  //   }

    getProposalDetails(agentCode: string) {
      const url = `${this.configService.config.baseUrl}${this.configService.config.getProposalDetails}=${agentCode}`;
      return this.http.get<any>(url);
    }
    

    saveClaims(saveData:any){
      const saveClaims = this.configService.config.baseUrl + this.configService.config.saveClaims;
    return this.http.post<any>(saveClaims, saveData);
    }
      // Method to upload files
    uploadFiles(formData: FormData) {
      const uploadFiles = this.configService.config.baseUrl + this.configService.config.uploadFiles;
    return this.http.post<any>(uploadFiles, formData);
    }

}
