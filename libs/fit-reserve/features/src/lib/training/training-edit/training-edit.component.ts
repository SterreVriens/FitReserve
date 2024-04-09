import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TrainingService } from '../training.service';
import { AuthService } from '../../auth/auth.service';
import { ICreateTraining, Id, ILocation } from '@fit-reserve/shared/api';
import { Subscription } from 'rxjs';

@Component({
  selector: 'fit-reserve-training-edit',
  templateUrl: './training-edit.component.html',
  styleUrls: ['./training-edit.component.css'],
})
export class TrainingEditComponent implements OnInit, OnDestroy {
  locations: ILocation[] | null = null;
  trainingId: Id | null = null;
  training: ICreateTraining = {
    SessionName: '',
    Date: new Date(),
    Duration: 0,
    Description: '',
    LocationId: '',
    Places: 0,
    UserId: '',
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private trainingService: TrainingService,
    private authService: AuthService
  ) {}

  private trainingSubscription: Subscription | undefined;

  ngOnInit(): void {
    this.route.paramMap.subscribe(async (params) => {
      this.trainingSubscription = await this.trainingService.listLocations().subscribe(
        (locations) => {
          this.locations = locations;
        },
        (error) => {
          console.error('Error fetching locations:', error);
        }
      );
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
    const userId = this.authService.getUserIdFromToken();
  
    if (userId) {
      this.training.UserId = userId;
  
      if (this.trainingId) {
        this.trainingService.update(this.training, this.trainingId).subscribe(
          () => {
            this.router.navigate(['..'], { relativeTo: this.route });
          },
          (error) => {
            console.error('Error updating training:', error);
          }
        );
      } else {
        this.trainingService.create(this.training).subscribe(
          (success) => {
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

  isTrainer(): boolean {
    const role = this.authService.getUserRoleFromToken();

    return role === 'Trainer';
  }

}
