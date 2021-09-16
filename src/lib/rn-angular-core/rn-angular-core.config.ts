import { InjectionToken } from '@angular/core';
import { MatDialogConfig } from '@angular/material/dialog';
import { LoggerConfiguration } from './logger';

export const RNCORE_API_BASE_URL = new InjectionToken<string>('RNCORE_API_BASE_URL');
export const RN_DIALOG_DEFAULTS = new InjectionToken<MatDialogConfig>('RN_DIALOG_DEFAULTS');
export const RN_LOGGER_CONFIG = new InjectionToken<LoggerConfiguration>('RN_LOGGER_CONFIG');
