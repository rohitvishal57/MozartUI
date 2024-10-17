import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class DataService {

    private dataSubject = new Subject<any>();

    data$ = this.dataSubject.asObservable();

    setData(data: any): void {
        this.dataSubject.next(data);
    }
}
