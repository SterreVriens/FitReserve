import { Component, OnInit, OnDestroy } from '@angular/core';
import { ITraining } from '@fit-reserve/shared/api';
import { TrainingService } from '../training.service';
import {  Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { UserService } from '../../user/user.service';


@Component({
  selector: 'fit-reserve-training-list',
  templateUrl: './training-list.component.html',
  styleUrls: ['./training-list.component.css'],
})
export class TrainingListComponent implements OnInit, OnDestroy {
  trainingen: ITraining[] | null = null;
  subscription: Subscription | undefined = undefined;

  constructor(
    private trainingService: TrainingService,
    private router: Router,
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.subscription = this.trainingService.list().subscribe((results) => {
      console.log(`results: ${results}`);
      this.trainingen = results;
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }

  isTrainer(): boolean {
    // Check if the user has the role of a trainer
    const role = this.authService.getUserRoleFromToken();
  
    if (role == "Trainer") {
      return true;
    }
    return true;
  }
  
}
