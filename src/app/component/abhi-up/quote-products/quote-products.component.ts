import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { firstValueFrom } from 'rxjs';
import { CommonService } from 'src/app/services/common.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-quote-products',
  templateUrl: './quote-products.component.html',
  styleUrls: ['./quote-products.component.scss']
})
export class QuoteProductsComponent  implements OnInit {

  stylesList: any[] = [];
  private formData: any = {}
  private allJsonFormData: any[] = []

  proposalNum: any;
  formSequence: any[] = [];

  selectedToggle: string = '';
  style: any;
  verticalCode = localStorage.getItem('verticalCode');
  code = localStorage.getItem('code');
  products: any[] = []
  ProductList: any[] = []
  agentCode=localStorage.getItem('agentCode')
  partnerId:any
  productId:any

  plans = [
    { price: 6863, duration: 1, discount: 0 },
    { price: 12863, duration: 2, discount: 0 },
    { price: 22863, duration: 3, discount: 15 }
  ];
  selectedPlan: number | null = null;


  private dynamicStyle!: HTMLLinkElement;

  displayNoProductsMessage: boolean = false;

  showSpecialForm: boolean = false;


  constructor(private renderer: Renderer2, @Inject(DOCUMENT) private document: Document,
    private loginService: LoginService, private router: Router, private toast: NgToastService,
    private service: CommonService, private encryptionService: EncryptionService,public common:CommonService,) { }

  ngOnInit(): void {
    sessionStorage.clear()
    localStorage.setItem("formIndex", "0")
    console.log(this.agentCode);
    this.getProducts();
  }

  getPoductList(item: any) {
    this.selectedToggle = item.insuranceType
    const reqData={
      "agentCode": this.agentCode
    }
    this.loginService.Getproductlist(reqData).subscribe({
      next: (res) => {
        this.ProductList = res.data;
        console.log(this.ProductList)
        this.ProductList.forEach((item:any)=>{
          item.keyFeatures = JSON.parse(item.keyFeatures)
          console.log(typeof(item.keyFeatures));
          this.plans[1].discount = item.t2DiscPercentage;
          this.plans[2].discount = item.t3DiscPercentage;
        })
      },
      error: (err) => {
        console.error(err);
        if (err.status === 404) {
          this.displayNoProductsMessage = true;
        }
      }
    })
  }
  getProducts() {
    this.loginService.getAllProducts(this.verticalCode, this.code).subscribe({
      next: (res) => {
        this.products = res;
        console.log(this.products)
        if (this.products.length > 0) {
          this.getPoductList(this.products[0])
        }
      },
      error: (err) => {
        console.error(err);
      }
    })
  }

  async getProposalNum() {
    try {
      const res = await firstValueFrom(this.loginService.getProposalNumber());
      this.proposalNum = res;
    } catch (error) {
      console.error(error);
    }
  }

  buyNow(item:any){
    this.router.navigate(['portal/abhi/productDetails'], {
      state: { item: item }
    });
  }

  selectPlan(index: number): void {
    this.selectedPlan = index;
    console.log(this.selectedPlan);
  }

}
