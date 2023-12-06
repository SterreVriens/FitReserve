/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, NotFoundException } from '@nestjs/common';
//import { ITraining } from '@fit-reserve/shared/api';
//import { BehaviorSubject} from 'rxjs';
import { Logger } from '@nestjs/common';
import { Training } from './schemas/training.schema';
import { InjectModel } from '@nestjs/mongoose';
import {UserService} from '@fit-reserve/backend/features';
import { Model } from 'mongoose';
import { ITraining } from '@fit-reserve/shared/api';
import { UpdateTrainingDto } from '@fit-reserve/backend/dto';

@Injectable()
export class TrainingService{
    TAG = 'TrainingService';

    constructor(
      @InjectModel(Training.name) private trainingModel: Model<Training>,
      private userService: UserService){
      this.seedDb()
      }
    

    async seedDb() {
      const currentTrainings = await this.getAll();
      if (currentTrainings.length > 0) {
        Logger.log('db already seeded');
        return;
      }
      Logger.log('seeding db');

      const currentUsers = await this.userService.getAll(); 
      
      const training1= new Training();
      training1.SessionName= 'Krachttraining';
      training1.Date= new Date('2023-11-15T10:00:00');
      training1.Duration= 1.5;
      training1.Description= 'Een intensieve krachttrainingssessie met focus op verschillende spiergroepen en gewichten.';
      training1.Location= 'Gym XYZ';
      training1.Places= 2;
      training1.UserId= currentUsers[0]._id; // Associate user1 with training1
      const newTraining = new this.trainingModel(training1);
      await newTraining.save();
  
      const training3 = new Training();
      training3.SessionName = 'Krachttraining';
      training3.Date = new Date('2023-11-15T10:00:00');
      training3.Duration = 1.5;
      training3.Description = 'Een intensieve krachttrainingssessie met focus op verschillende spiergroepen en gewichten.';
      training3.Location = 'Gym XYZ';
      training3.Places = 20;
      training3.UserId =currentUsers[0]._id; // Associate user1 with training1
      const newTraining3 = new this.trainingModel(training3);
      await newTraining3.save();

      const training2 = new Training();
      training2.SessionName = 'Yoga';
      training2.Date = new Date('2023-11-16T18:30:00');
      training2.Duration = 1.0;
      training2.Description = 'Een ontspannende yogasessie om flexibiliteit, balans en innerlijke rust te bevorderen.';
      training2.Location = 'Yoga Studio ABC';
      training2.Places = 15;
      training2.UserId = currentUsers[0]._id; // Associate user2 with training2
      const newTraining2 = new this.trainingModel(training2);
      await newTraining2.save();
      
  
    }
    
    async getAll() :Promise<Training[]>{
        Logger.log("GetAll", this.TAG)
        return this.trainingModel.find().exec();
    }

    async getOne(id: string): Promise<Training | null> {
        Logger.log(`getOne(${id})`, this.TAG);
        return await this.trainingModel.findOne({ _id: id }).exec();

    }

    async getOneWithUser(id: string): Promise<ITraining | null> {
      Logger.log(`getOne(${id})`, this.TAG);
      const training = await this.trainingModel.findById(id).exec();
    
      if (!training) {
        throw new NotFoundException(`Training with ID ${id} not found`);
      }
    
      // Haal de gebruikersgegevens op op basis van de userId van de training
      const user = await this.userService.getOne(training.UserId);
    
      if (!user) {
        throw new NotFoundException(`User with ID ${training.UserId} not found`);
      }
    
      // Creëer een instantie van ITraining en stel de Trainer-eigenschap in op de opgehaalde gebruiker
      const trainingWithUser: ITraining = {
        ...training.toObject(),
        User: user,
      };
    
      return trainingWithUser;
    }
    

    async create(training: Training): Promise<Training> {
      Logger.log('create', this.TAG);
    
        const newTraining: Training = {
          ...training,
        }
    
        // Save the new training to the database using the Mongoose model
        const trainingModel = new this.trainingModel(newTraining);
        await trainingModel.save();
    
        return newTraining;
     
    }
    
    

    async update(updatedTraining: UpdateTrainingDto, id: string): Promise<Training> {
      Logger.log(`Update training with ID ${id}`, 'TrainingService');
    
      // Find the training in the database
      const existingTraining = await this.trainingModel.findById(id).exec();
    
      if (!existingTraining) {
        Logger.error(`Training with ID ${id} not found`, undefined, 'TrainingService');
        throw new NotFoundException(`Training could not be found!`);
      }
    
      // Update the training properties
      existingTraining.SessionName = updatedTraining.SessionName ?? existingTraining.SessionName;
      existingTraining.Description = updatedTraining.Description ?? existingTraining.Description;
    
      // Save the updated training to the database
      await existingTraining.save();
    
      Logger.log('Training updated successfully', 'TrainingService');
      return existingTraining.toObject();
    }
    

  // delete(id: string): string {
  //     Logger.log(`Delete training - ${id}`, 'TrainingService');

  //     const currentTrainings = this.training$.value;
  //     const trainingIndex = currentTrainings.findIndex((t) => t._id === id);

  //     if (trainingIndex === -1) {
  //         Logger.error(`Training with ID ${id} not found`, undefined, 'TrainingService');
  //         throw new NotFoundException(`Training could not be found!`);
  //     }

  //     // Remove the training from the array
  //     const deletedTraining = currentTrainings.splice(trainingIndex, 1)[0];

  //     // Update the BehaviorSubject with the modified array
  //     this.training$.next([...currentTrainings]);

  //     Logger.log('Training deleted successfully', 'TrainingService');
  //     return `Training ${deletedTraining.SessionName} deleted`;
  // }
}