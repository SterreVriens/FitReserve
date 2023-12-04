import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsMongoId, IsEnum } from "class-validator";
import * as mongoose from 'mongoose';
import { HydratedDocument } from "mongoose";
import { Level } from "@fit-reserve/shared/api";

export type EnrollmentDocument = HydratedDocument<Enrollment>;

@Schema()
export class Enrollment {
  @IsMongoId()
  _id!: string;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Training' })
  TrainingId!: string;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  UserId!: string;

  @Prop({ required: true , type: String})
  @IsEnum(Level)
  Level!: Level;

}

export const EnrollmentSchema = SchemaFactory.createForClass(Enrollment);
