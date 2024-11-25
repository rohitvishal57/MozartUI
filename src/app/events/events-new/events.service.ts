import { Injectable } from '@angular/core';
import { ConfigService } from 'src/app/services/config.service';
import { HttpService } from 'src/app/services/http.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  constructor(private configService: ConfigService, private httpService: HttpService) { }
  getEvents(retrieveData: any, agentCode:any){
  const getEvents = this.configService.config.baseUrl + this.configService.config.getEvents+`?agentCode=${agentCode}`;
  return this.httpService.post<any>(getEvents, retrieveData)
}
  saveEvent(eventData: any) {
    const saveEvent = this.configService.config.baseUrl + this.configService.config.saveEvent;
    return this.httpService.post<any>( saveEvent, eventData);
  }
}
