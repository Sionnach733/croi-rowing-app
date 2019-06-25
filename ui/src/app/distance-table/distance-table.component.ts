import {Component, OnInit} from '@angular/core';
import {RowerData} from "../rower";
import {PmDataService} from "../pm-data.service";

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
export class DistanceTableComponent implements OnInit{

  displayedColumns: string[] = ['rower', 'distance'];
  dataSource;
  totalDistance;
  percentage;

  constructor(private pmDataService: PmDataService) { }

  ngOnInit() {
    setInterval(() => {
      this.pmDataService.getRowers().subscribe(rowers => {
          this.dataSource = rowers;
          this.calculateTotalDistance(rowers);
      });
    }, 10000);
  }

  calculateTotalDistance(rowers:RowerData[]){
    let sum = 0;
    for(let rower of rowers){
      sum += rower.distance;
    }
    this.totalDistance = sum;
    this.percentage = Math.floor((sum/1000000)*100);
  }


}
