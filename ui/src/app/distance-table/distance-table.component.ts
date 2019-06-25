import {Component, OnInit} from '@angular/core';
import {RowerData} from "../rower";
import {PmDataService} from "../pm-data.service";

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
    this.pmDataService.onDistanceChange(this.totalDistance);
  }
}
