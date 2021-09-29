import { MatDialogConfig } from "@angular/material/dialog";
import { LoggerConfiguration } from "../logger/_logger";
import { RnAuthConfig } from "./RnAuthConfig";

export interface RnAppConfig {
  dialogDefaults: MatDialogConfig,
  logger: LoggerConfiguration,
  auth: RnAuthConfig,
  apiBaseUrl: string,
  appName: string,
  appVersion: string,
  production: boolean
}