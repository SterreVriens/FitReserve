import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ILocation } from '@fit-reserve/shared/api';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';



@Component({
  selector: 'fit-reserve-location-create',
  templateUrl: './location-create.component.html',
  styleUrls: ['./location-create.component.css'],
})
export class LocationCreateComponent implements OnInit {
  @Output() locationCreated = new EventEmitter();

  location : ILocation = {
    Name: '',
    Address: '',
    City: '',
    Description: '',
    Country: ''
  }

  constructor(public activeModal: NgbActiveModal) {
  }
  ngOnInit(): void {
    this.location;
  }

  onSubmit() {
    this.locationCreated.emit(this.location);
    // Close the modal
    this.activeModal.close();
  }
}
