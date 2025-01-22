import { Injectable } from '@angular/core';
import { ConfigService } from 'src/app/services/config.service';
import { HttpService } from 'src/app/services/http.service';
import { map, Observable } from 'rxjs';
import { HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  getPaginatedAVs(startIndex: number, limit: number) {
    throw new Error('Method not implemented.');
  }

  constructor(private configService: ConfigService,
    private httpService: HttpService) { }

  getAllAxisLocationAndVenors() {
    const req = this.configService.config.baseUrl + this.configService.config.getAllLocationAndvendors;
    return this.httpService.get(req);
  }

  getAllManageLOB() {
    const req = this.configService.config.baseUrl + this.configService.config.getAllManageLob;
    return this.httpService.get(req);
  }

  getAllAVs(avid?: any): Observable<any> {
    const req = this.configService.config.baseUrl + this.configService.config.getallAv;
    return this.httpService.get(req);
  }

  // getAllBaseCaller(baseCallerEmpId?: any): Observable<any> {
  //   const req = this.configService.config.baseUrl + this.configService.config.getBaseCaller;
  //   return this.httpService.get(req);
  // }

  createAV(reqdata: any) {
    const createUpdateAV = this.configService.config.baseUrl + this.configService.config.createUpdateAv;
    return this.httpService.post(createUpdateAV, reqdata)
  }

  createUpdatebaseCaller(reqdata: any) {
    const createUpdatebaseCaller = this.configService.config.baseUrl + this.configService.config.CreateUpdateBaseCaller;
    return this.httpService.post(createUpdatebaseCaller, reqdata);
  }

  updateAV(endPoint:string,reqdata: any){
  const updateAV = this.configService.config.baseUrl + this.configService.config.updateAv;
  return this.httpService.put(updateAV, reqdata)
  }

 deleteav(reqData:string){
  const deleteav = this.configService.config.baseUrl + this.configService.config.deleteAV;
  return this.httpService.post(deleteav, reqData);
 }

 deleteBaseCaller(reqData:string){
  const deleteBaseCaller = this.configService.config.baseUrl + this.configService.config.DeleteBaseCaller;
  return this.httpService.post(deleteBaseCaller, reqData);
 }

 UploadBulk(reqdata: any) {
  const BulkUpload = this.configService.config.baseUrl + this.configService.config.bulkUpload;
  return this.httpService.post(BulkUpload, reqdata)
}




  getAllBaseCaller(pageNo:number,noOfRecords:number){
    const headers = new HttpHeaders({
      'accept': '*/*'  
    });
    const params = new HttpParams()
      .set('pageNo', pageNo.toString())
      .set('noOfRow', noOfRecords.toString());
    const getBaseCaller=this.configService.config.baseUrl+this.configService.config.getBaseCaller;
    return this.httpService.get(getBaseCaller,{ headers, params })
  }

getLead(reqdata: any) {
  const getlead = this.configService.config.baseUrl + this.configService.config.getLeads;
  return this.httpService.post(getlead, reqdata)
}

assignToAv(reqdata: any){
  const assignToAV = this.configService.config.baseUrl + this.configService.config.assignToAv;
  return this.httpService.post(assignToAV, reqdata)
}

getAllAudit(reqdata:any){
  const getAllaudit = this.configService.config.baseUrl + this.configService.config.getAllAudit;
  return this.httpService.post(getAllaudit, reqdata)
}


AssignBackToDo(reqdata:any){
  const assignBacktoDo = this.configService.config.baseUrl + this.configService.config.assignBackToDo;
  return this.httpService.post(assignBacktoDo, reqdata)
}

// ExtractMasterData(reqdata:any){
//   const extractMastardata = this.configService.config.baseUrl + this.configService.config.extractMastarData;
//   return this.httpService.post(extractMastardata, reqdata)
// }

ExtractMasterData(apiUrl:any,request: any,fileName:any): Observable<void> {
  const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  return this.httpService.post(apiUrl, request, { headers, responseType: 'blob' }).pipe(
    map((response: any) => {
      const a = document.createElement('a');
      const objectUrl = URL.createObjectURL(response);
      a.href = objectUrl;
      a.download = `${fileName}.xlsx`;
      a.click();
      URL.revokeObjectURL(objectUrl);
      return
    })
  );
}

GetTSPolicyInfoByLeadId(reqdata:any){
  const getTSPolicyInfoLeadid = this.configService.config.baseUrl + this.configService.config.getTSPolicyInfoLeadId;
  return this.httpService.post(getTSPolicyInfoLeadid, reqdata)
}
}

