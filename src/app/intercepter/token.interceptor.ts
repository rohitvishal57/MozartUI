import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, catchError, finalize, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { CommonService } from '../services/common.service';
import { LoadingService } from '../services/loading.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private loginService: CommonService, private router: Router, private loadingService: LoadingService) { }

  private excludedUrls: string[] = [
    '/getHealthQuote', '/getStates', '/getRelationShip', '/getPinCode', '/getPremiumDetaiks', '/getRelations',
    'https://affinitycld-uat.adityabirlahealth.com/Axis_redirection_data_new/api/Product/GetSumInsuredList',
    'https://affinitycld-uat.adityabirlahealth.com/Axis_redirection_data_new/api/BranchBanking/GetBBProposalDetailsV2',
    'https://affinitycld-uat.adityabirlahealth.com/Axis_redirection_data_new/api/Common/GetFamilyConstructByProductCode',
    'https://affinitycld-uat.adityabirlahealth.com/Axis_redirection_data_new/api/Product/GetProductCombination',
    'https://affinitycld-uat.adityabirlahealth.com/Axis_redirection_data_new/api/Product/GetPremium',
    'https://affinitycld-uat.adityabirlahealth.com/Axis_redirection_data_new/api/BranchBanking/SaveBBCommonDraft',
    'https://affinitycld-uat.adityabirlahealth.com/Axis_redirection_data_new/api/Product/GetProposerRelations',
    'https://usp.monocept.ai/api/v1/SaveBBCommonDraft',
    'https://upuat.adityabirlahealth.com/api/v1/GetBBOTP',
    'https://upuat.adityabirlahealth.com/api/v1/ValidateBBOTP',
    'https://upuat.adityabirlahealth.com/api/rug/saveupdatecommondraft',
    'https://upuat.adityabirlahealth.com/api/v1/SaveBBCommonDraft',
    'https://upuat.adityabirlahealth.com/api/v1/HalfQuote',
    'https://usp.monocept.ai/api/rug/GetSumInsuredList',
    'https://usp.monocept.ai/api/rug/GetFamilyConstructByProductCode',
    'https://usp.monocept.ai/api/rug/GetPremium',
    'https://usp.monocept.ai/api/rug/GetProposerRelations',
    'https://upuat.adityabirlahealth.com/api/v1/GetBBPolicyInfoByLeadId',
    'https://usp.monocept.ai/api/rug/UpdateAgentAllFormData',
    'https://upuat.adityabirlahealth.com/api/rug/GetFamilyConstructByProductCode',
    'https://upuat.adityabirlahealth.com/api/rug/GetSumInsuredList',
    'https://upuat.adityabirlahealth.com/api/rug/GetPremium',
    'https://usp.monocept.ai/api/rug/GetD2CPolicyInfoByLeadId',
    'https://upuat.adityabirlahealth.com/api/rug/GetD2CPolicyInfoByLeadId'
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
    this.loadingService.show();
    return next.handle(request).pipe(
      finalize(() => this.loadingService.hide()),
      catchError((err) => {
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
