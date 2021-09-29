import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";

// RnAngularCore
import { AuthService, UiService, ValidationError } from "../services/_services";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(
      private authService: AuthService,
      private uiService: UiService
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if (err.status === 401) {
                // auto logout if 401 response returned from api
                this.authService.logout();
                location.reload();
            }

            this.handleValidationError(err);
            return throwError(err.error.message || err.statusText);
        }))
    }

    // Internal methods
    private parseJson = (json: any): any => {
      if(typeof(json) !== 'string')
        return null;

      if(!json.startsWith('{') || !json.endsWith('}'))
        return null;

      try {
        return JSON.parse(json);
      }
      catch(err) {
        return null;
      }
    }

    private isValidationError = (obj: any): boolean => {
      if(!obj)
        return false;

      if(
        !obj.hasOwnProperty('error') ||
        !obj.hasOwnProperty('errors') ||
        !obj.hasOwnProperty('isValid') ||
        !obj.hasOwnProperty('ruleSetsExecuted')
      ) {
        return false;
      }

      return true;
    }

    private handleValidationError = (err: any) => {
      if(!err.hasOwnProperty('error') || !(err.error instanceof Blob))
        return;
      
      let castErr = err.error as Blob;
      if(castErr.type != 'application/json')
        return;

      const reader = new FileReader();
      reader.addEventListener('loadend', (e) => {
        const text = e.target?.result?.toString() ?? '';
        let json = this.parseJson(text);
        if(this.isValidationError(json)) {
          this.uiService.handleValidationError(json as ValidationError);
        }
      });
      reader.readAsText(err.error);
    }
}
