import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable, of, Subject } from 'rxjs';
import { ConfigService } from './config.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
@Injectable({
  providedIn: 'root',
})
export class CommonService {
  private toggleSidebarSubject = new Subject<boolean>();
  sidebarState$ = this.toggleSidebarSubject.asObservable();
  selectedSideBarFlag: any;
  dialogRef: any;

  constructor(private http: HttpClient, private configService: ConfigService, public dialog: MatDialog,
    private router: Router
  ) { }

  getPinCodeByCity(reqdata: any) {
    const PinCodeByCity = this.configService.config.baseUrl + this.configService.config.pinCodeDetails;
    return this.http.post<any>(PinCodeByCity, reqdata);
  }

  getCommonPinCodeByCity(reqdata: any) {
    const PinCodeByCityQuote = this.configService.config.baseUrl + this.configService.config.pinCodeDetailsQuote;
    return this.http.post<any>(PinCodeByCityQuote, reqdata);
  }

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

  GetSingleProductQuote(reqData: any) {;
    const singleProductQuote = this.configService.config.baseUrl1 + this.configService.config.getSingleProductQuote;
    return this.http.post<any>(singleProductQuote, reqData);
  }
  
  UpdateAgentAllFormData(reqData:any){
    const saveCommonDraftData = "https://upuat.adityabirlahealth.com/api/rug/UpdateAgentAllFormData";
    return this.http.post<any>(saveCommonDraftData,reqData);
  }

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

  uploadDocument(reqData:any){
    const uploadDocument= this.configService.config.baseUrl1+this.configService.config.uploadDocument;
    return this.http.post(uploadDocument,reqData);
  }

  toggleSidebar(state: any) {
    this.toggleSidebarSubject.next(state);
  }

  setValue(value : boolean){
    this.selectedSideBarFlag = value;
  }

  getValue(){
    return this.selectedSideBarFlag;
  }

  getkycstatus(reqData:any){
    const getkycstatus = this.configService.config.baseUrl + this.configService.config.getkycstatus;
    return this.http.post<any>(getkycstatus, reqData)
  }

  saveAsExcelFile(blob: any, fileName: string) {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
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
