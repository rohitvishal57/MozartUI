import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-upload-performace',
  templateUrl: './upload-performace.component.html',
  styleUrls: ['./upload-performace.component.scss']
})
export class UploadPerformaceComponent implements OnInit{
  showNote: boolean = false;
  isFilenotSelected: boolean = false;
  selctedFileName: any;
  AgentCode: any;
  performanceUploadForm!: FormGroup;
  submitted: boolean = false;
  constructor( private formBuilder: FormBuilder, private toast: NgToastService){

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
  }
  newfile(event: any){

  }
  viewSelected(event: any){
    console.log(event.target.value);
  }
  onSubmit(){
    console.log(this.performanceUploadForm.value);
  }
}
