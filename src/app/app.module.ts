import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RnAngularCoreModule } from 'src/lib/public_api';
import { RNCORE_API_BASE_URL } from 'src/lib/rn-angular-core/rn-angular-core.config';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './views/home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RnAngularCoreModule
  ],
  providers: [
    { provide: RNCORE_API_BASE_URL, useValue: '' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
