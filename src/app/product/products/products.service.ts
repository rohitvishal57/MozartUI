import { Injectable } from '@angular/core';
import { ConfigService } from 'src/app/services/config.service';
import { HttpService } from 'src/app/services/http.service';
import { NgToastService } from "ng-angular-popup";
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private configService: ConfigService,
    private httpService: HttpService,private toast: NgToastService,private router: Router) { }


  Getproductlist(reqData:any){
    const productList = this.configService.config.baseUrl + this.configService.config.productList;
    return this.httpService.post(productList,reqData)
  }


  addToCompare(item: any, compareItems : any) {
    const MAX_COMPARE_ITEMS = 3; 
    if (compareItems.length >= MAX_COMPARE_ITEMS) {
      this.toast.error({ detail:"",summary: 'Only three products can be added to compare!' ,duration:5000});
      return 0;
    }
    const isAlreadyPresent = compareItems.some((existingItem :any) => existingItem.productName === item.productName);
    if (isAlreadyPresent) {
      this.toast.warning({ detail: "", summary: 'This product has already been added for comparison. Please choose another product. ', duration: 5000 });
      return 0;
    }
    return item.productId;
}

removeCompareItem(item: any , compareItems : any){
  compareItems = compareItems.filter((existingItem:any) => existingItem !== item);
  console.log('Item removed from comparison.');
  return compareItems;
}
navigateToProductComparison(compareItems : any , module : any ){
  if(module.includes('z')){
    compareItems = compareItems.map((product:any) =>{
      product.keyFeatures = JSON.parse(product.keyFeatures.split(",")); // Convert string to array
      return product;
    });
  }
  sessionStorage.setItem('compareItems', JSON.stringify(compareItems));
  this.router.navigate(['/products/comparison'], {
  });
}

closeComparison(compareItems : any){
  return compareItems = [];
}

}
