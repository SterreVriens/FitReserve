import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NxWelcomeComponent } from './nx-welcome.component';
import {UiModule} from '@fit-reserve/ui'


@Component({
  standalone: true,
  imports: [NxWelcomeComponent, RouterModule, UiModule],
  selector: 'fit-reserve-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'fit-reserve';
}
