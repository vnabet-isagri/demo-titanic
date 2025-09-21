import {ChangeDetectionStrategy, Component, computed, inject, signal} from '@angular/core';
import {PassengersFilter} from './models/passengers-filter';
import {PassengersService} from './passengers-service';
import {rxResource} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-passengers',
  imports: [],
  templateUrl: './passengers.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Passengers {
  // Le service des passagers
  readonly #passengersService = inject(PassengersService);

  // Filtre de recherche des passagers
  #filter = signal<Partial<PassengersFilter>>({
    page: 1,
    limit: 15
  });

  // Ressource rxJS,
  // elle est mise à jour avec la mise à jour du filtre
  readonly #passengersRessource = rxResource({
    params: this.#filter,
    stream: ({params}) => this.#passengersService.getAll(params),
  });

  // Computed signal qui me renvoie la liste des passagers
  protected readonly passengers = computed(() => this.#passengersRessource.hasValue()?this.#passengersRessource.value()?.data:[])
  // Computed signal qui me renvoiie la pagination
  protected readonly pagination = computed(() => {
    if(this.#passengersRessource.hasValue()){
      const value = this.#passengersRessource.value();
      return {
        page: value.page!,
        totalPages: value.totalPages!
      }
    } else return null;
  })

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
    const currentPage = this.pagination()!.page;
    const page = (currentPage! - 1) || 1;
    this.#getPage(page)
  }

  /**
   * Page suivante
   */
  nextPage() {
    const currentPage = this.pagination()!.page;
    const page = Math.min(currentPage + 1, this.pagination()!.totalPages);
    this.#getPage(page);
  }

  /**
   * Dernière page
   */
  lastPage() {
    this.#getPage(this.pagination()!.totalPages);
  }

  /**
   * Chargement d'une page donnée
   * @param page
   * @private
   */
  #getPage(page:number) {
    this.#filter.update(filter => ({...filter, page}));
  }
}
