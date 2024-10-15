import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { finalize, Observable } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable()
export class SpinnerInterceptor implements HttpInterceptor {
  private activeRequests = 0;

  constructor(private spinner : NgxSpinnerService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // this.spinner.show();

    // return next.handle(request).pipe(
    //   finalize(() => {
    //     this.spinner.hide();
    //   })
    // )
    if (this.activeRequests === 0) {
      this.spinner.show();
    }

    this.activeRequests++;

    return next.handle(request).pipe(
      finalize(() => {
        this.activeRequests--;
        if (this.activeRequests === 0) {
          this.spinner.hide();
        }
      })
    );
  }
}
