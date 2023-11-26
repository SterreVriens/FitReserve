import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TrainingService } from '../training.service';
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
    id: '1',
    SessionName: '',
    Date: new Date(),
    Duration: new Float32Array(),
    Description: '',
    Location: '',
    Places: new Int16Array(),
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private trainingService: TrainingService
  ) {}

  private trainingSubscription: Subscription | undefined;

  ngOnInit(): void {
    this.route.paramMap.subscribe(async (params) => {
      this.trainingId = params.get('id');
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
        this.training;
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

    if (this.trainingId) {
      console.log(`Update training - ${this.trainingId}`);
      this.trainingService.update(this.training, this.trainingId).subscribe(
        (success) => {
          console.log(success);
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
          console.log(success);
          if (success) {
            this.router.navigate(['..'], { relativeTo: this.route });
          }
        },
        (error) => {
          console.error('Error creating training:', error);
        }
      );
    }
  }
}
