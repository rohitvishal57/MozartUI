import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '../services/config.service';
@Injectable({
  providedIn: 'root'
})
export class CustomersService {

  constructor( private http: HttpClient,
    private configService: ConfigService) { }

    getCustomerListApi(reqBody: any) { 
    const getCustomerList = this.configService.config.baseUrl + this.configService.config.getCustomerList;
    return this.http.post<any>(getCustomerList, reqBody);
    }
    sendCustomerDetails(reqBody:any){
      const sendCustomerDetails=this.configService.config.baseUrl +this.configService.config.sendCustomerDetails;
      return this.http.post<any>(sendCustomerDetails,reqBody)
    }  
    downloadCustomerData(reqBody:any){
      const downloadCustomerData=this.configService.config.baseUrl + this.configService.config.download;
      return this.http.post<any>(downloadCustomerData,reqBody)
    }
    searchDocumentApi(reqBody:any){
      const searchDocument=this.configService.config.baseUrl + this.configService.config.searchDocument;
      return this.http.post<any>(searchDocument,reqBody)
    }
    downloadDocumentApi(reqBody:any){
      const downloadDocument=this.configService.config.baseUrl + this.configService.config.downloadDocument;
      return this.http.post<any>(downloadDocument,reqBody)
    }
}
