import { Component } from '@angular/core';
import { RenewalsService } from '../renewals.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EncryptionService } from 'src/app/services/encryption.service';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-kyc-status',
  templateUrl: './kyc-status.component.html',
  styleUrls: ['./kyc-status.component.scss']
})
export class KycStatusComponent {

  kycStatus: string | undefined;
  
  constructor(private route: ActivatedRoute,private renewalService: RenewalsService,
    private router: Router,private encryptionService: EncryptionService,private toast: NgToastService) { 
  }

    ngOnInit() {
      if (Object.keys(this.route.snapshot.queryParams).length) {
        const params = this.route.snapshot.queryParams;
      }
    }  

}
