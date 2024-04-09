import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../user.service';
import { Id, Role, IUser } from '@fit-reserve/shared/api';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';


@Component({
  selector: 'fit-reserve-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css'],
})
export class UserEditComponent implements OnInit {
  userId: Id | null = null;
  user: IUser = {
    _id: '1',
    UserName: '',
    Password: '',
    Role: Role.Trainee,
    Date: new Date()
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private userService: UserService
  ) {}

  private userSubscription: Subscription | undefined;

  ngOnInit(): void {
    this.route.paramMap.subscribe(async (params) => {
      this.userId = params.get('id');
      if (this.userId) {
        // Existing user
        this.userSubscription = this.userService.read(this.userId).subscribe(
          (user) => {
            this.user = user;
          },
          (error) => {
            console.error('Error fetching user:', error);
          }
        );
      } else {
        // New user
        this.user;
      }
    });
  }


  onSubmit() {
  
    if (this.userId) {
      this.userService.update(this.user).subscribe(
        (updatedUser) => {
  
          // Navigate to the user detail page with the updated UserName
          this.router.navigate(['feature', 'users', updatedUser._id]);
        },
        (error) => {
          console.error('Error updating user:', error);
        }
      );
    } else {
      // New user: Create the user
      this.userService.create(this.user).subscribe(
        (newUser) => {
  
          // Navigate to the user detail page with the new UserName
          this.router.navigate(['feature', 'users', newUser.UserName]);
        },
        (error) => {
          console.error('Error creating user:', error);
        }
      );
    }
  }
  
  //check if user has role trainer
  isTrainer(): boolean {
    const userRole = this.authService.getUserRoleFromToken();
    return userRole === Role.Trainer;
  }

  isOwner(): boolean {
    // Retrieve the token from AuthService
    const userId = this.authService.getUserIdFromToken();


    return userId === this.user?._id
  }

  isTrainerOrOwner(): boolean {
    return this.isTrainer() || this.isOwner();
}

}
