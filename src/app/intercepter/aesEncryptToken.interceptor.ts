import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { catchError, finalize, Observable, tap, throwError } from 'rxjs';
import { AesEncryptionService } from '../services/AESEncrypt.service';
import { Router } from '@angular/router';
import { LoadingService } from '../services/loading.service';

@Injectable()
export class EncryptionInterceptor implements HttpInterceptor {

  isEncrypt: boolean = true;

  private excludedUrls: string[] = [
    'https://affinitycld-uat.adityabirlahealth.com/Axis_redirection_data_new/api/Product/GetSumInsuredList',
    'https://affinitycld-uat.adityabirlahealth.com/Axis_redirection_data_new/api/BranchBanking/GetBBProposalDetailsV2',
    'https://affinitycld-uat.adityabirlahealth.com/Axis_redirection_data_new/api/Common/GetFamilyConstructByProductCode',
    'https://affinitycld-uat.adityabirlahealth.com/Axis_redirection_data_new/api/Product/GetProductCombination',
    'https://affinitycld-uat.adityabirlahealth.com/Axis_redirection_data_new/api/Product/GetPremium',
    'https://affinitycld-uat.adityabirlahealth.com/Axis_redirection_data_new/api/BranchBanking/SaveBBCommonDraft',
    'https://affinitycld-uat.adityabirlahealth.com/Axis_redirection_data_new/api/Product/GetProposerRelations'
  ];

  constructor(private aesEncryptService: AesEncryptionService, private router: Router, private loadingService: LoadingService ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const isExcluded = this.excludedUrls.some(url => req.url.includes(url));
    
    if (isExcluded) {
      return next.handle(req);
    }

    if (req.body && !(req.body instanceof FormData) && req?.method == 'POST') {
      this.loadingService.show();
      const encryptedBody = this.aesEncryptService.encrypt(req.body);
      const clonedRequest = req.clone({
        body: this.isEncrypt ? encryptedBody : req.body,
        setHeaders: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Origin, Content-Type, Accept, Authorization'
        }
      });
      
      return next.handle(clonedRequest).pipe(
        tap((res: any) => {
          if (res.body && res?.body?.isSuccess) {
            const url = this.isEncrypt ? this.aesEncryptService.decrypt(res?.body?.data) : res?.body?.data;
            if (url?.redirectUrl) {
              const modifiedUrl = url?.redirectUrl.replace('https://upuat.adityabirlahealth.com/', 'http://localhost:4200/#/');
              window.open(modifiedUrl, "_blank");
            } else {
              res.body.data = this.isEncrypt ? this.aesEncryptService.decrypt(res?.body?.data) : res?.body?.data;
            }
          }
          res.body && localStorage.setItem('token', res?.body?.token);
        }),
        catchError((error: HttpErrorResponse) => {
          // Handle errors here
          if (error.status === 401) {
            localStorage.clear()
            this.router.navigate(['']);
          }
          return throwError(error);
        }),
        finalize(() => this.loadingService.hide())
      );
    }

    return next.handle(req).pipe(
      tap((res: any) => {
        if (res.body && res?.body?.isSuccess) {
          res.body.data = this.aesEncryptService.decrypt(res?.body?.data);
        }
      }),
      finalize(() => this.loadingService.hide())
    );
  };
}