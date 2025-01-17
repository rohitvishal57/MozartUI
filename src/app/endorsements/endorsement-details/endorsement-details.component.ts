import { Component } from '@angular/core';
import { EndorsementsRequestsService } from '../endorsements-requests/endorsements-requests.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-endorsement-details',
  templateUrl: './endorsement-details.component.html',
  styleUrls: ['./endorsement-details.component.scss']
})
export class EndorsementDetailsComponent {
  caseId: string | undefined;
  policyData: any = null;
  isPublic: boolean = false;

  constructor(
    private _router: Router,
    private endorsement_service: EndorsementsRequestsService,
    private route: ActivatedRoute,
    private toast: NgToastService,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.caseId = params.get('caseId') || '';
    });
    this.getPolicyDetails();
  }

  getPolicyDetails() {
    let endorsementCaseDetailsReqBody = {
        "caseId": this.caseId
    }
    this.endorsement_service
      .endorsementCaseDetailsApi(endorsementCaseDetailsReqBody)
      .subscribe(
        (resp:any) => {
          if (resp.data && resp.statusCode == "200" && resp.isSuccess) {
            this.policyData = resp.data;
          } else {
            this.toast.error({
              detail: 'Error',
              summary: resp.message,
              duration: 5000,
            });
          }
        },
        (err: any) => {
          console.log(err);
        }
    );
  }

  backToEndorsments(){
    this._router.navigate(["endorsements"]);
  }
  
}
