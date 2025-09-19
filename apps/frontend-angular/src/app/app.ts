import {ChangeDetectionStrategy, Component, inject,} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {
  readonly #http = inject(HttpClient);

  constructor() {

    const queryParams = {
      name: 'john',
      page: 1,
      limit: 10
    };
    let params = new HttpParams();
    Object.entries(queryParams).forEach(([key, value]) => {
      params = params.set(key, value.toString());
    });
    this.#http.get('http://localhost:3000/api/passengers', {params}).subscribe(res => console.log(res));
  }

}
