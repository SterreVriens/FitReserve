import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { IUser, Role } from '@fit-reserve/shared/api';
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

      const seedUser3 = new User();
      seedUser3.UserName = 'John Doe';
      seedUser3.Password = await this.generateHashedPassword('Hallo123');
      seedUser3.Date = new Date();
      seedUser3.Role= Role.Trainee
      const newSeedUser3 = new this.userModel(seedUser3);
      await newSeedUser3.save();

      const seedUser4 = new User();
      seedUser4.UserName = 'Sterre';
      seedUser4.Password = await this.generateHashedPassword('Hallo123');
      seedUser4.Date = new Date();
      seedUser4.Role= Role.Trainee
      const newSeedUser4 = new this.userModel(seedUser4);
      await newSeedUser4.save();
  
    }
  

    async getAll() :Promise<User[]>{
        Logger.log("GetAll", this.TAG)
        return this.userModel.find().exec();
    }

    async getOne(_id: string): Promise<User | null> {
      Logger.log(`getOne(${_id})`, this.TAG);
      return await this.userModel.findOne({ _id: _id }).exec();
    }

    async getOneWithName(UserName: string): Promise<User | null> {
      Logger.log(`getOne(${UserName})`, this.TAG);
      return await this.userModel.findOne({ UserName: UserName }).exec();
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

    // user.service.ts

  async update(user: Pick<IUser, 'Password' | 'UserName'>, id: string, loggedInUserId: string): Promise<IUser> {
    Logger.log(`Update user with ID ${id}`, this.TAG);
    try {
      // Haal de huidige gebruiker op
      const currentUser = await this.userModel.findById(loggedInUserId).exec();

      // Controleer of de huidige gebruiker bestaat
      if (!currentUser) {
        throw new NotFoundException('User not found');
      }

      // Controleer of de huidige gebruiker overeenkomt met de gebruiker die wordt bijgewerkt
      if (currentUser._id.toString() !== id) {
        throw new UnauthorizedException('You are not authorized to update this user');
      }

      // Update de gebruikersgegevens in de database
      const updatedUser = await this.userModel.findByIdAndUpdate(id, user, { new: true }).exec();

      if (!updatedUser) {
        throw new NotFoundException('User not found');
      }

      Logger.log('User updated successfully', this.TAG);
      return updatedUser.toObject();
    } catch (error) {
      Logger.error(`Error updating user with ID ${id}`, error, this.TAG);
      throw new InternalServerErrorException('Error updating user');
    }
  }

    

  async generateHashedPassword(plainTextPassword: string | null): Promise<string> {
    if (plainTextPassword === null || plainTextPassword === undefined) {
        throw new Error('Plain text password cannot be null or undefined.');
    }

    const saltOrRounds = 10;
    return await bcrypt.hash(plainTextPassword, saltOrRounds);
}



      

}
