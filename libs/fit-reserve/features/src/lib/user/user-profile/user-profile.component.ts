/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IEnrollment, IProgress, IUser } from '@fit-reserve/shared/api';
import { AuthService } from '../../auth/auth.service';
import { UserService } from '../user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'; // Import NgbModal or the modal library you are using
import { ProgressModalComponent } from './progress-details/progress-details.component';
import { DatePipe } from '@angular/common';
import { ProgressCreateComponent } from './progress-create/progress-create.component';
import { Location } from '@angular/common';


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

  constructor(private authService: AuthService,
    private userService: UserService,  
    private router: Router,
    private modalService: NgbModal,
    private datePipe: DatePipe,
    private location: Location) {}

  ngOnInit(): void {
    // Check if the user is logged in
    this.isLoggedIn = !!this.authService.getUserIdFromToken();
    // If logged in, fetch user profile
    if (this.isLoggedIn) {
        this.authService.getProfile().subscribe(
            (user) => {
                const u = this.authService.getUserIdFromToken();
                this.userService.read(u).subscribe(
                  (succes) =>{
                    this.user = succes
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
                console.log(u)
                this.user = user;
            },
            (error) => {
                console.error('Error fetching user profile:', error);
            }
        );
    }
  }


  redirectToLogin(): void {
    this.router.navigate(['/feature/auth/login']); // Replace '/login' with the actual path to your login page
  }

  confirmDelete(enrollmentId: string): void {
    const confirmation = confirm('Are you sure you want to delete this enrollment?');

    if (confirmation) {
      this.deleteEnrollment(enrollmentId);
    }
  }

  deleteEnrollment(enrollmentId: string): void {
    // Hier kun je de logica toevoegen om de inschrijving daadwerkelijk te verwijderen
    this.userService.deleteEnrollment(enrollmentId).subscribe(
      (response) => {
        console.log(response);
        // Vernieuw de lijst met inschrijvingen na succesvol verwijderen
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

  
  async viewOrFillProgress(enrollment: IEnrollment): Promise<void> {
    if (enrollment._id) {
      this.currentUserID = this.authService.getUserIdFromToken();
      if (this.isLoggedIn) {
        this.userService.getProgress(enrollment.TrainingId, this.currentUserID).subscribe(
          (progress) => {
            console.log('Existing Progress:', progress);
            // Open the modal with progress details only if progress is defined
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
          
            // Subscribe to the progressCreated event
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
  
  

  formatProgressDate(date: Date | undefined): string | null{
    if (!date) {
      return ''; // Handle the case where date is undefined
    }

    // Use DatePipe to format the date
    return this.datePipe.transform(date, 'medium'); // You can adjust the format as needed
  }
  
}
