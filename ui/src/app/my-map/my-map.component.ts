import { Component, OnInit } from '@angular/core';

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

  constructor() { }

  ngOnInit() {
  }

}
