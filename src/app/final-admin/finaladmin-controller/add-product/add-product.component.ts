import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { AdminService } from 'src/app/services/admin.service';
import ValidateForm from 'src/app/validation/validateForm';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent {
  visible: boolean = false;
  ProductForm:any;
  allProduct:any[]=[]
  allInsuranceType:any[]=[]

  constructor(private adminService:AdminService,private toast:NgToastService,
    private fb: FormBuilder,private route:Router){}

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
    this.route.navigate(['/portal/finaladminDashboard']);
  }
}
