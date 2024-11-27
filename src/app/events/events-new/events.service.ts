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

  getBirthdays(birthdayList:any){
    const getBirthdays = this.configService.config.baseUrl + this.configService.config.getBirthdays;
    return this.httpService.post<any>( getBirthdays, birthdayList);
  }

  sendIndividualWishes(sendWishesPayload:any){
    const sendIndividualWishes = this.configService.config.baseUrl + this.configService.config.sendIndividualWishes;
    return this.httpService.post<any>( sendIndividualWishes, sendWishesPayload);
  }
  sendWishesToAll(sendWishesAll:any){
    const sendWishesToAll = this.configService.config.baseUrl + this.configService.config.sendWishesToAll;
    return this.httpService.post<any>( sendWishesToAll, sendWishesAll);
  }
}
