import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {RowerData} from "./rower";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PmDataService {
  private rowersUrl = 'api/rowers';  // URL to web api
  constructor(private http: HttpClient) { }

  /** GET heroes from the server */
  getRowers (): Observable<RowerData[]> {
    return this.http.get<RowerData[]>(this.rowersUrl)
  }
}


