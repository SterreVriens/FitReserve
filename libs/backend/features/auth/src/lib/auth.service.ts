import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { JwtService } from '@nestjs/jwt';
import { UserService } from "@fit-reserve/backend/features";
import { IUser, Role } from "@fit-reserve/shared/api";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "@fit-reserve/backend/features";
import * as bcrypt from 'bcrypt';
// import { RecommendationService } from "@fit-reserve/backend/features/recommendation";


@Injectable()
export class AuthService {
  TAG = 'AuthService';
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    //private readonly recommendationsService: RecommendationService,
    @InjectModel(User.name) private userModel: Model<User>
  ) {}

  async signIn(username: string, pass: string) {

    const user = await this.usersService.getOneWithName(username);
  
    Logger.log(`username: ${username} trying to authenticate...`);
  
    if (!user || !await this.validatePassword(pass, user.Password ?? null)) {
        Logger.log('No valid user')
        throw new UnauthorizedException();
    }
  
    const payload = { sub: user._id, username: user.UserName ,Role: user.Role};
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
  
  async registerUser(user: Pick<IUser, 'UserName' | 'Password' | 'Role'>): Promise<IUser|null> {
    const generatedHash = await this.generateHashedPassword(user.Password ?? null);
  
    const newUser: IUser = {
      UserName: user.UserName || '',
      Password: generatedHash,
      Role: user.Role || Role.Trainee,
      Date: new Date(),
    };
  
    const userModel = new this.userModel(newUser);
    const savedUser = await userModel.save();

    // const n4jResult = await this.recommendationsService.createOrUpdateUser(savedUser);

    // if (!n4jResult) {
    //   await this.userModel.findByIdAndDelete(savedUser._id).exec();
    //   return null;
    // }
  
    return savedUser.toObject();

  }
  


  async generateHashedPassword(plainTextPassword: string | null): Promise<string> {
    if (plainTextPassword === null || plainTextPassword === undefined) {
        throw new Error('Plain text password cannot be null or undefined.');
    }

    const saltOrRounds = 10;
    return await bcrypt.hash(plainTextPassword, saltOrRounds);
}

  async validatePassword(givenPassword: string, passwordHash: string): Promise<boolean> {
    return await bcrypt.compare(givenPassword, passwordHash);
  }
    
  
}
