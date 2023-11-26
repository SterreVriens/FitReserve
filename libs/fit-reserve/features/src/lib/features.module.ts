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
import {TrainingDetailComponent} from "./training/training-detail/training-detail.component";
import { UserEditComponent } from './user/user-edit/user-edit.component';
import { AuthLoginComponent } from './auth/user-login/auth-login/auth-login.component';
import { AuthService } from './auth/auth.service';
import { AuthRegisterComponent } from './auth/user-register/auth-register/auth-register.component';
import { TrainingEditComponent } from './training/training-edit/training-edit.component';

const routes: Routes = [
  { path: 'users', pathMatch: 'full', component: UserListComponent },
  { path: 'users/create', pathMatch: 'full', component: UserEditComponent },
  { path: 'users/:id/edit', pathMatch: 'full', component: UserEditComponent },
  { path: 'users/:id', pathMatch: 'full', component: UserDetailComponent },
  { path: 'training', pathMatch: 'full', component: TrainingListComponent },
  { path: 'training/:id/edit', pathMatch: 'full', component: TrainingEditComponent },
  { path: 'training/:id', pathMatch: 'full', component: TrainingDetailComponent },
  { path: 'auth/register', pathMatch: 'full', component: AuthRegisterComponent },
  { path: 'auth/login', pathMatch: 'full', component: AuthLoginComponent },


];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), HttpClientModule, FormsModule, ReactiveFormsModule], // Include FormsModule here
  providers: [UserService, TrainingService,AuthService],
  declarations: [UserListComponent, UserDetailComponent, TrainingListComponent, UserEditComponent,AuthLoginComponent,AuthRegisterComponent,TrainingDetailComponent,TrainingEditComponent],
  exports: [UserListComponent, UserDetailComponent, TrainingListComponent, UserEditComponent,AuthLoginComponent,AuthRegisterComponent,TrainingDetailComponent,TrainingEditComponent],
})
export class FeaturesModule {}
