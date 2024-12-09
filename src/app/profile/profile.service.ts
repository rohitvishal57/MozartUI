import { Injectable } from '@angular/core';
import { ConfigService } from '../services/config.service';
import { HttpService } from '../services/http.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private configService: ConfigService,
    private httpService: HttpService) { }

  getProfileDetails(reqData : any) : Observable<any> {
    const req = this.configService.config.baseUrl + this.configService.config.profileDetails;
    return this.httpService.post(req,reqData);
  }

  getEscalationMatrixDetails(respData : any): Observable<any>{
    const req = this.configService.config.baseUrl + this.configService.config.escalationMatrixDetails;
    return this.httpService.post(req,respData);
  }
  updatePreferredLanguage(reqdata : any){
    const  updateagentlanguagepreference = this.configService.config.baseUrl + this.configService.config.updateagentlanguagepreference;
    return this.httpService.post(updateagentlanguagepreference,reqdata)
  }
}
