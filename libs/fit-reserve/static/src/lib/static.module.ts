import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutComponent } from './about/about.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
    { path: 'about', pathMatch: 'full', component: AboutComponent }
  ];

@NgModule({
    imports:[CommonModule, RouterModule.forChild(routes), HttpClientModule],
    declarations:[AboutComponent],
    exports: [AboutComponent]
})
export class StaticModule{}