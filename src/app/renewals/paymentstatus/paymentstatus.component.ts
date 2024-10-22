import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RenewalsService } from '../renewals.service';
import { EncryptionService } from 'src/app/services/encryption.service';

@Component({
  selector: 'app-paymentstatus',
  templateUrl: './paymentstatus.component.html',
  styleUrls: ['./paymentstatus.component.scss']
})
export class PaymentstatusComponent {
  orderId: string | undefined;
  paymentStatus:string | undefined
  constructor(private route: ActivatedRoute,private renewalService:RenewalsService,private router: Router, private encryptionService: EncryptionService) { }

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
        this.paymentStatus=res.Paymentstatus
        if(this.paymentStatus=="success")
        {
          sessionStorage.setItem("paymentStatus", "1");

          this.router.navigate([`renewals/payment`]);
        }
      },
      (err:any)=>{
        console.log("Error is coming from getPaymentStatus Api");
      }
    )
  }

}
