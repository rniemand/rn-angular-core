import { HttpClient, HttpHeaders, HttpResponse, HttpResponseBase } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { mergeMap as _observableMergeMap, catchError as _observableCatch } from 'rxjs/operators';
import { Observable, throwError as _observableThrow, of as _observableOf, Subject } from 'rxjs';

// RnAngularCore
import { RnAppConfig, RN_APP_CONFIG } from "../configuration/_configuration";
import { StorageService } from "./storage.service";
import { UiService } from "./ui.service";
import { LoggerFactory, LoggerInstance } from "../logger/_logger";
import { RnCoreService } from "../enums/_enums";
import { AuthenticationRequest, AuthenticationResponse, UserDto } from './../models/_models';
import { blobToText, throwException } from "./service.utils";

export interface AuthResult {
  loggedIn: boolean;
  user?: UserDto;
  error?: any;
}

@Injectable()
export class AuthService {
  authChanged = new Subject<boolean>();
  loggedIn: boolean = false;
  currentUser?: UserDto;
  keyToken: string;
  keyUserInfo: string;

  private baseUrl: string;
  private _currentToken: string = '';
  private _logger: LoggerInstance;
  protected jsonParseReviver: ((key: string, value: any) => any) | undefined = undefined;

  constructor(
    private _storage: StorageService,
    private _uiService: UiService,
    private _loggerFactory: LoggerFactory,
    @Inject(HttpClient)
    private http: HttpClient,
    @Inject(RN_APP_CONFIG)
    private config: RnAppConfig
  ) {
    this._logger = this._loggerFactory.getInstance(RnCoreService.Auth);
    this.baseUrl = this.config.apiBaseUrl;
    this.keyToken = this.config.auth.storageTokenName;
    this.keyUserInfo = this.config.auth.storageUserInfo;
    this._tryResumeSession();
  }

  // public
  public login = (username: string, password: string) => {
    this._logger.traceMethod('login');

    let authRequest = new AuthenticationRequest({
      username: username,
      password: password
    });

    return new Promise<AuthResult>((resolve, reject) => {
      this._authenticate(authRequest).toPromise().then(
        (response: AuthenticationResponse) => {
          this._processAuthResponse(response);
          resolve({
            loggedIn: (response?.user?.userId ?? 0) > 0,
            user: response?.user
          });
        },
        (error: any) => {
          this._uiService.handleClientError(`Error logging in: ${error}`);
          this._setLoggedInSate(false);
          resolve({
            loggedIn: false,
            error: error
          });
        }
      );
    });
  }

  public logout = () => {
    this._logger.traceMethod('logout');

    this._setLoggedInSate(false);
    //this.router.navigate(['/']);
    this._uiService.notify('Logged out', 1500);
  }

  public updateAuthToken = (token: any) => {
    this._logger.traceMethod('updateAuthToken', `(${typeof token})`);
    if(typeof(token) !== 'string' || token.length <= 0) { return; }

    this._logger.trace2('updateAuthToken', `updating token (${token.length} bytes)`);
    this._currentToken = token;
    this._storage.setItem(this.keyToken, token);
  }

  public getAuthToken = () => {
    this._logger.traceMethod('getAuthToken');

    if(this._currentToken.length < 1)
      return null;
    
    return this._currentToken;
  }

  public getCurrentUserId = () => {
    return this.currentUser?.userId ?? 0;
  }
  
  public getIntUserAttribute = (attribute: string, fallback: number = 0): number => {
    if(!this.currentUser) {
      return fallback;
    }

    let rawValue = this._getAttribute(attribute);
    if(rawValue === undefined) {
      return fallback;
    }

    if(typeof rawValue === 'number') {
      return rawValue;
    }

    if(typeof rawValue === 'string') {
      let parsedValue = parseInt(rawValue);
      if(isNaN(parsedValue)) { return fallback; }
      return parsedValue;
    }
    
    return fallback;
  }


  // internal
  private _getAttribute = (attribute: string) => {
    if(!this.currentUser || !this.currentUser.attributes) {
      return undefined;
    }

    if(!this.currentUser.attributes.hasOwnProperty(attribute)) {
      return undefined;
    }

    return this.currentUser.attributes[attribute];
  }

  private _authenticate(request: AuthenticationRequest): Observable<AuthenticationResponse> {
    let url_ = this.baseUrl + "/api/Auth/authenticate";
    url_ = url_.replace(/[?&]$/, "");

    const content_ = JSON.stringify(request);

    let options_ : any = {
        body: content_,
        observe: "response",
        responseType: "blob",
        headers: new HttpHeaders({
            "Content-Type": "application/json",
            "Accept": "application/json"
        })
    };

    return this.http.request("post", url_, options_).pipe(_observableMergeMap((response_ : any) => {
        return this._processAuthenticate(response_);
    })).pipe(_observableCatch((response_: any) => {
        if (response_ instanceof HttpResponseBase) {
            try {
                return this._processAuthenticate(<any>response_);
            } catch (e) {
                return <Observable<AuthenticationResponse>><any>_observableThrow(e);
            }
        } else
            return <Observable<AuthenticationResponse>><any>_observableThrow(response_);
    }));
}

  private _processAuthenticate(response: HttpResponseBase): Observable<AuthenticationResponse> {
    const status = response.status;
    const responseBlob =
        response instanceof HttpResponse ? response.body :
        (<any>response).error instanceof Blob ? (<any>response).error : undefined;

    let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }}
    if (status === 200) {
        return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
        let result200: any = null;
        let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
        result200 = AuthenticationResponse.fromJS(resultData200);
        return _observableOf(result200);
        }));
    } else if (status !== 200 && status !== 204) {
        return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
        return throwException("An unexpected server error occurred.", status, _responseText, _headers);
        }));
    }
    return _observableOf<AuthenticationResponse>(<any>null);
  }

  private _updateCurrentUser = (response: AuthenticationResponse) => {
    this._logger.traceMethod('_updateCurrentUser');
    let loggedIn = (response?.user?.userId ?? 0) > 0;
    this.currentUser = undefined;

    if(!loggedIn) {
      if(this._storage.hasItem(this.keyUserInfo)) {
        this._storage.removeItem(this.keyUserInfo);
      }
      return;
    }
    
    this.currentUser = response.user;
    this._storage.setItem(this.keyUserInfo, this.currentUser);
  }

  private _removeCurrentUser = () => {
    this._logger.traceMethod('_removeCurrentUser');
    this.currentUser = undefined;

    if(this._storage.hasItem(this.keyUserInfo)) {
      this._storage.removeItem(this.keyUserInfo);
      this._logger.trace2('_removeCurrentUser', 'Removed current user info');
    }
  }

  private _setLoggedInSate = (loggedIn: boolean, token?: string) => {
    this._logger.traceMethod('_setLoggedInSate', loggedIn ? 'LOGGED_IN' : 'LOGGED_OUT');

    this.loggedIn = loggedIn;

    if(loggedIn === false) {
      this._currentToken = '';
      this._removeCurrentUser();
      
      if(this._storage.hasItem(this.keyToken)) {
        this._storage.removeItem(this.keyToken);
      }
    }
    else {
      this.updateAuthToken(token);
    }
    
    this.authChanged.next(this.loggedIn);
  }

  private _processAuthResponse = (response: AuthenticationResponse) => {
    this._logger.traceMethod('_processAuthResponse');
    this._updateCurrentUser(response);

    if((response?.token?.length ?? 0) > 0) {
      this._setLoggedInSate(true, response.token);
    } else {
      this._setLoggedInSate(false);
    }
  }

  private _tryResumeSession = () => {
    if(this._storage.hasItem(this.keyUserInfo)) {
      this._logger.trace('loading stored user info');
      this.currentUser = this._storage.getItem<UserDto>(this.keyUserInfo);
    }
    
    if(this._storage.hasItem(this.keyToken)) {
      // TODO: [VALIDATION] Add some form of token validation here
      this._logger.trace('found stored session token');
      this._setLoggedInSate(true, this._storage.getItem<string>(this.keyToken));
    }
  }
}
