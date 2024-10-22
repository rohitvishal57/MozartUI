import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ConfigService } from '../services/config.service';
import { HttpService } from '../services/http.service';

@Injectable({
  providedIn: 'root'
})
export class PerformanceService {

  constructor(private http:HttpClient, private configService: ConfigService, private httpService: HttpService) { }


  getPerformanceDataApi(requestBody:any):Observable<any>{
    const getPerformanceDataApi = this.configService.config.baseUrl + this.configService.config.getPerformanceDetails;
    return this.http.post<any>(getPerformanceDataApi, requestBody);
  }
  getPerformanceDetailedViewList(requestBody:any):Observable<any>{
    const getPerformanceDetailedViewApi = this.configService.config.baseUrl + this.configService.config.getPerformanceDetailedViewList;
    return this.http.post<any>(getPerformanceDetailedViewApi, requestBody);
  }
  getPerformanceDetailedViewLatestCount(requestBody:any):Observable<any>{
    const getPerformanceDetailedLatestCountApi = this.configService.config.baseUrl + this.configService.config.getPerformanceDetailedViewLatestCount;
    return this.http.post<any>(getPerformanceDetailedLatestCountApi, requestBody);
  }
  uploadPerformancefile(file: any) {
    return this.http.post<any>(`${this.configService.config.baseUrl}${this.configService.config.uploadAgencyPerformance}`, file)
      .pipe(map(data => {
        return data;
      }));
  }
}