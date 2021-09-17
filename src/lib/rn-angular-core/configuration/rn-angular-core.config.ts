import { InjectionToken } from '@angular/core';
import { MatDialogConfig } from '@angular/material/dialog';
import { LoggerConfiguration, LoggerSeverity } from '../logger/logger';

export interface RnAuthConfig {
  storageTokenName: string,
  storageUserInfo: string
}

export interface RnAppConfig {
  dialogDefaults: MatDialogConfig,
  logger: LoggerConfiguration,
  auth: RnAuthConfig,
  apiBaseUrl: string,
  appName: string,
  appVersion: string
}

export const RnDefaultAppConfig: RnAppConfig = {
  dialogDefaults: {
    width: '80%',
    minWidth: '350px',
    maxWidth: '800px',
    hasBackdrop: true
  },
  logger: {
    enabled: true,
    minSeverity: LoggerSeverity.Trace,
    enableMethodTracing: true,
    skipInitMethodTracing: false,
    disabledInstances: []
  },
  auth: {
    storageTokenName: 'rnCore.userToken',
    storageUserInfo: 'rnCore.userInfo'
  },
  apiBaseUrl: '',
  appName: 'RnAngularCore',
  appVersion: '1.0.0'
};

export const RN_APP_CONFIG = new InjectionToken<RnAppConfig>('RN_APP_CONFIG');
