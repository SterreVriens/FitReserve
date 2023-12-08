// user-detail.component.ts

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../user.service';
import { IUser } from '@fit-reserve/shared/api';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'fit-reserve-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css'],
})
export class UserDetailComponent implements OnInit {
  user: IUser | null = null;
  currentUserID: string | null = null; 

  constructor(
    private route: ActivatedRoute, 
    private userService: UserService,
    private authService: AuthService,
     private router: Router,) {}

     ngOnInit(): void {
      // Fetch the current user's profile
      this.authService.getProfile().subscribe(
        (user) => {
          this.user = user;
        },
        (error) => {
          console.error('Error fetching user profile', error);
        }
      );
  
      // Haal het gebruikersid op uit de routeparameters
      const userId = this.route.snapshot.paramMap.get('id');
  
      if (userId) {
        // Roep de UserService aan om de gebruiker op te halen
        this.userService.read(userId).subscribe(
          (user) => {
            this.user = user;
          },
          (error) => {
            console.error('Er is een fout opgetreden bij het ophalen van de gebruiker', error);
          }
        );
      }
    }

    isOwner(): boolean {
      // Retrieve the token from AuthService
      const user = this.authService.getUserIdFromToken();
      console.log('Logged in userId:', user);
  
      // Implement logic to compare the IDs (replace 'currentUserID' with the actual ID from your JWT)
      return this.user?._id === user
    }
  
}
