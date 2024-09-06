import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  ProductForm!: FormGroup;
  allProduct: any[] = [];
  allInsuranceType: any[] = [];
  duplicateError: string = '';

  constructor(
    private adminService: AdminService,
    private toast: NgToastService,
    private fb: FormBuilder,
    private route: Router
  ) {}

  ngOnInit() {
    this.getAllProduct();
    this.getAllInsuranceType();
    this.initializeForm();
  }

  initializeForm() {
    this.ProductForm = this.fb.group({
      productId: ['', Validators.required],
      productName: ['', Validators.required],
      insuranceType: [''],
      productStartDate: ['', Validators.required],
      productEndDate: ['', Validators.required],
      productFamily: [''],
      familyPlan: ['', Validators.required],
      status: [true, Validators.required],
      productdescription:['',Validators.required]
    });
  }

  getName(id: any) {
    let data = this.allInsuranceType.find(insurance => insurance.insuranceTypeCode === id);
    return data;
  }

  getAllProduct() {
    return this.adminService.getAllProductList().subscribe({
      next: (res) => {
        this.allProduct = res;
        console.log(this.allProduct);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  getAllInsuranceType() {
    return this.adminService.getAllInsuranceTypeList().subscribe({
      next: (res) => {
        this.allInsuranceType = res;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  checkDuplicateProductId() {
    const productId = this.ProductForm.get('productId')?.value;
    const duplicate = this.allProduct.some(product => product.productId === productId);

    if (duplicate) {
      this.duplicateError = 'Product Code already exists!';
    } else {
      this.duplicateError = '';
    }
  }

  onSubmit() {
    this.checkDuplicateProductId();

    if (this.ProductForm.valid && !this.duplicateError) {
      this.adminService.addProduct(this.ProductForm.value).subscribe({
        next: (res) => {
          this.toast.success({ detail: "SUCCESS", summary: "Product Added Successfully.", duration: 4000 });
          this.getAllProduct();
          this.initializeForm();
          this.route.navigate(['/portal/finaladminDashboard']);
        },
        error: (err) => {
          this.toast.warning({ detail: "WARNING", summary: "Product Already Added.!", duration: 4000 });
        }
      });
    } else {
      ValidateForm.validateAllFormFields(this.ProductForm);
      if (!this.duplicateError) {
        this.toast.warning({ detail: "WARNING", summary: "Please Fill All Required Fields.!", duration: 4000 });
      }
    }
  }
}
