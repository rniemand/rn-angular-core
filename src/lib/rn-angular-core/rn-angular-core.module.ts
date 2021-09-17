// Modules
import { CommonModule } from '@angular/common';
import { HttpClientModule } from "@angular/common/http";
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RnCoreMaterialModule } from './material.module';

// Dialogs
import { ValidationErrorDialog } from './dialogs/validation-error/validation-error.dialog';

// Logger
import { LoggerFactory } from './logger';

// Services
import { AuthService } from './services/auth.service';
import { StorageService } from './services/storage.service';
import { UiService } from './services/ui.service';

// Configuration
import { RnAuthConfig, RN_AUTH_CONFIG, RN_DIALOG_DEFAULTS } from './rn-angular-core.config';
import { MatDialogConfig } from '@angular/material/dialog';

const dialogDefaults: MatDialogConfig= {
  width: '80%',
  minWidth: '350px',
  maxWidth: '800px',
  hasBackdrop: true
};

const defaultAuthConfig: RnAuthConfig = {
  apiBaseUrl: '',
  storageTokenName: 'rnCore.userToken',
  storageUserInfo: 'rnCore.userInfo'
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
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    RnCoreMaterialModule,
    HttpClientModule,
  ],
  entryComponents: [],
  providers: [
    StorageService,
    AuthService,
    UiService,
    LoggerFactory,
  ]
})
export class RnAngularCoreModule {
  static forRoot(): ModuleWithProviders<RnAngularCoreModule> {
    return {
      ngModule: RnAngularCoreModule,
      providers: [
        { provide: RN_DIALOG_DEFAULTS, useValue: dialogDefaults },
        { provide: RN_AUTH_CONFIG, useValue: defaultAuthConfig }
      ],
    };
  }
}
