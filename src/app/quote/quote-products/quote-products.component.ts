import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { NgToastService } from "ng-angular-popup";
import { CommonService } from "src/app/services/common.service";
import { EncryptionService } from "src/app/services/encryption.service";
import { QuoteService } from "../quote.service";
import { firstValueFrom } from "rxjs";
import { ConfirmationService, MessageService } from "primeng/api";
import { AesEncryptionService } from "src/app/services/AESEncrypt.service";
import { LoadingService } from "src/app/services/loading.service";
import { LanguageService } from "src/app/services/language.service";
import { TranslateService } from "@ngx-translate/core";
import { ProductsService } from "src/app/product/products/products.service";


@Component({
  selector: 'app-quote-products',
  templateUrl: './quote-products.component.html',
  styleUrls: ['./quote-products.component.scss'],
  providers: [ConfirmationService, MessageService]
})
export class QuoteProductsComponent implements OnInit {
  stylesList: any[] = [];
  formData: any = {}
  private allJsonFormData: any[] = []

  proposalNum: any;
  formSequence: any[] = [];
  isProductAdded: boolean = false;

  selectedToggle: string = '';
  style: any;
  verticalCode = localStorage.getItem('verticalCode');
  code = localStorage.getItem('code');
  products: any[] = []
  ProductList: any[] = []
  cartProductList: any[] = [];
  agentCode = localStorage.getItem('agentCode')
  partnerId: any
  productId: any

  plans: any[] =
    [
      { price: 0, duration: 0, discount: 0 }
    ];
  plan: [[]] = [[]]
  selectedPlans: any[] = [];

  private dynamicStyle!: HTMLLinkElement;

  displayNoProductsMessage: boolean = false;

  showSpecialForm: boolean = false;
  addonView: any[] = []
  isOverlayVisible = false;
  popIndex: any
  selectedAddons: string[] = [];
  selectedPlanIndex: any;
  compareItems: any[] = [];

  constructor(private quoteService: QuoteService, private router: Router, private toast: NgToastService,
    private service: CommonService, private encryptionService: EncryptionService, private spinner: LoadingService,
    private confirmationService: ConfirmationService, private aesEncryptService: AesEncryptionService, private languageService: LanguageService,
    private translateService: TranslateService,
    private productService: ProductsService, private quoteservices: QuoteService
  ) { }
  ngOnInit(): void {
    this.languageService.language$.subscribe(lang => {
      this.translateService.use(lang).subscribe({
        error: () => {
          this.translateService.use('en'); // Fallback to English if translation file is missing
        }
      });
    });
    // sessionStorage.clear()
    this.formData = this.encryptionService.decrypt(sessionStorage.getItem('formData') as string);
    localStorage.setItem("formIndex", "0")
    console.log(this.formData, this.agentCode, this.cartProductList);
    this.getPoductList();
  }

  getPoductList() {
    // this.selectedToggle = item.insuranceType
    const reqData = {
      agentCode: this.agentCode,
      sumInsured: String(this.formData.sumInsured),
      quoteData: JSON.stringify(this.formData)
    }
    // this.loginService.Getproductlist(reqData).subscribe({
    //   next: (res) => {
    //     this.ProductList = res.data;
    //     console.log(this.ProductList)
    //     this.ProductList.forEach((item:any)=>{
    //       item.keyFeatures = JSON.parse(item.keyFeatures)
    //       console.log(typeof(item.keyFeatures));
    //       this.plans[1].discount = item.t2DiscPercentage;
    //       this.plans[2].discount = item.t3DiscPercentage;
    //     })
    //   },
    //   error: (err) => {
    //     console.error(err);
    //     if (err.status === 404) {
    //       this.displayNoProductsMessage = true;
    //     }
    //   }
    // })
    console.log(reqData);
    // this.spinner.show();
    // this.service.Getproductlist3({}).subscribe({
    this.quoteService.Getproductlist2(reqData).subscribe({
      next: (res: any) => {
        console.log(res)
        this.Getagentcartdetails();
        this.partnerId = res.data.partnerId
        this.ProductList = res.data.products
        console.log(this.ProductList);
        this.ProductList.forEach((prod: any) => {
          // Parse keyFeatures and initialize selectedAddon
          prod.keyFeatures = JSON.parse(prod.keyFeatures);
          prod.selectedAddon = [];

          // Round tenure premiums
          prod.tenure1Premium = Math.round(prod.tenure1Premium);
          prod.tenure2Premium = Math.round(prod.tenure2Premium);
          prod.tenure3Premium = Math.round(prod.tenure3Premium);

          // Optionally, log the updated product
          console.log(prod);
        });

        this.selectedPlans = Array(this.ProductList.length).fill(3);
        this.addonView = Array(this.ProductList.length).fill(false);
      },
      error: (err) => {
        // this.spinner.hide();
        console.error(err);
        if (err.status === 404) {
          this.displayNoProductsMessage = true;
        }
      }
    });
  }
  // getProducts() {
  //   this.loginService.getAllProducts().subscribe({
  //     next: (res) => {
  //       this.products = res;
  //       console.log(this.products)
  //       if (this.products.length > 0) {
  //         this.getPoductList(this.products[0])
  //       }
  //     },
  //     error: (err) => {
  //       console.error(err);
  //     }
  //   })
  // }

  async getProposalNum() {
    try {
      const res = await firstValueFrom(this.service.getProposalNumber());
      console.log(res);
      this.proposalNum = res.data.proposalNumber;
      console.log(this.proposalNum)
    } catch (error) {
      console.error(error);
    }
  }

  buyNow(item: any) {
    this.router.navigate(['portal/abhi/productDetails'], {
      state: { item: item }
    });
  }

  // async buyNow(item: any) {
  //   console.log(item)
  //   this.formData = { ...this.formData, productName: item.productName }
  //   try {
  //     await this.getFormSequence(item);
  //     const productData = {
  //       partnerId : item.partnerId,
  //       productId : item.productId

  //     }
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

  selectPlan(i: number, planNumber: number) {
    this.selectedPlans[i] = planNumber;
    console.log(planNumber, this.ProductList[i], i, this.ProductList);
    const premiumKey = `tenure${planNumber}Premium`;
    this.ProductList[i].selectedPremiumAmount = this.ProductList[i][premiumKey];
    console.log(this.selectedPlans, i, planNumber, this.ProductList, premiumKey);
  }

  async insurenow(item: any) {
    console.log(item);
    item.tenureAmounts = [];
    this.formData = {
      ...this.formData, productName: item.productName, totalPremium: item.selectedPremiumAmount,
      firstName: this.formData.proposerName, quoteId: item.quoteNumber, proposalNumber: item.proposalNum
    }
    console.log(this.formData);
    try {
      await this.getFormSequence(item);
      // this.removeFromCart(item);
      for (let i = 1; i <= 3; i++) {
        const premiumKey = `t${i}PremiumAmount`;
        console.log(item[premiumKey]);
        if (item.selectedPremiumAmount == item[premiumKey]) {
          item.tenure = i;
        }
        item.tenureAmounts[i - 1] = item[premiumKey]
      }
      this.formData = {
        ...this.formData, tenure: item.tenure + ' years'
      }
      console.log(item, this.formData)
      const productData = {
        partnerId: this.partnerId,
        productId: item.productId,
        tenureAmounts: item.tenureAmounts,
        selectedAddons: item.selectedAddons,
        proposalNum: item.proposalNum,
        tenure: item.tenure
      }
      sessionStorage.setItem("isQuote", true.toString());
      console.log(productData)
      if (this.formSequence != null && this.formSequence.length > 0) {
        this.router.navigate(['yatra'], {
          state: { productData: productData, formSequence: this.formSequence }
        });
      }
    } catch (error) {
      console.error(error);
    }
  }

  async addToCart(item: any) {
    item.tenureAmounts = [];
    console.log(item);
    this.selectedPlanIndex = this.selectedPlans[this.ProductList.indexOf(item)];
    console.log(this.selectedPlanIndex);

    const selectedPremiumKey = `tenure${this.selectedPlanIndex}Premium`;
    const QuoteNumber = `tenure${this.selectedPlanIndex}QuoteNumber`
    for (let i = 1; i <= 3; i++) {
      const premiumKey = `tenure${i}Premium`;
      console.log(item[premiumKey]);
      item.tenureAmounts[i - 1] = item[premiumKey]
    }
    item.selectedPremiumAmount = item[selectedPremiumKey];
    item.QuoteNumber = item[QuoteNumber];
    item.tenure = this.selectedPlanIndex;
    console.log(item);

    await this.getProposalNum();
    // setTimeout(() => {
    await this.insertorupdateagentcartdetails(item);
    // }, 2000);
    console.log(this.cartProductList);
  }

  removeFromCart(i: any) {
    this.cartProductList.splice(i, 1);
    sessionStorage.setItem("cardListProducts", this.encryptionService.encrypt(this.cartProductList));
  }

  async getFormSequence(item: any) {
    console.log(item);
    try {
      sessionStorage.clear();
      const reqData = {
        "partnerId": this.partnerId,
        "productId": item.productId

      }
      const res = await firstValueFrom(this.service.Getformsequence(reqData));
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
  async insertorupdateagentcartdetails(item: any) {
    console.log(item, this.formData);
    let reqdata = {
      "id": "",
      "proposalNum": this.proposalNum,
      "agentCode": this.agentCode,
      "productId": item.productId,
      "productName": item.productName,
      "productCode": item.productCode,
      "planCode": item.planCode,
      "subPlanCode": item.subPlanCode,
      "productFeatures": JSON.stringify(item.keyFeatures),
      "proposerName": this.formData.proposerName,
      "selectedPremiumAmount": item.selectedPremiumAmount,
      "t1PremiumAmount": item.tenure1Premium,
      "t2PremiumAmount": item.tenure2Premium,
      "t3PremiumAmount": item.tenure3Premium,
      "t2DiscountAmount": item.t2DiscountAmount,
      "t3DiscountAmount": item.t3DiscountAmount,
      "quoteData": JSON.stringify(this.formData),
      "selectedAddons": JSON.stringify(item.selectedAddon),
      "isFullQouteComplete": false,
      "createdBy": this.agentCode,
      "modifiedBy": this.agentCode,
      "quoteNumber": item.QuoteNumber,
      "mobileNumber": this.formData.mobileNumber
    }
    console.log(reqdata);
    await this.quoteService.Insertorupdateagentcartdetails(reqdata).subscribe({
      next: (res) => {
        this.Getagentcartdetails()
        console.log(res);
      },
      error: (err) => {
        console.error(err);

      }
    })

  }
  async Getagentcartdetails() {
    let reqdata = {
      "agentCode": this.agentCode
    }
    await this.quoteService.Getagentcartdetails(reqdata).subscribe({
      next: (res: any) => {
        console.log(res);
        this.cartProductList = res.data;
        this.cartProductList.forEach((item: any) => {
          item.productFeatures = JSON.parse(item.productFeatures);
          item.selectedAddons = JSON.parse(item.selectedAddons);
        })
        console.log(this.cartProductList);
      },
      error: (err) => {
        console.error(TypeError);

      }
    })
  }
  addToView(index: any) {
    if (this.addonView[index] == false) {
      this.addonView[index] = true;
    }
    else {
      this.addonView[index] = false
    }
  }
  closeOverlay() {
    this.isOverlayVisible = false;
  }
  showOverlay(i: any) {
    this.isOverlayVisible = true;
    this.popIndex = i

    const selectedAddons = this.ProductList[this.popIndex].selectedAddon || [];
    this.ProductList[this.popIndex].productFeatures.forEach((addon: any) => {
      addon.isSelected = selectedAddons.includes(addon.featureName);
    });

  }
  // onCheckboxChange(event: any, featureName: string) {
  //   if (event.target.checked) {
  //     this.selectedAddons.push(featureName);
  //   } else {
  //     const index = this.selectedAddons.indexOf(featureName);
  //     if (index > -1) {
  //       this.selectedAddons.splice(index, 1);
  //     }
  //   }
  // }

  isSelected(featureName: string): boolean {
    return this.selectedAddons.includes(featureName);
  }
  onCheckboxChange(event: any, addon: any, i: any) {
    addon.isSelected = event.target.checked;
    if (event.target.checked) {
      this.ProductList[this.popIndex].selectedAddon.push(addon.featureName)
    }
    else {
      this.ProductList[this.popIndex].selectedAddon = this.ProductList[this.popIndex].selectedAddon.filter(
        (name: string) => name !== addon.featureName
      );
    }
    console.log(addon, this.ProductList, i, this.popIndex);
  }
  deleteagentcartitems(cartId: any[]) {

    let reqdata = {
      "agentCode": this.agentCode,
      "id": cartId
    }
    console.log(reqdata);
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this/those item?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        console.log(reqdata);

        // Proceed with deletion if confirmed
        this.quoteService.deleteagentcartitems(reqdata).subscribe({
          next: (res) => {
            console.log('Deletion successful', res);
            this.Getagentcartdetails();
          },
          error: (err) => {
            console.error('Error while deleting:', err);
          }
        });
      },
      reject: () => {
        console.log('Deletion canceled');
      }
    });
  }
  async deleteallcartitems() {
    const list: any = [];
    await this.cartProductList.forEach((item: any) => {
      list.push(item.id)
    })
    this.deleteagentcartitems(list);
  }

  addToCompareProducts(item: any) {
    let productId = this.productService.addToCompare(item, this.compareItems);
    if(productId!=0){
      this.getProductInformation(productId);
    }
  }

  removeCompareItemProduct(item: any) {
    this.compareItems = this.productService.removeCompareItem(item, this.compareItems);

  }
  navigateToProductComparison() {
    this.productService.navigateToProductComparison(this.compareItems);
  }

  closeProductComparison() {
    this.productService.closeComparison(this.compareItems);
  }

  getProductInformation(productId: String) {
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

  backToProducts(){
    this.router.navigate(['/dashboard'], {
    });
  }
}
