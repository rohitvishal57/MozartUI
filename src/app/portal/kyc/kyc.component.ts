import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { RenewalsService } from 'src/app/renewals/renewals.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { kycThankYou, thankYou } from 'src/assets/styles/renewals-forms/combined_forms';
import { customer_payment } from 'src/assets/styles/renewals-forms/customer_payment';
import { payment } from 'src/assets/styles/renewals-forms/payment';

@Component({
  selector: 'app-kyc',
  templateUrl: './kyc.component.html',
  styleUrls: ['./kyc.component.scss']
})
export class KycComponent {

  kycStatus: string | undefined;
  transactionId:string | undefined;
  user:string| undefined;
  userModule:string|undefined;
  
  constructor(private route: ActivatedRoute,private renewalService: RenewalsService,
    private router: Router,private encryptionService: EncryptionService,private toast: NgToastService) { 
  }

  ngOnInit() {    
    if (Object.keys(this.route.snapshot.queryParams).length) {
      const params = this.route.snapshot.queryParams;
      this.transactionId = params['transactionId'] ? params['transactionId'] : "";
      if (params['token']) {
        localStorage.setItem('token', params['token']); 
      }
    }
    this.user='Customer';
    this.userModule='yatra';
    this.transactionControl();
  }
 
  transactionControl(){
    if(this.user == 'Customer'){
      if(this.userModule == 'renewal'){
        this.router.navigate(['renewal/customerKyc'], {
          state: {
            // formData: this.encryptionService.encrypt(),
            formSequence: this.encryptionService.encrypt([customer_payment, thankYou]),
            // kycStatus: this.encryptionService.encrypt(kycData.kycStatus),
          }
        });
      }else if(this.userModule == 'yatra'){
        this.router.navigate(['yatra/customerKyc'], {
          state: {
            // formData: this.encryptionService.encrypt(),
            formSequence: this.encryptionService.encrypt([customer_payment,thankYou]),
            // kycStatus: this.encryptionService.encrypt(kycData.kycStatus),
          }
        });

      }else{

      }
    }else if(this.user == 'Agent'){
      if(this.userModule == 'renewal'){
        this.router.navigate(['renewal/kycStatus'], {
          queryParams: {
            transactionId: 'UP_241216_15e4ee15',
            token: 'aa59deee594c4c90abd5737929d0302e'
          }
        });

      }else if(this.userModule == 'yatra'){
        this.router.navigate(['yatra'], {
          state: {
            // formData: this.encryptionService.encrypt(),
            // formSequence: this.encryptionService.encrypt([]),
            // kycStatus: this.encryptionService.encrypt(kycData.kycStatus),
          }
        });

      }else{

      }
    }else{

    }

  }

}
