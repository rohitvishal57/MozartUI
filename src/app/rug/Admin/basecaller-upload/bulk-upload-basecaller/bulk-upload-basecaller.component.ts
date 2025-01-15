import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AdminService } from '../../admin.service';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-bulk-upload-basecaller',
  templateUrl: './bulk-upload-basecaller.component.html',
  styleUrls: ['./bulk-upload-basecaller.component.scss']
})
export class BulkUploadBasecallerComponent {
  bulkUploadForm!: FormGroup;
  submitted: boolean = false;
  showNote: boolean = false;
  isFilenotSelected: boolean = false;
  selctedFileName: string = '';
  fileExt: string = '';
  fileList: any[] = [];
  isContinueButtonDisabled: boolean = true;
  selectedFile: File | null = null;
  filedata: any;

  constructor(private formBuilder: FormBuilder,
    private toast: NgToastService,
    private adminService: AdminService,
    private router: Router) { }

  ngOnInit() {
    this.bulkUploadForm = this.formBuilder.group({
      selectedcampId: ['']
    });
  }

  // File change event handler
  onFileChange(event: any) {
    this.showNote = false;
    this.isFilenotSelected = false;
    const file = event.target.files[0];
    this.filedata = file
    const files: FileList = event.target.files;
    console.log('files', event.target.files)



    if (files && files.length > 0) {
      const file = files[0];
      const fileExt = file.name.split('.').pop()!.toLowerCase();
      const allowedExtensions = ['xlsx', 'xls', 'csv'];
      if (allowedExtensions.includes(fileExt)) {
        this.selctedFileName = file.name;
        this.fileExt = fileExt;
        this.selectedFile = file;
        this.fileList.push({ file, fileExt });
        this.isContinueButtonDisabled = false;
      } else {
        this.showNote = true;
      }
    }
  }

  // Remove file from list
  removeFile(fileInfo: any) {
    this.fileList = this.fileList.filter(item => item.file.name !== fileInfo.file.name);
    if (this.selctedFileName === fileInfo.file.name) {
      this.selctedFileName = '';
      this.selectedFile = null;
      this.isContinueButtonDisabled = true;
    }
  }

  // Submit handler for file upload
  continueFileUpload() {
    this.submitted = true;

    if (!this.selectedFile) {
      this.isFilenotSelected = true;
      this.toast.error({
        detail: "Error",
        summary: "No file selected. Please select a file to upload.",
        duration: 5000,
      });
      return;
    }

    const data = new FormData();
    data.append('File', this.filedata);
    data.append('UploadedBy', 'teleadmin2');
    data.append('IsDoUpload', 'false');
    data.append('IsAVUpload', 'false');
    data.append('IsBaseCallerUpload', 'true');

    this.adminService.UploadBulk(data).subscribe(
      (response: any) => {
        const res = JSON.parse(response.data);
        if (res.statusCode === 200) {
          this.toast.success({
            detail: "Success",
            summary: "File uploaded successfully!",
            duration: 3000,
          });

          // Reset the file list after successful upload
          this.fileList = [];
          this.selctedFileName = '';
        } else {
          this.toast.error({
            detail: "Error",
            summary: "Unexpected response format. Please try again.",
            duration: 5000,
          });
          this.fileList = [];
          this.selctedFileName = '';
        }
      }
    );
  }

  backToAvList() {
    this.router.navigate(['/rug/basecaller'], {
    });
  }


  // Submit form method
  onSubmit() {
    this.continueFileUpload();
  }
}
