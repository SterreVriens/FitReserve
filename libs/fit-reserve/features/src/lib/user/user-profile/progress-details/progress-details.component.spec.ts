import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProgressDetailsComponent } from './progress-details.component';

describe('ProgressDetailsComponent', () => {
  let component: ProgressDetailsComponent;
  let fixture: ComponentFixture<ProgressDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgressDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProgressDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
