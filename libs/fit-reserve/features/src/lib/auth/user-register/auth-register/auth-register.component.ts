import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IUser, Role } from '@fit-reserve/shared/api';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'fit-reserve-auth-register',
  templateUrl: './auth-register.component.html',
  styleUrls: ['./auth-register.component.css'],
})
export class AuthRegisterComponent {

  user: IUser = {
    UserName: '',
    Password: '',
    Role: Role.Trainee
  };
  


  private userSubscription: Subscription | undefined;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  onSubmit() {
    this.authService.register(this.user).subscribe(
      (success) =>{;
        if(success){
          this.router.navigate(['/feature/auth/login'], {relativeTo:this.route});
        } 
      },
      (error) =>{
        console.error('Error registeren in user:', error)
      }
    )
  }
}
