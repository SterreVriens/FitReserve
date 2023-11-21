import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../user.service';
import { Id, Role, IUser } from '@fit-reserve/shared/api';
import { Subscription } from 'rxjs';

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

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }


  onSubmit() {
    console.log('onSubmit - create/update');
  
    if (this.userId) {
      console.log(`Update user - ${this.userId}`)
      this.userService.update(this.user,this.userId).subscribe(
        (success) => {
          console.log(success);
          this.router.navigate(['..'], { relativeTo: this.route });
        },
        (error) => {
          console.error('Error updating user:', error);
        }
      );
    } else {
      // New user: Create the user
      console.log('Create user -', this.user);
      this.userService.create(this.user).subscribe(
        (success) => {
          console.log(success);
          if (success) {
            this.router.navigate(['..'], { relativeTo: this.route });
          }
        },
        (error) => {
          console.error('Error creating user:', error);
        }
      );
    }
  }
  
  
}
