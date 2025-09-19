import {ChangeDetectionStrategy, Component, inject,} from '@angular/core';
import {PassengersFilter} from './passengers/passengers-filter';
import {PassengersService} from './passengers/passengers-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {
  readonly #passengersService = inject(PassengersService);

  constructor() {
    const filter:Partial<PassengersFilter> = {
      survived: false,
      name: 'john',
      orderby: 'name',
      order: 'DESC'
    }

    this.#passengersService.getAll(filter).subscribe(data => console.log(data))

  }

}
