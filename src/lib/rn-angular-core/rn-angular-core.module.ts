import { CommonModule } from '@angular/common';
import { HttpClientModule } from "@angular/common/http";
import { ModuleWithProviders, NgModule } from '@angular/core';
import { DefaultNoComponentGlobalConfig, GlobalConfig, RNCORE_API_BASE_URL } from './rn-angular-core.config';
import { AuthService } from './services/auth.service';
import { StorageService } from './services/storage.service';

export const DefaultGlobalConfig: GlobalConfig = {
  ...DefaultNoComponentGlobalConfig
};

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ],
  declarations: [],
  exports: [],
  entryComponents: [],
  providers: [
    StorageService,
    AuthService
  ]
})
export class RnAngularCoreModule {
  static forRoot(config: Partial<GlobalConfig> = {}): ModuleWithProviders<RnAngularCoreModule> {
    return {
      ngModule: RnAngularCoreModule,
      providers: [
        { provide: RNCORE_API_BASE_URL, useValue: '' }
      ],
    };
  }
}
