// Modules
import { CommonModule } from '@angular/common';
import { HttpClientModule } from "@angular/common/http";
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RnCoreMaterialModule } from './material.module';

// Public APIs
import { BreadcrumbsComponent, HeaderComponent, SideNavComponent } from './components/components';
import { AuthService, ShortcutsService, StorageService, UiService } from './services/services';
import { ValidationErrorDialog } from './dialogs/dialogs';
import { LoggerFactory } from './logger/logger';

// Configuration
import { RnDefaultAppConfig, RN_APP_CONFIG } from './configuration/rn-angular-core.config';
import { RouterModule } from '@angular/router';


@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    RnCoreMaterialModule,
    HttpClientModule,
    RouterModule,
  ],
  declarations: [
    // Dialogs
    ValidationErrorDialog,

    // Components
    BreadcrumbsComponent,
    HeaderComponent,
    SideNavComponent,
  ],
  exports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    RnCoreMaterialModule,
    HttpClientModule,
    RouterModule,

    // Components
    BreadcrumbsComponent,
    HeaderComponent,
    SideNavComponent,
  ],
  entryComponents: [],
  providers: [
    StorageService,
    AuthService,
    UiService,
    LoggerFactory,
    ShortcutsService,
  ]
})
export class RnAngularCoreModule {
  static forRoot(): ModuleWithProviders<RnAngularCoreModule> {
    return {
      ngModule: RnAngularCoreModule,
      providers: [
        { provide: RN_APP_CONFIG, useValue: RnDefaultAppConfig }
      ],
    };
  }
}
