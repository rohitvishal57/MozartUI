import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { firstValueFrom } from 'rxjs';
import { AdminService } from 'src/app/services/admin.service';
import { CommonService } from 'src/app/services/common.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-viewproducts',
  templateUrl: './viewproducts.component.html',
  styleUrls: ['./viewproducts.component.scss']
})
export class ViewproductsComponent implements OnInit {

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
  agentCode=localStorage.getItem('agentCode');
  partnerId:any
  productId:any



  private dynamicStyle!: HTMLLinkElement;

  displayNoProductsMessage: boolean = false;

  showSpecialForm: boolean = false;


  constructor(private renderer: Renderer2, @Inject(DOCUMENT) private document: Document,
    private loginService: LoginService, private router: Router, private toast: NgToastService,
    private adminService: AdminService, private encryptionService: EncryptionService,public common:CommonService,) { 
      
    }

  ngOnInit(): void {
    // sessionStorage.clear()
    if(sessionStorage.getItem("cardListProducts"))
      this.cartProductList = this.encryptionService.decrypt(sessionStorage.getItem("cardListProducts") as string);
    else
      this.cartProductList = [];
    localStorage.setItem("formIndex", "0")
    this.getPoductList();
  }

  getPoductList() {
    // this.selectedToggle = item.insuranceType
    const reqData={
      "agentCode": this.agentCode
    }
    this.common.Getproductlist(reqData).subscribe({
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
  getProducts() {
    this.adminService.getAllProducts(this.verticalCode, this.code).subscribe({
      next: (res) => {
        this.products = res;
        console.log(this.products)
        if (this.products.length > 0) {
          // this.getPoductList(this.products[0])
        }
      },
      error: (err) => {
        console.error(err);
      }
    })
  }

  async getProposalNum() {
    try {
      const res = await firstValueFrom(this.common.getProposalNumber());
      this.proposalNum = res;
    } catch (error) {
      console.error(error);
    }
  }

  addToCart(item: any){
    this.cartProductList.push(item);
    sessionStorage.setItem("cardListProducts",this.encryptionService.encrypt(this.cartProductList));
  }

  removeFromCart(item: any){
    this.cartProductList = this.cartProductList.filter((element: any) => element.productname !== item.productname);
    sessionStorage.setItem("cardListProducts",this.encryptionService.encrypt(this.cartProductList));
  }

  async buyNow(item: any) {
    this.formData = { ...this.formData, productName: item.productName }
    try {
      await this.getFormSequence(item);
      console.log(item)
      const productData = {
        partnerId : item.partnerId,
        productId : item.productId

      }
      console.log(productData)
      if (this.formSequence != null && this.formSequence.length > 0) {
        this.router.navigate(['portal/abhi/forms'], {
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

}
