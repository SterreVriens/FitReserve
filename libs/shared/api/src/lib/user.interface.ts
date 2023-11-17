import { Id } from './id.type';

export enum Role{
    Trainer = "Trainer",
    Trainee = "Trainee"
}
export interface IUser{
    id: Id;
    UserName: string;
    Password: string;
    Date: Date;
    Role: Role;
}

export type ICreateUser = Pick<
    IUser,
    'id'| 'UserName' | 'Password' | 'Role' 
>;
export type IUpdateUser= Partial<Omit<IUser, 'id'>>;
export type IUpsertUser = IUser;