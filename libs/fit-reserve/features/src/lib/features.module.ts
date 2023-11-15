import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { UserListComponent } from './user/user-list/user-list.component';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from './user/user.service';
import { UserDetailComponent } from './user/user-detail/user-detail.component';


const routes: Routes = [
  { path: 'users', pathMatch: 'full', component: UserListComponent },
  { path: 'users/:id', pathMatch: 'full', component: UserDetailComponent },

];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), HttpClientModule],
  providers: [UserService],
  declarations: [UserListComponent,UserDetailComponent],
  exports: [UserListComponent,UserDetailComponent]
})
export class FeaturesModule {}
