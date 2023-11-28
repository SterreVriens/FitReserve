import { Module } from '@nestjs/common';
import { TrainingController } from './training.controller';
import { TrainingService } from './training.service';
import { Training, TrainingSchema } from './schemas/training.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([{ name: Training.name, schema: TrainingSchema }])],
  controllers: [TrainingController],
  providers: [TrainingService],
  exports: [TrainingService, MongooseModule.forFeature([{ name: Training.name, schema: TrainingSchema }])], // Export UserModel
})
export class TrainingModule {}
