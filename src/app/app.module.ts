import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RnAngularCoreModule } from 'src/lib/public_api';

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
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
