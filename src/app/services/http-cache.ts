import {
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class NoCacheHeadersInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // if (req.url.includes('leaderboard')) {
    //   const authReq = req.clone({
    //     setHeaders: {
    //       'Cache-Control': 'no-cache'
    //       // Pragma: 'no-cache'
    //     }
    //   });
    //   return next.handle(authReq);
    // } else {
    return next.handle(req);
    // }
  }
}
