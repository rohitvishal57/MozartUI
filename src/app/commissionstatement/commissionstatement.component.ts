import { Component } from '@angular/core';
import { CommissionstatementService } from './commissionstatement.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { error } from 'jquery';

@Component({
  selector: 'app-commissionstatement',
  templateUrl: './commissionstatement.component.html',
  styleUrls: ['./commissionstatement.component.scss']
})
export class CommissionstatementComponent {

  years: any;
  months: any = ['January', 'February', 'March', 'April', 'May', 'June','July', 'August', 'September', 'October', 'November', 'December'];
  cycles: any = ['Cycle: 1st (1st to 15th of the month)', 'Cycle: 2nd (16th to End of the month)'];
  commissionForm!: FormGroup;
  agentCode : any;

  constructor(private formBuilder: FormBuilder,private  commissionstatementService:CommissionstatementService) { }

  ngOnInit() {
    const currentYear = new Date().getFullYear();
    this.years = [currentYear, currentYear - 1]
    this.agentCode = localStorage.getItem('agentCode');


   this.inItForm();
  }

  
  inItForm() {
    this.commissionForm = this.formBuilder.group({
      year: [''],
      month: [''],
      cycle: ['']
  });
  }


  fetchCommissionStatement() {
     let requestbody : any =this.commissionForm.getRawValue();
     requestbody.agentCode ='ABH1101695'; sessionStorage.getItem('')
     requestbody.eventName ='Search policy kit document request from commissions';
     requestbody.searchOperator = 'AND';
     requestbody.cycle = 'END';
     this.commissionstatementService.fetchCommissionStatement(requestbody).subscribe(
     (respose)=>{
      if(respose.isSuccess){
      let commissionDetails = respose?.data?.searchResponse[0];
      if(commissionDetails){
        this.downloadStatement()
      }
      }
      console.log('fetch commission statement',respose);
     },
     (error)=>{
     console.log('Failed to fetch commission statement',error);
     });
  }


  downloadStatement(omniDocImageIndex : string , fileName : string){

    // let requestBody : any = {};
    // requestBody.agentCode = this.agentCode;
    // requestBody.omniDocImageIndex = omniDocImageIndex;
    // requestBody.fileName = fileName;

    let requestBody : any = {
      "referenceId": this.agentCode,
      "eventName": "",
      "identifier": "bytearray",
      "sourceSystemName": "DistributionPortal",
      "downloadRequest": [
        {
          "globalId": "",
          "omniDocImageIndex": "63880187",
          "fileName": "ABH1101695_31-07-2024.pdf"
        }
      ]
    };
    this.commissionstatementService.downloadCommissionStatement(requestBody).subscribe(
      (response) => {

        console.log('download commission statement',response);

      }, (error) => {
        console.log('Failed to download commission statement',error);

      });

  }
}
