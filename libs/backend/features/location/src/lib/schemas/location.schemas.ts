import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsMongoId } from "class-validator";
import { HydratedDocument } from "mongoose";
import { ILocation } from "@fit-reserve/shared/api";

export type EnrollmentDocument = HydratedDocument<Location>;

@Schema()
export class Location implements ILocation{
    @IsMongoId()
    _id!: string;
    
    @Prop()	
    Name?: string;

    @Prop()
    Description?: string;

    @Prop()
    Address?: string;

    @Prop()
    City?: string;

    @Prop()
    Country?: string;
    
}

export const LocationSchema = SchemaFactory.createForClass(Location);