import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutComponent } from './about/about.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';


const routes: Routes = [
    { path: 'about', pathMatch: 'full', component: AboutComponent },
    { path: 'home', pathMatch: 'full', component: HomeComponent }

  ];

@NgModule({
    imports:[CommonModule, RouterModule.forChild(routes), HttpClientModule],
    declarations:[AboutComponent],
    exports: [AboutComponent]
})
export class StaticModule{}