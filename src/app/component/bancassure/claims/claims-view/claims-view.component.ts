import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/services/common.service';
import { ClaimData } from 'src/app/interface/claims.interface';
import { formatDate } from '@angular/common';
import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { NgToastService } from 'ng-angular-popup';
import { MSAL_GUARD_CONFIG, MsalGuardConfiguration } from '@azure/msal-angular';


@Component({
  selector: 'app-claims-view',
  templateUrl: './claims-view.component.html',
  styleUrls: ['./claims-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})


export class ClaimsViewComponent {
  // uploadedFiles: File[] = [];
  form!: FormGroup;
  saveForm!: FormGroup; 
  proposalNumbers: string[] = [];
  policyNumbers: string[] = [];
  productNames: string[] = [];
  memberNames: string[] = [];
  claimTypes: string[] = [];
  showQuickActions = false;
  @Input() label: string = 'Label this document'; 
  files: {name:string, label:string}[] = [];
  editableControl: FormControl = new FormControl(''); // FormControl for the input field
  isEditing: boolean = false;
  isEdited: boolean = false;
  uploadDateTime: Date | null = null;
  formattedUploadDateTime: string = '';
  totalFilesCount = 0;
  uploadedFilesCount = 0;
  uploadStatus = '0 of 0 files uploaded';
  failedFilesCount = 0;
  uploadSuccess: boolean = true;
  namesVariable:any
  documentType:any
  response:any
  uploadedFile:any
  @Input() uploadedFiles: { 
    name: string,
    label: string,
    isEditing?: boolean,
    isEdited?: boolean,
    editableControl?: FormControl,
    uploadDateTime?: Date,
    formattedUploadDateTime?: string,
    status:string,
    file: File,
    policyNumber?: string,
    documentName?: string,
    documentType?: string,
    createdBy?: string
  }[] = [];
  
  constructor(private fb: FormBuilder, private commonService: CommonService,  private cdr: ChangeDetectorRef,
    private toast: NgToastService,@Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,

  ){}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['label']) {
     this.editableControl.setValue(this.label); // Update FormControl when label changes
    }
  }

  ngOnInit(): void {
    this.createForm();
    this.saveUpload();
    this.fetchData();
   
  }
  saveUpload(): void {
    this.saveForm = this.fb.group({
      policyNumber: [this.form.get('policyNumber')?.value, [ Validators.pattern(/^\d+$/)]], // Validate integer
      labelName: [],
      documentName: [this.namesVariable ],
      documentType: [this.documentType, [ Validators.pattern(/^(Pdf|jpeg|png)$/)]], // Validate type
      createdBy: [localStorage.getItem('agentcode'), [Validators.pattern(/^\d+$/)]], // Validate integer
      file:['/D:/Downloads/ABHI_06_Ma']

    });
  }
  createForm(): void {
    this.form = this.fb.group({
      id: localStorage.getItem('agentcode'),
      policyNumber: [''],
      proposalNumber: [''],
      memberName: [''],
      productName: [''],
      fullName: [''],
      policyType: [''],
      memberRelation: [''],
      requestType: [''],
      claimStatus: [''],
      raisedDate: [''],
      hospitalName: [''],
      isFileUploadRequired: [true],
      claimedAmount: [''],
      approvedAmount: [''],
      deductedAmount: [''],
      deductionReason: [''],
      coPayAmount: [''],
      reasonForCoPay: [''],
      coverName: [''],
      sellerId: [''],
      claimType: [''],
      notes: [''],
      proposerName: ['']
    });
  }
 
  payload = {
    "sellerId": 5100003,
  }
  
  fetchData(): void {
  this.commonService.getProposalDetails().subscribe(
    response => {
      if (response.success) {
        const allData: ClaimData[] = response.data;

        // Extract unique values for dropdowns
        this.proposalNumbers = this.extractUniqueValues(allData, 'proposalNumber');
        this.policyNumbers = this.extractUniqueValues(allData, 'policyNumber');
        this.memberNames = this.extractUniqueValues(allData, 'fullName');
        this.claimTypes = this.extractUniqueValues(allData, 'policyType');
        this.cdr.markForCheck();
      } else {
        console.error('Failed to fetch dropdown data', response.message);
      }
    },
    error => console.error('Error fetching dropdown data', error)
  );
}

// Helper function to extract unique values
extractUniqueValues(data: any[], key: string): any[] {
  return [...new Set(data.map(item => item[key]).filter(val => val))];
}


handleDropdownChange(event:any){
  console.log('evenr', event);
  this.form.get('policyNumber')?.setValue(event.value);
  console.log(this.form.get('policyNumber')?.value);
  
}
 //-------------- Method to handle file upload------------------//
 formatDate(date: Date): string {
  return formatDate(date, 'd MMMM yyyy, hh:mma', 'en-US');
}

onFileSelected(event: any): void {
  const files = event.target.files;
  this.totalFilesCount += files.length;
  //this.uploadedFilesCount =  this.totalFilesCount; // Reset count for new batch
  //this.failedFilesCount = this.totalFilesCount   // Reset failed files count for new batch

for (let i = 0; i < files.length; i++) {
  const file = files[i];
  this.uploadedFiles.push({
    name: file.name,
    label: 'Label this document',
    isEditing: false,
    editableControl: new FormControl('Label this document'),
    uploadDateTime: new Date(),
    formattedUploadDateTime: this.formatDate(new Date()),
    status: 'pending',
    file: file,
    policyNumber: this.saveForm.value.policyNumber,
    documentName: this.saveForm.value.documentName,
    documentType: this.saveForm.value.documentType,
    createdBy: this.saveForm.value.createdBy
  });
  
}
  // Update the saveForm with the latest file info
  if (this.uploadedFiles.length > 0) {
    this.saveForm.patchValue({
      file: this.uploadedFiles[0].file // Assuming you want to take the first file
    });
  }

this.updateStatusLabel();
this.uploadFiles(Array.from(files));
}

uploadFiles(files: File[]): void {
  const fileNames: string[] = files.map(file => file.name);
  const fileTypes: string[] = files.map(file => file.type);
  this.documentType = fileTypes; 
  this.namesVariable = fileNames;
  const formData = new FormData();
  this.uploadedFiles.forEach((file, index) => {
    console.log("File",file)
    const metadata = {
      policyNumber: this.form.get('policyNumber')?.value || '',
      labelName: file.label || '',
      documentName: this.namesVariable || '',
      documentType: this.documentType || '',
      createdBy: file.createdBy || ''
    };

    // Append metadata
    formData.append(`fileDetails[${index}].policyNumber`, metadata.policyNumber);
    formData.append(`fileDetails[${index}].labelName`, metadata.labelName);
    formData.append(`fileDetails[${index}].documentName`, metadata.documentName);
    formData.append(`fileDetails[${index}].documentType`, metadata.documentType);
    formData.append(`fileDetails[${index}].createdBy`, metadata.createdBy);
    formData.append(`fileDetails[${index}].file`, file.file, file.file.name);
  });
    
    this.commonService.uploadFiles(formData).subscribe(response => {
    //  const uploadedFile = this.uploadedFiles.find(f => f.file.name === file.name);
      if (response.success) {
        this.uploadedFile.status = 'success';
        this.uploadSuccess = true;
        this.uploadedFilesCount++;
        console.log(this.uploadSuccess);
        }
      this.updateStatusLabel();
      this.cdr.markForCheck(); // Trigger change detection
    }, error => {
      this.uploadedFile = this.uploadedFiles.find(f => f.file.name === f.file.name);
      this.uploadedFile.status = 'failed';
      this.failedFilesCount++;
      this.updateStatusLabel();
      this.cdr.markForCheck(); // Trigger change detection
    });
  ;
}

updateStatusLabel(): void {
 // this.uploadStatus = `${this.uploadedFilesCount} of ${this.totalFilesCount} files uploaded`;
 this.uploadStatus = `${this.totalFilesCount} of ${this.totalFilesCount} files uploaded`;
}
deleteFile(fileToDelete: any) {
  this.uploadedFiles = this.uploadedFiles.filter(file => file !== fileToDelete);
  this.totalFilesCount = this.uploadedFiles.length;
// Ensure the status label is updated accordingly
this.updateStatusLabel();
}

////////////////////file upload input label //////////////////

 // Method to start editing a file
startEditing(file: any) {
  console.log('edit');
  file.isEditing = true;
if (!file.editableControl) {
  file.editableControl = new FormControl(file.label);
}
}

// Method to Stop editing changes
stopEditing(file:any) {
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

validateFormData(formData: any): boolean {
  // Basic validation example, extend as needed
  if (!formData.policyNumber || !/^\d+$/.test(formData.policyNumber)) {
    return false;
  }
  if (!formData.labelName || typeof formData.labelName !== 'string') {
    return false;
  }
  if (!formData.documentName || typeof formData.documentName !== 'string') {
    return false;
  }
  if (!formData.documentType || !/^(Pdf|jpeg)$/.test(formData.documentType)) {
    return false;
  }
  if (!formData.createdBy || !/^\d+$/.test(formData.createdBy)) {
    return false;
  }
  return true;
}

submitResponse(): void {
if (this.saveForm.valid || this.form.valid) {
  const saveClaimData = this.form.value;
  
  // Prepare a single FormData object for all files
   const fileUploadFormData = new FormData();
  
  // Collect metadata and files into FormData
  this.uploadedFiles.forEach((file, index) => {
    console.log("File",file)
    const metadata = {
      policyNumber: this.form.get('policyNumber')?.value || '',
      labelName: file.label || '',
      documentName: this.namesVariable || '',
      documentType: this.documentType || '',
      createdBy: file.createdBy || '',
      file: file.file
    };

    // Append metadata
    fileUploadFormData.append(`fileDetails[${index}].policyNumber`, metadata.policyNumber);
    fileUploadFormData.append(`fileDetails[${index}].labelName`, metadata.labelName);
    fileUploadFormData.append(`fileDetails[${index}].documentName`, metadata.documentName);
    fileUploadFormData.append(`fileDetails[${index}].documentType`, metadata.documentType);
    fileUploadFormData.append(`fileDetails[${index}].createdBy`, metadata.createdBy);
    fileUploadFormData.append(`fileDetails[${index}].file`, file.file, file.file.name);
  });

  // Prepare observables for API calls
  const fileUploadObservable = this.commonService.uploadFiles(fileUploadFormData).pipe(
    map(response => ({ response })),
    catchError(error => of({ error }))
  );

  const saveClaimObservable = this.commonService.saveClaims(saveClaimData).pipe(
    map(response => ({ response })),
    catchError(error => of({ error }))
  );

  // Use forkJoin to run both observables in parallel
  forkJoin([fileUploadObservable, saveClaimObservable]).subscribe(results => {
    const fileUploadResult = results[0];
    const claimsResult = results[1];

    // Handle file upload response
    if ('response' in fileUploadResult) {
      
      const response = fileUploadResult.response;
      console.log('resp',response);
      
  

      if (response.success) {
        
        console.log("isFileUploaded");
        
        this.toast.success({ detail: 'Files uploaded successfully' });
      //  isFileUpload = true
        this.uploadedFilesCount = this.uploadedFiles.length; // Update count based on files uploaded
      } else {
        this.toast.error({ detail: 'Failed to upload files', duration: 3000 });
        
      }
    } else if ('error' in fileUploadResult) {
      this.toast.error({ detail: 'Error occurred during file upload', duration: 3000 });
    }

    // Handle claims submission response
    if ('response' in claimsResult) {
        this.response = claimsResult.response;
      if (this.response.success === true) {
        console.log("claimSubmitted");
        this.uploadSuccess = true;
        this.toast.success({ detail: 'Claims submitted successfully' });

      } else {
        console.log("qwertyuytaer")
       
        this.toast.error({ detail: 'Failed to submit claims' });
      }
    } else if ('error' in claimsResult) {
      this.toast.error({ detail: 'Error occurred during claims submission', duration: 3000 });
    }

    this.updateStatusLabel();
  },
  error => {
    this.toast.error({ detail: 'Error occurred', duration: 3000 });
  });
} else {
  this.toast.error({ detail: 'Please fill in the required form fields.' });
}
}



}


