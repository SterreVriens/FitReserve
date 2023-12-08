import { Component, OnInit, OnDestroy } from '@angular/core';
import { IEnrollment, ITraining, Level } from '@fit-reserve/shared/api';
import { TrainingService } from '../training.service';
import { Observable, Subscription, catchError, map, of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'fit-reserve-training-list',
  templateUrl: './training-list.component.html',
  styleUrls: ['./training-list.component.css'],
})
export class TrainingListComponent implements OnInit, OnDestroy {
  trainingen: ITraining[] | null = null;
  subscription: Subscription | undefined = undefined;
  enrollment: IEnrollment = {
    TrainingId: '',
    UserId: '',
    Level: Level.Beginner
  };

  constructor(
    private route: ActivatedRoute,
    private trainingService: TrainingService,
    private router: Router,
    private authService: AuthService,
    private datePipe: DatePipe,
  ) {}

  ngOnInit(): void {
    this.subscription = this.trainingService.list().subscribe((results) => {
      console.log(`results: ${results}`);
      
      // Controleer of results niet null is voordat je de forEach-loop uitvoert
      if (results !== null) {
        this.trainingen = results;
    
        // Voer de forEach-loop alleen uit als this.trainingen niet null is
        this.trainingen.forEach(t => {
          this.isUserEnrolled(t._id).subscribe((isEnrolled: boolean) => {
            t.IsEnrolled = isEnrolled;
            console.log(t._id + " heeft status " + t.IsEnrolled);
          });

          let enrol: IEnrollment[] | null= [];
          this.trainingService.getEnrollmentsForTraining(t._id).subscribe(
            (enrollments) => {
              enrol = enrollments;
              if(enrol!==null)
              t.AmountEnrolled = enrol.length;
            },
            (error) => {
              console.error('Error fetching enrollments:', error);
            }
          );

        });
      }
    });
  }
  
  
  


  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }

  isTrainer(): boolean {
    // Check if the user has the role of a trainer
    const role = this.authService.getUserRoleFromToken();

    return role === 'Trainer';
  }

  isFull(training: ITraining): boolean {
    return training.AmountEnrolled === training.Places;
  }

  formatProgressDate(date: Date | undefined): string | null{
    if (!date) {
      return ''; 
    }

    return this.datePipe.transform(date, 'medium');
  }

  isUserEnrolled(trainingId: string): Observable<boolean> {
    const userId = this.authService.getUserIdFromToken();
    console.log(`training : ${trainingId} + ${userId}`);

    if (userId) {
        return this.trainingService.checkIfUserEnrolled(trainingId, userId).pipe(
            map((enrollment) => {
                console.log('Response:', enrollment);
                const isEnrolled = enrollment;

                // Check if this.trainingen is not null before using find
                if (this.trainingen !== null) {
                    const training = this.trainingen.find(t => t._id === trainingId);
                    if (training) {
                        training.IsEnrolled = isEnrolled;
                    }
                }

                return isEnrolled;
            }),
            catchError((error) => {
                console.error('Error creating training:', error);
                return of(true);
              })
          );
      }

      return of(true);
  }





  enroll(trainingId: string, level: Level): void {
    console.log(`Enrolling user in training ${trainingId}`);

    const userId = this.authService.getUserIdFromToken();
  
    if (userId) {
      this.enrollment.UserId = userId;

      this.enrollment.TrainingId = trainingId;
      this.enrollment.Level = level;


      this.trainingService.enroll(this.enrollment).subscribe(
            (success) => {
              console.log('Response:', success);
              if (success) {
                this.router.navigate([`/feature/training/${trainingId}`], { });
              }
            },
            (error) => {
              console.error('Error creating training:', error);
            }
          );
    }
    else{
      console.error('Error: UserId is null');
    }
  }
}
