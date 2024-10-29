import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Input, OnInit, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ClaimData } from 'src/app/interface/claims.interface';
import { DatePipe, formatDate } from '@angular/common';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators';
import { NgToastService } from 'ng-angular-popup';
import { Router } from '@angular/router';
import { ClaimsViewService } from './claims-view.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: "app-claims-view",
  templateUrl: "./claims-view.component.html",
  styleUrls: ["./claims-view.component.scss"],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClaimsViewComponent {
  @Input() uploadedFiles: {
    id:string;
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
  }[] = [];
  // uploadedFiles: File[] = [];
  form!: FormGroup;
  activePolicyNumbers: string[] = [];
  saveForm!: FormGroup;
  proposalNumbers: string[] = [];
  policyNumbers: string[] = [];
  productNames: string[] = [];
  memberNames: string[] = [];
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
  uploadedFilesCount = 0;
  uploadStatus = "0 of 0 files uploaded";
  failedFilesCount = 0;
  uploadSuccess: boolean = true;
  namesVariable: any;
  documentType: any;
  response: any;
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
  activityList : any[] = []
  selectedPolicyNumber:any;
  isFocused: boolean = false;
  fromDate: any;
  toDate: any;
  maxDate = new Date().toISOString().split('T')[0];

  coverNames = [
    "AYUSH Treatment",
    "Domiciliary Hospitalization",
    "Day Care Treatments",
    "Home Health Care",
    "HIV / AIDS and STD Cover",
    "Health AssessmentTM",
    "HealthReturnsTM",
    "In-patient Hospitalization",
    "Mental Illness Hospitalization",
    "Modern Procedures/Treatments",
    "Obesity Treatment",
    "Organ Donor Expenses",
    "Post-Hospitalization Expenses",
    "Pre-Hospitalization Expenses",
    "Road Ambulance Cover (per hospitalization)",
    "Super Reload",
    "Claim Protect (Non-Medical Expense Waiver)",
    "Super Credit (increases irrespective of claim)",
  ];
  billGroup: any;
  billsForm!: FormGroup;
  claimInfoId: any;
  documentId: any;
  filteredPolicyList: string[] = [];

  constructor(
    private fb: FormBuilder,
    private claimsService: ClaimsViewService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private toast: NgToastService,
    private datePipe: DatePipe
  ) {
    this.billsForm = this.fb.group({
      billsArray: this.fb.array([]),
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["label"]) {
      this.editableControl.setValue(this.label); // Update FormControl when label changes
    }
  }

  ngOnInit(): void {
    this.createForm();
    this.saveUpload();
    this.getProposalDetails();
    this.fetchStates();
    const policyNumberControl = this.form.get('policyNumber');
   // this.filteredPolicyNumbers = [...this.policyNumbers]; 
  }
  
  navigateToListClaim(){
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
      policyNumber: ["",Validators.required],
      proposalNumber: ["",],
      memberName: ["",Validators.required],
      productName: [""],
      fullName: [""],
      policyType: ["",],
      memberRelation: [""],
      requestType: [""],
      claimStatus: [""],
      raisedDate: [""],
      hospitalName: [""],
      isFileUploadRequired: [true],
      claimedAmount: ["",],
      approvedAmount: [""],
      deductedAmount: [""],
      deductionReason: [""],
      coPayAmount: [""],
      reasonForCoPay: [""],
      coverName: [""],
      AgentCode: localStorage.getItem("agentCode"),
      claimType: ["",Validators.required],
      notes: [""],
      proposerName: [""],
      state: [""],
      city: [""],
      hospitalAddress: "",
      admissionDate: [""],
      dischargeDate: [""],
      admissionTime: [""],
      dischargeTime: [""],
      ailmentDescription: [""],
      documentName: [""],
      status: [""],
      labelName: [""],
      billsArray: this.fb.array([
        this.fb.group({
          billNo: [""],
          billDate: [""],
          claimedAmount: [""]
        }),
      ]),
    });
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

  getProposalDetails(): void {
    this.agentCode = localStorage.getItem("agentCode");
    this.claimsService.getProposalDetails(this.agentCode).subscribe(
      (response: any) => {
        if (response.success) {
          this.response = response;
          const allData: ClaimData[] = response.data;
          this.proposalNumbers = this.extractUniqueValues(allData, 'proposalNumber');          
          this.policyNumbers = this.extractUniqueValues(
            allData,
            "policyNumber"
          );
          this.filteredPolicyList = [...this.policyNumbers];
          this.claimTypes = this.extractUniqueValues(allData, "policyType");
          this.cdr.markForCheck();
        } else {
          console.error("Failed to fetch dropdown data", response.message);
        }
      },
      (error) => console.error("Error fetching dropdown data", error)
    );
  }

  extractUniqueValues(data: any[], key: string): any[] {
    return [...new Set(data.map((item) => item[key]).filter((val) => val))];
  }

  handleDropdownChange(value: string): void {
    const selectedPolicyNumber = value;
      this.form.get('policyNumber')?.valueChanges.subscribe(policyValue => {
      if (!policyValue) {
        this.form.get('memberName')?.setValue('');
        this.memberNames = []; 
      }
    });
    const filteredMembers = this.response.data.filter(
      (item: any) => item.policyNumber === selectedPolicyNumber
    );
      this.memberNames = this.extractUniqueValues(filteredMembers, "fullName");
      this.form.get("memberName")?.setValue("");
      this.cdr.markForCheck();
  }

  filterList(event: KeyboardEvent): void {
    const input = (event.target as HTMLInputElement).value.toLowerCase();
    this.form.patchValue({
      "memberName":"",
     
    })
    
    this.filteredPolicyList = this.policyNumbers.filter((item : any) =>
      item.toLowerCase().includes(input)
    );
    const allowedKeys = ['Backspace', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
    const regex = /^[0-9-]$/; 

    if (allowedKeys.includes(event.key)) {
      return;
    }
    // Prevent default if the key is not allowed
    if (!regex.test(event.key)) {
      event.preventDefault();
    }
    
   
  }

  onInput(event: KeyboardEvent): void {
    const input = event.target as HTMLInputElement;
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
    console.log('filterPolicyNumbers');
    const query = this.searchText.toLowerCase();
  }

  dateFormat(dateType: "fromDate" | "toDate") {
    if (dateType === "fromDate" && this.fromDate) {
      this.fromDate = this.datePipe.transform(this.fromDate, "yyyy-MM-dd");
    } else if (dateType === "toDate" && this.toDate) {
      this.toDate = this.datePipe.transform(this.toDate, "yyyy-MM-dd");
    }
    if(this.toDate < this.fromDate) {
      this.toDate = "";
    }
  }
  // selectPolicyNumber(policy: string): void {
  //   console.log('selectPolicyNumber');
  //   this.form.get('policyNumber')?.setValue(policy);
  //   this.searchText = policy; 
  //   this.isDropdownOpen = false; 
  // }

  // handleClickOutside(event: Event): void {
  //   console.log('handleClickOutside');
  //   const target = event.target as HTMLElement;
  //   if (!target.closest('.custom-dropdown')) {
  //     this.isDropdownOpen = false;
  //   }
  // }

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
      "state":"",
      "hospitalName":"",
      "hospitalAddress":"",
      "city":"",
      "claimedAmount":"",
      "notes":"",
      "ailmentDescription":"",
      "dischargeDate":"",
      "admissionDate":""
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

  onCoverNameChange(event: any): void {
    const selectedCover = event.target.value;
    console.log("selectedCover");
    this.selectedCoverName = selectedCover;
    this.billsArray.clear();

    if (
      [
        "AYUSH Treatment",
        "Day Care Treatment",
        "In-patient Hospitalization",
        "Mental Illness Hospitalization",
      ].includes(selectedCover)
    ) {
      this.showSecondScenario = false;
      this.billsArray.clear();
      this.addBillRow();
      this.showFirstScenario = true;
    } else {
      this.showFirstScenario = false;
      this.showSecondScenario = true;
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
      eventName: "string",
      sessionId: "string",
      userLevel: "string",
      userRole: "string",
      superiorId: 0,
      designation: "string",
      intCategory: "string",
      category: "string",
      branchCode: "string",
    };
    this.claimsService.getStates(statesReqBody).subscribe(
      (info: any) => {
        console.log("resp", info);
        if (info) {
          this.states = info.response;
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
      "hospitalName":"",
      "hospitalAddress":"",
      "city":""
    })
    if (this.selectedState !== null) {
      this.fetchCities();
    }
  }

  fetchCities(): void {
    let citiesReqBody = {
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
      stateID: this.selectedState,
    };

    this.claimsService.getCitiesByState(citiesReqBody).subscribe(
      (info: any) => {
        if (info && info.cityList) {
          this.cities = info.cityList;
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
      "hospitalName":"",
      "hospitalAddress":""
    })
    if (this.selectedCity !== null) {
      this.fetchHospitals();
    }
  }

  fetchHospitals() {
    let hospitalsReqBody = {
      stateId: this.selectedState,
      cityId: this.selectedCity,
    };
    this.claimsService.getHospitalsByCities(hospitalsReqBody).subscribe(
      (info: any) => {
        if (info) {
          this.hospitals = info.data;
          console.log(this.hospitals, "hospitals");
        } else {
          console.error("Failed to fetch hospitals", info.message);
        }
      },
      (error: any) => {
        console.error("Error fetching hospitals", error);
      }
    );
  }

  fetchBlackListedHsp(event: any) {
    this.selectedHospital = event.target.value;
    if (this.selectedHospital) {
      this.hospitalAddress = this.hospitals.filter(h => h.hospitalName ===  this.selectedHospital).map(h => h.hospitalAddress );
    } else {
      this.hospitalAddress = '' 
    }
    this.form.patchValue({
      hospitalAddress : this.hospitalAddress
    })
    
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
      hospitalName: this.selectedHospital,
      hospitalAddress: "string",
    };
    this.claimsService
      .getBlackListedhospitals(claimsBlackListHspReqBody)
      .subscribe((info: any) => {
        console.log(info,'hspNMe');
        if(this.selectedHospital.includes(info.hospitalName)){
    console.log(info.hospitalName,'hn')
          console.error("Black listed hospital")
        }
      });
  }
  //-------------- Method to handle file upload------------------//
  formatDate(date: Date): string {
    return formatDate(date, "d MMMM yyyy, hh:mma", "en-US");
  }

  onFileSelected(event: any): void {
    const inputElement = event.target;
    const files = inputElement.files as File[];
    this.totalFilesCount += files.length;
  
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Check if the file was previously deleted and re-uploaded
      const fileExists = this.uploadedFiles.some((uploadedFile) => uploadedFile.name === file.name && uploadedFile.size === file.size);
  
      if (!fileExists && this.allowedFileTypes.includes(file.type)) {
        // Initialize label with an empty value for new files
        this.uploadedFiles.push({
          id: uuidv4(),
          name: file.name,
          type: file.type,
          size: file.size,
          label: "Label this document",
          isEditing: false,
          isEdited: false,
          uploadDateTime: new Date(),
          editableControl: new FormControl(""),
          formattedUploadDateTime: this.formatDate(new Date()),
          status: "pending",
          file: file,
          policyNumber: this.saveForm.value.policyNumber,
          documentName: this.saveForm.value.documentName,
          documentType: this.saveForm.value.documentType,
          createdBy: this.saveForm.value.createdBy,
        });
        this.uploadValidFormat = false;
      } else if (fileExists) {
        // Show some warning or handle duplicate file logic here
        console.warn('File already uploaded.');
      } else {
        this.uploadValidFormat = true;
      }
    }
  
    this.updateStatusLabel();
    this.uploadFiles(Array.from(files).filter((file => this.allowedFileTypes.includes(file.type))));
  }
  
  convertBytesToKB(bytes: number): string {
    const kb = bytes / 1024;
    return `${kb.toFixed(2)} KB`;
  }

  uploadFiles(files: File[]): void {
    const fileNames: string[] = files.map((file) => file.name);
    const fileTypes: string[] = files.map((file) => file.type);
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
        claimInfoId: "21727183717381",
       // claimInfoId: this.claimInfoId || "",
        // memberId: this.form.get("memberId")?.value || "",
        memberId: 'PT85650665',
        documentId: "test2",
        id: file.id
        // documentId: this.documentId || "",
      };
      formData.append(`fileDetails[${index}].id`, metadata.id);
      formData.append(`fileDetails[${index}].AgentCode`, metadata.createdBy);
      formData.append(`fileDetails[${index}].policyNumber`,metadata.policyNumber);
      formData.append(`fileDetails[${index}].labelName`, metadata.labelName);
      formData.append(`fileDetails[${index}].documentName`,metadata.documentName);
      formData.append(`fileDetails[${index}].documentType`,metadata.documentType);
      formData.append(`fileDetails[${index}].createdBy`, metadata.createdBy);
      formData.append(`fileDetails[${index}].file`, file.file, file.file.name);
      formData.append(`fileDetails[${index}].memberId`, metadata.memberId);
    });

    this.claimsService.uploadFiles(formData).subscribe(
      (response: any) => {
        //  const uploadedFile = this.uploadedFiles.find(f => f.file.name === file.name);
        if (response.success) {
          this.uploadedFiles.map((file) => (file.status = "success"));
          this.uploadSuccess = true;
          this.uploadedFilesCount++;
        }
        this.updateStatusLabel();
        this.cdr.markForCheck(); 
      },
      (_error) => {
        this.uploadedFile = this.uploadedFiles.find(
          (f) => f.file.name === f.file.name
        );
        this.uploadedFiles.map((file) => (file.status = "failed"));
        this.uploadSuccess = false;
        this.failedFilesCount++;
        this.updateStatusLabel();
        this.cdr.markForCheck();
      }
    );
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
  // deleteFile(fileToDelete: any) {
  //   this.uploadedFiles = this.uploadedFiles.filter(
  //     (file) => file !== fileToDelete
  //   );
  //   this.totalFilesCount = this.uploadedFiles.length;
  //   // Ensure the status label is updated accordingly
  //   this.updateStatusLabel();
  // }
  deleteFile(fileToDelete: any): void {
    const payload = {
      policyNumber:  this.form.get("policyNumber")?.value, 
      documentId: fileToDelete.id,
      claimNumber: ""
    };
  
    this.claimsService.deleteFile(payload).subscribe(
      (response:any) => {
        if (response.isSuccess) {
          console.log('File deleted successfully:', response);
            this.uploadedFiles = this.uploadedFiles.filter(
            (file) => file.id !== fileToDelete.id 
          );
          this.totalFilesCount = this.uploadedFiles.length;
            this.updateStatusLabel();
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

  // Method to start editing a file
  startEditing(file: any) {
    file.isEditing = true;
    if (!file.editableControl) {
      file.editableControl = new FormControl(file.label);
    }
    this.editableControl.setValue("");
  }

  // Method to Stop editing changes
  stopEditing(file: any) {
    if (this.editableControl.value !== this.label) {
      file.label = this.editableControl.value; 
    }
    file.isEditing = false;
    file.isEdited = true;
  }
  ///////current date and time
  formatUploadDateTime() {
    if (this.uploadDateTime) {
      this.formattedUploadDateTime = this.formatDate(this.uploadDateTime);
    }
  }

  submitRequest(): void {
    if (this.saveForm.valid || this.form.valid) {
      const saveClaimData = this.form.value;
      let formData = this.form.value;

      if (Array.isArray(formData.hospitalAddress)) {
        formData.hospitalAddress = formData.hospitalAddress.join(', '); 
      }
    //  const documentIds = this.uploadedFiles.map((file) => file.documentId);
       // saveClaimData.documentIds = documentIds;
       const documentsArray = this.uploadedFiles.map((file) => ({
        documentName: file.name,
        status: file.status,
        labelName: file.label
    }));
    saveClaimData.documentsArray = documentsArray;
      this.claimsService.saveClaims(saveClaimData).subscribe(
        (response) => {
          if (response) {
            this.uploadSuccess = true;
            this.toast.success({ detail: "Claims submitted successfully" });
            this.router.navigate(["claims/claimsList"]);
          } else {
            this.toast.error({ detail: "Failed to submit claims" });
          }
  
          this.updateStatusLabel();
        },
        (_error:any) => {
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



