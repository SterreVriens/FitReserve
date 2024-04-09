import { Injectable, Logger } from "@nestjs/common";
import { Model } from "mongoose";
import { Location } from "./schemas/location.schemas";
import { InjectModel } from "@nestjs/mongoose";
import { ICreateLocation } from "@fit-reserve/shared/api";



@Injectable()
export class LocationService {
    
    TAG = 'LocationService';
    
    constructor(
        @InjectModel(Location.name) private locationModel: Model<Location>,
    ){}

    async getAll() :Promise<Location[]> {
        Logger.log("GetAll", this.TAG)
        return this.locationModel.find().exec();
    }

    async getOne(id: string): Promise<Location | null> {
        Logger.log(`getOne(${id})`, this.TAG);
        return await this.locationModel.findOne({ _id: id }).exec();
    }

    async create(location: ICreateLocation): Promise<Location | null> {
        Logger.log('create', this.TAG);
        return this.locationModel.create(location);
    }
}