import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private tokenKey = 'jwtToken';  // Key for localStorage/sessionStorage

  // Store token
  storeToken(token: string): void {
    localStorage.setItem(this.tokenKey, token); // You can use sessionStorage if required
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
}
