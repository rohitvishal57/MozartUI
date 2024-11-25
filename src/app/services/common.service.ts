import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable, of } from 'rxjs';
import { ConfigService } from './config.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
@Injectable({
  providedIn: 'root',
})
export class CommonService {
  private yatraUrl: string = 'https://usp.monocept.ai/yatra/';
  dialogRef: any;

  // private baseUrl: string = 'http://20.235.250.168:8086/';

  constructor(private http: HttpClient, private configService: ConfigService, public dialog: MatDialog,
    private router: Router
  ) { }


  // For All PartnerApi

  getPinCodeByCity(reqdata: any) {
    const PinCodeByCity = this.configService.config.baseUrl + this.configService.config.pinCodeDetails;
    return this.http.post<any>(PinCodeByCity, reqdata);
  }

  // getHealthPlans(year: any, adultCount: any, childCount: any) {
  //   return this.http.get<any>(`${this.apiUrl}`);
  // }

  // CreateProposal(reqData: any) {
  //   return this.http.post<any>(`${this.baseUrl}Banca/PartnerApi/CreateProposal`, reqData);
  // }
  // convertToRDBMS(data: any) {
  //   const data1 = JSON.stringify(data);
  //   const headers = { 'content-type': 'application/json' }
  //   return this.http.post(`${this.baseUrl}Banca/Forms/ConvertToRDBMS`, data1, { 'headers': headers });
  // }
  //For ICICI
  // getOccupations() {
  //   return this.http.get<any>(`${this.apiUrl1}`);
  // }

  //For ABHI











  //yatra






  getProposalNumber() {
    const proposalnumber = this.configService.config.baseUrl + this.configService.config.proposalNumber;
    return this.http.get<any>(proposalnumber);
  }

  Getproductlist(reqData: any) {
    const productList = this.configService.config.baseUrl + this.configService.config.productList;
    return this.http.post<any>(productList, reqData)
  }

  Getformsequence(reqData: any) {
    const formSequence = this.configService.config.baseUrl + this.configService.config.formSequence;
    return this.http.post<any>(formSequence, reqData)
  }

  GetSingleProductQuote(reqData: any) {
    // const singleProductQuote=this.configService.config.baseUrl + this.configService.config.getSingleProductQuote;
    const singleProductQuote = this.configService.config.baseUrl1 + this.configService.config.getSingleProductQuote;
    return this.http.post<any>(singleProductQuote, reqData);
  }


  // storeToken(token: string) {
  //   localStorage.setItem('token', token);
  // }
  // isLoggedIn(): boolean {
  //   if (!!localStorage.getItem('token')) {
  //     return true;
  //   }
  //   return false;
  // }
  signOut() {
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['']);
  }


  checkNullOrUndefined(val: any) {
    if (val === null || val === undefined || val === "null") {
      return true;
    } else {
      return false;
    }
  }
  openDialog(obj: any, callBack: any) {
    this.dialogRef = this.dialog.open(obj?.template, {
      disableClose: true,
      width: obj?.width ? obj?.width : '',
      height: '',
      data: obj.data ? obj.data : null,
      panelClass: obj.customClass ? obj.customClass : 'rounded-dialog'
    });

    this.dialogRef.afterClosed().subscribe((result: any) => {
      callBack(result)
    });
  }

  hideDialog() {
    if (this.dialogRef) {
      this.dialogRef.close()
    }
  }
  uploaDocument(reqData:FormData){
    const uploadDocument= this.configService.config.baseUrl1+this.configService.config.uploadDocument;
    return this.http.post(uploadDocument,reqData);
  }
}
