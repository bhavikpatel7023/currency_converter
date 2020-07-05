import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Constants} from '../shared/Constants';

@Injectable({
  providedIn: 'root'
})
export class ConverterService {

  constructor(private http: HttpClient) { }


  getFile(date: string): Observable<any> {
    const params = new HttpParams()
      .set('start_date', date);
    return this.http.get(Constants.GET_FILE, {params});
  }

}
