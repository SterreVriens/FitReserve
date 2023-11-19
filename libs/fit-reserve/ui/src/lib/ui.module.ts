import { NgModule } from '@angular/core';
import { HeaderComponent } from './header/header.component'
import { RouterModule } from '@angular/router';
import { FooterComponent } from './footer/footer.component';

@NgModule({
  imports: [RouterModule],
  declarations: [HeaderComponent,FooterComponent],
  exports: [HeaderComponent,FooterComponent],
})
export class UiModule {}
