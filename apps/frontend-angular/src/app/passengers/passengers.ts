import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {PassengersFilter} from './models/passengers-filter';
import {PassengersService} from './passengers-service';
import {AsyncPipe} from '@angular/common';
import {BehaviorSubject, distinctUntilChanged, Observable, switchMap, tap} from 'rxjs';
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

  #filter$ = new BehaviorSubject<Partial<PassengersFilter>>({
    page: 1,
    limit: 15
  })

  // Je garde une trace du nombre total de pages
  #totalPages:number = 0;
  // Mes données
  // Le chargement est déclenché de façon réactive par la mise à jour du filtre
  protected passengers$:Observable<Result<Passenger>> = this.#filter$.pipe(
    distinctUntilChanged(),
    switchMap(filters => this.#passengersService.getAll(filters)),
    tap(result => this.#totalPages = result.totalPages ?? 0)
  )

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
    const currentPage = this.#filter$.getValue().page!;
    const page = (currentPage! - 1) || 1;
    this.#getPage(page)
  }

  /**
   * Page suivante
   */
  nextPage() {
    const currentPage = this.#filter$.getValue().page!;
    const page = Math.min(currentPage + 1, this.#totalPages);
    this.#getPage(page);
  }

  /**
   * Dernière page
   */
  lastPage() {
    this.#getPage(this.#totalPages);
  }

  /**
   * Chargement d'une page donnée
   * @param page
   * @private
   */
  #getPage(page:number) {
    this.#filter$.next({...this.#filter$.getValue(), page});
  }
}
