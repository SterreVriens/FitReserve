// progress-create.component.ts
import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { IProgress } from '@fit-reserve/shared/api';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'fit-reserve-progress-create',
  templateUrl: './progress-create.component.html',
  styleUrls: ['./progress-create.component.css'],
})
export class ProgressCreateComponent implements OnInit{
  @Output() progressCreated = new EventEmitter();
  progress: IProgress={
    Weight: 0,
    Reps: 0,
    Duration: 0,
    Date: new Date(),
    TrainingId: '',
    UserId: '',
  }


  constructor(public activeModal: NgbActiveModal) {
  }
  ngOnInit(): void {
    this.progress;
  }

  onSubmit() {
    console.log(this.progress);
    // Add logic to handle form submission
    // Emit an event or perform any other necessary actions
    this.progressCreated.emit(this.progress);
    // Close the modal
    this.activeModal.close();
  }
}

