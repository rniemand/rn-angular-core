// Modules
import { CommonModule } from '@angular/common';
import { HttpClientModule } from "@angular/common/http";
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RnCoreMaterialModule } from './material.module';
import { RouterModule } from '@angular/router';

// Public APIs
import { BreadcrumbsComponent, HeaderComponent, ShortcutsComponent, SideNavComponent } from './components/components';
import { AuthService, ShortcutsService, StorageService, UiService } from './services/services';
import { ValidationErrorDialog } from './dialogs/dialogs';
import { LoggerFactory } from './logger/logger';
import { HumanBoolPipe } from './pipes/pipes';

// Configuration
import { RnDefaultAppConfig, RN_APP_CONFIG } from './configuration/rn-angular-core.config';


@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    RnCoreMaterialModule,
    HttpClientModule,
    FlexLayoutModule,
    RouterModule,
  ],
  declarations: [
    // Dialogs
    ValidationErrorDialog,

    // Components
    BreadcrumbsComponent,
    HeaderComponent,
    SideNavComponent,
    ShortcutsComponent,

    // Pipes
    HumanBoolPipe,
  ],
  exports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    RnCoreMaterialModule,
    HttpClientModule,
    FlexLayoutModule,
    RouterModule,

    // Components
    BreadcrumbsComponent,
    HeaderComponent,
    SideNavComponent,
    ShortcutsComponent,

    // Pipes
    HumanBoolPipe,
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
