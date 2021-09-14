import { CommonModule } from '@angular/common';
import { Injectable, ModuleWithProviders, NgModule } from '@angular/core';
import { DefaultNoComponentGlobalConfig, GlobalConfig, RN_ANGULAR_CORE_CONFIG } from './rn-angular-core.config';

export const DefaultGlobalConfig: GlobalConfig = {
  ...DefaultNoComponentGlobalConfig
};

@Injectable()
export class StorageService {
  setItem = <T>(key: string, value: T): void => {
    localStorage.setItem(key, JSON.stringify(value));
  }

  getItem = <TOut>(key: string): TOut => {
    let rawValue = localStorage.getItem(key);
    return JSON.parse(rawValue ?? '') as TOut;
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  hasItem(key: string): boolean {
    return localStorage.hasOwnProperty(key);
  }
}

@NgModule({
  imports: [CommonModule],
  declarations: [],
  exports: [],
  entryComponents: [],
  providers: [StorageService]
})
export class RnAngularCoreModule {
  static forRoot(config: Partial<GlobalConfig> = {}): ModuleWithProviders<RnAngularCoreModule> {
    return {
      ngModule: RnAngularCoreModule,
      providers: [
        {
          provide: RN_ANGULAR_CORE_CONFIG,
          useValue: {
            default: DefaultGlobalConfig,
            config,
          },
        },
      ],
    };
  }
}
