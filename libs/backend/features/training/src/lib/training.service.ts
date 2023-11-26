import { Injectable, NotFoundException } from '@nestjs/common';
import { ITraining } from '@fit-reserve/shared/api';
import { BehaviorSubject} from 'rxjs';
import { Logger } from '@nestjs/common';


@Injectable()
export class TrainingService{
    TAG = 'TrainingService';

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

    
    getAll() :ITraining[]{
        Logger.log("GetAll", this.TAG)
        return this.training$.value;
    }

    getOne(id: string): ITraining {
        Logger.log(`getOne(${id})`, this.TAG);
        const meal = this.training$.value.find((td) => td.id === id);
        if (!meal) {
            throw new NotFoundException(`Training could not be found!`);
        }
        return meal;
    }

    create(t: Pick<ITraining,  'SessionName' | 'Description' | 'Date'>): ITraining {
      Logger.log('create', this.TAG);
      const current = this.training$.value;
  
      // Use the incoming data, a randomized ID, and default values for other fields
      const newT: ITraining = {
        id: `user-${Math.floor(Math.random() * 10000)}`,
        SessionName: t.SessionName || '', // Use the provided value or default to an empty string
        Description: t.Description || '', // Use the provided value or default to an empty string
        Date: t.Date,
        Duration: new Float32Array([1.75]),
        Location: 'HIIT Arena',
        Places: new Int16Array([25])
      };
  
      this.training$.next([...current, newT]);
      return newT;
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