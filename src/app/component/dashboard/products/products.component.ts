import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { CommonService } from 'src/app/services/common.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { DOCUMENT } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  // styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  stylesList:any[]=[];
  private formData:any={}
  private allJsonFormData:any[]=[]
  private allQuoteJsonFormData:any[]=[]

  proposalNum:any
  formSequence:any[] = []; 
  quoteFormSequence:any[] = [];

  selectedToggle:string='';
  style :any;
  bankCode = localStorage.getItem('bankCode');
  userName = localStorage.getItem('username')?.toUpperCase();
  verticalCode=localStorage.getItem('verticalCode');
  code=localStorage.getItem('code');
  products: any[] = []
  ProductList : any[]=[]

  private dynamicStyle! : HTMLLinkElement;

  displayNoProductsMessage: boolean = false;

  finelcss:boolean=false;
  
  constructor(private renderer: Renderer2,  @Inject(DOCUMENT) private document: Document,
    private loginService:LoginService,private router: Router,private toast:NgToastService,
    private service:CommonService,private encryptionService:EncryptionService,private spinner:NgxSpinnerService)
  {}

  ngOnInit(): void {
    this.spinner.show();
    this.stylesList=[{bankCode:'1001',style:'yesbank-product.css'},{bankCode:'1002',style:'axisbank-product.css'},{bankCode:'1003',style:'icicibank-product.css'},{bankCode:'1004',style:'hdfcbank-product.css'},{bankCode:'1005',style:'kotakbank-product.css'},{bankCode:'1006',style:'indusindbank-product.css'},{bankCode:'1007',style:'rblbank-product.css'},{bankCode:'1008',style:'idfcfirstbank-product.css'},{bankCode:'1009',style:'dbsbank-product.css'}];
    localStorage.setItem("formIndex","0")
    this.style=this.stylesList.filter((style)=>style.bankCode==this.bankCode)[0]?.style || 'default.css';
    this.getProducts()
    this.dynamciallyLoadCSS()
  }
  //For Dynamic Load Css
  dynamciallyLoadCSS(){
    let tf: string = this.style;
    this.dynamicStyle = this.renderer.createElement('link');
    this.renderer.setAttribute(this.dynamicStyle,'rel', 'stylesheet');
    this.renderer.setAttribute(this.dynamicStyle,'type', 'text/css');
    this.renderer.setAttribute(this.dynamicStyle,'href', 'assets/styles/dashboard/' + tf)
    this.renderer.appendChild(this.document.head, this.dynamicStyle);
    this.finelcss=true;
    this.spinner.hide();
  }
  ngOnDestroy(): void {
    if(this.dynamicStyle){
      const linkElement= this.renderer.selectRootElement(`link[href="assets/styles/dashboard/${this.style}"]`, true);
      if (linkElement){
        this.renderer.removeChild(this.document.head, linkElement);
        this.renderer.removeChild(this.document.head, this.dynamicStyle);
      }
    }
  }
  getProducts(){
    this.loginService.getAllProducts(this.verticalCode,this.bankCode).subscribe({
      next: (res) => {
        console.log(res)
        this.products = res;
        if(this.products.length>0){
          this.getPoductList(this.products[0])
        }
      },
      error: (err) => {
        console.error(err);
      }
    })
  }
  getPoductList(item:any){
    console.log(item)
    this.selectedToggle = item.insurancetype
    this.loginService.getAllProductList(item.verticalcode, item.bankcode ,item.insurancetypecode).subscribe({
      next :(res) => {
        this.ProductList = res;
      },
      error:(err) =>{
        console.error(err);
        if (err.status === 404) {
          this.displayNoProductsMessage = true;
        }
      }
    })
  }
  async getQuote(item:any){
    try{
      await this.getFormSequence(item);
      const productData = {
        insuranceTypeCode: item.insurancetypecode,
        productId: item.productId
      };
      if(this.quoteFormSequence!=null && this.quoteFormSequence.length>0){
        this.router.navigate(['portal/banca/dynamicForm'],{
          state:{ productData: productData, quoteFormSequence:this.quoteFormSequence}
        });
      }
    }catch(error){
      console.error(error);
    }
  }
  
  async insurenow(item: any){

    this.formData={...this.formData,productName: item.productname}
    console.log(this.formData);
    try{
      await this.getFormSequence(item);
      await this.getProposalNum();
      console.log(item)
      const productData = {
        insuranceTypeCode: item.insurancetypecode,
        productId: item.productid,
        productStartDate: item.productstartdate,
        productEndDate: item.productenddate,
        proposalNumber: this.proposalNum
      };
      console.log(productData);
      if(this.formSequence!=null && this.formSequence.length>0){
        this.router.navigate(['portal/banca/dynamicForm'],{
          state:{ productData: productData, formSequence: this.formSequence }
        });
      }
    }catch(error){
      console.error(error);
    }
  }  
  async getProposalNum(){
    try{
      const res = await firstValueFrom(this.loginService.getProposalNumber());
      this.proposalNum = res;
    }catch(error){
      console.error(error);
    }
  }
  async getFormSequence(item: any) {
    try {
      sessionStorage.clear();
      const res = await firstValueFrom(this.service.getFormConfigViaVerticalCode(item.verticalcode, item.bankcode,item.insurancetypecode, item.productid));
      this.formSequence = JSON.parse(res.insureformconfiguration);
      this.quoteFormSequence = JSON.parse(res.quoteformconfiguration);

      if(this.formSequence!=null && this.formSequence.length>0){
        this.formSequence.forEach(() => { this.allJsonFormData.push({})});
        sessionStorage.setItem("allJsonFormData", this.encryptionService.encrypt(this.allJsonFormData));
      }
      if(this.quoteFormSequence!=null && this.quoteFormSequence.length>0){
        this.quoteFormSequence.forEach(() => { this.allQuoteJsonFormData.push({})});
        sessionStorage.setItem("allQuoteJsonFormData", this.encryptionService.encrypt(this.allQuoteJsonFormData));
      }
      sessionStorage.setItem("allFormData", this.encryptionService.encrypt(this.formData));
      localStorage.setItem("formIndex", "0");
    }catch(err){
      this.toast.warning({ detail: "WARNING", summary: "Form Configuration not found!!", duration: 2000 });
    }
  }
  logOut(){
    this.toast.success({detail:"SUCCESS",summary:"User Logout successfully!!",duration:2000})
    this.loginService.signOut();
    this.router.navigate(['']);
  }

}
