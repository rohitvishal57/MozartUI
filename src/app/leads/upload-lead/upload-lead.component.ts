import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LeadsService } from '../leads.service';
import { NgToastService } from 'ng-angular-popup';
import { Router } from '@angular/router';

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
  fileExt : string = '';
  fileSize : string ='';
  selectedFile: any;
  AgentCode: string = '';
  uploadedFiles : boolean = false;
  fileList : any[] =[];

  constructor( private formBuilder: FormBuilder, private toast: NgToastService, private leadsService: LeadsService,    private router: Router  ){

  }
  ngOnInit(){
    const storedAgentCode = localStorage.getItem('agentCode');
    if (storedAgentCode) {
      this.AgentCode = storedAgentCode;
    }
    this.bulkUploadForm = this.formBuilder.group({
      selectedcampId:['']
    })
    // this.getActiveCampaignList();
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
            fileExt : this.fileExt           
          };
          this.fileList.push(fileWithFileExt);
          console.log('fileList',this.fileList);
        }else{
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
      // this.selectedcampId = campid;
      // this.invalidCamp = false;
    }
    continueFileUpload() {
      this.submitted = true;
      // if (this.bulkUploadForm.get('selectedcampId')?.value == '') {
      //   this.submitted = false;
      //   return;
      // }

      if (!this.selectedFile) {
        this.isFilenotSelected = true;
        return;
      }
      let file = this.selectedFile;
      let fileExt = file.name.replace(/^.*\./, '');
      const data = new FormData();
      
      // const campnumb= this.campListData.find(obj=>{
      //   return obj.id === this.bulkUploadForm.get('selectedcampId')?.value
      // });
      console.log(this.campListData,this.bulkUploadForm.get('selectedcampId')?.value,'this.selectedcampId')
      // let endDate = campnumb?.enddate;
      // if(endDate!=null && new Date(endDate)<new Date()){      
      //   this.mps.openDialog("The Selected Campaign is InActive!");
      //   return;
      // }
  
      if (fileExt == 'xlsx' || fileExt == 'csv'||fileExt==='xls') {
       if (fileExt == 'xlsx' || fileExt == 'csv'|| fileExt==='xls') {

        for(let i=0;i<this.fileList.length;i++){
          data.append('FormFile', this.fileList[i].file)
        }
          // data.append('CampaignNumber', campnumb?.campaignNo)
          // data.append('CampaignName', campnumb?.name)
          data.append('CampaignNumber', "6536575")
          data.append('CampaignName', "casdasda")
          data.append('AgentCode', this.AgentCode)
          data.append('requestid',"8757458")
          // if (this.selectedExistingGroup) {
          //   data.append('GroupId', this.existingGroupId)
          // }
        }
        // this.existingdata.emit(this.selectedExistingGroup);
        // this.percentDone = 0;

        this.leadsService.uploadfile(data).subscribe(
          (response: any) => { 
            console.log(response.data);
            if (response.data) {
              if(response.isSuccess){              
                window.open(response.data.url, '_blank');
                this.toast.success({ detail: "", summary:response.data.status, duration: 5000 });
              }else{
                this.toast.error({ detail: "", summary:response.message, duration: 5000 });
              }
            } 
            else {console.error("API request was not successful.");}
          },
          (error: any) => {
            console.error("Error from getRenewalsList API:", error);
          }
        );
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
      this.fileList = [];
      this.selctedFileName ='';
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

  backToleads(){
    this.router.navigate(['/leads/leadsList'], {
  });
  }
  

  removeFile(fileInfo: any) {
    this.fileList = this.fileList.filter((item: any) => {
      return item.file.name !== fileInfo.file.name
    });

    if(this.selctedFileName == fileInfo.file.name){
      this.selctedFileName='';
    }
  }
}
