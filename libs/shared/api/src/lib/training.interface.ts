import { Id } from './id.type';

export interface ITraining{
    id: Id;
    SessionName: string;
    Date: Date;
    Duration: Float32Array;
    Description: string;
    Location: string;
    Places: Int16Array;
    //Trainer: User;
}