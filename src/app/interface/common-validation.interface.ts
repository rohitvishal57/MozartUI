import { ValidatorFn, Validators } from "@angular/forms";

export const searchValidationConfig: { [key: string]: ValidatorFn[] } = {
    policyNumber: [Validators.required,Validators.pattern("^\\s*[0-9-]+\\s*$"),],
    proposerName: [Validators.required],
    name: [Validators.required ],
    leadId: [Validators.required,Validators.pattern(/^\s*UPL\d{12}\s*$/) ],
    proposalNumber: [Validators.required, Validators.pattern(/^\s*UPP\d{12}\s*$/) ],
    claimInfoId: [Validators.required,Validators.pattern("^\\s*[A-Z0-9-]+\\s*$")],
    memberId: [Validators.required,Validators.pattern("^\\s*[A-Z0-9-]+\\s*$"),],
    memberName: [Validators.required,Validators.pattern(/^\s*[a-zA-Z]{1,20}(\s+[a-zA-Z]{1,20}){0,2}\s*$/),],
    caseId: [Validators.required,Validators.pattern("^\\s*[A-Z0-9-]+\\s*$"),],
  };