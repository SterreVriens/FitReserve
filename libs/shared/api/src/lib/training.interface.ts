import { Id } from './id.type';
import {IUser} from './user.interface'

export interface ITraining{
    _id: Id;
    SessionName?: string;
    Date?: Date;
    Duration?: number;
    Description?: string;
    Location?: string;
    Places?: number;
    IsEnrolled?: boolean;
    UserId: string;
    User?: IUser;
}

export type ICreateTraining = Pick<
    ITraining,'SessionName' | 'Description' | 'Date' | 'Duration'| 'Location'| 'Places'| 'UserId'
>;
export type IUpdateTraining= Partial<Omit<ITraining, '_id'>>;