import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from '@fit-reserve/backend/features';
import { TrainingModule } from '@fit-reserve/backend/features/training';
import {ConfigService, ConfigModule} from "@nestjs/config";
import { MongooseModule } from '@nestjs/mongoose';
import{AuthModule} from '@fit-reserve/backend/features/auth'
import { EnrollmentModule } from '@fit-reserve/backend/features/enrollment';
import { ProgressModule } from '@fit-reserve/backend/features/progress';
import { DataSeederModule } from '@fit-reserve/backend/data-seeder';

@Module({
  imports: 
    [
    DataSeederModule,
    UserModule, 
    TrainingModule,
    AuthModule,
    EnrollmentModule,
    ProgressModule,
    ConfigModule.forRoot({isGlobal:true}),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri:
          configService.get<string>('MONGO_URI') ||
          'mongodb://127.0.0.1:27017/fit-reserve-data-api',
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
