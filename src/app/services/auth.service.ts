import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private tokenKey = 'token';  // Key for localStorage/sessionStorage

  constructor() {}

  channelVal = this.getUserInfo()?.channel?.toUpperCase();
  isFLSLogin = this.getUserInfo()?.teamList?.length > 0

  private channelSubject = new BehaviorSubject<string>(this.channelVal);
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.isFLSLogin);

  isLoggedIn$ = this.isLoggedInSubject.asObservable();
  channel$ = this.channelSubject.asObservable();

  setChannel(channel: string): void {
    this.channelSubject.next(channel);
  }

  isFLSLoginExists(value: boolean): void {
    this.isLoggedInSubject.next(value);
  }

  // Store token
  storeToken(token: string): void {
    localStorage.setItem(this.tokenKey, token); // You can use sessionStorage if required
    sessionStorage.setItem(this.tokenKey, token);
  }

  // Retrieve token
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Remove token
  removeToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  // Optional: Check if token exists
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  isSessionTokenExists(): boolean {
    return !!sessionStorage.getItem(this.tokenKey);
  }

  getUserInfo() {
    if (this.getToken()) {
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      return userData;
    }
    return null;
  }
  
  getAllowedModules(): any[] {
    const userData = this.getUserInfo();
    if (userData && Array.isArray(userData.moduleAccessList)) {
      return userData.moduleAccessList
        .filter((module: { allow: boolean }) => module.allow)
        .map((module: {moduleName:string,routePath:string,imagePath:string}, index: number) =>{
          return{
            id:index+1,
            displayName:module.moduleName,
            path:module.routePath,
            imagePath: module.imagePath
          };
        });
    }
    return [];
  }

}
