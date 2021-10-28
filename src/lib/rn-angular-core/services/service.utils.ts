import { Observable, throwError as _observableThrow, of as _observableOf } from 'rxjs';
import { ApiException } from '../models/_models';

export function throwException(message: string, status: number, response: string, headers: { [key: string]: any; }, result?: any): Observable<any> {
  return _observableThrow(new ApiException(message, status, response, headers, result));
}

export function blobToText(blob: any): Observable<string> {
  return new Observable<string>((observer: any) => {
      if (!blob) {
          observer.next("");
          observer.complete();
      } else {
          let reader = new FileReader();
          reader.onload = event => {
              observer.next((<any>event.target).result);
              observer.complete();
          };
          reader.readAsText(blob);
      }
  });
}
