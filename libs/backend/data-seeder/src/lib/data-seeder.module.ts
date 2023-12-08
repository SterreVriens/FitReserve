import { Module } from '@nestjs/common';
import { DataSeederService } from './data-seeder.service';
import { RecommendationsModule } from '@fit-reserve/backend/features/recommendation';
import { MongooseModule } from '@nestjs/mongoose';
import { Enrollment, EnrollmentSchema } from '@fit-reserve/backend/features/enrollment';
import { Training, TrainingSchema } from '@fit-reserve/backend/features/training';
import { User, UserSchema } from '@fit-reserve/backend/features';
import { Progress, ProgressSchema } from '@fit-reserve/backend/features/progress';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Enrollment.name, schema: EnrollmentSchema },
      { name: Training.name, schema: TrainingSchema },
      { name: User.name, schema: UserSchema },
      { name: Progress.name, schema: ProgressSchema }
    ]),
    RecommendationsModule
  ],
  providers: [DataSeederService],
  exports: [DataSeederService],
})
export class DataSeederModule {}
