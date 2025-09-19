import {ChangeDetectionStrategy, Component, inject,} from '@angular/core';
import {Passengers} from './passengers/passengers';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styles: [],
  imports: [Passengers],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {
}
