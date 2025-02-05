import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { HdfcValidationPopupComponent } from '../hdfc-validation-popup/hdfc-validation-popup.component';
import { RugService } from '../../rug.service';
import { NgToastService } from 'ng-angular-popup';

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
  productInformation : any = '';
  constructor(private dialog: MatDialog, private formBuilder: FormBuilder,private rugService:RugService, private toast: NgToastService) {}

  async ngOnInit() {

    debugger;
    if (history.state && history.state.productInformation) {
      if (history.state.productInformation)
        this.productInformation = history.state.productInformation;
    }
    
      // Initialize userValidations form group
      this.customerValidations = this.formBuilder.group({
        mobilenumber: ['', [Validators.required, Validators.pattern('^[6-9]\\d{9}$')]],
        email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]]
      });
      // this.customerForm = this.formBuilder.group({
      //   mobilenumber: ['', [Validators.required, Validators.pattern('^[6-9]\\d{9}$')]],
      //   dob: ['', [Validators.required]]
      // });
  }
  isNumber(event: KeyboardEvent) {
    const pattern = /[0-9]/; // Only allow digits
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault(); // Block non-numeric input
    }
  }

  onsubmit(){
    debugger;
    let requestBody : any ={};
    requestBody.mobileNumber = this.customerValidations.get("mobilenumber")?.value;
    requestBody.emailId = this.customerValidations.get("email")?.value;
    requestBody.productName = this.productInformation.productName;
    this.toast.success({ detail: "Success", summary: 'Commincation Send Succesfully.', duration: 3000 });

    this.rugService.sendCommunication(requestBody).subscribe(
      (response: any) => {
        if (response.isSuccess) {
      
        }

      },
      (error)=>{
        console.error("Error from send OTP API:", error);
      });
  }

}
