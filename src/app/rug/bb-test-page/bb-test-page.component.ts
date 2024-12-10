import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgToastService } from 'ng-angular-popup';
@Component({
  selector: 'app-bb-test-page',
  templateUrl: './bb-test-page.component.html',
  styleUrls: ['./bb-test-page.component.scss']
})
export class BbTestPageComponent implements OnInit{
  encryptedString : string  = '';

  constructor(private http: HttpClient, private toast: NgToastService,) {

  }
  ngOnInit(): void {
    
  }


  postData() {
    // const data = { Request: this.encryptedString.trim() }; 
    // console.log(data);
    const data = new FormData();
    data.append('Request', this.encryptedString.trim())
    
    this.http.post<any>('https://usp.monocept.ai/api/v1/RedirectAxisBranchBankingRequest', data)
      .subscribe(response => {
        console.log(response);
        response = JSON.parse(response.data)
        console.log(response);
        if(response.isSuccess == true && response.statusCode == 200){
        //  window.location.href = response.message;
        }
        if(response.isSuccess == false && response.statusCode == 500){
          this.toast.warning({ detail: "SUCCESS", summary: response.message, duration: 3000 });
        }
      }, error => {
        // Handle errors here
        console.log(error);
        if(error.status == 400){
          // this.toastr.warning(error.error.errorMessages.join(', '),'',
          // { timeOut: 5000 }
          // );
        }
      });
  }
}
