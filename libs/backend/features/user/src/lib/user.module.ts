import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User, UserSchema } from './schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
//import { RecommendationsModule } from '@fit-reserve/backend/features/recommendation';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService, MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])], 
})
export class UserModule {}
