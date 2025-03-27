import { Component, inject, OnInit } from "@angular/core";
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
import HeaderInformation from "src/app/layout/headerInfo";
import { IDynamicControl, IForm, IFormControl, IOptions, ISubControl, IValidator } from "src/app/interface/form.interface";
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: 'app-quote-products',
  templateUrl: './quote-products.component.html',
  styleUrls: ['./quote-products.component.scss'],
  providers: [ConfirmationService, MessageService, HeaderInformation]
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

  //dynamicAddOns
  isAddOnsVisible: boolean[] = [];
  form!: IForm;
  fb = inject(FormBuilder)
  // dynamicFormGroup: FormGroup = this.fb.group({});
  dynamicFormArray: FormArray = this.fb.array([]);
  // covers: any[][] = [];
  showRecalculateButton: boolean[] = [];
  disableBuyJourney: boolean | undefined;

  covers: any[][][] = [];

  //recalculate state management variables
  recalculatedAddOnList: any[][] = [];
  recalculatedAddOnRemoved: boolean[] = [];
  currentlyAddedAddOnsList: any[][] = [];

  constructor(private quoteService: QuoteService, private router: Router, private toast: NgToastService,
    private service: CommonService, private encryptionService: EncryptionService, private spinner: LoadingService,
    private confirmationService: ConfirmationService, private aesEncryptService: AesEncryptionService, private languageService: LanguageService,
    private translateService: TranslateService, public commonService: CommonService,
    private productService: ProductsService, private quoteservices: QuoteService, public headerInformation: HeaderInformation, private authService: AuthService
  ) { }
  ngOnInit(): void {
    this.disableBuyJourney = this.authService.getUserInfo().disableBuyJourney;
    window.scrollTo(0, 0); // Scroll to top when the component is initialized
    this.languageService.language$.subscribe(lang => {
      this.translateService.use(lang).subscribe({
        error: () => {
          this.translateService.use('en'); // Fallback to English if translation file is missing
        }
      });
    });
    // sessionStorage.clear()
    this.formData = this.encryptionService.decrypt(sessionStorage.getItem('formData') as string);
    sessionStorage.setItem("formIndex", "0")
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
    console.log(reqData);
    // this.spinner.show();
    // this.service.Getproductlist3({}).subscribe({
    this.quoteService.Getproductlist2(reqData).subscribe({
      next: (res: any) => {
        console.log(res)
        if (res.isSuccess) {
          // this.Getagentcartdetails();
          this.partnerId = res.data.partnerId
          this.ProductList = res.data.products

          // Reset dynamicFormArray before pushing new groups
          this.dynamicFormArray.clear();
          console.log(this.ProductList);
          this.ProductList.forEach((prod: any) => {
            // Parse keyFeatures and initialize selectedAddon
            prod.keyFeatures = JSON.parse(prod.keyFeatures);
            prod.selectedAddon = [];

            // Round tenure premiums
            prod.tenure1Premium = Math.round(prod.tenure1Premium);
            prod.tenure2Premium = Math.round(prod.tenure2Premium);
            prod.tenure3Premium = Math.round(prod.tenure3Premium);

            // Round tenure discount
            prod.t1DiscountAmount = Math.round(prod.t1DiscountAmount);
            prod.t2DiscountAmount = Math.round(prod.t2DiscountAmount);
            prod.t3DiscountAmount = Math.round(prod.t3DiscountAmount);

            // Create and push a new form group for each product
            this.dynamicFormArray.push(this.fb.group({}));

            // Optionally, log the updated product
            console.log(prod);
          });
          this.isAddOnsVisible = Array(this.ProductList.length).fill(false);
          this.selectedPlans = Array(this.ProductList.length).fill(3);
          this.addonView = Array(this.ProductList.length).fill(false);
          this.recalculatedAddOnRemoved = Array(this.ProductList.length).fill(false);
        }
        else {
          this.toast.error({ detail: "Error", summary: res.message, duration: 3000 });
        }
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
      firstName: this.formData.proposerName, quoteId: item.QuoteNumber, proposalNumber: this.proposalNum
    }
    console.log(this.formData);
    try {
      console.log("before form sequence",item);
      await this.getFormSequence(item);
      // this.removeFromCart(item);
      console.log("After get form sequence",item);
      
      for (let i = 1; i <= 3; i++) {
        const premiumKey = `tenure${i}Premium`;
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
        proposalNum: this.proposalNum,
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

  async addToCart(item: any, productIndex: any) {
    console.log(this.formData);

    if (this.showRecalculateButton[productIndex] == true) {
      this.toast.warning({ detail: "Warning", summary: "Please do a recalculate", duration: 3000 });
      return;
    }
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

    try {
      await this.getProposalNum();  // Ensure this completes before moving forward
      console.log("Proposal number fetched:", this.proposalNum);
    } catch (error) {
      console.error("Failed to fetch proposal number, stopping execution.");
      return; // Stop execution if proposal fetching fails
    }
    // setTimeout(() => {
    // await this.insertorupdateagentcartdetails(item);
    // }, 2000);
    console.log(this.cartProductList);
    this.insurenow(item);
  }

  removeFromCart(i: any) {
    this.cartProductList.splice(i, 1);
    sessionStorage.setItem("cardListProducts", this.encryptionService.encrypt(this.cartProductList));
  }

  async getFormSequence(item: any) {
    console.log(item,this.formData);
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
      const productIndex = this.ProductList.findIndex(p => p.productId === item.productId); // More reliable lookup

      if (productIndex !== -1) {
        const formGroupData = this.dynamicFormArray.at(productIndex)?.getRawValue();

        if (formGroupData) {
          this.formData = { ...this.formData, ...formGroupData }; // Correctly merges form data
        }
      }

      console.log(this.allJsonFormData,this.formData);
      sessionStorage.setItem("allFormData", this.encryptionService.encrypt(this.formData));
      sessionStorage.setItem("formIndex", "0");

      console.log(this.covers);

      const proposalRequiredDetails = {
        totalPremium: item.selectedPremiumAmount,
        proposalNumber: this.proposalNum,
        covers: this.covers[productIndex] ?? []
      };

      console.log(proposalRequiredDetails);


      sessionStorage.setItem("proposalRequiredDetails", this.encryptionService.encrypt(proposalRequiredDetails));
    } catch (err) {
      this.toast.warning({ detail: "Warning", summary: "Form Configuration not found!!", duration: 2000 });
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
      "mobileNumber": this.formData.mobileNumber.toString()
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
      "agentCode": this.agentCode,
      "customerMobileNumber": this.formData.mobileNumber.toString()
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
  closeOverlay(subControl: any, addOnControl: any) {
    this.isOverlayVisible = false;
    subControl.visible = false;
  }
  showOverlay(addOn: any, i: any) {
    this.isOverlayVisible = true;
    // this.popIndex = i

    // const selectedAddons = this.ProductList[this.popIndex].selectedAddon || [];
    // this.ProductList[this.popIndex].productFeatures.forEach((addon: any) => {
    //   addon.isSelected = selectedAddons.includes(addon.featureName);
    // });

    this.ProductList[i].productFeatures.forEach((feature: any) => {
      if (feature.name == addOn.name && feature.subControls) {
        feature.subControls.forEach((subControl: any) => {
          if (subControl.name == 'addOnDetails') {
            subControl.visible = true;
          }
        })
      }
    })
  }

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
    console.log(addon, this.ProductList, this.popIndex);
  }

  addOnSelected(event: any, subControl: any, addOnControl: any, productIndex: any) {
    console.log(event.target.checked, subControl, addOnControl, productIndex);
    const firstKey = Object.keys((this.dynamicFormArray.at(productIndex).get(addOnControl.name) as FormGroup)?.controls)[0];
    if (event.target.checked == true) {

      (this.dynamicFormArray.at(productIndex).get(addOnControl.name) as FormGroup)?.controls[firstKey].setValue(false);
      this.showOverlay(addOnControl, productIndex);
    }
    else {
      let addOnData = (this.dynamicFormArray.at(productIndex) as FormGroup).get(addOnControl.name)?.getRawValue();
      console.log(this.recalculatedAddOnRemoved[productIndex], this.currentlyAddedAddOnsList[productIndex], this.recalculatedAddOnList[productIndex]);

      if (this.recalculatedAddOnList[productIndex] &&
        this.recalculatedAddOnList[productIndex].some(addOn => addOn.coverId === addOnData.addOnId)) {
        this.recalculatedAddOnList[productIndex] = this.recalculatedAddOnList[productIndex]
          .filter(addOn => addOn.coverId !== addOnData.addOnId);
        this.recalculatedAddOnRemoved[productIndex] = true;
      }

      if (this.currentlyAddedAddOnsList[productIndex] && this.currentlyAddedAddOnsList[productIndex].some(addOn => addOn.coverId === addOnData.addOnId)) {
        this.currentlyAddedAddOnsList[productIndex] = this.currentlyAddedAddOnsList[productIndex]
          .filter(addOn => addOn.coverId !== addOnData.addOnId);
      }

      console.log(this.recalculatedAddOnList[productIndex]);


      if (this.recalculatedAddOnRemoved[productIndex] || this.currentlyAddedAddOnsList[productIndex].length > 0) {
        this.changeRecalculate(true, productIndex);
      }
      else {
        this.changeRecalculate(false, productIndex);
      }

      this.addOnRemoved(subControl, addOnControl, productIndex);
    }
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
    if (productId != 0) {
      // this.getProductInformation(productId);
      item.partnerId = this.partnerId;
      this.compareItems.push(item);
    }

  }

  removeCompareItemProduct(item: any) {
    this.compareItems = this.productService.removeCompareItem(item, this.compareItems);

  }
  navigateToProductComparison() {
    this.productService.navigateToProductComparison(this.compareItems, 'Quote');
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
        this.toast.error({
          detail: 'Error',
          summary: 'Failed to Add Product for Comparison'
        });
        console.error(err);
      }
    });
  }

  backToProducts() {
    this.router.navigate(['/dashboard'], {
    });
  }

  donwloadBrowcher(productName: any) {
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

  donwloadQuote(quoteInfo: any) {
    let requestBody: any = {};
    requestBody.quoteInformation = JSON.stringify(quoteInfo);
    requestBody.agentCode = this.agentCode;
    requestBody.formData = JSON.stringify(this.formData);
    requestBody.tenure = this.selectedPlans[this.ProductList.indexOf(quoteInfo)];

    this.quoteService.downloadQuote(requestBody).subscribe(
      (response: any) => {
        if (response.isSuccess) {
          let blob: any = '';
          try {
            blob = this.base64ToBlob(JSON.parse(JSON.parse(response.data)).byteArray, 'application/pdf');
          } catch (exception) {
            this.toast.error({ detail: "Error", summary: 'Failed to Generate Quote PDF.', duration: 2000 });
          }
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = quoteInfo.tenure1QuoteNumber + ".pdf";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
          this.toast.success({ detail: "Success", summary: 'Quote Information has Successfully Downloaded.', duration: 2000 });
        } else {
          this.toast.error({ detail: "Error", summary: response.message, duration: 2000 });
        }
      }, (error) => {
        console.error('Failed to download Quote', error);
        this.toast.error({ detail: "Error", summary: "Failed to download quoteInformation.", duration: 2000 });
      }
    )
  };

  base64ToBlob(base64: string, type: string): Blob {
    const binary = atob(base64);
    const length = binary.length;
    const arrayBuffer = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
      arrayBuffer[i] = binary.charCodeAt(i);
    }
    return new Blob([arrayBuffer], { type });
  }

  // getProductAddOnList(index: number): void {

  //   console.log(this.ProductList[index], this.formData,this.dynamicFormArray);

  //   const reqData = {
  //     "productId": this.ProductList[index].productId
  //   }

  //   this.quoteService.getProductAddOnList(reqData).subscribe({
  //     next: (res: any) => {
  //       console.log(res)
  //       if (res.isSuccess) {

  //         if (res.data && res.data != '') {

  //           this.ProductList[index].productFeatures = JSON.parse(res.data);

  //           console.log(this.ProductList[index].productFeatures);

  //           this.ProductList[index].productFeatures.forEach((addOn: any) => {
  //             console.log(addOn);

  //             addOn.subControls.forEach((subControl: ISubControl) => {

  //               if (subControl.name == 'addOnDetails') {
  //                 let demoTypeIndex: any;
  //                 let doneButton: any;
  //                 if (subControl.innerSubControls) {
  //                   demoTypeIndex = subControl.innerSubControls.findIndex(control => control.name === 'demoType');
  //                   doneButton = subControl.innerSubControls.find(control => control.name === 'doneButton');
  //                   // Slice the array to retain demoType and doneButton only
  //                   subControl.innerSubControls = [
  //                     ...subControl.innerSubControls.slice(demoTypeIndex, demoTypeIndex + 1), // Retain demoType
  //                     // ...subControl.innerSubControls.slice(doneButtonIndex, doneButtonIndex + 1) // Retain doneButton
  //                   ]; // Keep the first control (or reset)
  //                 }
  //                 this.formData['insuredMemberDetails'].forEach((member: any, index: any) => {
  //                   if (subControl.innerSubControls) {
  //                     let tempInnerControl = JSON.parse(JSON.stringify(subControl.innerSubControls[0]));
  //                     // const tempRelationshipType = member
  //                     tempInnerControl.label = member.relation;
  //                     tempInnerControl.name = member.relation;
  //                     // if (control.name == 'deductible') {
  //                     //   tempInnerControl.coreControls.forEach((coreControl: any) => {
  //                     //     if (coreControl.type == 'checkbox') {
  //                     //       coreControl.value = true;
  //                     //     }
  //                     //     else if (coreControl.type == 'select') {
  //                     //       coreControl.value = member.deductibleAmount;
  //                     //     }
  //                     //   })
  //                     // }

  //                     // if (control.isDefault) {
  //                     //   let addOnSumInsured = 0;
  //                     //   tempInnerControl.coreControls.forEach((coreControl: any) => {
  //                     //     if (coreControl.name == 'memberCheckbox') {
  //                     //       coreControl.value = true;
  //                     //     }
  //                     //     if (coreControl.name == 'addOnSumInsured') {
  //                     //       addOnSumInsured = coreControl.value;
  //                     //     }
  //                     //   })

  //                     //   const coverId = control.subControls?.find((subControl: any) => subControl.name === 'addOnId')?.value;
  //                     //   const coverName = control.subControls?.find((subControl: any) => subControl.name === 'optionalCoverName')?.value;

  //                     //   if (coverId && coverName) {
  //                     //     // Initialize member.covers if not present
  //                     //     if (!member.covers) {
  //                     //       member.covers = [];
  //                     //     }

  //                     //     // Check and push into member.covers if not already present
  //                     //     let memberCoverExists = member.covers.some((cover: any) => cover.coverId === coverId);
  //                     //     if (!memberCoverExists) {
  //                     //       member.covers.push({
  //                     //         coverId: coverId,
  //                     //         value: addOnSumInsured, // Add appropriate value if needed
  //                     //         coverName: coverName
  //                     //       });
  //                     //     }

  //                     //     // Initialize this.covers[index] if not present
  //                     //     if (!this.covers[index]) {
  //                     //       this.covers[index] = [];
  //                     //     }

  //                     //     // Check and push into this.covers[index] if not already present
  //                     //     let coverExistsInCovers = this.covers[index].some((cover: any) => cover.coverId === coverId);
  //                     //     if (!coverExistsInCovers) {
  //                     //       this.covers[index].push({
  //                     //         coverId: coverId,
  //                     //         value: addOnSumInsured, // Add appropriate value if needed
  //                     //         coverName: coverName
  //                     //       });
  //                     //     }

  //                     //   }

  //                     // }

  //                     // if (subControl.conditionCheck) {
  //                     //   console.log(subControl, this.formData, tempInnerControl);

  //                     //   if (member.chronicDiseases != "") {
  //                     //     tempInnerControl.coreControls.forEach((coreControl: any) => {
  //                     //       if (coreControl.name == 'memberCheckbox' || member.chronicDiseases.includes(coreControl.name)) {
  //                     //         coreControl.value = true;
  //                     //       }
  //                     //     });

  //                     //     const addOnCoverControl = control.subControls?.find((subControl: any) => subControl.name === 'addOnCover');
  //                     //     if (addOnCoverControl) {
  //                     //       addOnCoverControl.value = true;
  //                     //     }

  //                     //     const coverId = control.subControls?.find((subControl: any) => subControl.name === 'addOnId')?.value;
  //                     //     const coverName = control.subControls?.find((subControl: any) => subControl.name === 'optionalCoverName')?.value;

  //                     //     if (coverId && coverName) {
  //                     //       // Initialize member.covers if not present
  //                     //       if (!member.covers) {
  //                     //         member.covers = [];
  //                     //       }

  //                     //       // Check and push into member.covers if not already present
  //                     //       let memberCoverExists = member.covers.some((cover: any) => cover.coverId === coverId);
  //                     //       if (!memberCoverExists) {
  //                     //         member.covers.push({
  //                     //           coverId: coverId,
  //                     //           value: 0, // Add appropriate value if needed
  //                     //           coverName: coverName
  //                     //         });
  //                     //       }

  //                     //       // Initialize this.covers[index] if not present
  //                     //       if (!this.covers[index]) {
  //                     //         this.covers[index] = [];
  //                     //       }

  //                     //       // Check and push into this.covers[index] if not already present
  //                     //       let coverExistsInCovers = this.covers[index].some((cover: any) => cover.coverId === coverId);
  //                     //       if (!coverExistsInCovers) {
  //                     //         this.covers[index].push({
  //                     //           coverId: coverId,
  //                     //           value: 0, // Add appropriate value if needed
  //                     //           coverName: coverName
  //                     //         });
  //                     //       }
  //                     //     }
  //                     //   }


  //                     //   tempInnerControl.coreControls.forEach((corecontrol: any, index: any) => {
  //                     //     if (corecontrol.dependentControls && this.formData[control.name]) {
  //                     //       const newvalue = this.formData[control.name][subControl.name][tempRelationshipType.value][index][corecontrol.name];
  //                     //       console.log(newvalue);

  //                     //       corecontrol.dependentControls.forEach((question: any) => {
  //                     //         let newcontrol = tempInnerControl.coreControls.find((item: any) => item.name == question)
  //                     //         newcontrol.visible = newvalue;
  //                     //       })
  //                     //     }
  //                     //   })
  //                     // }
  //                     subControl.innerSubControls?.push(tempInnerControl);
  //                   }
  //                 });
  //                 subControl.innerSubControls?.push(doneButton);
  //               }

  //             })
  //             // (this.dynamicFormArray.at(index)as FormGroup).addControl(addOn.name, this.initializeSubControls(addOn.subControls));
  //             const productFormGroup = this.dynamicFormArray.at(index) as FormGroup;

  //             console.log(productFormGroup);

  //             productFormGroup.addControl(addOn.name, this.initializeSubControls(addOn.subControls));
  //           })
  //           console.log(this.dynamicFormArray);

  //           this.isAddOnsVisible[index] = !this.isAddOnsVisible[index];
  //         }


  //       }
  //       else {
  //         this.toast.error({ detail: "Error", summary: res.message, duration: 3000 });
  //       }
  //     },
  //     error: (err) => {
  //       // this.spinner.hide();
  //       console.error(err);
  //       if (err.status === 404) {
  //         this.displayNoProductsMessage = true;
  //       }
  //     }
  //   });



  //   console.log(this.ProductList[index].productFeatures, this.dynamicFormGroup);

  // }

  getProductAddOnList(index: number): void {
    console.log(this.ProductList[index], this.formData, this.dynamicFormArray);

    // If add-ons are already created, just toggle visibility
    const productFormGroup = this.dynamicFormArray.at(index) as FormGroup;
    if (this.isAddOnsVisible[index] !== undefined && productFormGroup && productFormGroup.controls && Object.keys(productFormGroup.controls).length > 0) {
      this.isAddOnsVisible[index] = !this.isAddOnsVisible[index];
      console.log(`Toggled visibility for product ${index}: ${this.isAddOnsVisible[index]}`);
      return;
    }

    const reqData = { "productId": this.ProductList[index].productId };

    this.quoteService.getProductAddOnList(reqData).subscribe({
      next: (res: any) => {
        console.log(res);
        if (res.isSuccess) {
          if (res.data && res.data !== '') {
            this.ProductList[index].productFeatures = JSON.parse(res.data);
            console.log(this.ProductList[index].productFeatures);

            this.ProductList[index].productFeatures.forEach((addOn: any) => {
              console.log(addOn);

              if ((addOn.name == 'chronicCare' || addOn.name == 'chronicManagement') && this.formData['isChronicCare'] != 'Y') {
                addOn.visible = false;
              }

              addOn.subControls.forEach((subControl: ISubControl) => {
                if (subControl.name === 'addOnDetails') {
                  let demoTypeIndex: any;
                  let doneButton: any;
                  if (subControl.innerSubControls) {
                    demoTypeIndex = subControl.innerSubControls.findIndex(control => control.name === 'demoType');
                    doneButton = subControl.innerSubControls.find(control => control.name === 'doneButton');

                    subControl.innerSubControls = [
                      ...subControl.innerSubControls.slice(demoTypeIndex, demoTypeIndex + 1),
                    ];
                  }
                  this.formData['insuredMemberDetails'].forEach((member: any, memberIndex: any) => {
                    if (subControl.innerSubControls) {
                      let tempInnerControl = JSON.parse(JSON.stringify(subControl.innerSubControls[0]));
                      tempInnerControl.label = member.relation;
                      tempInnerControl.name = member.relation;
                      if (subControl.conditionCheck) {
                        console.log(subControl, this.formData, tempInnerControl);

                        if (member.chronicDiseases != "" && member.chronicDiseases != null) {
                          this.ProductList[index].hasDefaultAddOn = true;
                          tempInnerControl.coreControls.forEach((coreControl: any) => {
                            if (coreControl.name == 'memberCheckbox' || member.chronicDiseases.includes(coreControl.name)) {
                              coreControl.value = true;
                            }
                          });

                          const addOnCoverControl = addOn.subControls?.find((subControl: any) => subControl.name === 'addOnCover');
                          if (addOnCoverControl && !addOnCoverControl.value) {
                            addOnCoverControl.value = true;
                            this.ProductList[index].selectedAddon.push(addOnCoverControl.label);
                          }

                          const coverId = addOn.subControls?.find((subControl: any) => subControl.name === 'addOnId')?.value;
                          const coverName = addOn.subControls?.find((subControl: any) => subControl.name === 'optionalCoverName')?.value;

                          if (coverId && coverName) {
                            // Initialize member.covers if not present
                            if (!member.covers) {
                              member.covers = [];
                            }

                            if (!this.covers[index]) {
                              this.covers[index] = []; // Initialize array for productIndex
                            }
                            if (!this.covers[index][memberIndex]) {
                              this.covers[index][memberIndex] = []; // Initialize array for insured member
                            }

                            let coverInCovers = this.covers[index][memberIndex].find((c: any) => c.coverId === coverId);
                            if (!coverInCovers) {
                              this.covers[index][memberIndex].push({
                                coverId: coverId,
                                value: 0,
                                coverName: coverName
                              });
                            }
                          }
                        }


                        // tempInnerControl.coreControls.forEach((corecontrol: any, index: any) => {
                        //   if (corecontrol.dependentControls && this.formData[control.name]) {
                        //     const newvalue = this.formData[control.name][subControl.name][tempRelationshipType.value][index][corecontrol.name];
                        //     console.log(newvalue);

                        //     corecontrol.dependentControls.forEach((question: any) => {
                        //       let newcontrol = tempInnerControl.coreControls.find((item: any) => item.name == question)
                        //       newcontrol.visible = newvalue;
                        //     })
                        //   }
                        // })
                      }
                      subControl.innerSubControls?.push(tempInnerControl);
                    }
                  });
                  subControl.innerSubControls?.push(doneButton);
                }
              });

              // Ensure add-on controls are only created once per product index
              if (!productFormGroup.contains(addOn.name)) {
                productFormGroup.addControl(addOn.name, this.initializeSubControls(addOn.subControls));
              }

              if (addOn.postControlCreationMethod) {
                this.resolveMethod(addOn.postControlCreationMethod, addOn, index);
              }
            });

            console.log(this.ProductList[index]);

            if (this.ProductList[index].hasDefaultAddOn) {
              this.recalculatePremiumAmount(index);
            }

            console.log(this.dynamicFormArray);
            this.isAddOnsVisible[index] = true;
          }
        } else {
          this.toast.error({ detail: "Error", summary: res.message, duration: 3000 });
        }
      },
      error: (err) => {
        console.error(err);
        if (err.status === 404) {
          this.displayNoProductsMessage = true;
        }
      }
    });

    // console.log(this.ProductList[index].productFeatures, this.dynamicFormGroup);
  }


  initializeSubControls(subControls: any, controlGroup: any = null, parentControl: any = null) {
    let formGroup: any
    if (controlGroup) {
      formGroup = controlGroup;
    }
    else {
      formGroup = this.fb.group({});
    }
    if (Array.isArray(subControls)) {
      subControls.forEach((control: any) => {
        let controlValidators: any = [];
        if (control.validators && control.visible) {
          control.validators.forEach((val: IValidator) => {
            if (val.validatorName === 'required') controlValidators.push(Validators.required);
            if (val.validatorName === 'email') controlValidators.push(Validators.email);
            if (val.validatorName === 'minlength') controlValidators.push(Validators.minLength(val.minLength as number));
            if (val.validatorName === 'maxlength') controlValidators.push(Validators.maxLength(val.maxLength as number));
            if (val.validatorName === 'pattern') controlValidators.push(Validators.pattern(val.pattern as string));
          });
        }

        if (control.type == 'select' && control.getAllOption) {
          if (control.options?.length == 0) {
            this.callMethod(control.getAllOption, control);
          }
        }
        if (control.innerArrayControl) {
          if (control.visible) {
            let tempFormArray = this.fb.array([]);
            for (let i = 1; i < control.innerArrayControl.length; i++) {
              tempFormArray.push(this.initializeDynamicFormControls(control.innerArrayControl[i], i, control));
            }
            formGroup.addControl(control.name, tempFormArray);
          }
          else {
            formGroup.addControl(control.name, new FormArray([]));
          }
        }
        if (control.extraBenefitsControls) {
          let tempFormArray = this.fb.array([]);
          for (let i = 0; i < control.extraBenefitsControls.length; i++) {
            tempFormArray.push(this.initializeDynamicFormControls(control.extraBenefitsControls[i], i, control));
          }
          formGroup.addControl(control.name, tempFormArray);
        }

        if (control.innerSubControls) {
          formGroup.addControl(control.name, this.initializeSubControls(control.innerSubControls.slice(1)));
        }
        if (control.innerControls) {
          formGroup.addControl(control.name, this.initializeSubControls(control.innerControls));
        }
        else if (control.coreControls) {
          let tempFormArray = this.fb.array([]);
          for (let i = 0; i < control.coreControls.length; i++) {
            tempFormArray.push(this.initializeSubControls(control.coreControls[i], null, control))
          }
          formGroup.addControl(control.name, tempFormArray);
        }
        else if (!control.displayOnly || control.displayOnly === false)
          if (this.selectedAddons.length > 0 && this.selectedAddons.find((addon: any) => addon === control.label) && control.type === 'checkbox') {
            formGroup.addControl(control.name, new FormControl(true, controlValidators));
          } else {
            formGroup.addControl(control.name, new FormControl(control.value, controlValidators));
          }
      });
    }
    else {
      let controlValidators: any = [];
      if (subControls.validators) {
        subControls.validators.forEach((val: IValidator) => {
          if (val.validatorName === 'required') controlValidators.push(Validators.required);
          if (val.validatorName === 'email') controlValidators.push(Validators.email);
          if (val.validatorName === 'minlength') controlValidators.push(Validators.minLength(val.minLength as number));
          if (val.validatorName === 'maxlength') controlValidators.push(Validators.maxLength(val.maxLength as number));
          if (val.validatorName === 'pattern') controlValidators.push(Validators.pattern(val.pattern as string));
        });
      }
      if (subControls.type == 'select' && subControls.getAllOption) {
        if (subControls.options?.length == 0) {
          this.resolveMethod(subControls.getAllOption, subControls, parentControl);
        }
      }
      if (subControls.type == 'select' && subControls.value === "") {
        if (subControls.options && subControls.options.length > 0) {
          subControls.options.forEach((option: IOptions) => {
            if (option.selected) {
              subControls.value = option.id ? this.stringifyObject(option) : option.value;
            }
          });
        }
        else {
          this.resolveMethod(subControls.methodName, subControls, parentControl)
        }
      }
      if (subControls.type == 'questionnaire' && subControls.innerControls) {
        if (subControls.visible == true) {
          formGroup.addControl(subControls.name, this.initializeSubControls(subControls.innerControls))
        }
        else {
          formGroup.addControl(subControls.name, new FormGroup({}));
        }
      }
      if (subControls.innerArrayControl) {
        if (subControls.visible) {
          let tempFormArray = this.fb.array([]);
          for (let i = 1; i < subControls.innerArrayControl.length; i++) {
            tempFormArray.push(this.initializeDynamicFormControls(subControls.innerArrayControl[i], i, subControls));
          }
          formGroup.setValue(subControls.name, tempFormArray);
        }
        else {
          formGroup.addControl(subControls.name, new FormArray([]));
        }
      }
      if (subControls.extraBenefitsControls) {
        const tempFormArray = this.fb.array<FormGroup>([]);
        for (let i = 0; i < subControls.extraBenefitsControls.length; i++) {
          // const currentControl = subControls.extraBenefitsControls[i];      
          // const formGroup = this.fb.group({
          //   [currentControl.name]: [currentControl.value || null],
          // });      
          // tempFormArray.push(formGroup);
          tempFormArray.push(this.initializeSubControls(subControls.extraBenefitsControls[i], null, subControls))

        }
        formGroup.addControl(subControls.name, tempFormArray);
      }
      else
        formGroup.addControl(subControls.name, new FormControl(subControls.value, controlValidators));
      // if (subControls.postControlCreationMethod) {
      //   this.resolveMethod(subControls.postControlCreationMethod, subControls);
      // }
      // return new FormControl(subControls.value,controlValidators);

    }

    return formGroup;
  }

  initializeDynamicFormControls(dynamicFormControls: any, index: any = null, parentControl: any = null, policyLength: any = 0) {
    console.log(parentControl);

    let formGroup: any = this.fb.group({})
    dynamicFormControls.forEach((control: IDynamicControl) => {
      if (control.subControls) {
        let tempFormArray = this.fb.array([]);
        if (control.type == 'hospiCashInfo') {
          console.log(Array.isArray(control.subControls));

          if (Array.isArray(control.subControls)) {
            (control.subControls as ISubControl[][]).forEach((hospiMemberControl: any) => {
              let tempFormGroup: any = this.fb.group({});
              hospiMemberControl.forEach((memberControl: any) => {
                if (memberControl.type == 'radio') {
                  memberControl.value = memberControl.radioOptions.find(
                    (option: any) => option.selected === true
                  )?.value;
                }
                tempFormGroup.addControl(memberControl.name, new FormControl(memberControl.value));
              })
              tempFormArray.push(tempFormGroup);
            });
          }
        }
        formGroup.addControl(control.name, tempFormArray);
      }
      else if (control.innerControls && control.visible == true) {
        let innerGroup = this.initializeDynamicFormControls(control.innerControls);
        formGroup.addControl(control.name, innerGroup);
      }
      else if (control.innerArrayControl && control.visible == true) {
        let tempFormArray = this.fb.array([]);
        for (let z = 1; z < control.innerArrayControl.length; z++) {
          tempFormArray.push(this.initializeDynamicFormControls(control.innerArrayControl[z], z, control));
        }
        formGroup.addControl(control.name, tempFormArray);
        console.log(formGroup, tempFormArray, control)
        // formGroup.setValue(control.name, tempFormArray);
      }
      else if (!control.innerArrayControl) {
        let controlValidators: any = [];
        if (control.validators && control.visible == true) {
          control.validators.forEach((val: IValidator) => {
            if (val.validatorName === 'required') controlValidators.push(Validators.required);
            if (val.validatorName === 'email') controlValidators.push(Validators.email);
            if (val.validatorName === 'minlength') controlValidators.push(Validators.minLength(val.minLength as number));
            if (val.validatorName === 'maxlength') controlValidators.push(Validators.maxLength(val.maxLength as number));
            if (val.validatorName === 'pattern') controlValidators.push(Validators.pattern(val.pattern as string));
          })
        }

        if (control.type === 'multiSelectCheckbox' && control.selectCheckboxOptions) {

          this.resolveMethod(control.methodName, control);
          const controlGroup = this.fb.group({});
          control.selectCheckboxOptions.forEach(option => {
            controlGroup.addControl(option.value, new FormControl(false));
          });
          formGroup.addControl(control.name, controlGroup);

        }
        if (control.type === 'multipleselect' && control.options) {
          const controlGroup = this.fb.group({});
          control.options.forEach(option => {
            controlGroup.addControl(option.value, new FormControl(false));
          });
          formGroup.addControl(control.name, controlGroup);
        }
        if (control.type === 'subtabview') {
          control.tabs?.forEach(element => {
            // this.callMethod(control.methodName, control);
            const controlGroup = this.fb.group({});
            element.selectCheckboxOptions?.forEach(option => {
              controlGroup.addControl(option.value, new FormControl(false));
            });
            formGroup.addControl(element.name, controlGroup);
          });

        }
        if (control.type == 'select' && control.getAllOption) {
          if (control.options?.length == 0) {
            this.callMethod(control.getAllOption, control);
          }
        }
        else if (control.type == 'select' && control.methodName == 'updateDesignationBasedOnAnnualincome') {
          this.resolveMethod(control.methodName, control, index, parentControl)
        }
        else if (control.type == 'select' && control.methodName) {
          this.resolveMethod(control.methodName, control, index, policyLength);
        }
        if (control.type == 'select' && control.value === "") {
          // Set control value if any option is selected
          if (control.options && control.options.length > 0) {
            control.options.forEach((option: IOptions) => {
              if (option.selected) {
                control.value = option.id ? this.stringifyObject(option) : option.value;
              }
            });
          }
        }


        if (control.name == 'memberIndex' && index != null) {
          control.value = index - 1;
        }

        if (control.type == 'text' && control.methodName) {
          this.resolveMethod(control.methodName, control, index);
        }
        if (control.type == 'radio' && control.radioOptions) {
          let initialValue = control.radioOptions.find((option) => option.selected === true)?.value;
          formGroup.addControl(control.name, new FormControl(initialValue, controlValidators));
        }
        else {
          formGroup.addControl(control.name, new FormControl(control.value, controlValidators));
        }
      }
      if (control.disabled) {
        formGroup.get(control.name)?.disable();
      }

    })
    return formGroup;
  }

  async resolveMethod(methodName: string, ...args: any[]): Promise<void> {

    // Filter out undefined and null arguments
    let filteredArgs = args.filter(arg => arg !== undefined && arg !== null);

    console.log(methodName);


    // Specific logic for handling certain method names
    if (methodName === 'addOrRemoveAdditionalInsuredMember') {
      filteredArgs = filteredArgs.slice(-1);
    } else if (filteredArgs[filteredArgs.length - 1] === 'add' || filteredArgs[filteredArgs.length - 1] === 'remove') {
      filteredArgs.pop();
    }

    // Resolve the method dynamically
    const method = (this as any)[methodName] as Function;
    if (method && typeof method === 'function') {
      try {
        // Call the method with filtered arguments
        const result = method.bind(this)(...filteredArgs);
        // if (methodName == 'uploadSelectedDocument')


        // If the result is a Promise, await it; otherwise, wrap it in Promise.resolve()
        if (result && typeof result.then === 'function') {
          await result; // It's already a Promise, so await it
        } else if (result != undefined) {
          await Promise.resolve(result); // Wrap non-Promise results into a Promise
        }

        // Example logic specific to 'getProposerRelationship'
        // if (methodName === 'getProposerRelationship') {
        //   console.log("Proposer Relationship");
        // }
      } catch (error) {
        console.error(`Error in method ${methodName}:`, error);
        await Promise.reject(error);
      }
    } else {
      console.error(`Method ${methodName} not found`);
    }
  }

  async callMethod(methodName: string, control: any, section?: any) {

    console.log(methodName);

    if (control.otherControlName && section != undefined) {
      let otherControl = section.formControls.filter((formControl: IFormControl) => formControl.name == control.otherControlName)[0];
      const method = (this as any)[methodName];
      if (method && typeof method === 'function') {
        await (this as any)[methodName](otherControl)
      } else {
        console.error(`Method ${methodName} not found`);
      }
    }
    else if (control && methodName) {
      await (this as any)[methodName](control)
    }
  }

  stringifyObject(obj: any): string {
    return JSON.stringify(obj);
  }

  changeOverLayDone(control: any = null, addOnControl: any = null, changeValue: boolean = false) {

    console.log(addOnControl);

    if (addOnControl != null) {
      if (addOnControl.subControls) {
        addOnControl.subControls.forEach((subControl: any) => {
          if (subControl.innerSubControls) {
            subControl.innerSubControls.forEach((innerSubControl: any) => {
              if (innerSubControl.name == 'doneButton') {
                if (subControl.conditionCheck) {
                  innerSubControl.disabled = false;
                }
                else {
                  innerSubControl.disabled = changeValue;
                }
              }
            })
          }
        })
      }
    }
  }

  addOnMemberAdded(subControl: any, parentControl: any = null, productIndex: any = null) {
    console.log(subControl, parentControl);

    if (parentControl != null) {
      let count = 0;
      let memberDetails = this.dynamicFormArray.at(productIndex).get(parentControl.name)?.get(subControl.name)?.value;
      console.log(memberDetails);
      Object.keys(memberDetails).forEach(key => {
        let memberArray = memberDetails[key];
        // Check if memberCheckbox is false for any member and set other fields to empty
        let memberCheckbox = memberArray.find((member: any) => member.memberCheckbox === false);

        if (memberCheckbox) {
          memberArray.forEach((member: any) => {
            if (!member.memberCheckbox) {
              // Set other fields to empty if memberCheckbox is false
              Object.keys(member).forEach(memberKey => {
                if (memberKey !== 'memberCheckbox') {
                  member[memberKey] = '';
                  let memberArrayControl = (this.dynamicFormArray.at(productIndex).get(parentControl.name)?.get(subControl.name)?.get(key)) as FormArray;
                  let memberFormGroup = memberArrayControl.controls.find((group: AbstractControl) => {
                    return (group as FormGroup).get(memberKey)
                  }) as FormGroup;
                  let memberFormGroupControl = memberFormGroup.get(memberKey);
                  if (memberFormGroupControl) {
                    memberFormGroupControl.setValue('');
                  }

                }
              });
            }
          });
        } else {
          count++;
          let dependentControls: string[] = [];
          let tempControlArray = (((this.dynamicFormArray.at(productIndex).get(parentControl.name) as FormGroup)?.get(subControl.name) as FormGroup)?.get(key) as FormArray);
          let breakFlag = false;
          parentControl.subControls.forEach((subControl: ISubControl) => {
            if (breakFlag) return;
            if (subControl.innerSubControls) {
              subControl.innerSubControls.forEach((innerSubControl: ISubControl) => {
                if (breakFlag) return;
                if (innerSubControl.name == key) {
                  innerSubControl.coreControls?.forEach((coreControl: ISubControl, aindex: any) => {
                    if (breakFlag) return;
                    if (coreControl.innerControls) {
                      coreControl.innerControls?.forEach((innerControl: any) => {
                        // this.validationErrorNotification(tempControlArray, aindex, coreControl, innerControl, innerSubControl);
                        breakFlag = true;
                      })
                    }
                    else if (coreControl.name == 'memberCheckbox' && coreControl.dependentControls) {
                      dependentControls = coreControl.dependentControls;
                    }
                    if (!subControl.conditionCheck) {
                      let memberFormGroup = tempControlArray.controls.find((group: AbstractControl) => {
                        return (group as FormGroup).get(coreControl.name)
                      }) as FormGroup;

                      let memberFormGroupControl = memberFormGroup.get(coreControl.name);
                      if (memberFormGroupControl?.value == '' && coreControl.type == 'text' && coreControl.name == 'addOnSumInsured') {
                        console.log(innerSubControl, coreControl, this.formData);
                        if (this.formData.memberPolicyType == 'Multi Individual') {
                          // Find the insured member who matches the relation in innerSubControl.name
                          const insuredMember = this.formData.insuredMemberDetails.find(
                            (member: any) => member.relation === innerSubControl.name
                          );

                          // If a matching insured member is found, set the sumInsured to memberFormGroupControl
                          if (insuredMember) {
                            memberFormGroupControl.setValue(insuredMember.sumInsured);
                          }
                        } else {
                          // If not Multi Individual, set the sumInsured from formData directly
                          memberFormGroupControl.setValue(this.formData.sumInsured);
                        }


                      }
                      else if (memberFormGroupControl?.value == '') {

                        tempControlArray.controls.forEach((coreControlGroup: any) => {
                          Object.keys(coreControlGroup.controls).forEach((controlName: string) => {
                            const control = coreControlGroup.get(controlName);

                            if (control) {
                              if (control.value === true) {
                                // If the control's value is true, set it to false
                                control.setValue(false);
                              } else {
                                // Set all other values to an empty string
                                control.setValue('');
                              }
                            }
                          });

                        })
                        breakFlag = true;
                        count--;
                      }
                    }
                  })
                }
              })
            }
          })
        }
      });

      // ?.controls[0].setValue(false);
      let control = this.dynamicFormArray.at(productIndex).get(parentControl.name) as FormGroup;
      if (control) {
        const firstKey = Object.keys((this.dynamicFormArray.at(productIndex).get(parentControl.name) as FormGroup)?.controls)[0];
        // Get the first key
        if (count == 0) {
          control.controls[firstKey].setValue(false);
          const addOnCover = parentControl.subControls.find((subControl: any) => subControl.name === 'addOnCover');

          if (addOnCover && addOnCover.label) {
            this.ProductList[productIndex].selectedAddon = this.ProductList[productIndex].selectedAddon.filter(
              (label: string) => label !== addOnCover.label
            );
          }
          this.changeRecalculate(true, productIndex);
          this.addOnRemoved(subControl, parentControl, productIndex);
        }
        else {
          control.controls[firstKey].setValue(true);
          const addOnCover = parentControl.subControls.find((subControl: any) => subControl.name === 'addOnCover');

          if (addOnCover && addOnCover.label) {
            this.ProductList[productIndex].selectedAddon.push(addOnCover.label);
          }
          this.changeOverLayDone(subControl, parentControl, true);
          this.changeRecalculate(true, productIndex);
          this.addOnAdded(subControl, parentControl, productIndex);
        }
      }

    }
    this.closeOverlay(subControl, parentControl);
  }

  // addOnAdded(control: any, parentControl: any = null,productIndex:any) {
  //     let addOnData = this.dynamicFormGroup.get(parentControl.name)?.getRawValue();
  //     console.log(addOnData);

  //     let modifiedInsuredMemberDetails = this.formData.insuredMemberDetails;
  //     Object.keys(addOnData.addOnDetails).forEach((key) => {
  //       if (addOnData.addOnDetails[key][0].memberCheckbox === true) {
  //         modifiedInsuredMemberDetails.forEach((member: any, index: number) => {
  //           if (member.relation === key) {
  //             let addOnSumInsured: any = 0;
  //             let weeklyCashLimit: any;
  //             let noOfDays: any;
  //             if (parentControl.name == 'deductible') {
  //               addOnData.addOnDetails[key].forEach((addOnDetail: any) => {
  //                 if (addOnDetail.addOnSumInsured) {
  //                   member.deductibleAmount = addOnDetail.addOnSumInsured;
  //                 }
  //               })
  //             }
  //             else {
  //               const coverId = addOnData.addOnId;
  //               const coverName = addOnData.optionalCoverName || addOnData.additionalCoverName;
  //               let coverFound = false;

  //               if (!member.covers) {
  //                 member.covers = [];
  //               }

  //               addOnData.addOnDetails[key].forEach((addOnDetail: any) => {
  //                 if (addOnDetail.addOnSumInsured) {
  //                   addOnSumInsured = addOnDetail.addOnSumInsured;
  //                 }
  //                 else if (addOnDetail.roomType) {
  //                   addOnSumInsured = addOnDetail.roomType;
  //                 }
  //                 else if (addOnDetail.weeklyCashLimit) {
  //                   weeklyCashLimit = addOnDetail.weeklyCashLimit
  //                 }
  //                 else if (addOnDetail.noOfDays) {
  //                   noOfDays = addOnDetail.noOfDays
  //                 }
  //                 if (coverName.includes('Personal Accident') && addOnDetail.occupation) {
  //                   member.occupationCode = JSON.parse(addOnDetail.occupation).value;
  //                 }
  //                 if (coverName.includes('Personal Accident') && addOnDetail.occupationRisk) {
  //                   member.natureOfDutyCode = JSON.parse(addOnDetail.occupationRisk).value;
  //                 }
  //               });

  //               member.covers.forEach((cover: any) => {
  //                 if (cover.coverId === coverId) {
  //                   cover.value = addOnSumInsured;
  //                   coverFound = true;
  //                 }
  //               });

  //               if (!coverFound) {
  //                 member.covers.push({
  //                   coverId: coverId,
  //                   value: addOnSumInsured,
  //                   coverName: coverName,
  //                   weeklyCashLimit: weeklyCashLimit,
  //                   noOfDays: noOfDays,
  //                 });
  //               }

  //               if (!this.covers[index]) {
  //                 this.covers[index] = [];
  //               }

  //               let coverInCovers = this.covers[index].find((c: any) => c.coverId === coverId);
  //               if (coverInCovers) {
  //                 coverInCovers.value = addOnSumInsured;
  //               } else {
  //                 this.covers[index].push({
  //                   coverId: coverId,
  //                   value: addOnSumInsured,
  //                   coverName: coverName,
  //                   weeklyCashLimit: weeklyCashLimit,
  //                   noOfDays: noOfDays,
  //                 });
  //               }

  //             }
  //             if (parentControl.name == 'chronicCare') {
  //               const chronicDiseases: string[] = [];

  //               console.log(addOnData.addOnDetails[key]);

  //               addOnData.addOnDetails[key].forEach((innerObject: any) => {

  //                 Object.keys(innerObject).forEach((diseaseKey) => {
  //                   const diseaseValue = innerObject[diseaseKey];
  //                   console.log(diseaseValue);


  //                   if (
  //                     diseaseKey !== 'memberCheckbox' && // Exclude memberCheckbox
  //                     !diseaseKey.includes('Question') && // Exclude keys containing 'question'
  //                     !diseaseKey.includes('Value') &&
  //                     diseaseValue === true // Include only true values
  //                   ) {
  //                     chronicDiseases.push(diseaseKey); // Add disease name to the list
  //                   }
  //                 });
  //               });

  //               console.log(chronicDiseases);

  //               if (chronicDiseases.length > 0) {
  //                 member.isChronic = 'Yes';
  //                 member.chronicDiseases = chronicDiseases.join(', '); // Join disease names with commas
  //               } else {
  //                 member.isChronic = 'No';
  //                 member.chronicDiseases = ''; // Clear chronic diseases if none found
  //               }
  //               console.log(member);

  //             }
  //             if (this.formData.productName == 'Active Secure') {
  //               if (parentControl.name == 'cancerSecure') {
  //                 this.form.formSections.forEach((section: any) => {
  //                   if (section.sectionTitle === "Optional Covers") {
  //                     section.formControls.forEach((formControl: any) => {
  //                       if (formControl.name == 'csSecondOpinion') {
  //                         formControl.visible = true
  //                       }
  //                     });
  //                   }
  //                 });
  //               } else if (parentControl.name == 'criticalIllness') {
  //                 this.form.formSections.forEach((section: any) => {
  //                   if (section.sectionTitle === "Optional Covers") {
  //                     section.formControls.forEach((formControl: any) => {
  //                       if (formControl.name == 'ciSecondOpinion') {
  //                         formControl.visible = true
  //                       }
  //                     });
  //                   }
  //                 });
  //               } else if (parentControl.name == 'accident') {
  //                 this.form.formSections.forEach((section: any) => {
  //                   if (section.sectionTitle === "Optional Covers") {
  //                     section.formControls.forEach((formControl: any) => {
  //                       if ([
  //                         'accidentPatienthospitalization', 'temporaryTotalDisablementBenefit', 'brokenBonesBenefit',
  //                         'burnBenefit', 'adventureSports', 'medicalExpenses', 'emergencyAssistance',
  //                         'emiProtect', 'loanProtect', 'comaBenefits'
  //                       ].includes(formControl.name)) {
  //                         formControl.visible = true;
  //                       }

  //                       if (formControl.name == 'comaBenefits' || formControl.name == 'adventureSports') {
  //                         if (formControl.subControls) {
  //                           formControl.subControls.forEach((subControl: any) => {
  //                             if (subControl.innerSubControls) {
  //                               subControl.innerSubControls.forEach((innerSubControl: any) => {
  //                                 if (innerSubControl.coreControls) {
  //                                   innerSubControl.coreControls.forEach((coreControl: any, index: any) => {
  //                                     if (coreControl.name == 'addOnSumInsured') {

  //                                       const parentGroup = this.dynamicFormGroup.get(formControl.name) as FormGroup;
  //                                       const controlGroup = parentGroup?.controls[control.name] as FormGroup;

  //                                       if (innerSubControl.name !== "demoType" && innerSubControl.name !== "doneButton") {
  //                                         const innerSubGroup = controlGroup?.controls[innerSubControl.name] as FormArray;
  //                                         const targetFormGroup = innerSubGroup?.controls[index] as FormGroup;
  //                                         const coreControls = targetFormGroup?.controls[coreControl.name] as FormControl;
  //                                         if (coreControls) {
  //                                           let member = this.formData.insuredMemberDetails.find((m: any) =>
  //                                             m.covers.some((c: any) => c.coverId === 'ACCD' && m.relation === innerSubControl.name)
  //                                           );
  //                                           if (member) {
  //                                             let accdCover = member.covers.find((c: any) => c.coverId === 'ACCD');

  //                                             if (accdCover && accdCover.value !== undefined) {
  //                                               coreControls.setValue(1000000 >= accdCover.value ? accdCover.value : 1000000);
  //                                             } else {
  //                                               coreControls.setValue("");
  //                                             }
  //                                           } else {
  //                                             coreControls.setValue("");
  //                                           }
  //                                         }
  //                                       }
  //                                     }
  //                                   });
  //                                 }
  //                               });
  //                             }
  //                           });
  //                         }
  //                       }

  //                     });
  //                   }
  //                 });
  //               }
  //             }
  //           }
  //         });
  //       } else if (addOnData.addOnDetails[key][0].memberCheckbox === false) {
  //         modifiedInsuredMemberDetails.forEach((member: any, index: number) => {
  //           if (member.relation === key) {
  //             const coverId = addOnData.addOnId;

  //             if (member.covers) {
  //               member.covers = member.covers.filter((cover: any) => cover.coverId !== coverId);
  //             }

  //             if (this.covers[index]) {
  //               this.covers[index] = this.covers[index].filter((cover: any) => cover.coverId !== coverId);
  //             }
  //           }
  //         });
  //       }
  //     });
  //   }

  addOnAdded(control: any, parentControl: any = null, productIndex: any) {
    let addOnData = (this.dynamicFormArray.at(productIndex) as FormGroup).get(parentControl.name)?.getRawValue();
    console.log("Selected Add-On Data:", addOnData);

    let modifiedInsuredMemberDetails = this.formData.insuredMemberDetails; // Single insured member list for all products

    Object.keys(addOnData.addOnDetails).forEach((key) => {
      if (addOnData.addOnDetails[key][0].memberCheckbox === true) {
        modifiedInsuredMemberDetails.forEach((member: any, index: number) => {
          if (member.relation === key) {
            let addOnSumInsured: any = 0;
            let weeklyCashLimit: any;
            let noOfDays: any;

            if (parentControl.name == 'deductible') {
              addOnData.addOnDetails[key].forEach((addOnDetail: any) => {
                if (addOnDetail.addOnSumInsured) {
                  member.deductibleAmount = addOnDetail.addOnSumInsured;
                }
              });
            } else {
              const coverId = addOnData.addOnId;
              const coverName = addOnData.optionalCoverName || addOnData.additionalCoverName;
              let coverFound = false;

              if (!this.currentlyAddedAddOnsList[productIndex]) {
                this.currentlyAddedAddOnsList[productIndex] = [];
              }
              if (!this.currentlyAddedAddOnsList[productIndex].some(addOn => addOn.coverId === coverId)) {
                this.currentlyAddedAddOnsList[productIndex].push({
                  coverId: coverId,
                  coverName: coverName
                });
              }

              if (!member.covers) {
                member.covers = [];
              }

              addOnData.addOnDetails[key].forEach((addOnDetail: any) => {
                if (addOnDetail.addOnSumInsured) {
                  addOnSumInsured = addOnDetail.addOnSumInsured;
                } else if (addOnDetail.roomType) {
                  addOnSumInsured = addOnDetail.roomType;
                } else if (addOnDetail.weeklyCashLimit) {
                  weeklyCashLimit = addOnDetail.weeklyCashLimit;
                } else if (addOnDetail.noOfDays) {
                  noOfDays = addOnDetail.noOfDays;
                }
                if (coverName.includes('Personal Accident') && addOnDetail.occupation) {
                  member.occupationCode = JSON.parse(addOnDetail.occupation).value;
                }
                if (coverName.includes('Personal Accident') && addOnDetail.occupationRisk) {
                  member.natureOfDutyCode = JSON.parse(addOnDetail.occupationRisk).value;
                }
              });

              // Ensure `this.covers[productIndex]` is correctly initialized
              if (!this.covers[productIndex]) {
                this.covers[productIndex] = []; // Initialize array for productIndex
              }
              if (!this.covers[productIndex][index]) {
                this.covers[productIndex][index] = []; // Initialize array for insured member
              }

              // Update `this.covers` for the specific product
              let coverInCovers = this.covers[productIndex][index].find((c: any) => c.coverId === coverId);
              if (coverInCovers) {
                coverInCovers.value = addOnSumInsured;
              } else {
                this.covers[productIndex][index].push({
                  coverId: coverId,
                  value: addOnSumInsured,
                  coverName: coverName,
                  weeklyCashLimit: weeklyCashLimit,
                  noOfDays: noOfDays,
                });
              }
            }
          }
        });
      } else if (addOnData.addOnDetails[key][0].memberCheckbox === false) {
        modifiedInsuredMemberDetails.forEach((member: any, index: number) => {
          if (member.relation === key) {
            const coverId = addOnData.addOnId;

            // Ensure `member.covers` exists before filtering
            if (member.covers && Array.isArray(member.covers)) {
              member.covers = member.covers.filter((cover: any) => cover.coverId !== coverId);
            }

            // Ensure `this.covers[productIndex]` is initialized before modifying
            if (!this.covers[productIndex]) {
              this.covers[productIndex] = []; // Initialize array for product
            }

            // Ensure `this.covers[productIndex][index]` exists before filtering
            if (!this.covers[productIndex][index]) {
              this.covers[productIndex][index] = []; // Initialize array for insured member
            }

            // Filter out the removed cover
            this.covers[productIndex][index] = this.covers[productIndex][index].filter(
              (cover: any) => cover.coverId !== coverId
            );
          }
        });

        console.log(`Updated covers after removal for product ${productIndex}:`, this.covers[productIndex]);
      }

    });

    this.formData.insuredMemberDetails = modifiedInsuredMemberDetails;

    console.log(`Updated covers for product ${productIndex}:`, this.covers[productIndex]);
  }


  //   addOnRemoved(control: any, parentControl: any = null, productIndex: any) {
  //     let addOnData = this.dynamicFormArray.at(productIndex).get(parentControl.name)?.value;
  //     let modifiedInsuredMemberDetails = this.formData.insuredMemberDetails;

  //     // Iterate over each member and remove the specified add-on for the given productIndex
  //     modifiedInsuredMemberDetails.forEach((member: any, index: number) => {
  //         const coverId = addOnData.addOnId;

  //         // Remove the add-on from the covers array of insuredMemberDetails
  //         if (member.covers) {
  //             member.covers = member.covers.filter((cover: any) => cover.coverId !== coverId);
  //         }

  //         // Ensure the 3D covers array exists before attempting to remove the add-on
  //         if (this.covers[productIndex] && this.covers[productIndex][index]) {
  //             this.covers[productIndex][index] = this.covers[productIndex][index].filter(
  //                 (cover: any) => cover.coverId !== coverId
  //             );
  //         }
  //     });

  //     // Call getPremiumAmount after removing the add-on if needed
  //     // this.getPremiumAmount();
  // }

  addOnRemoved(control: any, parentControl: any = null, productIndex: any) {
    let addOnData = (this.dynamicFormArray.at(productIndex) as FormGroup).get(parentControl.name)?.value;
    console.log(addOnData);

    parentControl.subControls.forEach((subControl: any) => {
      if (subControl.innerSubControls) {
        for (let i = 1; i < subControl.innerSubControls.length; i++) {
          if (subControl.innerSubControls[i].coreControls) {
            for (let j = 0; j < subControl.innerSubControls[i].coreControls.length; j++) {
              if (subControl.conditionCheck) {
                if (subControl.innerSubControls[i].coreControls[j].dependentControls) {
                  if (subControl.innerSubControls[i].coreControls[j].conditionCheck) {
                    subControl.innerSubControls[i].coreControls[j].value = false;
                    subControl.innerSubControls[i].coreControls[j].visible = true;
                  }
                  else {
                    subControl.innerSubControls[i].coreControls[j].value = false;
                    subControl.innerSubControls[i].coreControls[j].visible = false;
                  }
                }
                else {
                  subControl.innerSubControls[i].coreControls[j].visible = false;
                }
                let newcontrol = ((this.dynamicFormArray.at(productIndex) as FormGroup).get(`${parentControl.name}.${subControl.name}.${subControl.innerSubControls[i].name}.${j}.${subControl.innerSubControls[i].coreControls[j].name}`) as any);
                if (newcontrol instanceof FormGroup) {
                  Object.keys(newcontrol.controls).forEach((element: any) => {
                    newcontrol.removeControl(element);
                  });
                }
                else {
                  newcontrol.setValue(false);
                }
              }
              else if ((this.dynamicFormArray.at(productIndex) as FormGroup).get(`${parentControl.name}.${subControl.name}.${subControl.innerSubControls[i].name}.${j}.${subControl.innerSubControls[i].coreControls[j].name}`)?.value == true || (this.dynamicFormArray.at(productIndex) as FormGroup).get(`${parentControl.name}.${subControl.name}.${subControl.innerSubControls[i].name}.${j}.${subControl.innerSubControls[i].coreControls[j].name}`)?.value == false) {

                (this.dynamicFormArray.at(productIndex) as FormGroup).get(`${parentControl.name}.${subControl.name}.${subControl.innerSubControls[i].name}.${j}.${subControl.innerSubControls[i].coreControls[j].name}`)?.setValue(false);
              }
              else {
                (this.dynamicFormArray.at(productIndex) as FormGroup).get(`${parentControl.name}.${subControl.name}.${subControl.innerSubControls[i].name}.${j}.${subControl.innerSubControls[i].coreControls[j].name}`)?.setValue('');
              }
            }
          }
        }
      }
    })

    let modifiedInsuredMemberDetails = this.formData.insuredMemberDetails;

    if (!addOnData || !addOnData.addOnId) {
      console.warn(`No valid add-on data found for product index: ${productIndex}`);
      return;
    }

    const addOnCover = parentControl.subControls.find((subControl: any) => subControl.name === 'addOnCover');

    if (addOnCover && addOnCover.label) {
      const selectedAddon = this.ProductList[productIndex].selectedAddon;
      const index = selectedAddon.indexOf(addOnCover.label);

      if (index > -1) {
        selectedAddon.splice(index, 1); // Removes the label from the array
      }
    }

    const coverId = addOnData.addOnId;

    // Iterate over each member and remove the specified add-on for the given productIndex
    modifiedInsuredMemberDetails.forEach((member: any, index: number) => {
      if (!member.covers) {
        member.covers = []; // Ensure member.covers is initialized
      }

      // Remove the add-on from the member's covers array
      member.covers = member.covers.filter((cover: any) => cover.coverId !== coverId);

      // Ensure `this.covers[productIndex]` is initialized
      if (!this.covers[productIndex]) {
        this.covers[productIndex] = []; // Initialize array for product
      }

      // Ensure `this.covers[productIndex][index]` is initialized
      if (!this.covers[productIndex][index]) {
        this.covers[productIndex][index] = []; // Initialize array for insured member
      }

      // Remove the add-on from the 3D `this.covers` array
      this.covers[productIndex][index] = this.covers[productIndex][index].filter(
        (cover: any) => cover.coverId !== coverId
      );
    });

    console.log(`Updated covers after removal for product ${productIndex}:`, this.covers[productIndex]);

    // Optionally call getPremiumAmount if required
    // this.getPremiumAmount();
  }



  async recalculatePremiumAmount(productIndex: any) {
    console.log(this.covers, this.formData);
    console.log(this.ProductList[productIndex]);

    if (this.currentlyAddedAddOnsList[productIndex] && this.currentlyAddedAddOnsList[productIndex].length > 0) {
      this.currentlyAddedAddOnsList[productIndex].forEach((element: any) => {
        if (!this.recalculatedAddOnList[productIndex]) {
          this.recalculatedAddOnList[productIndex] = [];
        }
        // if (!this.recalculatedAddOnList[productIndex].some(addOn => addOn.coverId === coverId)) {
        //   this.currentlyAddedAddOnsList[productIndex].push({
        //     coverId: coverId,
        //     coverName: coverName
        //   });
        // }
        this.recalculatedAddOnList[productIndex].push(element);
      })
    }


    this.currentlyAddedAddOnsList[productIndex] = [];
    this.recalculatedAddOnRemoved[productIndex] = false;

    if (Object.keys(this.formData).length > 0) {
      this.formData.insuredMemberDetails.forEach((member: any, index: number) => {
        // Ensure member has a covers array specific to the product
        member['covers'] = this.covers[productIndex]?.[index] ?? [];

        if (member.chronicDiseases) {
          if (typeof member.chronicDiseases === 'object') {
            member['chronicDiseases'] = Object.keys(member.chronicDiseases)
              .filter(disease => member.chronicDiseases[disease]) // Filter diseases with value `true`
              .map(disease => disease.charAt(0).toUpperCase() + disease.slice(1)) // Capitalize first letter
              .join(', '); // Join with a comma and space
            member['isChronic'] = "YES";
          } else if (typeof member.chronicDiseases === 'string') {
            member.chronicDiseases = member.chronicDiseases;
          } else {
            member['chronicDiseases'] = null;
            member['isChronic'] = member['isChronic'] ?? "No"; // Default to "No"
          }
        } else if (member.chronicDiseases === "") {
          member['chronicDiseases'] = null;
          member['isChronic'] = member['isChronic'] ?? "No";
        }

        member['roomCategory'] = member['roomCategory'] ?? "";
      });

      // Update general policy details
      this.formData['sumInsured'] = this.formData.insuredMemberDetails[0]?.sumInsured;
      this.formData['familySize'] = this.formData.insuredMemberDetails.length + 'A';
      this.formData['proposerName'] = this.formData['proposerName'] == '' ? this.formData['firstName'] + " " + this.formData['lastName'] : this.formData['proposerName'];

      if (this.formData.memberPolicyType === 'Family Floater') {
        const pincode = this.formData.memberPolicyType === 'Family Floater'
          ? this.formData['proposerPincode']
          : this.formData.insuredMemberDetails[0]?.pincode;
        const zone = this.formData['zone'];
        const zoneValue = this.formData['zoneValue'];
        let deductibleAmount: any = this.formData['deductibleAmount'] ?? '';

        // Ensure all members under the product share the same zone and pincode
        this.formData.insuredMemberDetails.forEach((member: any) => {
          member.pincode = pincode;
          member.zone = zone;
          member.zoneValue = zoneValue;
          if (deductibleAmount !== '') {
            member.deductibleAmount = deductibleAmount;
          }
        });
      }

      console.log(this.formData);

      let reqData = {
        "agentCode": this.agentCode,
        "productId": this.ProductList[productIndex]?.productId, // Use productIndex to fetch the correct product ID
        "quoteData": JSON.stringify(this.formData)
      };

      try {
        const res: any = await new Promise((resolve, reject) => {
          this.commonService.GetSingleProductQuote(reqData).subscribe({
            next: (response) => resolve(response),
            error: (error) => reject(error)
          });
        });

        console.log(res);
        if (res.isSuccess) {
          this.ProductList[productIndex].tenure1Premium = Math.round(res.data.tenure1Premium);
          this.ProductList[productIndex].tenure2Premium = Math.round(res.data.tenure2Premium);
          this.ProductList[productIndex].tenure3Premium = Math.round(res.data.tenure3Premium);

          // Round tenure discount
          this.ProductList[productIndex].t1DiscountAmount = Math.round(res.data.t1DiscountAmount);
          this.ProductList[productIndex].t2DiscountAmount = Math.round(res.data.t2DiscountAmount);
          this.ProductList[productIndex].t3DiscountAmount = Math.round(res.data.t3DiscountAmount);
        }

      } catch (error) {
        console.error("Error while fetching product tenure", error);
      } finally {
        this.spinner.hide();
        // window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }

    this.changeRecalculate(false, productIndex);
    // this.showRecalculateButton[productIndex] = false;
  }



  changeRecalculate(visibility: boolean, productIndex: number) {
    this.showRecalculateButton[productIndex] = visibility;

    const button = document.getElementById(`Add_to_Cart_${productIndex}`) as HTMLButtonElement;
    if (button) {
      button.disabled = visibility; // Disable if visibility is true
    }
  }

  getProductFormGroup(index: number): FormGroup {
    return this.dynamicFormArray.at(index) as FormGroup;
  }

  hasSubValue(control: any, parentControl: any | null = null, innerControl: any | null = null, innerSubControl: any | null = null, index: any | null = null, productIndex: any = null) {
    const formControl = parentControl != null && index != null ?
      (((this.dynamicFormArray.at(productIndex).get(control.name) as FormGroup)?.controls[parentControl.name] as FormGroup).controls[innerControl.name] as FormArray).controls[index].get(innerSubControl.name)?.value
      : this.dynamicFormArray.at(productIndex).get(control.name);
    return formControl;
  }

  defaultAddOn(control: any, productIndex: any) {
    console.log(this.formData, control);

    const addOnControl = this.dynamicFormArray.at(productIndex).get(control.name);
    const addOnCoverControl = addOnControl?.get('addOnCover');
    const addOnDetailsControl = addOnControl?.get('addOnDetails');
    const addOnIdControl = addOnControl?.get('addOnId');
    const addOnCoverNameControl = addOnControl?.get('optionalCoverName');

    const addOnData = addOnControl?.getRawValue();
    const modifiedInsuredMemberDetails = this.formData.insuredMemberDetails;

    if (!addOnDetailsControl || !addOnData) {
      console.warn('Add-on details control or data is not found.');
      return;
    }

    if (addOnCoverNameControl?.value.includes('Personal Accident')) {
      let shouldEnableAddOnCover = false; // Track if any member's checkbox is true
      let isSelfPresent = false;

      // Check for age validation rules
      const ageValidationRule = control.validationRules?.find((rule: any) => rule.type === 'ageValidation');
      if (ageValidationRule) {
        this.checkForAgeValidations(control, productIndex); // Call the age validation method
      }

      const memberSumInsuredValidationRule = control.validationRules?.find((rule: any) => rule.type === 'memberLevelSumInsured');
      if (memberSumInsuredValidationRule) {
        this.memberSumInsuredValidationMethod(memberSumInsuredValidationRule, control);
      }

      console.log("After disabling based on member", this.form);

      const zoneValidationRule = control.validationRules?.find((rule: any) => rule.type === 'zoneWiseValidation');
      const portabilityValidationRule = control.validationRules?.find((rule: any) => rule.type === 'portability');
      console.log(this.formData);

      const isPortabilityRuleAvailable = portabilityValidationRule && this.formData['typeOfBusiness'] === 'Roll Over';

      if (isPortabilityRuleAvailable) {
        this.setPortabilityValidationRule(portabilityValidationRule, control, productIndex);
      }

      Object.keys(addOnDetailsControl.value).forEach((key: any) => {
        const memberArray = addOnDetailsControl.get(key) as FormArray;

        memberArray.controls.forEach((member: any) => {
          const memberControlCheckbox = member.get('memberCheckbox');
          const occupationControl = member.get('occupation');
          const occupationRiskControl = member.get('occupationRisk');
          const addOnSumInsuredControl = member.get('addOnSumInsured');

          if (memberControlCheckbox?.disabled) {
            console.log(`Skipping disabled member: ${key}`);
            return;
          }

          const matchingMember = this.formData.insuredMemberDetails.find(
            (insuredMember: any) => key === insuredMember.relation
          );


          if (isPortabilityRuleAvailable && portabilityValidationRule?.policyRules) {
            const policyRule = portabilityValidationRule.policyRules.find(
              (rule: any) => rule.policyType === this.formData.memberPolicyType
            );

            if (policyRule?.ageBasedRules) {
              const minAgeThreshold = policyRule.ageBasedRules.minAgeThreshold;
              const maxAgeThreshold = policyRule.ageBasedRules.maxAgeThreshold;

              if (parseInt(matchingMember.memberAge) < minAgeThreshold) {
                const belowMinThresholdRules = policyRule.ageBasedRules.belowMinThreshold;
                if (belowMinThresholdRules && memberControlCheckbox) {
                  memberControlCheckbox.setValue(belowMinThresholdRules.selected);
                  if (belowMinThresholdRules.disabled) {
                    memberControlCheckbox.disable();
                  }
                }
              } else if (parseInt(matchingMember.memberAge) > maxAgeThreshold) {
                const aboveMaxThresholdRules = policyRule.ageBasedRules.aboveMaxThreshold;
                if (aboveMaxThresholdRules && memberControlCheckbox) {
                  memberControlCheckbox.setValue(aboveMaxThresholdRules.selected);
                  if (aboveMaxThresholdRules.disabled) {
                    memberControlCheckbox.disable();
                  }
                }
              } else {
                const withinThresholdRules = policyRule.ageBasedRules.withinThreshold;
                if (withinThresholdRules && memberControlCheckbox) {
                  memberControlCheckbox.setValue(withinThresholdRules.selected);
                  // No disable logic for withinThreshold, keeping it enabled
                  if (withinThresholdRules.disabled) {
                    memberControlCheckbox.disable();
                  }
                }
              }
            }
          }
          else if (!isPortabilityRuleAvailable && !portabilityValidationRule && memberControlCheckbox) {
            memberControlCheckbox.setValue(true);
            if (key === 'Self') {
              isSelfPresent = true;
              // Disable the checkbox for 'Self'
              memberControlCheckbox.disable();
            }
          }

          if (addOnCoverNameControl?.value.includes('Personal Accident')) {
            const innerControls = control.subControls[1].innerSubControls || [];
            const matchingInnerControl = innerControls.find((innerControl: any) => innerControl.name === key);
            const coreControls = matchingInnerControl?.coreControls || [];

            if (occupationControl) {
              coreControls.forEach((coreControl: any) => {
                if (coreControl.name === 'occupation' && occupationControl.value === '') {
                  const defaultOption = JSON.stringify(coreControl.options?.[0]);
                  if (defaultOption) {
                    occupationControl.setValue(defaultOption);
                  }
                }
              });
            }

            if (occupationRiskControl) {
              coreControls.forEach((coreControl: any) => {
                if (coreControl.name === 'occupationRisk' && occupationRiskControl.value === '') {
                  const defaultOption = JSON.stringify(coreControl.options?.[0]);
                  if (defaultOption) {
                    occupationRiskControl.setValue(defaultOption);
                  }
                }
              });
            }

            if (addOnSumInsuredControl) {
              coreControls.forEach((coreControl: any) => {
                if (coreControl.name === 'addOnSumInsured' && addOnSumInsuredControl.value === '') {
                  const defaultOption = coreControl.options?.[0]?.value;
                  if (defaultOption) {
                    addOnSumInsuredControl.setValue(defaultOption);
                  }
                }
              });
            }
          }

        });
        // if (!portabilityValidationRule || isPortabilityRuleAvailable) {
        //   modifiedInsuredMemberDetails.forEach((insuredMember: any, index: number) => {
        //     if (insuredMember.relation === key) {
        //       const matchingMemberControl = memberArray.controls.find(
        //         (member: any) => member.get('memberCheckbox')?.value === true
        //       );

        //       // Only proceed if memberCheckbox is checked
        //       if (!matchingMemberControl) {
        //         console.log(`Skipping member ${key} as memberCheckbox is false`);
        //         return;
        //       }
        //       shouldEnableAddOnCover = true;
        //       const coverId = addOnIdControl?.value;
        //       const coverName = addOnCoverNameControl?.value || '';

        //       let addOnSumInsured = 0;
        //       let coverFound = false;

        //       const addOnDetails = addOnControl?.value.addOnDetails[key];
        //       addOnDetails.forEach((detail: any) => {
        //         if (detail.addOnSumInsured) {
        //           addOnSumInsured = detail.addOnSumInsured;
        //         } else if (detail.roomType) {
        //           addOnSumInsured = detail.roomType;
        //         }

        //         if (coverName.includes('Personal Accident') && detail.occupation) {
        //           insuredMember.occupationCode = JSON.parse(detail.occupation).value;
        //         }

        //         if (coverName.includes('Personal Accident') && detail.occupationRisk) {
        //           insuredMember.natureOfDutyCode = JSON.parse(detail.occupationRisk).value;
        //         }
        //       });

        //       if (!insuredMember.covers) {
        //         insuredMember.covers = [];
        //       }

        //       insuredMember.covers.forEach((cover: any) => {
        //         if (cover.coverId === coverId) {
        //           cover.value = addOnSumInsured;
        //           coverFound = true;
        //         }
        //       });

        //       if (!coverFound) {
        //         insuredMember.covers.push({
        //           coverId,
        //           value: addOnSumInsured,
        //           coverName
        //         });
        //       }

        //       if (!this.covers[index]) {
        //         this.covers[index] = [];
        //       }

        //       const coverInCovers = this.covers[index].find((c: any) => c.coverId === coverId);
        //       if (coverInCovers) {
        //         coverInCovers.value = addOnSumInsured;
        //       } else {
        //         this.covers[index].push({
        //           coverId,
        //           value: addOnSumInsured,
        //           coverName
        //         });
        //       }
        //     }
        //   });
        // }

        if (!portabilityValidationRule || isPortabilityRuleAvailable) {
          modifiedInsuredMemberDetails.forEach((insuredMember: any, policyIndex: number) => {
            if (insuredMember.relation === key) {
              const matchingMemberControl = memberArray.controls.find(
                (member: any) => member.get('memberCheckbox')?.value === true
              );

              // Only proceed if memberCheckbox is checked
              if (!matchingMemberControl) {
                console.log(`Skipping member ${key} as memberCheckbox is false`);
                return;
              }

              shouldEnableAddOnCover = true;
              const coverId = addOnIdControl?.value;
              const coverName = addOnCoverNameControl?.value || '';

              let addOnSumInsured = 0;
              let coverFound = false;

              const addOnDetails = addOnControl?.value.addOnDetails[key];
              addOnDetails.forEach((detail: any) => {
                if (detail.addOnSumInsured) {
                  addOnSumInsured = detail.addOnSumInsured;
                } else if (detail.roomType) {
                  addOnSumInsured = detail.roomType;
                }

                if (coverName.includes('Personal Accident') && detail.occupation) {
                  insuredMember.occupationCode = JSON.parse(detail.occupation).value;
                }

                if (coverName.includes('Personal Accident') && detail.occupationRisk) {
                  insuredMember.natureOfDutyCode = JSON.parse(detail.occupationRisk).value;
                }
              });

              if (!insuredMember.covers) {
                insuredMember.covers = [];
              }

              if (!this.covers[productIndex]) {
                this.covers[productIndex] = []; // Initialize array for productIndex
              }
              if (!this.covers[productIndex][policyIndex]) {
                this.covers[productIndex][policyIndex] = []; // Initialize array for insured member
              }

              let coverInCovers = this.covers[productIndex][policyIndex].find((c: any) => c.coverId === coverId);
              if (coverInCovers) {
                coverInCovers.value = addOnSumInsured;
              } else {
                this.covers[productIndex][policyIndex].push({
                  coverId: coverId,
                  value: addOnSumInsured,
                  coverName: coverName
                });
              }

            }
          });
        }



      });

      // if (shouldEnableAddOnCover) {
      //   let zoneValidationRuleApplicable = false;
      //   if (zoneValidationRule) {
      //     zoneValidationRuleApplicable = this.formData.insuredMemberDetails.some(
      //       (insuredMember: any) => insuredMember.zone === 'Zone I'
      //     );
      //   }

      //   if (isPortabilityRuleAvailable) {
      //     addOnCoverControl?.setValue(true);
      //     this.recalculatePremiumAmount(productIndex);
      //   } else {
      //     addOnCoverControl?.setValue(false);
      //   }

      //   if ((isSelfPresent && !zoneValidationRuleApplicable && !isPortabilityRuleAvailable) || isPortabilityRuleAvailable) {
      //     addOnCoverControl?.disable();
      //   }
      // } else {
      //   addOnCoverControl?.setValue(false);
      // }

      if (shouldEnableAddOnCover) {
        console.log(shouldEnableAddOnCover);

        let zoneValidationRuleApplicable = false;
        if (zoneValidationRule) {
          zoneValidationRuleApplicable = this.formData.insuredMemberDetails.some(
            (insuredMember: any) => insuredMember.zone === 'Zone I'
          );
        }


        if (portabilityValidationRule) {

          if (isPortabilityRuleAvailable) {
            addOnCoverControl?.setValue(true);
            if (!this.recalculatedAddOnList[productIndex]) {
              this.recalculatedAddOnList[productIndex] = [];
            }
            if (this.recalculatedAddOnList[productIndex] && ((this.recalculatedAddOnList[productIndex].length > 0 && !this.recalculatedAddOnList[productIndex].some(addOn => addOn.coverId === addOnIdControl?.value)) || this.recalculatedAddOnList[productIndex].length == 0)) {
              this.recalculatedAddOnList[productIndex].push({
                coverId: addOnIdControl?.value,
                coverName: addOnCoverNameControl?.value
              });
            }
          }
          else {
            addOnCoverControl?.setValue(false);
          }
        }
        else {
          addOnCoverControl?.setValue(true);
          if (!this.recalculatedAddOnList[productIndex]) {
            this.recalculatedAddOnList[productIndex] = [];
          }
          if (this.recalculatedAddOnList[productIndex] && ((this.recalculatedAddOnList[productIndex].length > 0 && !this.recalculatedAddOnList[productIndex].some(addOn => addOn.coverId === addOnIdControl?.value)) || this.recalculatedAddOnList[productIndex].length == 0)) {
            this.recalculatedAddOnList[productIndex].push({
              coverId: addOnIdControl?.value,
              coverName: addOnCoverNameControl?.value
            });
          }
        }

        if ((isSelfPresent && !zoneValidationRuleApplicable && !isPortabilityRuleAvailable) || isPortabilityRuleAvailable) {
          addOnCoverControl?.disable();
        }

      }
      else {
        addOnCoverControl?.setValue(false);
      }


    }

    else {
      // New logic for validationRules
      const validationRules = control.validationRules || [];

      const ageValidationRule = control.validationRules?.find((rule: any) => rule.type === 'ageValidation');

      if (ageValidationRule) {
        this.checkForAgeValidations(control, productIndex); // Call the age validation method
      }

      // const matchingRule = validationRules.find(
      //   (rule: any) => rule.policyType === this.formData['memberPolicyType']
      // );

      // console.log(matchingRule);

      validationRules.forEach((rule: any) => {
        const matchingRule = rule.policyType === this.formData['memberPolicyType'] ? rule : null;
        if (matchingRule) {
          if (matchingRule.type == 'policy-level') {
            const { allMemberSelected, allMemberDisabled } = matchingRule;

            if (allMemberSelected) {
              console.log(addOnCoverControl);

              addOnCoverControl?.setValue(true);
            }
            if (allMemberDisabled) {
              addOnCoverControl?.disable();
            }

            // Only start iteration if allMemberSelected or allMemberDisabled is true
            if (allMemberSelected || allMemberDisabled) {
              Object.keys(addOnDetailsControl.value).forEach((key: any) => {
                const memberArray = addOnDetailsControl.get(key) as FormArray;

                memberArray.controls.forEach((member: any) => {
                  const memberControlCheckbox = member.get('memberCheckbox');
                  const addOnSumInsuredControl = member.get('addOnSumInsured');
                  let isDisabledByAgeValidation = false;
                  if (ageValidationRule) {
                    const matchingMember = this.formData.insuredMemberDetails.find(
                      (insuredMember: any) => key === insuredMember.relation
                    );

                    if (matchingMember.memberAge > ageValidationRule.maxAge || matchingMember.memberAge < ageValidationRule.minAge) {
                      isDisabledByAgeValidation = true;
                    }
                  }

                  // Handle allMemberSelected
                  if (allMemberSelected && memberControlCheckbox && !isDisabledByAgeValidation) {
                    memberControlCheckbox.setValue(true);
                  }

                  // Handle allMemberDisabled
                  if (allMemberDisabled) {
                    if (memberControlCheckbox) {
                      memberControlCheckbox.disable();
                    }
                    // if (addOnSumInsuredControl) {
                    //   addOnSumInsuredControl.disable(); // Add this line to disable addOnSumInsuredControl
                    // }
                  }

                  // Set addOnSumInsured value logic if the control exists
                  if (addOnSumInsuredControl && !isDisabledByAgeValidation) {
                    const coreControls = control.subControls[1]?.innerSubControls?.[0]?.coreControls || [];
                    let addOnSumInsured = '';

                    coreControls.forEach((coreControl: any) => {
                      if (coreControl.name === 'addOnSumInsured') {
                        if (coreControl.options?.[0]?.value) {
                          addOnSumInsured = coreControl.options[0].value;
                        } else {
                          const memberDetail = modifiedInsuredMemberDetails.find(
                            (member: any) => member.relation === key
                          );
                          addOnSumInsured = memberDetail?.memberSumInsured || '';
                        }

                        if (addOnSumInsuredControl && addOnSumInsured !== '') {
                          addOnSumInsuredControl.setValue(addOnSumInsured);
                        }
                      }
                    });

                    // Update insuredMemberDetails logic
                    modifiedInsuredMemberDetails.forEach((insuredMember: any, index: number) => {
                      if (insuredMember.relation === key) {
                        const coverId = addOnIdControl?.value;
                        const coverName = addOnCoverNameControl?.value || '';

                        if (!insuredMember.covers) {
                          insuredMember.covers = [];
                        }

                        const existingCover = insuredMember.covers.find((cover: any) => cover.coverId === coverId);
                        if (existingCover) {
                          existingCover.value = addOnSumInsured;
                        } else {
                          insuredMember.covers.push({ coverId, value: addOnSumInsured, coverName });
                        }

                        if (!this.covers[productIndex]) {
                          this.covers[productIndex] = []; // Initialize array for productIndex
                        }
                        if (!this.covers[productIndex][index]) {
                          this.covers[productIndex][index] = []; // Initialize array for insured member
                        }

                        let coverInCovers = this.covers[productIndex][index].find((c: any) => c.coverId === coverId);
                        if (coverInCovers) {
                          coverInCovers.value = addOnSumInsured;
                        } else {
                          this.covers[productIndex][index].push({
                            coverId: coverId,
                            value: addOnSumInsured,
                            coverName: coverName
                          });
                        }
                      }
                    });
                  }
                });
              });
            }
          }
          if (matchingRule.type == 'state-level') {
            const { states, sumInsuredThreshold, rules } = matchingRule;
            let shouldEnableAddOnCover = false;
            let isSelfPresent = false;
            Object.keys(addOnDetailsControl.value).forEach((key: any) => {
              const memberArray = addOnDetailsControl.get(key) as FormArray;

              memberArray.controls.forEach((member: any) => {
                const memberControlCheckbox = member.get('memberCheckbox');
                const addOnSumInsuredControl = member.get('addOnSumInsured');
                let isDisabledByAgeValidation = false;
                let isMemberStateApplicable = false;
                let isMemberSumInsuredApplicable = true;
                const matchingMember = this.formData.insuredMemberDetails.find(
                  (insuredMember: any) => key === insuredMember.relation
                );
                if (ageValidationRule) {

                  if (matchingMember.memberAge > ageValidationRule.maxAge || matchingMember.memberAge < ageValidationRule.minAge) {
                    isDisabledByAgeValidation = true;
                  }
                }

                if (states.includes(matchingMember.state)) {
                  isMemberStateApplicable = true;
                }

                if (parseInt(matchingMember.sumInsured) > sumInsuredThreshold) {
                  isMemberSumInsuredApplicable = false;
                }

                if (!isDisabledByAgeValidation && isMemberStateApplicable && isMemberSumInsuredApplicable) {

                  const isSelf = key === 'Self';

                  // Fetch rule for the relation type (Self or Others)
                  const memberRule = rules[isSelf ? 'Self' : 'Others'];

                  if (isSelf) {
                    isSelfPresent = true;
                  }

                  // Apply selected/disabled logic based on the rule
                  if (memberRule?.selected) {
                    memberControlCheckbox?.setValue(memberRule?.selected);
                    shouldEnableAddOnCover = true;
                  }
                  if (memberRule?.disabled) {
                    memberControlCheckbox?.disable();
                  }

                  // Set addOnSumInsured value logic if the control exists
                  if (addOnSumInsuredControl && !isDisabledByAgeValidation) {
                    const coreControls = control.subControls[1]?.innerSubControls?.[0]?.coreControls || [];
                    let addOnSumInsured = '';

                    coreControls.forEach((coreControl: any) => {
                      if (coreControl.name === 'addOnSumInsured') {
                        if (coreControl.options?.[0]?.value) {
                          addOnSumInsured = coreControl.options[0].value;
                        } else {
                          const memberDetail = modifiedInsuredMemberDetails.find(
                            (member: any) => member.relation === key
                          );
                          addOnSumInsured = memberDetail?.sumInsured || '';
                        }

                        if (addOnSumInsuredControl && addOnSumInsured !== '') {
                          addOnSumInsuredControl.setValue(addOnSumInsured);
                        }
                      }
                    });

                    // // Update insuredMemberDetails logic
                    // modifiedInsuredMemberDetails.forEach((insuredMember: any, index: number) => {
                    //   if (insuredMember.relation === key) {
                    //     const coverId = addOnIdControl?.value;
                    //     const coverName = addOnCoverNameControl?.value || '';

                    //     if (!insuredMember.covers) {
                    //       insuredMember.covers = [];
                    //     }

                    //     const existingCover = insuredMember.covers.find((cover: any) => cover.coverId === coverId);
                    //     if (existingCover) {
                    //       existingCover.value = addOnSumInsured;
                    //     } else {
                    //       insuredMember.covers.push({ coverId, value: addOnSumInsured, coverName });
                    //     }

                    //     if (!this.covers[index]) {
                    //       this.covers[index] = [];
                    //     }

                    //     const existingCoverInCovers = this.covers[index].find((c: any) => c.coverId === coverId);
                    //     if (existingCoverInCovers) {
                    //       existingCoverInCovers.value = addOnSumInsured;
                    //     } else {
                    //       this.covers[index].push({ coverId, value: addOnSumInsured, coverName });
                    //     }
                    //   }
                    // });

                    // Update insuredMemberDetails logic
                    modifiedInsuredMemberDetails.forEach((insuredMember: any, index: number) => {
                      if (insuredMember.relation === key) {
                        const coverId = addOnIdControl?.value;
                        const coverName = addOnCoverNameControl?.value || '';

                        if (!insuredMember.covers) {
                          insuredMember.covers = [];
                        }

                        const existingCover = insuredMember.covers.find((cover: any) => cover.coverId === coverId);
                        if (existingCover) {
                          existingCover.value = addOnSumInsured;
                        } else {
                          insuredMember.covers.push({ coverId, value: addOnSumInsured, coverName });
                        }

                        if (!this.covers[productIndex]) {
                          this.covers[productIndex] = []; // Initialize array for productIndex
                        }
                        if (!this.covers[productIndex][index]) {
                          this.covers[productIndex][index] = []; // Initialize array for insured member
                        }

                        let coverInCovers = this.covers[productIndex][index].find((c: any) => c.coverId === coverId);
                        if (coverInCovers) {
                          coverInCovers.value = addOnSumInsured;
                        } else {
                          this.covers[productIndex][index].push({
                            coverId: coverId,
                            value: addOnSumInsured,
                            coverName: coverName
                          });
                        }
                      }
                    });
                  }
                }

              });
            });
            addOnCoverControl?.setValue(shouldEnableAddOnCover);
            if (isSelfPresent) {
              addOnCoverControl?.disable();
            }
          }

          if (matchingRule.type == 'sumInsured-level') {
            if (matchingRule.policyType == 'Family Floater' && parseInt(this.formData['sumInsured']) >= parseInt(matchingRule.sumInsuredThreshold)) {
              control.visible = matchingRule.visibleAddOn;
            }
            else if (matchingRule.policyType == 'Multi Individual') {
              // const sumInsuredThreshold = matchingRule.sumInsuredThreshold;

              const { sumInsuredThreshold, rules } = matchingRule;
              Object.keys(addOnDetailsControl.value).forEach((key: any) => {
                const memberArray = addOnDetailsControl.get(key) as FormArray;

                memberArray.controls.forEach((member: any) => {
                  const memberControlCheckbox = member.get('memberCheckbox');
                  const addOnSumInsuredControl = member.get('addOnSumInsured');
                  const matchingMember = this.formData.insuredMemberDetails.find(
                    (insuredMember: any) => key === insuredMember.relation
                  );


                  if (parseInt(matchingMember.sumInsured) >= sumInsuredThreshold) {
                    const memberRule = rules[key == 'Self' ? 'Self' : 'Others'];

                    if (memberRule?.selected) {
                      memberControlCheckbox?.setValue(memberRule?.selected);
                    }
                    if (memberRule?.disabled) {
                      memberControlCheckbox?.disable();
                    }

                  }

                });
              });
            }
          }
        }


      });


      const portabilityValidationRule = control.validationRules?.find((rule: any) => rule.type === 'portability');
      const isPortabilityRuleAvailable = portabilityValidationRule && this.formData['typeOfBusiness'] === 'Roll Over';

      if (isPortabilityRuleAvailable) {
        const policyRule = portabilityValidationRule.policyRules.find(
          (rule: any) => rule.policyType === this.formData.memberPolicyType
        );

        if (policyRule?.ageBasedRules) {
          Object.keys(addOnDetailsControl.value).forEach((key: any) => {
            const memberArray = addOnDetailsControl.get(key) as FormArray;
            let isMemberSelected = false;
            memberArray.controls.forEach((member: any) => {
              const memberControlCheckbox = member.get('memberCheckbox');
              const addOnSumInsuredControl = member.get('addOnSumInsured');
              const matchingMember = this.formData.insuredMemberDetails.find(
                (insuredMember: any) => key === insuredMember.relation
              );

              if (!matchingMember || (!memberControlCheckbox && !addOnSumInsuredControl)) return;

              const minAgeThreshold = policyRule.ageBasedRules.minAgeThreshold;
              const maxAgeThreshold = policyRule.ageBasedRules.maxAgeThreshold;

              // Apply age validation: Disable if outside valid age range (5-65)
              if (parseInt(matchingMember.memberAge) < minAgeThreshold || parseInt(matchingMember.memberAge) > maxAgeThreshold) {
                if (memberControlCheckbox) {
                  memberControlCheckbox.setValue(false);
                  memberControlCheckbox.disable();
                }
              } else {

                // Logic for Multi Individual (MI)
                if (this.formData.memberPolicyType === 'Multi Individual') {
                  if (key === 'Self' && memberControlCheckbox) {
                    memberControlCheckbox.setValue(policyRule.ageBasedRules.self.selected);
                    isMemberSelected = policyRule.ageBasedRules.self.selected;
                    if (policyRule.ageBasedRules.self.disabled) {
                      memberControlCheckbox.disable();
                    }
                    addOnCoverControl?.setValue(true);
                    addOnCoverControl?.disable();
                  } else if (memberControlCheckbox) {
                    memberControlCheckbox.setValue(policyRule.ageBasedRules.otherMembers.selected);
                    isMemberSelected = policyRule.ageBasedRules.otherMembers.selected;
                    if (policyRule.ageBasedRules.otherMembers.disabled) {
                      memberControlCheckbox.disable();
                    }
                  }
                }

                // Logic for Family Floater (FF)
                if (this.formData.memberPolicyType === 'Family Floater') {
                  const isSelfPresent = this.formData.insuredMemberDetails.some(
                    (insuredMember: any) => insuredMember.relation === 'Self'
                  );

                  if (isSelfPresent) {
                    if (key === 'Self' && memberControlCheckbox) {
                      memberControlCheckbox.setValue(policyRule.ageBasedRules.self.selected);
                      isMemberSelected = policyRule.ageBasedRules.self.selected;
                      memberControlCheckbox.disable();
                      addOnCoverControl?.disable();

                    } else if (memberControlCheckbox) {
                      console.log(key, policyRule.ageBasedRules.otherMembers.selected);

                      memberControlCheckbox.setValue(policyRule.ageBasedRules.otherMembers.selected);
                      isMemberSelected = policyRule.ageBasedRules.otherMembers.selected;
                      memberControlCheckbox.disable();
                    }
                    addOnCoverControl?.setValue(true);

                  } else {
                    // If self is not present, first member is selectable
                    const firstMember = this.formData.insuredMemberDetails[0]?.relation;
                    if (firstMember === key && memberControlCheckbox) {
                      memberControlCheckbox.setValue(policyRule.ageBasedRules.ifNoSelf.selected);
                      isMemberSelected = policyRule.ageBasedRules.ifNoSelf.selected;
                      if (!policyRule.ageBasedRules.ifNoSelf.disabled) {
                        memberControlCheckbox.enable();
                      } else {
                        memberControlCheckbox.disable();
                      }
                    } else if (memberControlCheckbox) {
                      console.log(key, policyRule.ageBasedRules.otherMembers.selected);
                      isMemberSelected = policyRule.ageBasedRules.otherMembers.selected;
                      memberControlCheckbox.setValue(policyRule.ageBasedRules.otherMembers.selected);
                      memberControlCheckbox.disable();
                    }
                    addOnCoverControl?.setValue(true);
                  }
                }


                let addOnSumInsured = addOnSumInsuredControl?.value || '';
                if (addOnSumInsured == '') {
                  console.log(matchingMember);

                  addOnSumInsured = matchingMember.sumInsured || '';
                  if (addOnSumInsuredControl) {
                    addOnSumInsuredControl.setValue(addOnSumInsured);
                  }
                }

                // **Only add members where checkbox is TRUE**
                if (addOnSumInsuredControl && isMemberSelected) {
                  modifiedInsuredMemberDetails.forEach((insuredMember: any, index: number) => {
                    if (insuredMember.relation === key) {
                      const coverId = addOnIdControl?.value;
                      const coverName = addOnCoverNameControl?.value || '';

                      if (!insuredMember.covers) {
                        insuredMember.covers = [];
                      }

                      const existingCover = insuredMember.covers.find((cover: any) => cover.coverId === coverId);
                      if (existingCover) {
                        existingCover.value = addOnSumInsured;
                      } else {
                        insuredMember.covers.push({ coverId, value: addOnSumInsured, coverName });
                      }

                      if (!this.covers[productIndex]) {
                        this.covers[productIndex] = []; // Initialize array for productIndex
                      }
                      if (!this.covers[productIndex][index]) {
                        this.covers[productIndex][index] = []; // Initialize array for insured member
                      }

                      let coverInCovers = this.covers[productIndex][index].find((c: any) => c.coverId === coverId);
                      if (coverInCovers) {
                        coverInCovers.value = addOnSumInsured;
                      } else {
                        this.covers[productIndex][index].push({
                          coverId: coverId,
                          value: addOnSumInsured,
                          coverName: coverName
                        });
                      }
                    }
                  });
                }
              }
            });
          });
        }
      }

      console.log(this.covers);

    }
    if (addOnCoverControl?.value == true) {
      const addOnCover = control.subControls.find((subControl: any) => subControl.name === 'addOnCover');
      this.ProductList[productIndex].selectedAddon.push(addOnCover.label);
      if (!this.recalculatedAddOnList[productIndex]) {
        this.recalculatedAddOnList[productIndex] = [];
      }
      if (this.recalculatedAddOnList[productIndex] && ((this.recalculatedAddOnList[productIndex].length > 0 && !this.recalculatedAddOnList[productIndex].some(addOn => addOn.coverId === addOnIdControl?.value)) || this.recalculatedAddOnList[productIndex].length == 0)) {
        this.recalculatedAddOnList[productIndex].push({
          coverId: addOnIdControl?.value,
          coverName: addOnCoverNameControl?.value
        });
      }
      // this.recalculatePremiumAmount(productIndex);
      this.ProductList[productIndex].hasDefaultAddOn = true;
    }
  }



  checkForAgeValidations(control: any, productIndex: any) {
    const addOnControl = this.dynamicFormArray.at(productIndex).get(control.name);
    const addOnCoverControl = addOnControl?.get('addOnCover');
    const addOnDetailsControl = addOnControl?.get('addOnDetails');

    // Initialize maxAge and minAge
    let maxAge: number | null = null;
    let minAge: number | null = null;

    // Retrieve ageValidationRule
    const ageValidationRule = control.validationRules?.find((rule: any) => rule.type === 'ageValidation');
    if (ageValidationRule) {
      // Handle maxAge
      if (typeof ageValidationRule.maxAge === 'number') {
        maxAge = ageValidationRule.maxAge;
      } else {
        console.warn('Invalid maxAge format:', ageValidationRule.maxAge);
      }

      // Handle minAge
      if (typeof ageValidationRule.minAge === 'number') {
        minAge = ageValidationRule.minAge;
      } else if (typeof ageValidationRule.minAge === 'string' && ageValidationRule.minAge.includes('days')) {
        const days = parseInt(ageValidationRule.minAge.replace('days', '').trim(), 10);
        minAge = days / 365; // Convert days to approximate years
      } else {
        console.warn('Invalid minAge format:', ageValidationRule.minAge);
      }
    }


    // Ensure maxAge and minAge are defined
    if (maxAge !== null && minAge !== null) {
      this.formData.insuredMemberDetails.forEach((member: any) => {
        console.log(member);

        let memberAge: number | null = null;
        if (typeof member.memberAge === 'string') {
          if (member.memberAge.includes('days')) {
            const days = parseInt(member.memberAge.replace('days', '').trim(), 10);
            memberAge = days / 365; // Convert days to approximate years
          }
          else {
            memberAge = parseInt(member.memberAge);
          }
        } else if (typeof member.memberAge === 'number') {
          memberAge = member.memberAge;
        }

        console.log(memberAge, maxAge, minAge);


        if (memberAge != null) {
          Object.keys(addOnDetailsControl?.value || {}).forEach((key: any) => {
            // Use explicit non-null assertion for maxAge and minAge
            if (member.relation === key && (memberAge! > maxAge! || memberAge! < minAge!)) {
              // const memberArray = addOnDetailsControl?.get(key) as FormArray;

              // memberArray.controls.forEach((formGroup: AbstractControl) => {
              //   if (formGroup instanceof FormGroup) {
              //     Object.keys(formGroup.controls).forEach((controlName) => {
              //       formGroup.get(controlName)?.disable();
              //     });
              //   }
              // });

              const parentFormGroup = addOnDetailsControl as FormGroup; // Ensure it's a FormGroup

              if (parentFormGroup?.get(key) instanceof FormArray) {
                parentFormGroup.removeControl(key); // Removes the entire FormArray
                console.log(`FormArray '${key}' removed from the FormGroup.`);
              }

              control.subControls.forEach((subControl: any) => {
                if (subControl.innerSubControls) {
                  let innerIndex = subControl.innerSubControls.findIndex((member: any) => member.name === key);

                  // If found, remove from the array
                  if (innerIndex !== -1) {
                    subControl.innerSubControls.splice(innerIndex, 1);
                  }

                }


              })

            }
          });
        }


      });
    } else {
      console.warn('MaxAge or MinAge not defined in validation rules.');
    }
  }



  memberSumInsuredValidationMethod(memberSumInsuredValidationRule: any, control: any) {
    console.log('Member Sum Insured Validation Rule Found:', memberSumInsuredValidationRule);
    console.log(this.form);


    control.subControls.forEach((subControl: any) => {
      if (subControl.name == 'addOnDetails') {
        subControl.innerSubControls.forEach((innerSubControl: any) => {
          if (innerSubControl.name.includes('Son') || innerSubControl.name.includes('Daughter')) {
            const memberRules = memberSumInsuredValidationRule.kids;
            let maxSumInsured = memberRules.maxSumInsured;
            let minSumInsured = memberRules.minSumInsured;
            const matchingMember = this.formData.insuredMemberDetails.find(
              (insuredMember: any) => innerSubControl.name === insuredMember.relation
            );
            if (memberRules.ageBasedRules) {
              if (parseInt(matchingMember.memberAge) < memberRules.ageBasedRules.ageThreshold) {
                maxSumInsured = memberRules.ageBasedRules.maxSumInsured;
                minSumInsured = memberRules.ageBasedRules.minSumInsured;
              }
            }

            innerSubControl.coreControls.forEach((coreControl: any) => {
              if (coreControl.name == 'addOnSumInsured') {
                coreControl.options = coreControl.options.filter((option: any) =>
                  option.value >= minSumInsured && option.value <= maxSumInsured
                );
              }
            })
          }
          else if (innerSubControl.name != 'demoType' && innerSubControl.name != 'doneButton') {
            console.log(memberSumInsuredValidationRule, innerSubControl);

            const memberRules = memberSumInsuredValidationRule.adults;
            console.log(memberRules);
            let maxSumInsured = memberRules.maxSumInsured;
            let minSumInsured = memberRules.minSumInsured;
            const matchingMember = this.formData.insuredMemberDetails.find(
              (insuredMember: any) => innerSubControl.name === insuredMember.relation
            );


            if (memberRules.proposerSIRule) {
              if (matchingMember.relation === 'Self') {

                if (matchingMember.relation === memberRules.proposerSIRule.memberName) {
                  maxSumInsured = memberRules.proposerSIRule.maxSumInsured;
                  minSumInsured = memberRules.proposerSIRule.minSumInsured;
                }

                console.log(matchingMember.relation)
                innerSubControl.coreControls.forEach((coreControl: any) => {
                  console.log(coreControl);
                  if (coreControl.name == 'addOnSumInsured') {
                    coreControl.options = coreControl.options.filter((option: any) => {
                      return option.value >= minSumInsured && option.value <= maxSumInsured;
                    });
                    console.log(coreControl.options)
                  }
                });
              } else {
                innerSubControl.coreControls.forEach((coreControl: any) => {
                  if (coreControl.name == 'addOnSumInsured') {
                    coreControl.options = coreControl.options.filter((option: any) =>
                      option.value >= minSumInsured && option.value <= maxSumInsured
                    );
                    console.log(coreControl.options)
                  }
                });
              }
            }

            if (memberRules.ageBasedRules) {
              if (parseInt(matchingMember.memberAge) < memberRules.ageBasedRules.ageThreshold) {
                maxSumInsured = memberRules.ageBasedRules.maxSumInsured;
                minSumInsured = memberRules.ageBasedRules.minSumInsured;
              }
            }

            innerSubControl.coreControls.forEach((coreControl: any) => {
              if (coreControl.name == 'addOnSumInsured') {
                coreControl.options = coreControl.options.filter((option: any) =>
                  option.value >= minSumInsured && option.value <= maxSumInsured
                );
              }
            })
            console.log(innerSubControl.coreControls);

          }
        })
      }
    })


    // Proceed with applying the validation rules
    // Additional logic to be added based on further instructions
  }

  setForAllOtherMember(event: any, coreControl: any, subControl: any, parentControl: any, productIndex: any) {
    console.log(event.target.value, coreControl, subControl, parentControl);
    const addOnControlGroup = this.dynamicFormArray.at(productIndex).get(parentControl.name);
    console.log(addOnControlGroup, this.formData.memberPolicyType)
    if (addOnControlGroup && this.formData.memberPolicyType === 'Family Floater') {
      const addOnDetailsControl = addOnControlGroup.get(subControl.name);
      Object.keys(addOnDetailsControl?.getRawValue()).forEach((Key: any, index: number) => {
        console.log(Key, index);
        if (index != 0) {
          const memberArray = addOnDetailsControl?.get(Key) as FormArray;
          console.log(memberArray);

          memberArray.controls.forEach((member: any) => {
            console.log(member);

            const addOnSumInsuredControl = member.get('addOnSumInsured');


            if (addOnSumInsuredControl) {
              addOnSumInsuredControl.setValue(event.target.value);
            }
            const memberRoomTypeControl = member.get('roomType');
            if (memberRoomTypeControl) {
              memberRoomTypeControl.setValue(event.target.value);
            }
          })

        }

      })
    }
  }


  // alterSumInsuredOptions(event: any, innerControl: any = null, control: any, parentControl: any = null, index: any = null, indexj: any = null, memberControl: any = null) {
  //   console.log("Inside alter", event, innerControl, control, parentControl, index, indexj, memberControl);
  //   console.log(this.dynamicFormGroup.get(parentControl.name), this.form);
  //   if (!memberControl.name.includes('Son') && !memberControl.name.includes('Daughter')) {
  //     if (innerControl.name == 'occupation') {
  //       const memberOccupation = (this.dynamicFormGroup.get(parentControl.name)?.get(control.name)?.get(memberControl.name) as FormArray).controls[indexj].get(innerControl.name)?.value;
  //       console.log(memberOccupation);
  //       if (JSON.parse(memberOccupation).name.toLowerCase().includes('house') || JSON.parse(memberOccupation).name == 'Retired') {
  //         memberControl.coreControls.forEach((coreControl: any) => {
  //           if (coreControl.name == 'occupationRisk') {
  //             const matchingOption = coreControl.options.find((option: any) =>
  //               option.name.toLowerCase() === JSON.parse(memberOccupation).name.toLowerCase()
  //             );

  //             if (matchingOption) {
  //               console.log('Found matching option:', matchingOption);
  //               const riskValue = JSON.stringify(matchingOption);
  //               console.log(riskValue);

  //               // You can now set the selected option or take further actions here
  //               const occupationRiskControl = (this.dynamicFormGroup.get(parentControl.name)
  //                 ?.get(control.name)?.get(memberControl.name) as FormArray).controls[indexj + 1].get('occupationRisk');

  //               console.log(occupationRiskControl);

  //               if (occupationRiskControl && riskValue) {
  //                 // Only proceed if the control exists
  //                 occupationRiskControl.setValue(riskValue);
  //               } else {
  //                 console.log('occupationRisk control does not exist!');
  //               }
  //             }
  //           }

  //           if (coreControl.name == 'addOnSumInsured') {
  //             // this.form.formSections.forEach((section: any) => {
  //             //   if (section.sectionTitle == "Optional Covers") {
  //             //     section.formControls.forEach((control: any) => {
  //             //       if (control.name == 'accident') {
  //             //         control.subControls.forEach((subControl: any) => {
  //             //           if (subControl.name == 'addOnDetails') {
  //             //           }
  //             //         })
  //             //       }
  //             //     })
  //             //   }
  //             // })
  //             coreControl.options = [];
  //             coreControl.options.push(
  //               {
  //                 "name": "3000000",
  //                 "label": "3000000",
  //                 "value": 3000000
  //               }
  //             )
  //           }
  //         })
  //       }
  //       else {
  //         const memberSumInsuredValidationRule = parentControl.validationRules?.find((rule: any) => rule.type === 'memberLevelSumInsured');
  //         const memberRules = memberSumInsuredValidationRule.adults;
  //         console.log(memberRules);
  //         let maxSumInsured = memberRules.maxSumInsured;
  //         let minSumInsured = memberRules.minSumInsured;
  //         const matchingMember = this.formData.insuredMemberDetails.find(
  //           (insuredMember: any) => memberControl.name === insuredMember.relation
  //         );
  //         if (memberRules.ageBasedRules) {
  //           if (parseInt(matchingMember.memberAge) < memberRules.ageBasedRules.ageThreshold) {
  //             maxSumInsured = memberRules.ageBasedRules.maxSumInsured;
  //             minSumInsured = memberRules.ageBasedRules.minSumInsured;
  //           }
  //         }

  //         memberControl.coreControls.forEach((coreControl: any) => {
  //           if (coreControl.name == 'addOnSumInsured') {
  //             coreControl.options = control.innerSubControls[0].coreControls[3].options.filter((option: any) =>
  //               option.value >= minSumInsured && option.value <= maxSumInsured
  //             );
  //           }
  //         })
  //         // memberControl.coreControls.forEach((coreControl: any) => {
  //         //   if (coreControl.name == 'addOnSumInsured') {
  //         //     coreControl.options = control.innerSubControls[0].coreControls[3].options;
  //         //   }
  //         // })
  //       }

  //     }
  //   }

  // }

  //updated default addOn for portability
  setPortabilityValidationRule(portabilityValidationRule: any, control: any, productIndex: any) {
    const addOnControl = this.dynamicFormArray.at(productIndex).get(control.name);
    const addOnDetailsControl = addOnControl?.get('addOnDetails');

    control.subControls.forEach((subControl: any) => {
      if (subControl.name === 'addOnDetails') {
        subControl.innerSubControls.forEach((innerSubControl: any) => {
          if (innerSubControl.name !== 'demoType' && innerSubControl.name !== 'doneButton') {

            const matchingMember = this.formData.insuredMemberDetails.find(
              (insuredMember: any) => innerSubControl.name === insuredMember.relation
            );

            let minSumInsured = portabilityValidationRule.minSumInsured;
            let maxSumInsured = portabilityValidationRule.maxSumInsured;

            // Determine applicable policy rules
            const policyRule = portabilityValidationRule.policyRules.find(
              (rule: any) => rule.policyType === this.formData.memberPolicyType
            );

            if (policyRule && policyRule.ageBasedRules) {
              const minAgeThreshold = policyRule.ageBasedRules.minAgeThreshold;
              const maxAgeThreshold = policyRule.ageBasedRules.maxAgeThreshold;

              if (parseInt(matchingMember.memberAge) < minAgeThreshold) {
                // Below min age threshold handling
                const belowThresholdRules = policyRule.ageBasedRules.belowMinThreshold;
                if (belowThresholdRules) {
                  minSumInsured = belowThresholdRules.minSumInsured || minSumInsured;
                  maxSumInsured = belowThresholdRules.maxSumInsured || maxSumInsured;

                  this.toggleControlState(addOnDetailsControl, matchingMember, belowThresholdRules.disabled);
                }
              } else if (parseInt(matchingMember.memberAge) > maxAgeThreshold) {
                // Above max age threshold handling
                const aboveThresholdRules = policyRule.ageBasedRules.aboveMaxThreshold;
                if (aboveThresholdRules) {
                  this.toggleControlState(addOnDetailsControl, matchingMember, aboveThresholdRules.disabled);
                }
              }
            }

            // Update addOnSumInsured options based on min/max sum insured
            innerSubControl.coreControls.forEach((coreControl: any) => {
              if (coreControl.name === 'addOnSumInsured') {
                coreControl.options = coreControl.options.filter((option: any) =>
                  option.value >= minSumInsured && option.value <= maxSumInsured
                );
              }
            });
          }
        });
      }
    });

  }

  private toggleControlState(addOnDetailsControl: any, matchingMember: any, disable: boolean) {
    Object.keys(addOnDetailsControl?.value || {}).forEach((key: any) => {
      if (matchingMember.relation === key) {
        const memberArray = addOnDetailsControl?.get(key) as FormArray;
        memberArray.controls.forEach((formGroup: AbstractControl) => {
          if (formGroup instanceof FormGroup) {
            Object.keys(formGroup.controls).forEach((controlName) => {
              if (disable) {
                formGroup.get(controlName)?.disable();
              } else {
                formGroup.get(controlName)?.enable();
              }
            });
          }
        });
      }
    });
  }

  onInputChange(event: any, control: any, parentControl: any = null, index: any = null, subControl: any = null, innerControl: any = null, indexj: any = null, productIndex: any = null) {
    console.log(event, control, parentControl, index, innerControl, productIndex);

    if (parentControl && parentControl.name === 'multiCover' && innerControl && innerControl.name === 'multiplyRiderDOB') {
      const dob = event.target.value;
      
      const dobArray = dob.split('-'); // [YYYY, MM, DD]
      const formattedDOB = `${dobArray[2]}/${dobArray[1]}/${dobArray[0]}`; // Convert to dd/MM/yyyy
    
      const year = parseInt(dobArray[0]);
      if (year.toString().length === 4) {
        console.log("Changed multi player dob", event.target.value);
    
        const formControl = (((this.dynamicFormArray.at(productIndex).get(parentControl.name) as FormGroup)
          .get(control.name) as FormGroup)
          .get(subControl.name) as FormArray).controls[indexj].get(innerControl.name);
    
          const matchingMember = this.formData.insuredMemberDetails[index];
          console.log(matchingMember,index);
          
        if (formControl) {
          const today = new Date();
          const birthDate = new Date(dob);
          let age = today.getFullYear() - birthDate.getFullYear();
    
          // Adjust age if birthday hasn't occurred yet this year
          if (
            today.getMonth() < birthDate.getMonth() ||
            (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())
          ) {
            age--;
          }
    
          console.log("Calculated Age:", age);
    
          // Remove existing validators
          formControl.clearValidators();
    
          // If age is less than 18, add custom validator
          if (age < 18) {
            // innerControl.validators = [];
            // innerControl.validators.push({
            //   "message": "Age should be above 18.",
            //   "validatorName": "ageInvalid",
            // })
            formControl.setErrors({ ageInvalid: true });
            console.log(formControl);
          }
          else if(parseInt(matchingMember.memberAge) != age){
            // innerControl.validators = [];
            // innerControl.validators.push({
            //   "message": "Member age mismatches.",
            //   "validatorName": "memberAgeMismatch",
            // })
            formControl.setErrors({ memberAgeMismatch: true });
            console.log(formControl);
          }
           else {
            formControl.setErrors(null); // Remove validation error if age is valid
          }
    
          // formControl.updateValueAndValidity(); // Update validation
        }
        console.log(formControl);
      }
      
    }

    if (innerControl != null && innerControl.onChangeMethod) {
      if (innerControl.onChangeMethod == 'getNatureOfWorkByOccupation') {
        this.resolveMethod(innerControl.onChangeMethod, event, subControl);
      } else if (innerControl.onChangeMethod == 'getSumInsured') {
        this.resolveMethod(innerControl.onChangeMethod, parentControl, control, subControl, innerControl, index, event)
      }
      else {
        this.resolveMethod(innerControl.onChangeMethod, event, innerControl, control, parentControl, productIndex);
      }
    }

    if ((parentControl !== null && parentControl.type == 'combinedCheckbox')) {
      if (control.type === 'select') {
        this.callMethod(parentControl.methodName, control)
      }
      else {
        if (innerControl != null && innerControl.dependentControls) {
          const checkboxChecked = typeof event == 'boolean' ? event : event.target.checked;
          console.log(checkboxChecked, typeof event);

          console.log(innerControl, checkboxChecked, control.name, parentControl.name, index, innerControl.name);

          this.changeMainFormDependentControls(innerControl.dependentControls, checkboxChecked, control, parentControl, index, innerControl, productIndex);
        }
        this.changeOverLayDone(control, parentControl, false);
      }
    }
  }

  changeMainFormDependentControls(
    dependentControlNames: (string | { name: string; visibility: boolean })[],
    visibility: boolean,
    control: any | null = null,
    parentControl: any | null = null,
    controlIndex: number | null = null,
    innerControl: any = null,
    productIndex: any = null
  ) {

    console.log(dependentControlNames, visibility, control, parentControl, controlIndex, innerControl, this.dynamicFormArray);


    if (dependentControlNames) {
      dependentControlNames.forEach((dependent) => {
        // Extract control name and visibility from either string or object
        const dependentName = typeof dependent === 'string' ? dependent : dependent.name;
        const dependentVisibility = typeof dependent === 'string' ? visibility : dependent.visibility;

        if (control && controlIndex != null) {
          if (control.innerSubControls) {
            control.innerSubControls[controlIndex].coreControls.forEach((innerControl: any, zindex: any) => {
              if (innerControl.name == dependentName) {
                innerControl.visible = visibility;
                console.log(this.dynamicFormArray.at(productIndex));

                let dparentControl = this.dynamicFormArray.at(productIndex).get(parentControl.name) as FormGroup;
                let dcontrol = dparentControl.get(control.name) as FormGroup;
                let dsubControl = dcontrol.get(control.innerSubControls[controlIndex].name) as FormArray;
                let dindexj = dsubControl.at(zindex) as FormGroup;
                let dinnercontrol = dindexj.get(innerControl.name) as FormGroup;
                if (innerControl.visible == false && innerControl.dependentControls && innerControl.dependentControls.length > 0) {
                  if (dinnercontrol instanceof FormControl) {
                    dinnercontrol.setValue(false);
                  }
                  innerControl.dependentControls.forEach((dependentName: string) => {
                    // Find the dependent control in coreControls
                    const dependentControlIndex = control.innerSubControls[controlIndex].coreControls.findIndex(
                      (control: any) => control.name === dependentName
                    );
                    let dependentControl = control.innerSubControls[controlIndex].coreControls[dependentControlIndex];

                    if (dependentControl) {
                      dependentControl.visible = visibility;
                      dindexj = dsubControl.at(dependentControlIndex) as FormGroup;
                      dinnercontrol = dindexj.get(dependentControl.name) as FormGroup;
                      Object.keys(dinnercontrol.controls).forEach((element: any) => {
                        dinnercontrol.removeControl(element);
                      });
                    }
                    // else {
                    //   console.log('Dependent Control not found for:', dependentName);
                    // }
                  });
                }
                if (innerControl.innerControls && innerControl.visible == true) {
                  this.initializeSubControls(innerControl.innerControls, dinnercontrol)
                }
                else if (innerControl.innerControls && innerControl.visible == false) {
                  Object.keys(dinnercontrol.controls).forEach((element: any) => {
                    dinnercontrol.removeControl(element);
                  });
                }
              }
            })
          }
          // else if (subControl.innerArrayControl) {
          //   subControl.innerArrayControl[controlIndex].forEach((innerControl: any, zindex: any) => {
          //     if (innerControl.name == dependentName) {
          //       innerControl.visible = visibility;
          //       let dparentControl = this.dynamicFormGroup.get(control.name) as FormGroup;
          //       let dcontrol = dparentControl.get(subControl.name) as FormArray;
          //       // let dsubControl = dcontrol.get(subControl.innerArrayControl[controlIndex].name) as FormArray;
          //       let dindexj = dcontrol.at(controlIndex) as FormGroup;
          //       let dinnercontrol = dindexj.get(innerControl.name) as FormGroup;
          //       if (innerControl.visible == false && innerControl.dependentControls && innerControl.dependentControls.length > 0) {
          //         if (dinnercontrol instanceof FormControl) {
          //           dinnercontrol.setValue(false);
          //         }
          //         innerControl.dependentControls.forEach((dependentName: string) => {
          //           // Find the dependent control in coreControls
          //           const dependentControlIndex = subControl.innerArrayControl[controlIndex].coreControls.findIndex(
          //             (control: any) => control.name === dependentName
          //           );
          //           let dependentControl = subControl.innerArrayControl[controlIndex].coreControls[dependentControlIndex];

          //           if (dependentControl) {
          //             dependentControl.visible = visibility;
          //             dindexj = dcontrol.at(controlIndex) as FormGroup;
          //             dinnercontrol = dindexj.get(dependentControl.name) as FormGroup;
          //             Object.keys(dinnercontrol.controls).forEach((element: any) => {
          //               dinnercontrol.removeControl(element);
          //             });
          //           }
          //           else {
          //             console.log('Dependent Control not found for:', dependentName);
          //           }
          //         });
          //       }
          //       if (innerControl.innerControls && innerControl.visible == true) {
          //         this.initializeSubControls(innerControl.innerControls, dinnercontrol)
          //       }
          //       else if (innerControl.innerControls && innerControl.visible == false) {
          //         Object.keys(dinnercontrol.controls).forEach((element: any) => {
          //           dinnercontrol.removeControl(element);
          //         });
          //       }
          //     }
          //   })
          // }
        }

      });
    }
  }

  disableForAllOtherMembers(control: any, productIndex: any) {
    console.log(control, productIndex);

    const addOnControlGroup = this.dynamicFormArray.at(productIndex).get(control.name);
    if (addOnControlGroup && this.formData.memberPolicyType == 'Family Floater') {
      const addOnDetailsControl = addOnControlGroup.get('addOnDetails');
      console.log(addOnDetailsControl);
      Object.keys(addOnDetailsControl?.value).forEach((Key: any, index: number) => {
        console.log(Key, index);
        if (index != 0) {
          const memberArray = addOnDetailsControl?.get(Key) as FormArray;
          console.log(memberArray);

          memberArray.controls.forEach((member: any) => {
            console.log(member);

            const memberControlCheckbox = member.get('memberCheckbox');
            const memberAddOnSumInsuredControl = member.get('addOnSumInsured');
            const memberRoomTypeControl = member.get('roomType');
            console.log(memberControlCheckbox);

            if (memberControlCheckbox) {
              memberControlCheckbox.disable();
            }

            if (memberAddOnSumInsuredControl) {
              memberAddOnSumInsuredControl.disable();
            }

            if (memberRoomTypeControl) {
              memberRoomTypeControl.disable();
            }
          })

        }
      })
    } else if (this.formData.productName == 'Active Secure' && addOnControlGroup && this.formData.memberPolicyType === 'Multi Individual') {
      const addOnDetailsControl = addOnControlGroup.get('addOnDetails');
      console.log(addOnDetailsControl);
      Object.keys(addOnDetailsControl?.value).forEach((Key: any, index: number) => {
        console.log(Key, index);
        if (index != 0) {
          const memberArray = addOnDetailsControl?.get(Key) as FormArray;
          console.log(memberArray);

          memberArray.controls.forEach((member: any) => {
            console.log(member);

            const memberControlCheckbox = member.get('memberCheckbox');
            console.log(memberControlCheckbox);

            if (memberControlCheckbox) {
              memberControlCheckbox.disable();
            }
          })

        }
      })
    }
  }
  selectForAllMembers(event: any, coreControl: any, subControl: any, parentControl: any, productIndex: any) {
    console.log(event.target.checked, coreControl, subControl, parentControl, productIndex);
    const addOnControlGroup = this.dynamicFormArray.at(productIndex).get(parentControl.name);
    console.log(addOnControlGroup, this.formData.memberPolicyType)
    if (addOnControlGroup && this.formData.memberPolicyType === 'Family Floater') {
      const addOnDetailsControl = addOnControlGroup.get(subControl.name);
      Object.keys(addOnDetailsControl?.getRawValue()).forEach((Key: any, index: number) => {
        console.log(Key, index);
        if (index != 0) {
          const memberArray = addOnDetailsControl?.get(Key) as FormArray;
          console.log(memberArray);

          memberArray.controls.forEach((member: any) => {
            console.log(member);

            const memberControlCheckbox = member.get('memberCheckbox');
            console.log(memberControlCheckbox);

            if (memberControlCheckbox) {
              memberControlCheckbox.setValue(event.target.checked);
            }
            const memberRoomTypeControl = member.get('roomType');
            if (memberRoomTypeControl) {
              if (event.target.checked) {
                if (memberRoomTypeControl.value === "") {
                  const firstOption = subControl.innerSubControls[0].coreControls.find(
                    (control: any) => control.name === 'roomType'
                  )?.options?.[0];

                  if (firstOption) {
                    memberRoomTypeControl.setValue(firstOption.value);
                  }
                }
              } else {
                memberRoomTypeControl.setValue("");
              }
            }
          })

        }

      })
    }
    else if (this.formData.productName == 'Active Secure' && addOnControlGroup && this.formData.memberPolicyType === 'Multi Individual') {
      const addOnDetailsControl = addOnControlGroup.get(subControl.name);
      if (parentControl.name == 'medicalExpenses') {
        Object.keys(addOnDetailsControl?.getRawValue()).forEach((Key: any, index: number) => {
          if (index != 0) {
            const memberArray = addOnDetailsControl?.get(Key) as FormArray;
            memberArray.controls.forEach((member: any) => {
              const memberControlCheckbox = member.get('memberCheckbox');
              console.log("membercontrol checkbox", memberControlCheckbox, memberControlCheckbox.status);
              //MEMBER CHECKBOX STATUS(VALID,DISABLED)
              if (memberControlCheckbox && memberControlCheckbox.status != 'DISABLED') {
                memberControlCheckbox.setValue(event.target.checked);
              }
            })
          }

        })
      } else {
        Object.keys(addOnDetailsControl?.getRawValue()).forEach((Key: any, index: number) => {
          if (index != 0) {
            const memberArray = addOnDetailsControl?.get(Key) as FormArray;
            memberArray.controls.forEach((member: any) => {
              const memberControlCheckbox = member.get('memberCheckbox');
              if (memberControlCheckbox) {
                memberControlCheckbox.setValue(event.target.checked);
              }
            })
          }

        })
      }
    }
  }

  getValidationErrors(control: IFormControl | IDynamicControl | ISubControl, parentControl: IFormControl | ISubControl | null = null, index: number | null = null,
    subControl: any | null = null,
    innerControl: any | null = null,
    innerSubControl: any | null = null,
    innerSubControlIndex: any | null = null,
    productIndex: number | null = null
  ): string {
    let myFormControl: any;
     if (subControl != null && parentControl != null && index == null && productIndex!=null) {
      if(innerSubControlIndex!=null){
        const parentArray = this.dynamicFormArray.at(productIndex).get(control.name) as FormGroup;
        const parentArray1 = parentArray.get(parentControl.name) as FormGroup;
        const parentArray2 = parentArray1.get(subControl.name) as FormArray;
        myFormControl =  parentArray2.controls[innerSubControlIndex].get(innerControl.name)
      }
      else
      myFormControl = ((this.dynamicFormArray.at(productIndex).get(subControl.name) as FormGroup)?.controls[parentControl.name] as FormGroup).get(control.name);
    }
    let errorMessage = ''
    if (innerControl != null && parentControl != null && index != null && subControl == null) {
      if (innerControl.innerControls) {
        innerControl.innerControls.forEach((element: any) => {
          element.validators?.forEach((val: any) => {
            if (myFormControl?.hasError(val.validatorName as string)) {
              errorMessage = val.message as string
            }
          })
        });
      }
      else {
        innerControl.validators?.forEach((val: any) => {
          if (myFormControl?.hasError(val.validatorName as string)) {
            errorMessage = val.message as string
          }
        })
      }
    }
    else if(index == null && innerSubControlIndex!=null){
      innerControl.validators?.forEach((val: any) => {
        if (myFormControl?.hasError(val.validatorName as string)) {
          errorMessage = val.message as string
        }
      })
    }
    return errorMessage;
  }

  checkValidations(
    control: IFormControl | IDynamicControl,
    parentControl: IFormControl | IDynamicControl | ISubControl | null = null,
    index: number | null = null, subControl: any | null = null,
    innerControl: any | null = null,
    innerSubControl: any | null = null,
    innerSubControlIndex: number | null = null,
    productIndex: number | null = null
  ): boolean {
    let myControl: AbstractControl | null | undefined;
    
     if (subControl != null && parentControl != null && index == null && productIndex!=null) {
      const parentArray = this.dynamicFormArray.at(productIndex).get(control.name) as FormGroup;
      // const parentArray1 = parentArray.controls[parentControl.name] as FormGroup;

      const parentArray1 = parentArray.get(parentControl.name) as FormGroup;

      if(innerSubControlIndex!=null){
        const parentArray2 = parentArray1.get(subControl.name) as FormArray;
        myControl =  parentArray2.controls[innerSubControlIndex].get(innerControl.name)
      }
      else{
      myControl = parentArray1.get(subControl.name);
      }
      
    }

    if (myControl instanceof FormControl) {
      
      return myControl.invalid && myControl.touched;
    } else if (myControl instanceof FormGroup) {
      return myControl.invalid && !myControl.pristine;
    }

    return false;
  }

  restrictNumberLength(event: Event, maxLength: number,control:any=null,parentControl:any=null,subControl:any=null,innerControl:any=null,innerControlIndex:any=null,productIndex:any=null): void {
    const inputElement = event.target as HTMLInputElement;

    console.log(inputElement.name);
    
    // Convert input value to a string and truncate if it exceeds maxLength
    if (inputElement.value.length > maxLength) {
      inputElement.value = inputElement.value.slice(0, maxLength);
    }
    
    if(control!=null && parentControl!=null && subControl!=null && innerControl!=null && innerControlIndex!=null){
      const parentArray = this.dynamicFormArray.at(productIndex)?.get(parentControl.name) as FormGroup;
        const parentArray1 = parentArray.get(control.name) as FormGroup;
        const parentArray2 = parentArray1.get(subControl.name) as FormArray;
       const myFormControl =  parentArray2.controls[innerControlIndex].get(innerControl.name);

       myFormControl?.setValue(inputElement.value);
    }
    else{

      // Update the form control's value to match the truncated value
      const formControl = this.dynamicFormArray.at(productIndex)?.get(inputElement.name);
      if (formControl) {
        formControl.setValue(inputElement.value);
      }
    }
  }

}