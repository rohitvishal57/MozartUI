import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private loginService: LoginService, private router: Router) {}

  private excludedUrls: string[] = ['/getHealthQuote','/getStates','/getRelationShip','/getPinCode'];

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');

    const isExcludedUrl = this.excludedUrls.some((url) =>
      request.url.match(url)
    );

    if (!isExcludedUrl) {
      request = request.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
      });
    }
    
    return next.handle(request).pipe(
      catchError((err) => {
        console.log(err);
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
            this.loginService.signOut();
          }
          return throwError(() => err.error.message || 'Some Other Error Happened!!');
        }
        return throwError(() => new Error('Some Other Error Happen!!'));
      })
    );
  }
}
