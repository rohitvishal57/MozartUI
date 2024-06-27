import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { CommonService } from 'src/app/services/common.service';
import { EncryptionService } from 'src/app/services/encryption.service';

@Component({
  selector: 'app-banca-agent-dashboard',
  templateUrl: './banca-agent-dashboard.component.html',
  styleUrls: ['./banca-agent-dashboard.component.scss']
})
export class BancaAgentDashboardComponent {

  allProposals:any[]= []
  allInsuranceType:any[]=[]
  allProducts:any[]=[]
  insurancetypecode=localStorage.getItem('insurancetypecode');
  verticalCode=localStorage.getItem('verticalCode');
  code=localStorage.getItem('bankCode');
  productid=localStorage.getItem('productId');

  private formData:any={}
  private allJsonFormData:any[]=[]

  constructor(private commonSerivce:CommonService,private adminService:AdminService,
    private router:Router,private encryptionService:EncryptionService,private datePipe:DatePipe){}
  ngOnInit(){
    console.log(this.verticalCode);
    console.log(this.code);
    console.log(this.insurancetypecode);
    this.getAllInsuranceType(); 
    this.getAllProducts();
    this.getAllProposals();
  }

  getAllProposals(){
    const reqData={
      "verticalCode": this.verticalCode,
      "code": this.code,
    }
    console.log(reqData);
    this.commonSerivce.getAllFormDataViaVerticalCode(reqData).subscribe({
      next: (response) => {
        this.groupProposals(response);
      },
      error: (error) => {
        console.log(error);
      }
    });
  }
  groupProposals(allProposals:any[]){
    console.log(allProposals);
    const groupedData = allProposals.reduce((result, item) => {
      const key = `${item.proposalNum}_${item.verticalCode}_${item.code}_${item.insurancetypecode}_${item.formConfig}_${item.productId}`;
      if (!result[key]) {
         result[key] = { proposalNum: item.proposalNum, verticalCode: item.verticalCode, code: item.code,insuranceTypeCode: item.insurancetypecode,formConfig:item.formConfig,productId:item.productId,formData: [] };
      }
      result[key].formData.push(item);
      return result;
    },{});
    this.allProposals= Object.values(groupedData);
    console.log(this.allProposals);  
  }
  getAllInsuranceType(){ 
    this.adminService.getAllInsuranceTypeList().subscribe({
      next: (response) => {
        this.allInsuranceType=response;
        console.log(this.allInsuranceType); 
      },
      error: (error) => {
        console.log(error);
      }
    })
  }
  getAllProducts(){
    this.adminService.getAllProductList().subscribe({
      next: (response) => {
        this.allProducts=response;
        console.log(this.allProducts); 
      },
      error: (error) => {
        console.log(error);
      }
    })
  }
  getInsuranceTypeName(id:any){
    let data=this.allInsuranceType.find(insurance => insurance.insuranceTypeCode==id);
    return data;
  }
  getProductName(id:any){
    let data=this.allProducts.find(product => product.productId==id);
    return data;
  }
  onLinkClick(data:any){
    let formSequence=JSON.parse(data.formConfig);
    formSequence.forEach(() => { this.allJsonFormData.push({})});
    sessionStorage.setItem("allJsonFormData", this.encryptionService.encrypt(this.allJsonFormData));
    console.log(data.formData.length)

    localStorage.setItem("formIndex", data.formData.length.toString());

    data.formData.forEach((element:any, index: number) => {
      let resumeFormData=JSON.parse(element.formData);
      this.formData=this.updateNestedData(this.formData,resumeFormData);
    });
    sessionStorage.setItem("allFormData", this.encryptionService.encrypt(this.formData));

    const productData = {
      insuranceTypeCode:data.insuranceTypeCode,
      productId:data.productId,
      proposalNumber: data.proposalNum
    };
    this.router.navigate(['portal/banca/dynamicForm'],{
      state:{productData: productData,formSequence:formSequence}
    }); 
  }
  formatDate(date: any): string {
    return this.datePipe.transform(date, 'dd-MM-yyyy HH:mm:ss') || '';
  }
  updateNestedData(originalData: any,newData: any){
    for(const key in newData) {
      if (newData.hasOwnProperty(key)) {
        if (typeof newData[key]==='object' && !Array.isArray(newData[key])) {
          originalData[key] = this.updateNestedData(originalData[key] || {}, newData[key]);
        } 
        else if(Array.isArray(newData[key]) && Array.isArray(originalData[key])) {
          originalData[key] = originalData[key].map((item: any, index: number) => {
            if (index < newData[key].length) {
              return this.updateNestedData(item || {}, newData[key][index]);
            }
            return item;
          });
        } else {
          originalData[key] = newData[key];
        }
      }
    }
    return originalData;
  }
  getProposalStatus(data:any){
    if(data?.formData?.length==JSON.parse(data.formConfig)?.length-1){
      return true;
    }
    return false;
  }
}
