/* eslint-disable @typescript-eslint/no-explicit-any */
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
  errorMessage: string | undefined;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}


  onSubmit() {
    this.authService.login(this.user).subscribe(
      (success: any) => { // Use 'any' type here
        const token = success.access_token;
        if (success) {
          
          sessionStorage.setItem('access_token', token);
          this.router.navigate(['/feature/users/profile'], {relativeTo:this.route});
        } 
      },
      (error) => {
        console.error('Error login in user:', error)
        this.errorMessage = 'Invalide gebruikersnaam of wachtwoord';
      }
    )
  }
  
  
}
