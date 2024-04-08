import { Module } from '@nestjs/common';
import { LocationController } from './location.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { LocationSchema } from './schemas/location.schemas';
import { LocationService } from './location.service';
import { Location } from "./schemas/location.schemas";


@Module({
  imports: [MongooseModule.forFeature([{ name: Location.name, schema: LocationSchema }])],
  controllers: [LocationController],
  providers: [LocationService],
  exports: [LocationService, MongooseModule.forFeature([{ name: Location.name, schema: LocationSchema }])],
})
export class LocationModule {}
