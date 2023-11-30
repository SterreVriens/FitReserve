import { Module } from '@nestjs/common';
import { TrainingController } from './training.controller';
import { TrainingService } from './training.service';
import { Training, TrainingSchema } from './schemas/training.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema, UserService } from '@fit-reserve/backend/features';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: Training.name, schema: TrainingSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
  ],
  controllers: [TrainingController],
  providers: [TrainingService, UserService],
  exports: [TrainingService, MongooseModule.forFeature([{ name: Training.name, schema: TrainingSchema }])],
})
export class TrainingModule {}
