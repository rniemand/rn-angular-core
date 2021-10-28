export interface IUserDto {
  userId?: number;
  lastSeen?: Date | undefined;
  firstName?: string | undefined;
  lastName?: string | undefined;
  username?: string | undefined;
  email?: string | undefined;
  attributes?: { [key: string]: any; } | undefined;

  hasAttribute(attribute: string): boolean;
  getIntAttribute(attribute: string, fallback: number): number;
}

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

  getIntAttribute = (attribute: string, fallback: number = 0): number => {
    let rawValue = this._getAttribute(attribute);

    if(rawValue === undefined) {
      return fallback;
    }

    if(typeof rawValue === 'number') {
      return rawValue;
    }

    if(typeof rawValue === 'string') {
      let parsedValue = parseInt(rawValue);
      return isNaN(parsedValue) ? fallback : parsedValue;
    }
    
    return fallback;
  }

  hasAttribute = (attribute: string): boolean => {
    if(!this.attributes) {
      return false;
    }

    return this.attributes.hasOwnProperty(attribute);
  }

  // internal
  private _getAttribute = (attribute: string) => {
    if(!this.attributes) {
      return undefined;
    }

    if(!this.attributes.hasOwnProperty(attribute)) {
      return undefined;
    }

    return this.attributes[attribute];
  }
}
