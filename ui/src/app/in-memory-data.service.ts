import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Injectable } from '@angular/core';
import {RowerData} from "./rower";

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const rowers: RowerData[] = [
      { rower: 1, distance: 100 },
      { rower: 2, distance: 2000 },
      { rower: 3, distance: 6500 },
      { rower: 4, distance: 120000 },
      { rower: 5, distance: 100000 }
    ];
    return {rowers};
  }
}
