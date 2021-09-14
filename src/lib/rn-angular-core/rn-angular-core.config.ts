import { InjectionToken } from '@angular/core';

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