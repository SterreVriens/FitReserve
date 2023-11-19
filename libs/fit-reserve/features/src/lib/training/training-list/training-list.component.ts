import { Component,OnInit, OnDestroy } from '@angular/core';
import { ITraining } from '@fit-reserve/shared/api';
import { TrainingService } from '../training.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';


@Component({
  selector: 'fit-reserve-user-list',
  templateUrl: './training-list.component.html',
  styleUrls: ['./training-list.component.css'],
})
export class TrainingListComponent implements OnInit,OnDestroy {
  trainingen: ITraining[] | null = null;
  subscription: Subscription | undefined = undefined;

  constructor(private trainingService: TrainingService, private router: Router) {}


  ngOnInit(): void {
    this.subscription = this.trainingService.list().subscribe((results) => {
        console.log(`results: ${results}`);
        this.trainingen = results;
    });
  }

  ngOnDestroy(): void{
    if(this.subscription) this.subscription.unsubscribe();
  }
}
