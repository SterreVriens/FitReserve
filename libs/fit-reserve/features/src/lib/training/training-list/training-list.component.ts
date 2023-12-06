import { Component, OnInit, OnDestroy } from '@angular/core';
import { IEnrollment, ITraining, Level } from '@fit-reserve/shared/api';
import { TrainingService } from '../training.service';
import { Observable, Subscription, of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
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

    return role === 'Trainer';
  }

  isUserEnrolled(trainingId: string): Observable<boolean> {
    const userId = this.authService.getUserIdFromToken();
    console.log(`training : ${trainingId} + ${userId}`)

    if (userId) {
        // Voer een controle uit of de gebruiker al is ingeschreven voor de training
        console.log(this.trainingService.checkIfUserEnrolled(trainingId, userId))
        return this.trainingService.checkIfUserEnrolled(trainingId, userId);
    }

    return of(false); // Geef een Observable van false terug als userId null is
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
                this.router.navigate([''], { relativeTo: this.route });
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
