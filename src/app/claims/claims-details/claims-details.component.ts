
import { ChangeDetectorRef, Component, Input } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ClaimsViewService } from "../claims-view/claims-view.service";
import { formatDate } from "@angular/common";
import { NgToastService } from "ng-angular-popup";
import { v4 as uuidv4 } from 'uuid';


@Component({
  selector: "app-claims-details",
  templateUrl: "./claims-details.component.html",
  styleUrls: ["./claims-details.component.scss"],
})
export class ClaimsDetailsComponent {
  claimId: string | null = null;
  claimsHistory: any;
  policyNumber: string | any;
  claimInfoId: string | any;
  filesUploaded: any[] = [];
  saveForm!: FormGroup;
  claims: any;
  @Input() label: string = "Label this document";
  files: { name: string; label: string }[] = [];
  editableControl: FormControl = new FormControl("");
  isEditing: boolean = false;
  isEdited: boolean = false;
  uploadDateTime: Date | null = null;
  formattedUploadDateTime: string = "";
  totalFilesCount = 0;
  totalFilesDocCount = 0;
  uploadedFilesCount = 0;
  uploadStatus = "0 of 0 files uploaded";
  failedFilesCount = 0;
  uploadSuccess: boolean = true;
  namesVariable: any;
  documentType: any;
  response: any;
  uploadedFile: any;
  agentCode: any;
  status:any;
  selectMemberData: any = {};
  isViewVisible: boolean = false;
  underDef: boolean = false;
  noFilesFound: boolean = false;
  allowedFileTypes: string[] = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/bmp",
  ];
  uploadValidFormat: boolean = false;
  uploadValidFormt: boolean = false;
  selectedTabIndex: number = 0;
  underDeficiencyUploadStatus: string = "";
  documentsUploadStatus: string = "";
  viewFileUploads: any[] = [];
  @Input() uploadedUnderDeficiencyFiles: {
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
    documentID?: string;
  }[] = [];

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
    documentId: string;
  }[] = [];

  fileUploads: { 
    name: string,
    type: string,
    base64: string,
    fileBlob?: Blob,
    documentId: string;
  }[] = [];
  customeStepperStatuses: any[] = [];
  statusMessage: string | undefined;
  uploadedFilesData: any;
  documentId: any;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private claimsService: ClaimsViewService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private toast: NgToastService

  ) {
    this.route.queryParams.subscribe((params) => {
      this.claimId = this.route.snapshot.paramMap.get("id");
      this.policyNumber = this.route.snapshot.paramMap.get("policyNumber");
      this.claimInfoId = this.route.snapshot.paramMap.get("claimInfoId");
    });
  }

  ngOnInit() {
    this.fetchfileUploads(this.claimInfoId, this.policyNumber)
    if (this.claimId && this.policyNumber && this.claimInfoId) {
      this.fetchClaimDetails(this.claimId, this.policyNumber, this.claimInfoId);
      this.updateStatusLabel("fileUpload");
    }
    this.fetchClaimStatus(this.claimInfoId);
    this.fetchClaimTracker(this.claimInfoId);
    this.fetchClaimHistory(this.policyNumber);

    // this.claimId = this.route.snapshot.paramMap.get('id');
    // if (this.claimId) {
    // this.fetchClaimDetails(this.claimId);
    // this.updateStatusLabel();
  }
  fetchClaimStatus(claimInfoId: string): void {
    const claimsReqBody = {
      claimNumber: claimInfoId,
    };
 
    this.claimsService.getClaimStatus(claimsReqBody).subscribe(
      (response: any) => {
        this.status = response.data;
      //  this.statusMessage = response.data.notes;
        console.log('ststu', this.status, response, this.statusMessage);
        
        (response.data.claimStatus === "Under Deficiency") ? this.underDef = true : this.underDef = false;
      },
      (error: any) => {
        console.error("Error fetching claim details", error);
      }
    );
  }

  fetchClaimTracker(claimInfoId: string): void {
    const claimsReqBody = {
      claimNumber: claimInfoId,
    };

    this.claimsService.getClaimTracker(claimsReqBody).subscribe(
      (response: any) => {
        this.customeStepperStatuses = response.data;        
        this.customeStepperStatuses.forEach((item:any, index: number) => {
          item.count = index + 1;
        });
      },
      (error: any) => {
        console.error("Error fetching claim details", error);
      }
    );
  }

  fetchClaimDetails(
    claimId: string,
    policyNumber: string,
    claimInfoId: string
  ): void {
    let claimDetailsReqBody = {
      id: claimId,
      claimNumber: claimInfoId,
      policyNumber: policyNumber,
    };
    this.claimsService.getClaimDetailsView(claimDetailsReqBody).subscribe(
      (response: any): void => {
        this.claims = response.data;
      },
      (error: any) => {
        console.error("Error fetching claim details", error);
      }
    );
  }

  onTabChanged(event: any): void {
    this.selectedTabIndex = event.index;
  }

  //  -------------- Method to handle file upload------------------//
  

  // fetchfileUploads(
  //   policyNumber: string,
  //   claimInfoId: string
  // ) {    
  //   let claimsFilesReqBody = {
  //     "documentId" : "",
  //     "policyNumber":"40-23-0003508-00",
  //     "claimNumber": "510000340-23-0003508-00"
  //   };
  
  //   this.claimsService.getUploadedFiles(claimsFilesReqBody).subscribe((response: any) => {
  //     this.fileUploads = response.data.map((file: any) => ({
  //       name: file.documentName, 
  //       type: file.documentType, 
  //       base64: file.base64Document, 
  //       fileBlob: this.convertBase64ToBlob(file.base64Document, file.documentType)
  //     }));
  //   }, error => {
  //     console.error('Error fetching uploaded files', error);
  //   });
  // }
  
  // convertBase64ToBlob(base64: string, fileType: string): Blob {
  //   const byteCharacters = atob(base64);
  //   const byteNumbers = new Array(byteCharacters.length);
  //   for (let i = 0; i < byteCharacters.length; i++) {
  //     byteNumbers[i] = byteCharacters.charCodeAt(i);
  //   }
  //   const byteArray = new Uint8Array(byteNumbers);
  //   return new Blob([byteArray], { type: fileType });
  // }
  
  // downloadFile(file: { name: string, fileBlob?: Blob, type: string }) {
  //   if (!file.fileBlob) {
  //     console.error("File blob is not available for download.");
  //     return;
  //   }
  
  //   const blob = file.fileBlob;
  //   const url = window.URL.createObjectURL(blob);
  
  //   const anchor = document.createElement('a');
  //   anchor.href = url;
  //   anchor.download = file.name;
  //   anchor.click();
  
  //   window.URL.revokeObjectURL(url);
  // }
 
fetchfileUploads(policyNumber: string, claimInfoId: string) {
  let claimsFilesReqBody = {
    "documentId": "",
    "policyNumber":policyNumber,
    "claimNumber":claimInfoId
  };

  this.claimsService.getUploadedFiles(claimsFilesReqBody).subscribe(
    (response: any) => {
      if (response.isSuccess && response.data.isSuccess) {
        // Parse the stringified data array
        const fileDataArray = JSON.parse(response.data.data);

        if (fileDataArray.length > 0) {
          this.noFilesFound = false;
          this.fileUploads = fileDataArray.map((file: any) => ({
            name: file.title, 
            type: file.colour, 
            base64: file.base64Document, 
            fileBlob: this.convertBase64ToBlob(file.base64Document, file.documentType)
          }));
        } else {
          this.noFilesFound = true;
          this.fileUploads = [];
        }
      } else {
        this.noFilesFound = true;
        this.fileUploads = [];
      }
    },
    (error) => {
      console.error('Error fetching uploaded files', error);
      this.noFilesFound = true;
    }
  );
}
  
  convertBase64ToBlob(base64: string, fileType: string): Blob {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: fileType });
  }
  
  downloadFile(file: { name: string, fileBlob?: Blob, type: string }) {
    if (!file.fileBlob) {
      console.error("File blob is not available for download.");
      return;
    }
    const url = window.URL.createObjectURL(file.fileBlob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = file.name;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    window.URL.revokeObjectURL(url);
  }
  

  onUnderDeficiencyFileSelected(event: any): void {
    const files = event.target.files;
    this.handleFileSelection(
      files,
      this.uploadedUnderDeficiencyFiles,
      "underDeficiency"
    );
  }

  onDocUploadFileSelected(event: any): void {
    const files = event.target.files;
    this.handleFileSelection(files, this.uploadedFiles, "docUpload");
  }

  handleFileSelection(
    files: FileList,
    uploadedFilesData: any[],
    section: string
  ): void {
    const totalFilesCount = uploadedFilesData.length;
  
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      const fileExists = this.uploadedFilesData.some(
        (uploadedFile:any) => uploadedFile.name === file.name && uploadedFile.size === file.size
      );
  
      if (!fileExists && this.allowedFileTypes.includes(file.type)) {
        uploadedFilesData.push({
          name: file.name,
          type: file.type,
          size: file.size,
          label: `File ${totalFilesCount + i + 1}`,
          file: file,
          uploadDateTime: new Date(),
          formattedUploadDateTime: new Date().toLocaleString(),
          status: "Pending",
        });
        
        // Reset uploadValidFormat since the file is valid
   //     this.uploadValidFormat = false; 
      } else {
        // If the file already exists or is invalid, set the valid format flag
        this.uploadValidFormat = true; 
      }
    }
  }
  
  // Submit claim method
  submitClaim(): void {
    if (
      this.uploadedFiles.length === 0 &&
      this.uploadedUnderDeficiencyFiles.length === 0
    ) {
      //   this.showError("Please upload at least one document");
      return;
    }

    const allFiles = [
      ...this.uploadedFiles,
      ...this.uploadedUnderDeficiencyFiles,
    ];

    const formData: FormData = new FormData();
    const createdBy = localStorage.getItem("agentCode") || "defaultAgentCode";

    allFiles.forEach((fileData, index) => {
      formData.append(`fileDetails[${index}].AgentCode`, createdBy);
      formData.append(`fileDetails[${index}].policyNumber`, this.policyNumber);
      formData.append(`fileDetails[${index}].Notes`, "Prescription");
      formData.append(`fileDetails[${index}].documentName`, fileData.name);
      formData.append(
        `fileDetails[${index}].documentType`,
        fileData.type.split("/")[1]
      );
      formData.append(`fileDetails[${index}].createdBy`, createdBy);
      formData.append(
        `fileDetails[${index}].file`,
        fileData.file,
        fileData.name
      );
      formData.append(
        `fileDetails[${index}].memberid`,
        this.saveForm?.value.memberId || ""
      );
    });

    this.claimsService.uploadFiles(formData).subscribe({
      next: (response) => {
        this.handleSuccessResponse(response);
        this.toast.success({ detail: "Claim submitted successfully" });
        this.router.navigate(["claims/claimsList"]);

      },
      error: (error) => {
        this.handleErrorResponse(error);
        this.toast.error({ detail: "Error occurred during claims submission" });
      },
    });
  }
  handleSuccessResponse(response: any): void {
    // Logic to handle success
  }

  handleErrorResponse(error: any): void {
    // Logic to handle error
  }

  formatDate(date: Date): string {
    return formatDate(date, "d MMMM yyyy, hh:mma", "en-US");
  }

  saveUpload(): void {
    this.saveForm = this.fb.group({
      policyNumber: [],
      labelName: [],
      documentName: [this.namesVariable],
      documentType: [this.documentType],
      createdBy: [localStorage.getItem("agentCode")],
      file: ["/D:/Downloads/ABHI_06_Ma"],
      claimInfoId: "21727183717381",
      // claimInfoId: this.claimInfoId || "",
      // memberId: this.form.get("memberId")?.value || "",
      memberId: "PT85650665",
      documentId: "",
    });
  }

  // onFileSelected(event: any): void {
  //   const files = event.target.files;
  //   this.totalFilesCount += files.length;
  //   // this.totalFilesDocCount += files.length;
  //   let uploadedFilesData =
  //     event.target.name == "underDeficiency"
  //       ? this.uploadedUnderDeficiencyFiles
  //       : this.uploadedFiles;

  //   //this.uploadedFilesCount =  this.totalFilesCount; // Reset count for new batch
  //   //this.failedFilesCount = this.totalFilesCount   // Reset failed files count for new batch
  //   for (let i = 0; i < files.length; i++) {
  //     const file = files[i];
  //     const fileExists = this.uploadedFiles.some((uploadedFile) => uploadedFile.name === file.name && uploadedFile.size === file.size);
  
  //     if (!fileExists && this.allowedFileTypes.includes(file.type)) {
  //       uploadedFilesData.push({
  //         name: file.name,
  //         type: file.type,
  //         size: file.size,
  //         label: "Label this document",
  //         isEditing: false,
  //         editableControl: new FormControl("Label this document"),
  //         uploadDateTime: new Date(),
  //         formattedUploadDateTime: this.formatDate(new Date()),
  //         status: "pending",
  //         file: file,
  //         policyNumber: this.saveForm?.value.policyNumber,
  //         documentName: this.saveForm?.value.documentName,
  //         documentType: this.saveForm?.value.documentType,
  //         createdBy: this.saveForm?.value.createdBy,
  //       });
  //       event.target.name == "underDeficiency"
  //         ? (this.uploadValidFormat = false)
  //         : (this.uploadValidFormt = false);
  //     } else {
  //       event.target.name == "underDeficiency"
  //         ? (this.uploadValidFormat = true)
  //         : (this.uploadValidFormt = true);
  //       event.target.value = "";
  //     }
  //   }
  //   if (
  //     this.uploadedUnderDeficiencyFiles.length > 0 &&
  //     event.target.name === "underDeficiency"
  //   ) {
  //     // Update the saveForm with the latest file info
  //     this.saveForm?.patchValue({
  //       file: this.uploadedUnderDeficiencyFiles[0].file, // Assuming you want to take the first file
  //     });
  //   } else if (
  //     this.uploadedFiles.length > 0 &&
  //     event.target.name === "docUpload"
  //   ) {
  //     this.saveForm?.patchValue({
  //       file: this.uploadedFiles[0].file, // Assuming you want to take the first file
  //     });
  //   }
  //   this.updateStatusLabel(event.target.name);
  //   this.uploadFiles(Array.from(files), event.target.name);
  // }
  onFileSelected(event: any): void {
    const inputElement = event.target;
    const files = inputElement.files;
    this.totalFilesCount += files.length;
  
    let uploadedFilesData =
      inputElement.name === "underDeficiency"
        ? this.uploadedUnderDeficiencyFiles
        : this.uploadedFiles;
  
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
  
      const fileExists = uploadedFilesData.some(
        (uploadedFile) =>
          uploadedFile.name === file.name && uploadedFile.size === file.size
      );
  
      if (!fileExists && this.allowedFileTypes.includes(file.type)) {
        uploadedFilesData.push({
          documentId: uuidv4(),
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
          policyNumber: this.saveForm?.value.policyNumber,
          documentName: this.saveForm?.value.documentName,
          documentType: this.saveForm?.value.documentType,
          createdBy: this.saveForm?.value.createdBy,
        });
  
        inputElement.name === "underDeficiency"
          ? (this.uploadValidFormat = false)
          : (this.uploadValidFormt = false);
      } else {
        inputElement.name === "underDeficiency"
          ? (this.uploadValidFormat = true)
          : (this.uploadValidFormt = true);
      }
    }
  
    inputElement.value = '';
  
    if (
      this.uploadedUnderDeficiencyFiles.length > 0 &&
      inputElement.name === "underDeficiency"
    ) {
      this.saveForm?.patchValue({
        file: this.uploadedUnderDeficiencyFiles[0].file, 
      });
    } else if (
      this.uploadedFiles.length > 0 &&
      inputElement.name === "docUpload"
    ) {
      this.saveForm?.patchValue({
        file: this.uploadedFiles[0].file, 
      });
    }
  
    this.updateStatusLabel(inputElement.name);
  
    this.uploadFiles(Array.from(files), inputElement.name);
  }
  
  
  convertBytesToKB(bytes: number): string {
    const kb = bytes / 1024;
    return `${kb.toFixed(2)} KB`;
  }

  // uploadFiles(files: File[],  section: string): void {
  //   const fileNames: string[] = files.map(file => file.name);
  //   const fileTypes: string[] = files.map(file => file.type);
  //   this.documentType = fileTypes;
  //   this.namesVariable = fileNames;
  //   const formData = new FormData();
  //   this.uploadedUnderDeficiencyFiles.forEach((file, index) => {

  //   const metadata = {
  //     policyNumber:this.policyNumber || '',
  //     labelName: file.label || '',
  //     documentName: this.namesVariable || '',
  //     documentType: this.documentType || '',
  //     createdBy: file.createdBy || '',
  //     claimInfoId: "21727183717381",
  //     // claimInfoId: this.claimInfoId || "",
  //      // memberId: this.form.get("memberId")?.value || "",
  //      memberId: 'PT85650665',
  //      documentId: "test2",

  //     };
  //     formData.append(`fileDetails[${index}].policyNumber`, metadata.policyNumber);
  //     formData.append(`fileDetails[${index}].labelName`, metadata.labelName);
  //     formData.append(`fileDetails[${index}].documentName`, metadata.documentName);
  //     formData.append(`fileDetails[${index}].documentType`, metadata.documentType);
  //     formData.append(`fileDetails[${index}].createdBy`, metadata.createdBy);
  //     formData.append(`fileDetails[${index}].file`, file.file, file.name);
  //     formData.append(`fileDetails[${index}].claimInfoId`,metadata.claimInfoId );
  //     formData.append(`fileDetails[${index}].memberId`, metadata.memberId);
  //     formData.append(`fileDetails[${index}].documentId`, metadata.documentId);

  //     });
  //     this.claimsService.uploadFiles(formData).subscribe((response:any) => {
  //     //const uploadedFile = this.uploadedFiles.find(f => f.file.name === file.name);
  //     if (response.success) {
  //       this.uploadedUnderDeficiencyFiles.map(file => file.status = 'success')
  //       this.uploadSuccess = true;
  //       this.uploadedFilesCount++;
  //       }
  //       this.updateStatusLabel();
  //       this.cdr.markForCheck();
  //       }, (_error: any) => {
  //       this.uploadedFile = this.uploadedUnderDeficiencyFiles.find(f => f.file.name === f.file.name);
  //       this.uploadedUnderDeficiencyFiles.map(file => file.status = 'failed')
  //       this.uploadSuccess = false;
  //       this.failedFilesCount++;
  //       this.updateStatusLabel();
  //       this.cdr.markForCheck();
  //       });
  //   }

  uploadFiles(files: File[], section: string): void {
    const fileNames: string[] = files.map((file) => file.name);
    const fileTypes: string[] = files.map((file) => file.type);
    this.documentType = fileTypes;
    this.namesVariable = fileNames;

    const formData = new FormData();

    // Loop through uploadedUnderDeficiencyFiles
    this.uploadedUnderDeficiencyFiles.forEach((deficiencyFile, index) => {
      const matchingFile = files.find(
        (file) => file.name === deficiencyFile.file.name
      );

      if (matchingFile) {
        const metadata = {
          policyNumber: this.policyNumber || "",
          labelName: section || "",
          documentName: matchingFile.name || "",
          documentType: matchingFile.type || "",
          createdBy: deficiencyFile.createdBy || "",
          claimInfoId: "21727183717381",
          memberId: "PT85650665",
          documentId: "",
        };

        // Append metadata and file to FormData
        formData.append(
          `fileDetails[${index}].policyNumber`,
          metadata.policyNumber
        );
        formData.append(`fileDetails[${index}].labelName`, metadata.labelName);
        formData.append(
          `fileDetails[${index}].documentName`,
          metadata.documentName
        );
        formData.append(
          `fileDetails[${index}].documentType`,
          metadata.documentType
        );
        formData.append(`fileDetails[${index}].createdBy`, metadata.createdBy);
        formData.append(
          `fileDetails[${index}].file`,
          matchingFile,
          matchingFile.name
        );
        formData.append(
          `fileDetails[${index}].claimInfoId`,
          metadata.claimInfoId
        );
        formData.append(`fileDetails[${index}].memberId`, metadata.memberId);
        formData.append(
          `fileDetails[${index}].documentId`,
          metadata.documentId
        );
      }
    });

    this.claimsService.uploadFiles(formData).subscribe(
      (response: any) => {
        if (response.success) {
          this.uploadedUnderDeficiencyFiles.forEach(
            (file) => (file.status = "success")
          );
          this.uploadSuccess = true;
          this.uploadedFilesCount++;
        }
        this.updateStatusLabel(section); // Update the status label on UI
        this.cdr.markForCheck(); // Ensure the change detection runs
      },
      (error: any) => {
        this.uploadedUnderDeficiencyFiles.forEach(
          (file) => (file.status = "failed")
        );
        this.uploadSuccess = false;
        this.failedFilesCount++;
        this.updateStatusLabel(section); // Update status on UI for failed files
        this.cdr.markForCheck();
      }
    );
  }

  updateStatusLabel(section: string): void {
    if (section === "underDeficiency") {
      this.underDeficiencyUploadStatus = `${this.uploadedUnderDeficiencyFiles.length} of ${this.uploadedUnderDeficiencyFiles.length} files uploaded`;
    } else {
      this.documentsUploadStatus = `${this.uploadedFiles.length} of ${this.uploadedFiles.length} files uploaded`;
    }
  }

  deleteFile(fileToDelete: any): void {
    const payload = {
      policyNumber: this.policyNumber,
      documentId: fileToDelete.documentId,
      claimNumber: ""
    };
  
    this.claimsService.deleteFile(payload).subscribe(
      (response:any) => {
        if (response.isSuccess) {
          console.log('File deleted successfully:', response);
          //  this.uploadedFiles = this.uploadedFiles.filter(
          //  (file) => file.documentId !== fileToDelete.documentId 
         // );
          this.totalFilesCount = this.uploadedFiles.length;
        } else {
          console.error('Failed to delete file:', response.message);
        }
      },
      (error) => {
        console.error('Error deleting file:', error);
      }
    );
  }
  // deleteFile(fileToDelete: any, isUploaded: boolean) {
  //   if (isUploaded)
  //     this.uploadedFiles = this.uploadedFiles.filter(
  //       (file) => file !== fileToDelete
  //     );
  //   else
  //     this.uploadedUnderDeficiencyFiles =
  //       this.uploadedUnderDeficiencyFiles.filter(
  //         (file) => file !== fileToDelete
  //       );

  //   this.totalFilesCount = isUploaded
  //     ? this.uploadedFiles.length
  //     : this.uploadedUnderDeficiencyFiles.length;

  //   const section = isUploaded
  //     ? "uploadedFiles"
  //     : "uploadedUnderDeficiencyFiles";

  //   this.updateStatusLabel(section);
  // }
  //******* file upload input label *********//
  startEditing(file: any) {
    file.isEditing = true;
    if (!file.editableControl) {
      file.editableControl = new FormControl(file.label);
    }
  }

  stopEditing(file: any) {
    if (this.editableControl.value !== this.label) {
      file.label = this.editableControl.value; // Update the label with the edited value
    }
    file.isEditing = false;
    file.isEdited = true;
  }

  fetchClaimHistory(policyNumber: string) {
    console.log(this.claimInfoId);
    const policyNo = policyNumber;
    let claimHistoryReqBody = {
      policyNumber: policyNo,
    };

    this.claimsService
      .getClaimsHistory(claimHistoryReqBody, policyNo)
      .subscribe((response: any) => {
        this.claimsHistory = response.data;
        console.log("resp", this.claimsHistory);
      });
  }

  navigateToListClaim() {
    this.router.navigate(["claims/claimsList"]);
  }
  toggleViewDetails() {
    this.isViewVisible = !this.isViewVisible;
  }
  moveToDocsSection(data: any) {
    this.selectedTabIndex = data;
  }
  // submitClaim(files: File[], section: string) {

  //   this.uploadedUnderDeficiencyFiles.forEach((deficiencyFile, index) => {
  //     const matchingFile = files.find(file => file.name === deficiencyFile.file.name);
  //     const formData = new FormData();
  //     if (matchingFile) {
  //       // Create metadata for each file
  //       const metadata = {
  //         policyNumber: this.policyNumber || '',
  //         labelName: section || '', // Use section value for label
  //         documentName: matchingFile.name || '',
  //         documentType: matchingFile.type || '',
  //         createdBy: deficiencyFile.createdBy || '',  // Source from deficiencyFile
  //         claimInfoId: "21727183717381",             // Static claimInfoId, replace dynamically if needed
  //         memberId: 'PT85650665',                    // Static memberId, replace dynamically if needed
  //         documentId: "test2",                       // Static documentId
  //       };

  //       // Append metadata and file to FormData
  //       formData.append(`fileDetails[${index}].policyNumber`, metadata.policyNumber);
  //       formData.append(`fileDetails[${index}].labelName`, metadata.labelName);
  //       formData.append(`fileDetails[${index}].documentName`, metadata.documentName);
  //       formData.append(`fileDetails[${index}].documentType`, metadata.documentType);
  //       formData.append(`fileDetails[${index}].createdBy`, metadata.createdBy);
  //       formData.append(`fileDetails[${index}].file`, matchingFile, matchingFile.name);
  //       formData.append(`fileDetails[${index}].claimInfoId`, metadata.claimInfoId);
  //       formData.append(`fileDetails[${index}].memberId`, metadata.memberId);
  //       formData.append(`fileDetails[${index}].documentId`, metadata.documentId);
  //     }
  //   });
  //   // Prepare form data with uploaded files
  //   const formData = this.uploadFiles(files, section);

  //   // Call the service to upload the files
  //   this.claimsService.uploadFiles(formData).subscribe(
  //     (response: any) => {
  //       if (response.success) {
  //         // Update status for each file as success
  //         this.uploadedUnderDeficiencyFiles.forEach(file => file.status = 'success');
  //         this.uploadSuccess = true;
  //         this.uploadedFilesCount++;
  //       } else {
  //         // Handle any errors returned in the response
  //         this.uploadedUnderDeficiencyFiles.forEach(file => file.status = 'failed');
  //         this.uploadSuccess = false;
  //         this.failedFilesCount++;
  //       }
  //       this.updateStatusLabel(section); // Update the status label on UI
  //       this.cdr.markForCheck();  // Ensure the change detection runs
  //     },
  //     (error: any) => {
  //       // Handle failure, mark all files as failed
  //       this.uploadedUnderDeficiencyFiles.forEach(file => file.status = 'failed');
  //       this.uploadSuccess = false;
  //       this.failedFilesCount++;
  //       this.updateStatusLabel(section); // Update status on UI for failed files
  //       this.cdr.markForCheck();
  //     }
  //   );
  // }

}
