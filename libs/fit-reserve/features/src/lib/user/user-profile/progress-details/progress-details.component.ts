import { Component, Input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { IProgress } from '@fit-reserve/shared/api';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'fit-reserve-progress-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './progress-details.component.html',
  styleUrls: ['./progress-details.component.css'],
})
export class ProgressModalComponent {
  constructor(private datePipe: DatePipe, public activeModal: NgbActiveModal){}
  @Input() progress: IProgress | null = null;

  formatProgressDate(date: Date | undefined): string | null{
    if (!date) {
      return ''; // Handle the case where date is undefined
    }

    // Use DatePipe to format the date
    return this.datePipe.transform(date, 'medium'); // You can adjust the format as needed
  }
  closeModal() {
    this.activeModal.close();
  }
}