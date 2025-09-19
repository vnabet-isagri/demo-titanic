import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {PassengersFilter} from './models/passengers-filter';
import {PassengersService} from './passengers-service';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-passengers',
  imports: [
    AsyncPipe
  ],
  templateUrl: './passengers.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Passengers {
  readonly #passengersService = inject(PassengersService);

  protected filter:Partial<PassengersFilter> = {
    survived: false,
    name: 'john',
    orderby: 'name',
    order: 'DESC',
    page: 1,
    limit: 15
  }
  protected passengers$ = this.#passengersService.getAll(this.filter)
}
