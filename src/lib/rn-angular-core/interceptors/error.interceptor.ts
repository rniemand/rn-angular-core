import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from "@angular/common/http";
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
      if(!obj) { return false; }
      if(obj.hasOwnProperty('error')) { return true; }
      if(obj.hasOwnProperty('errors')) { return true; }
      if(obj.hasOwnProperty('ruleSetsExecuted')) { return true; }

      return false;
    }

    private handleValidationError = (err: any) => {
      if(!(err instanceof HttpErrorResponse)) { return; }
      if(!(err.error instanceof Blob)) { return; }
      if(!err.hasOwnProperty('error')) { return; }

      let castErr = err.error as Blob;
      if(!castErr.type) { return; }

      const reader = new FileReader();
      reader.addEventListener('loadend', (e) => {
        const text = e.target?.result?.toString() ?? '';
        let json = this.parseJson(text);

        if(this.isValidationError(json)) {
          if(json.hasOwnProperty('traceId')) {
            this.uiService.handleValidationError({
              aspNetError: json,
              error: '',
              errors: [],
              isValid: false,
              ruleSetsExecuted: []
            });
          }
          else {
            this.uiService.handleValidationError(json as ValidationError);
          }
        }
      });
      reader.readAsText(err.error);
    }

    /*
    {
    "type": "https://tools.ietf.org/html/rfc7231#section-6.5.1",
    "title": "One or more validation errors occurred.",
    "status": 400,
    "traceId": "00-1b644ed16de49ffc81ee5f887fda0ae4-26dc45ca1c1a2c23-00",
    "errors": {
          "ChoreName": ["The length of 'Chore Name' must be at least 23 characters. You entered 4 characters."]
      }
  }
*/


    // {"type":"https://tools.ietf.org/html/rfc7231#section-6.5.1","title":"One or more validation errors occurred.","status":400,"traceId":"00-1b644ed16de49ffc81ee5f887fda0ae4-26dc45ca1c1a2c23-00","errors":{"ChoreName":["The length of 'Chore Name' must be at least 23 characters. You entered 4 characters."]}}
}
