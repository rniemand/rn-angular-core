import { UserDto } from "../_models";

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
