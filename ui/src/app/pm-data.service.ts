import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {RowerData} from "./rower";
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PmDataService {
  private rowersUrl = 'http://127.0.0.1:5000/rowers';
  private distanceSource = new BehaviorSubject({'value': 0});
  currentDistance = this.distanceSource.asObservable();
  constructor(private http: HttpClient) { }

  /** GET heroes from the server */
  getRowers (): Observable<RowerData[]> {
    return this.http.get<RowerData[]>(this.rowersUrl)
  }

  onDistanceChange(distance: number): void {
    this.distanceSource.next({'value': distance});
  }
}


