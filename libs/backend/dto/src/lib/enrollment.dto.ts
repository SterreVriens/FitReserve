import {
    IsNotEmpty,
    IsString,
    IsEnum,
  } from 'class-validator';
  
  import {
    ICreateEnrollment,
    IUpdateEnrollment,
    Id,
    Level,
  } from '@fit-reserve/shared/api';
  
  export class CreateEnrollmentDto implements ICreateEnrollment {
    _id!: Id;
  
    @IsString()
    @IsNotEmpty()
    TrainingId!: string;
  
    @IsString()
    @IsNotEmpty()
    UserId!: string;
  
    @IsEnum(Level)
    @IsNotEmpty()
    Level!: Level;
  }
  
  export class UpdateEnrollmentDto implements IUpdateEnrollment {
  
    @IsEnum(Level)
    @IsNotEmpty()
    Level!: Level;
  }
  