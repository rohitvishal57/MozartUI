import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Input, OnInit, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ClaimData } from 'src/app/interface/claims.interface';
import { formatDate } from '@angular/common';
import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { NgToastService } from 'ng-angular-popup';
import { MSAL_GUARD_CONFIG, MsalGuardConfiguration } from '@azure/msal-angular';
import { Router } from '@angular/router';
import { ClaimsService } from 'src/app/services/claims/claims.service';


@Component({
  selector: 'app-claims-view',
  templateUrl: './claims-view.component.html',
  styleUrls: ['./claims-view.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})


export class ClaimsViewComponent {
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
  agentCode: any;
  selectMemberData: any = {};
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
  
  constructor(private fb: FormBuilder, private claimsService: ClaimsService,  private cdr: ChangeDetectorRef, private router:Router,
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
      policyNumber: [this.form.get('policyNumber')?.value, [ Validators.pattern(/^\d+$/)]], 
      labelName: [],
      documentName: [this.namesVariable ],
      documentType: [this.documentType, [ Validators.pattern(/^(Pdf|jpeg|png)$/)]], 
      createdBy: [localStorage.getItem('agentCode'), [Validators.pattern(/^\d+$/)]], 
      file:['/D:/Downloads/ABHI_06_Ma']

    });
  }
  createForm(): void {
    this.form = this.fb.group({
      id: localStorage.getItem('agentCode'),
      policyNumber: ['',Validators.required],
      proposalNumber: ['',Validators.required],
      memberName: ['', Validators.required],
      productName: [''],
      fullName: [''],
      policyType: ['',Validators.required],
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
      sellerId: localStorage.getItem('agentCode'),
      claimType: [''],
      notes: [''],
      proposerName: ['']
    });
  }
 
  fetchData(): void {
     this.agentCode = localStorage.getItem('agentCode');
     this.claimsService.getProposalDetails(this.agentCode).subscribe(
    response => {
      if (response.success) {
        this.response = response;
          
        const allData: ClaimData[] = response.data;    
        // Extract unique values for dropdowns
        //this.proposalNumbers = this.extractUniqueValues(allData, 'proposalNumber');
        this.policyNumbers = this.extractUniqueValues(allData, 'policyNumber');
        // this.memberNames = this.extractUniqueValues(allData, 'fullName');
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
  console.log('datakey',data,key);
  
  return [...new Set(data.map(item => item[key]).filter(val => val))];

}
handleDropdownChange(event: any): void {
  const selectedPolicyNumber = event.value;
  // Filter the response data to find members for the selected policy number
  const filteredMembers = this.response.data.filter((item: any) => item.policyNumber === selectedPolicyNumber);
  
  // Extract unique member names from the filtered members
  this.memberNames = this.extractUniqueValues(filteredMembers, 'fullName');

  // Reset memberName form control
  this.form.get('memberName')?.setValue('');
  this.cdr.markForCheck(); // Ensure the view updates
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
    
    this.claimsService.uploadFiles(formData).subscribe(response => {
    //  const uploadedFile = this.uploadedFiles.find(f => f.file.name === file.name);
      if (response.success) {
        this.uploadedFiles.map(file => file.status = 'success')
        this.uploadSuccess = true;
        this.uploadedFilesCount++;
        console.log(this.uploadedFile);
        }
      this.updateStatusLabel();
      this.cdr.markForCheck(); // Trigger change detection
    }, error => {
      this.uploadedFile = this.uploadedFiles.find(f => f.file.name === f.file.name);
      this.uploadedFiles.map(file => file.status = 'failed')
      this.uploadSuccess = false;
      this.failedFilesCount++;
      this.updateStatusLabel();
      this.cdr.markForCheck(); // Trigger change detection
    });
  ;
}

updateStatusLabel(): void {
 // this.uploadStatus = `${this.uploadedFilesCount} of ${this.totalFilesCount} files uploaded`;
 this.uploadStatus = `${this.uploadedFilesCount} of ${this.totalFilesCount} files uploaded`;
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


onSubmit(): void{
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
  const fileUploadObservable = this.claimsService.uploadFiles(fileUploadFormData).pipe(
    map(response => ({ response })),
    catchError(error => of({ error }))
  );

  const saveClaimObservable = this.claimsService.saveClaims(saveClaimData).pipe(
    map(response => ({ response })),
    catchError(error => of({ error }))
  );

  // Use forkJoin to run both observables in parallel
  forkJoin([fileUploadObservable, saveClaimObservable]).subscribe(results => {
    const fileUploadResult = results[0];
    const claimsResult = results[1];
    // Handle claims submission response
    if ('response' in claimsResult) {
        this.response = claimsResult.response;
      if (this.response.success === true) {
        this.uploadSuccess = true;
        this.toast.success({ detail: 'Claims submitted successfully' });
        this.router.navigate(['portal/agent/viewClaims'])

      } else {
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


