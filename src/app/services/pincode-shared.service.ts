import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PincodeSharedService {

  constructor() { }
  private cityStateSource = new BehaviorSubject<{ city: string; state: string }>({ city: '', state: '' });
  cityState$ = this.cityStateSource.asObservable();

  updateCityState(data: { city: string; state: string }) {
    console.log('Updating city and state:', data);
    this.cityStateSource.next(data);
  }

}
