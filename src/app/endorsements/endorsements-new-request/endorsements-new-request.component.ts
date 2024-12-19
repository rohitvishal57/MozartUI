import { Component, NgZone, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, interval, map, Observable, startWith, Subject, take } from 'rxjs';
import { Helper } from 'src/app/utilities/helper/helper';
import { MatDialog } from '@angular/material/dialog';
import { EndorsementsRequestsService } from '../endorsements-requests/endorsements-requests.service';
import { NgToastService } from 'ng-angular-popup';
import { LoginService } from 'src/app/login/login/login.service';
declare var bootstrap: any;
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language.service';
import { SuccessModalComponent } from 'src/app/shared/components/success-modal/success-modal.component';

@Component({
  selector: 'app-endorsements-new-request',
  templateUrl: './endorsements-new-request.component.html',
  styleUrls: ['./endorsements-new-request.component.scss'],
})
export class EndorsementsNewRequestComponent implements OnInit {
  otpModal: any;
  caseCreationForm: FormGroup | any;
  otp: string[] = ['', '', '', '', '', ''];  // Initialize OTP array
  timeLeft: number = 30;
  timerOn = true;
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
  fileSizeError: boolean = false;
  namesVariable: any;
  documentType: any;
  showDocInfo: boolean = false;
  policiesListData: any[] = [];
  endorsementTypes = [
    {
      name: "Aadhar Card Update",
      value: "aadharNumber",
      CtstID:"ABHI_Endorsement_Request5"
    },
    {
      name: "Pancard Update",
      value: "panNumber",
      CtstID:"ABHI_Endorsement_Request4"
    },
    {
      name: "Change my Primary Registered Number",
      value: "primaryContactNumber",
      CtstID:"ABHI_Endorsement_Request15"
    },
    {
      name: "Change my Alternate number",
      value: "alternateContactNumber",
      CtstID:"ABHI_Endorsement_Request8"
    },
    {
      name: "Change in my Email ID",
      value: "email",
      CtstID:"ABHI_Endorsement_Request10"
    },
    {
      name: "Change my Alternate Email ID",
      value: "alternateEmail",
      CtstID:"ABHI_Endorsement_Request6"
    },
    /* {
      name: "Change my Primary Registered Number- Member",
      value: "memberPrimaryContactNumber",
      CtstID:"ABHI_Endorsement_Request16"
    },
    {
      name: "Change my Alternate number- member",
      value: "memberAlternateContactNumber",
      CtstID:"ABHI_Endorsement_Request9"
    },
    {
      name: "Change in my Email ID- member",
      value: "memberEmail",
      CtstID:"ABHI_Endorsement_Request11"
    },
    {
      name: "Change my Alternate Email ID - member",
      value: "memberAlternateEmail",
      CtstID:"ABHI_Endorsement_Request7"
    }, */
    {
      name: "Change of Nominee",
      value: "nomineeContact",
      CtstID:"ABHI_Endorsement_Request2"
    },
    /* {
      name: "Change in Address",
      value: "ChangeinAddress",
      CtstID:"ABHI_Endorsement_Request21"
    },
    {
      name: "Change in International Contact Number",
      value: "internationalContactNumber"
    },
    {
      name: "Change in International Address",
      value: "ChangeinInternationalAddress",
      CtstID:"ABHI_Endorsement_Request21"
    }, */
  ];
  relationships = [
    "Brother",
    "Brother in-law",
    "Daughter in-law",
    "Dependent Daughter",
    "Dependent Son",
    "Father",
    "Father-In-Law",
    "Granddaughter",
    "Grandfather",
    "Grandmother",
    "Grandson",
    "Mother",
    "Mother-In-Law",
    "Nephew",
    "Sister",
    "Sister in-law",
    "Son in-law"
  ];
  filteredActivity: Observable<any[]> | any;
  selectedPolicyNumber: any;
  MemberIdList: any;
  activityList: any = [];
  submitted = false;
  validatedMobileNumber: any;
  CaseSubSubTypeValue: any;
  agentCode: any = '';
  // otpValue = new FormControl;
  showOtpSection: boolean = false;
  requestId: any;
  otpObj: any;
  selectedMember: any;
  policyInfoDetails: any;
  externalPolicyData: any;
  isDisabled: boolean = true;
  isOtpSubmitDisabled: boolean = true;
  sendOtptDisabled: boolean = true;
  otpInfoObject: any = null;
  timerCounter: { min: number; sec: number; } | any;
  screenSize: number | any;
  isDesktop: boolean = false;
  documentSize: any;
  uploadDoc: boolean = true;
  errorMessage: string | undefined;
  policyMembersList: [] = [];
  policyNoChangeSubject = new Subject<string>();

  constructor(private formBuilder: FormBuilder,
    private endorsement_service: EndorsementsRequestsService,
    private loginservice: LoginService,
    private toast: NgToastService,
    private _router: Router,
    private dialog: MatDialog,
    private ngZone: NgZone,
    private languageService: LanguageService,
    private translateService: TranslateService) {
      this.policyNoChangeSubject.pipe(
        debounceTime(300), // wait for 300ms after the last keyup event
      ).subscribe(value => {
        this.onChange(value);
      });
  }
  
  ngOnInit() {
    this.languageService.language$.subscribe(lang => {
      this.translateService.use(lang).subscribe({
        error: () => {
          this.translateService.use('en'); // Fallback to English if translation file is missing
        }
      });
    });

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
    let data = {
      AgentCode: this.agentCode
    }
    this.endorsement_service.getactivepolicynumbersApi(data).subscribe(
      (resp: any) => {
        if (resp?.data && resp?.statusCode == "200" && resp?.isSuccess) {
          this.policiesListData = this.removeDuplicates(resp?.data?.getPolicyDetails, "policyNumber");
          this.getActivityType();
        }
      },
      (err) => {
        console.log(err);
      });
  }

  onPolicyNoChange(event: any) {
    const inputValue = (event.target as HTMLInputElement).value.trim();
    this.caseCreationForm.get('member').setValue('');
    this.MemberIdList = [];
    if (inputValue.length >= 16) {
      this.policyNoChangeSubject.next(inputValue);
    }
  }

  validateNumberInput(event: any): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '');  // Remove non-numeric characters
    if (input.value.length > 6) {
      input.value = input.value.slice(0, 6);  // Limit the input to 6 digits
    }
    this.caseCreationForm.get('pincode')?.setValue(input.value);  // Update form control value
  }

  removeDuplicates(myArray: any, Prop: any) {
    return myArray?.filter((obj: any, pos: any, arr: any) => {
      return arr.map((mapObj: any) => mapObj[Prop]).indexOf(obj[Prop]) === pos;
    });
  }

  onChange(value: string) {
    this.selectedPolicyNumber = value;
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
    if (value == "") {
      this.caseCreationForm.get('policyNumber').reset();
    }
    this.getPolicyMembers(value);
  }

  getPolicyMembers(value: string) {
    const policyMembersReq = {
      "policyNumber": value
    }

    this.endorsement_service.getPolicyMembersApi(policyMembersReq).subscribe(
      (resp: any) => {
        if (resp?.data && resp?.statusCode == "200" && resp?.isSuccess) {
          this.policyMembersList = resp?.data?.policyMembersList
          this.getMemberIdList(this.policyMembersList)
        }
      },
      (err) => {
        console.log(err);
    });
  }

  getMemberIdList(membersList: Array<any>) {
    this.MemberIdList = membersList;
  }

  getActivityType(content = null) {
    this.activityList = this.policiesListData;
    this.filteredActivity = this.caseCreationForm.controls['policyNumber'].valueChanges.pipe(
      startWith(''),
      map((value: any) => value ? this._filter(value) : this.activityList?.slice()));
  }

  _filter(value: string) {
    console.log(value);
    const filterValue = this._normalizeValue(this._removealphabets(value));
    const filteredValue = this.activityList?.filter((x: any) => {
      const normalizedValue = this._normalizeValue(x.policyNumber);
      return normalizedValue ? normalizedValue.includes(filterValue) : false;
    });  
    return filteredValue;
  }

  _normalizeValue(value: string): string {
    return value?.toLowerCase().replace(/\s/g, '');
  }

  _removealphabets(value: any) {
    return value.replace(/[^\d.-]/g, '');
  }

  endorsementChange(event: any) {
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
      this.caseCreationForm.get("currentPolicyDetails").setValue(this.externalPolicyData?.policyData[0]?.aadharCradNo || "No policy data available");
    }
    if (value == 'ChangeinInternationalAddress' || value == 'ChangeinAddress') {
      this.caseCreationForm.get("address1").setValidators([Validators.required, Validators.pattern('^[0-9a-zA-Z .,\'-/@#]*$'), Validators.maxLength(250)]);
      this.caseCreationForm.get('address1').updateValueAndValidity();
      this.caseCreationForm.get('address2').setValidators([Validators.required, Validators.pattern('^[0-9a-zA-Z .,\'-/@#]*$'), Validators.maxLength(250)]);
      this.caseCreationForm.get('address2').updateValueAndValidity();
      this.caseCreationForm.get('pincode').setValidators([Validators.required, Validators.pattern('^[0-9a-zA-Z ,]*$')]);
      this.caseCreationForm.get('pincode').updateValueAndValidity();
    }
    if (value == 'alternateContactNumber') {
      this.caseCreationForm.get("endorsementDetails").get('alternateContactNumber').setValidators([Validators.required, Validators.pattern("^(?!([6-9])\\1{9})[6-9][0-9]{9}$")]);
      this.caseCreationForm.get("endorsementDetails").get('alternateContactNumber').updateValueAndValidity();
      this.caseCreationForm.get("currentPolicyDetails").setValue(this.externalPolicyData?.policyData[0]?.alternate_Mobile_Number || "No policy data available");
    }
    if (value == 'internationalContactNumber') {
      this.caseCreationForm.get("endorsementDetails").get('internationalContactNumber').setValidators([Validators.required, Validators.pattern("[0-9 ]{10}")]);
      this.caseCreationForm.get("endorsementDetails").get('internationalContactNumber').updateValueAndValidity();
    }
    if (value == 'nomineeContact') {
      this.caseCreationForm.get("endorsementDetails").get('nomineeContact').setValidators([Validators.required, Validators.pattern("^(?!([6-9])\\1{9})[6-9][0-9]{9}$")]);
      this.caseCreationForm.get("endorsementDetails").get('nomineeContact').updateValueAndValidity();
      this.caseCreationForm.get("endorsementDetails").get('nomineeName').setValidators([Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.maxLength(50)]);
      this.caseCreationForm.get("endorsementDetails").get('nomineeName').updateValueAndValidity();
      this.caseCreationForm.get("endorsementDetails").get('nomineeRelationship').setValidators([Validators.required]);
      this.caseCreationForm.get("endorsementDetails").get('nomineeRelationship').updateValueAndValidity();
      if (this.externalPolicyData?.policyData?.[0]) {
        this.caseCreationForm.get("currentPolicyDetails").setValue(this.externalPolicyData?.policyData[0]?.nominee_Details[0]?.nominee_first_name + ", " + this.externalPolicyData?.policyData[0]?.nominee_Details[0]?.relationship + ", " + this.externalPolicyData?.policyData[0]?.nominee_Details[0]?.nominee_Contact_No || "No policy data available");
      }
    }
    if (value == 'primaryContactNumber') {
      this.caseCreationForm.get("endorsementDetails").get('primaryContactNumber').setValidators([Validators.required, Validators.pattern("^(?!([6-9])\\1{9})[6-9][0-9]{9}$")]);
      this.caseCreationForm.get("endorsementDetails").get('primaryContactNumber').updateValueAndValidity();
      this.caseCreationForm.get("currentPolicyDetails").setValue(this.policyInfoDetails?.policyDetails?.primaryMobile || "No policy data available");
    }
    if (value == 'memberPrimaryContactNumber') {
      this.caseCreationForm.get("endorsementDetails").get('memberPrimaryContactNumber').setValidators([Validators.required, Validators.pattern("^(?!([6-9])\\1{9})[6-9][0-9]{9}$")]);
      this.caseCreationForm.get("endorsementDetails").get('memberPrimaryContactNumber').updateValueAndValidity();
      this.caseCreationForm.get("currentPolicyDetails").setValue(this.policyInfoDetails?.policyDetails?.memberMobileNo|| "No policy data available" );
    }
    if (value == 'memberAlternateContactNumber') {
      this.caseCreationForm.get("endorsementDetails").get('memberAlternateContactNumber').setValidators([Validators.required, Validators.pattern("^(?!([6-9])\\1{9})[6-9][0-9]{9}$")]);
      this.caseCreationForm.get("endorsementDetails").get('memberAlternateContactNumber').updateValueAndValidity();
    }
    if (value == 'email') {
      this.caseCreationForm.get("endorsementDetails").get('email').setValidators([Validators.required, Validators.email, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]);
      this.caseCreationForm.get("endorsementDetails").get('email').updateValueAndValidity();
      this.caseCreationForm.get("currentPolicyDetails").setValue(this.policyInfoDetails?.policyDetails?.primaryEmailId || "No policy data available");
    }
    if (value == 'alternateEmail') {
      this.caseCreationForm.get("endorsementDetails").get('alternateEmail').setValidators([Validators.required, Validators.email, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]);
      this.caseCreationForm.get("endorsementDetails").get('alternateEmail').updateValueAndValidity();
      this.caseCreationForm.get("currentPolicyDetails").setValue(this.externalPolicyData?.policyData[0]?.alternate_Email_Id || "No policy data available");
    }
    if (value == 'memberEmail') {
      this.caseCreationForm.get("endorsementDetails").get('memberEmail').setValidators([Validators.required, Validators.email, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]);
      this.caseCreationForm.get("endorsementDetails").get('memberEmail').updateValueAndValidity();
      this.caseCreationForm.get("currentPolicyDetails").setValue(this.policyInfoDetails?.policyDetails?.memberEmailID || "No policy data available");
    }
    if (value == 'memberAlternateEmail') {
      this.caseCreationForm.get("endorsementDetails").get('memberAlternateEmail').setValidators([Validators.required, Validators.email, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]);
      this.caseCreationForm.get("endorsementDetails").get('memberAlternateEmail').updateValueAndValidity();
    }
    if (value == 'panNumber') {
      this.caseCreationForm.get("endorsementDetails").get('panNumber').setValidators([Validators.required, Validators.pattern('^([A-Z]){5}([0-9]){4}([A-Z]){1}$')]);
      this.caseCreationForm.get("endorsementDetails").get('panNumber').updateValueAndValidity();
      this.caseCreationForm.get("currentPolicyDetails").setValue(this.externalPolicyData?.policyData[0]?.panNo || "No policy data available");
    }

    if (value === 'panNumber' || value === 'aadharNumber') {
      this.uploadDoc = true;
      this.showOtpSection = false;
      this.isDisabled = false;
    } else {
      this.uploadDoc = false;
      this.showOtpSection = true;
      this.isDisabled = true;
    }

    if (value === 'nomineeContact' || value == 'ChangeinInternationalAddress' || value == 'ChangeinAddress') {
      this.showOtpSection = false;
      this.isDisabled = false;
    }

    if ((value === 'panNumber' || value === 'aadharNumber') && this.submitted) {
      // this.isFilenotSelected = true;
    }
    else {
      this.isFilenotSelected = false;
      this.showNote = false;
    }
  }

  onKeydown(e: any) {
    return Helper.isNumberValidation(e);
  }

  onKeydownInternationalContactNumber(event: any) {
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
  }

  getAddress() {
    let addressParts: string[] = [];
    if (this.caseCreationForm.get("address1")?.value) {
        addressParts.push(this.caseCreationForm.get("address1")?.value);
    }
    if (this.caseCreationForm.get("address2")?.value) {
        addressParts.push(this.caseCreationForm.get("address2")?.value);
    }
    if (this.caseCreationForm.get("pincode")?.value) {
        addressParts.push(this.caseCreationForm.get("pincode")?.value);
    }
    const address = addressParts.join(', ');
    const finalAddress = address.trim().length > 0 ? address : null;
    return finalAddress;
  }

  onSubmit() {
    this.submitted = true;
    if (!this.caseCreationForm.valid) {
      return;
    }
    let selectedType = this.caseCreationForm.get('endorsementType').value;
    if (selectedType == 'alternateContactNumber' || selectedType == 'internationalContactNumber' || selectedType == 'primaryContactNumber' || selectedType == 'memberPrimaryContactNumber' || selectedType == 'memberAlternateContactNumber') {
      this.validatedMobileNumber = this.caseCreationForm.get("endorsementDetails").get(selectedType).value;
      if (this.validatedMobileNumber != this.otpObj.MobileNumber) {
        return;
      }
    }
    if (this.caseCreationForm.get("endorsementType").value === 'panNumber' || this.caseCreationForm.get("endorsementType").value === 'aadharNumber') {
      if (this.selctedFileName === "") {
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
      console.log("Case Sub sub type:", this.CaseSubSubTypeValue)
    }

    let payloadObj: any = {
      AgentCode: this.agentCode,
      MemberName: this.selectedMember.memberName,
      MobileNumber: this.policyInfoDetails.policyDetails.primaryMobile,
      MemberRelation: this.selectedMember.relationWithProposer,
      EndorsementRequest: {
        ActivityDescription: null,
        ActivitySubject: null,
        AssignedTeam: this.caseCreationForm.get("asignedTeam").value,
        AssignedUser: null,
        AttachmentContent: null,
        AttachmentName: null,
        AttachmentType: null,
        CaseSubSubType: this.CaseSubSubTypeValue.name,
        CtstID: this.CaseSubSubTypeValue.CtstID,
        Source:'Seller_Portal',
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
        NotesDescription: this.caseCreationForm.get("addNotes").value,
        NotesTitle: null,
        Origin: "USP-ABHICONNECT",
        Policy: this.caseCreationForm.get("policyNumber").value,
        PolicyStatus: null,
        Priority: null,
        Product: this.policyInfoDetails.policyDetails.productName,
        Status: null,
        CreateAttachment: null,
        EndorsementDetails: {
          AadharCardNo: this.caseCreationForm.get("endorsementDetails").get("aadharNumber").value != null ? this.caseCreationForm.get("endorsementDetails").get("aadharNumber").value.toString() : this.caseCreationForm.get("endorsementDetails").get("aadharNumber").value,
          PanCardNo: this.caseCreationForm.get("endorsementDetails").get("panNumber").value != null ? this.caseCreationForm.get("endorsementDetails").get("panNumber").value.toString() : this.caseCreationForm.get("endorsementDetails").get("panNumber").value,
          PrimaryContactNumber: this.caseCreationForm.get("endorsementDetails").get("primaryContactNumber").value != null ? this.caseCreationForm.get("endorsementDetails").get("primaryContactNumber").value.toString() : this.caseCreationForm.get("endorsementDetails").get("primaryContactNumber").value,
          AlternateContactNumber: this.caseCreationForm.get("endorsementDetails").get("alternateContactNumber").value != null ? this.caseCreationForm.get("endorsementDetails").get("alternateContactNumber").value.toString() : this.caseCreationForm.get("endorsementDetails").get("alternateContactNumber").value,
          Email: this.caseCreationForm.get("endorsementDetails").get("email").value,
          AlternateEmail: this.caseCreationForm.get("endorsementDetails").get("alternateEmail").value,
          NomineeName: this.caseCreationForm.get("endorsementDetails").get("nomineeName").value,
          NomineeRelationship: this.caseCreationForm.get("endorsementDetails").get("nomineeRelationship").value,
          NomineeContact: this.caseCreationForm.get("endorsementDetails").get("nomineeContact").value != null ? this.caseCreationForm.get("endorsementDetails").get("nomineeContact").value.toString() : this.caseCreationForm.get("endorsementDetails").get("nomineeContact").value,
          Address: this.getAddress(),

          MemberPrimaryContactNumber: this.caseCreationForm.get("endorsementDetails").get("memberPrimaryContactNumber").value != null ? this.caseCreationForm.get("endorsementDetails").get("memberPrimaryContactNumber").value.toString() : this.caseCreationForm.get("endorsementDetails").get("memberPrimaryContactNumber").value,
          MemberAlternateContactNumber: this.caseCreationForm.get("endorsementDetails").get("memberAlternateContactNumber").value != null ? this.caseCreationForm.get("endorsementDetails").get("memberAlternateContactNumber").value.toString() : this.caseCreationForm.get("endorsementDetails").get("memberAlternateContactNumber").value,
          InternationalContactNumber: this.caseCreationForm.get("endorsementDetails").get("internationalContactNumber").value != null ? this.caseCreationForm.get("endorsementDetails").get("internationalContactNumber").value.toString() : this.caseCreationForm.get("endorsementDetails").get("internationalContactNumber").value,
          MemberEmail: this.caseCreationForm.get('endorsementDetails').get('memberEmail').value,
          MemberAlternateEmail: this.caseCreationForm.get('endorsementDetails').get('memberAlternateEmail').value,
          Country: null,
        }
      }
    }
    this.endorsement_service.endorsementCreateRequestApi(payloadObj).subscribe(
      (resp) => {
          if (resp?.data && resp?.statusCode == "200" && resp?.isSuccess && resp?.data?.response?.caseId != null) {
            if (this.caseCreationForm.get("endorsementType").value === 'panNumber' || this.caseCreationForm.get("endorsementType").value === 'aadharNumber') {
              if (!this.selectedFile) {
                this.isFilenotSelected = true;
                return;
              }
              let caseID = resp.data.response.caseId;
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
                  .subscribe((Respevent: any) => {
                    let event: any = Respevent;
                    if (Respevent?.data && Respevent?.statusCode == "200" && Respevent?.isSuccess) {
                      this.openModal(resp);
                    }
                    else if (Respevent?.message) {
                      this.toast.error({
                        detail: 'ERROR',
                        summary: Respevent.message,
                        duration: 5000,
                      });
                      this.backToEndorsment();
                    }  else if (Respevent == null || Respevent?.message == undefined) {
                      this.toast.error({
                        detail: 'ERROR',
                        summary: "File upload was not successfull. Try again later!",
                        duration: 5000,
                      });
                      this.backToEndorsment();
                    }
                  }, (error: any) => {
                    console.log(error);
                    this.toast.error({
                      detail: 'ERROR',
                      summary: "Some Other Error Happened!",
                      duration: 5000,
                    });
                  });
              }
            }
            else {
              this.openModal(resp);
            }
          }
          else {
            this.toast.error({
              detail: 'ERROR',
              summary: resp.message,
              duration: 5000,
            });
            this.backToEndorsment();
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
  
  openModal(resp: any) {
    const dialogRef = this.dialog.open(SuccessModalComponent, {
      width: '400px',
      disableClose: true,
      data: { 
        title: 'Endorsement',
        id: `Endorsement No: ${resp.data.response.caseId}`
      },
    });

    dialogRef.afterClosed().subscribe(() => {
        this.backToEndorsment();
    });
  }

  newfile(e: any) {
    let files;
    let file;
    let fileExt;
    this.isFilenotSelected = false;
    this.fileSizeError = false;
    
    if (e) {
      files = e.target.files;
      file = files[0];
      if (!file) {
        return;
      }
  
      if (file.size > 10 * 1024 * 1024) {
        this.fileSizeError = true;
        e.target.value = '';
        this.showNote = false;
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
    this.errorMessage = '';
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
      (resp: any) => {
        if (resp && resp?.statusCode == "200" && resp?.isSuccess && resp?.data?.requestId !== null) {
          this.otpInfoObject = {
            requestId: resp.data.requestId,
            otp: "",
          };
          this.openOtpPopup();
          this.timeLeft = 30;
          this.startTimer();
          this.sendOtptDisabled = false;
        }
        else {
          this.sendOtptDisabled = false;
          this.toast.error({
            detail: 'ERROR',
            summary: resp.message,
            duration: 5000
          });
        }
      },
      (err) => {
        console.log(err);
        this.sendOtptDisabled = false;
        this.toast.error({
          detail: 'ERROR',
          summary: "Something went wrong! Please try again later.",
          duration: 5000
        });
      });
  }

  validateOTP() {
    this.errorMessage = '';
    const otpCode = this.otp.join('');
    if (otpCode.length == 6) {
      let modal = {
        agentCode: this.agentCode,
        RequestId: this.otpInfoObject.requestId,
        OTPNumber: otpCode,
        emailId: this.otpObj.EmailId,
        Mobile: this.otpObj.MobileNumber,
      };
      this.endorsement_service.endorsementValidateOtpApi(modal).subscribe(
        (resp: any) => {
          if (resp && resp?.statusCode == "200" && resp?.isSuccess) {
            this.toast.success({
              detail: 'SUCCESS',
              summary: resp.message,
              duration: 5000
            });
            this.closeOtpPopup();
            this.isDisabled = false;
            this.sendOtptDisabled = true;
          }  
          else {
            this.errorMessage = resp.message;
            this.isDisabled = false;
            this.sendOtptDisabled = false;
            resp.message.includes("Your Account Has been locked") || resp.message.includes("You have Reached Maximum Number of Attempts") ? this.timerOn = false : this.timerOn = true;
          }
        },
        (err: any) => {
          this.otpInfoObject = null;
          this.sendOtptDisabled = false;
          this.errorMessage = err;
        }
      );
    } else {
      this.errorMessage = "Please Enter Valid OTP"
    }
    this.otp = ['', '', '', '', '', ''];
  }

  memberIdChange(event: any) {
    const member = event.target.value;
    this.selectedMember = this.policyMembersList.find((obj: any) => {
      return obj.memberId === member;
    });
    if (this.selectedMember != "") {
      let policyObj = {
        policyNumber: this.selectedPolicyNumber,
        MemberId: this.selectedMember.memberId
      }
      this.endorsement_service.getEndorsementPolicyInfoApi(policyObj).subscribe(
        (resp: any) => {
          if (resp?.data && resp?.statusCode == "200" && resp?.isSuccess) {
            this.policyInfoDetails = resp.data;
            this.externalPolicyData = this.policyInfoDetails.externalPolicyData.response;
          }
          else {
            this.toast.error({
              detail: 'ERROR',
              summary: resp.message,
              duration: 5000
            });
          }
        },
        (err) => {
          console.log(err);
          this.toast.error({
            detail: 'ERROR',
            summary: "Something went wrong! Please try again later.",
            duration: 5000
          });
        });
    }
  }

  mobAndEmailValueChange(enteredValue: any, formControlName: any) {
    if (enteredValue != "" && this.caseCreationForm.get("endorsementDetails").get(formControlName).valid) {
      this.sendOtptDisabled = false;
    } else {
      this.sendOtptDisabled = true;
    }
  }

  resendOTP() {
    this.sendOTP();
  }

  // Start OTP timer
  startTimer() {
    if (this.isTimerRunning) {
      return; // Prevent multiple timers from starting
    }

    // Initialize the timer

    this.isTimerRunning = true;

    const timer$ = interval(1000).pipe(
      take(this.timeLeft) // Complete the observable after 'timeLeft' seconds
    );

    timer$.subscribe({
      next: () => {
        this.timeLeft--;
      },
      complete: () => {
        this.isTimerRunning = false;
      }
    });
  }

  omit_special_char(event: any) {
    var k;
    k = event.charCode;
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
  }

  deleteFile() {
    this.namesVariable = "";
    this.documentType = "";
    this.showDocInfo = false;
  }

  onKey(event: KeyboardEvent, index: number) {
    event.preventDefault();
  
    if (event.key >= '0' && event.key <= '9') {
      this.otp[index] = event.key;
  
      if (index < 5) {
        this.ngZone.run(() => {
          setTimeout(() => {
            const nextInput = document.querySelectorAll('.otp-input')[index + 1] as HTMLInputElement;
            nextInput && nextInput.focus();
          }, 50);
        });
      } else {
        const btnElement = document.getElementById('verify') as HTMLButtonElement;
        btnElement && btnElement.focus();
      }
    }
  
    else if (event.key === 'Backspace') {
      this.otp[index] = '';
  
      if (index > 0) {
        this.ngZone.run(() => {
          setTimeout(() => {
            const previousInput = document.getElementsByClassName('otp-input')[index - 1] as HTMLInputElement;
            previousInput && previousInput.focus();
          }, 50);
        });
      }
    }
  
    else if (event.key === 'Tab') {
      event.preventDefault();
      this.ngZone.run(() => {
        if (event.shiftKey) {
          if (index > 0) {
            setTimeout(() => {
              const previousInput = document.getElementsByClassName('otp-input')[index - 1] as HTMLInputElement;
              previousInput && previousInput.focus();
            }, 50);
          }
        } else {
          if (index < 5) {
            setTimeout(() => {
              const nextInput = document.getElementsByClassName('otp-input')[index + 1] as HTMLInputElement;
              nextInput && nextInput.focus();
            }, 50);
          } else {
            const btnElement = document.getElementById('verify') as HTMLButtonElement;
            btnElement && btnElement.focus();
          }
        }
      });
    }
  }  
}
