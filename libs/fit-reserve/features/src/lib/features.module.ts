import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
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
import { UserProfileComponent } from './user/user-profile/user-profile.component';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ProgressCreateComponent } from './user/user-profile/progress-create/progress-create.component';

const routes: Routes = [
  { path: 'users', pathMatch: 'full', component: UserListComponent },
  { path: 'users/profile', pathMatch: 'full', component: UserProfileComponent },
  { path: 'users/create', pathMatch: 'full', component: UserEditComponent },
  { path: 'users/:id/edit', pathMatch: 'full', component: UserEditComponent },
  { path: 'users/:id', pathMatch: 'full', component: UserDetailComponent },
  { path: 'training', pathMatch: 'full', component: TrainingListComponent },
  { path: 'training/create', pathMatch: 'full', component: TrainingEditComponent },

  { path: 'training/:id/edit', pathMatch: 'full', component: TrainingEditComponent },
  { path: 'training/:id', pathMatch: 'full', component: TrainingDetailComponent },
  { path: 'auth/register', pathMatch: 'full', component: AuthRegisterComponent },
  { path: 'auth/login', pathMatch: 'full', component: AuthLoginComponent },


];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), HttpClientModule, FormsModule, ReactiveFormsModule,NgbModalModule], // Include FormsModule here
  providers: [UserService, TrainingService,AuthService,DatePipe],
  declarations: [UserListComponent, UserDetailComponent, TrainingListComponent, UserEditComponent,AuthLoginComponent,AuthRegisterComponent,TrainingDetailComponent,TrainingEditComponent,UserProfileComponent,ProgressCreateComponent],
  exports: [UserListComponent, UserDetailComponent, TrainingListComponent, UserEditComponent,AuthLoginComponent,AuthRegisterComponent,TrainingDetailComponent,TrainingEditComponent,UserProfileComponent,ProgressCreateComponent],
})
export class FeaturesModule {}
