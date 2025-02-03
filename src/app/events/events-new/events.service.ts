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
  const getEvents = this.configService.config.baseUrl + this.configService.config.getEvents;
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
  getEventLeads(leadParams: any): Observable<any> {
    const eventLeadUrl = this.configService.config.baseUrl + this.configService.config.getEventLead;
    return this.httpService.post<any>(eventLeadUrl, leadParams);
  }

  getEventProposals(proposalParams: any): Observable<any> {
    const eventProposalUrl = this.configService.config.baseUrl + this.configService.config.getEventProposal;
    return this.httpService.post<any>(eventProposalUrl, proposalParams);
  }

  deleteEvent(rowId:any){
    const deleteEventUrl = this.configService.config.baseUrl + this.configService.config.deleteEvent;
    return this.httpService.post<any>(deleteEventUrl, rowId);
  }

  eventListById(view:any){
    const viewEventList = this.configService.config.baseUrl + this.configService.config.eventListById;
    return this.httpService.post<any>(viewEventList, view);
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
