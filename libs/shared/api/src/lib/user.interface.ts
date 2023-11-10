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