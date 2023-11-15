import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from '@fit-reserve/backend/features';
import { TrainingModule } from '@fit-reserve/backend/features/training';


@Module({
  imports: [UserModule,TrainingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
