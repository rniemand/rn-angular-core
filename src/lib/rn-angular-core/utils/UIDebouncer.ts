export class UIDebouncer {
  private _timeout: any = undefined;

  constructor(
    private deboundeTimeMs: number,
    private callbackFn: Function
  ) { }

  // public methods
  public debounce = () => {
    this._clearTimeout();

    this._timeout = setTimeout(
      this._fireCallback,
      this.deboundeTimeMs
    );
  }

  public dispose = () => {
    this._clearTimeout();
  }


  // internal methods
  private _fireCallback = () => {
    this._clearTimeout();
    this.callbackFn();
  }

  private _clearTimeout = () => {
    if(!this._timeout) { return; }
    clearTimeout(this._timeout);
    this._timeout = undefined;
  }
}
