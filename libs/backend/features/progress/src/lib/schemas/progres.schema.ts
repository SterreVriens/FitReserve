import { Prop, SchemaFactory,Schema } from "@nestjs/mongoose";
import { IsMongoId } from "class-validator";
import * as mongoose from 'mongoose';
import { HydratedDocument } from "mongoose";

export type ProgressDocument = HydratedDocument<Progress>

@Schema()
export class Progress{
    @IsMongoId()
    _id!: string;

    @Prop({required:true})
    Weight! :number;

    @Prop({required:true})
    Reps! :number;

    @Prop()
    Date?: Date;

    @Prop()
    Duration!: number;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Training' })
    TrainingId!: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    UserId!: string;

}

export const ProgressSchema = SchemaFactory.createForClass(Progress);