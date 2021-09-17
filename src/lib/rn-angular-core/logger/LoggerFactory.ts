import { Inject, Injectable } from "@angular/core";

// RnAngularCore
import { RnAppConfig, RN_APP_CONFIG } from "../configuration/configuration";
import { LoggerConfiguration, LoggerInstance, LoggerSeverity } from "./logger";

@Injectable()
export class LoggerFactory {
  config: LoggerConfiguration;
  
  constructor(
    @Inject(RN_APP_CONFIG)
    private appConfig: RnAppConfig
  ) {
    this.config = this.appConfig.logger;
  }

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