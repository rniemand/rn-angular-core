export interface IAuthenticationRequest {
  username?: string | undefined;
  password?: string | undefined;
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