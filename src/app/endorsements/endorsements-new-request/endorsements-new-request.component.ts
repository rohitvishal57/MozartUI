import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { interval, map, Observable, startWith, take } from 'rxjs';
import { Helper } from 'src/app/utilities/helper/helper';
import { MatDialog } from '@angular/material/dialog';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { EndorsementsRequestsService } from '../endorsements-requests/endorsements-requests.service';
import { NgToastService } from 'ng-angular-popup';
import { LoginService } from 'src/app/login/login/login.service';
declare var bootstrap: any;

@Component({
  selector: 'app-endorsements-new-request',
  templateUrl: './endorsements-new-request.component.html',
  styleUrls: ['./endorsements-new-request.component.scss'],
})
export class EndorsementsNewRequestComponent implements OnInit {
  otpModal: any;
  caseCreationForm: FormGroup | any;
  userData: any;
  modalRef?: BsModalRef; // Reference to modal instance
  otp: string[] = ['', '', '', '', '', ''];  // Initialize OTP array
  timeLeft: number = 60;
  isTimerRunning: boolean = false;
  endorseMentList: [
    {
      name: "Fresh";
    },
    {
      name: "Renewal";
    }
  ] | any;
  selctedFileName: string = '';
  isFilenotSelected: boolean | any;
  selectedFile: any;
  showNote: boolean = false;
  formCntrlVal: any;
  policies: any;
  namesVariable: any;
  documentType: any;
  showDocInfo: boolean = false;
  policiesListData: any[] = [];
  endorsementTypes = [
    {
      name: "Aadhar Card Update",
      value: "aadharNumber"
    },
    {
      name: "Pancard Update",
      value: "panNumber"
    },
    {
      name: "Change my Primary Registered Number",
      value: "primaryContactNumber"
    },
    {
      name: "Change my Alternate number",
      value: "alternateContactNumber"
    },
    {
      name: "Change in my Email ID",
      value: "email"
    },
    {
      name: "Change my Alternate Email ID",
      value: "alternateEmail"
    },
    {
      name: "Change my Primary Registered Number- Member",
      value: "memberPrimaryContactNumber"
    },
    {
      name: "Change my Alternate number- member",
      value: "memberAlternateContactNumber"
    },
    {
      name: "Change in my Email ID- member",
      value: "memberEmail"
    },
    {
      name: "Change my Alternate Email ID - member",
      value: "memberAlternateEmail"
    },
    {
      name: "Change of Nominee",
      value: "nomineeContact"
    },
    {
      name: "Change in International Contact Number",
      value: "internationalContactNumber"
    },  
    {
      name: "Change in International Address",
      value: "ChangeinInternationalAddress"
    },
    /* {
      name: "Change in Bank details",
      value: "memberAlternateContactNumber"
    },
    {
      name: "Change in Communication Address",
      value: "memberAlternateContactNumber"
    },
    {
      name: "Change in Educational Qualification",
      value: "memberAlternateContactNumber"
    },
    {
      name: "Change in height and weight",
      value: "memberAlternateContactNumber"
    },
    {
      name: "Change in Marital Status",
      value: "memberAlternateContactNumber"
    },
    {
      name: "Change in Occupation details",
      value: "memberAlternateContactNumber"
    },
    {
      name: "Change in relationship",
      value: "memberAlternateContactNumber"
    },
    {
      name: "Change my name",
      value: "memberAlternateContactNumber"
    },
    {
      name: "Addition of member/child- Premium calculation",
      value: "memberAlternateContactNumber"
    },
    {
      name: "Addition of member/child- Premium recieved",
      value: "memberAlternateContactNumber"
    },
    {
      name: "Addition of new born",
      value: "memberAlternateContactNumber"
    },
    {
      name: "Addition of spouse",
      value: "memberAlternateContactNumber"
    }, 
    {
      name: "Correction in DOB",
      value: "memberAlternateContactNumber"
    },
    {
      name: "Correction in Gender",
      value: "memberAlternateContactNumber"
    },
    {
      name: "Correction in nominee contact number",
      value: "memberAlternateContactNumber"
    },
    {
      name: "Deletion of Member from Policy",
      value: "memberAlternateContactNumber"
    },
    {
      name: "Details correction in E-health card",
      value: "memberAlternateContactNumber"
    },
    {
      name: "Disclosure of portability details",
      value: "memberAlternateContactNumber"
    },
    {
      name: "DRM endorsement",
      value: "memberAlternateContactNumber"
    },
    {
      name: "Incorrect Address got updated",
      value: "memberAlternateContactNumber"
    },
    {
      name: "Salutation change",
      value: "memberAlternateContactNumber"
    },
    {
      name: "Updation in GST Number",
      value: "memberAlternateContactNumber"
    },
    {
      name: "Updation in Portability details",
      value: "memberAlternateContactNumber"
    },
    {
      name: "Updation of EIA Number",
      value: "memberAlternateContactNumber"
    },
    {
      name: "Updation of Intermediary Code",
      value: "memberAlternateContactNumber"
    },
    {
      name: "Updation of Loan account number",
      value: "memberAlternateContactNumber"
    } */
  ];
  filteredActivity: Observable<any[]> | any;
  MemberfilteredActivity: Observable<any[]> | undefined;
  selectedPolicyNumber: any;
  MemberIdList: any;
  activityList:any = [];
  memberActivityList:any = [];
  submitted = false;
  validatedMobileNumber: any;
  CaseSubSubTypeValue: any;
  agentCode: any = '';
  // otpValue = new FormControl;
  showOtpSection: boolean = false;
  enteredOtp: any
  requestId: any;
  otpObj: any;
  controlOfInput: any;
  selectedMember: any;
  policyInfoDetails: any;
  externalPolicyData: any;
  isDisabled: boolean = true;
  isOtpSubmitDisabled: boolean = true;
  sendOtptDisabled: boolean = true;
  otpInfoObject: any = null;
  timerCounter: { min: number; sec: number; } | any;
  selectedFormControlVal: any;
  screenSize: number | any;
  isDesktop: boolean = false;
  documentSize: any;
  uploadDoc: boolean = true;
  otpErrorMsge:boolean = false;
  errorMessage: string | undefined;

  constructor(private formBuilder: FormBuilder,
    private modalService: BsModalService,
    private endorsement_service: EndorsementsRequestsService,
    private loginservice : LoginService,
    private toast: NgToastService,
    private _router: Router,
    private dialog: MatDialog) {
  }
  ngOnInit() {
    this.isDesktop = this.screenSize > 768;
    this.agentCode = localStorage.getItem('agentCode');
    this.otpModal = new bootstrap.Modal(document.getElementById('otpModal'));
    this.getPolicyNumbers();
    this.initForm();
  }
  initForm() {
    this.caseCreationForm = this.formBuilder.group({
      policyNumber: ['', Validators.required],
      member: ['', Validators.required],
      endorsementType: ['', Validators.required],
      currentPolicyDetails: [''],
      address1: [''],
      address2: [''],
      pincode: [''],
      endorsementDetails: this.formBuilder.group({
        // otpValue: [''],
        aadharNumber: [''],
        alternateContactNumber: [''],
        email: [''],
        internationalAddress: [''],
        internationalContactNumber: [''],
        nomineeName: [''],
        nomineeRelationship: [''],
        nomineeContact: [''],
        panNumber: [''],
        primaryContactNumber: [''],
        alternateEmail: [''],
        memberEmail: [''],
        memberAlternateEmail: [''],
        memberPrimaryContactNumber: [''],
        memberAlternateContactNumber: [''],
      }),
      asignedTeam: ['Endorsement - Non financial'],
      addNotes: ['']
    });
  }
  validatePanInput(event: any): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.toUpperCase();  // Convert to uppercase for PAN format
    this.caseCreationForm.get('endorsementDetails.panNumber')?.setValue(input.value);
  }
  get f(): { [key: string]: AbstractControl } {
    return this.caseCreationForm.get('endorsementDetails')['controls'];
  }
  getPolicyNumbers() {
    let data={
      UserId: this.agentCode
    }
    this.endorsement_service.getactivepolicynumbersApi(data).subscribe(
      (resp:any) => {
        if (resp && resp.statusCode == "200" && resp.isSuccess) {
          this.policies = resp.getPolicydetails;
          this.policiesListData = this.removeDuplicates(this.policies, "policynumber");
          this.getActivityType();
          this.getMemberActivityType();
        }
      },
      (err) => {
        console.log(err);
      });
    // this._baseService.getReq(environment.baseURL + environment.api_URLs.user.validateToken + "?token=" + token + "&source=SELLER&action=" + action, this.authenticationEvent.ValidateToken);
  }
  validateNumberInput(event: any): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '');  // Remove non-numeric characters
    if (input.value.length > 6) {
      input.value = input.value.slice(0, 6);  // Limit the input to 6 digits
    }
    this.caseCreationForm.get('pincode')?.setValue(input.value);  // Update form control value
  }
  removeDuplicates(myArray:any, Prop:any) {
    return myArray.filter((obj:any, pos:any, arr:any) => {
      return arr.map((mapObj:any) => mapObj[Prop]).indexOf(obj[Prop]) === pos;
    });
  }
  onChange(event:any) {
    const value = event.target.value;
    // this.caseCreationForm.get('endorsementType').reset();
    this.caseCreationForm.get('asignedTeam').reset();
    this.caseCreationForm.get('member').reset();
    this.caseCreationForm.get('member').setValue('');
    this.caseCreationForm.get('endorsementType').reset();
    this.caseCreationForm.get('endorsementType').setValue('');
    this.caseCreationForm.get('asignedTeam').setValue('Endorsement - Non financial');
    this.caseCreationForm.get('endorsementDetails').reset();
    this.caseCreationForm.get('addNotes').reset();
    this.selctedFileName = "";
    this.showOtpSection = false;
    if(value == ""){
      this.caseCreationForm.get('policyNumber').reset();
    }

    // Reset filteredActivity to display all policy numbers again after each selection
    this.filteredActivity = this.caseCreationForm.controls['policyNumber'].valueChanges.pipe(
      startWith(''),
      map((val: any) => this.activityList.slice())  // Ensure full list is restored
    );
  }
  getActivityType(content = null) {
    this.activityList = this.policiesListData;
    this.filteredActivity = this.caseCreationForm.controls['policyNumber'].valueChanges.pipe(
      startWith(''),
      map((value:any) => value ? this._filter(value) : this.activityList.slice()));
  }
  _filter(value: string) {
    const filterValue = this._normalizeValue(this._removealphabets(value));
    const filteredValue = this.activityList.filter((x:any) => this._normalizeValue(x.policynumber).includes(filterValue));
    this.selectedPolicyNumber = filteredValue;
    if(this.selectedPolicyNumber.length > 0){
      this.getMemberIdList(this.selectedPolicyNumber);
    }
    return filteredValue;
  }
  getMemberIdList(policyNumber:any) {
    let selectedValue = policyNumber[0].policynumber;
    const result = this.policies.filter((x:any) => selectedValue.includes(x.policynumber));
    this.MemberIdList = result;
  }
  getMemberActivityType(content = null) {
    this.memberActivityList = this.policiesListData.filter(value => value.memberid != null);
    this.MemberfilteredActivity = this.caseCreationForm.controls['member'].valueChanges.pipe(
      startWith(''),
      map((value:any) => value ? this._memberfilter(value) : this.memberActivityList.slice()));
  }
  _memberfilter(value: string) {
    const filterValue = this._normalizeValue(value);
    const filteredValue = this.memberActivityList.filter((x:any) => this._normalizeValue(x.memberid).includes(filterValue));
    return filteredValue;
  }
  _normalizeValue(value: string): string {
    return value.toLowerCase().replace(/\s/g, '');
  }
  _removealphabets(value: any) {
    return value.replace(/[^\d.-]/g, '');
  }
  endorsementChange(event:any) {
    const value = event.target.value;
    // this.caseCreationForm.get('endorsementDetails').setValue("");
    this.caseCreationForm.get('endorsementDetails').reset();
    this.caseCreationForm.get('addNotes').reset();
    this.caseCreationForm.get("currentPolicyDetails").reset();
    this.selctedFileName = "";
    this.setDefault();
    if (value == 'aadharNumber') {
      this.caseCreationForm.get("endorsementDetails").get('aadharNumber').setValidators([Validators.required, Validators.pattern('^[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$')]);
      this.caseCreationForm.get("endorsementDetails").get('aadharNumber').updateValueAndValidity();
      this.caseCreationForm.get("currentPolicyDetails").setValue(this.externalPolicyData?.policyData[0]?.aadharCradNo);
    }
    if (value == 'ChangeinInternationalAddress') {
      this.caseCreationForm.get("address1").setValidators([Validators.required, Validators.pattern('^[0-9a-zA-Z ,]*$')]);
      this.caseCreationForm.get('address1').updateValueAndValidity();
      this.caseCreationForm.get('address2').setValidators([Validators.required, Validators.pattern('^[0-9a-zA-Z ,]*$')]);
      this.caseCreationForm.get('address2').updateValueAndValidity();
      this.caseCreationForm.get('pincode').setValidators([Validators.required, Validators.pattern('^[0-9a-zA-Z ,]*$')]);
      this.caseCreationForm.get('pincode').updateValueAndValidity();
    }
    if (value == 'alternateContactNumber') {
      this.caseCreationForm.get("endorsementDetails").get('alternateContactNumber').setValidators([Validators.required, Validators.pattern("[0-9 ]{10}")]);
      this.caseCreationForm.get("endorsementDetails").get('alternateContactNumber').updateValueAndValidity();
      this.caseCreationForm.get("currentPolicyDetails").setValue(this.externalPolicyData?.policyData[0]?.alternate_Mobile_Number);
      
      // this.caseCreationForm.get("endorsementDetails").get('otpValue').setValidators([Validators.required, Validators.pattern("[0-9 ]{6}")]);
      // this.caseCreationForm.get("endorsementDetails").get('otpValue').updateValueAndValidity();
    }
    if (value == 'internationalContactNumber') {
      this.caseCreationForm.get("endorsementDetails").get('internationalContactNumber').setValidators([Validators.required, Validators.pattern("[0-9 ]{10}")]);
      this.caseCreationForm.get("endorsementDetails").get('internationalContactNumber').updateValueAndValidity();
      // this.caseCreationForm.get("endorsementDetails").get('otpValue').setValidators([Validators.required, Validators.pattern("[0-9 ]{6}")]);
      // this.caseCreationForm.get("endorsementDetails").get('otpValue').updateValueAndValidity();
    }
    if (value == 'nomineeContact') {
      this.caseCreationForm.get("endorsementDetails").get('nomineeContact').setValidators([Validators.required, Validators.pattern("[0-9 ]{10}")]);
      this.caseCreationForm.get("endorsementDetails").get('nomineeContact').updateValueAndValidity();
      this.caseCreationForm.get("endorsementDetails").get('nomineeName').setValidators([Validators.required]);
      this.caseCreationForm.get("endorsementDetails").get('nomineeName').updateValueAndValidity();
      this.caseCreationForm.get("endorsementDetails").get('nomineeRelationship').setValidators([Validators.required]);
      this.caseCreationForm.get("endorsementDetails").get('nomineeRelationship').updateValueAndValidity();
      if(this.externalPolicyData?.policyData?.length > 0){
        this.caseCreationForm.get("currentPolicyDetails").setValue(this.externalPolicyData?.policyData[0]?.nominee_Details[0]?.nominee_first_name + ", " + this.externalPolicyData?.policyData[0]?.nominee_Details[0]?.relationship + ", " + this.externalPolicyData?.policyData[0]?.nominee_Details[0]?.nominee_Contact_No);
      }
    }
    if (value == 'primaryContactNumber') {
      this.caseCreationForm.get("endorsementDetails").get('primaryContactNumber').setValidators([Validators.required, Validators.pattern("[0-9 ]{10}")]);
      this.caseCreationForm.get("endorsementDetails").get('primaryContactNumber').updateValueAndValidity();
      // this.caseCreationForm.get("endorsementDetails").get('otpValue').setValidators([Validators.required, Validators.pattern("[0-9 ]{6}")]);
      // this.caseCreationForm.get("endorsementDetails").get('otpValue').updateValueAndValidity();
      this.caseCreationForm.get("currentPolicyDetails").setValue(this.policyInfoDetails?.policyDetails?.primaryMobile);
    }
    if (value == 'memberPrimaryContactNumber') {
      this.caseCreationForm.get("endorsementDetails").get('memberPrimaryContactNumber').setValidators([Validators.required, Validators.pattern("[0-9 ]{10}")]);
      this.caseCreationForm.get("endorsementDetails").get('memberPrimaryContactNumber').updateValueAndValidity();
      // this.caseCreationForm.get("endorsementDetails").get('otpValue').setValidators([Validators.required, Validators.pattern("[0-9 ]{6}")]);
      // this.caseCreationForm.get("endorsementDetails").get('otpValue').updateValueAndValidity();memberMobileNo
      this.caseCreationForm.get("currentPolicyDetails").setValue(this.policyInfoDetails?.policyDetails?.memberMobileNo);
    }
    if (value == 'memberAlternateContactNumber') {
      this.caseCreationForm.get("endorsementDetails").get('memberAlternateContactNumber').setValidators([Validators.required, Validators.pattern("[0-9 ]{10}")]);
      this.caseCreationForm.get("endorsementDetails").get('memberAlternateContactNumber').updateValueAndValidity();
      // this.caseCreationForm.get("endorsementDetails").get('otpValue').setValidators([Validators.required, Validators.pattern("[0-9 ]{6}")]);
      // this.caseCreationForm.get("endorsementDetails").get('otpValue').updateValueAndValidity();
    }
    if (value == 'email') {
      this.caseCreationForm.get("endorsementDetails").get('email').setValidators([Validators.required, Validators.email, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]);
      this.caseCreationForm.get("endorsementDetails").get('email').updateValueAndValidity();
      this.caseCreationForm.get("currentPolicyDetails").setValue(this.policyInfoDetails?.policyDetails?.primaryEmailId);
    }
    if (value == 'alternateEmail') {
      this.caseCreationForm.get("endorsementDetails").get('alternateEmail').setValidators([Validators.required, Validators.email, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]);
      this.caseCreationForm.get("endorsementDetails").get('alternateEmail').updateValueAndValidity();
      this.caseCreationForm.get("currentPolicyDetails").setValue(this.externalPolicyData?.policyData[0]?.alternate_Email_Id);

    }
    if (value == 'memberEmail') {
      this.caseCreationForm.get("endorsementDetails").get('memberEmail').setValidators([Validators.required, Validators.email, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]);
      this.caseCreationForm.get("endorsementDetails").get('memberEmail').updateValueAndValidity();
      this.caseCreationForm.get("currentPolicyDetails").setValue(this.policyInfoDetails?.policyDetails?.memberEmailID);
    }
    if (value == 'memberAlternateEmail') {
      this.caseCreationForm.get("endorsementDetails").get('memberAlternateEmail').setValidators([Validators.required, Validators.email, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]);
      this.caseCreationForm.get("endorsementDetails").get('memberAlternateEmail').updateValueAndValidity();
    }
    if (value == 'panNumber') {
      this.caseCreationForm.get("endorsementDetails").get('panNumber').setValidators([Validators.required, Validators.pattern('^([A-Z]){5}([0-9]){4}([A-Z]){1}$')]);
      this.caseCreationForm.get("endorsementDetails").get('panNumber').updateValueAndValidity();
      this.caseCreationForm.get("currentPolicyDetails").setValue(this.externalPolicyData?.policyData[0]?.panNo);
    }

    if (value === 'panNumber' || value === 'aadharNumber'|| value=='ChangeinInternationalAddress') {
      this.uploadDoc = true;
      this.showOtpSection = false;
      this.isDisabled = false;
    } else {
      this.uploadDoc = false;
      this.showOtpSection = true;
      this.isDisabled = true;
    }

    if (value === 'nomineeContact') {
      this.showOtpSection = false;
    }

    if ((value === 'panNumber' || value === 'aadharNumber') && this.submitted) {
      // this.isFilenotSelected = true;
    }
    else{
      this.isFilenotSelected = false;
      this.showNote = false;
    }
  }
  onKeydown(e:any) {
    return Helper.isNumberValidation(e);
  }
  onKeydownInternationalContactNumber(event:any){
    const allowedKeys = [
      'Backspace',
      'Tab',
      'ArrowLeft',
      'ArrowRight',
      'Delete'
  ];

  // Allow number keys and hyphen
  const isNumberOrHyphen = /^[0-9-]$/.test(event.key);

  if (!allowedKeys.includes(event.key) && !isNumberOrHyphen) {
      event.preventDefault();
  }
  }
  setDefault() {
    this.caseCreationForm.get("endorsementDetails").get('aadharNumber').clearValidators();
    this.caseCreationForm.get("endorsementDetails").get('aadharNumber').updateValueAndValidity();
    this.caseCreationForm.get("endorsementDetails").get('alternateContactNumber').clearValidators();
    this.caseCreationForm.get("endorsementDetails").get('alternateContactNumber').updateValueAndValidity();
    this.caseCreationForm.get("endorsementDetails").get('internationalContactNumber').clearValidators();
    this.caseCreationForm.get("endorsementDetails").get('internationalContactNumber').updateValueAndValidity();
    this.caseCreationForm.get("endorsementDetails").get('nomineeContact').clearValidators();
    this.caseCreationForm.get("endorsementDetails").get('nomineeContact').updateValueAndValidity();
    this.caseCreationForm.get("endorsementDetails").get('nomineeName').clearValidators();
    this.caseCreationForm.get("endorsementDetails").get('nomineeName').updateValueAndValidity();
    this.caseCreationForm.get("endorsementDetails").get('nomineeRelationship').clearValidators();
    this.caseCreationForm.get("endorsementDetails").get('nomineeRelationship').updateValueAndValidity();
    this.caseCreationForm.get("endorsementDetails").get('primaryContactNumber').clearValidators();
    this.caseCreationForm.get("endorsementDetails").get('primaryContactNumber').updateValueAndValidity();
    this.caseCreationForm.get("endorsementDetails").get('memberPrimaryContactNumber').clearValidators();
    this.caseCreationForm.get("endorsementDetails").get('memberPrimaryContactNumber').updateValueAndValidity();
    this.caseCreationForm.get("endorsementDetails").get('memberAlternateContactNumber').clearValidators();
    this.caseCreationForm.get("endorsementDetails").get('memberAlternateContactNumber').updateValueAndValidity();
    this.caseCreationForm.get("endorsementDetails").get('email').clearValidators();
    this.caseCreationForm.get("endorsementDetails").get('email').updateValueAndValidity();
    this.caseCreationForm.get("endorsementDetails").get('alternateEmail').clearValidators();
    this.caseCreationForm.get("endorsementDetails").get('alternateEmail').updateValueAndValidity();
    this.caseCreationForm.get("endorsementDetails").get('memberEmail').clearValidators();
    this.caseCreationForm.get("endorsementDetails").get('memberEmail').updateValueAndValidity();
    this.caseCreationForm.get("endorsementDetails").get('memberAlternateEmail').clearValidators();
    this.caseCreationForm.get("endorsementDetails").get('memberAlternateEmail').updateValueAndValidity();
    this.caseCreationForm.get("endorsementDetails").get('panNumber').clearValidators();
    this.caseCreationForm.get("endorsementDetails").get('panNumber').updateValueAndValidity();
    // this.caseCreationForm.get("endorsementDetails").get('otpValue').clearValidators();
    // this.caseCreationForm.get("endorsementDetails").get('otpValue').updateValueAndValidity();
  }
  onSubmit() {
    this.submitted = true;
    if (!this.caseCreationForm.valid) {
      return;
    }
    let selectedType = this.caseCreationForm.get('endorsementType').value;
    if (selectedType == 'alternateContactNumber' || selectedType == 'internationalContactNumber' || selectedType == 'primaryContactNumber' || selectedType == 'memberPrimaryContactNumber' || selectedType == 'memberAlternateContactNumber') {
      this.validatedMobileNumber = this.caseCreationForm.get("endorsementDetails").get(selectedType).value;
      if(this.validatedMobileNumber != this.otpObj.MobileNumber){
        //this.confirmationDialogService.confirm("Confirm Text", "Mobile number is not validated please do otp validation");
        return;
      }
    }
    if (this.caseCreationForm.get("endorsementType").value === 'panNumber' || this.caseCreationForm.get("endorsementType").value === 'aadharNumber') {
      if (this.selctedFileName === "") {
        // this.showNote = true;
        this.isFilenotSelected = true;
        return;
      }
    } else {
      this.showNote = false;
      this.isFilenotSelected = false;
    }
    if (this.caseCreationForm.get("endorsementType").value != "") {
      this.CaseSubSubTypeValue = this.endorsementTypes.find((obj) => {
        return obj.value === this.caseCreationForm.get("endorsementType").value;
      });
      console.log("Case Sub sub type:",this.CaseSubSubTypeValue)
    }
    let payloadObj:any = {
      AgentCode: this.agentCode,
      MemberName: this.selectedMember.membername,
      MobileNumber: this.policyInfoDetails.policyDetails.primaryMobile,
      MemberRelation: this.selectedMember.relationwithproposer,
      EndorsementRequest: {
        ActivityDescription: null,
        ActivitySubject: null,
        AssignedTeam: this.caseCreationForm.get("asignedTeam").value,
        AssignedUser: null,
        AttachmentContent: null,
        AttachmentName: null,
        AttachmentType: null,
        CaseSubSubType: this.CaseSubSubTypeValue.name,
        CaseSubType: "Endorsement",
        CaseTitle: null,
        CaseType: "Endorsement",
        Category: "Request",
        Comments: null,
        CreatedOn: null,
        Customer: this.caseCreationForm.get("member").value,
        CustomerID: null,
        CustomerType: "Retail Customer",
        IsClosed: "Yes",
        ModifiedOn: null,
        NotesDescription: null,
        NotesTitle: null,
        Origin: "DE-ABHICONNECT",
        Policy: this.caseCreationForm.get("policyNumber").value,
        PolicyStatus: null,
        Priority: null,
        Product: this.policyInfoDetails.policyDetails.productName,
        Status: null,
        CreateAttachment: null,
        EndorsementDetails: {
          AadharCardNo: this.caseCreationForm.get("endorsementDetails").get("aadharNumber").value != null ? this.caseCreationForm.get("endorsementDetails").get("aadharNumber").value.toString() : this.caseCreationForm.get("endorsementDetails").get("aadharNumber").value,
          PrimaryContactNumber: this.caseCreationForm.get("endorsementDetails").get("primaryContactNumber").value != null ? this.caseCreationForm.get("endorsementDetails").get("primaryContactNumber").value.toString() : this.caseCreationForm.get("endorsementDetails").get("primaryContactNumber").value,
          AlternateContactNumber: this.caseCreationForm.get("endorsementDetails").get("alternateContactNumber").value != null ? this.caseCreationForm.get("endorsementDetails").get("alternateContactNumber").value.toString() : this.caseCreationForm.get("endorsementDetails").get("alternateContactNumber").value,
          MemberPrimaryContactNumber: this.caseCreationForm.get("endorsementDetails").get("memberPrimaryContactNumber").value != null ? this.caseCreationForm.get("endorsementDetails").get("memberPrimaryContactNumber").value.toString() : this.caseCreationForm.get("endorsementDetails").get("memberPrimaryContactNumber").value,
          MemberAlternateContactNumber: this.caseCreationForm.get("endorsementDetails").get("memberAlternateContactNumber").value != null ? this.caseCreationForm.get("endorsementDetails").get("memberAlternateContactNumber").value.toString() : this.caseCreationForm.get("endorsementDetails").get("memberAlternateContactNumber").value,
          InternationalContactNumber: this.caseCreationForm.get("endorsementDetails").get("internationalContactNumber").value != null ? this.caseCreationForm.get("endorsementDetails").get("internationalContactNumber").value.toString() : this.caseCreationForm.get("endorsementDetails").get("internationalContactNumber").value,
          Email: this.caseCreationForm.get("endorsementDetails").get("email").value,
          AlternateEmail: this.caseCreationForm.get("endorsementDetails").get("alternateEmail").value,
          MemberEmail: this.caseCreationForm.get('endorsementDetails').get('memberEmail').value,
          MemberAlternateEmail: this.caseCreationForm.get('endorsementDetails').get('memberAlternateEmail').value,
          InternationalAddress: this.caseCreationForm.get("endorsementDetails").get("internationalAddress").value,
          NomineeName: this.caseCreationForm.get("endorsementDetails").get("nomineeName").value,
          NomineeRelationship: this.caseCreationForm.get("endorsementDetails").get("nomineeRelationship").value,
          NomineeContact: this.caseCreationForm.get("endorsementDetails").get("nomineeContact").value != null ? this.caseCreationForm.get("endorsementDetails").get("nomineeContact").value.toString() : this.caseCreationForm.get("endorsementDetails").get("nomineeContact").value,
          Country: null,
          PanCardNo: this.caseCreationForm.get("endorsementDetails").get("panNumber").value != null ? this.caseCreationForm.get("endorsementDetails").get("panNumber").value.toString() : this.caseCreationForm.get("endorsementDetails").get("panNumber").value,
        }
      }
    }
    this.endorsement_service.endorsementCreateRequestApi(payloadObj).subscribe(
      (resp) => {
        if (resp && resp.statusCode == "200" && resp.isSuccess) {
          if (resp.response.caseId != null) {
            if (this.caseCreationForm.get("endorsementType").value === 'panNumber' || this.caseCreationForm.get("endorsementType").value === 'aadharNumber') {
              if (!this.selectedFile) {
                this.isFilenotSelected = true;
                return;
              }
              let caseID = resp.response.caseId;
              let ccID = caseID.replace(/[$-]/g, '');
              let file = this.selectedFile;
              let fileExt = file.name.replace(/^.*\./, '');
              const data = new FormData();
              if (fileExt == 'pdf' || fileExt == 'jpeg' || fileExt === 'png' || fileExt == 'jpg') {
                data.append('Files', file)
                data.append('CaseId', ccID)
                data.append('ReferenceId', this.policyInfoDetails?.policyDetails?.qouteId)
                data.append('agentCode', this.agentCode)
                
                this.endorsement_service.endorsementUploadFilesApi(data)
                  .pipe()
                  .subscribe((Respevent:any) => {
                    let event: any = Respevent;
                    if (Respevent && Respevent.statusCode == "200" && Respevent.isSuccess) {
                      this.toast.success({ detail: `Your request ${resp.response.caseId} has been registered`});
                    } 
                    else {
                      this.toast.error({ detail: `${resp.response.statusMessage}`});
                    }
                    this.backToEndorsment();
                  }, (error:any) => {
                    console.log(error);
                  });
              }
            }
            else {
              this.toast.success({ detail: `Your request ${resp.response.caseId} has been registered`});
              this.backToEndorsment();
            }
          }
          else {
            this.toast.error({ detail: `${resp.response.statusMessage}`});
            this.backToEndorsment();
          }
        }
      },
      (err) => {
        console.log(err);
        this.selctedFileName = "";
      });
  }
  backToEndorsment() {
    this._router.navigate(["endorsements"]);
  }
  initiateKyc() {
    console.log(this.caseCreationForm.value);
  }
  shareKycLink() {
    console.log(this.caseCreationForm.value);
  }
  newfile(e:any) {
    let files;
    let file;
    let fileExt;
    this.isFilenotSelected = false;
    if (e) {
      files = e.target.files;
      file = files[0];
      if (!file) {
        return;
      }
      this.selectedFile = file;
      this.selctedFileName = this.selectedFile.name;
      fileExt = this.selectedFile.name.replace(/^.*\./, '');
      e.target.value = '';
    }
    this.namesVariable = file.name;
    this.documentType = file.type;
    this.documentSize = this.convertBytesToKB(file.size);

    if (fileExt == 'pdf' || fileExt == 'jpeg' || fileExt === 'png' || fileExt == 'jpg') {
      this.showNote = false;
      this.showDocInfo = true;
    } else {
      this.showNote = true;
    }
  }

  convertBytesToKB(bytes: number): string {
    const kb = bytes / 1024;
    return `${kb.toFixed(2)} KB`;
  }
  
  openOtpPopup() {
    this.otp = ['', '', '', '', '', ''];
    this.otpModal.show();
  }

  closeOtpPopup() {
    this.otpModal.hide();
  }

  sendOTP() {
    this.otpErrorMsge = false;
    let selectedType = this.caseCreationForm.get('endorsementType').value;
    this.otpObj = {
      agentCode: this.agentCode,
      EmailId: null,
      MobileNumber: null
    }
    if (selectedType == 'alternateContactNumber' || selectedType == 'internationalContactNumber' || selectedType == 'primaryContactNumber' || selectedType == 'memberPrimaryContactNumber' || selectedType == 'memberAlternateContactNumber') {
      this.otpObj.MobileNumber = this.caseCreationForm.get("endorsementDetails").get(selectedType).value;
    } else {
      this.otpObj.EmailId = this.caseCreationForm.get("endorsementDetails").get(selectedType).value;
    }
    this.endorsement_service.endorsementSendOtpApi(this.otpObj).subscribe(
      (resp : any) => {
        if (resp && resp.statusCode == "200" && resp.isSuccess) {
          this.otpInfoObject = {
            requestId: resp.requestId,
            otp: "",
          };
          this.openOtpPopup();
          this.timeLeft = 60;
          this.startTimer();
          this.sendOtptDisabled = false;
        }
        else {
          this.sendOtptDisabled = false;
          this.toast.error({ detail: resp.errorMessage});
        }
      },
      (err) => {
        console.log(err);
        this.sendOtptDisabled = false;
        this.toast.error({ detail: "Something went wrong! Please try again later."});
      });
  }
  validateOTP() {
    const otpCode = this.otp.join('');
    if(otpCode.length == 6){
      let modal = {
        agentCode: this.agentCode,
        RequestId: this.otpInfoObject.requestId,
        OTPNumber: otpCode,
        emailId: this.otpObj.EmailId,
        Mobile: this.otpObj.MobileNumber,
      };
      this.loginservice.validateOtpRequestApi(modal).subscribe(
        (resp:any) => {
          if (resp && resp.statusCode == "200" && resp.isSuccess) {
            if (resp && resp.statusMessage) {
               this.toast.success({ detail: resp.statusMessage});
               this.closeOtpPopup();
               this.isDisabled = false;
               this.sendOtptDisabled = true;
            } else {
              this.otpErrorMsge = true;
              this.errorMessage = "Something went wrong, please try again";
              this.isDisabled = false;
              this.sendOtptDisabled = false;
             // this.toast.error({detail: "Something went wrong, please try again"})
            }
           
          } 
          else {
            if (resp && resp.errorMessage) {
              this.otpErrorMsge = true;
              this.errorMessage = resp.errorMessage;
              // this.toast.error({ detail: resp.errorMessage});
            } else {
              this.toast.error({detail: "Something went wrong, please try again"})
            }
            this.sendOtptDisabled = false;
          }
        },
        (err:any) => {
            this.otpInfoObject = null;
            this.sendOtptDisabled = false;
            this.closeOtpPopup();
            this.toast.error({detail: "Something went wrong, please try again"});
        }
      );
      this.otpErrorMsge = false;
    }else{
      this.otpErrorMsge = true;
      this.errorMessage = "Please Enter Valid OTP"
    }
  
  }
  memberIdChange(event:any) {
    const member = event.target.value;
    this.selectedMember = this.policies.find((obj:any) => {
      return obj.memberid === member;
    });
    if(this.selectedMember != ""){
      let policyObj = {
        policyNumber:this.selectedMember.policynumber,
        MemberId:this.selectedMember.memberid
      }
      this.endorsement_service.getEndorsementPolicyInfoApi(policyObj).subscribe(
        (resp:any) => {
          if (resp && resp.statusCode == "200" && resp.isSuccess) {
            this.policyInfoDetails = resp;
            this.externalPolicyData = this.policyInfoDetails.externalPolicyData.response;
          }
          else {
            this.toast.error({ detail: `${resp.response.statusMessage}`});
          }
        },
        (err) => {
          console.log(err);
          this.toast.error({ detail: "Something went wrong! Please try again later."});
        });
    }
  }

  mobAndEmailValueChange(enteredValue:any, formControlName:any){
    if (enteredValue != "" && this.caseCreationForm.get("endorsementDetails").get(formControlName).valid) {
      this.sendOtptDisabled = false;
    } else {
      this.sendOtptDisabled = true;
    }
  }
  
  resendOTP(){
    this.otpErrorMsge = false;
    this.sendOTP();
  }

 // Start OTP timer
startTimer() {
  if (this.isTimerRunning) {
    return; // Prevent multiple timers from starting
  }

  // Initialize the timer
 
  this.isTimerRunning = true;

  // RxJS interval emits every second (1000ms)
  const timer$ = interval(1000).pipe(
    take(this.timeLeft) // Complete the observable after 'timeLeft' seconds
  );

  // Subscribe to the interval only once
  timer$.subscribe({
    next: () => {
      this.timeLeft--; // Decrease the time left by 1 every second
    },
    complete: () => {
      this.isTimerRunning = false; // Reset the flag once the timer completes
    }
  });
}

  omit_special_char(event:any) {
    var k;
    k = event.charCode;  //         k = event.keyCode;  (Both can be used)
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
  }
 
  deleteFile() {
    this.namesVariable = "";
    this.documentType = "";
    this.showDocInfo = false;
  }

  // Handle key events for OTP input
  onKey(event: KeyboardEvent, index: number) {
    event.preventDefault();
    const target = event.target as HTMLInputElement;

    // Move to the next box when a number is entered
    if (event.key >= '0' && event.key <= '9') {
      this.otp[index] = event.key;  // Store digit
      if (index < 5) {
        const nextInput = document.getElementsByClassName('otp-input')[index+1] as HTMLInputElement;
        nextInput.focus();
      }
    }

    // Handle backspace
    else if (event.key === 'Backspace') {
      this.otp[index] = '';  // Clear current box
      if (index > 0) {
        const previousInput = document.getElementsByClassName('otp-input')[index-1] as HTMLInputElement;
        previousInput.focus();
      }
    }
  }
}
