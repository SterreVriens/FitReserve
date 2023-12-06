import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TrainingService } from '../training.service';
import { AuthService } from '../../auth/auth.service'; // Adjust the path based on your project structure
import { Id, ITraining } from '@fit-reserve/shared/api';
import { Subscription } from 'rxjs';

@Component({
  selector: 'fit-reserve-training-edit',
  templateUrl: './training-edit.component.html',
  styleUrls: ['./training-edit.component.css'],
})
export class TrainingEditComponent implements OnInit, OnDestroy {
  trainingId: Id | null = null;
  training: ITraining = {
    _id: '',
    SessionName: '',
    Date: new Date(),
    Duration: 0,
    Description: '',
    Location: '',
    Places: 0,
    UserId: '',
    
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private trainingService: TrainingService,
    private authService: AuthService // Inject the AuthService
  ) {}

  private trainingSubscription: Subscription | undefined;

  ngOnInit(): void {
    this.route.paramMap.subscribe(async (params) => {
      this.trainingId = params.get('id') ?? null;
      if (this.trainingId) {
        // Existing training
        this.trainingSubscription = this.trainingService.read(this.trainingId).subscribe(
          (training) => {
            this.training = training;
          },
          (error) => {
            console.error('Error fetching training:', error);
          }
        );
      } else {
        // New training
        
      }
    });
  }
  ngOnDestroy(): void {
    if (this.trainingSubscription) {
      this.trainingSubscription.unsubscribe();
    }
  }

  onSubmit() {
    console.log('onSubmit - create/update');
    console.log('Request Data:', this.training);
  
    const userId = this.authService.getUserIdFromToken();
  
    if (userId) {
      this.training.UserId = userId;
  
      if (this.trainingId) {
        console.log(`Update training - ${this.trainingId}`);
        this.trainingService.update(this.training, this.trainingId).subscribe(
          (success) => {
            console.log('Response:', success);
            this.router.navigate(['..'], { relativeTo: this.route });
          },
          (error) => {
            console.error('Error updating training:', error);
          }
        );
      } else {
        // New training: Create the training
        console.log('Create training -', this.training);
        this.trainingService.create(this.training).subscribe(
          (success) => {
            console.log('Response:', success);
            if (success) {
              this.router.navigate(['..'], { relativeTo: this.route });
            }
          },
          (error) => {
            console.error('Error creating training:', error);
          }
        );
      }
    } else {
      // Handle the case where userId is null
      console.error('Error: UserId is null');
    }
  }
  
  
}
