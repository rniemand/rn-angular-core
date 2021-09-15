import { InjectionToken } from '@angular/core';
import { LoggerConfiguration } from './services/logger';

export interface IndividualConfig { }

export interface GlobalConfig extends IndividualConfig { }

export const DefaultNoComponentGlobalConfig: GlobalConfig = {
  maxOpened: 0
};

export interface RnAngularCoreToken {
  default: GlobalConfig;
  config: Partial<GlobalConfig>;
}

export const RN_ANGULAR_CORE_CONFIG = new InjectionToken<RnAngularCoreToken>('RnAngularCoreConfig');
export const RNCORE_API_BASE_URL = new InjectionToken<string>('RNCORE_API_BASE_URL');
export const RN_DIALOG_DEFAULTS = new InjectionToken<string>('RN_DIALOG_DEFAULTS');
export const RN_LOGGER_CONFIG = new InjectionToken<LoggerConfiguration>('RN_LOGGER_CONFIG');
