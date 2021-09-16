import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpEventType } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { AuthService } from "../services/auth.service";

@Injectable()
export class SessionTokenInterceptor implements HttpInterceptor {
    constructor(
      private authService: AuthService
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(tap(evt => {
          if(evt.type !== HttpEventType.Response)
            return;

          if(!evt.headers.has('x-rn-session'))
            return;

          this.authService.updateAuthToken(evt.headers.get('x-rn-session') ?? '');
        }));
    }
}
