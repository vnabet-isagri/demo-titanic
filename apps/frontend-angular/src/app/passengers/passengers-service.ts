import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {PassengersFilter} from './passengers-filter';
import {Result} from '../shared/result';
import {PassengerDTO} from './passenger-dto';
import {map, Observable} from 'rxjs';
import convertPassenger from './passenger-converter';
import {Passenger} from './passenger';

@Injectable({
  providedIn: 'root'
})
export class PassengersService {
  readonly #http = inject(HttpClient);

  getAll(filter?: Partial<PassengersFilter>):Observable<Result<Passenger>> {
    const params = this.#getParams(filter);
    return this.#http.get<Result<PassengerDTO>>('http://localhost:3000/api/passengers', {params})
      .pipe(map(result => ({
        data: result.data.map(dto => convertPassenger(dto)),
        page: result.page,
        limit: result.limit,
        total: result.total
      })))
  }

  #getParams(filter?:Partial<PassengersFilter>) {
    let params = new HttpParams();
    if(filter) {
      Object.entries(filter).forEach(([key, value]) => {
        let param: string;
        if(typeof value === 'boolean') {
          param = value ? '1' : '0';
        } else {
          param = value.toString();
        }
        params = params.set(key, param);
      });
    }

    return params;
  }
}
