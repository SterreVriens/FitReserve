import { Id } from './id.type';
import { ITraining } from './training.interface';
import {IUser} from './user.interface'

export enum Level{
    Beginner = "Beginner",
    Intermediate = "Intermediate",
    Experienced = "Experienced"
}

export interface IEnrollment{
    _id: Id;
    TrainingId: string;
    UserId: string;
    Level: Level;
    User?: IUser;
    Training?: ITraining;
}

export type ICreateEnrollment = Pick<
    IEnrollment,
    '_id'| 'TrainingId' | 'UserId' | 'Level'
>;
export type IUpdateEnrollmen= Partial<Omit<IEnrollment, '_id'>>;