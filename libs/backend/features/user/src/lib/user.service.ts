import { Injectable, NotFoundException } from '@nestjs/common';
import { IUser, Role } from '@fit-reserve/shared/api';
import { BehaviorSubject} from 'rxjs';
import { Logger } from '@nestjs/common';


@Injectable()
export class UserService{
    TAG = 'UserService';

    private users$ = new BehaviorSubject<IUser[]>([
        {
            id: '0',
            UserName: "Bob",
            Password: "Bob123",
            Date: new Date(),
            Role: Role.Trainer
        },
        {
            id: '1',
            UserName: "Hans",
            Password: "Hans123",
            Date: new Date(),
            Role: Role.Trainee
        }
    ]);

    getAll() :IUser[]{
        Logger.log("GetAll", this.TAG)
        return this.users$.value;
    }

    getOne(id: string): IUser {
        Logger.log(`getOne(${id})`, this.TAG);
        const user = this.users$.value.find((td) => td.id === id);
        if (!user) {
            throw new NotFoundException(`User could not be found!`);
        }
        return user;
    }

    create(user: Pick<IUser,  'Password' | 'UserName'>): IUser {
        Logger.log('create', this.TAG);
        const current = this.users$.value;
    
        // Use the incoming data, a randomized ID, and default values for other fields
        const newUser: IUser = {
            id: `user-${Math.floor(Math.random() * 10000)}`,
            UserName: user.UserName || '', // Use the provided value or default to an empty string
            Password: user.Password || '', // Use the provided value or default to an empty string
            Role: Role.Trainee,
            Date: new Date()
        };
    
        this.users$.next([...current, newUser]);
        return newUser;
    }
    
    update(
        user: Pick<IUser, 'Password' | 'UserName'>,
        id: string
      ): IUser {
        Logger.log(`Update user with ID ${id}`, this.TAG);
    
        const currentUsers = this.users$.value;
        const userIndex = currentUsers.findIndex((u) => u.id === id);
    
        if (userIndex === -1) {
          Logger.error(`User with ID ${id} not found`, undefined, this.TAG);
          throw new NotFoundException(`User could not be found!`);
        }
    
        // Update the user properties
        currentUsers[userIndex].Password = user.Password;
        currentUsers[userIndex].UserName = user.UserName;
    
        // Update the BehaviorSubject with the modified array
        this.users$.next([...currentUsers]);
    
        Logger.log('User updated successfully', this.TAG);
        return currentUsers[userIndex];
      }

      delete(id: string): string {
        Logger.log(`Delete user - ${id}`, this.TAG);
      
        const currentUsers = this.users$.value;
        const userIndex = currentUsers.findIndex((u) => u.id === id);
      
        if (userIndex === -1) {
          Logger.error(`User with ID ${id} not found`, undefined, this.TAG);
          throw new NotFoundException(`User could not be found!`);
        }
      
        // Remove the user from the array
        const deletedUser = currentUsers.splice(userIndex, 1)[0];
      
        // Update the BehaviorSubject with the modified array
        this.users$.next([...currentUsers]);
      
        Logger.log('User deleted successfully', this.TAG);
        return `User ${deletedUser.UserName} deleted`;
      }
      

}
