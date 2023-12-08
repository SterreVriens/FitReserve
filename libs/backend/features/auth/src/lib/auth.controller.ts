/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpException,
    HttpStatus,
    Post,
    Request,
    UseGuards
  } from '@nestjs/common';
  import { AuthGuard } from './auth.guard';
  import { AuthService } from './auth.service';
  import { Public } from "./decorators/public.decorator";
  import { IUser, Role } from '@fit-reserve/shared/api';
  import { Roles } from './decorators/roles.decorator';
  //import { RolesGuard } from './roles.guard';


  
  @Controller('auth')
  export class AuthController {
    constructor(private authService: AuthService) {}
  
    @HttpCode(HttpStatus.OK)
    @Public()
    @Post('login')
    signIn(@Body() signInDto: Record<string, any>) {
      return this.authService.signIn(signInDto['UserName'], signInDto['Password']);
    }

    

    @Public()
    @Post('register')
    async register(@Body() user: Record<string, any>): Promise<IUser> {
        try {
            const newUser = await this.authService.registerUser({
                UserName: user['UserName'],
                Password: user['Password'],
                Role: user['Role'],
            });

            return newUser;
        } catch (e) {
            throw new HttpException('Registration failed', HttpStatus.BAD_REQUEST);
        }
    }

    @UseGuards(AuthGuard) // Add RolesGuard here
    @Get('profile')
    @Roles(Role.Trainer)
    getProfile(@Request() req: any) {
      console.log(req.user); // Check the user object in the console
      return req.user;
    }
    
  }
  