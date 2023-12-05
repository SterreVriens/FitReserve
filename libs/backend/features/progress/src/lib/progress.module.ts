import { Module } from '@nestjs/common';
import { ProgressController } from './progress.controller';
import { Progress, ProgressSchema } from './schemas/progres.schema';
import { User, UserSchema, UserService } from '@fit-reserve/backend/features';
import { Training, TrainingSchema, TrainingService } from '@fit-reserve/backend/features/training';
import { MongooseModule } from '@nestjs/mongoose';
import { ProgressService } from './progress.service';
import { Enrollment, EnrollmentSchema, EnrollmentService } from '@fit-reserve/backend/features/enrollment';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Progress.name, schema: ProgressSchema }]),
    MongooseModule.forFeature([{ name: Training.name, schema: TrainingSchema }]),
    MongooseModule.forFeature([{ name: Enrollment.name, schema: EnrollmentSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
  ],
  controllers: [ProgressController],
  providers: [ProgressService,UserService,TrainingService,EnrollmentService],
  exports: [ProgressService,
    MongooseModule.forFeature([{ name: Progress.name, schema: ProgressSchema }])
  ],
})
export class ProgressModule {}
