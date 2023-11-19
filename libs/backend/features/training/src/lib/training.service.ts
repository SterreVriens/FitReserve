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

}