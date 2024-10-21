import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from 'src/app/services/config.service';
import { HttpService } from 'src/app/services/http.service';

@Injectable({
  providedIn: 'root'
})
export class EndorsementsRequestsService {

  constructor(private configService: ConfigService,private httpService: HttpService) { }

  getEndorsementDetailsApi(reqBody: any) {
    // const getEndorsementDetailsApi = this.configService.config.baseUrl + this.configService.config.endorsementdetails;
    return this.httpService.post("https://localhost:7026/api/endorsementdetails", reqBody);
  }

  getactivepolicynumbersApi(reqBody: any) {
    const getactivepolicynumbersApi = this.configService.config.baseUrl + this.configService.config.getactivepolicynumbers;
    return this.httpService.post(getactivepolicynumbersApi, reqBody);
    }
    
  endorsementUploadFilesApi(formData: FormData): Observable<any> {
    const endorsementUploadFilesApi = this.configService.config.baseUrl + this.configService.config.endorsementfileuploadtoomnidocs;
    return this.httpService.post(endorsementUploadFilesApi, formData);
  }

  endorsementCreateRequestApi(formData: FormData): Observable<any> {
    const endorsementCreateRequestApi = this.configService.config.baseUrl + this.configService.config.endorsementcreaterequest;
    return this.httpService.post(endorsementCreateRequestApi, formData);
  }
  
  getEndorsementPolicyInfoApi(formData: any){
    const getEndorsementPolicyInfoApi = this.configService.config.baseUrl + this.configService.config.getpolicyinfodetails;
    return this.httpService.post(getEndorsementPolicyInfoApi, formData);
  }
  
  endorsementSendOtpApi(formData:any){
    const endorsementSendOtpApi = this.configService.config.baseUrl + this.configService.config.endorsementGetOTP;
    return this.httpService.post(endorsementSendOtpApi, formData);
  }

  endorsementCaseDetailsApi(formData:any){
    const endorsementCaseDetailsApi = this.configService.config.baseUrl + this.configService.config.endorsementCaseDetails;
    return this.httpService.post(endorsementCaseDetailsApi, formData);
  }
}
