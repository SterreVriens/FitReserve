import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TrainingEditComponent } from './training-edit.component';

describe('TrainingEditComponent', () => {
  let component: TrainingEditComponent;
  let fixture: ComponentFixture<TrainingEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrainingEditComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TrainingEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
