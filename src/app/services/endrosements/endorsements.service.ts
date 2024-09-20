import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EndorsementsService {
  private baseUrl: string = 'https://usp.monocept.ai/';
  constructor(private http:HttpClient) { }
  getEndorsementDetailsApi(reqBody: any) {
  return this.http.post<any>(this.baseUrl+'claims/api/endorsement/endorsementdetails', reqBody);
  }

  getEndorsementsPolicies(reqBody: any) {
    return this.http.post<any>(this.baseUrl+'claims/api/endorsement/getactivepolicynumbers', reqBody);
    }
      // Method to upload files
  endorsementUploadFiles(formData: FormData): Observable<any> {
        return this.http.post<any>(this.baseUrl+'api/endorsement/endorsementfileuploadtoomnidocs', formData);
  }
  endorsementCreateRequest(formData: FormData): Observable<any> {
    return this.http.post<any>(this.baseUrl+'api/endorsement/endorsementcreaterequest', formData);
    // return this.http.post<any>('https://localhost:7026/api/endorsement/endorsementcreaterequest' ,formData)
}
getEndorsementPolicyInfo(formData: any){
  return this.http.post<any>(this.baseUrl+'/claims/api/endorsement/getpolicyinfodetails', formData);
}
}
