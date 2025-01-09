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

  onSearch() {
    let reqData = {
      leadId: this.leadId,
      policyNumber: this.policyNumber
    }
    if (this.leadId) {
      this.adminServise.GetTSPolicyInfoByLeadId(reqData).subscribe(
        (response) => {
          this.router.navigateByUrl('/rug');
        },
        (error) => {
          console.error("Error fetching data:", error);
        }
      );
    } else if (this.policyNumber) {
      this.adminServise.GetTSPolicyInfoByLeadId(reqData).subscribe(
        (response) => {
          this.router.navigateByUrl('/rug');
        },
        (error) => {
          console.error("Error fetching data:", error);
        }
      );
    }

  }

  clearFilter() {
    this.leadId = '';
    this.policyNumber = ''
  }
}
