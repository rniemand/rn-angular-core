import { LoggerSeverity } from "./LoggerSeverity";

export interface LoggerConfiguration {
  enabled: boolean;
  minSeverity: LoggerSeverity;
  enableMethodTracing: boolean;
  skipInitMethodTracing: boolean;

  disabledInstances: string[];
}
