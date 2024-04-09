/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IEnrollment, ILocation, IProgress, ITraining, IUser } from '@fit-reserve/shared/api';
import { AuthService } from '../../auth/auth.service';
import { UserService } from '../user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'; // Import NgbModal or the modal library you are using
import { ProgressModalComponent } from './progress-details/progress-details.component';
import { DatePipe } from '@angular/common';
import { ProgressCreateComponent } from './progress-create/progress-create.component';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { TrainingService } from '../../training/training.service';
import { LocationCreateComponent } from './location-create/location-create.component';


@Component({
  selector: 'fit-reserve-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit {
  isLoggedIn: boolean = false;
  user: IUser | null = null;
  currentUserID: string | null = null; 
  enrollments: IEnrollment[] = [];
  subscription: Subscription | undefined = undefined;
  trainingen: ITraining[] | null = null;
  locations: ILocation[] | null = null;
  createdTrainingen: ITraining[] | null = null;
  today = new Date();

  constructor(private authService: AuthService,
    private userService: UserService,  
    private router: Router,
    private modalService: NgbModal,
    private datePipe: DatePipe,
    private location: Location,
    private trainingService: TrainingService) {}

  ngOnInit(): void {
    this.today.getDate();
    this.isLoggedIn = !!this.authService.getUserIdFromToken();
    if (this.isLoggedIn) {
        this.authService.getProfile().subscribe(
            (user) => {
                const u = this.authService.getUserIdFromToken();
                this.userService.read(u).subscribe(
                  (succes) =>{
                    this.user = succes

                    this.userService.getTrainingFromUser(u).subscribe(
                      (e) =>{
                        this.createdTrainingen = e
                      },
                      (error) => {
                        console.error('Error fetching user trainingen:', error);
                      }
                    )

                    this.userService.getAllEnrollments(u).subscribe(
                      (enrollments) => {
                        this.enrollments = enrollments;
                      },
                      (error) => {
                        console.error('Error fetching user enrollments:', error);
                      }
                    );
                  },
                  (error)=>{
                    console.error('Error fetching user profile:', error);
                  }
                );
                this.subscription = this.trainingService.list().subscribe((results) => {
                  console.log(`results: ${results}`);
                  
                  if (results !== null) {
                    this.trainingen = results;
                  
                    this.trainingen.forEach(t => {
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
                this.subscription = this.userService.getAllLocations().subscribe((results) => {
                  console.log(`results: ${results}`);
                  
                  if (results !== null) {
                    this.locations = results;

                  }
                });
                
                console.log(u)
                this.user = user;
            },
            (error) => {
                console.error('Error fetching user profile:', error);
                this.redirectToLogin();
                return; 
            }
        );
    }else{
        this.redirectToLogin();
        return; 
    }
  }


  redirectToLogin(): void {
    this.router.navigate(['/feature/auth/login']); 
  }

  confirmDelete(enrollmentId: string): void {
    const confirmation = confirm('Are you sure you want to delete this enrollment?');

    if (confirmation) {
      this.deleteEnrollment(enrollmentId);
    }
  }

  deleteEnrollment(enrollmentId: string): void {
    this.userService.deleteEnrollment(enrollmentId).subscribe(
      (response) => {
        console.log(response);
        this.refreshEnrollments();
      },
      (error) => {
        console.error('Error deleting enrollment:', error);
      }
    );
  }

  refreshEnrollments(): void {
    const u = this.authService.getUserIdFromToken();
    this.userService.getAllEnrollments(u).subscribe(
      (enrollments) => {
        this.enrollments = enrollments;
      },
      (error) => {
        console.error('Error fetching user enrollments:', error);
      }
    );
  }

  refreshLocations(): void {
    this.userService.getAllLocations().subscribe(
      (locations) => {
        this.locations = locations;
      },
      (error) => {
        console.error('Error fetching user locations:', error);
      }
    );
  }

  
  async viewOrFillProgress(enrollment: IEnrollment): Promise<void> {
    if (enrollment._id) {
      this.currentUserID = this.authService.getUserIdFromToken();
      if (this.isLoggedIn) {
        this.userService.getProgress(enrollment.TrainingId, this.currentUserID).subscribe(
          (progress) => {
            console.log('Existing Progress:', progress);
            if (progress) {
              const modalRef = this.modalService.open(ProgressModalComponent, { centered: true, backdrop: false });
              modalRef.componentInstance.progress = progress;
            } else {
              console.warn('Progress is undefined.');
            }
          },
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          (error) => {
            const modalRef = this.modalService.open(ProgressCreateComponent, { centered: true, backdrop: false });
          
            modalRef.componentInstance.progressCreated.subscribe((newProgress: IProgress) => {

              newProgress.TrainingId=enrollment.TrainingId;
              newProgress.UserId = this.currentUserID;
              console.log('New Progress Created:', newProgress);
              
              this.userService.createProgress(newProgress).subscribe(
                (succes) => {
                  console.log('Progress sucesfully created', succes)
                  this.location.go(this.location.path());
                },
                (error) => {
                  console.error('Error fetching user enrollments:', error);
                }
              );
            });
          }
        );
      }
    }
  }

  async fillLocation(): Promise<void> {
    
      if (this.isLoggedIn) {
            const modalRef = this.modalService.open(LocationCreateComponent, { centered: true, backdrop: false });
          
            modalRef.componentInstance.locationCreated.subscribe((newLocation: ILocation) => {
              
              this.userService.createLocation(newLocation).subscribe(
                () => {
                  this.refreshLocations();
                  this.location.go(this.location.path());
                },
                (error) => {
                  console.error('Error fetching user enrollments:', error);
                }
              );
          }
        );
      
    }
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

  isFull(training: ITraining): boolean {
    return training.AmountEnrolled === training.Places;
  }
  
}
