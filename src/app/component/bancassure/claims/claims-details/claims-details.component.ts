import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClaimsService } from 'src/app/services/claims/claims.service';

@Component({
  selector: 'app-claims-details',
  templateUrl: './claims-details.component.html',
  styleUrls: ['./claims-details.component.scss']
})
export class ClaimsDetailsComponent {
    claim: any; // Object to hold claim details
    claimId: string | null = null;  // ID of the claim fetched from route
    claimAmount = '10,000';
    constructor(private route: ActivatedRoute, private claimsService: ClaimsService, private router: Router) {}

    ngOnInit() {
        // Fetch the claim ID from the route parameters
        this.claimId = this.route.snapshot.paramMap.get('id');        
        if (this.claimId) {
            this.fetchClaimDetails(this.claimId);
        }
    }

      //-------navigate to My-claims-view ----------
  navigateToCreateClaim(){
    this.router.navigate(['/portal/agent/createClaims']);
  }

    fetchClaimDetails(claimId: string): void {
       
        const claimsReqBody = {
            "sellerId": localStorage.getItem('agentCode'),
            "sortColumn": "ReportedDateTime",
            "sortdirection": "DESC",
            "status": "All",
            "searchType": "claimId",
            "searchString": "claimId", 
            "pageNumber": 1,
            "pageSize": 1 
        };

        // Call the service to get claim details
        this.claimsService.getClaimsList(claimsReqBody).subscribe(
            (response: any) => {
                if (response && response.data && response.data.length > 0) {
                    const filterClaim = response.data.filter((obj:any)=> obj.id == claimId); // Assuming only one claim is returned
                    this.claim = filterClaim[0]
                } else {
                    console.error('No claim details found');
                }
            },
            (error) => {
                console.error('Error fetching claim details', error);
            }
        );
    }
}
