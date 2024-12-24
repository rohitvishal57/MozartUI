import { Injectable } from '@angular/core';
import { ConfigService } from 'src/app/services/config.service';
import { HttpService } from 'src/app/services/http.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  getPaginatedAVs(startIndex: number, limit: number) {
    throw new Error('Method not implemented.');
  }

  constructor(private configService: ConfigService,
      private httpService: HttpService) { }

      getAllAxisLocationAndVenors(){
        const req = this.configService.config.baseUrl + this.configService.config.getAllLocationAndvendors;
        return this.httpService.get(req);
      }

      getAllManageLOB(){
        const req = this.configService.config.baseUrl + this.configService.config.getAllManageLob;
        return this.httpService.get(req);
      }

      getAllAVs(){
        const req = this.configService.config.baseUrl + this.configService.config.getallAv;
        return this.httpService.get(req);
      }

      createAV(reqdata : any){
        const  createUpdateAV = this.configService.config.baseUrl + this.configService.config.createUpdateAv;
        return this.httpService.post(createUpdateAV,reqdata)
      }
      
  

}
