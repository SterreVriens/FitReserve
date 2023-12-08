import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { IUser } from '@fit-reserve/shared/api';
import { Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';



@Injectable()
export class UserService{
    TAG = 'UserService';

    constructor(@InjectModel(User.name) private userModel: Model<User>){ }

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
        const result = await this.userModel.deleteOne({ _id: id }).exec();
    
        if (!result) {
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

      const currentUser = await this.userModel.findById(loggedInUserId).exec();

      if (!currentUser) {
        throw new NotFoundException('User not found');
      }

      if (currentUser._id.toString() !== id) {
        throw new UnauthorizedException('You are not authorized to update this user');
      }
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
