import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { DistanceTable } from './distance-table/distance-table';

@Component({
  selector: 'app-root',
  imports: [MatToolbarModule, DistanceTable],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
