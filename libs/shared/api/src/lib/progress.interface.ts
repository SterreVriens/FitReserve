import { Id } from './id.type';
import { ITraining } from './training.interface';
import { IUser } from './user.interface';

export interface IProgress{
    _id?: Id;
    Weight: number;
    Reps: number;
    Duration: number;
    Date: Date;
    TrainingId: string;
    UserId: string;
    User: IUser | null;
    Training: ITraining | null;
}

export type ICreateProgress = Pick<
    IProgress,
    '_id'| 'TrainingId' | 'UserId' | 'Weight' | 'Reps' | 'Duration'
>;
