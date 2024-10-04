import { Injectable } from '@angular/core';
import { ConfigService } from 'src/app/config.service';
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
    return this.httpService.post(`https://localhost:7188/api/getquotefortopsellingproducts`,reqData)
  }
  Getproductdetailsandfeatures(reqData:any){
    const  getproductdetailsandfeatures = this.configService.config.baseUrl + this.configService.config.getProductDetailsAndFeatures;
    return this.httpService.post(getproductdetailsandfeatures,reqData)
  }
}
