import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from '@fit-reserve/backend/features';
import { TrainingModule } from '@fit-reserve/backend/features/training';
// import {ConfigService, ConfigModule} from "@nestjs/config";
import { MongooseModule } from '@nestjs/mongoose';


@Module({
  imports: 
    [UserModule, 
    TrainingModule,
    //ConfigModule.forRoot({isGlobal:true}),
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/Fit-Reserve-Data-api')
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
