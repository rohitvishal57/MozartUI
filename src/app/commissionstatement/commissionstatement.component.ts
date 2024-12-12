import { Component } from '@angular/core';
import { CommissionstatementService } from './commissionstatement.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { error } from 'jquery';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-commissionstatement',
  templateUrl: './commissionstatement.component.html',
  styleUrls: ['./commissionstatement.component.scss']
})
export class CommissionstatementComponent {

  years: any;
  months: any = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  cycles: any = [
    {
      "name": "Cycle: 1st (1st to 15th of the month)",
      "value": "MID"
    },
    {
      "name": "Cycle: 2nd (16th to End of the month)",
      "value": "END"
    }
  ];
  commissionForm!: FormGroup;
  agentCode: any;

  constructor(private formBuilder: FormBuilder, private commissionstatementService: CommissionstatementService,private toast: NgToastService) { }

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
    let requestbody: any = this.commissionForm.getRawValue();
    requestbody.agentCode = this.agentCode;
    requestbody.type = 'CommissionStatement';
    this.commissionstatementService.fetchCommissionStatement(requestbody).subscribe(
      (respose) => {
        if (respose.isSuccess) {
          let commissionDetails = respose?.data?.searchResponse[0];
          if(commissionDetails.fileName && commissionDetails.omniDocIndex){
            this.downloadStatement(commissionDetails.omniDocIndex, commissionDetails.fileName);
          }else{
            this.toast.warning({ detail: "", summary: 'There are no commission statements to download.', duration: 2000 }); 
          }
        }else{
          this.toast.warning({ detail: "", summary: 'Failed to fetch commission statement.', duration: 2000 });
        }
      },
      (error) => {
        console.log('Failed to fetch commission statement', error);
        this.toast.error({ detail: "", summary: 'Failed to fetch commission statement.', duration: 2000 });
      });
  }

  downloadStatement(omniDocImageIndex: string, fileName: string) {
    let requestBody: any = {};
    requestBody.agentCode =  this.agentCode;
    requestBody.downloadRequest = [{
      omniDocImageIndex: omniDocImageIndex,
      fileName: fileName
    }];

    this.commissionstatementService.downloadCommissionStatement(requestBody).subscribe(
      (response) => {
        try{
          if (response.isSuccess) {
            const blob = this.base64ToBlob(response?.data?.downloadResponse[0]?.byteArray, 'application/pdf');
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            this.toast.success({ detail: "", summary: 'Commission Statement Downloaded Successfully.', duration: 2000 }); 
          }else{
            this.toast.warning({ detail: "", summary: 'Failed to download commission statement.', duration: 2000 });
          }
        }catch(error){
          console.log('errror download pdf',error);
        }
      }, (error) => {
        console.log('Failed to download commission statement', error);
        this.toast.error({ detail: "", summary: 'Failed to download commission statement.', duration: 2000 });
      });

  }

  base64ToBlob(base64: string, type: string): Blob {
    const binary = atob(base64);
    const length = binary.length;
    const arrayBuffer = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
      arrayBuffer[i] = binary.charCodeAt(i);
    }
    return new Blob([arrayBuffer], { type });
  }
}
