import { Module } from '@nestjs/common';
import { EnrollmentController } from './enrollment.controller';
import { User, UserSchema, UserService ,} from '@fit-reserve/backend/features';
import { MongooseModule } from '@nestjs/mongoose';
import { Training, TrainingSchema, TrainingService } from '@fit-reserve/backend/features/training';
import { Enrollment, EnrollmentSchema } from './schemas/enrollment.schemas';
import { EnrollmentService } from './enrollment.service';
import { RecommendationsModule } from '@fit-reserve/backend/features/recommendation';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Enrollment.name, schema: EnrollmentSchema }]),
    MongooseModule.forFeature([{ name: Training.name, schema: TrainingSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    RecommendationsModule
  ],
  controllers: [EnrollmentController],
  providers: [EnrollmentService,UserService,TrainingService],
  exports: [
    EnrollmentService,
    MongooseModule.forFeature([{ name: Enrollment.name, schema: EnrollmentSchema }])
  ],
})
export class EnrollmentModule {}
