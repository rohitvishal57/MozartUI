import { Injectable } from '@angular/core';
import { ConfigService } from 'src/app/services/config.service';
import { HttpService } from 'src/app/services/http.service';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private configService: ConfigService,
    private httpService: HttpService) { }


  Getproductlist(reqData:any){
    const productList = this.configService.config.baseUrl + this.configService.config.productList;
    return this.httpService.post(productList,reqData)
  }
}
