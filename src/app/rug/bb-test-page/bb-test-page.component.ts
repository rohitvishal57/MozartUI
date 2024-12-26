import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgToastService } from 'ng-angular-popup';
import { ConfigService } from 'src/app/services/config.service';
@Component({
  selector: 'app-bb-test-page',
  templateUrl: './bb-test-page.component.html',
  styleUrls: ['./bb-test-page.component.scss']
})
export class BbTestPageComponent implements OnInit{
  encryptedString : string  = '';

  constructor(private http: HttpClient, private toast: NgToastService,private configService: ConfigService) {

  }
  ngOnInit(): void {
    
  }


  postData() {
    // const data = { Request: this.encryptedString.trim() }; 
    // console.log(data);
    const data = new FormData();
    data.append('Request', this.encryptedString.trim())
    
    this.http.post<any>(this.configService.config.baseUrl + this.configService.config.bbAxisRedirection, data)
      .subscribe(response => {
        console.log(response);
        response = JSON.parse(response.data)
        console.log(response);
        if(response.isSuccess == true && response.statusCode == 200){
         window.location.href = response.message;
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

  postd2CResirection(){
    const data = new FormData();
    data.append('data', this.encryptedString.trim())
    this.http.post<any>('https://usp.monocept.ai/api/v1/', data)
      .subscribe(response => {
        console.log(response);
        response = JSON.parse(response.data)
        console.log(response);
        if(response.isSuccess == true && response.statusCode == 200){
         window.location.href = response.message;
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

  postD2cData(){
    // const data = { Request: this.encryptedString.trim() }; 
    // console.log(data);
    const data = new FormData();
    data.append('data', this.encryptedString.trim())
    
    this.http.post<any>('https://usp.monocept.ai/api/v1/', data)
      .subscribe(response => {
        console.log(response);
        response = JSON.parse(response.data)
        console.log(response);
        if(response.isSuccess == true && response.statusCode == 200){
          this.http.post<any>('https://upuat.adityabirlahealth.com/api/v1/', data)
      .subscribe(response => {
        console.log(response);
        response = JSON.parse(response.data)
        console.log(response);
        if(response.isSuccess == true && response.statusCode == 200){
         window.location.href = response.message;
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
