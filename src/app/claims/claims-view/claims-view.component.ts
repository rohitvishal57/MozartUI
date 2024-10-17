import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Input, OnInit, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ClaimData } from 'src/app/interface/claims.interface';
import { formatDate } from '@angular/common';
import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { NgToastService } from 'ng-angular-popup';
import { Router } from '@angular/router';
import { ClaimsViewService } from './claims-view.service';


@Component({
  selector: "app-claims-view",
  templateUrl: "./claims-view.component.html",
  styleUrls: ["./claims-view.component.scss"],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClaimsViewComponent {
  @Input() uploadedFiles: {
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

  constructor(
    private fb: FormBuilder,
    private claimsService: ClaimsViewService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private toast: NgToastService
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
      policyNumber: ["", Validators.required],
      proposalNumber: [""],
      memberName: ["", Validators.required],
      productName: [""],
      fullName: [""],
      policyType: ["", Validators.required],
      memberRelation: [""],
      requestType: [""],
      claimStatus: [""],
      raisedDate: [""],
      hospitalName: [""],
      isFileUploadRequired: [true],
      claimedAmount: [""],
      approvedAmount: [""],
      deductedAmount: [""],
      deductionReason: [""],
      coPayAmount: [""],
      reasonForCoPay: [""],
      coverName: [""],
      AgentCode: localStorage.getItem("agentCode"),
      claimType: [""],
      notes: [""],
      proposerName: [""],
      state: [""],
      city: [""],
      hospitalAddress: [""],
      admissionDate: ["2023-10-15"],
      dischargeDate: ["2024-10-15"],
      admissionTime: [""],
      dischargeTime: [""],
      ailmentDescription: [""],
      billsArray: this.fb.array([
        this.fb.group({
          billNo: [""],
          billDate: [""],
          billAmount: [""],
        }),
      ]),
    });
  }

  getProposalDetails(): void {
    this.agentCode = localStorage.getItem("agentCode");
    this.claimsService.getProposalDetails(this.agentCode).subscribe(
      (response: any) => {
        if (response.success) {
          this.response = response;
          const allData: ClaimData[] = response.data;
          // Extract unique values for dropdowns
          this.proposalNumbers = this.extractUniqueValues(allData, 'proposalNumber');
          console.log('prop', this.proposalNumbers);
          
          this.policyNumbers = this.extractUniqueValues(
            allData,
            "policyNumber"
          );
          // this.memberNames = this.extractUniqueValues(allData, 'fullName');
          this.claimTypes = this.extractUniqueValues(allData, "policyType");
          this.cdr.markForCheck();
        } else {
          console.error("Failed to fetch dropdown data", response.message);
        }
      },
      (error) => console.error("Error fetching dropdown data", error)
    );
  }

  // to extract unique values
  extractUniqueValues(data: any[], key: string): any[] {
    return [...new Set(data.map((item) => item[key]).filter((val) => val))];
  }

  handleDropdownChange(event: any): void {
    const selectedPolicyNumber = event.target.value;  
    const filteredMembers = this.response.data.filter(
      (item: any) => item.policyNumber === selectedPolicyNumber
    );
    this.memberNames = this.extractUniqueValues(filteredMembers, "fullName");
    this.form.get("memberName")?.setValue("");
    this.cdr.markForCheck();
  }

  onClaimTypeChange(event: any): void {
    const selectedType = event.target.value;
    if (selectedType === "Cashless") {
      this.showReimbursementFields = false;
      this.showCashlessFields = true;
      this.form.patchValue({
        coverName: "Hospitalization",
      });
    } else if (selectedType === "Reimbursement") {
      this.showCashlessFields = false;
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

    // Toggle between the two UIs based on cover name
    if (
      [
        "AYUSH Treatment",
        "Day Care Treatment",
        "In-patient Hospitalization",
        "Mental Illness Hospitalization",
      ].includes(selectedCover)
    ) {
      this.showSecondScenario = false;
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
    console.log("this.selectedCity", this.selectedCity);

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
    console.log("event", event);

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
    const files = event.target.files as File[];
    this.totalFilesCount += files.length;
    //this.uploadedFilesCount =  this.totalFilesCount; // Reset count for new batch
    //this.failedFilesCount = this.totalFilesCount   // Reset failed files count for new batch

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (this.allowedFileTypes.includes(file.type)) {
      this.uploadedFiles.push({
        name: file.name,
        type: file.type,
        size: file.size,
        label: "Label this document",
        isEditing: false,
        editableControl: new FormControl("Label this document"),
        uploadDateTime: new Date(),
        formattedUploadDateTime: this.formatDate(new Date()),
        status: "pending",
        file: file,
        policyNumber: this.saveForm.value.policyNumber,
        documentName: this.saveForm.value.documentName,
        documentType: this.saveForm.value.documentType,
        createdBy: this.saveForm.value.createdBy,
      });
      this.uploadValidFormat = false;

    } 
    else {
      this.uploadValidFormat = true;
      event.target.value = ''; 
        }
    
  }
    // Update the saveForm with the latest file info
    if (this.uploadedFiles.length > 0) {
      this.saveForm.patchValue({
        file: this.uploadedFiles[0].file, // Assuming you want to take the first file
      });
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
        documentId: "test2"
        // documentId: this.documentId || "",
      };

      // Append metadata
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

  updateStatusLabel(): void {
    // this.uploadStatus = `${this.uploadedFilesCount} of ${this.totalFilesCount} files uploaded`;
    this.uploadStatus = `${this.totalFilesCount} of ${this.totalFilesCount} files uploaded`;
  }
  deleteFile(fileToDelete: any) {
    this.uploadedFiles = this.uploadedFiles.filter(
      (file) => file !== fileToDelete
    );
    this.totalFilesCount = this.uploadedFiles.length;
    // Ensure the status label is updated accordingly
    this.updateStatusLabel();
  }

  ////////////////////file upload input label //////////////////

  // Method to start editing a file
  startEditing(file: any) {
    file.isEditing = true;
    if (!file.editableControl) {
      file.editableControl = new FormControl(file.label);
    }
  }

  // Method to Stop editing changes
  stopEditing(file: any) {
    if (this.editableControl.value !== this.label) {
      file.label = this.editableControl.value; // Update the label with the edited value
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
  
    //  const documentIds = this.uploadedFiles.map((file) => file.documentId);
       // saveClaimData.documentIds = documentIds;
  
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
  
  // submitRequest(): void {
  //   if (this.saveForm.valid || this.form.valid) {
  //     const saveClaimData = this.form.value;

  //     // Prepare a single FormData object for all files
  //     const fileUploadFormData = new FormData();

  //     // Collect metadata and files into FormData
  //     this.uploadedFiles.forEach((file, index) => {
  //       const metadata = {
  //         policyNumber: this.form.get("policyNumber")?.value || "",
  //         labelName: file.label || "",
  //         documentName: this.namesVariable || "",
  //         documentType: this.documentType || "",
  //         createdBy: file.createdBy || "",
  //         file: file.file,
  //         claimInfoId: this.claimInfoId || "",
  //         memberId: this.form.get("memberId")?.value || "",
  //         documentId: this.documentId || "",
  //       };

  //       // Append metadata
  //       fileUploadFormData.append(
  //         `fileDetails[${index}].policyNumber`,
  //         metadata.policyNumber
  //       );
  //       fileUploadFormData.append(
  //         `fileDetails[${index}].labelName`,
  //         metadata.labelName
  //       );
  //       fileUploadFormData.append(
  //         `fileDetails[${index}].documentName`,
  //         metadata.documentName
  //       );
  //       fileUploadFormData.append(
  //         `fileDetails[${index}].documentType`,
  //         metadata.documentType
  //       );
  //       fileUploadFormData.append(
  //         `fileDetails[${index}].createdBy`,
  //         metadata.createdBy
  //       );
  //       fileUploadFormData.append(
  //         `fileDetails[${index}].file`,
  //         file.file,
  //         file.file.name
  //       );
  //       fileUploadFormData.append(
  //         `fileDetails[${index}].claimInfoId`,
  //         metadata.claimInfoId
  //       );
  //       fileUploadFormData.append(
  //         `fileDetails[${index}].memberId`,
  //         metadata.memberId
  //       );
  //       fileUploadFormData.append(
  //         `fileDetails[${index}].documentId`,
  //         metadata.documentId
  //       );
  //     });

  //     // Prepare observables for API calls
  //     const fileUploadObservable = this.claimsService
  //       .uploadFiles(fileUploadFormData)
  //       .pipe(
  //         map((response) => ({ response })),
  //         catchError((error) => of({ error }))
  //       );

  //     const saveClaimObservable = this.claimsService
  //       .saveClaims(saveClaimData)
  //       .pipe(
  //         map((response) => ({ response })),
  //         catchError((error) => of({ error }))
  //       );

  //     // forkJoin to run both observables in parallel
  //     forkJoin([fileUploadObservable, saveClaimObservable]).subscribe(
  //       (results) => {
  //         const claimsResult = results[1];
  //         // Handle claims submission response
  //         if ("response" in claimsResult) {
  //           this.response = claimsResult.response;
  //           if (this.response.success === true) {
  //             this.uploadSuccess = true;
  //             this.toast.success({ detail: "Claims submitted successfully" });
  //             this.router.navigate(["claims/claimsList"]);
  //           } else {
  //             this.toast.error({ detail: "Failed to submit claims" });
  //           }
  //         } else if ("error" in claimsResult) {
  //           this.toast.error({
  //             detail: "Error occurred during claims submission",
  //             duration: 3000,
  //           });
  //         }

  //         this.updateStatusLabel();
  //       },
  //       (error) => {
  //         this.toast.error({ detail: "Error occurred", duration: 3000 });
  //       }
  //     );
  //   } else {
  //     this.toast.error({ detail: "Please fill in the required form fields." });
  //   }
  // }
  
}



