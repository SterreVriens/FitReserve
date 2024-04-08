import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LocationCreateComponent } from './location-create.component';

describe('LocationCreateComponent', () => {
  let component: LocationCreateComponent;
  let fixture: ComponentFixture<LocationCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocationCreateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LocationCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
