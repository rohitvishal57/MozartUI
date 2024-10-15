import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClaimsViewService } from '../claims-view/claims-view.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-claims-details',
  templateUrl: './claims-details.component.html',
  styleUrls: ['./claims-details.component.scss']
})
export class ClaimsDetailsComponent {
  claimId: string | null = null;  
  claimsHistory:any
  policyNumber: string | any ;  
  claimInfoId: string | null = null;  
  filesUploaded: any[] = [];
  saveForm!: FormGroup;
  claims: any;
  @Input() label: string = 'Label this document'; 
  files: {name:string, label:string}[] = [];
  editableControl: FormControl = new FormControl(''); 
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
  selectedTabIndex: number = 0;
  @Input() uploadedFiles: { 
    name: string,
    type: string,
    size: number,
    label: string,
    isEditing?: boolean,
    isEdited?: boolean,
    editableControl?: FormControl,
    uploadDateTime?: Date,
    formattedUploadDateTime?: string,
    status:string,
    file:File,
    policyNumber?: string,
    documentName?: string,
    documentType?: string,
    createdBy?: string
  }[] = [];
  constructor(private fb: FormBuilder, private route: ActivatedRoute, private claimsService: ClaimsViewService, private router: Router,  private cdr: ChangeDetectorRef) 
  {
    this.route.queryParams.subscribe(params => {

      this.claimId = this.route.snapshot.paramMap.get('id');
      this.policyNumber = this.route.snapshot.paramMap.get('policyNumber');
      this.claimInfoId = this.route.snapshot.paramMap.get('claimInfoId');
   
  })
}

  ngOnInit() {
    if (this.claimId && this.policyNumber && this.claimInfoId) {
      this.fetchClaimDetails(this.claimId, this.policyNumber, this.claimInfoId);  
      this.updateStatusLabel();
  
      }
    
    this.fetchClaimHistory(this.policyNumber)
  
    // this.claimId = this.route.snapshot.paramMap.get('id');
    // if (this.claimId) {
    // this.fetchClaimDetails(this.claimId);  
    // this.updateStatusLabel();
    }
      // console.log( 'updatestayus', this.updateStatusLabel());
      // const storedFiles = localStorage.getItem('uploadedFiles');
      // if (storedFiles) {
      //   this.uploadedFiles = JSON.parse(storedFiles);
      // }
 // }

  fetchClaimDetails(claimId: string,policyNumber:string, claimInfoId:string): void {    
    let claimDetailsReqBody = {
      id: claimId,
      claimNumber: claimInfoId,
      policyNumber:policyNumber
    };
    this.claimsService.getClaimDetailsView(claimDetailsReqBody).subscribe(
      (response:any):void => {
      
        this.claims =response.data       
   
    },
    (error:any) => {
      console.error('Error fetching claim details', error);
    }
  );
  }

  onTabChanged(event: any): void {
    this.selectedTabIndex = event.index;
  }

   //  -------------- Method to handle file upload------------------//
  formatDate(date: Date): string {
    return formatDate(date, 'd MMMM yyyy, hh:mma', 'en-US');
  }

  saveUpload(): void {
    this.saveForm = this.fb.group({
    policyNumber: [], 
    labelName: [],
    documentName: [this.namesVariable ],
    documentType: [this.documentType], 
    createdBy: [localStorage.getItem('agentCode')], 
    file:['/D:/Downloads/ABHI_06_Ma']

  });
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
        type: file.type,
        size: file.size,
        label: 'Label this document',
        isEditing: false,
        editableControl: new FormControl('Label this document'),
        uploadDateTime: new Date(),
        formattedUploadDateTime: this.formatDate(new Date()),
        status: 'pending',
        file: file,
        policyNumber: this.saveForm?.value.policyNumber,
        documentName: this.saveForm?.value.documentName,
        documentType: this.saveForm?.value.documentType,
        createdBy: this.saveForm?.value.createdBy,   
      });
    }      
    if (this.uploadedFiles.length > 0) {   // Update the saveForm with the latest file info
        this.saveForm?.patchValue({
          file: this.uploadedFiles[0].file // Assuming you want to take the first file
        });
      }   
    this.updateStatusLabel();
    this.uploadFiles(Array.from(files));
}

convertBytesToKB(bytes: number): string {
  const kb = bytes / 1024;
  return `${kb.toFixed(2)} KB`;
}

uploadFiles(files: File[]): void {
  const fileNames: string[] = files.map(file => file.name);
  const fileTypes: string[] = files.map(file => file.type);
  this.documentType = fileTypes; 
  this.namesVariable = fileNames;
  const formData = new FormData();
  this.uploadedFiles.forEach((file, index) => {
 
  const metadata = {
    labelName: file.label || '',
    documentName: this.namesVariable || '',
    documentType: this.documentType || '',
    createdBy: file.createdBy || ''
    };
    formData.append(`fileDetails[${index}].labelName`, metadata.labelName);
    formData.append(`fileDetails[${index}].documentName`, metadata.documentName);
    formData.append(`fileDetails[${index}].documentType`, metadata.documentType);
    formData.append(`fileDetails[${index}].createdBy`, metadata.createdBy);
    formData.append(`fileDetails[${index}].file`, file.file, file.name);
    });      
    this.claimsService.uploadFiles(formData).subscribe((response:any) => {
    //const uploadedFile = this.uploadedFiles.find(f => f.file.name === file.name);
    if (response.success) {
      this.uploadedFiles.map(file => file.status = 'success')
      this.uploadSuccess = true;
      this.uploadedFilesCount++;
      }
      this.updateStatusLabel();
      this.cdr.markForCheck();
      }, (_error: any) => {
      this.uploadedFile = this.uploadedFiles.find(f => f.file.name === f.file.name);
      this.uploadedFiles.map(file => file.status = 'failed')
      this.uploadSuccess = false;
      this.failedFilesCount++;
      this.updateStatusLabel();
      this.cdr.markForCheck(); 
      });
  }
       
  updateStatusLabel(): void {
    // this.uploadStatus = `${this.uploadedFilesCount} of ${this.totalFilesCount} files uploaded`;
    this.uploadStatus = `${this.uploadedFilesCount} of ${this.totalFilesCount} files uploaded`;
   }

  deleteFile(fileToDelete: any) {
    this.uploadedFiles = this.uploadedFiles.filter(file => file !== fileToDelete);
    this.totalFilesCount = this.uploadedFiles.length;
    this.updateStatusLabel();
  }     
  //******* file upload input label *********//     
  startEditing(file: any) {  
    file.isEditing = true;
    if (!file.editableControl) {
    file.editableControl = new FormControl(file.label);
    }
  }
          
  stopEditing(file:any) {   
    if (this.editableControl.value !== this.label) {
    file.label = this.editableControl.value; // Update the label with the edited value
    }
    file.isEditing = false;
    file.isEdited = true;
  }

  fetchClaimHistory(policyNumber:string){    
    const policyNo = policyNumber;
    let claimHistoryReqBody = {
      "policyNumber" : policyNo
    }
 
    this.claimsService.getClaimsHistory(claimHistoryReqBody,policyNo).subscribe(
      (response:any)=>{   
      this.claimsHistory = response.data;
      console.log('resp', this.claimsHistory);
      
    })
  }

  navigateToListClaim(){
    this.router.navigate(['claims/claimsList'])

  }

  submitClaim(){
    const claimDetailsReqBody = {
      AgentCode: localStorage.getItem('agentCode'),
      DERefereceClaimNumber: this.claimId, 
      claimSubmittedBy: '' 
    };
  // this.claimsService.submitClaim(claimDetailsReqBody).subscribe(
  //   (response: any) => {
  //     if (response.success) {
  //       console.log('Claim submitted successfully:', response);
  //     }
  //   },
  //   (error: any) => {
  //     console.error('Error submitting claim:', error);
  //   }
  // );
  }
    
}