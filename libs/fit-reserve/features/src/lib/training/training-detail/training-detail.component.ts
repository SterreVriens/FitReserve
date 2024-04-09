/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IEnrollment, ITraining } from '@fit-reserve/shared/api';
import { AuthService } from '../../auth/auth.service';
import { TrainingService } from '../training.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'fit-reserve-training-detail',
  templateUrl: './training-detail.component.html',
  styleUrls: ['./training-detail.component.css'],
})
export class TrainingDetailComponent implements OnInit {
  training: ITraining | null = null;
  trainingId: string | null = null; 
  enrollments: IEnrollment[] | null = null;


  constructor(
    private route: ActivatedRoute, 
    private authService: AuthService,
    private trainingService: TrainingService,
    private datePipe: DatePipe,
     private router: Router,) 
  {}

  ngOnInit(): void {
    const trainingId = this.route.snapshot.paramMap.get('id');

    if(trainingId){
      this.trainingService.read(trainingId).subscribe(
        (training) => {
          this.training = training;
          this.trainingService.getEnrollmentsForTraining(trainingId).subscribe(
            (enrollments) => {
              this.enrollments = enrollments;
            },
            (error) => {
              console.error('Error getting enrollments:', error);
            }
          );
        },
        (error) => {
          console.error('Error retrieving training:', error);
        }
      );
    }
  }

  deleteTraining(): void {
    if (this.training) {
      this.trainingService.delete(this.training._id).subscribe(
        () => {
          this.router.navigate(['..'], { relativeTo: this.route });
        },
        (error) => {
          console.error('Error deleting training:', error);
        }
      );
    } else {
      console.error('Error: Training is null');
    }
  }
  

  isTrainer(): boolean {
    const role = this.authService.getUserRoleFromToken();

    return role === 'Trainer';
  }

  formatProgressDate(date: Date | undefined): string | null{
    if (!date) {
      return ''; 
    }

    return this.datePipe.transform(date, 'medium');
  }
}
