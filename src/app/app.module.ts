import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LoggerConfiguration, LoggerSeverity, RnAngularCoreModule } from 'src/lib/public_api';
import { RnAuthConfig, RN_AUTH_CONFIG, RN_LOGGER_CONFIG } from 'src/lib/rn-angular-core/rn-angular-core.config';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './views/home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './views/login/login.component';

const defaultLoggerConfig: LoggerConfiguration = {
  enabled: true,
  minSeverity: LoggerSeverity.Trace,
  enableMethodTracing: true,
  skipInitMethodTracing: false,
  disabledInstances: []
};

const defaultAuthConfig: RnAuthConfig = {
  apiBaseUrl: 'http://localhost:61623',
  storageTokenName: 'rnCore.userToken',
  storageUserInfo: 'rnCore.userInfo'
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
    { provide: RN_AUTH_CONFIG, useValue: defaultAuthConfig },
    { provide: RN_LOGGER_CONFIG, useValue: defaultLoggerConfig }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
