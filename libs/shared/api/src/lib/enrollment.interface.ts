import { Id } from './id.type';
import { ILocation } from './location.interface';
import { ITraining } from './training.interface';
import {IUser} from './user.interface'

export enum Level{
    Beginner = "Beginner",
    Intermediate = "Intermediate",
    Experienced = "Experienced"
}

export interface IEnrollment {
    _id?: Id;
    TrainingId: string;
    UserId: string;
    Level: Level;
    User?: IUser | null;
    Training?: ITraining | null;
    Location?: ILocation | null;
}


export type ICreateEnrollment = Pick<
    IEnrollment,
    '_id'| 'TrainingId' | 'UserId' | 'Level'
>;
