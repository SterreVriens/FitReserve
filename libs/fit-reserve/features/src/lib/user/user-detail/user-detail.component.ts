// user-detail.component.ts

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../user.service';
import { IUser } from '@fit-reserve/shared/api';

@Component({
  selector: 'fit-reserve-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css'],
})
export class UserDetailComponent implements OnInit {
  user: IUser | null = null;

  constructor(private route: ActivatedRoute, private userService: UserService, private router: Router,) {}

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
  // onSubmit(): void {
  //   console.log('onSubmit - delete');
  
  //   if(this.user){
  //     this.userService.delete(this.user._id).subscribe(
  //       (success) => {
  //         console.log('Delete successful', success);
  //         this.router.navigate(['..'], { relativeTo: this.route });
  //         // Handle any additional logic after successful deletion
  //       },
  //       (error) => {
  //         console.error('Error deleting user:', error);
  //         // Handle errors, display a message, or perform any other necessary actions
  //       }
  //     );
  //   }
  //   else console.error('Er is een fout opgetreden bij het verwijderen van de gebruiker', Error);
     
  // }
  
}
