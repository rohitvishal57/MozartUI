import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LeadsService } from '../leads.service';
@Component({
  selector: 'app-upload-lead',
  templateUrl: './upload-lead.component.html',
  styleUrls: ['./upload-lead.component.scss']
})
export class UploadLeadComponent implements OnInit{
  bulkUploadForm!: FormGroup
  submitted: boolean = false;
  campListData: any[] = [];
  showNote: boolean = false;
  isFilenotSelected: boolean | any;
  selctedFileName: string = '';
  selectedFile: any;
  AgentCode: string = '';
  constructor( private formBuilder: FormBuilder, private leadsService: LeadsService){

  }
  ngOnInit(){
    const storedAgentCode = localStorage.getItem('agentCode');
    if (storedAgentCode) {
      this.AgentCode = storedAgentCode;
    }
    this.bulkUploadForm = this.formBuilder.group({
      selectedcampId:['']
    })
    this.getActiveCampaignList();
  }
  getActiveCampaignList(){
    let obj ={
      "Agent":this.AgentCode
    }
    this.leadsService.getActiveCampaignDetails(obj).subscribe(
      (response) => { 
        console.log(response.data);
        if (response.success) {
          this.campListData=response.campaignlist ;
          // this.campListData.forEach(campaign=>{
          //   if(campaign.name.includes('Self'+ usr.agentCode)){
          //     this.selectedcampId= campaign.id;
          //     campaign.name='Self'+'-'+ campaign.name.substring(4);
          //   }
          // });
        } 
        else {console.error("API request was not successful.");}
      },
      (error) => {
        console.error("Error from getRenewalsList API:", error);
      }
    );
  }
  newfile(e: any) {
    let files;
    let file;
    let fileExt;
    this.isFilenotSelected = false;
    if (e) {
      files = e.target.files;
      file = files[0];
      if (!file) {
        return;
      }
      this.selectedFile = file;
      console.log(this.selectedFile);
      this.selctedFileName = this.selectedFile.name;
      fileExt = this.selectedFile.name.replace(/^.*\./, '');
      e.target.value = '';
    }

    if (fileExt == 'xlsx' || fileExt == 'csv' ||fileExt==='xls') {
    } else {
      this.showNote = true;
    }
  }
  deleteFile() {
    // this.namesVariable = "";
    // this.documentType = "";
    // this.showDocInfo = false;
  }
  campSelected(campid: any) {
      // this.selectedcampId = campid;
      // this.invalidCamp = false;
    }
    continueFileUpload() {
      this.submitted = true;
      if (this.bulkUploadForm.get('selectedcampId')?.value == '') {
        this.submitted = false;
        return;
      }
      if (!this.selectedFile) {
        this.isFilenotSelected = true;
        return;
      }
      let file = this.selectedFile;
      let fileExt = file.name.replace(/^.*\./, '');
      const data = new FormData();
      
      const campnumb= this.campListData.find(obj=>{
        return obj.id === this.bulkUploadForm.get('selectedcampId')?.value
      });
      console.log(this.campListData,this.bulkUploadForm.get('selectedcampId')?.value,'this.selectedcampId')
      // let endDate = campnumb?.enddate;
      // if(endDate!=null && new Date(endDate)<new Date()){      
      //   this.mps.openDialog("The Selected Campaign is InActive!");
      //   return;
      // }
  
      if (fileExt == 'xlsx' || fileExt == 'csv'||fileExt==='xls') {
       if (fileExt == 'xlsx' || fileExt == 'csv'|| fileExt==='xls') {
          data.append('FormFile', file)
          data.append('CampaignNumber', campnumb?.campaignNo)
          data.append('CampaignName', campnumb?.name)
          data.append('AgentCode', this.AgentCode)
  
          // if (this.selectedExistingGroup) {
          //   data.append('GroupId', this.existingGroupId)
          // }
        }
        // this.existingdata.emit(this.selectedExistingGroup);
        // this.percentDone = 0;
        // this.subscription = this.dataService.uploadfile(data)
        //   .pipe().subscribe({
        //     next: (Respevent: any) => {
        //       let event: any = Respevent;
        //       if(event.id>0){
        //         this.showerrorpopup=false;
        //         this.Insertedcount = event.insertedcount; 
        //         this.uploadLeadsPopup.show();       
        //       }else{
        //         this.showerrorpopup=true;
        //         this.uploadLeadsPopup.show(); 
        //       }
        //       if(event.url){
        //         this.showDownload=true;
        //          this.url= event.url;
        //         this.downloadurl();
        //       }
        //     },
        //     error: (error: any) => {
        //       console.error(error)
        //     }
        //   })
      } 
    }
    downloadurl(){
      // window.open(this.url, '_blank');


      // let req ={
      //   "url":this.url
      // }
      // this.dataService.DownloadFileWithUrl(req).subscribe({
      //   next: (resp) => {
          
      //     if (resp instanceof Blob) {
      //       this.saveBlobAsFile(resp, 'UploadedLeads.xlsx');
      //     } else {
      //       let ll ="Some Error occured while downloading the file";
      //       return;
      //   }
      //   },
      //   error: (error) => {
      //     console.error(error)
      //     let ll ="Some Error occured while downloading the file";
      //     return;
      //   }
      // })
    }
    private saveBlobAsFile(blob: Blob, fileName: string): void {
      // saveAs(blob, fileName);
    }
  onSubmit(){

  }
}
