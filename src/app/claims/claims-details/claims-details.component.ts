
import { ChangeDetectorRef, Component, Input } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ClaimsViewService } from "../claims-view/claims-view.service";
import { formatDate } from "@angular/common";
import { NgToastService } from "ng-angular-popup";
import { v4 as uuidv4 } from 'uuid';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: "app-claims-details",
  templateUrl: "./claims-details.component.html",
  styleUrls: ["./claims-details.component.scss"],
})
export class ClaimsDetailsComponent {
  claimId: string | null = null;
  claimsHistory: any[] = [];
  policyNumber: string | any;
  claimNumber: string | any;
  filesUploaded: any[] = [];
  saveForm!: FormGroup;
  claims: any;
  designationName: string | any;
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
    createdDateTime: string,
    base64: string,
    fileBlob?: Blob,
    documentId: string;
  }[] = [];
  customeStepperStatuses: any[] = [];
  statusMessage: string | undefined;
  uploadedFilesData: any;
  documentId: any;
  claimType: any;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private claimsService: ClaimsViewService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private toast: NgToastService,
    private languageService: LanguageService,
    private translateService: TranslateService

  ) {
    this.route.queryParams.subscribe((params) => {

      this.claimId = this.route.snapshot.paramMap.get("id");
      this.policyNumber = this.route.snapshot.paramMap.get("policyNumber");
      this.claimNumber = this.route.snapshot.paramMap.get("claimInfoId");
    });
  }

  ngOnInit() {
    this.designationName = localStorage.getItem('designation')
    if(this.designationName === 'DIRECT'){
      this.designationName = 'Agent'
    }
    this.languageService.language$.subscribe(lang => {
      this.translateService.use(lang).subscribe({
        error: () => {
          this.translateService.use('en'); // Fallback to English if translation file is missing
        }
      });
    });
    this.fetchfileUploads(this.claimNumber, this.policyNumber)
    if (this.claimId && this.policyNumber && this.claimNumber) {
      this.fetchClaimDetails(this.claimId, this.policyNumber, this.claimNumber);
      this.updateStatusLabel("fileUpload");
    }
    this.fetchClaimStatus(this.claimNumber);
    this.fetchClaimTracker(this.claimNumber);
    this.fetchClaimHistory(this.policyNumber);

    // this.claimId = this.route.snapshot.paramMap.get('id');
    // if (this.claimId) {
    // this.fetchClaimDetails(this.claimId);
    // this.updateStatusLabel();
  }
  fetchClaimStatus(claimNumber: string): void {
    const claimsReqBody = {
      claimNumber: claimNumber,
    };
 
    this.claimsService.getClaimStatus(claimsReqBody).subscribe(
      (response: any) => {
        this.status = response?.data;
        this.statusMessage = response?.data?.notes;        
        (response?.data?.claimStatus === "Under Deficiency") ? this.underDef = true : this.underDef = false;
      },
      (error: any) => {
        console.error("Error fetching claim details", error);
      }
    );
  }

  fetchClaimTracker(claimNumber: string): void {
    const claimsReqBody = {
      claimNumber: claimNumber,
    };

    this.claimsService.getClaimTracker(claimsReqBody).subscribe(
      (response: any) => {
        this.customeStepperStatuses = response?.data;        
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
    claimNumber: string
  ): void {
    let claimDetailsReqBody = {
      id: claimId,
      claimNumber: claimNumber,
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
 
// fetchfileUploads(claimInfoId: string, policyNumber: string) {
//   let claimsFilesReqBody = {
//     "documentId": "",
//     "policyNumber":policyNumber,
//     "claimNumber":claimInfoId
//   };

//   this.claimsService.getUploadedFiles(claimsFilesReqBody).subscribe(
//     (response: any) => {
//       if (response.isSuccess ) {
//         // Parse the stringified data array
//        // const fileDataArray = JSON.parse(response.data);

//         if (response.data.length > 0) {
//           this.noFilesFound = false;
//           this.fileUploads = response.data.map((file: any) => ({
//             documentName: file.title, 
//             documentType: file.colour, 
//             base64: file.base64Document, 
//             fileBlob: this.convertBase64ToBlob(file.base64Document, file.documentType)
//           }));
//         } else {
//           this.noFilesFound = true;
//           this.fileUploads = [];
//         }
//       } else {
//         this.noFilesFound = true;
//         this.fileUploads = [];
//       }
//     },
//     (error) => {
//       console.error('Error fetching uploaded files', error);
//       this.noFilesFound = true;
//     }
//   );
// }
  
//   convertBase64ToBlob(base64: string, fileType: string): Blob {
//     const byteCharacters = atob(base64);
//     const byteNumbers = new Array(byteCharacters.length);
//     for (let i = 0; i < byteCharacters.length; i++) {
//       byteNumbers[i] = byteCharacters.charCodeAt(i);
//     }
//     const byteArray = new Uint8Array(byteNumbers);
//     return new Blob([byteArray], { type: fileType });
//   }
  
fetchfileUploads(claimNumber: string, policyNumber: string) {
  let claimsFilesReqBody = {
    "documentId": "",
    "policyNumber": policyNumber,
    "claimNumber": claimNumber
  };

  this.claimsService.getUploadedFiles(claimsFilesReqBody).subscribe(
    (response: any) => {
      if (response.isSuccess) {
        if (response.data.length > 0) {
            this.noFilesFound = false;
            this.fileUploads = response.data.map((file: any) => ({
            name: file.documentName,  
            type: file.documentType, 
            createdDateTime: file.createdDateTime,
            base64: file.base64Document,
            fileBlob: this.convertBase64ToBlob(file.base64Document, this.getMimeType(file.colour)),
            documentId: file.documentId  
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
  const base64Data = base64.startsWith('data:') ? base64.split(',')[1] : base64;

  // Convert the base64 string to a byte array
  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);

  // Create a Blob object from the byte array
  return new Blob([byteArray], { type: fileType });
}

getMimeType(documentType: string): string {
  switch (documentType) {
    case 'Pdf':
      return 'application/pdf';
    case 'Image':
      return 'image/png';  
    default:
      return 'application/octet-stream'; 
  }
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
      claimNumber: this.claimNumber || "",
      memberId: "",
      documentId: "",
    });
  }

  onFileSelected(event: any): void {
    const inputElement = event.target;
    const files = inputElement.files;
    this.totalFilesCount += files.length;

    for (let i = 0; i < files.length; i++) {
        const file = files[i];

        const fileExists = this.uploadedFiles.some(
            (uploadedFile) =>
                uploadedFile.name === file.name && uploadedFile.size === file.size
        );

        if (!fileExists && this.allowedFileTypes.includes(file.type)) {
            this.uploadedFiles.push({
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
            this.uploadValidFormt = false;
        } else {
            this.uploadValidFormt = true;
        }
    }

    inputElement.value = '';

    if (this.uploadedFiles.length > 0) {
        this.saveForm?.patchValue({
            file: this.uploadedFiles[0].file, 
        });
    }
    this.updateStatusLabel(inputElement.name);
    this.uploadFiles(Array.from(files), 'docUpload');
}

uploadFiles(files: File[], section: string): void {
    const formData = new FormData();
    const fileNames: string[] = files.map((file) => file.name);
    const fileTypes: string[] = files.map((file) => file.type);
    this.documentType = fileTypes;
    this.namesVariable = fileNames;
    this.uploadedFiles.forEach((file, index) => {
            const metadata = {
                policyNumber: this.policyNumber || "",
                labelName: file.label || "",  
                documentName: file.name || "",
                documentType: file.type || "",
                createdBy: file.createdBy || "",
                claimNumber: "",  
                memberId: "", 
                documentId: file.documentId, 
            }

            formData.append(`fileDetails[${index}].policyNumber`, metadata.policyNumber);
            formData.append(`fileDetails[${index}].labelName`, metadata.labelName);
            formData.append(`fileDetails[${index}].documentName`, metadata.documentName);
            formData.append(`fileDetails[${index}].documentType`, metadata.documentType);
            formData.append(`fileDetails[${index}].createdBy`, metadata.createdBy);
            formData.append(`fileDetails[${index}].claimNumber`, metadata.claimNumber);
            formData.append(`fileDetails[${index}].memberId`, metadata.memberId);
            formData.append(`fileDetails[${index}].documentId`, metadata.documentId);
            formData.append(`fileDetails[${index}].file`, file.file, file.file.name);
       
    });
    debugger

    this.claimsService.uploadFiles(formData).subscribe(
        (response: any) => {
            console.log('Upload response:', response);
            if (response.isSuccess) {
                this.uploadedFiles.forEach((file) => (file.status = "success"));
                this.uploadSuccess = true;
                this.uploadedFilesCount++;
            }
            else{
              this.uploadSuccess = false;
            }
            this.updateStatusLabel(section);  
            this.cdr.markForCheck();
        },
        (error: any) => {
            console.error('Upload error:', error);
            this.uploadedFiles.forEach((file) => (file.status = "failed"));
            this.uploadSuccess = false;
            this.failedFilesCount++;
            this.updateStatusLabel(section); 
            this.cdr.markForCheck();
        }
    );
}

convertBytesToKB(bytes: number): string {
    const kb = bytes / 1024;
    return `${kb.toFixed(2)} KB`;
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
           this.uploadedFiles = this.uploadedFiles.filter(
           (file) => file.documentId !== fileToDelete.documentId 
         );
          this.totalFilesCount = this.uploadedFiles.length;
          this.cdr.detectChanges();
        } else {
          console.error('Failed to delete file:', response.message);
        }
      },
      (error) => {
        console.error('Error deleting file:', error);
      }
    );
  }
 
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
    console.log(this.claimNumber);
    const claimHistoryReqBody = { policyNumber };

    this.claimsService.getClaimsHistory(claimHistoryReqBody, policyNumber).subscribe(
        (response: any) => {
            if (response.isSuccess && response.data.length > 0) {
                this.claimsHistory = response.data;
                this.isViewVisible = true; 
            } else {
                this.claimsHistory = []; 
                this.isViewVisible = true; 
            }
        },
        (error: any) => {
            console.error("Error fetching claim history:", error);
            this.claimsHistory = [];
            this.isViewVisible = true;
        }
    );
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

  updateClaim(): void {
    const UpdateClaimReqBody = {
      agentCode: localStorage.getItem('agentCode'),
      claimNumber: this.claimNumber,
      policyNumber: this.policyNumber,
      documentsArray: this.uploadedFiles.map(file => ({
        documentId: file.documentId,
        documentName: file.name,
        status: file.status,         
        labelName: file.label
      }))
    };
  
    this.claimsService.updateClaim(UpdateClaimReqBody).subscribe(
      (response: any) => {
        if (response.isSuccess) {
          this.toast.success({ detail: "Claims updated successfully" });
          this.uploadSuccess = true;
        } else {
          this.toast.error({ detail: "Failed to update claims" });
        }
      },
      (error) => {
        console.error('Submission failed', error);
        this.uploadSuccess = false;
      }
    );
  }
  
}
