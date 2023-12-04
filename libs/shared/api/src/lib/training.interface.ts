import { Id } from './id.type';
import {IUser} from './user.interface'

export interface ITraining{
    _id: Id;
    SessionName?: string;
    Date?: Date;
    Duration?: Float32Array;
    Description?: string;
    Location?: string;
    Places?: Int16Array;
    UserId: string;
    User?: IUser;
}

export type ICreateTraining = Pick<
    ITraining,
    '_id'| 'SessionName' | 'Description' | 'Date' 
>;
export type IUpdateTraining= Partial<Omit<ITraining, '_id'>>;