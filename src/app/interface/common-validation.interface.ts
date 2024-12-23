import { ValidatorFn, Validators } from "@angular/forms";

export const searchValidationConfig: { [key: string]: ValidatorFn[] } = {
  mobileNumber: [Validators.required,Validators.pattern("^[6-9][0-9]{9}$")],
  // policyNumber: [Validators.required,Validators.pattern("^\s*[0-9]{2}-[0-9]{2}-[0-9]{7}-[0-9]{2,}\s*$"),],
  proposerName: [Validators.required,Validators.pattern("^\\s*[a-zA-Z]+(\\s+[a-zA-Z]+)*\\s{0,100}$"),],
  policyNumber: [Validators.required,Validators.pattern(/^\s*[0-9]{2}-[0-9]{2}-[0-9]{7}-[0-9]{2,}\s*$/),],
  // proposerName: [Validators.required,Validators.pattern(/^\s*[a-zA-Z]{1,20}(\s+[a-zA-Z]{1,20}){0,2}\s*$/),],
  policyStatus:[Validators.required],
  emailID: [Validators.required,Validators.pattern(/^\s*[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\s*$/) ],
  email: [Validators.required,Validators.pattern(/^\s*[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\s*$/) ],
  AssignedTo:[Validators.required],
  name: [Validators.required,Validators.pattern(/^\s*[a-zA-Z]{1,20}(\s+[a-zA-Z]{1,20}){0,2}\s*$/) ],
  // leadId: [Validators.required,Validators.pattern(/^\s*UPL\d{12}\s*$/) ],
  // proposalNumber: [Validators.required, Validators.pattern(/^\s*UPP\d{12}\s*$/) ],
  leadId: [Validators.required],
  proposalNumber: [Validators.required],
  proposalStatus:[Validators.required],
  requestId: [Validators.required,Validators.pattern("^\\s*[A-Z0-9-]+\\s*$")],
  memberId: [Validators.required,Validators.pattern("^\\s*[A-Z0-9-]+\\s*$"),],
  memberName: [Validators.required,Validators.pattern(/^\s*[a-zA-Z]{1,20}(\s+[a-zA-Z]{1,20}){0,2}\s*$/),],
  caseId: [Validators.required,Validators.pattern("^\\s*[A-Z0-9-]+\\s*$"),],

};