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
  agentCode=4620973
  partnerId:any
  productId:any



  private dynamicStyle!: HTMLLinkElement;

  displayNoProductsMessage: boolean = false;

  showSpecialForm: boolean = false;


  constructor(private renderer: Renderer2, @Inject(DOCUMENT) private document: Document,
    private loginService: LoginService, private router: Router, private toast: NgToastService,
    private service: CommonService, private encryptionService: EncryptionService,public common:CommonService,) { }

  ngOnInit(): void {
    sessionStorage.clear()
    localStorage.setItem("formIndex", "0")
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

}
