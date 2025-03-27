import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgToastService } from 'ng-angular-popup';
import { catchError, of, switchMap } from 'rxjs';
import { ConfigService } from 'src/app/services/config.service';
import { PolicyCheckComponent } from '../policy-check/policy-check.component';
@Component({
  selector: 'app-bb-test-page',
  templateUrl: './bb-test-page.component.html',
  styleUrls: ['./bb-test-page.component.scss']
})
export class BbTestPageComponent implements OnInit{
  encryptedString : string  = '';
  property1: any;
  constructor(private http: HttpClient, private toast: NgToastService,private configService: ConfigService, private dialog: MatDialog) {

  }
  ngOnInit(): void {
    
  }


  // postData() {
  //   const data = new FormData();
  //   data.append('Request', this.encryptedString.trim())
    
  //   this.http.post<any>(this.configService.config.baseUrl + this.configService.config.bbAxisRedirection, data)
  //     .subscribe(response => {
  //       console.log(response);
  //       response = JSON.parse(response.data)
  //       console.log(response);
  //       if(response.isSuccess == true && response.statusCode == 200){
  //        window.location.href = response.message;
  //       }
  //       else if(response.isSuccess == false && response.statusCode == 500){
  //         this.toast.warning({ detail: "Warning", summary: response.message, duration: 3000 });
  //       }
  //       else if(response.isSuccess == false && response.statusCode == 400){
  //         this.toast.warning({ detail: "Warning", summary: response.message, duration: 3000 });
  //       }
  //       else{
  //         this.toast.warning({ detail: "Warning", summary: response.message, duration: 3000 });
  //       }
  //     }, error => {
  //       // Handle errors here
  //       console.log(error);
  //       if(error.status == 400){
  //       }
  //     });
  // }
  postData() {
    // console.log(this.encryptedString);
    // const data = { data: this.encryptedString, hash: 'asf', IsCreateNew: true };
    // console.log(this.property1);
    // if( Utility.IsNullOrEmpty(this.property1)){
    //   this.property1 = this.encryptedString
    // }
    const data = new FormData();
    data.append('Request', this.encryptedString.trim())
    this.property1 = this.encryptedString;
    console.log(data);
    const formdata = new FormData();
    formdata.append('data', this.property1)
    formdata.append('portal', 'BB')
    this.http.post<any>(this.configService.config.baseUrl  + this.configService.config.checkLeadExist, formdata)
    // this.http.post<any>(apiUrl.BASE_URL + apiUrl.AXIS_CHECK_LEAD_EXIST, data)
      .pipe(
        switchMap((response: any) => {
          console.log(response);
  
          if (response) {
            let res = JSON.parse(response.data);
            response = JSON.parse(response.data).data;

            if (res.isSuccess === false && res.statusCode === 500) {
              this.toast.warning({ detail: "Warning", summary: response.errorMessage, duration: 3000 });
              return of(null); // Stop further processing if there's an error
            }
            if (res.isSuccess === true && res.statusCode === 200) {
              // Prepare data for the second API call
              if (response.isLeadExisting === true && response.isLeadSubmmitted === false) {
                const dialogRef = this.dialog.open(PolicyCheckComponent, {
                  data: { displayData: "Proposal Already Exists !!",
                          isLeadExisting: response.isLeadExisting,
                          isLeadSubmmitted: response.isLeadSubmmitted
                        }
                });
                return dialogRef.afterClosed().pipe(
                  switchMap((result: any) => {
                    console.log(result);
                    console.log(data);
                    return this.http.post<any>(this.configService.config.baseUrl + this.configService.config.bbAxisRedirection, data);
                  })
                );
              }
              if (response.isLeadExisting === true && response.isLeadSubmmitted === true) {
                const dialogRef = this.dialog.open(PolicyCheckComponent, {
                  data: { displayData: "Proposal Already Exists !!",
                          isLeadExisting: response.isLeadExisting,
                          isLeadSubmmitted: response.isLeadSubmmitted
                        }
                });
                dialogRef.afterClosed().subscribe((result: any) => {
                  console.log(result);
                });
                return of(null); // Return a null observable to complete the chain
              } else {
                return this.http.post<any>(this.configService.config.baseUrl + this.configService.config.bbAxisRedirection, data);
              }
            }
            return of(null); // Stop further processing if there's an error
          }
          return of(null); // Return a null observable to complete the chain if response is invalid
        }),
        catchError(error => {
          console.error(error);
          if (error.status === 400) {
            this.toast.warning({ detail: "Warning", summary: error.error.errorMessages.join(', '), duration: 3000 });
          }
          return of(null); // Return a null observable to complete the chain
        })
      )
      .subscribe(
        secondApiResponse => {
          if (secondApiResponse) {
            secondApiResponse = JSON.parse(secondApiResponse.data)
            console.log(secondApiResponse);
            // console.log('Second API response:', secondApiResponse.message);
            window.location.href = secondApiResponse.message;
            // Handle the response from the second API
          }
        },
        error => {
          console.error('Error from second API:', error);
        }
      );
  }
  postd2CResirection(){
    const data = new FormData();
    data.append('data', this.encryptedString.trim())
    this.http.post<any>(this.configService.config.baseUrl + this.configService.config.d2cAxisRedirection, data)
      .subscribe(response => {
        console.log(response);
        response = JSON.parse(response.data)
        console.log(response);
        if(response.isSuccess == true && response.statusCode == 200){
         window.location.href = response.message;
        }
        if(response.isSuccess == false && response.statusCode == 500){
          this.toast.warning({ detail: "Warning", summary: response.message, duration: 3000 });
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
          this.toast.warning({ detail: "Warning", summary: response.message, duration: 3000 });
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
          this.toast.warning({ detail: "Warning", summary: response.message, duration: 3000 });
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
