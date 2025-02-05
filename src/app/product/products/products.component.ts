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
import { LeadsService } from 'src/app/leads/leads.service';
import { error, param } from 'jquery';
import { RugService } from 'src/app/rug/rug.service';

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
  paramLeadId: any;
  leadId: any;
  quickQuoteRedirect : Boolean = false;
  searchProductName : any ;
  productsInformation  : any[] =[];
  isHdfcIMD : Boolean = false;
  isHdfcCustomer : Boolean = false;
  token : any = '';
  redirect : any = '';

  constructor(private router: Router, private toast: NgToastService,
    private encryptionService: EncryptionService, public common: CommonService, private productService: ProductsService,
   private quoteservices: QuoteService,private aesEncryptService: AesEncryptionService,
   private route: ActivatedRoute, private languageService: LanguageService,
   private translateService: TranslateService,public headerInformation : HeaderInformation,private leadsService: LeadsService,  private rugService: RugService ) {}

  ngOnInit(): void {

    const currentUrl = this.router.url;
    if (currentUrl.includes("hdfc")) {
      this.route.queryParams.subscribe(params => {
        this.leadId = params['leadnumber'];
        this.token =  params['token'];
        this.redirect = params['redirect'];
        if(this.leadId){
          this.quickQuoteRedirect = true;
        }
      });
      if(this.redirect == 'hdfc-products'){
        this.isHdfcCustomer = true;
        localStorage.setItem('token',this.token);
      }else{
        this.isHdfcIMD = true;
        localStorage.setItem('token','aa59deee594c4c90abd5737929d0302e');
      }
      localStorage.setItem('agentCode','I0002484');
    }else if (currentUrl.includes("axis")) {
      this.route.queryParams.subscribe(params => {
      this.leadId = params['leadnumber'];
      this.token =  params['token'];
      if(this.leadId){
        this.quickQuoteRedirect = true;
      }
      localStorage.setItem('agentCode','467899');

    });
    }else{
      this.route.queryParams.subscribe(params => {
        this.leadId = params['leadnumber'];
        if(this.leadId){
          this.quickQuoteRedirect = true;
        }
      });
    }

   
    this.route.params.subscribe(async (params) => {
        this.paramLeadId = decodeURIComponent(this.route.snapshot.params['leadId'])
        console.log(this.paramLeadId)
      if (Object.keys(this.route.snapshot.params).length > 0) {
        console.log('Route has parameters:', params);
        this.paramLeadId = this.aesEncryptService.decryptUrlData(this.paramLeadId);
        console.log(this.paramLeadId)
        this.paramLeadId = JSON.parse(this.paramLeadId)
        this.leadId = this.paramLeadId.LeadId;
        this.partnerId = this.paramLeadId.PartnerId;
        this.productId = this.paramLeadId.ProductId;
        // this.formSequence = JSON.parse(this.paramLeadId.FormSequence);
        console.log(this.formSequence);
        this.rugService.changeStatus(true)
        localStorage.setItem('token', this.paramLeadId.token)
        localStorage.setItem('agentCode', this.paramLeadId.AgentCode)
        localStorage.setItem('leadId', this.paramLeadId.LeadId)
        this.agentCode = this.paramLeadId.AgentCode;
      }

    if(this.paramLeadId !== "undefined"){      
      try {
        const reqData = {
          partnerId: this.partnerId,
          productId: this.productId,
        };
        const res = await firstValueFrom(this.common.Getformsequence(reqData));
        console.log(res);
        this.formSequence = JSON.parse(res.data.formSequence);
        console.log(this.formSequence);
      } catch (err) {
        console.error(err);
      }
    }
    });
    

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
    if(this.isHdfcIMD){
    this.agentCode = "I0002484";
    }
    const reqData = {
      "agentCode": this.agentCode
    }
    this.productService.Getproductlist(reqData).subscribe({
      next: (res: any) => {
        this.ProductList = this.productsInformation = res.data;
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
   if(this.isHdfcIMD){
    this.router.navigate(['rug/customerDetails'], {
      state: { productInformation: item}
    });
    return 
  }

    this.formData = { ...this.formData, productName: item.productName}

   
    try {
      await this.getProposalNum();
      console.log(item)
      this.formData = { ...this.formData,proposalNumber:this.proposalNum,applicableZones:item.applicableZones}
      await this.getFormSequence(item);
      console.log(item)
      console.log(this.formData);

      const productData :any = {
        partnerId: item.partnerId,
        productId: item.productId,
        proposalNum: this.proposalNum,
        applicableZones:item.applicableZones
      }

      if(this.quickQuoteRedirect){
        await this.getLeadInformationByLeadNumber(item.productName)
        productData.leadId = this.leadId;
        productData.quickQuoteRedirect = this.quickQuoteRedirect
      }

      console.log(productData)
      // if (this.formSequence != null && this.formSequence.length > 0) {
      //   this.router.navigate(['yatra'], {
      //     state: { productData: productData, formSequence: this.formSequence }
      //   });
      // }
   
        if (this.formSequence != null && this.formSequence.length > 0 && ( this.agentCode == "467898" || this.agentCode == "467896" || this.agentCode == "467897")) {
          if(this.agentCode == "467898"){
            let reqObj = {
              "leadId": this.leadId,
              "agentCode": this.agentCode,
              "partnerId": item.partnerId,
              "productId": item.productId
            }
            this.common.UpdateAgentAllFormData(reqObj).subscribe({
              next: (res: any) => {
                res = JSON.parse(res.data)
                console.log(res);
                if (res.isSuccess == true && res.statusCode == 200) {
                  this.router.navigate(['rug'], {
                    state: { productData: productData, formSequence: this.formSequence }
                 });
                  // if (this.getFormIndexValue() < this.formSequence.length - 1) {
                  //   this.incrementIndex();
                  //   this.getFormDataFromFormSequence(this.formSequence[this.getFormIndexValue()].formId);
                    
                  // }
        
                }
        
              },
              error: (err:any) => {
                console.error(err);
              }
            });
          }else{
            if(this.agentCode == "467896" || this.agentCode == "467897"){
              this.router.navigate(['rug'], {
                state: { productData: productData, formSequence: this.formSequence, productCode: item.productCode, productName: item.productName }
             });
            }
            else{
                this.router.navigate(['rug'], {
              state: { productData: productData, formSequence: this.formSequence }
           });

            }


          }
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
      this.toast.warning({ detail: "Warning", summary: "Form Configuration not found!!", duration: 2000 });
    }
  }
  productsDetail(item: any) {
    this.router.navigate(['quote/productDetails'], {
      state: { item: item  , leadnumber:this.leadId  , quickQuoteRedirect : this.quickQuoteRedirect}
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
  this.productService.navigateToProductComparison(this.compareItems ,'products');
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
      this.toast.error({
        detail: 'Error',
        summary: 'Failed to Add Product for Comparison'
      });
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
    // First, try downloading by clicking the link
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
 
    window.open(URL, '_blank');  // Open in a new tab for Chrome
      
    } else {
      console.error('Invalid or missing URL.');
    }
 
}

  async getLeadInformationByLeadNumber( productName: any) {
    try {
      const response = await firstValueFrom(this.leadsService.getLeadInformationByLeadID(this.leadId));
      const leadInformation = response?.data?.leadList[0];
      leadInformation.interestedProductName = productName;
      leadInformation.isUpdate = 1;
      leadInformation.proposalNumber =  this.proposalNum;
      this.leadsService.saveLeadData(leadInformation).subscribe(
        (response) => {
          console.log("Lead has been Successfully Updated", response);
        }, (error) => {
          console.log("Failed to update Lead Infomation", error);
        });

    }
    catch (error) {
      console.log("Failed to fetch lead Information!", error)
    }
  }

  productSearch() {
    this.ProductList = this.productsInformation;
    this.ProductList = this.ProductList.filter(product =>
      product.productName.trim().toLowerCase().includes(this.searchProductName.trim().toLowerCase())
    );
  }

}