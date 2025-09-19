import {ChangeDetectionStrategy, Component, inject,} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {
  readonly #http = inject(HttpClient);

  constructor() {
    this.#http.get('http://localhost:3000/api/passengers?name=john&page=1&limit=10').subscribe(res => console.log(res));
  }

}
