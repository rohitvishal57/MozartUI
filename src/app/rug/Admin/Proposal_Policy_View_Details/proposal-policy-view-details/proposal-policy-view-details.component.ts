import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AdminService } from '../../admin.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-proposal-policy-view-details',
  templateUrl: './proposal-policy-view-details.component.html',
  styleUrls: ['./proposal-policy-view-details.component.scss']
})
export class ProposalPolicyViewDetailsComponent {
  soloJourneyForm!: FormGroup
  leadId: string = ""
  policyNumber: string = '';


  constructor(private adminServise: AdminService, private router: Router) {

  }

  onSearch(lead:any) {
    let reqData = {
      leadId: this.leadId,
      policyNumber: ''
    }
    localStorage.setItem('leadId', this.leadId);
    let data = {
      partnerId: 45,
      productId: 26
    }
    if(lead.planName == 'Health Pro'){
      data.partnerId =  45
      data.productId = 26
      
    }else if(lead.planName == 'Health Pro Infinity'){
      data.partnerId =  45
      data.productId = 27
    }else if(lead.planName == 'Group Activ Secure'){
      data.partnerId =  45
      data.productId = 29
    }else{
      data.partnerId =  45
      data.productId = 29
    }
      this.adminServise.GetTSPolicyInfoByLeadId(reqData).subscribe(
        (response) => {
          this.router.navigate(['rug'], {
            state: { productData: data}
         });
        },
        (error) => {
          console.error("Error fetching data:", error);
        }
      );
  }

  clearFilter() {
    this.leadId = '';
    this.policyNumber = ''
  }
}
