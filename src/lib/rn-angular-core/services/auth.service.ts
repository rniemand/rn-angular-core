import { HttpClient, HttpHeaders, HttpResponse, HttpResponseBase } from "@angular/common/http";
import { Inject, Injectable, Optional } from "@angular/core";
import { RnAuthConfig, RN_AUTH_CONFIG } from "../rn-angular-core.config";
import { mergeMap as _observableMergeMap, catchError as _observableCatch } from 'rxjs/operators';
import { Observable, throwError as _observableThrow, of as _observableOf, Subject } from 'rxjs';
import { StorageService } from "./storage.service";
import { UiService } from "./ui.service";
import { LoggerFactory, LoggerInstance } from "../logger";


export class UserDto implements IUserDto {
  userId?: number;
  lastSeen?: Date | undefined;
  firstName?: string | undefined;
  lastName?: string | undefined;
  username?: string | undefined;
  email?: string | undefined;
  attributes?: { [key: string]: any; } | undefined;

  constructor(data?: IUserDto) {
      if (data) {
          for (var property in data) {
              if (data.hasOwnProperty(property))
                  (<any>this)[property] = (<any>data)[property];
          }
      }
  }

  init(_data?: any) {
      if (_data) {
          this.userId = _data["userId"];
          this.lastSeen = _data["lastSeen"] ? new Date(_data["lastSeen"].toString()) : <any>undefined;
          this.firstName = _data["firstName"];
          this.lastName = _data["lastName"];
          this.username = _data["username"];
          this.email = _data["email"];
          if (_data["attributes"]) {
              this.attributes = {} as any;
              for (let key in _data["attributes"]) {
                  if (_data["attributes"].hasOwnProperty(key))
                      (<any>this.attributes)![key] = _data["attributes"][key];
              }
          }
      }
  }

  static fromJS(data: any): UserDto {
      data = typeof data === 'object' ? data : {};
      let result = new UserDto();
      result.init(data);
      return result;
  }

  toJSON(data?: any) {
      data = typeof data === 'object' ? data : {};
      data["userId"] = this.userId;
      data["lastSeen"] = this.lastSeen ? this.lastSeen.toISOString() : <any>undefined;
      data["firstName"] = this.firstName;
      data["lastName"] = this.lastName;
      data["username"] = this.username;
      data["email"] = this.email;
      if (this.attributes) {
          data["attributes"] = {};
          for (let key in this.attributes) {
              if (this.attributes.hasOwnProperty(key))
                  (<any>data["attributes"])[key] = this.attributes[key];
          }
      }
      return data; 
  }
}

export interface IUserDto {
  userId?: number;
  lastSeen?: Date | undefined;
  firstName?: string | undefined;
  lastName?: string | undefined;
  username?: string | undefined;
  email?: string | undefined;
  attributes?: { [key: string]: any; } | undefined;
}

export interface IAuthenticationResponse {
  token?: string | undefined;
  user?: UserDto | undefined;
  success?: boolean;
  message?: string | undefined;
}

export class AuthenticationResponse implements IAuthenticationResponse {
  token?: string | undefined;
  user?: UserDto | undefined;
  success?: boolean;
  message?: string | undefined;

  constructor(data?: IAuthenticationResponse) {
      if (data) {
          for (var property in data) {
              if (data.hasOwnProperty(property))
                  (<any>this)[property] = (<any>data)[property];
          }
      }
  }

  init(_data?: any) {
      if (_data) {
          this.token = _data["token"];
          this.user = _data["user"] ? UserDto.fromJS(_data["user"]) : <any>undefined;
          this.success = _data["success"];
          this.message = _data["message"];
      }
  }

  static fromJS(data: any): AuthenticationResponse {
      data = typeof data === 'object' ? data : {};
      let result = new AuthenticationResponse();
      result.init(data);
      return result;
  }

  toJSON(data?: any) {
      data = typeof data === 'object' ? data : {};
      data["token"] = this.token;
      data["user"] = this.user ? this.user.toJSON() : <any>undefined;
      data["success"] = this.success;
      data["message"] = this.message;
      return data; 
  }
}

export class AuthenticationRequest implements IAuthenticationRequest {
  username?: string | undefined;
  password?: string | undefined;

  constructor(data?: IAuthenticationRequest) {
      if (data) {
          for (var property in data) {
              if (data.hasOwnProperty(property))
                  (<any>this)[property] = (<any>data)[property];
          }
      }
  }

  init(_data?: any) {
      if (_data) {
          this.username = _data["username"];
          this.password = _data["password"];
      }
  }

  static fromJS(data: any): AuthenticationRequest {
      data = typeof data === 'object' ? data : {};
      let result = new AuthenticationRequest();
      result.init(data);
      return result;
  }

  toJSON(data?: any) {
      data = typeof data === 'object' ? data : {};
      data["username"] = this.username;
      data["password"] = this.password;
      return data; 
  }
}

export interface IAuthenticationRequest {
  username?: string | undefined;
  password?: string | undefined;
}

export class ApiException extends Error {
  message: string;
  status: number;
  response: string;
  headers: { [key: string]: any; };
  result: any;

  constructor(message: string, status: number, response: string, headers: { [key: string]: any; }, result: any) {
      super();

      this.message = message;
      this.status = status;
      this.response = response;
      this.headers = headers;
      this.result = result;
  }

  protected isApiException = true;

  static isApiException(obj: any): obj is ApiException {
      return obj.isApiException === true;
  }
}

export interface AuthResult {
  loggedIn: boolean;
  user?: UserDto;
  error?: any;
}

function throwException(message: string, status: number, response: string, headers: { [key: string]: any; }, result?: any): Observable<any> {
  return _observableThrow(new ApiException(message, status, response, headers, result));
}

function blobToText(blob: any): Observable<string> {
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

@Injectable()
export class AuthService {
  authChanged = new Subject<boolean>();
  loggedIn: boolean = false;
  currentUser?: UserDto;

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
    @Inject(RN_AUTH_CONFIG)
    private config: RnAuthConfig
  ) {
    this.baseUrl = this.config.apiBaseUrl;
    this._logger = this._loggerFactory.getInstance('AuthService');
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
    this._storage.setItem(this.config.storageTokenName, token);
  }

  public getAuthToken = () => {
    this._logger.traceMethod('getAuthToken');

    if(this._currentToken.length < 1)
      return null;
    
    return this._currentToken;
  }

  getCurrentUserId = () => {
    return this.currentUser?.userId ?? 0;
  }


  // internal
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
      if(this._storage.hasItem(this.config.storageUserInfo)) {
        this._storage.removeItem(this.config.storageUserInfo);
      }
      return;
    }
    
    this.currentUser = response.user;
    this._storage.setItem(this.config.storageUserInfo, this.currentUser);
  }

  private _removeCurrentUser = () => {
    this._logger.traceMethod('_removeCurrentUser');
    this.currentUser = undefined;

    if(this._storage.hasItem(this.config.storageUserInfo)) {
      this._storage.removeItem(this.config.storageUserInfo);
      this._logger.trace2('_removeCurrentUser', 'Removed current user info');
    }
  }

  private _setLoggedInSate = (loggedIn: boolean, token?: string) => {
    this._logger.traceMethod('_setLoggedInSate', loggedIn ? 'LOGGED_IN' : 'LOGGED_OUT');

    this.loggedIn = loggedIn;

    if(loggedIn === false) {
      this._currentToken = '';
      this._removeCurrentUser();
      
      if(this._storage.hasItem(this.config.storageTokenName)) {
        this._storage.removeItem(this.config.storageTokenName);
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
    if(this._storage.hasItem(this.config.storageUserInfo)) {
      this._logger.trace('loading stored user info');
      this.currentUser = this._storage.getItem<UserDto>(this.config.storageUserInfo);
    }
    
    if(this._storage.hasItem(this.config.storageTokenName)) {
      // TODO: [VALIDATION] Add some form of token validation here
      this._logger.trace('found stored session token');
      this._setLoggedInSate(true, this._storage.getItem<string>(this.config.storageTokenName));
    }
  }
}
