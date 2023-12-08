
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { jwtConstants } from './constants';
import { APP_GUARD } from "@nestjs/core";
import { AuthGuard } from "./auth.guard";
import {ConfigModule} from "@nestjs/config";
import { UserModule } from '@fit-reserve/backend/features';
//import { RecommendationsModule } from '@fit-reserve/backend/features/recommendation';

@Module({
  imports: [
    ConfigModule,
    //RecommendationsModule,
    UserModule, 
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '3600s' },
    }),
  ],
  providers: [AuthService, { provide: APP_GUARD, useClass: AuthGuard }],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
