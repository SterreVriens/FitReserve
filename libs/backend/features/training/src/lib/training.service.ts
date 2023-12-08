/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, NotFoundException } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { Training } from './schemas/training.schema';
import { InjectModel } from '@nestjs/mongoose';
import {UserService} from '@fit-reserve/backend/features';
import { Model } from 'mongoose';
import { ICreateTraining, ITraining } from '@fit-reserve/shared/api';
import { UpdateTrainingDto } from '@fit-reserve/backend/dto';
import { RecommendationService } from "@fit-reserve/backend/features/recommendation";


@Injectable()
export class TrainingService{
    TAG = 'TrainingService';

    constructor(
      private readonly recommendationsService: RecommendationService,
      @InjectModel(Training.name) private trainingModel: Model<Training>,
      private userService: UserService){}
    
    
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
    

    async create(training: ICreateTraining): Promise<ITraining|null> {
      Logger.log('create', this.TAG);
      const t = await this.trainingModel.create(training)
     
      const neo4jR = await this.recommendationsService.createOrUpdateTraining(t);

      if (!neo4jR) {
      await this.trainingModel.findByIdAndDelete(t._id).exec();
      return null;
      }
      return t.toObject();
    }
    
    

    async update(updatedTraining: UpdateTrainingDto, id: string): Promise<Training|null> {
      Logger.log(`Update training with ID ${id}`, 'TrainingService');
    
      const existingTraining = await this.trainingModel.findById(id).exec();
    
      if (!existingTraining) {
        Logger.error(`Training with ID ${id} not found`, undefined, 'TrainingService');
        throw new NotFoundException(`Training could not be found!`);
      }
    
      existingTraining.SessionName = updatedTraining.SessionName ?? existingTraining.SessionName;
      existingTraining.Description = updatedTraining.Description ?? existingTraining.Description;
    
      await existingTraining.save();
    
      Logger.log('Training updated successfully', 'TrainingService');

      const neo4jR = await this.recommendationsService.createOrUpdateTraining(existingTraining);

      if (!neo4jR) {
      await this.trainingModel.findByIdAndDelete(existingTraining._id).exec();
        return null;
      }

      return existingTraining.toObject();
    }
    

    async delete(id: string): Promise<string> {
      Logger.log(`Delete training - ${id}`, 'TrainingService');
    
      try {

        const result = await this.trainingModel.deleteOne({ _id: id }).exec();
    
        if (result.deletedCount === 0) {
          Logger.error(`Training with ID ${id} not found`, undefined, 'TrainingService');
          throw new NotFoundException(`Training could not be found!`);
        }
    
        Logger.log('Training deleted successfully', 'TrainingService');

        const n4jResult = this.recommendationsService.deleteTraining(id);

        if (!n4jResult) {
          throw new Error('Could not delete hour scheme');
        }

        return `Training with ID ${id} deleted successfully`;
      } catch (error) {
        Logger.error(`Error deleting training with ID ${id}`, error, 'TrainingService');
        throw new Error('An error occurred while deleting the training');
      }
    }
    
}