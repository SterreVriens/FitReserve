import { Role } from '@fit-reserve/shared/api';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsMongoId } from 'class-validator';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>

@Schema()
export class User{
    @IsMongoId()
    _id!: string;

    @Prop({required:true})
    UserName!: string;

    @Prop({required:true})
    Password!: string;

    @Prop()
    Date!: Date;

    @Prop({ type: String, enum: Role, default: Role.Trainee }) 
    Role!: Role;
}

export const UserSchema = SchemaFactory.createForClass(User);