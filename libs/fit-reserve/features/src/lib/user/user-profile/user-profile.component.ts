/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IEnrollment, IUser } from '@fit-reserve/shared/api';
import { AuthService } from '../../auth/auth.service';
import { UserService } from '../user.service';


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

  constructor(private authService: AuthService,private userService: UserService,  private router: Router) {}

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
    this.router.navigate(['/login']); // Replace '/login' with the actual path to your login page
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
    // Check if the user is already enrolled in the training
    if (enrollment._id) {
      this.currentUserID = this.authService.getUserIdFromToken();
      // If logged in, fetch user profile
      if (this.isLoggedIn) {
        console.log(enrollment.TrainingId+this.currentUserID)
          this.userService.getProgress(enrollment.TrainingId, this.currentUserID).subscribe(
        (progress) => {
          console.log('Existing Progress:', progress);
        },
        (error) => {
          console.error('Er is een fout opgetreden bij het ophalen van de gebruiker', error);
        }
      );
      }
    }
  }
}
