import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';
import { AdminService } from '../../admin.service';
import { LanguageService } from 'src/app/services/language.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bulk-upload',
  templateUrl: './bulk-upload.component.html',
  styleUrls: ['./bulk-upload.component.scss']
})
export class BulkUploadComponent {
  bulkUploadForm!: FormGroup
  submitted: boolean = false;
  campListData: any[] = [];
  showNote: boolean = false;
  isFilenotSelected: boolean | any;
  selctedFileName: string = '';
  fileExt: string = '';
  fileSize: string = '';
  selectedFile: any;
  AgentCode: string = '';
  uploadedFiles: boolean = false;
  fileList: any[] = [];
  isContinueButtonDisabled: boolean = true;

  constructor(private formBuilder: FormBuilder, private toast: NgToastService, private adminService: AdminService, private languageService: LanguageService,
    private translateService: TranslateService, private router: Router) {

  }
  ngOnInit() {
    this.languageService.language$.subscribe(lang => {
      this.translateService.use(lang).subscribe({
        error: () => {
          this.translateService.use('en');
        }
      });
    });

    const storedAgentCode = localStorage.getItem('agentCode');
    if (storedAgentCode) {
      this.AgentCode = storedAgentCode;
    }
    this.bulkUploadForm = this.formBuilder.group({
      selectedcampId: ['']
    })
  }


  newfile(e: any) {
    this.showNote = false;
    this.uploadedFiles = true;
    this.isFilenotSelected = false;
    let files: any[];
    if (e) {
      files = e.target.files;
      for (let i = 0; i < files.length; i++) {
        const isDuplicateFile: boolean = this.fileList.some((item: any) => item.file.name === files[i].name);
        if (isDuplicateFile) {
          this.toast.warning({ detail: "", summary: 'File is already uploaded.Please upload another file.', duration: 5000 });
          return;
        }
        this.selectedFile = files[i];
        if (!this.selectedFile) {
          return;
        }
        this.fileExt = this.selectedFile.name.replace(/^.*\./, '');
        if (this.fileExt == 'xlsx' || this.fileExt == 'csv' || this.fileExt === 'xls') {
          this.selctedFileName = this.selectedFile.name;
          this.fileSize = this.selectedFile.size;
          const fileWithFileExt = {
            file: files[i],
            fileExt: this.fileExt
          };
          this.fileList.push(fileWithFileExt);
          this.isContinueButtonDisabled = false;
          console.log('fileList', this.fileList);
        } else {
          this.showNote = true;
        }
      }
      e.target.value = '';
    }
  }

  deleteFile() {
    // this.namesVariable = "";
    // this.documentType = "";
    // this.showDocInfo = false;
  }
  campSelected(campid: any) {

  }
  continueFileUpload() {
    this.submitted = true;

    if (!this.selectedFile) {
      this.isFilenotSelected = true;
      return;
    }
    let file = this.selectedFile;
    let fileExt = file.name.replace(/^.*\./, '');
    const data = new FormData();

    console.log(this.campListData, this.bulkUploadForm.get('selectedcampId')?.value, 'this.selectedcampId')

    if (fileExt == 'xlsx' || fileExt == 'csv' || fileExt === 'xls') {
      if (fileExt == 'xlsx' || fileExt == 'csv' || fileExt === 'xls') {

        for (let i = 0; i < this.fileList.length; i++) {
          data.append('FormFile', this.fileList[i].file)
        }
        data.append('UploadedBy', 'teleadmin1')
        data.append('IsBaseCallerUpload', 'false')
        data.append('IsAVUpload', 'true')
        data.append('IsDoUpload', 'false')

      }

      this.adminService.UploadBulk(data).subscribe(
        (response: any) => {
          console.log(response.data);
          if (response.data) {
            if (response.isSuccess) {
              window.open(response.data.url, '_blank');
              this.toast.success({ detail: "", summary: response.data.status, duration: 5000 });
            } else {
              this.toast.error({ detail: "", summary: response.message, duration: 5000 });
            }
          }
          else { console.error("API request was not successful."); }
        },
        (error: any) => {
          console.error("Error from getRenewalsList API:", error);
        }
      );
    }
    this.fileList = [];
    this.selctedFileName = '';
  }
  downloadurl() {

  }
  private saveBlobAsFile(blob: Blob, fileName: string): void {
    // saveAs(blob, fileName);
  }
  onSubmit() {

  }

  backToAvList() {
    this.router.navigate(['rug/av-list'], {
    });
  }

  removeFile(fileInfo: any) {
    this.fileList = this.fileList.filter((item: any) => {
      return item.file.name !== fileInfo.file.name
    });

    if (this.selctedFileName == fileInfo.file.name) {
      this.selctedFileName = '';
    }
  }
}
