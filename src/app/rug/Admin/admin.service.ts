import { Injectable } from '@angular/core';
import { ConfigService } from 'src/app/services/config.service';
import { HttpService } from 'src/app/services/http.service';
import { Observable } from 'rxjs';
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

  createAV(reqdata: any) {
    const createUpdateAV = this.configService.config.baseUrl + this.configService.config.createUpdateAv;
    return this.httpService.post(createUpdateAV, reqdata)
  }

  updateAV(endPoint:string,reqdata: any){
  const updateAV = this.configService.config.baseUrl + this.configService.config.updateAv;
  return this.httpService.put(updateAV, reqdata)
  }

 deleteav(reqData:string){
  const deleteav = this.configService.config.baseUrl + this.configService.config.deleteAV;
  return this.httpService.post(deleteav, reqData);
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

}
