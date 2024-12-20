import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RenewalsService } from 'src/app/renewals/renewals.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { NgToastService } from 'ng-angular-popup';
import { LoadingService } from 'src/app/services/loading.service';
import { thankYou } from 'src/assets/styles/renewals-forms/combined_forms';
import { payment } from 'src/assets/styles/renewals-forms/payment';
import { YatraService } from 'src/app/yatra/yatra/yatra.service';
import { customer_payment } from 'src/assets/styles/renewals-forms/customer_payment';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent {
  orderId: string | undefined;
  paymentStatus: string | undefined;
  user:string | undefined;
  userModule:string|undefined;

  constructor(private route: ActivatedRoute,
    private renewalService: RenewalsService,
    private router: Router,
    private encryptionService: EncryptionService,
    private toast: NgToastService, private spinner: LoadingService,
    private yatraService: YatraService) {
     }

  ngOnInit() {
    if (Object.keys(this.route.snapshot.queryParams).length) {
      const params = this.route.snapshot.queryParams;
      this.orderId = params['orderid'] ? params['orderid'] : "" ;
      if (params['token']) {
        localStorage.setItem('token', params['token']); 
      }
    }
    this.user='Customer';
    this.userModule='renewal';
    this.getPaymentStatus();
  }

  getPaymentStatus() {
    if(this.user == 'Customer'){
      if(this.userModule == 'renewal'){
        this.router.navigate(['renewal/customerPayment'], {
          state: {
            // formData: this.encryptionService.encrypt(),
            formSequence: this.encryptionService.encrypt([customer_payment, thankYou]),
            // kycStatus: this.encryptionService.encrypt(kycData.kycStatus),
            // formIndex: "1",
          }
        });
      }else if(this.userModule == 'yatra'){
        this.router.navigate(['yatra/customerPayment'], {
          state: {
            // formData: this.encryptionService.encrypt(),
            formSequence: this.encryptionService.encrypt([customer_payment, thankYou]),
            // kycStatus: this.encryptionService.encrypt(kycData.kycStatus),
            // formIndex: "1",
          }
        });

      }else{

      }
    }else if(this.user == 'Agent'){
      if(this.userModule == 'renewal'){
        this.router.navigate(['renewal/paymentstatus'], {
          queryParams: {
            orderid: 'UP_241216_c3698374',
            token: 'aa59deee594c4c90abd5737929d0302e'
          }
        });        
      }else if(this.userModule == 'yatra'){
        this.router.navigate(['yatra'], {
          state: {
            // formData: this.encryptionService.encrypt(),
            // formSequence: this.encryptionService.encrypt([]),
            // kycStatus: this.encryptionService.encrypt(kycData.kycStatus),
            // formIndex: "1",
          }
        });

      }else{

      }
    }else{

    }
  }

}
