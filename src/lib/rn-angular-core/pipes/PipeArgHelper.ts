export class PipeArgHelper {
  private args: any[] = [];

  constructor(...args: unknown[]) {
    this.args = [...args];
  }

  public hasArgs = () => {
    return this.args.length > 0;
  }

  public argsCount = () => {
    return this.args.length;
  }

  public argExists = (index: number) => {
    if(!this.hasArgs()) { return false; }
    if(this.argsCount() < index) { return false; }
    return true;
  }

  public isString = (index: number) => {
    if(!this.argExists(index)) { return false; }
    return typeof this.args[index] === 'string';
  }

  public getString = (index: number) => {
    if(!this.argExists(index)) { return undefined; }
    if(this.isString(index)) { return this.args[index]; }
    return `${this.args[index]}`;
  }
}
