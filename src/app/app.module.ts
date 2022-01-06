import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Test App
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './views/home/home.component';
import { LoginComponent } from './views/login/login.component';

// RnAngularCore
import { AppendTokenInterceptor, ErrorInterceptor, RnAngularCoreModule, RnAppConfig, RnCoreComponent, RnCoreService, RnDefaultAppConfig, RN_APP_CONFIG, SessionTokenInterceptor, ShortcutsService } from 'src/lib/public_api';
import { HTTP_INTERCEPTORS } from '@angular/common/http';


const appConfig: RnAppConfig = {
  ...RnDefaultAppConfig,
  apiBaseUrl: '',
  appName: 'Demo App',
  appVersion: '1.0.1',
  auth: {
    ...RnDefaultAppConfig.auth,
    storageTokenName: 'rnCore.userToken',
    storageUserInfo: 'rnCore.userInfo'
  },
  logger: {
    ...RnDefaultAppConfig.logger,
    disabledInstances: [
      RnCoreComponent.Breadcrumbs,
      RnCoreComponent.Header,
      RnCoreComponent.Shortcuts,
      RnCoreComponent.SideNav,

      RnCoreService.Auth,
      RnCoreService.Shortcuts,
      RnCoreService.Storage,
      RnCoreService.UI
    ]
  }
};

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    RnAngularCoreModule,
  ],
  providers: [
    { provide: RN_APP_CONFIG, useValue: appConfig },
    { provide: HTTP_INTERCEPTORS, useClass: AppendTokenInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: SessionTokenInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(
    private _shortcuts: ShortcutsService
  ) {
    this._shortcuts.addHomeShortcut({
      icon: 'home',
      title: 'Testing',
      actions: [
        {
          title: 'Edit',
          routerLink: ['']
        }
      ]
    });
  }
}
