import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { HdfcValidationPopupComponent } from '../hdfc-validation-popup/hdfc-validation-popup.component';

@Component({
  selector: 'app-hdfc-customer-registration',
  templateUrl: './hdfc-customer-registration.component.html',
  styleUrls: ['./hdfc-customer-registration.component.scss']
})
export class HdfcCustomerRegistrationComponent implements OnInit {
  customerValidations!: FormGroup;
  customerForm!: FormGroup;
  submitted: boolean = false;
  showCustomerForm: boolean = false;
  constructor(private dialog: MatDialog, private formBuilder: FormBuilder) {}

  async ngOnInit() {
    
      // Initialize userValidations form group
      this.customerValidations = this.formBuilder.group({
        mobilenumber: ['', [Validators.required, Validators.pattern('^[6-9]\\d{9}$')]],
        email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]]
      });
      this.customerForm = this.formBuilder.group({
        mobilenumber: ['', [Validators.required, Validators.pattern('^[6-9]\\d{9}$')]],
        dob: ['', [Validators.required]]
      });
  }
  isNumber(event: KeyboardEvent) {
    const pattern = /[0-9]/; // Only allow digits
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault(); // Block non-numeric input
    }
  }
  async onCustomerValidationSubmit() {
    this.submitted = true;
    console.log(this.customerValidations.value)
    if (this.customerValidations.valid) {
      const dialogRef = this.dialog.open(HdfcValidationPopupComponent, {
        width: "800px",
        autoFocus: false,
        data: "Form Data"
      });
      dialogRef.afterClosed().subscribe((result: any) => {
        console.log(result);
      })
    }
  }
}
