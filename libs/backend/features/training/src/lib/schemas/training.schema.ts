// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { User } from "@fit-reserve/backend/features";
import { ITraining } from "@fit-reserve/shared/api";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsMongoId } from "class-validator";
import * as mongoose from 'mongoose';
import { HydratedDocument } from "mongoose";


export type TrainingDocument = HydratedDocument<Training>

@Schema()
export class Training implements ITraining{
    @IsMongoId()
    _id!: string;

    @Prop({required:true})
    SessionName! :string;

    @Prop({required:true})
    Description! :string;

    @Prop()
    Date!: Date;

    @Prop()
    Duration!: number;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Location' })
    LocationId!: string;

    @Prop()
    Places!: number;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    UserId!: string;

}

export const TrainingSchema = SchemaFactory.createForClass(Training);
