import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Test App
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './views/home/home.component';
import { LoginComponent } from './views/login/login.component';

// RnAngularCore
import { RnAngularCoreModule, RnAppConfig, RnDefaultAppConfig, RN_APP_CONFIG } from 'src/lib/public_api';


const appConfig: RnAppConfig = {
  ...RnDefaultAppConfig,
  apiBaseUrl: 'http://localhost:61623',
  appName: 'Demo App',
  appVersion: '1.0.1',
  auth: {
    ...RnDefaultAppConfig.auth,
    storageTokenName: 'rnCore.userToken',
    storageUserInfo: 'rnCore.userInfo'
  },
  logger: {
    ...RnDefaultAppConfig.logger
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
    { provide: RN_APP_CONFIG, useValue: appConfig }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
