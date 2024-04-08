import { Id } from "./id.type";

export interface ILocation {
    _id?: Id;
    Name?: string;
    Description?: string;
    Address?: string;
    City?: string;
    Country?: string;
}

export type ICreateLocation = Pick<ILocation, 'Name' | 'Description' | 'Address' | 'City' | 'Country'>;