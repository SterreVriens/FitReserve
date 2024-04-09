import { Module } from '@nestjs/common';
import { TrainingController } from './training.controller';
import { TrainingService } from './training.service';
import { Training, TrainingSchema } from './schemas/training.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema, UserService } from '@fit-reserve/backend/features';
import { RecommendationsModule } from '@fit-reserve/backend/features/recommendation';
import { LocationSchema, Location } from '@fit-reserve/backend/features/location';
import {LocationService} from '@fit-reserve/backend/features/location';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: Training.name, schema: TrainingSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Location.name, schema: LocationSchema }]),
    RecommendationsModule
  ],
  controllers: [TrainingController],
  providers: [TrainingService, UserService, LocationService],
  exports: [TrainingService, MongooseModule.forFeature([{ name: Training.name, schema: TrainingSchema }])],
})
export class TrainingModule {}
