import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {PassengersFilter} from './models/passengers-filter';
import {PassengersService} from './passengers-service';
import {AsyncPipe} from '@angular/common';
import {Observable, tap} from 'rxjs';
import {Result} from '../shared/result';
import {Passenger} from './models/passenger';

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
  // Le service des passagers
  readonly #passengersService = inject(PassengersService);

  // Filtre de mes données
  #filter:Partial<PassengersFilter> = {
    page: 1,
    limit: 15
  }
  // Je garde une trace du nombre total de pages
  #totalPages:number = 0;
  // Mes données
  protected passengers$!:Observable<Result<Passenger>>;

  constructor() {
    // Au chargement du composant, je charge mes passagers
    this.#loadPassengers();
  }

  /**
   * Première page
   */
  firstPage() {
    this.#getPage(1);
  }

  /**
   * Page précédente
   */
  previousPage() {
    const page = (this.#filter.page! - 1) || 1;
    this.#getPage(page);
  }

  /**
   * Page suivante
   */
  nextPage() {
    const page = Math.min(this.#filter.page! + 1, this.#totalPages);
    this.#getPage(page);
  }

  /**
   * Dernière page
   */
  lastPage() {
    this.#getPage(this.#totalPages);
  }

  /**
   * Chargement des données
   * @private
   */
  #loadPassengers() {
    this.passengers$ = this.#passengersService.getAll(this.#filter)
      .pipe(
        tap(result => {
          this.#filter.page = result.page;
          this.#totalPages = result.totalPages ?? 0;
        })
      )
  }

  /**
   * Chargement d'une page donnée
   * @param page
   * @private
   */
  #getPage(page:number) {
    if(this.#filter.page !== page) {
      this.#filter.page = page;
      this.#loadPassengers();
    }
  }
}
