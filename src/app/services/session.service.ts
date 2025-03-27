import { Injectable } from '@angular/core';
import { BehaviorSubject, debounceTime, fromEvent, interval, Subscription } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private sessionDuration = 45 * 60;
  private countdownSubject = new BehaviorSubject<number>(0);
  private sessionExpiredSubject = new BehaviorSubject<boolean>(false);
  private timerSubscription: Subscription | null = null;
  private sessionEndTimeKey = 'sessionExpiration';

  countdown$ = this.countdownSubject.asObservable();
  sessionExpired$ = this.sessionExpiredSubject.asObservable();
  public channel = new BroadcastChannel('auth_channel');

  constructor() {
    this.channel.onmessage = (event) => {
      if (event.data === 'logout') {
        this.forceLogout();
      }
    };

    this.startUserActivityListener();
  }

  broadcastLogout() {
    this.channel.postMessage('logout'); // Notify all tabs
  }

  forceLogout() {
    localStorage.clear();
    window.location.href = '';
  }

  startSessionTimer() {
    this.clearTimer();
  
    const storedExpiration = localStorage.getItem(this.sessionEndTimeKey);
    let sessionEndTime = storedExpiration ? parseInt(storedExpiration, 10) : Date.now() + this.sessionDuration * 1000;
  
    this.updateCountdown(sessionEndTime);
  
    this.timerSubscription = interval(1000).subscribe(() => {
      const timeLeft = Math.floor((sessionEndTime - Date.now()) / 1000);
  
      if (timeLeft <= 0) {
        this.logoutUser();
        return;
      }
  
      this.countdownSubject.next(timeLeft);
    });
  
    localStorage.setItem(this.sessionEndTimeKey, sessionEndTime.toString());
  }

  private startUserActivityListener() {
    const events = ['keydown', 'click'];

    events.forEach(event => {
      fromEvent(document, event)
        .pipe(debounceTime(500)) // Prevent multiple triggers in a short time
        .subscribe(() => {
          this.extendSession();
        });
    });
  }
  
  clearTimer() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
      this.timerSubscription = null;
    }
    this.countdownSubject.next(0); // Ensure it never goes negative
  }

  extendSession() {
    const newEndTime = Date.now() + this.sessionDuration * 1000;
    localStorage.setItem(this.sessionEndTimeKey, newEndTime.toString());
    this.updateCountdown(newEndTime);
    this.startSessionTimer();
  }

  private updateCountdown(sessionEndTime: number) {
    const timeLeft = Math.floor((sessionEndTime - Date.now()) / 1000);
    this.countdownSubject.next(timeLeft);
  }

  private logoutUser() {
    this.clearTimer();
    this.sessionExpiredSubject.next(true);
    this.broadcastLogout();
  }
}
