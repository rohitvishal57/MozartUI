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
  deleteagentcartitems(reqData: any) {
    const deleteagentcartitems = this.configService.config.baseUrl + this.configService.config.deleteagentcartitems;
    return this.httpService.post(deleteagentcartitems, reqData);
  }
  Getproductlist2(reqData:any){
    // const  getquotefortopsellingproducts = `https://localhost:7188/getquotefortopsellingproducts`;
    const  getquotefortopsellingproducts = this.configService.config.baseUrl + this.configService.config.getquotefortopsellingproducts;
    return this.httpService.post(getquotefortopsellingproducts,reqData)
  }
  Getproductdetailsandfeatures(reqData:any){
    const  getproductdetailsandfeatures = this.configService.config.baseUrl + this.configService.config.getProductDetailsAndFeatures;
    return this.httpService.post(getproductdetailsandfeatures,reqData)
  }
  getquoterelationsviapolicytype(reqData:any){
    const  getquoterelationsviapolicytype = this.configService.config.baseUrl + this.configService.config.getquoterelationsviapolicytype;
    return this.httpService.post(getquoterelationsviapolicytype,reqData)
  }

  downloadQuote(reqData:any){
    const  quoteUrl = this.configService.config.baseUrl + this.configService.config.downloadQuote;
    return this.httpService.post<any>(quoteUrl,reqData)
  }

  getProductAddOnList(reqData:any){
    const  addOnUrl = this.configService.config.baseUrl + this.configService.config.getProductAddOnList;
    console.log(addOnUrl);
    
    return this.httpService.post<any>(addOnUrl,reqData)
  }
}
