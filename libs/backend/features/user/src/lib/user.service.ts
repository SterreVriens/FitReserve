import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { IUser, Role } from '@fit-reserve/shared/api';
import { BehaviorSubject} from 'rxjs';
import { Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';



@Injectable()
export class UserService{
    TAG = 'UserService';

    constructor(@InjectModel(User.name) private userModel: Model<User>){
      this.seedDb()
    }

    async seedDb() {
      const currentUsers = await this.getAll();
      if (currentUsers.length > 0) {
        Logger.log('db already seeded');
        return;
      }
      Logger.log('seeding db');
      //const newCook = new this.cookModel(cook);
      const seedUser1 = new User();
      seedUser1.UserName = 'mustrumridcully';
      seedUser1.Password = await this.generateHashedPassword('Hallo123');
      seedUser1.Date = new Date();
      seedUser1.Role = Role.Trainee;
      const newSeedUser1 = new this.userModel(seedUser1);
      await newSeedUser1.save();
  
      const seedUser2 = new User();
      seedUser2.UserName = 'rincewind';
      seedUser2.Password = await this.generateHashedPassword('Hallo123');
      seedUser2.Date = new Date();
      seedUser2.Role= Role.Trainer
      const newSeedUser2 = new this.userModel(seedUser2);
      await newSeedUser2.save();
  
    }
  

    private users$ = new BehaviorSubject<IUser[]>([
        {
            _id: '0',
            UserName: "Bob",
            Password: "Bob123",
            Date: new Date(),
            Role: Role.Trainer
        },
        {
            _id: '1',
            UserName: "Hans",
            Password: "Hans123",
            Date: new Date(),
            Role: Role.Trainee
        }
    ]);

    async getAll() :Promise<User[]>{
        Logger.log("GetAll", this.TAG)
        return this.userModel.find().exec();
    }

    async getOne(username: string): Promise<User | null> {
      Logger.log(`getOne(${username})`, this.TAG);
      return await this.userModel.findOne({ UserName: username }).exec();
    }

    async delete(id: string): Promise<void> {
      Logger.log(`Delete user - ${id}`, this.TAG);
    
      try {
        // Gebruik Mongoose om de gebruiker te verwijderen op basis van het ID
        const result = await this.userModel.deleteOne({ _id: id }).exec();
    
        // Controleer of de verwijdering succesvol was
        if (result.deletedCount === 0) {
          Logger.error(`User with ID ${id} not found`, undefined, this.TAG);
          throw new NotFoundException(`User could not be found!`);
        }
    
        Logger.log('User deleted successfully', this.TAG);
      } catch (error) {
        Logger.error(`Error deleting user with ID ${id}`, error, this.TAG);
        throw new InternalServerErrorException('Error deleting user');
      }
    }
    

    async generateHashedPassword(plainTextPassword: string): Promise<string> {
      const saltOrRounds = 10;
      return await bcrypt.hash(plainTextPassword, saltOrRounds);
    }

    create(user: Pick<IUser,  'Password' | 'UserName'>): IUser {
        Logger.log('create', this.TAG);
        const current = this.users$.value;
    
        // Use the incoming data, a randomized ID, and default values for other fields
        const newUser: IUser = {
            _id: `user-${Math.floor(Math.random() * 10000)}`,
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
        const userIndex = currentUsers.findIndex((u) => u._id === id);
    
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

      

}
