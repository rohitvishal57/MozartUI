import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Input, OnInit, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ClaimData } from 'src/app/interface/claims.interface';
import { DatePipe, formatDate } from '@angular/common';
import { NgToastService } from 'ng-angular-popup';
import { Router } from '@angular/router';
import { ClaimsViewService } from './claims-view.service';
import { v4 as uuidv4 } from 'uuid';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language.service';
import { EndorsementsRequestsService } from 'src/app/endorsements/endorsements-requests/endorsements-requests.service';
import { CoverDetail } from 'src/app/interface/claims.interface';
import { debounceTime, Subject } from 'rxjs';
import { SuccessModalComponent } from 'src/app/shared/components/success-modal/success-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: "app-claims-view",
  templateUrl: "./claims-view.component.html",
  styleUrls: ["./claims-view.component.scss"],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClaimsViewComponent {
  @Input() uploadedFiles: {
    documentId: string;
    name: string;
    type: string;
    size: number;
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
    documentLabelForm: FormGroup
  }[] = [];
  // uploadedFiles: File[] = [];
  form!: FormGroup;
  activePolicyNumbers: string[] = [];
  saveForm!: FormGroup;
  proposalNumbers: string[] = [];
  policyNumbers: string[] = [];
  productNames: string[] = [];
  memberNames: any[] = [];
  claimTypes: string[] = [];
  showQuickActions = false;
  @Input() label: string = "Label this document";
  files: { name: string; label: string }[] = [];
  editableControl: FormControl = new FormControl(""); // FormControl for the input field
  isEditing: boolean = false;
  isEdited: boolean = false;
  uploadDateTime: Date | null = null;
  formattedUploadDateTime: string = "";
  totalFilesCount = 0;
  selectedMember:any;
  uploadedFilesCount = 0;
  uploadStatus = "0 of 0 files uploaded";
  failedFilesCount = 0;
  uploadSuccess: boolean = true;
  namesVariable: any;
  documentType: any;
  response: any;
  selectedMemberName:any;
  uploadedFile: any;
  agentCode: any;
  selectMemberData: any = {};
  showCashlessFields: boolean = false;
  showReimbursementFields: boolean = false;
  states: any[] = [];
  cities: any[] = [];
  hospitals: any[] = [];
  selectedState!: number;
  selectedCity!: number;
  showFirstScenario = false;
  showSecondScenario = false;
  selectedCoverName: string = "";
  index: number = 0;
  selectedHospital: any;
  allowedFileTypes: string[] = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'image/bmp'];
  uploadValidFormat: boolean = false;
  hospitalAddress: any;
  searchText: string = '';
  isDropdownOpen: boolean = false;
  selectedPolicyNumber: any;
  isFocused: boolean = false;
  selectedFile: any;
  fromDate: any;
  hospitalId:any;
  toDate: any;
  maxDate = new Date().toISOString().split('T')[0];
  isFilenotSelected: boolean = false;
  policyMembersList: any[] = [];
  MemberIdList: any;
  policiesListData:any
  coverNames: CoverDetail[] = [];
  selectedCoverCode: string = '';
  policyNoChangeSubject = new Subject<string>();
  // coverNames:any
  documentLabelOptions = [
    'govt/KYC ID',
    'Hospital bill invoice',
    'Investigation report',
    'Doctor’s Prescription',
    'NEFT/ Cancelled cheque/ Passbook',
    'Hospital discharge form',
    'Consultation form',
    'Claim form',
    'Others'
  ];

  documentLabelForm!: FormGroup;

  // coverNames = [
  //   "AYUSH Treatment",
  //   "Domiciliary Hospitalization",
  //   "Day Care Treatments",
  //   "Home Health Care",
  //   "HIV / AIDS and STD Cover",
  //   "Health AssessmentTM",
  //   "HealthReturnsTM",
  //   "In-patient Hospitalization",
  //   "Mental Illness Hospitalization",
  //   "Modern Procedures/Treatments",
  //   "Obesity Treatment",
  //   "Organ Donor Expenses",
  //   "Post-Hospitalization Expenses",
  //   "Pre-Hospitalization Expenses",
  //   "Road Ambulance Cover (per hospitalization)",
  //   "Super Reload",
  //   "Claim Protect (Non-Medical Expense Waiver)",
  //   "Super Credit (increases irrespective of claim)",
  // ];
  billGroup: any;
  billsForm!: FormGroup;
  claimInfoId: any;
  documentId: any;
  filteredPolicyList: any[] = [];
  hospitalCode: any;

  constructor(
    private fb: FormBuilder,
    private claimsService: ClaimsViewService,
    private endorsement_service: EndorsementsRequestsService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private toast: NgToastService,
    private datePipe: DatePipe,
    private languageService: LanguageService,
    private translateService: TranslateService,
    private dialog : MatDialog
  ) {
    this.billsForm = this.fb.group({
      billsArray: this.fb.array([]),
    });
    this.policyNoChangeSubject.pipe(
      debounceTime(300), // wait for 300ms after the last keyup event
    ).subscribe(value => {
      this.onChange(value);
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["label"]) {
      this.editableControl.setValue(this.label); // Update FormControl when label changes
    }
  }

  ngOnInit(): void {
    this.documentLabelForm = this.fb.group({
      documentLabel: [''],
      customLabel: ['']
    });

    // Listen to changes in document label dropdown
    const documentLabelControl = this.documentLabelForm.get('documentLabel');
    const customLabelControl = this.documentLabelForm.get('customLabel');

    if (documentLabelControl && customLabelControl) {
      documentLabelControl.valueChanges.subscribe(value => {
        if (value === 'Others') {
          customLabelControl.enable();
        } else {
          customLabelControl.disable();
          customLabelControl.setValue('');
        }
      });
    }
    this.languageService.language$.subscribe(lang => {
      this.translateService.use(lang).subscribe({
        error: () => {
          this.translateService.use('en'); // Fallback to English if translation file is missing
        }
      });
    });

    this.createForm();
    this.saveUpload();
    this.getProposalDetails();
    this.fetchStates();
      const policyNumberControl = this.form.get('policyNumber');
  }

  initializeDocumentLabelForm(): FormGroup {
    return this.fb.group({
      documentLabel: [''],
      customLabel: [{ value: '', disabled: true }]
    });
  }
  navigateToListClaim() {
    this.router.navigate(['claims/claimsList'])
  }

  saveUpload(): void {
    this.saveForm = this.fb.group({
      policyNumber: [
        this.form.get("policyNumber")?.value,
        [Validators.pattern(/^\d+$/)],
      ],
      labelName: [],
      documentName: [this.namesVariable],
      documentType: [
        this.documentType,
        [Validators.pattern(/^(Pdf|jpeg|png)$/)],
      ],
      createdBy: [
        localStorage.getItem("agentCode"),
        [Validators.pattern(/^\d+$/)],
      ],
      file: ["/D:/Downloads/ABHI_06_Ma"],
    });
  }

  createForm(): void {
    this.form = this.fb.group({
      id: localStorage.getItem("agentCode"),
      policyNumber: ["", [Validators.required, Validators.pattern("^[0-9]+-[0-9]+-[0-9]+-[0-9]+$"), Validators.minLength(16), Validators.maxLength(16)]],
      proposalNumber: [""],
      memberName: [""],
      memberId:[""],
      memberRelation:[""],
      productName: [""],
      fullName: [""],
      claimStatus: [""],
      raisedDate: [""],
      coverCode: [""],
      hospitalName: ["", Validators.required],
      hospitalCode: [''],
      isFileUploadRequired: [true],
      claimedAmount: ["", Validators.required],
      proposerName: [""],
      requestType: [""],
      approvedAmount: [""],
      deductedAmount: [""],
      deductionReason: [""],
      coPayAmount: [""],
      reasonForCoPay: [""],
      coverName: [""],
      raisedBy:[""],
      AgentCode: localStorage.getItem("agentCode"),
      claimType: ["", Validators.required],
      notes: [""],
      state: ["", Validators.required],
      city: ["", Validators.required],
      hospitalAddress: [""],
      admissionDate: null,
      dischargeDate: null,
      admissionTime: [""],
      dischargeTime: [""],
      ailmentDescription: ["", Validators.required],
      documentName: [""],
      status: [""],
      labelName: [""],
      billsArray: this.fb.array([
        this.fb.group({
          billNo: [""],
          billDate: [""],
          billAmount: [""]
        }),
      ]),
      documentsArray: this.fb.array([
        this.fb.group({
            documentId: [""],
            documentName: [""],
            status: [""],
            labelName: [""]
       
          }),
        ]),
    });
    this.form.get('coverName')?.valueChanges.subscribe(coverName => {
      const selectedCover = this.coverNames.find(cover => cover.cover_Name === coverName);
      if (selectedCover) {
        this.form.get('coverCode')?.setValue(selectedCover.cover_Code);
        this.selectedCoverCode = selectedCover.cover_Code;
      }
    });
  }

  handleCoverNameValidation(coverName: string): void {

    const stateControl = this.form.get('state');
    const cityControl = this.form.get('city');
    const hospitalNameControl = this.form.get('hospitalName');
    const hospitalAddressControl = this.form.get('hospitalAddress');

    if (coverName === 'AYUSH Treatment') {
      // Remove validators for state, city, and hospital
      stateControl?.clearValidators();
      cityControl?.clearValidators();
      hospitalNameControl?.clearValidators();
      hospitalAddressControl?.clearValidators();

      // Update validity without triggering validation
      stateControl?.updateValueAndValidity({ onlySelf: true });
      cityControl?.updateValueAndValidity({ onlySelf: true });
      hospitalNameControl?.updateValueAndValidity({ onlySelf: true });
      hospitalAddressControl?.updateValueAndValidity({ onlySelf: true });

      // Optional: Clear values if needed
      stateControl?.setValue('');
      cityControl?.setValue('');
      hospitalNameControl?.setValue('');
      hospitalAddressControl?.setValue('');
    } else {
      // Restore required validators for state, city, and hospital
      stateControl?.setValidators([Validators.required]);
      cityControl?.setValidators([Validators.required]);
      hospitalNameControl?.setValidators([Validators.required]);
      hospitalAddressControl?.setValidators([Validators.required]);
      // Update validity
      stateControl?.updateValueAndValidity();
      cityControl?.updateValueAndValidity();
      hospitalNameControl?.updateValueAndValidity();
      hospitalAddressControl?.updateValueAndValidity();
    }
  }

  onFocus() {
    this.isFocused = true;
  }

  onBlur() {
    if (!this.form.get('memberName')?.value) {
      this.isFocused = false;
    }
  }

  hasAnyValue(): boolean {
    return this.form.get('memberName')?.value ? true : false;
  }
  extractUniqueValues(data: any[], key: string): string[] {
    const uniqueValues = new Set(data.map(item => item[key]));
    return Array.from(uniqueValues).filter(value => value != null);
  }
  
  getProposalDetails(): void {
    let data = {
      AgentCode: localStorage.getItem("agentCode")
    }
    this.endorsement_service.getactivepolicynumbersApi(data).subscribe(
      (resp: any) => {
        if (resp?.data && resp?.statusCode == "200" && resp?.isSuccess) {
          this.policyNumbers = this.removeDuplicates(resp?.data?.getPolicyDetails, "policyNumber");
          this.filteredPolicyList = [...this.policyNumbers];
          this.cdr.markForCheck();

        }
      },
      (err) => {
        console.log(err);
      });
  }

  removeDuplicates(myArray: any, Prop: any) {
    return myArray?.filter((obj: any, pos: any, arr: any) => {
      return arr.map((mapObj: any) => mapObj[Prop]).indexOf(obj[Prop]) === pos;
    });
  }


  handleDropdownChange(value: string): void {
    const selectedPolicyNumber = value;
    this.form.get('policyNumber')?.valueChanges.subscribe(policyValue => {
      if (!policyValue) {
        this.form.get('memberName')?.setValue('');
        this.memberNames = [];
      }
    });
    const filteredMembers = this.policyNumbers.filter(
      (item: any) => item.policyNumber === selectedPolicyNumber
    );
    //this.memberNames = this.extractUniqueValues(filteredMembers, "fullName");
    this.form.get("memberName")?.setValue("");
    this.cdr.markForCheck();
    this.getPolicyMembers(value)
    this.fetchCoverNames()

  }
  getPolicyMembers(value: string) {
    const membersReq = {
      "AgentCode": localStorage.getItem("agentCode"),
      "policyNumber": value
    }

    this.claimsService.getMemberDetails(membersReq).subscribe(
      (resp: any) => {
        if (resp?.data && resp?.statusCode == "200" && resp?.isSuccess) {
          this.policyMembersList = resp.data.policyMembersList          
          this.getMemberIdList(this.policyMembersList)    
          console.log(this.policyMembersList);
                
        }
      },
      (err) => {
        console.log(err);
      });
  }
  getMemberIdList(membersList: Array<any>) {
    this.memberNames = membersList;
  }
  filterList(event: any): void {
    const input = (event.target as HTMLInputElement).value.trim(); 
    this.form.patchValue({
      "memberName": "",
    });

    this.filteredPolicyList = this.policyNumbers.filter((item: any) =>
      item.policyNumber.includes(input)
    );

    if(input.length >=16) {
      this.policyNoChangeSubject.next(input);
    }

    // const allowedKeys = ['Backspace', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
    // const regex = /^[0-9-]$/;

    // if (allowedKeys.includes(event.key)) {
    //   return;
    // }

    // Prevent default if the key is not allowed
    // if (regex.test(event.key)) {
    //   event.preventDefault();
    // }
}


  onChange(value: string) {
    this.selectedPolicyNumber = value;
    if (value == "") {
      // this.form.get('policyNumber').reset();
    }
    this.getPolicyMembers(value);
  }
  onInput(event: any): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    if (value.length > 12) {
      this.form.get('claimedAmount')?.setErrors({ maxlength: true });
    } else if (value.length < 4) {
      this.form.get('claimedAmount')?.setErrors({ minlength: true });
    } else {
      this.form.get('claimedAmount')?.setErrors(null);
    }
    const allowedKeys = ['Backspace', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];

    if (allowedKeys.includes(event.key)) {
      return;
    }

    const isDigit = /^[0-9]$/.test(event.key);
    if (!isDigit) {
      event.preventDefault();
      return;
    }

    const currentValue = input.value;
    if (currentValue === '' && event.key === '0') {
      event.preventDefault();
    }
  }

  toggleDropdown(open: boolean): void {
    this.isDropdownOpen = open;
  }

  filterPolicyNumbers(value: unknown): void {
    const query = this.searchText.toLowerCase();
  }

  dateFormat(dateType: "fromDate" | "toDate") {
    if (dateType === "fromDate" && this.fromDate) {
      this.fromDate = this.datePipe.transform(this.fromDate, "yyyy-MM-dd");
    } else if (dateType === "toDate" && this.toDate) {
      this.toDate = this.datePipe.transform(this.toDate, "yyyy-MM-dd");
    }
  }

  // ngAfterViewInit() {
  //   document.addEventListener('click', this.handleClickOutside.bind(this));
  // }

  // ngOnDestroy() {
  //   document.removeEventListener('click', this.handleClickOutside.bind(this));
  // }
  onTimeChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input) {
      input.blur(); // This will programmatically remove the focus from the input field
    }
  }

  onClaimTypeChange(event: any): void {
    this.form.patchValue({
      "state": "",
      "hospitalName": "",
      "hospitalAddress": "",
      "city": "",
      "claimedAmount": "",
      "notes": "",
      "ailmentDescription": "",
      "dischargeDate": "",
      "admissionDate": ""
    })

    const selectedType = event.target.value;
    if (selectedType === "Cashless") {
      this.showReimbursementFields = false;
      this.showCashlessFields = true;
      this.form.patchValue({
        coverName: "Hospitalization",
      });
    } else if (selectedType === "Reimbursement") {
      this.showCashlessFields = false;
      this.showSecondScenario = false;
      this.showFirstScenario = false;
      this.form.patchValue({
        coverName: "",
      });
      this.showReimbursementFields = true;
    } else {
      this.showCashlessFields = true;
      this.showReimbursementFields = false;
    }
  }

  fetchCoverNames(): void {
    const coverReqBody =  {
      "memberId": this.selectedMember.memberId,
      "policyNumber": this.form.value.policyNumber,
      "familyID": "",
      "agentCode": localStorage.getItem("agentCode")
    }
    this.claimsService.getCoverNames(coverReqBody).subscribe({
      next: (response: any) => {
        if (response.isSuccess && response.data?.coverDetails) {
          this.coverNames = response.data.coverDetails;
        } else {
          console.error('No cover names found');
          this.coverNames = [];
        }
      },
      error: (error: any) => {
        console.error('Error fetching cover names', error);
        this.coverNames = [];
      }
    });
  }

  // onCoverNameChange(event: any): void {
  //   const selectedCover = event.target.value;
  //   this.selectedCoverName = selectedCover;
  //   this.billsArray.clear();
  //   if (
  //     [
  //       "AYUSH Treatment",
  //       "Day Care Treatment",
  //       "In-patient Hospitalization",
  //       "Mental Illness Hospitalization",
  //     ].includes(selectedCover)
  //   ) {
  //     this.showSecondScenario = false;
  //     this.billsArray.clear();
  //     this.addBillRow();
  //     this.showFirstScenario = true;
  //     let coverName = this.form.get('coverName')?.value;
  //     this.handleCoverNameValidation(coverName);

  //   } else {
  //     this.showFirstScenario = false;
  //     this.showSecondScenario = true;
  //   }
  // }
  onCoverNameChange(event: any): void {
    const selectedCoverName = event.target.value;
    const selectedCover = this.coverNames.find(cover => cover.cover_Name === selectedCoverName);

    if (selectedCover) {
      this.form.patchValue({
        coverName: selectedCover.cover_Name,
        coverCode: selectedCover.cover_Code
      });

      this.selectedCoverCode = selectedCover.cover_Code;

      const specialCovers = [
        "AYUSH Treatment",
        "Day Care Treatment",
        "In-patient Hospitalization",
        "Mental Illness Hospitalization"
      ];

      if (specialCovers.includes(selectedCoverName)) {
        this.showSecondScenario = false;
        this.billsArray.clear();
        this.addBillRow();
        this.showFirstScenario = true;
      } else {
        this.showFirstScenario = false;
        this.showSecondScenario = true;
      }
    }
  }
  get billsArray(): FormArray {
    return this.billsForm.get("billsArray") as FormArray;
  }

  addBillRow() {
    const newRow = this.fb.group({
      billNo: [""],
      billDate: [""],
      billAmount: [""],
    });
    this.billsArray.push(newRow);
  }

  removeBillRow(index: number) {
    this.billsArray.removeAt(index);
  }

  fetchStates(): void {
    let statesReqBody = {
      agentId: 0,
      agentCode: localStorage.getItem("agentCode"),
    };
    this.claimsService.getStates(statesReqBody).subscribe(
      (info: any) => {
        console.log("resp", info);
        if (info.isSuccess) {
          this.states = info.data.response;
        } else {
          console.error("Failed to fetch states", info.message);
        }
      },
      (error: any) => {
        console.error("Error fetching states", error);
      }
    );
  }

  onStateChange(event: any): void {
    this.selectedState = Number(event.target.value);
    this.form.patchValue({
      "hospitalName": "",
      "hospitalAddress": "",
      "city": ""
    })
    if (this.selectedState !== null) {
      this.fetchCities();
    }
  }

  fetchCities(): void {
    let citiesReqBody = {
      agentId: 0,
      agentCode: localStorage.getItem("agentCode"),
      stateID: this.selectedState,
    };

    this.claimsService.getCitiesByState(citiesReqBody).subscribe(
      (info: any) => {
        if (info.isSuccess) {
          this.cities = info.data.cityList;
          //this.cdr.markForCheck();
        } else {
          console.error("Failed to fetch cities", info.message);
        }
      },
      (error: any) => {
        console.error("Error fetching cities", error);
      }
    );
  }

  onCityChange(event: any) {
    this.selectedCity = event.target.value;
    this.form.patchValue({
      "hospitalName": "",
      "hospitalAddress": "",
      "hospitalId": "" 
    })
    if (this.selectedCity !== null) {
      this.fetchHospitals();
    }
  }

  fetchHospitals() {
    const cityNameArr = this.cities.filter((obj: any) => obj.cityID == this.selectedCity);
    const stateNameArr = this.states.filter((obj: any) => obj.stateID == this.selectedState);

    let hospitalsReqBody = {
      city: cityNameArr[0]?.cityName,
      state: stateNameArr[0]?.stateName
    };
  
    this.claimsService.getHospitalsByCities(hospitalsReqBody).subscribe(
      (response: any) => {
        if (response?.isSuccess && response?.data?.partyLists) {
          this.hospitals = response.data.partyLists.map((partyList: any) => {
            const nameDetail = partyList.partydetails.find((detail: any) => detail.name === 'Party Name');
            const partyCodeDetail = partyList.partydetails.find((detail: any) => detail.name === 'Party Code');
            const AddressDetail = partyList.partydetails.find((detail: any) => detail.name === 'Address Line 1')
            
            return {
              hospitalName: nameDetail ? nameDetail.value : '',
              hospitalId: partyCodeDetail ? partyCodeDetail.value : '',
            //  hospitalCode: partyCodeDetail ? partyCodeDetail.value : '',
              hospitalAddress: AddressDetail ? AddressDetail.value: ''
              //address: this.extractAddress(partyList.partydetails)
            };
          });
        } else {
          this.hospitals = [];
          console.error("Failed to fetch hospitals", response?.message);
        }
      },
      (error: any) => {
        this.hospitals = [];
        console.error("Error fetching hospitals", error);
      }
    );
  }

  fetchBlackListedHsp(event: any) {
    this.selectedHospital = event.target.value;
    let selectedHospitalObj;

    if (this.selectedHospital) {
      selectedHospitalObj = this.hospitals.find(h => h.hospitalId === this.selectedHospital);
      
      if (selectedHospitalObj) {
        this.hospitalAddress = selectedHospitalObj.hospitalAddress;
        this.hospitalId = selectedHospitalObj.hospitalId;
       // this.hospitalCode selectedHospitalObj.hospitalCode,
        
      } else {
        this.hospitalAddress = '';
        this.hospitalId = '';
      }
  
      this.form.patchValue({
        hospitalAddress: this.hospitalAddress,
        hospitalId: this.hospitalId
      });
    } else {
      this.hospitalAddress = '';
      this.hospitalId = '';
    }

    let claimsBlackListHspReqBody = {
      agentId: 0,
      agentCode: localStorage.getItem("agentCode"),
      eventName: "string",
      sessionId: "string",
      userLevel: "string",
      userRole: "string",
      superiorId: 0,
      designation: "string",
      intCategory: "string",
      category: "string",
      branchCode: "string",
      city: this.selectedCity,
      hospitalName: selectedHospitalObj.hospitalName,
      hospitalAddress: "string",
    };
    this.claimsService
      .getBlackListedhospitals(claimsBlackListHspReqBody)
      .subscribe((info: any) => {
        if (this.selectedHospital.includes(info.hospitalName)) {
          console.error("Black listed hospital")
        }
      });
  }
  //-------------- Method to handle file upload------------------//
  formatDate(date: Date): string {
    return formatDate(date, "d MMMM yyyy, hh:mma", "en-US");
  }

  // onFileSelected(event: any): void {
  //   const inputElement = event.target;
  //   const files = inputElement.files as File[];
  //   this.totalFilesCount += files.length;
  //   this.isFilenotSelected = false;

  //   for (let i = 0; i < files.length; i++) {
  //     const file = files[i];
  //     this.selectedFile = file;
  //     // Check if the file was previously deleted and re-uploaded
  //     const fileExists = this.uploadedFiles.some((uploadedFile) => uploadedFile.name === file.name && uploadedFile.size === file.size);

  //     if (!fileExists && this.allowedFileTypes.includes(file.type)) {
  //       // Initialize label with an empty value for new files
  //       this.uploadedFiles.push({
  //         documentId: uuidv4(),
  //         name: file.name,
  //         type: file.type,
  //         size: file.size,
  //         label: "Label this document",
  //         isEditing: false,
  //         isEdited: false,
  //         uploadDateTime: new Date(),
  //         editableControl: new FormControl(""),
  //         formattedUploadDateTime: this.formatDate(new Date()),
  //         status: "pending",
  //         file: file,
  //         policyNumber: this.saveForm.value.policyNumber,
  //         documentName: this.saveForm.value.documentName,
  //         documentType: this.saveForm.value.documentType,
  //         createdBy: this.saveForm.value.createdBy,
  //       });
  //       this.uploadValidFormat = false;
  //     } else if (fileExists) {
  //       console.warn('File already uploaded.');
  //     } else {
  //       this.uploadValidFormat = true;
  //     }
  //   }

  //   this.updateStatusLabel();
  //   this.uploadFiles(Array.from(files).filter((file => this.allowedFileTypes.includes(file.type))));
  // }

  onFileSelected(event: any): void {
    const inputElement = event.target;
    const files = inputElement.files as File[];

    this.totalFilesCount += files.length;
    this.isFilenotSelected = false;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      this.selectedFile = file;

      const fileExists = this.uploadedFiles.some((uploadedFile) =>
        uploadedFile.name === file.name && uploadedFile.size === file.size
      );

      if (!fileExists && this.allowedFileTypes.includes(file.type)) {
        const newFile = {
          documentId: uuidv4(),
          name: file.name,
          type: file.type,
          size: file.size,
          label: "Label this document",
          editableControl: new FormControl(""),
          isEditing: true,
          isEdited: false,
          uploadDateTime: new Date(),
          formattedUploadDateTime: this.formatDate(new Date()),
          status: "pending",
          file: file,
          policyNumber: this.saveForm.value.policyNumber,
          documentName: this.saveForm.value.documentName,
          documentType: this.saveForm.value.documentType,
          createdBy: this.saveForm.value.createdBy,
          documentLabelForm: this.initializeDocumentLabelForm()
        };

        this.uploadedFiles.push(newFile);

        this.clearSelectedLabel(newFile);

      } else if (fileExists) {
        console.warn('File already uploaded.');
      } else {
        this.uploadValidFormat = true;
      }
    }
    this.updateStatusLabel();
    this.uploadFiles(Array.from(files).filter((file => this.allowedFileTypes.includes(file.type))));
  }

  clearSelectedLabel(file: any): void {
    file.documentLabelForm.reset({
      documentLabel: '',
      customLabel: ''
    });

    const documentLabelControl = file.documentLabelForm.get('documentLabel');
    const customLabelControl = file.documentLabelForm.get('customLabel');

    if (documentLabelControl && customLabelControl) {
      documentLabelControl.valueChanges.subscribe((selectedLabel: any) => {
        if (selectedLabel === 'Others') {
          customLabelControl.enable();  // Enable the custom label field
        } else {
          customLabelControl.disable(); // Disable it if not 'Others'
        }
      });
    }
  }

  onCustomLabelBlur(file: any) {
    const documentLabelControl = file.documentLabelForm.get('documentLabel');
    const customLabelControl = file.documentLabelForm.get('customLabel');

    if (documentLabelControl && customLabelControl) {
      const selectedLabel = documentLabelControl.value;
      const customLabel = customLabelControl.value;

      file.label = selectedLabel === 'Others'
        ? (customLabel || 'Others')
        : (selectedLabel || 'Label this document');

      if (file.label !== "Label this document") {
        file.isEditing = false;
        file.isEdited = true;
      }
    }
  }


  uploadFiles(files: File[]): void {
    const fileNames: string[] = files.map((file) => file.name);
    const fileTypes: string[] = files.map((file) => file.type);
    const policyNumber = this.form.get("policyNumber")?.value
    if (!policyNumber) {
      this.uploadedFiles.forEach((file) => (file.status = "failed"));
      this.uploadSuccess = false;
      this.updateStatusLabel();
      this.cdr.markForCheck();
      console.warn("Policy number must be selected before uploading files.");
      return;
    }
    this.documentType = fileTypes;
    this.namesVariable = fileNames;
    const formData = new FormData();
    this.uploadedFiles.forEach((file, index) => {
      const metadata = {
        policyNumber: this.form.get("policyNumber")?.value || "",
        labelName: file.label || "",
        documentName: this.namesVariable || "",
        documentType: this.documentType || "",
        createdBy: file.createdBy || "",
        claimInfoId: "",
        memberId: '',
        documentId: file.documentId
      };
      formData.append(`fileDetails[${index}].documentId`, metadata.documentId);
      formData.append(`fileDetails[${index}].AgentCode`, metadata.createdBy);
      formData.append(`fileDetails[${index}].policyNumber`, metadata.policyNumber);
      formData.append(`fileDetails[${index}].labelName`, metadata.labelName);
      formData.append(`fileDetails[${index}].documentName`, metadata.documentName);
      formData.append(`fileDetails[${index}].documentType`, metadata.documentType);
      formData.append(`fileDetails[${index}].createdBy`, metadata.createdBy);
      formData.append(`fileDetails[${index}].file`, file.file, file.file.name);
      formData.append(`fileDetails[${index}].memberId`, metadata.memberId);
    });

    this.claimsService.uploadFiles(formData).subscribe(
      (response: any) => {
        if (response.isSuccess) {
          this.uploadedFiles.forEach((file) => (file.status = "success"));
          this.uploadSuccess = true;
          this.uploadedFilesCount = files.length;
        } else {
          this.uploadedFiles.forEach((file) => (file.status = "failed"));
          this.uploadSuccess = false;
        }
        this.updateStatusLabel();
        this.cdr.markForCheck();
      },
      (_error) => {
        this.uploadedFiles.forEach((file) => (file.status = "failed"));
        this.uploadSuccess = false;
        this.failedFilesCount = files.length;
        this.updateStatusLabel();
        this.cdr.markForCheck();
      }
    );
  }

  convertBytesToKB(bytes: number): string {
    const kb = bytes / 1024;
    return `${kb.toFixed(2)} KB`;
  }

  onLabelKeyDown(event: KeyboardEvent, file: any): void {
    if (event.key === 'Enter') {
      this.stopEditing(file);
    }
  }

  updateStatusLabel(): void {
    // this.uploadStatus = `${this.uploadedFilesCount} of ${this.totalFilesCount} files uploaded`;
    this.uploadStatus = `${this.totalFilesCount} of ${this.totalFilesCount} files uploaded`;
  }

  deleteFile(fileToDelete: any): void {
    const payload = {
      policyNumber: this.form.get("policyNumber")?.value,
      documentId: fileToDelete.documentId,
      claimNumber: ""
    };

    this.claimsService.deleteFile(payload).subscribe(
      (response: any) => {
        if (response.isSuccess) {
          this.uploadedFiles = this.uploadedFiles.filter(
            (file) => file.documentId !== fileToDelete.documentId
          );
          this.totalFilesCount = this.uploadedFiles.length;
          this.updateStatusLabel();
          this.cdr.detectChanges();
          console.log('Updated uploadedFiles list:', this.uploadedFiles);
        } else {
          console.error('Failed to delete file:', response.message);
        }
      },
      (error) => {
        console.error('Error deleting file:', error);
      }
    );
  }
  ////////////////////file upload input label //////////////////
  //   startEditing(file: any) {
  //     file.isEditing = true;
  //     if (!file.editableControl) {
  //       file.editableControl = new FormControl(file.label);
  //     }
  //     this.editableControl.setValue("");
  //   }

  //  stopEditing(file: any) {
  //     if (this.editableControl.value !== this.label) {
  //       file.label = this.editableControl.value; 
  //     }
  //     file.isEditing = false;
  //     file.isEdited = true;
  //   }

  // startEditing(file: any) {
  //   file.isEditing = true;
  //   const documentLabelControl = this.documentLabelForm.get('documentLabel');
  //   const customLabelControl = this.documentLabelForm.get('customLabel');

  //   if (documentLabelControl && customLabelControl) {
  //     // Initialize form with current label
  //     documentLabelControl.setValue(
  //       this.documentLabelOptions.includes(file.label) ? file.label : 'Others'
  //     );

  //     if (documentLabelControl.value === 'Others') {
  //       customLabelControl.enable();
  //       customLabelControl.setValue(
  //         this.documentLabelOptions.includes(file.label) ? '' : file.label
  //       );
  //     }
  //   }
  // }
  startEditing(file: any) {
    file.isEditing = true;
    const documentLabelControl = file.documentLabelForm.get('documentLabel');
    const customLabelControl = file.documentLabelForm.get('customLabel');

    if (documentLabelControl && customLabelControl) {
      documentLabelControl.setValue('');
      customLabelControl.setValue('');
      customLabelControl.disable();
    }
  }
  stopEditing(file: any) {
    const documentLabelControl = this.documentLabelForm.get('documentLabel');
    const customLabelControl = this.documentLabelForm.get('customLabel');

    if (documentLabelControl && customLabelControl) {
      const selectedLabel = documentLabelControl.value;
      const customLabel = customLabelControl.value;
      // Determine the final label
      file.label = selectedLabel === 'Others' ? customLabel : selectedLabel;

      file.isEditing = false;
      file.isEdited = true;
    }
  }

  // memberIdChange(event:any){    
  //   this.selectedMemberName = event.target.value;
  //   const selectedMember = this.policyMembersList.find(member => member.memberName === this.selectedMemberName);
  
  //   if (selectedMember) {
  //     this.form.get('memberId')?.setValue(selectedMember.memberId);  
  //   }
  
  // }
  memberIdChange(event: any) {
    const selectedMemberId = event.target.value;
    this.selectedMember = this.policyMembersList.find(member => member.memberId === selectedMemberId);
    
    if (this.selectedMember) {
      this.form.get('memberName')?.setValue(this.selectedMember.memberName);
      this.form.get('memberId')?.setValue(this.selectedMember.memberId);
    }
    this.fetchCoverNames();
  }

  ///////current date and time
  formatUploadDateTime() {
    if (this.uploadDateTime) {
      this.formattedUploadDateTime = this.formatDate(this.uploadDateTime);
    }
  }
  openModal(resp: any) {
    const dialogRef = this.dialog.open(SuccessModalComponent, {
      width: '400px',
      disableClose: true,
      data: {
        title: 'Claims',
        id: `Claims Id: ${resp.data.claimNumber}`,
        navigate: 'claims/claimsList'
      },
    });
 
    dialogRef.afterClosed().subscribe(() => {
      console.log('Modal closed');
    });
  }
  submitRequest(): void {
    if (this.saveForm.valid || this.form.valid) {
      const saveClaimData = { ...this.form.value };
      saveClaimData.admissionDate = saveClaimData.admissionDate ? saveClaimData.admissionDate : this.maxDate;
      saveClaimData.dischargeDate = saveClaimData.dischargeDate ? saveClaimData.dischargeDate : this.maxDate;
     saveClaimData.memberId = this.form.get('memberId')?.value;  
     saveClaimData.memberName = this.form.get('memberName')?.value;  
     const coverNames = this.form.get('coverName')?.value;
     const coverCode = this.form.get('coverCode')?.value;
     if (coverNames && coverCode) {
       saveClaimData.coverName = coverNames;
       saveClaimData.coverCode = coverCode;
     }

 
      saveClaimData.billsArray = saveClaimData.billsArray.map((bill: any) => ({
        ...bill,
        billAmount: bill.billAmount ? bill.billAmount.toString() : ""
      }));

      if (!this.selectedFile) {
        this.isFilenotSelected = true;
        return;
      }

      // if (!saveClaimData.claimedAmount) {
      //   saveClaimData.claimedAmount = 0;
      // }

      let coverName = this.form.get('coverName')?.value;
      if (coverName) {
        this.handleCoverNameValidation(coverName);
        if (coverName === 'AYUSH Treatment') {
          saveClaimData.state = "";
          saveClaimData.city = "";
          saveClaimData.hospitalName = "";
        }
      }

      if (Array.isArray(saveClaimData.hospitalAddress)) {
        saveClaimData.hospitalAddress = saveClaimData.hospitalAddress.join(', ');
      }
      // const documentsArray = this.uploadedFiles.map((file) => ({
      //   documentId: file.documentId,
      //   documentName: file.name,
      //   status: file.status,
      //   labelName: file.label
      // }));
      const documentsArray = this.uploadedFiles.map((file) => {
        const documentLabelControl = file.documentLabelForm.get('documentLabel');
        const customLabelControl = file.documentLabelForm.get('customLabel');
        
        let labelName = file.label;
        
        if (documentLabelControl && customLabelControl && documentLabelControl.value === 'Others') {
          labelName = customLabelControl.value || 'Others';
        } else if (documentLabelControl) {
          labelName = documentLabelControl.value || file.label;
        }
      
        return {
          documentId: file.documentId,
          documentName: file.name,
          status: file.status,
          labelName: labelName
        };
      });
      saveClaimData.documentsArray = documentsArray;
      this.claimsService.saveClaims(saveClaimData).subscribe(
        (response: any) => {
          if (response?.isSuccess) {
            this.uploadSuccess = true;
          
            this.openModal(response);
          //  this.toast.success({ detail: "Claims submitted successfully", duration:0, sticky: true });
            this.router.navigate(["claims/claimsList"]);
          } else {
            this.toast.error({ detail: "Failed to submit claims" });
          }
          this.updateStatusLabel();
        },
        (_error: any) => {
          this.toast.error({
            detail: "Error occurred during claims submission",
            duration: 3000,
          });
        }
      );
    } else {
      this.toast.error({ detail: "Please fill in the required form fields." });
    }
  }
}



