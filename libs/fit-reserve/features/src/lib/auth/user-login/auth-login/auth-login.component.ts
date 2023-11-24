import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth.service';
import { IUser } from '@fit-reserve/shared/api';

@Component({
  selector: 'fit-reserve-auth-login',
  templateUrl: './auth-login.component.html',
  styleUrls: ['./auth-login.component.css'],
})
export class AuthLoginComponent{

  user: IUser = {
    UserName: '',
    Password: '',
  };

  private userSubscription: Subscription | undefined;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}


  onSubmit() {
    console.log(`login user - ${this.user.UserName}`)
    this.authService.login(this.user).subscribe(
      (success) =>{
        console.log(success);
        if(success){
          this.router.navigate(['..'], {relativeTo:this.route});
        } 
      },
      (error) =>{
        console.error('Error login in user:', error)
      }
    )
    }
}
