import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RnAngularCoreModule } from 'src/lib/public_api';
import { RNCORE_API_BASE_URL, RN_LOGGER_CONFIG } from 'src/lib/rn-angular-core/rn-angular-core.config';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './views/home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoggerConfiguration, LoggerSeverity } from 'src/lib/rn-angular-core/services/logger';

const defaultLoggerConfig: LoggerConfiguration = {
  enabled: true,
  minSeverity: LoggerSeverity.Trace,
  enableMethodTracing: true,
  skipInitMethodTracing: false,
  disabledInstances: []
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RnAngularCoreModule,
    BrowserAnimationsModule
  ],
  providers: [
    { provide: RNCORE_API_BASE_URL, useValue: 'http://localhost:61623' },
    { provide: RN_LOGGER_CONFIG, useValue: defaultLoggerConfig }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
