import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AuthService } from "../services/auth.service";

@Injectable()
export class AppendTokenInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) { /* intentional */ }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let accessToken = this.authService.getAuthToken();

    if(!accessToken)
      return next.handle(request);

    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    
    return next.handle(request);
  }
}
