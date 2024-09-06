import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { firstValueFrom } from 'rxjs';
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

  selectedToggle: string = '';
  style: any;
  verticalCode = localStorage.getItem('verticalCode');
  code = localStorage.getItem('code');
  products: any[] = []
  ProductList: any[] = []

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
    this.loginService.getAllProductList(item.verticalcode, item.agencycode, item.insurancetypecode).subscribe({
      next: (res) => {
        this.ProductList = res;
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
  async insurenow(item: any) {
    this.formData = { ...this.formData, productName: item.productName }
    try {
      await this.getFormSequence(item);
      await this.getProposalNum();
      console.log(item)
      const productData = {
        productid: item.productid,
        productStartDate: item.productstartdate,
        productEndDate: item.productenddate,
        productName: item.productname,
        insurancetypecode: item.insurancetypecode,
        proposalNumber: this.proposalNum,
        agencyCode:item.agencycode
      };
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
      const res = await firstValueFrom(this.service.getFormConfigViaVerticalCode(item.verticalcode, item.agencycode, item.insurancetypecode, item.productid));
      console.log(res);
      this.formSequence = JSON.parse(res.insureFormConfiguration);
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

}
