import { Component,OnInit, OnDestroy } from '@angular/core';
import { IUser } from '@fit-reserve/shared/api';
import { UserService } from '../user.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';


@Component({
  selector: 'fit-reserve-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
})
export class UserListComponent implements OnInit,OnDestroy {
  users: IUser[] | null = null;
  subscription: Subscription | undefined = undefined;

  constructor(private userService: UserService, private router: Router) {}


  ngOnInit(): void {
    this.subscription = this.userService.list().subscribe((results) => {
        console.log(`results: ${results}`);
        this.users = results;
    });
  }

  ngOnDestroy(): void{
    if(this.subscription) this.subscription.unsubscribe();
  }
}
