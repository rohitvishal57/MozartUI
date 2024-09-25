import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from 'src/app/config.service';

@Injectable({
  providedIn: 'root'
})
export class EndorsementsService {
  constructor(private http:HttpClient, private configService: ConfigService) { }

  getEndorsementDetailsApi(reqBody: any) {
    const getEndorsementDetailsApi = this.configService.config.baseUrl + this.configService.config.endorsementdetails;
    return this.http.post<any>(getEndorsementDetailsApi, reqBody);
  }

  getactivepolicynumbersApi(reqBody: any) {
    const getactivepolicynumbersApi = this.configService.config.baseUrl + this.configService.config.getactivepolicynumbers;
    return this.http.post<any>(getactivepolicynumbersApi, reqBody);
    }
    
  endorsementUploadFilesApi(formData: FormData): Observable<any> {
    const endorsementUploadFilesApi = this.configService.config.baseUrl + this.configService.config.endorsementfileuploadtoomnidocs;
    return this.http.post<any>(endorsementUploadFilesApi, formData);
  }

  endorsementCreateRequestApi(formData: FormData): Observable<any> {
    const endorsementCreateRequestApi = this.configService.config.baseUrl + this.configService.config.endorsementcreaterequest;
    return this.http.post<any>(endorsementCreateRequestApi, formData);
  }
  
  getEndorsementPolicyInfoApi(formData: any){
    const getEndorsementPolicyInfoApi = this.configService.config.baseUrl + this.configService.config.getpolicyinfodetails;
    return this.http.post<any>(getEndorsementPolicyInfoApi, formData);
  }
}
