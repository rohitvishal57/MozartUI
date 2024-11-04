import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { AesEncryptionService } from '../services/AESEncrypt.service';
import { Router } from '@angular/router';

@Injectable()
export class EncryptionInterceptor implements HttpInterceptor {

  isEncrypt: boolean = true;
  clonedRequest : any;

  constructor(private aesEncryptService: AesEncryptionService, private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.body) {
      
      if (req.body && req?.method == 'POST') {
        // Encrypt the request body
        const encryptedBody = this.aesEncryptService.encrypt(req.body);
        // Clone the request and replace the body with the encrypted body
        this.clonedRequest = req.clone({
          body: this.isEncrypt ? encryptedBody : req.body,
          setHeaders: {
            'Content-Type': 'application/json'
          }
        });
      }
      else if (req?.method == 'GET' && req.params.keys().length > 0) {
        let encryptedParams = req.params;
        req.params.keys().forEach((key) => {
          const value = req.params.get(key);
          if (value) {
            const encryptedValue = this.aesEncryptService.encrypt(value);
            encryptedParams = encryptedParams.set(key, encryptedValue);
          }
        });
        this.clonedRequest = req.clone({ params: encryptedParams });
      }

      // Pass the cloned request instead of the original request to the next handler
      return next.handle(this.clonedRequest).pipe(
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
            this.router.navigate(['/login']);
          }
          return throwError(error);
        })
      );
    }

    return next.handle(req).pipe(
      tap((res: any) => {
        if (res.body && res?.body?.isSuccess) {
          res.body.data = this.aesEncryptService.decrypt(res?.body?.data);
        }
      })
    );
  };
}