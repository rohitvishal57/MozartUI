import { formatDate } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  Inject,
  Input,
  SimpleChanges,
} from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { MSAL_GUARD_CONFIG, MsalGuardConfiguration } from '@azure/msal-angular';
import { NgToastService } from 'ng-angular-popup';
import { map, catchError, of, forkJoin } from 'rxjs';
import { ClaimData } from 'src/app/interface/claims.interface';
import { CommonService } from 'src/app/services/common.service';
import { EndorsementsService } from 'src/app/services/endrosements/endorsements.service';

@Component({
  selector: 'app-endorsements-new-request',
  templateUrl: './endorsements-new-request.component.html',
  styleUrls: ['./endorsements-new-request.component.scss'],
})
export class EndorsementsNewRequestComponent {
  // uploadedFiles: File[] = [];
  form!: FormGroup;
  saveForm!: FormGroup;
  activePolicyNumbers: string[] = [];
  proposers: string[] = ['5100003'];
  proposerNames: string[] = [];
  endorsementsTypes: string[] = ['Aadhar Card Update', 'Pancard Update', 'Change my Alternate number', 'Change in my E-mail Id', 'Change my name', 'Correction in DOB', 'Correction in Gender', 'Deletion of Member from Policy'];
  showDocInfo: boolean = false;
  fileID: string = 'djsdhjdsvh';
  responseData:any = [];
  selectMemberData: any = {};
  payload: any = {
    agentCode: '',
    eventName: '',
    memberName: '',
    mobileNumber: '',
    memberRelation: '',
    endorsementRequest: {
      activityDescription: '',
      activitySubject: '',
      assignedTeam: 'Endorsement - Non financial',
      assignedUser: '',
      attachmentContent: '',
      attachmentName: '',
      attachmentType: '',
      caseSubSubType: 'Aadhar Card Update',
      caseSubType: 'Endorsement',
      caseTitle: '',
      caseType: 'Endorsement',
      category: 'Request',
      comments: '',
      createdOn: '',
      customer: 'PT87375477',
      customerID: '',
      customerType: 'Retail Customer',
      isClosed: 'Yes',
      modifiedOn: '',
      notesDescription: '',
      notesTitle: '',
      origin: 'ABHICONNECT',
      policy: '',
      policyStatus: '',
      priority: '',
      product: 'Activ Assure',
      status: '',
      createAttachment: '',
      endorsementDetails: {
        aadharCardNo: '',
        primaryContactNumber: '8008363937',
        alternateContactNumber: '',
        memberPrimaryContactNumber: '',
        memberAlternateContactNumber: '',
        internationalContactNumber: '',
        email: '',
        alternateEmail: '',
        memberEmail: '',
        memberAlternateEmail: '',
        internationalAddress: '',
        nomineeName: '',
        nomineeRelationship: '',
        nomineeContact: '',
        country: '',
        panCardNo: '',
      },
    },
  };

  namesVariable: any;
  documentType: any;

  @Input() uploadedFiles: {
    name: string;
    label: string;
    isEditing?: boolean;
    isEdited?: boolean;
    editableControl?: FormControl;
    uploadDateTime?: Date;
    formattedUploadDateTime?: string;
    status: string;
    file: File;
    policyNumber?: string;
    documentName?: string;
    documentType?: string;
    createdBy?: string;
  }[] = [];
  endorsementInfo: any;
  constructor(
    private fb: FormBuilder,
    private endorsementService: EndorsementsService,
    private toast: NgToastService,
    private router:Router,
    private spinner: NgxSpinnerService
  ) {}
  ngOnInit(): void {
    this.createForm();
    this.getEndorsementsDropDownData();
  }
  createForm(): void {
    this.form = this.fb.group({
      policyNumber: ['', Validators.required],
      // proposalNumber: ['', Validators.required],
      memberName: ['', Validators.required],
      endorsementType: ['', Validators.required],
      notes: ['', Validators.required],
      policyDetails: ['', Validators.required],
      doc: [''],
    });
  }
  getEndorsementsDropDownData(): void {
    let data: any = {
      userId: ['5100003'],
    };
    this.endorsementService.getactivepolicynumbersApi(data).subscribe(
      (response: any) => {
        if (response.isSuccess) {
          this.responseData =  response;
          this.activePolicyNumbers = this.extractUniqueValues(
            response.getPolicydetails,
            'policynumber'
          );
        }
      },
      (error) => console.error('Error fetching dropdown data', error)
    );
  }

  extractUniqueValues(data: any[], key: string): any[] {
    console.log(data, key);
    return [...new Set(data.map((item) => item[key]).filter((val) => val))];
  }
  onFileSelected(event: any): void {
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      this.uploadedFiles.push({
        name: file.name,
        label: 'Label this document',
        isEditing: false,
        uploadDateTime: new Date(),
        status: 'pending',
        file: file,
      });
    }
 
    this.uploadFiles(Array.from(files));
  }

  handleDropdownChange(event:any){
    console.log(event.value, this.responseData)
    const result = this.responseData.getPolicydetails.filter((person:any) => person.policynumber == event.value);
    this.proposerNames = this.extractUniqueValues(result,'membername');
  }
  selectMember(data:any){
      this.selectMemberData = this.responseData.getPolicydetails.find((person:any) => person.membername == data.value);
      console.log(this.selectMemberData,'wdbhwecd', this.selectMemberData.policynumber)
      let payload:any = {
          policyNumber: this.selectMemberData.policynumber,
          memberId : this.selectMemberData.memberid
      }
      this.endorsementService.getEndorsementPolicyInfoApi(payload).subscribe(
        (response) => {
          if (response.statusCode == 200) {
           this.endorsementInfo = response;
          }
        },
        (error) => {}
      );
  }

  uploadFiles(files: File[]): void {
    const fileNames: string[] = files.map((file) => file.name);
    const fileTypes: string[] = files.map((file) => file.type);
    this.documentType = fileTypes;
    this.namesVariable = fileNames;
    this.showDocInfo = true;
  }

  deleteFile() {
    this.namesVariable = [];
    this.documentType = [];
    this.showDocInfo = false;
    this.fileID = '';
  }
  submitResponse(): void {
    if (this.form.valid) {
      this.spinner.show();
      console.log(this.form.value, this.payload,this.endorsementInfo,'hh')
      this.form.value.doc = this.fileID;
      let data:any = {};
      data = this.payload;
      data.agentCode = localStorage.getItem('agentCode');
      data.memberName = this.endorsementInfo.policyDetails.membername;
      data.mobileNumber = this.endorsementInfo.policyDetails.primaryMobile;
      data.memberRelation = this.selectMemberData.relationwithproposer;
      data.endorsementRequest.policy = this.endorsementInfo.policyDetails.policynumber;
      data.endorsementRequest.caseSubSubType = this.form.value.endorsementType;
      data.endorsementRequest.comments = this.form.value.notes;
      data.endorsementRequest.endorsementRequest = this.form.value.doc;
      data.endorsementRequest.customerID = this.form.value.proposalNumber;
      this.endorsementService.endorsementCreateRequestApi(data).subscribe(
        (response: any) => {
          if (response.isSuccess) {
            this.spinner.hide();
            const endorsementType = this.form.value.endorsementType;
            if(endorsementType === 'Aadhar Card Update' || endorsementType === 'Pancard Update' && response.response.caseId !== null) {
              this.fileUploadApi(response.response.caseId);
            }
            if(response.response.caseId === null) {
              this.toast.success({ detail: `${response.response.statusMessage}`});
            } else {
              this.toast.success({ detail: `Your request ${response.response.caseId} has been registered`});
            }
            this.router.navigate(['portal/agent/requests']);
          }
        },
        (error) => {
          this.spinner.hide();
          console.error('Error fetching dropdown data', error);
        }
      );
    } else {
      this.toast.error({ detail: 'Please fill in the required form fields.' });
    }
  }

  fileUploadApi(caseId : string) : any {
    const newCaseId = caseId.replace(/-/g, ''); 
    const formData = new FormData();
    let id: any = localStorage.getItem('agentCode');
    this.uploadedFiles.forEach((file, index) => {
      formData.append(`AgentCode`, id);
      formData.append(`ReferenceId`, this.endorsementInfo.policyDetails.qouteId);
      formData.append(`CaseId`, newCaseId);
      formData.append(`Files`, file.file, file.file.name);
    });
    this.endorsementService.endorsementUploadFilesApi(formData).subscribe(
      (response) => {
        if (response.success) {
          this.fileID = 'ewufuye7f28784y8747';
        }
      },
      (error) => {
        console.error('File Upload was Failed', error);
      }
    );
}
}
