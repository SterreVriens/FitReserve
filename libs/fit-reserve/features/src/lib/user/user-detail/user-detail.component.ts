// user-detail.component.ts

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../user.service';
import { IUser, Role } from '@fit-reserve/shared/api';
import { AuthService } from '../../auth/auth.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'fit-reserve-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css'],
})
export class UserDetailComponent implements OnInit {
  user: IUser | null = null;

  constructor(
    private route: ActivatedRoute, 
    private userService: UserService,
    private authService: AuthService,
     private router: Router,
    private datePipe: DatePipe,
    ) {}

     ngOnInit(): void {
  
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
      const userId = this.authService.getUserIdFromToken();
      console.log('Logged in userId:', userId);


      return userId === this.user?._id
    }

    //check if user has role trainer
    isTrainer(): boolean {
      const userRole = this.authService.getUserRoleFromToken();
      console.log('Logged in userRole:', userRole);
      return userRole === Role.Trainer;
    }

    formatDate(date: Date | undefined): string | null{
      if (!date) {
        return ''; 
      }
  
      return this.datePipe.transform(date, 'medium');
    }
  
  
}
