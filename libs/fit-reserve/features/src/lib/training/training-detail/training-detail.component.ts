/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ITraining } from '@fit-reserve/shared/api';
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
        },
        (error) => {
          console.error('Er is een fout opgetreden bij het ophalen van de training', error);
        }
      );
    }
  }

  onSubmit(): void {
    console.log('onSubmit - delete');
  
    if(this.training){
      this.trainingService.delete(this.training._id ).subscribe(

        (success: any) => {
          console.log('Delete successful', success);
          this.router.navigate(['..'], { relativeTo: this.route });
        },
        (error: any) => {
          console.error('Error deleting user:', error)        }
      );
    }
    else console.error('Er is een fout opgetreden bij het verwijderen van de gebruiker', Error);
     
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
