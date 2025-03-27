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
    getCustomerBasicDetailsApi(reqBody:any){
      const customerBasicDetails=this.configService.config.baseUrl + this.configService.config.getCustomerBasicDetails;
      return this.http.post<any>(customerBasicDetails,reqBody)
    }
    getCustomerProductDetailsApi(policyNumber:any){
      const customerProductDetails=this.configService.config.baseUrl + this.configService.config.getCustomerProductDetails+ `=${policyNumber}`;
      return this.http.post<any>(customerProductDetails,policyNumber)
    }
    getCustomerInsuredDetailsApi(policyNumber:any){
      const customerInsuredDetails=this.configService.config.baseUrl + this.configService.config.getCustomerInsuredDetails+ `=${policyNumber}`;
      return this.http.post<any>(customerInsuredDetails,policyNumber)
    }
    getCustomerClaimDetailsApi(reqBody:any){
      const customerClaimDetails=this.configService.config.baseUrl + this.configService.config.getCustomerClaimDetails;
      return this.http.post<any>(customerClaimDetails,reqBody)
    }
    getCustomerEndorsementDetailsApi(policyNumber:any){
      const customerEndorsementDetails=this.configService.config.baseUrl + this.configService.config.getCustomerEndorsementDetails+ `=${policyNumber}`;
      return this.http.post<any>(customerEndorsementDetails,policyNumber)
    }
    goodhealthmemberurl(reqBody:any){
      const goodhealthmemberurl=this.configService.config.baseUrl + this.configService.config.goodhealthmemberurl;
      return this.http.post<any>(goodhealthmemberurl,reqBody)
    }
    getproposaltest(reqBody:any){
      const getproposaltest=this.configService.config.baseUrl + this.configService.config.getproposaltest;
      return this.http.post<any>(getproposaltest,reqBody)
    }
    updateproposaltest(reqBody:any){
      const updateproposaltest=this.configService.config.baseUrl + this.configService.config.updateproposaltest;
      return this.http.post<any>(updateproposaltest,reqBody)
    }
}
