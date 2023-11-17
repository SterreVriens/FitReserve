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
        const meal = this.users$.value.find((td) => td.id === id);
        if (!meal) {
            throw new NotFoundException(`User could not be found!`);
        }
        return meal;
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
    

}
