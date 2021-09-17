import { InjectionToken } from '@angular/core';
import { MatDialogConfig } from '@angular/material/dialog';
import { LoggerConfiguration } from './logger';

export interface RnAuthConfig {
  apiBaseUrl: string,
  storageTokenName: string,
  storageUserInfo: string
}

export const RN_DIALOG_DEFAULTS = new InjectionToken<MatDialogConfig>('RN_DIALOG_DEFAULTS');
export const RN_LOGGER_CONFIG = new InjectionToken<LoggerConfiguration>('RN_LOGGER_CONFIG');
export const RN_AUTH_CONFIG = new InjectionToken<RnAuthConfig>('RN_AUTH_CONFIG');