import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Injectable } from '@angular/core';
import {RowerData} from "./rower";

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const rowers: RowerData[] = [
      { rower: 1, distance: 10 },
      { rower: 2, distance: 200 },
      { rower: 3, distance: 65 },
      { rower: 4, distance: 12 },
      { rower: 5, distance: 3 }
    ];
    return {rowers};
  }
}
