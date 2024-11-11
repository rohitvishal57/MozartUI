import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from 'src/app/services/config.service';
import { HttpService } from 'src/app/services/http.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private configService: ConfigService, private httpService: HttpService) { }

  getPinCodeByCity(reqdata: any) {
    const PinCodeByCity = this.configService.config.baseUrl + this.configService.config.pinCodeDetails;
    return this.httpService.post(PinCodeByCity, reqdata);
  }

  fetchLeadStatusCount(payload: any): Observable<any> {
    const url = this.configService.config.baseUrl + this.configService.config.getLeadStatusCount;
    return this.httpService.post(url, payload);
  }

  fetchProposalStatusCount(payload: any): Observable<any> {
    const url = this.configService.config.baseUrl + this.configService.config.getProposalStatusCount;
    return this.httpService.post(url, payload);
  }

  fetchRenewalStatusCount(payload: any): Observable<any> {
    const url = this.configService.config.baseUrl + this.configService.config.getRenewalStatusCount;
    return this.httpService.post(url, payload);
  }
}
