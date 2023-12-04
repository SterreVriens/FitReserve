import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from '@fit-reserve/backend/features';
import { TrainingModule } from '@fit-reserve/backend/features/training';
// import {ConfigService, ConfigModule} from "@nestjs/config";
import { MongooseModule } from '@nestjs/mongoose';
import{AuthModule} from '@fit-reserve/backend/features/auth'
import { EnrollmentModule } from '@fit-reserve/backend/features/enrollment';

@Module({
  imports: 
    [UserModule, 
    TrainingModule,
    AuthModule,
    EnrollmentModule,
    //ConfigModule.forRoot({isGlobal:true}),
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/fit-reserve-data-api')
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
