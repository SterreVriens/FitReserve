import { Module } from '@nestjs/common';
import { DataSeederService } from './data-seeder.service';
import { RecommendationsModule } from '@fit-reserve/backend/features/recommendation';
import { MongooseModule } from '@nestjs/mongoose';
import { Enrollment, EnrollmentModule, EnrollmentSchema } from '@fit-reserve/backend/features/enrollment';
import { Training, TrainingModule, TrainingSchema } from '@fit-reserve/backend/features/training';
import { User, UserModule, UserSchema } from '@fit-reserve/backend/features';
import { Progress, ProgressModule, ProgressSchema } from '@fit-reserve/backend/features/progress';
import { Location, LocationModule, LocationSchema } from '@fit-reserve/backend/features/location';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Enrollment.name, schema: EnrollmentSchema },
      { name: Training.name, schema: TrainingSchema },
      { name: User.name, schema: UserSchema },
      { name: Progress.name, schema: ProgressSchema },
      { name: Location.name, schema: LocationSchema },
    ]),
    RecommendationsModule,
    UserModule,
    EnrollmentModule,
    ProgressModule,
    TrainingModule,
    LocationModule
  ],
  providers: [DataSeederService],
  exports: [DataSeederService],
})
export class DataSeederModule {}
