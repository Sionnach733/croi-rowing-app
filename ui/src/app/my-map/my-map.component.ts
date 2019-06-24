import { Component, OnInit } from '@angular/core';
import { along, lineString} from '@turf/turf'
import { getGeoJsonData } from './shannon'

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
      fillColor: feature.getProperty('color'),
      strokeWeight: 2
    });
  }

  constructor() { }

  ngOnInit() {
    const line = lineString(getGeoJsonData().features[0].geometry.coordinates);
    let foo = along(line, 250);
    console.log(foo);
    this.currentLat = foo.geometry.coordinates[1];
    this.currentLong = foo.geometry.coordinates[0];
    this.geoJsonObject = getGeoJsonData();
  }
}
