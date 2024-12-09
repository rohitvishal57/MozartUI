import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { firstValueFrom } from 'rxjs';
import { EncryptionService } from 'src/app/services/encryption.service';
import { NgToastService } from 'ng-angular-popup';
import { ProductsService } from '../products.service';
import { QuoteService } from 'src/app/quote/quote.service';
import { FormBuilder, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-product-comparison',
  templateUrl: './product-comparison.component.html',
  styleUrls: ['./product-comparison.component.scss']
})
export class ProductComparisonComponent {

  comparisonItems: any = [];
  agentCode = localStorage.getItem('agentCode');
  formSequence: any[] = [];
  ProductList:any[]=[];
  private allJsonFormData: any[] = [];
  formData: any = {};
  comparisonItem1 : any = {};
  comparisonItem2 : any = {};
  comparisonItem3 : any = {};
  productComparison : Boolean = false;
  selectedProduct : any ='';

  constructor(private router: Router,private productService: ProductsService,
    private common: CommonService,private encryptionService: EncryptionService, 
    private toast: NgToastService,private quoteservices: QuoteService
  ){
  }

  ngOnInit(): void {
    const savedItems = sessionStorage.getItem('compareItems');
    if (savedItems) {
      this.comparisonItems = JSON.parse(savedItems);
    }
    // this.comparisonItems = this.comparisonItems.map((product:any) =>{
    //   product.keyFeatures = JSON.parse(product.keyFeatures.split(",")); // Convert string to array
    //   return product;
    // });

    this.refreshComparisonItems();
    this.getProductList();
   }


  redirectProducts(comparisonItem: any) {   
      const reqData = {
        "agentCode": this.agentCode
      }
      this.productService.Getproductlist(reqData).subscribe({
        next: async (res: any) => {
          try {
            const reqData = {
              "partnerId": comparisonItem.partnerId,
              "productId": comparisonItem.productId
            }
            const res = await firstValueFrom(this.common.Getformsequence(reqData));
            this.formSequence = JSON.parse(res.data.formSequence);
      
            if (this.formSequence != null && this.formSequence.length > 0) {
              this.formSequence.forEach(() => { this.allJsonFormData.push({}) });
              sessionStorage.setItem("allJsonForm", this.encryptionService.encrypt(this.allJsonFormData));
            }
            console.log(this.allJsonFormData);
            sessionStorage.setItem("allFormData", this.encryptionService.encrypt(this.formData));
            localStorage.setItem("formIndex", "0");
          } catch (err) {
            this.toast.warning({ detail: "WARNING", summary: "Form Configuration not found!!", duration: 2000 });
          }
          const productData = {
            partnerId: comparisonItem.partnerId,
            productId: comparisonItem.productId,
            productComparison:true,
            proposalNum : ' '

          }
            this.router.navigate(['yatra'], {
              state: { productData: productData, formSequence: this.formSequence }
           });  
        },
        error: (err) => {
          console.error(err);
        }
      });
    
  }

  refreshComparisonItems(){
    this.comparisonItem1 = (this?.comparisonItems?.length ?? 0) > 0 ? this.comparisonItems[0] : "";
    this.comparisonItem2 = (this?.comparisonItems?.length ?? 0) > 1 ? this.comparisonItems[1] : "";
    this.comparisonItem3 = (this?.comparisonItems?.length ?? 0) > 2 ? this.comparisonItems[2] : "";
    sessionStorage.setItem("compareItems", JSON.stringify( this.comparisonItems));
  }

  deleteProduct(comparisonItem : any){
    this.comparisonItems = this.comparisonItems.filter((item : any) => item.productName !== comparisonItem.productName);
    console.log('this.comparisonItems',this.comparisonItems);
    this.refreshComparisonItems();
    this.toast.success({ detail: "", summary: 'Product has been deleted from product comparison successfully.', duration: 3000 });

  }

  getProductList() {
    const reqData = {
      "agentCode": this.agentCode
    }
    this.productService.Getproductlist(reqData).subscribe({
      next: (res: any) => {
        this.ProductList = res.data;
        console.log('ProductList',this.ProductList);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  addCompareItem(event: any) {
    let selectProductName = event.target.value;
    const productCheck : Boolean = this.comparisonItems.find((product: any) => product.productName == selectProductName);
    if(productCheck){
      this.selectedProduct ='';
      this.toast.warning({ detail: "", summary: 'The selected product is already chosen. Please select a different product.', duration: 5000 });
    }else{
      const selectedProduct = this.ProductList.find((product: any) => product.productName == selectProductName);
      this. getProductInformation(selectedProduct.productId);
    }
  }

  getProductInformation(productId: String) {
    let features: any
    const reqData = {
      "productId": productId,
      "agentCode": localStorage.getItem('agentCode')
    }
    this.quoteservices.Getproductdetailsandfeatures(reqData).subscribe({
      next: (res: any) => {
        console.log(res.data);
        const productInformation = res.data;
        productInformation.keyFeatures = JSON.parse(productInformation.keyFeatures.split(","));
        this.comparisonItems.push(productInformation);
        this.refreshComparisonItems();
      },
      error: (err) => {
        this.toast.error({ detail: 'Failed to Add Product for Comparison ' });
        console.error(err);
      }
    });
  }

  backToProducts(){
    this.router.navigate(['/products'], {
    });
  }

}
