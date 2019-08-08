import { Component, OnInit } from '@angular/core';
import { along, lineString} from '@turf/turf'
import { getGeoJsonData } from './shannon'
import {PmDataService} from "../pm-data.service";

@Component({
  selector: 'app-my-map',
  templateUrl: './my-map.component.html',
  styleUrls: ['./my-map.component.css']
})
export class MyMapComponent implements OnInit {


  // 53.424266, -7.921739
  latitude = 53.424266;
  longitude = -7.921739;
  mapType = 'terrain';
  currentLat = 53;
  currentLong = 7;
  geoJsonObject = {};

  styleFunc(feature) {
    return ({
      clickable: false,
      strokeColor: feature.getProperty('color'),
      strokeWeight: 2
    });
  }

  constructor(private pmDataService: PmDataService) { }

  ngOnInit() {
    this.geoJsonObject = getGeoJsonData();
    const line = lineString(getGeoJsonData().features[0].geometry.coordinates);
    this.pmDataService.currentDistance.subscribe(distance => {
      const kilometres = this.getKilometresAlongShannon(distance.value/1000);
      console.log('distance changed, updating marker...');
      let marker = along(line, kilometres);
      this.currentLat = marker.geometry.coordinates[1];
      this.currentLong = marker.geometry.coordinates[0];
    });
  }

  getKilometresAlongShannon(distance){
    if (distance > 360 && distance < 720){
      return distance - 360;
    } else if(distance >= 720){
      return distance - 720;
    }else{
      return distance;
    }
  }
}
