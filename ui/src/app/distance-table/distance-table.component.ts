import { Component } from '@angular/core';

export interface RowerData {
  rower: number;
  distance: number;
}

const ROWER_DATA: RowerData[] = [
  {rower: 1, distance: 50},
  {rower: 2, distance: 100},
  {rower: 3, distance: 150},
  {rower: 4, distance: 200},
  {rower: 5, distance: 250}
];

@Component({
  selector: 'app-distance-table',
  templateUrl: './distance-table.component.html',
  styleUrls: ['./distance-table.component.css']
})
export class DistanceTableComponent {

  displayedColumns: string[] = ['rower', 'distance'];
  dataSource = ROWER_DATA;

  constructor() { }

  update(){

  }


}
