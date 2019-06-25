import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { DistanceTableComponent } from './distance-table/distance-table.component';
import { MyMapComponent } from './my-map/my-map.component';

import { AgmCoreModule } from '@agm/core';
import { config } from './config'
import {MatTableModule, MatProgressBarModule} from '@angular/material';

import {HttpClientModule} from "@angular/common/http";

@NgModule({
  declarations: [
    AppComponent,
    DistanceTableComponent,
    MyMapComponent
  ],
  imports: [
    BrowserModule,
    AgmCoreModule.forRoot({
      apiKey: config.MAPS_KEY
    }),
    MatTableModule,
    MatProgressBarModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
