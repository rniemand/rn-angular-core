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
import { RNCORE_API_BASE_URL, RN_DIALOG_DEFAULTS } from './rn-angular-core.config';
import { MatDialogConfig } from '@angular/material/dialog';

const dialogDefaults: MatDialogConfig= {
  width: '80%',
  minWidth: '350px',
  maxWidth: '800px',
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
    LoggerFactory,
  ]
})
export class RnAngularCoreModule {
  static forRoot(): ModuleWithProviders<RnAngularCoreModule> {
    return {
      ngModule: RnAngularCoreModule,
      providers: [
        { provide: RNCORE_API_BASE_URL, useValue: '' },
        { provide: RN_DIALOG_DEFAULTS, useValue: dialogDefaults }
      ],
    };
  }
}
