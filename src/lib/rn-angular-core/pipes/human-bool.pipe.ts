import { Pipe, PipeTransform } from '@angular/core';
import { PipeArgHelper } from './PipeArgHelper';

@Pipe({
  name: 'humanBool'
})
export class HumanBoolPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    const argsHelper = new PipeArgHelper(...args);
    const boolValue = this._valueToBool(value);
    const argCount = argsHelper.argsCount();

    let valueTrue = 'true';
    let valueFalse = 'false';

    if(argCount > 0 && argsHelper.isString(0)) {
      let arg1 = argsHelper.getString(0);
      valueTrue = arg1;
      valueFalse = argCount >= 2 ? argsHelper.getString(1) : '';
    }

    return boolValue ? valueTrue : valueFalse;
  }

  private _valueToBool = (value: unknown): boolean => {
    const valueType = typeof value;

    if(valueType === 'boolean') {
      return value as boolean;
    }

    console.error(`Unsupported value type "${valueType}" - falling back to FALSE.`);
    return false;
  }

}
