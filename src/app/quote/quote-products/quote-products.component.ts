import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { NgToastService } from "ng-angular-popup";
import { NgxSpinnerService } from "ngx-spinner";
import { CommonService } from "src/app/services/common.service";
import { EncryptionService } from "src/app/services/encryption.service";
import { QuoteService } from "../quote.service";
import { firstValueFrom } from "rxjs";


@Component({
  selector: 'app-quote-products',
  templateUrl: './quote-products.component.html',
  styleUrls: ['./quote-products.component.scss']
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

  constructor(private quoteService: QuoteService, private router: Router, private toast: NgToastService,
    private service: CommonService, private encryptionService: EncryptionService, private spinner: NgxSpinnerService) { }
  ngOnInit(): void {
    // sessionStorage.clear()
    this.formData = history.state.formData;
    if (sessionStorage.getItem("cardListProducts")) {
      this.cartProductList = this.encryptionService.decrypt(sessionStorage.getItem("cardListProducts") as string);
    }
    else {
      this.cartProductList = [];
    }
    localStorage.setItem("formIndex", "0")
    console.log(this.formData, this.agentCode, this.cartProductList);
    this.getPoductList();
    this.Getagentcartdetails();
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
    this.spinner.show();
    // this.service.Getproductlist3({}).subscribe({
    this.quoteService.Getproductlist2(reqData).subscribe({
      next: (res:any) => {
        this.spinner.hide();
        console.log(res)
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

        this.selectedPlans = Array(this.ProductList.length).fill(null);
        this.addonView = Array(this.ProductList.length).fill(false);
      },
      error: (err) => {
        this.spinner.hide();
        console.error(err);
        if (err.status === 404) {
          this.displayNoProductsMessage = true;
        }
      }
    })
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
      await this.service.getProposalNumber().subscribe({
        next: (res) => {
          console.log(res);
          this.proposalNum = res.data;
        },
        error: (err) => {
          console.error(err);
        }
      })
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
    this.formData = {
      ...this.formData, productName: item.productName, totalPremium: item.selectedPremiumAmount,
      firstName: this.formData.proposerName
    }
    console.log(this.formData);
    try {
      await this.getFormSequence(item);
      this.removeFromCart(item);
      console.log(item)
      const productData = {
        partnerId: this.partnerId,
        productId: item.productId,
        tenureAmounts: item.tenureAmounts,
        selectedAddons: item.selectedAddon
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

  addToCart(item: any) {
    item.tenureAmounts = []
    for (let i = 1; i <= 3; i++) {
      const premiumKey = `tenure${i}Premium`;
      console.log(item[premiumKey]);
      item.tenureAmounts[i - 1] = item[premiumKey]
    }
    console.log(item);
    this.cartProductList.push(item);
    console.log(item);

    sessionStorage.setItem("cardListProducts", this.encryptionService.encrypt(this.cartProductList));
    this.getProposalNum();
    // setTimeout(() => {
    //   this.insertorupdateagentcartdetails(item);
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
  insertorupdateagentcartdetails(item: any) {
    console.log(item);
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
      "proposerName": "Manjunath Saukar",
      "selectedPremiumAmount": item.selectedPremiumAmount,
      "t1PremiumAmount": item.tenure1Premium,
      "t2PremiumAmount": item.tenure2Premium,
      "t3PremiumAmount": item.tenure3Premium,
      "t2DiscountAmount": item.t2DiscountAmount,
      "t3DiscountAmount": item.t3DiscountAmount,
      "quoteData": "{\n  \"proposerPincode\": \"500013\",\n  \"typeOfBusiness\": \"NB\",\n  \"isEmpoyee\": false,\n  \"sumInsured\": \"5000000\",\n  \"noOfMembers\": \"1\",\n  \"familySize\": \"1A\",\n  \"insuredMemeberDetails\": [\n    {\n      \"roomCategory\": \"\",\n      \"memberAge\": \"43\",\n      \"sumInsured\": \"5000000\",\n      \"isChronic\": \"No\",\n      \"zone\": \"Zone II\",\n      \"gender\": \"M\",\n      \"memberDob\": \"31-12-1980\",\n      \"memberRelation\": \"self\",\n      \"memberRelationCode\": \"24\"\n    }\n  ]\n}\n",
      "selectedAddons": "string",
      "isFullQouteComplete": false,
      "createdBy": this.agentCode,
      "modifiedBy": this.agentCode,
    }
    console.log(reqdata);
    this.quoteService.Insertorupdateagentcartdetails(reqdata).subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (err) => {
        console.error(err);

      }
    })
  }
  Getagentcartdetails() {
    let reqdata = {
      "agentCode": this.agentCode
    }
    this.quoteService.Getagentcartdetails(reqdata).subscribe({
      next: (res) => {
        console.log(res);
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

}
