import { HttpClient, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) {}

  // GET request
  get<T>(url: string, options?: any): Observable<HttpEvent<T>> {
    return this.http.get<T>(url, options);
  }

  // POST request
  post<T>(url: string, body: any, options?: any): Observable<HttpEvent<T>> {
    return this.http.post<T>(url, body, options);
  }

  // PUT request
  put<T>(url: string, body: any, options?: any): Observable<HttpEvent<T>> {
    return this.http.put<T>(url, body, options);
  }

  // DELETE request
  delete<T>(url: string, options?: any): Observable<HttpEvent<T>> {
    return this.http.delete<T>(url, options);
  }
}
