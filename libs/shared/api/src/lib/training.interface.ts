import { Id } from './id.type';
import {IUser} from './user.interface'
import {ILocation} from './location.interface'

export interface ITraining{
    _id: Id;
    SessionName?: string;
    Date?: Date;
    Duration?: number;
    Description?: string;
    LocationId: string;
    Location?: ILocation;
    Places?: number;
    IsEnrolled?: boolean;
    AmountEnrolled?: number;
    UserId: string;
    User?: IUser;
}

export type ICreateTraining = Pick<
    ITraining,'SessionName' | 'Description' | 'Date' | 'Duration'| 'LocationId'| 'Places'| 'UserId'
>;
export type IUpdateTraining= Partial<Omit<ITraining, '_id'>>;