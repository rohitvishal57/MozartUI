import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { CommonService } from '../services/common.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private loginService: CommonService, private router: Router) {}

  private excludedUrls: string[] = [
    '/getHealthQuote','/getStates','/getRelationShip','/getPinCode', '/getPremiumDetaiks', '/getRelations',
    'https://affinitycld-uat.adityabirlahealth.com/Axis_redirection_data_new/api/Product/GetSumInsuredList',
    'https://affinitycld-uat.adityabirlahealth.com/Axis_redirection_data_new/api/BranchBanking/GetBBProposalDetailsV2',
    'https://affinitycld-uat.adityabirlahealth.com/Axis_redirection_data_new/api/Common/GetFamilyConstructByProductCode',
    'https://affinitycld-uat.adityabirlahealth.com/Axis_redirection_data_new/api/Product/GetProductCombination',
    'https://affinitycld-uat.adityabirlahealth.com/Axis_redirection_data_new/api/Product/GetPremium'
  ];

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');
    const isExcludedUrl = this.excludedUrls.some((url) => request.url.includes(url));
    // const isExcludedUrl = this.excludedUrls.some((url) =>
    //   request.url.match(url)
    // );

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
