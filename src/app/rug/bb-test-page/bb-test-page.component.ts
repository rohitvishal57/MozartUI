import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bb-test-page',
  templateUrl: './bb-test-page.component.html',
  styleUrls: ['./bb-test-page.component.scss']
})
export class BbTestPageComponent implements OnInit{
  encryptedString : string  = '';

  constructor(private http: HttpClient) {

  }
  ngOnInit(): void {
    
  }


  postData() {
    const data = { Request: this.encryptedString.trim() }; 
    console.log(data);

    
    this.http.post<any>('https://usp.monocept.ai/api/v1/RedirectAxisBranchBankingRequest', data)
      .subscribe(response => {
        console.log(response);
        if(response.response){
          // this.router.navigateByUrl('/landingPage/'+ encodeURIComponent(response.response));
          
          // this.router.navigateByUrl('/landingPage/'+ response.response);
        }
        if(response.isSuccess == false && response.statusCode == 500){
          // this.toast.warning({ detail: "SUCCESS", summary: responseData.message, duration: 3000 });

          // this.toastr.warning(response.errorMessages.join(', '),'',
          // { timeOut: 5000 }
          // );
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
