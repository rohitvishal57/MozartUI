import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '../services/config.service';
@Injectable({
  providedIn: 'root'
})
export class CustomersService {

  constructor( private http: HttpClient,
    private configService: ConfigService) { }
    getCustomerDetailsListApi(reqBody: any) { 
    const getCustomerDetailsList = this.configService.config.baseUrl + this.configService.config.getCustomerDetailsList;
    return this.http.post<any>(getCustomerDetailsList, reqBody);
  }}
