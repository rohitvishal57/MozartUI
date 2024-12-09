import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { firstValueFrom } from 'rxjs';
import { CommonService } from 'src/app/services/common.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { QuoteService } from '../quote.service';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent {

  state: any
  productId: any
  partnerId: any;
  tab: any[] = []
  activeIndex: any = 0
  groupedFeatures: any[] = []
  healthAddOns : any[] =[]
  optionalCovers :any[]=[]
  formData: any;
  formSequence: any[] = [];
  displayInfo : string ='Health Add On';
  private allJsonFormData: any[] = []



  constructor(private quoteservices: QuoteService, private router: Router, private toast: NgToastService,
    private encryptionService: EncryptionService, private commonService: CommonService, private languageService: LanguageService,
    private translateService: TranslateService
  ) {

  }

  ngOnInit(): void {
    this.languageService.language$.subscribe(lang => {
      this.translateService.use(lang).subscribe({
        error: () => {
          this.translateService.use('en'); // Fallback to English if translation file is missing
        }
      });
    });
    this.productId = history.state.item.productId
    this.partnerId = history.state.item.partnerId;
    this.state = history.state.item
    console.log(this.productId, this.state);
    this.productdetails();
  }

  productdetails() {
    this.tab.push("Covers")
    let features: any
    const reqData = {
      "productId": this.productId,
      "agentCode": localStorage.getItem('agentCode')
    }
    console.log(reqData);
    this.quoteservices.Getproductdetailsandfeatures(reqData).subscribe({
      next: (res: any) => {
        console.log(res.data);
        this.state = res.data;
        this.state.keyFeatures = JSON.parse(this.state.keyFeatures);
        features = res.data.productFeatures
        this.groupedFeatures = features.reduce((result: any, { categoryName, featureName, featureDescription }: any) => {
          if (!result[categoryName]) {
            result[categoryName] = [];
          }
          result[categoryName].push({ featureName, featureDescription });
          return result;
        }, {});
        console.log(this.groupedFeatures);
      },
      error: (err) => {
        console.error(err);
      }
    })
  }

  onTabChange(event: any) {
    this.activeIndex = event.index;
    if (this.activeIndex == 0) {
     this.displayInfo = 'Health Add On';
    } else if (this.activeIndex == 1) {
      this.displayInfo = 'Optional Covers';
    }
  }


  async buyNow(item: any) {
    this.formData = { ...this.formData, productName: item.productName }
    try {
      await this.getFormSequence(item);
      console.log(item)
      const productData = {
        partnerId: item.partnerId,
        productId: item.productId,
        proposalNum: ' '
      }
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
  async getFormSequence(item: any) {
    console.log(item);
    try {
      sessionStorage.clear();
      const reqData = {
        "partnerId": item.partnerId,
        "productId": item.productId

      }
      console.log(reqData);
      const res = await firstValueFrom(this.commonService.Getformsequence(reqData));
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
  
}
