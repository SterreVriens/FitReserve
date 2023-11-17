import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';  // Import the FormsModule
import { HttpClientModule } from '@angular/common/http';
import { UserService } from './user/user.service';
import { UserListComponent } from './user/user-list/user-list.component';
import { UserDetailComponent } from './user/user-detail/user-detail.component';
import { TrainingListComponent } from './training/training-list/training-list.component';
import { TrainingService } from './training/training.service';
import { UserEditComponent } from './user/user-edit/user-edit.component';

const routes: Routes = [
  { path: 'users', pathMatch: 'full', component: UserListComponent },
  { path: 'users/create', pathMatch: 'full', component: UserEditComponent },
  { path: 'users/:id/edit', pathMatch: 'full', component: UserEditComponent },
  { path: 'users/:id', pathMatch: 'full', component: UserDetailComponent },
  { path: 'training', pathMatch: 'full', component: TrainingListComponent },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), HttpClientModule, FormsModule, ReactiveFormsModule], // Include FormsModule here
  providers: [UserService, TrainingService],
  declarations: [UserListComponent, UserDetailComponent, TrainingListComponent, UserEditComponent],
  exports: [UserListComponent, UserDetailComponent, TrainingListComponent, UserEditComponent],
})
export class FeaturesModule {}
