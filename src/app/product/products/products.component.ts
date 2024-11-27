import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { firstValueFrom } from 'rxjs';
import { CommonService } from 'src/app/services/common.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { ProductsService } from './products.service';
import { QuoteService } from 'src/app/quote/quote.service';
import { AesEncryptionService } from 'src/app/services/AESEncrypt.service';
import { LanguageService } from 'src/app/services/language.service';
import { TranslateService } from '@ngx-translate/core';
import HeaderInformation from 'src/app/layout/headerInfo';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  providers :[HeaderInformation]
})
export class ProductsComponent implements OnInit {

  stylesList: any[] = [];
  private formData: any = {}
  private allJsonFormData: any[] = []

  proposalNum: any;
  formSequence: any[] = [];
  isProductAdded: boolean = false;

  selectedToggle: string = '';
  style: any;
  verticalCode = localStorage.getItem('verticalCode');
  code = localStorage.getItem('code');
  products: any[] = []
  ProductList: any[] = [];
  cartProductList: any[] = [];
  agentCode = localStorage.getItem('agentCode');
  partnerId: any
  productId: any
  compareItems: any[] = [];
  private dynamicStyle!: HTMLLinkElement;
  displayNoProductsMessage: boolean = false;
  showSpecialForm: boolean = false;
  state: any;


  constructor(private router: Router, private toast: NgToastService,
    private encryptionService: EncryptionService, public common: CommonService, private productService: ProductsService,
   private quoteservices: QuoteService,private aesEncryptService: AesEncryptionService,
   private route: ActivatedRoute, private languageService: LanguageService,
   private translateService: TranslateService,public headerInformation : HeaderInformation) {

  }

  ngOnInit(): void {
    this.languageService.language$.subscribe(lang => {
      this.translateService.use(lang).subscribe({
        error: () => {
          this.translateService.use('en'); // Fallback to English if translation file is missing
        }
      });
    });
    console.log(this.agentCode);
    // sessionStorage.clear()
    if (sessionStorage.getItem("cardListProducts"))
      this.cartProductList = this.encryptionService.decrypt(sessionStorage.getItem("cardListProducts") as string);
    else
      this.cartProductList = [];
    localStorage.setItem("formIndex", "0")
    this.getPoductList();
  }

  getPoductList() {
    // this.selectedToggle = item.insuranceType
    const reqData = {
      "agentCode": this.agentCode
    }
    this.productService.Getproductlist(reqData).subscribe({
      next: (res: any) => {
        this.ProductList = res.data;
        console.log(this.ProductList)
      },
      error: (err) => {
        console.error(err);
        if (err.status === 404) {
          this.displayNoProductsMessage = true;
        }
      }
    })
    
  }
  // async insurenow(item: any) {
  //   this.removeFromCart(item);
  //   this.formData = { ...this.formData, productName: item.productName }
  //   try {
  //     await this.getFormSequence(item);
  //     await this.getProposalNum();
  //     console.log(item)
  //     const productData = {
  //       productid: item.productid,
  //       productStartDate: item.productstartdate,
  //       productEndDate: item.productenddate,
  //       productName: item.productname,
  //       insurancetypecode: item.insurancetypecode,
  //       proposalNumber: this.proposalNum,
  //       agencyCode:item.agencycode
  //     };
  //     console.log(productData)
  //     if (this.formSequence != null && this.formSequence.length > 0) {
  //       this.router.navigate(['portal/abhi/forms'], {
  //         state: { productData: productData, formSequence: this.formSequence }
  //       });
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }
  // async getFormSequence(item: any) {
  //   console.log(item);

  //   try {
  //     sessionStorage.clear();
  //     const res = await firstValueFrom(this.service.getFormConfigViaVerticalCode(item.verticalcode, item.agencycode, item.insurancetypecode, item.productid));
  //     console.log(res);
  //     this.formSequence = JSON.parse(res.insureFormConfiguration);
  //     console.log(this.formSequence);

  //     if (this.formSequence != null && this.formSequence.length > 0) {
  //       this.formSequence.forEach(() => { this.allJsonFormData.push({}) });
  //       sessionStorage.setItem("allJsonForm", this.encryptionService.encrypt(this.allJsonFormData));
  //     }
  //     console.log(this.allJsonFormData);
  //     sessionStorage.setItem("allFormData", this.encryptionService.encrypt(this.formData));
  //     localStorage.setItem("formIndex", "0");
  //   } catch (err) {
  //     this.toast.warning({ detail: "WARNING", summary: "Form Configuration not found!!", duration: 2000 });
  //   }
  // }

  async getProposalNum() {
    try {
      const res = await firstValueFrom(this.common.getProposalNumber());
      console.log(res);
      this.proposalNum = res.data.proposalNumber;
      console.log(this.proposalNum);
      
    } catch (error) {
      console.error(error);
    }
  }

  addToCart(item: any) {
    this.cartProductList.push(item);
    sessionStorage.setItem("cardListProducts", this.encryptionService.encrypt(this.cartProductList));
  }

  removeFromCart(item: any) {
    this.cartProductList = this.cartProductList.filter((element: any) => element.productname !== item.productname);
    sessionStorage.setItem("cardListProducts", this.encryptionService.encrypt(this.cartProductList));
  }

  async buyNow(item: any) {
    this.formData = { ...this.formData, productName: item.productName}
    try {
      await this.getProposalNum();
      console.log(item)
      this.formData = { ...this.formData,proposalNumber:this.proposalNum,applicableZones:item.applicableZones}
      await this.getFormSequence(item);
      console.log(item)
      console.log(this.formData);
      
      const productData = {
        partnerId: item.partnerId,
        productId: item.productId,
        proposalNum: this.proposalNum,
        applicableZones:item.applicableZones
      }
      console.log(productData)
      // if (this.formSequence != null && this.formSequence.length > 0) {
      //   this.router.navigate(['yatra'], {
      //     state: { productData: productData, formSequence: this.formSequence }
      //   });
      // }
   
        if (this.formSequence != null && this.formSequence.length > 0 && (this.agentCode == "467899" || this.agentCode == "467898")) {
          this.router.navigate(['rug'], {
             state: { productData: productData, formSequence: this.formSequence }
          });
        }else{
          this.router.navigate(['yatra'], {
            state: { productData: productData, formSequence: this.formSequence }
         });
        }
      
    } catch (error) {
      console.error(error);
    }
  }
  async getFormSequence(item: any) {
    console.log(item);
    try {
      sessionStorage.clear();
      const reqData = {
        "partnerId": item.partnerId,
        "productId": item.productId

      }
      console.log(reqData);
      const res = await firstValueFrom(this.common.Getformsequence(reqData));
      console.log(res);
      this.formSequence = JSON.parse(res.data.formSequence);
      console.log(this.formSequence);

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
  }
  productsDetail(item: any) {
    this.router.navigate(['quote/productDetails'], {
      state: { item: item }
    });
  }


addToCompareProducts(item: any){
let productId = this.productService.addToCompare(item,this.compareItems);
if(productId!=0){
  this.getProductInformation(productId);
}
}

removeCompareItemProduct(item: any){
 this.compareItems = this.productService.removeCompareItem(item,this.compareItems);
  
}
navigateToProductComparison(){
  this.productService.navigateToProductComparison(this.compareItems);
}

closeProductComparison(){
  this.productService.closeComparison(this.compareItems);
}

getProductInformation(productId: String ){
  const reqData = {
    "productId": productId,
    "agentCode": localStorage.getItem('agentCode')
  }
  console.log(reqData);
  this.quoteservices.Getproductdetailsandfeatures(reqData).subscribe({
    next: (res: any) => {
      console.log(res.data);
      this.compareItems.push(res.data);
    },
    error: (err) => {
      this.toast.error({ detail: 'Failed to Add Product for Comparison ' });
      console.error(err);
    }
  });
}

donwloadBrowcher(productName : any){
  const downloadBrowcherProduct = this.headerInformation.downloadBrowcher.find((element: any) =>
    element.productName.includes(productName));
  
    if (downloadBrowcherProduct) {
      const URL = downloadBrowcherProduct.browcherURL;
      const link = document.createElement('a');
      link.href = URL;
      link.download = URL.split('/').pop() || 'download.pdf';     
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      console.error('Invalid or missing URL.');
    }
 
}


}