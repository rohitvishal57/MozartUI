import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';
import { PerformanceService } from '../performance.service';

@Component({
  selector: 'app-upload-performace',
  templateUrl: './upload-performace.component.html',
  styleUrls: ['./upload-performace.component.scss']
})
export class UploadPerformaceComponent implements OnInit{
  showNote: boolean = false;
  isFilenotSelected: boolean = false;
  selctedFileName: any;
  selectedFile: any;
  AgentCode: any;
  performanceUploadForm!: FormGroup;
  submitted: boolean = false;
  isPerformance: any;
  isDetailedView: any;
  constructor( private formBuilder: FormBuilder, private toast: NgToastService, private performanceService: PerformanceService,){

  }
  ngOnInit(){
    const storedAgentCode = localStorage.getItem('agentCode');
    if (storedAgentCode) {
      this.AgentCode = storedAgentCode;
    }
    this.performanceUploadForm = this.formBuilder.group({
      selectedView:['performance']
    })
    // this.getActiveCampaignList();
  }
  continueFileUpload() {
    console.log(this.selectedFile);
    if(this.selectedFile == undefined){
      this.isFilenotSelected = true;
    }
    let file = this.selectedFile;
    let fileExt = file.name.replace(/^.*\./, '');
    const data = new FormData();
    console.log(this.performanceUploadForm.get('selectedView')?.value);
    if(this.performanceUploadForm.get('selectedView')?.value == "performance"){
      this.isPerformance = true
      this.isDetailedView = false
    }else{
      this.isDetailedView = true
      this.isPerformance = false
    }
    if (fileExt == 'xlsx' || fileExt == 'csv'||fileExt==='xls') {
      if (fileExt == 'xlsx' || fileExt == 'csv'|| fileExt==='xls') {
         data.append('FormFile', file)
         data.append('Performace', this.isPerformance)
         data.append('DetailedView', this.isDetailedView)
         data.append('AgentCode', this.AgentCode)
         data.append('uploadrange', `${file.size}`);
       }
        this.performanceService.uploadPerformancefile(data).subscribe(
          (response: any) => { 
            console.log(response);
            if (response?.isSuccess) {
              console.log(response);
              this.toast.success({
                detail: 'Success',
                summary: response.data.fileUploadMessage,
              });
            }
            else {
              this.toast.error({ detail: "Error", summary:response?.message, duration: 5000 });
              console.error("API request was not successful.");
            }
          },
          (error: any) => {
            console.error("Error from getRenewalsList API:", error);
          }
        );
     }
  }
  newfile(event: any){
    let files;
    let file;
    let fileExt;
    this.isFilenotSelected = false;
    if (event) {
      files = event.target.files;
      file = files[0];
      if (!file) {
        return;
      }
      this.selectedFile = file;
      this.selctedFileName = this.selectedFile.name;
      fileExt = this.selectedFile.name.replace(/^.*\./, '');
      event.target.value = '';
    }

    if (fileExt == 'xlsx' || fileExt == 'csv' ||fileExt==='xls') {
    } else {
      this.showNote = true;
    }
  }
  viewSelected(event: any){
    this.selectedFile = undefined;
    this.selctedFileName = "";
    console.log(event.target.value);
  }
  onSubmit(){
    console.log(this.performanceUploadForm.value);
  }
  downloadFile(fileName: string): void {
    const link = document.createElement('a');
    link.href = `assets/performance-assets/${fileName}`;
    link.download = fileName;
    link.click();
  }
}
