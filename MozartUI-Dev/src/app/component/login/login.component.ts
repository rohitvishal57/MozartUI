import { Component, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AdminService } from 'src/app/services/admin.service';
import ValidateForm from 'src/app/validation/validateForm';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm!: FormGroup;
  allBank: any[] = [];
  agencyOptions: any[] = []
  showBankDropdown: boolean = true;
  allAgency: any[] = []
  allChannel: any[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private adminService: AdminService,
    private spinner: NgxSpinnerService
  ) {}
  ngOnInit() {
    this.spinner.show();
    localStorage.clear();
    this.initializeForm();
    this.getAllAgency();
    this.getAllBank();
    this.getAllChannel();
    this.spinner.hide();
  }
  initializeForm() {
    this.loginForm = this.fb.group({
      verticalCode: ['', Validators.required],
      bankCode: [''],
      agencyCode: ['']
    });
  }
  getAllAgency() {
    this.adminService.getAllAgencyDetails()
      .subscribe({
        next: (res) => {
          this.allAgency = res.filter((agency: any) => agency.status == true);
          this.agencyOptions = this.allAgency;
        },
        error: (err => {
          console.error(err);
        })
      })
  }

  getAllBank() {
    this.adminService.getAllBankList().subscribe({
      next: (res) => {
        this.allBank = res.filter((bank: any) => bank.status == true);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
  getAllChannel() {
    this.adminService.getAllChannelList().subscribe({
      next: (res) => {
        this.allChannel = res.filter(
          (channel: any) => channel.channelStatus == true
        );
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
  subscribeToVerticalCodeChanges(event:any) {
    console.log(event.target.value);
    
    const verticalCodeControl = event.target.value;
    console.log(verticalCodeControl);
    
    // if (verticalCodeControl) {
    //   verticalCodeControl.valueChanges.subscribe((verticalCode) => {
        this.loginForm.get('bankCode')?.reset();
        if (verticalCodeControl === '13') {
          this.showBankDropdown = false;
          this.router.navigate(['portal/agent'])
        } 
        else if (verticalCodeControl === '12') {
          this.showBankDropdown = true;
        }
      // });
    // } else {
    //   console.error("Vertical code control is not initialized.");
    // }
  }
  onSubmit() {
    console.log('Form validity:', this.loginForm.value);
    if (this.loginForm.valid) {
      console.log('Form is valid'); 
      if(this.loginForm.get('bankCode')?.value === null) {
        console.log('Navigating...');
        localStorage.setItem('verticalCode', this.loginForm.get('verticalCode')?.value);
        this.router.navigate(['agent'],{
          state:{ verticalCode : this.loginForm.get('verticalCode')?.value}
        });
      }
      else if(this.loginForm.get('agencyCode')?.value === ''){
        let bankDetails = this.allBank.filter((bank: any) => bank.bankCode == this.loginForm.get('bankCode')?.value)[0];
        let bankName = this.allBank.filter((bank: any) => bank.bankCode == this.loginForm.get('bankCode')?.value)[0].bankName;
        let trimmedBankName = bankName.replace(/\s/g, '');
        localStorage.setItem('bankCode', this.loginForm.get('bankCode')?.value);
        this.router.navigate(['login', trimmedBankName], { state: { bankDetails: bankDetails, verticalCode: this.loginForm.get('verticalCode')?.value } });
      }      
    }
    else {
      ValidateForm.validateAllFormFields(this.loginForm);
    }
  }
}
