import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Constants } from '../shared/Constants';

@Injectable({
  providedIn: 'root'
})
export class ConverterService {

  constructor(private http: HttpClient) { }

  /**
  * Get all series by from Bank of Canada
  * @returns  An Observable of the response body as a JSON object
  */
  getSeries(): Observable<any> {
    return this.http.get(Constants.GET_SERIES);
  }

  /**
  * Get all observation for specific date and series from Bank of Canada
  * @param date
  * @param series
  * @returns  An Observable of the response body as a JSON object
  */
  getobservationBasedOnDate(date: string, series: string): Observable<any> {
    const params = new HttpParams()
      .set('start_date', date)
      .set('end_date', date);;
    return this.http.get(`${Constants.GET_OBSERVATION}${series}`, { params });
  }

}
