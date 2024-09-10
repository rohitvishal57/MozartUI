import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonService } from 'src/app/services/common.service';
import { ClaimData } from 'src/app/interface/claims.interface';
@Component({
  selector: 'app-claims-view',
  templateUrl: './claims-view.component.html',
  styleUrls: ['./claims-view.component.scss']
})

export class ClaimsViewComponent {
  uploadedFiles: File[] = [];
  form!: FormGroup;
  policyNumbers: { name: string, code: string }[] = [];
  productNames: string[] = [];
  memberRelations: string[] = [];
  requestTypes: string[] = [];
  
  
  constructor(private fb: FormBuilder, private commonService: CommonService){}
 
  ngOnInit(): void {
    this.createForm();
    this.fetchData();
   
  }
  createForm(): void {
    this.form = this.fb.group({
      policyNumber: [''],
      productName: [''],
      memberRelation: [''],
      requestType: ['']
    });
  }
 
  payload = {
    "sellerId": 5100003,
    "policyNumber": "",
    "productName": "",
    "memberName" : "",
    "sortColumn": "RaisedDate",
    "searchType": "string",
    "sortdirection": "DESC",
    "status": "All",
    "searchString": "string",
    "pageNumber": 1,
    "pageSize": 10
  }
  
  fetchData(): void {
    this.commonService.getClaimsList(this.payload).subscribe(
      response => {
        if (response.success) {
          const allData: ClaimData[] = response.data;

          // Extract unique values for dropdowns
          this.policyNumbers = [...new Set(allData.map((item:any) => item.policyNumber).filter((val:string) => val))];
          this.productNames = [...new Set(allData.map((item:any) => item.productName).filter(val => val))];
          this.memberRelations = [...new Set(allData.map((item:any) => item.memberRelation).filter(val => val))];
          this.requestTypes = [...new Set(allData.map((item:any) => item.requestType).filter(val => val))];
          console.log('vsyu',this.policyNumbers);
        }
         
        else {
          console.error('Failed to fetch dropdown data', response.message);
        }
      },
      error => console.error('Error fetching dropdown data', error)
    );
}
  
 
 
 
  onFileSelected(event: any): void {
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
      this.uploadedFiles.push(files[i]);
    }
    this.uploadFiles(this.uploadedFiles);
  }

  uploadFiles(files: File[]): void {
    // Implement file upload logic here
    // For example, you can send the files to your server using HttpClient
    console.log('Uploading files:', files);
  }

  deleteFile(): void {
 
  }
}
