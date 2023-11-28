import { Injectable, NotFoundException } from '@nestjs/common';
import { ITraining, Role } from '@fit-reserve/shared/api';
import { BehaviorSubject} from 'rxjs';
import { Logger } from '@nestjs/common';
import { Training } from './schemas/training.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import{UserService} from '../../../user/src/lib/user.service';

@Injectable()
export class TrainingService{
    TAG = 'TrainingService';

    constructor(
      @InjectModel(Training.name) private trainingModel: Model<Training>,
      private userService: UserService){
      this.seedDb()
      }
    

    async seedDb() {
      const currentUsers = await this.getAll();
      if (currentUsers.length > 0) {
        Logger.log('db already seeded');
        return;
      }
      Logger.log('seeding db');
      
      const training1= new Training();
      training1.SessionName= 'Krachttraining';
      training1.Date= new Date('2023-11-15T10:00:00');
      training1.Duration= 1.5;
      training1.Description= 'Een intensieve krachttrainingssessie met focus op verschillende spiergroepen en gewichten.';
      training1.Location= 'Gym XYZ';
      training1.Places= 20;
      training1.userId= new mongoose.Types.ObjectId(123456789);; // Associate user1 with training1
      const newTraining = new this.trainingModel(training1);
      await newTraining.save();
  
      const training3 = new Training();
      training3.SessionName = 'Krachttraining';
      training3.Date = new Date('2023-11-15T10:00:00');
      training3.Duration = 1.5;
      training3.Description = 'Een intensieve krachttrainingssessie met focus op verschillende spiergroepen en gewichten.';
      training3.Location = 'Gym XYZ';
      training3.Places = 20;
      training3.userId = new mongoose.Types.ObjectId(123456789); // Associate user1 with training1
      const newTraining3 = new this.trainingModel(training3);
      await newTraining3.save();

      const training2 = new Training();
      training2.SessionName = 'Yoga';
      training2.Date = new Date('2023-11-16T18:30:00');
      training2.Duration = 1.0;
      training2.Description = 'Een ontspannende yogasessie om flexibiliteit, balans en innerlijke rust te bevorderen.';
      training2.Location = 'Yoga Studio ABC';
      training2.Places = 15;
      training2.userId = new mongoose.Types.ObjectId(123456789);; // Associate user2 with training2
      const newTraining2 = new this.trainingModel(training2);
      await newTraining2.save();
      
  
    }

    private training$ = new BehaviorSubject<ITraining[]>([
        {
          id: '1',
          SessionName: 'Krachttraining',
          Date: new Date('2023-11-15T10:00:00'),
          Duration: new Float32Array([1.5]),
          Description: 'Een intensieve krachttrainingssessie met focus op verschillende spiergroepen en gewichten.',
          Location: 'Gym XYZ',
          Places: new Int16Array([20]),
        },
        {
          id: '2',
          SessionName: 'Yoga',
          Date: new Date('2023-11-16T18:30:00'),
          Duration: new Float32Array([1.0]),
          Description: 'Een ontspannende yogasessie om flexibiliteit, balans en innerlijke rust te bevorderen.',
          Location: 'Yoga Studio ABC',
          Places: new Int16Array([15]),
        },
        {
          id: '3',
          SessionName: 'Cardio Workout',
          Date: new Date('2023-11-17T09:00:00'),
          Duration: new Float32Array([1.25]),
          Description: 'Een energieke cardiotraining met diverse oefeningen om de hartslag te verhogen en calorieën te verbranden.',
          Location: 'Fitness Center 123',
          Places: new Int16Array([25]),
        },
        {
          id: '4',
          SessionName: 'HIIT Training',
          Date: new Date('2023-11-18T17:15:00'),
          Duration: new Float32Array([1.75]),
          Description: 'High-Intensity Interval Training (HIIT) met afwisselende periodes van intense inspanning en korte rustperiodes.',
          Location: 'HIIT Arena',
          Places: new Int16Array([10]),
        },
      ]);

    
    async getAll() :Promise<Training[]>{
        Logger.log("GetAll", this.TAG)
        return this.trainingModel.find().exec();
    }

    async getOne(id: string): Promise<Training | null> {
        Logger.log(`getOne(${id})`, this.TAG);
        return await this.trainingModel.findOne({ _id: id }).exec();

    }

    async create(training: Training, username: string): Promise<Training> {
      Logger.log('create', this.TAG);
    
      // Retrieve the user by username
      const user = await this.userService.getOne(username); // You need to implement this method in your UserService
    
      // Check if the user has the required role
      if (user && user.Role === Role.Trainer) {
        // Use the incoming data, a randomized ID, and values provided by the user
        const newTraining: Training = {
          ...training,
        };
    
        // Save the new training to the database using the Mongoose model
        const trainingModel = new this.trainingModel(newTraining);
        await trainingModel.save();
    
        return newTraining;
      } else {
        throw new NotFoundException('User not found or does not have the required role');
      }
    }
    
    

  update(updatedTraining: Pick<ITraining, 'SessionName' | 'Description'>, id: string): ITraining {
    Logger.log(`Update training with ID ${id}`, 'TrainingService');

    const currentTrainings = this.training$.value;
    const trainingIndex = currentTrainings.findIndex((t) => t.id === id);

    if (trainingIndex === -1) {
        Logger.error(`Training with ID ${id} not found`, undefined, 'TrainingService');
        throw new NotFoundException(`Training could not be found!`);
    }

    // Update the training properties
    const updatedTrainingData: ITraining = {
        ...currentTrainings[trainingIndex],
        SessionName: updatedTraining.SessionName || currentTrainings[trainingIndex].SessionName,
        Description: updatedTraining.Description || currentTrainings[trainingIndex].Description,
    };

    // Update the BehaviorSubject with the modified array
    currentTrainings[trainingIndex] = updatedTrainingData;
    this.training$.next([...currentTrainings]);

    Logger.log('Training updated successfully', 'TrainingService');
    return updatedTrainingData;
  }

  delete(id: string): string {
      Logger.log(`Delete training - ${id}`, 'TrainingService');

      const currentTrainings = this.training$.value;
      const trainingIndex = currentTrainings.findIndex((t) => t.id === id);

      if (trainingIndex === -1) {
          Logger.error(`Training with ID ${id} not found`, undefined, 'TrainingService');
          throw new NotFoundException(`Training could not be found!`);
      }

      // Remove the training from the array
      const deletedTraining = currentTrainings.splice(trainingIndex, 1)[0];

      // Update the BehaviorSubject with the modified array
      this.training$.next([...currentTrainings]);

      Logger.log('Training deleted successfully', 'TrainingService');
      return `Training ${deletedTraining.SessionName} deleted`;
  }
}