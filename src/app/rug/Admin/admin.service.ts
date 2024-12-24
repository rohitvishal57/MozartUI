import { Injectable } from '@angular/core';
import { ConfigService } from 'src/app/services/config.service';
import { HttpService } from 'src/app/services/http.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private configService: ConfigService,
      private httpService: HttpService) { }

      createUpdateAV(reqdata : any){
        const  createUpdateAV = this.configService.config.baseUrl + this.configService.config.createUpdateAV;
        return this.httpService.post(createUpdateAV,reqdata)
      }
}
