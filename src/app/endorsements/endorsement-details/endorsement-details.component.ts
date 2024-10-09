import { Component } from '@angular/core';
import { EndorsementsRequestsService } from '../endorsements-requests/endorsements-requests.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-endorsement-details',
  templateUrl: './endorsement-details.component.html',
  styleUrls: ['./endorsement-details.component.scss']
})
export class EndorsementDetailsComponent {
  caseId: number | undefined;
  policyData: any = null;
  isPublic: boolean = false;

  constructor(
    private _router: Router,
    private endorsement_service: EndorsementsRequestsService,
  ) {}

  ngOnInit(): void {
    this.getPolicyDetails(this.caseId);
  }

  getPolicyDetails(caseId: any) {
    this.endorsement_service
      .getEndorsementDetailsApi(caseId)
      .subscribe(
        (resp) => {
          console.log(resp);
          this.policyData = resp;
        },
        (err: any) => {
          console.log(err);        }
      );
  }

  backToEndorsment(){
    this._router.navigate(["endorsements"]);
  }
  
}
