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

  fetchLeadStatusCount(): Observable<any> {
    const PinCodeByCity = this.configService.config.baseUrl + this.configService.config.pinCodeDetails;
    return this.httpService.get(PinCodeByCity);
  }

  fetchProposalStatusCount(): Observable<any> {
    const PinCodeByCity = this.configService.config.baseUrl + this.configService.config.pinCodeDetails;
    return this.httpService.get(PinCodeByCity);
  }
}
