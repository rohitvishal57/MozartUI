import { Injectable } from '@angular/core';
import { ConfigService } from 'src/app/services/config.service';
import { HttpService } from 'src/app/services/http.service';

@Injectable({
  providedIn: 'root'
})
export class QuoteService {

  constructor(private configService: ConfigService,
    private httpService: HttpService) { }

  Getagentcartdetails(reqData:any){
    const agentcartdetails = this.configService.config.baseUrl + this.configService.config.agentCartDetails 
    return this.httpService.post(agentcartdetails,reqData);
  }
  Insertorupdateagentcartdetails(reqData: any) {
    const insertorupdateagentcartdetails = this.configService.config.baseUrl + this.configService.config.insertOrUpdateAgentCartDetails
    return this.httpService.post(insertorupdateagentcartdetails, reqData);
  }
  Getproductlist2(reqData:any){
    // const  getquotefortopsellingproducts = `https://localhost:7188/api/getquotefortopsellingproducts`;
    const  getquotefortopsellingproducts = this.configService.config.baseUrl1 + this.configService.config.getquotefortopsellingproducts;
    return this.httpService.post(getquotefortopsellingproducts,reqData)
  }
  Getproductdetailsandfeatures(reqData:any){
    const  getproductdetailsandfeatures = this.configService.config.baseUrl + this.configService.config.getProductDetailsAndFeatures;
    return this.httpService.post(getproductdetailsandfeatures,reqData)
  }
}
