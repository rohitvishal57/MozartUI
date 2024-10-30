import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { AesEncryptionService } from '../services/AESEncrypt.service';
import { Router } from '@angular/router';

@Injectable()
export class EncryptionInterceptor implements HttpInterceptor {

  isEncrypt: boolean = false

  constructor(private aesEncryptService: AesEncryptionService, private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.body && !(req.body instanceof FormData)) {
      // Encrypt the request body
      const encryptedBody = { encryptedData: this.aesEncryptService.encrypt(req.body) };

      // Clone the request and replace the body with the encrypted body
      const clonedRequest = req.clone({
        body: this.isEncrypt ? encryptedBody : req.body,
        setHeaders: {
          'Content-Type': 'application/json'
        }
      });

      // Pass the cloned request instead of the original request to the next handler
      return next.handle(clonedRequest).pipe(
        tap((res: any) => {
          if (res?.body?.isSuccess) {
            const url = this.isEncrypt ? this.aesEncryptService.decrypt(res?.body?.data) : res?.body?.data;
            if (url?.redirectUrl) {
              const modifiedUrl = url?.redirectUrl.replace('https://upuat.adityabirlahealth.com/', 'http://localhost:4200/#/');
              window.open(modifiedUrl, "_blank");
            } else {
              localStorage.setItem('token', res?.body?.token);

              clonedRequest.clone({
                setHeaders: { Authorization: `Bearer ${res?.body?.token}` },

              });
              res.body.data = this.isEncrypt ? this.aesEncryptService.decrypt(res?.body?.data) : res?.body?.data;

            }
          }
        }),
        catchError((error: HttpErrorResponse) => {
          // Handle errors here
          if (error.status === 401) {
            this.router.navigate(['/login']);
          }
          return throwError(error);
        })
      );
    }

    return next.handle(req);
  }
}