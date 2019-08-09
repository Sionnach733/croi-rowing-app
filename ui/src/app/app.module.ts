import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { DistanceTableComponent } from './distance-table/distance-table.component';
import { MyMapComponent } from './my-map/my-map.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FlexLayoutModule } from '@angular/flex-layout';

import { DecimalPipe } from '@angular/common';

import { AgmCoreModule } from '@agm/core';
import { config } from './config';
import { MatTableModule, MatProgressBarModule } from '@angular/material';
import { ProgressBarModule } from 'angular-progress-bar';

import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [AppComponent, DistanceTableComponent, MyMapComponent],
  imports: [
    BrowserModule,
    AgmCoreModule.forRoot({
      apiKey: config.MAPS_KEY
    }),
    MatTableModule,
    MatProgressBarModule,
    HttpClientModule,
    ProgressBarModule,
    MatToolbarModule,
    FlexLayoutModule
  ],
  providers: [DecimalPipe],
  bootstrap: [AppComponent]
})
export class AppModule {}
