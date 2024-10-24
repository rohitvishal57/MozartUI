import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RenewalsService } from '../renewals.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-paymentstatus',
  templateUrl: './paymentstatus.component.html',
  styleUrls: ['./paymentstatus.component.scss']
})
export class PaymentstatusComponent {
  orderId: string | undefined;
  paymentStatus:string | undefined
  constructor(private route: ActivatedRoute,
    private renewalService:RenewalsService,
    private router: Router,
    private encryptionService: EncryptionService,
    private toast: NgToastService) { }

  ngOnInit(){
    const pathArray = this.route.snapshot.url;
    console.log(pathArray);
    if (pathArray && pathArray.length > 0) {
      console.log(pathArray.length);
      this.orderId = pathArray[pathArray.length - 1].path; 
    }
    console.log(this.orderId);
    this.getPaymentStatus();
  }
  getPaymentStatus(){
    this.renewalService.getPaymentStatusApi(this.orderId,{}).subscribe(
      (res:any)=>{
        console.log("payment response",res);
        if(res.isSuccess==true){
          this.paymentStatus=res.paymentStatus
          if(this.paymentStatus=="SUCCESS")
            {
              console.log("payment status",this.paymentStatus);
              this.renewalService.setPaymentStatus('1');
              this.router.navigate([`renewal/payment`]);
              this.toast.success({ detail: "success", summary: "policy renewed uccessfully", duration: 1500 });

            }
          else if(this.paymentStatus=="INTIATED"){
            console.log("payment status",this.paymentStatus);
            this.renewalService.setPaymentStatus('2');
            this.router.navigate([`renewal/payment`]);
            this.toast.error({ detail: "Error", summary: "Your payment is in processing", duration: 1500 });
          }
          else {
            console.log("payment status",this.paymentStatus);
            this.renewalService.setPaymentStatus('2');
            this.router.navigate([`renewal/payment`]);
            this.toast.error({ detail: "Error", summary: "Your payment is Failed try again once", duration: 1500 });
          }
        }
        else{
          console.log("Failed");
        } 
      },
      (err:any)=>{
        sessionStorage.setItem("paymentStatus", "2");
        console.log("Error is coming from getPaymentStatus Api");
      }
    )
  }

}
