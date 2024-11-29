import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  use(lang: string) {
    throw new Error('Method not implemented.');
  }
 
  private languageSubject = new BehaviorSubject<string>(localStorage.getItem('preferredLanguage') || 'en');
  language$ = this.languageSubject.asObservable(); 
 
  setLanguage(lang: any) {
    this.languageSubject.next(lang); 
    localStorage.setItem('preferredLanguage', lang);
  }
}
