import { Component } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { NgToastService } from 'ng-angular-popup';
import {FormBuilder,Validators} from '@angular/forms';
import ValidateForm from 'src/app/validation/validateForm';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['../../bank-controller/add-bank/add-bank.component.scss','../../bank-controller/add-bank/table.scss']
})
export class ProductComponent {
  visible: boolean = false;
  ProductForm:any;
  allProduct:any[]=[]
  allInsuranceType:any[]=[]

  constructor(private adminService:AdminService,private toast:NgToastService,
    private fb: FormBuilder,private datePipe: DatePipe){}

  ngOnInit(){
    this.getAllProduct();
    this.getAllInsuranceType();
    this.initializeForm();
  }
  initializeForm(){
    this.ProductForm=this.fb.group({
      productId:['',Validators.required],
      productName:['',Validators.required],
      insuranceType:['',Validators.required],
      productStartDate:['',Validators.required],
      productEndDate:['',Validators.required],
      productFamily:['',Validators.required],
      familyPlan:['',Validators.required],
      status:[true,Validators.required]
    });
  }
  getName(id:any){
    let data=this.allInsuranceType.find(insurance => insurance.insuranceTypeCode==id);
    return data;
  }
  getAllProduct() {
    return this.adminService.getAllProductList().subscribe({
      next: (res)=>{ 
        this.allProduct=res;
      },
      error: (err => {
        console.error(err); 
      })
    });
  }
  getAllInsuranceType() {
    return this.adminService.getAllInsuranceTypeList().subscribe({
      next: (res)=>{
        this.allInsuranceType=res;
      },
      error: (err => {
        console.error(err); 
      })
    });
  }
  onSubmit(){
    if(this.ProductForm.valid){
      this.adminService.addProduct(this.ProductForm.value).subscribe({
        next: (res)=>{
          this.toast.success({ detail: "SUCCESS", summary: "Product Added Successfully.", duration: 4000 })
          this.getAllProduct();
          this.initializeForm();
        },
        error: (err => {
          this.toast.warning({ detail: "WARNING", summary:"Product Already Added.!", duration: 4000 });
        })
      });
    }
    else{
      ValidateForm.validateAllFormFields(this.ProductForm);
      this.toast.warning({ detail: "WARNING", summary:"Please Fill All Required Fields.!", duration: 4000 });
    }
  }
  showDialog(data:any) {
    this.visible = true;
    this.ProductForm.get('productId')?.setValue(data.productId);
    this.ProductForm.get('productName')?.setValue(data.productName);  
    this.ProductForm.get('insuranceType')?.setValue(data.insuranceType);
    this.ProductForm.get('productStartDate')?.setValue(this.datePipe.transform(data.productStartDate,'yyyy-MM-dd'));
    this.ProductForm.get('productEndDate')?.setValue(this.datePipe.transform(data.productEndDate,'yyyy-MM-dd'));
    this.ProductForm.get('productFamily')?.setValue(data.productFamily);
    this.ProductForm.get('familyPlan')?.setValue(data.familyPlan);
    this.ProductForm.get('status')?.setValue(data.status);
  }
  onUpdate(){
    if(this.ProductForm.valid){
      this.adminService.updateProduct(this.ProductForm.value).subscribe({
        next: (res)=>{
          this.toast.success({ detail: "SUCCESS", summary: "Product Updated Successfully.", duration: 4000 })
          this.getAllProduct();
          this.initializeForm();
        },
        error: (err => {
          this.toast.warning({ detail: "WARNING", summary:"Product Already Added.!", duration: 4000 });
        })
      });
      this.visible=false;
    }
    else{
      ValidateForm.validateAllFormFields(this.ProductForm);
      this.toast.warning({ detail: "WARNING", summary:"Please Fill All Required Fields.!", duration: 4000 });
    }
  }
}
