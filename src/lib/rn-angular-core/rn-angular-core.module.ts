import { CommonModule } from '@angular/common';
import { HttpClientModule } from "@angular/common/http";
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ValidationErrorDialog } from './dialogs/validation-error/validation-error.dialog';
import { RnCoreMaterialModule } from './material.module';
import { DefaultNoComponentGlobalConfig, GlobalConfig, RNCORE_API_BASE_URL, RN_DIALOG_DEFAULTS } from './rn-angular-core.config';
import { AuthService } from './services/auth.service';
import { LoggerFactory } from './services/logger';
import { StorageService } from './services/storage.service';
import { UiService } from './services/ui.service';

export const DefaultGlobalConfig: GlobalConfig = {
  ...DefaultNoComponentGlobalConfig
};

const defaultDialogOptions = {
  width: '80%',
  minWidth: '350px',
  maxWidth: '800px',
  // height: '80%',
  // minHeight: '200px',
  // maxHeight: '550px',
  hasBackdrop: true
};

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    RnCoreMaterialModule,

    HttpClientModule,
  ],
  declarations: [
    ValidationErrorDialog
  ],
  exports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    RnCoreMaterialModule,
  ],
  entryComponents: [],
  providers: [
    StorageService,
    AuthService,
    UiService,
    LoggerFactory
  ]
})
export class RnAngularCoreModule {
  static forRoot(): ModuleWithProviders<RnAngularCoreModule> {
    return {
      ngModule: RnAngularCoreModule,
      providers: [
        { provide: RNCORE_API_BASE_URL, useValue: '' },
        { provide: RN_DIALOG_DEFAULTS, useValue: defaultDialogOptions }
      ],
    };
  }
}
