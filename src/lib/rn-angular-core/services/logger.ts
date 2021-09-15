import { Inject, Injectable, Optional, SimpleChanges } from "@angular/core";
import { RN_LOGGER_CONFIG } from "../rn-angular-core.config";

export enum LoggerSeverity {
  Trace = 1,
  Debug = 2,
  Information = 3,
  Warning = 4,
  Error = 5
}

export interface LoggerConfiguration {
  enabled: boolean;
  minSeverity: LoggerSeverity;
  enableMethodTracing: boolean;
  skipInitMethodTracing: boolean;

  disabledInstances: string[];
}

export class LoggerInstance {
  enabled: boolean = true;

  constructor(
    private _loggerFactory: LoggerFactory,
    public instance: string
  ) {
    this.enabled = this._loggerFactory.config.disabledInstances.indexOf(this.instance) === -1;
    this.traceMethod('constructor');
  }


  // public methods
  public trace = (message: string, ...args: any[]) => {
    if(!this._canLog()) { return; }
    this._loggerFactory.log(LoggerSeverity.Trace, `(${this.instance}) ${message}`, ...args);
  }

  public trace2 = (method: string, message: string, ...args: any[]) => {
    if(!this._canLog()) { return; }
    this._loggerFactory.log(LoggerSeverity.Trace, `(${this.instance}.${method}) ${message}`, ...args);
  }

  public debug = (message: string, ...args: any[]) => {
    if(!this._canLog()) { return; }
    this._loggerFactory.log(LoggerSeverity.Debug, `(${this.instance}) ${message}`, ...args);
  }

  public info = (message: string, ...args: any[]) => {
    if(!this._canLog()) { return; }
    this._loggerFactory.log(LoggerSeverity.Information, `(${this.instance}) ${message}`, ...args);
  }

  public warn = (message: string, ...args: any[]) => {
    if(!this._canLog()) { return; }
    this._loggerFactory.log(LoggerSeverity.Warning, `(${this.instance}) ${message}`, ...args);
  }

  public error = (message: string, ...args: any[]) => {
    if(!this._canLog()) { return; }
    this._loggerFactory.log(LoggerSeverity.Error, `(${this.instance}) ${message}`, ...args);
  }

  public traceMethod = (method: string, ...args: any[]) => {
    if(!this.enabled || !this._loggerFactory.config.enableMethodTracing) { return; }
    let append = args?.length > 0 ? ' ::' : '';
    this._loggerFactory.traceMethod(`(${this.instance}) -> ${method}()${append}`, ...args);
  }

  public traceInit = (...args: any[]) => {
    this.traceMethod('ngOnInit', ...args);
  }

  public traceAfterInit = (...args: any[]) => {
    this.traceMethod('ngAfterViewInit', ...args);
  }

  public traceDestroy = (...args: any[]) => {
    this.traceMethod('ngOnDestroy', ...args);
  }

  public traceOnChanges = (changes?: SimpleChanges) => {
    if(!this.enabled) {
      return;
    }

    const hasChanges = (changes ?? undefined) !== undefined;
    const props: string[] = [];

    if(hasChanges) {
      props.push(...Object.getOwnPropertyNames(changes));
    }

    this.traceMethod('ngOnChanges', JSON.stringify(props));
  }

  public traceWriteValue = (obj: any) => {
    if(!this.enabled) {
      return;
    }

    const objType = typeof obj;

    if(objType === 'undefined') {
      this.traceMethod('writeValue', '(undefined)');  
    }
    else if(objType === 'object') {
      if(obj === null) {
        this.traceMethod('writeValue', '(null)'); 
      } else {
        this.traceMethod('writeValue', `(${objType})`, obj); 
      }
    }
    else {
      this.traceMethod('writeValue', `(${objType})`, obj);  
    }
  }

  public traceRegisterOnChange = (...args: any[]) => {
    this.traceMethod('registerOnChange', ...args);
  }


  // internal methods
  private _canLog = () => {
    return this.enabled;
  }
}

@Injectable()
export class LoggerFactory {
  
  constructor(
    @Inject(RN_LOGGER_CONFIG)
    public config: LoggerConfiguration
  ) { }

  // public methods
  getInstance = (instance: string) => {
    return new LoggerInstance(this, instance);
  }

  log = (severity: LoggerSeverity, message: string, ...args: any[]) => {
    if(!this._canLog(severity)) { return; }

    switch(severity) {
      case LoggerSeverity.Trace: console.log(`[TRACE] ${message}`, ...args); break;
      case LoggerSeverity.Debug: console.log(`[DEBUG] ${message}`, ...args); break;
      case LoggerSeverity.Information: console.info(`[INFO] ${message}`, ...args); break;
      case LoggerSeverity.Warning: console.warn(`[WARN] ${message}`, ...args); break;
      case LoggerSeverity.Error: console.error(`[ERROR] ${message}`, ...args); break;
    }
  }

  traceMethod = (message: string, ...args: any[]) => {
    if(this.config.skipInitMethodTracing) { return; }
    console.log(`[METHOD] ${message}`, ...args);
  }

  // private methods
  private _canLog = (severity: LoggerSeverity) => {
    return severity >= this.config.minSeverity;
  }
}
