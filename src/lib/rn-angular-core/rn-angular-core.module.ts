import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { DefaultNoComponentGlobalConfig, GlobalConfig, RN_ANGULAR_CORE_CONFIG } from './rn-angular-core.config';

export const DefaultGlobalConfig: GlobalConfig = {
  ...DefaultNoComponentGlobalConfig
};

@NgModule({
  imports: [CommonModule],
  declarations: [],
  exports: [],
  entryComponents: [],
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
